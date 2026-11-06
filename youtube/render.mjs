// 使い方:
//   node render.mjs 01-neage            絵＋字幕＋（あれば）声 → 動画
//   node render.mjs 01-neage --stills   絵だけ確認（PNG）
//
// 声：voice/<話ID>/01.mp3, 02.mp3 ... を置くと自動で合成。
//     無い場面は文字数から長さを推定して無音で作る（仮動画）。
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { defs, paper, seed } from './lib/crayon.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.dirname(fileURLToPath(import.meta.url));

const epId = process.argv[2];
const stillsOnly = process.argv.includes('--stills');
if (!epId) { console.error('話IDを指定してください（例: node render.mjs 01-neage）'); process.exit(1); }
const ep = await import(pathToFileURL(path.join(ROOT, 'episodes', `${epId}.mjs`)));

const OUT = path.join(ROOT, 'out', epId);
const VOICE = path.join(ROOT, 'voice', epId);
const BOILS = 3;        // 線のゆれのコマ数
const BOIL_FPS = 4;     // 1秒あたり何回ゆらすか（手描きアニメ風）
fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
fs.mkdirSync(VOICE, { recursive: true });

const pad = (n) => String(n).padStart(2, '0');
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

// ---------- ElevenLabs 用の台本テキスト ----------
const scriptTxt = ep.scenes.map((s, i) =>
  `【${pad(i + 1)}.mp3】\n${s.narration.join('')}\n`).join('\n');
fs.writeFileSync(path.join(VOICE, 'script.txt'),
  `${ep.meta.title}\n場面ごとに音声を作って、【】のファイル名でこのフォルダに保存してください。\n\n${scriptTxt}`);

// ---------- 絵と字幕を PNG に ----------
const fontCss = ['@fontsource/yomogi/japanese-400.css', '@fontsource/zen-maru-gothic/japanese-700.css',
  '@fontsource/zen-maru-gothic/japanese-900.css', '@fontsource/zen-maru-gothic/latin-700.css',
  '@fontsource/zen-maru-gothic/latin-900.css', '@fontsource/yomogi/latin-400.css']
  .map((p) => `<link rel="stylesheet" href="${pathToFileURL(path.join(ROOT, 'node_modules', p))}">`).join('');
const shell = path.join(OUT, '_shell.html');
fs.writeFileSync(shell, `<!doctype html><meta charset="utf-8">${fontCss}
<style>html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:transparent}
.sub{position:absolute;left:0;right:0;bottom:46px;text-align:center}
.sub span{font-family:'Zen Maru Gothic';font-weight:700;font-size:54px;line-height:1.35;color:#fff;
 -webkit-text-stroke:14px #2b2622;paint-order:stroke fill;display:inline-block;max-width:1640px}</style>
<body><div id="root"></div>`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(shell).href);
async function shot(html, file, transparent = false) {
  await page.evaluate((h) => { document.getElementById('root').innerHTML = h; }, html);
  await page.evaluate(async () => {
    // 使っている文字のフォントを全部読み込んでから撮る
    const txt = document.body.innerText + [...document.querySelectorAll('text')].map((t) => t.textContent).join('');
    await Promise.all(["400 10px Yomogi", "700 10px 'Zen Maru Gothic'", "900 10px 'Zen Maru Gothic'"]
      .map((f) => document.fonts.load(f, txt || 'あ')));
    await document.fonts.ready;
  });
  await page.screenshot({ path: file, omitBackground: transparent });
}

const plan = [];
for (const [i, sc] of ep.scenes.entries()) {
  const n = pad(i + 1);
  for (let b = 0; b < BOILS; b++) {
    seed(1000 + i * 17); // 同じ場面は同じ形、ゆれだけ変える
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${defs(b)}${paper()}${sc.draw()}</svg>`;
    await shot(svg, path.join(OUT, 'frames', `${n}_b${b}.png`));
    if (stillsOnly) break;
  }
  if (stillsOnly) { console.log(`絵 ${n}`); continue; }

  // 長さ：声があれば声の長さ、なければ文字数から推定
  const voice = path.join(VOICE, `${n}.mp3`);
  const hasVoice = fs.existsSync(voice);
  const chars = sc.narration.map((t) => t.length);
  const total = chars.reduce((a, c) => a + c, 0);
  const speech = hasVoice
    ? parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]))
    : total / 7.5;
  const lead = 0.25, tail = 0.55;
  const dur = lead + speech + tail;

  const subs = [];
  let t = lead;
  for (const [k, line] of sc.narration.entries()) {
    const len = (chars[k] / total) * speech;
    const file = path.join(OUT, 'frames', `${n}_sub${k}.png`);
    await shot(`<div class="sub"><span>${line}</span></div>`, file, true);
    subs.push({ file, from: k === 0 ? 0 : t, to: k === sc.narration.length - 1 ? dur : t + len });
    t += len;
  }
  plan.push({ n, dur, voice: hasVoice ? voice : null, subs });
  console.log(`場面 ${n}: ${dur.toFixed(1)}秒 ${hasVoice ? '（声あり）' : '（声なし・仮）'}`);
}
await browser.close();
if (stillsOnly) { console.log(`→ ${path.join(OUT, 'frames')}`); process.exit(0); }

// ---------- 場面ごとに動画化 ----------
const clips = [];
for (const p of plan) {
  // 線のゆれ：3コマを 1/4 秒ずつ順番に流す
  const list = path.join(OUT, `${p.n}_boil.txt`);
  const steps = Math.ceil(p.dur * BOIL_FPS) + 1;
  let txt = '';
  for (let s = 0; s < steps; s++) txt += `file 'frames/${p.n}_b${s % BOILS}.png'\nduration ${1 / BOIL_FPS}\n`;
  txt += `file 'frames/${p.n}_b0.png'\n`;
  fs.writeFileSync(list, txt);

  const args = ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list];
  for (const s of p.subs) args.push('-loop', '1', '-t', p.dur.toFixed(2), '-i', s.file);
  if (p.voice) args.push('-i', p.voice); else args.push('-f', 'lavfi', '-t', p.dur.toFixed(2), '-i', 'anullsrc=r=44100:cl=stereo');
  const frames = Math.round(p.dur * 30);
  // ゆっくりズーム（カクつかないよう一度2倍に拡大してから）
  let fc = `[0:v]fps=30,scale=3840:2160,zoompan=z='1+0.05*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30[v0]`;
  p.subs.forEach((s, k) => {
    fc += `;[v${k}][${k + 1}:v]overlay=0:0:enable='between(t,${s.from.toFixed(2)},${s.to.toFixed(2)})'[v${k + 1}]`;
  });
  const aIdx = p.subs.length + 1;
  fc += `;[${aIdx}:a]adelay=${p.voice ? 250 : 0}:all=1,apad[a]`;
  const clip = path.join(OUT, `${p.n}.mp4`);
  args.push('-filter_complex', fc, '-map', `[v${p.subs.length}]`, '-map', '[a]',
    '-t', p.dur.toFixed(2), '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '44100', '-ac', '2', '-b:a', '160k', clip);
  sh('ffmpeg', args);
  clips.push(clip);
}

const concat = path.join(OUT, '_clips.txt');
fs.writeFileSync(concat, clips.map((c) => `file '${c}'`).join('\n'));
const final = path.join(OUT, `${epId}.mp4`);
sh('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concat, '-c', 'copy', '-movflags', '+faststart', final]);
const secs = parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', final]));
console.log(`\n完成: ${final}（${secs.toFixed(1)}秒）`);
console.log(`ElevenLabs用台本: ${path.join(VOICE, 'script.txt')}`);
