// 絵柄の比較ボードを作る：node styleboard.mjs → out/styleboard/
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { C, defs, paper, seed, setTheme, THEMES, text, arrow } from './lib/crayon.mjs';
import { sonae, risu, onigiri, priceTag, coin } from './lib/props.mjs';
import { openShooter, svgDoc } from './lib/shot.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'out', 'styleboard');
const { shot, close } = await openShooter(ROOT, OUT);

// 比較用の共通シーン
const scene = () =>
  text('5さいでもわかる「えんやす」', 960, 170, { size: 92, font: 'Zen Maru Gothic', weight: 900 }) +
  sonae({ x: 380, y: 980, s: 1.15, expr: 'smile', pose: 'point' }) +
  coin(820, 470, 70, '$', C.green) + text('＝', 960, 495, { size: 80 }) +
  coin(1110, 470, 52, '¥') + coin(1230, 470, 52, '¥') + coin(1350, 470, 52, '¥') + coin(1470, 470, 52, '¥') +
  arrow(1020, 640, 1020, 760, { w: 9 }) +
  onigiri(1250, 830, 1.2) + priceTag(1560, 860, '150円', { color: C.yellow });

const files = [];
for (const name of Object.keys(THEMES)) {
  setTheme(name); seed(42);
  const f = path.join(OUT, `${name}.png`);
  await shot(svgDoc(defs(0) + paper() + scene()), f);
  files.push([f, THEMES[name].label]);
}

// キャラ候補
setTheme('crayon'); seed(7);
const chars = path.join(OUT, 'chars.png');
await shot(svgDoc(defs(0) + paper() +
  sonae({ x: 330, y: 900, s: 1.3, expr: 'smile', pose: 'wave' }) +
  risu({ x: 960, y: 900, s: 1.3, expr: 'smile', pose: 'hold' }) +
  risu({ x: 1590, y: 900, s: 1.3, expr: 'smile', pose: 'hold', helmet: true }) +
  text('① ソナエ', 330, 1020, { size: 56 }) +
  text('② リスケ', 960, 1020, { size: 56 }) +
  text('③ リスケ＋ヘルメット', 1590, 1020, { size: 56 })), chars);
await close();

// 6枚を1枚に並べる（ラベル付き）
const label = (i, l) => `drawbox=x=0:y=ih-64:w=430:h=64:color=black@0.72:t=fill,drawtext=fontfile=/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf:text='${l}':fontcolor=white:fontsize=40:x=16:y=h-54`;
const inputs = files.flatMap(([f]) => ['-i', f]);
const fc = files.map(([, l], i) => `[${i}]scale=960:540,${label(i, l)}[p${i}]`).join(';') +
  `;[${files.length}]scale=960:540[p${files.length}]` +
  `;${files.map((_, i) => `[p${i}]`).join('')}[p${files.length}]xstack=inputs=6:layout=0_0|960_0|0_540|960_540|0_1080|960_1080`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-i', chars, '-filter_complex', fc, path.join(OUT, 'board.png')]);
console.log(path.join(OUT, 'board.png'));
