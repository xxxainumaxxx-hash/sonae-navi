// アニメ版レンダラー（1秒12コマ＝手描きアニメの2コマ打ち）
//   node animate.mjs 03-nintendo            動画を作る
//   node animate.mjs 03-nintendo --check 4  4秒ごとに1枚だけ書き出して確認
// 声：voice/<話ID>/01.mp3 ... を置くと、その長さと音量で口パク・字幕を合わせる
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { defs, paper, setTheme } from './lib/crayon.mjs';
import { openShooter, svgDoc } from './lib/shot.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const epId = process.argv[2];
if (!epId) { console.error('例: node animate.mjs 03-nintendo'); process.exit(1); }
const ci = process.argv.indexOf('--check');
const checkEvery = ci > 0 ? parseFloat(process.argv[ci + 1] || '4') : 0;
const ep = await import(pathToFileURL(path.join(ROOT, 'episodes', `${epId}.mjs`)));
const FPS = 12, LEAD = 0.35, TAIL = 0.6;
const OUT = path.join(ROOT, 'out', epId), FR = path.join(OUT, checkEvery ? 'check' : 'anim');
const VOICE = path.join(ROOT, 'voice', epId);
fs.rmSync(FR, { recursive: true, force: true });
fs.mkdirSync(FR, { recursive: true });
fs.mkdirSync(VOICE, { recursive: true });
const pad = (n, w = 2) => String(n).padStart(w, '0');
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { maxBuffer: 1 << 28, ...opts });

fs.writeFileSync(path.join(VOICE, 'script.txt'), `${ep.meta.title}\n場面ごとに音声を作って、【】のファイル名でこのフォルダに保存してください。\n\n` +
  ep.scenes.map((s, i) => `【${pad(i + 1)}.mp3】\n${s.narration.join('')}\n`).join('\n'));

// ---------- タイムライン（声の長さ or 文字数から） ----------
let T0 = 0;
const tl = ep.scenes.map((sc, i) => {
  const voice = path.join(VOICE, `${pad(i + 1)}.mp3`);
  const has = fs.existsSync(voice);
  const chars = sc.narration.map((t) => t.length), total = chars.reduce((a, c) => a + c, 0);
  const speech = has ? parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]).toString()) : total / 7.5;
  const d = LEAD + speech + TAIL;
  const subs = []; let t = LEAD;
  sc.narration.forEach((line, k) => { const len = (chars[k] / total) * speech; subs.push({ line, from: t, to: t + len }); t += len; });
  // 口パク用の音量（1コマごと）
  let env = null;
  if (has) {
    const raw = sh('ffmpeg', ['-v', 'error', '-i', voice, '-ac', '1', '-ar', '12000', '-f', 's16le', '-']);
    const n = Math.floor(raw.length / 2), win = 12000 / FPS; env = [];
    for (let f = 0; f * win < n; f++) {
      let acc = 0, cnt = 0;
      for (let k = f * win; k < Math.min(n, (f + 1) * win); k++) { const v = raw.readInt16LE(k * 2) / 32768; acc += v * v; cnt++; }
      env.push(Math.sqrt(acc / Math.max(1, cnt)));
    }
    const mx = Math.max(...env, 1e-6); env = env.map((v) => Math.min(1, (v / mx) * 1.5));
  }
  const item = { i, sc, d, start: T0, subs, voice: has ? voice : null, env };
  T0 += d;
  return item;
});
const TOTAL = T0;

function mouthAt(s, t) {
  if (s.env) { const f = Math.floor((t - LEAD) * FPS); return f >= 0 && f < s.env.length ? (s.env[f] > 0.12 ? s.env[f] : 0) : 0; }
  const sub = s.subs.find((u) => t >= u.from && t < u.to - 0.08);
  if (!sub) return 0;
  const f = Math.floor(t * FPS);           // 声が無いときの仮の口パク
  return [0.9, 0.3, 0.7, 0, 1, 0.5, 0.2, 0.8, 0.4, 0][f % 10];
}

// ---------- コマを描く ----------
setTheme(ep.meta.theme || 'crayon');
const frames = [];
for (let f = 0; f < Math.ceil(TOTAL * FPS); f++) {
  const gt = f / FPS;
  if (checkEvery && Math.abs(gt / checkEvery - Math.round(gt / checkEvery)) > 0.5 / FPS / checkEvery) continue;
  frames.push(f);
}
function frameHtml(f) {
  const gt = f / FPS;
  const s = tl.find((x) => gt >= x.start && gt < x.start + x.d) || tl[tl.length - 1];
  const t = gt - s.start;
  const ctx = { d: s.d, mouth: mouthAt(s, t), at: (k) => s.subs[Math.min(k, s.subs.length - 1)].from, subs: s.subs };
  const boil = Math.floor(f / 3) % 3; // 1秒4回の線ゆれ
  const art = svgDoc(defs(boil) + paper() + s.sc.draw(t, ctx));
  const sub = s.subs.find((u) => t >= (u === s.subs[0] ? 0 : u.from) && t < u.to + (u === s.subs[s.subs.length - 1] ? TAIL : 0));
  return art + (sub ? `<div class="sub"><span>${sub.line}</span></div>` : '');
}

const W = Math.max(1, Math.min(4, os.cpus().length - 1));
console.log(`${ep.meta.title}：${TOTAL.toFixed(1)}秒 / ${frames.length}コマ / 並列${W}`);
let done = 0;
await Promise.all(Array.from({ length: W }, async (_, w) => {
  const { shot, close } = await openShooter(ROOT, path.join(OUT, `_w${w}`));
  for (let k = w; k < frames.length; k += W) {
    const f = frames[k];
    await shot(frameHtml(f), path.join(FR, checkEvery ? `t${pad(Math.round(f / FPS), 3)}.png` : `f${pad(f, 5)}.png`));
    if (++done % 60 === 0) console.log(`  ${done}/${frames.length}`);
  }
  await close();
}));
if (checkEvery) { console.log(`確認用: ${FR}`); process.exit(0); }

// ---------- 音声をつなぐ ----------
const aArgs = [], parts = [];
tl.forEach((s, k) => {
  if (s.voice) { aArgs.push('-i', s.voice); parts.push(`[${k}:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${Math.round(LEAD * 1000)}:all=1,apad,atrim=0:${s.d.toFixed(3)}[a${k}]`); }
  else { aArgs.push('-f', 'lavfi', '-t', s.d.toFixed(3), '-i', 'anullsrc=r=44100:cl=stereo'); parts.push(`[${k}:a]anull[a${k}]`); }
});
const audio = path.join(OUT, '_audio.m4a');
sh('ffmpeg', ['-y', '-v', 'error', ...aArgs, '-filter_complex', parts.join(';') + ';' + tl.map((_, k) => `[a${k}]`).join('') + `concat=n=${tl.length}:v=0:a=1[a]`,
  '-map', '[a]', '-c:a', 'aac', '-b:a', '160k', audio]);

const final = path.join(OUT, `${epId}.mp4`);
sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f%05d.png'), '-i', audio,
  '-vf', 'fps=30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', final]);
console.log(`完成: ${final}`);
