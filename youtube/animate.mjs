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
const FPS = 12;
// ショート：縦型・前後の間ゼロ・無音カット。ロング：横型
const SHORT = ep.meta.format === 'short';
const W = SHORT ? 1080 : 1920, H = SHORT ? 1920 : 1080;
const LEAD = SHORT ? 0.05 : 0.35, TAIL = SHORT ? 0.15 : 0.6;
const CPS = SHORT ? 8.5 : 7.5; // 声が無いときの読む速さ（文字/秒）
const OUT = path.join(ROOT, 'out', epId), FR = path.join(OUT, checkEvery ? 'check' : 'anim');
const VOICE = path.join(ROOT, 'voice', epId);
// --resume：描き出し済みのコマを残して続きから（途中で止まったとき用）
const RESUME = process.argv.includes('--resume');
if (!RESUME) fs.rmSync(FR, { recursive: true, force: true });
fs.mkdirSync(FR, { recursive: true });
fs.mkdirSync(VOICE, { recursive: true });
const pad = (n, w = 2) => String(n).padStart(w, '0');
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { maxBuffer: 1 << 28, ...opts });

fs.writeFileSync(path.join(VOICE, 'script.txt'), `${ep.meta.title}\n場面ごとに音声を作って、【】のファイル名でこのフォルダに保存してください。\n\n` +
  ep.scenes.map((s, i) => (s.narration || []).length ? `【${pad(i + 1)}.mp3】\n${s.narration.join('')}\n` : '').filter(Boolean).join('\n'));

// ---------- タイムライン（声の長さ or 文字数から） ----------
let T0 = 0;
const tl = ep.scenes.map((sc, i) => {
  sc.narration = sc.narration || [];
  let voice = path.join(VOICE, `${pad(i + 1)}.mp3`);
  const has = sc.narration.length > 0 && fs.existsSync(voice);
  // voice.py が作ったタイミング情報（各行の開始・終了秒）があれば、絵をそれにぴったり合わせる
  const tjson = path.join(VOICE, `${pad(i + 1)}.json`);
  const timing = has && fs.existsSync(tjson) ? JSON.parse(fs.readFileSync(tjson, 'utf8')) : null;
  if (has && SHORT && !timing) {
    // 0.3秒以上の無音（息継ぎ・間）をすべて詰める
    const tight = path.join(OUT, `_tight${pad(i + 1)}.wav`);
    sh('ffmpeg', ['-y', '-v', 'error', '-i', voice, '-af',
      'silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.3:stop_threshold=-45dB', tight]);
    voice = tight;
  }
  const chars = sc.narration.map((t) => t.length), total = chars.reduce((a, c) => a + c, 0);
  const speech = has ? parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]).toString()) : total / CPS;
  // 声の無い場面（章タイトルなど）は silent 秒だけ
  const d = sc.narration.length ? LEAD + speech + TAIL : (sc.silent || 2);
  // 長い文は句読点で字幕を分ける（ロング30字・ショート15字が目安）。at(k) は k 行目の最初の字幕の開始時刻
  const MAXC = SHORT ? 15 : 30;
  const split = (line) => {
    if (line.length <= MAXC) return [line];
    const parts = line.match(/[^、。！？」]+[、。！？」]*/g) || [line];
    const out = []; let cur = '';
    for (const p of parts) { if (cur && (cur + p).length > MAXC) { out.push(cur); cur = p; } else cur += p; }
    if (cur) out.push(cur);
    return out;
  };
  const subs = [], lineStart = []; let t = LEAD;
  sc.narration.forEach((line, k) => {
    lineStart.push(subs.length);
    const pieces = split(line);
    if (timing) {
      // 実際に読まれた時刻：この行の開始〜次の行の開始を、字幕の分割ぶんに割る
      const a = LEAD + timing.lines[k].start;
      const b = k + 1 < sc.narration.length ? LEAD + timing.lines[k + 1].start : LEAD + speech;
      let u = a;
      for (const piece of pieces) { const len = (piece.length / line.length) * (b - a); subs.push({ line: piece, from: u, to: u + len }); u += len; }
    } else {
      for (const piece of pieces) { const len = (piece.length / total) * speech; subs.push({ line: piece, from: t, to: t + len }); t += len; }
    }
  });
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
  const item = { i, sc, d, start: T0, subs, lineStart, voice: has ? voice : null, env };
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
// --frames 435,1552：指定したコマだけ描き出す（調べもの用）。HTMLも保存する
const fi = process.argv.indexOf('--frames');
const ONLY = fi > 0 ? process.argv[fi + 1].split(',').map(Number) : null;
for (let f = 0; f < Math.ceil(TOTAL * FPS); f++) {
  const gt = f / FPS;
  if (ONLY && !ONLY.includes(f)) continue;
  if (checkEvery && Math.abs(gt / checkEvery - Math.round(gt / checkEvery)) > 0.5 / FPS / checkEvery) continue;
  frames.push(f);
}
function frameHtml(f) {
  const gt = f / FPS;
  const s = tl.find((x) => gt >= x.start && gt < x.start + x.d) || tl[tl.length - 1];
  const t = gt - s.start;
  const ctx = { d: s.d, mouth: mouthAt(s, t), at: (k) => (s.subs.length ? s.subs[s.lineStart[Math.min(k, s.lineStart.length - 1)]].from : 0), n: s.lineStart.length, subs: s.subs };
  const boil = Math.floor(f / 3) % 3; // 1秒4回の線ゆれ
  const art = svgDoc(defs(boil) + paper(W, H) + s.sc.draw(t, ctx), W, H);
  const telop = ep.meta.telop ? `<div class="telop">${ep.meta.telop}</div>` : '';
  const sub = s.subs.find((u) => t >= (u === s.subs[0] ? 0 : u.from) && t < u.to + (u === s.subs[s.subs.length - 1] ? TAIL : 0));
  return art + telop + (sub ? `<div class="sub"><span>${sub.line}</span></div>` : '');
}

const NW = Math.max(1, Math.min(4, os.cpus().length - 1));
console.log(`${ep.meta.title}：${TOTAL.toFixed(1)}秒 / ${frames.length}コマ / 並列${NW} / ${W}x${H}`);
let done = 0;
const CSS = SHORT
  // 縦：字幕は下のボタン類を避けて中央より下、上部に固定テロップ
  ? `.sub{bottom:560px}.sub span{font-size:62px;max-width:960px}
     .telop{position:absolute;left:40px;right:40px;top:150px;padding:22px 10px;text-align:center;background:#2b2622;color:#ffd84a;
       font-family:'Zen Maru Gothic';font-weight:900;font-size:66px;line-height:1.25;border-radius:26px}`
  : '';
await Promise.all(Array.from({ length: NW }, async (_, w) => {
  const { shot, close } = await openShooter(ROOT, path.join(OUT, `_w${w}`), { w: W, h: H, css: CSS });
  for (let k = w; k < frames.length; k += NW) {
    const f = frames[k];
    if (RESUME && !checkEvery && fs.existsSync(path.join(FR, `f${pad(f, 5)}.png`))) { done++; continue; }
    if (ONLY) fs.writeFileSync(path.join(OUT, `debug_${f}.html`), frameHtml(f));
    await shot(frameHtml(f), path.join(FR, checkEvery ? `t${pad(Math.round(f / FPS), 3)}.png` : `f${pad(f, 5)}.png`));
    if (++done % 60 === 0) console.log(`  ${done}/${frames.length}`);
  }
  await close();
}));
if (checkEvery || ONLY) { console.log(`確認用: ${FR}`); process.exit(0); }

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
// コマ画像は大きい（10分で約18GB）ので、完成したら消す。残したいときは --keep-frames
if (!process.argv.includes('--keep-frames')) fs.rmSync(FR, { recursive: true, force: true });
