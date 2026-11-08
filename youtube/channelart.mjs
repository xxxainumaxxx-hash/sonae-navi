// チャンネル「らくがき経済」のアイコンとバナーを書き出す：node channelart.mjs
//  out/channel/icon.png（800×800。YouTube では丸く切り取られる）
//  out/channel/banner.png（2560×1440。どの画面でも見えるのは中央の 1546×423 だけ）
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defs, paper, setTheme, C, line, rect, ellipse, poly, text, sparkles } from './lib/crayon.mjs';
import { openShooter, svgDoc } from './lib/shot.mjs';
import { xf } from './lib/anim.mjs';
import { guide } from './lib/cfolk.mjs';
import { bulb, hanafuda, bwHandheld, taxi, gear, trophy, sneakyCat, extendHand, building, playingCard } from './lib/cprops.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'out', 'channel');
setTheme('crayon');
const RED = '#d23a33', INK = '#2b2622';
// 色の組み合わせ（node channelart.mjs A／B／C）
const PAL = {
  A: { name: '紺×クリーム', logo: ['#fbf3e6', '#f2b544', '#fbf3e6', '#ff8a7a', '#fbf3e6', '#8fd0ff'], bg: '#1f2d4a', strip: '#26375a', title: '#fbf3e6', titleStroke: '#0f1828', sub: '#f2b544', iconBg: '#1f2d4a', iconCircle: '#2f4470', scrib: '#3d5486', scrib2: '#33496f' },
  B: { name: '黒板', logo: ['#f4f1e6', '#f2c94c', '#f4f1e6', '#ff9a8a', '#f4f1e6', '#9fe0c0'], bg: '#24392f', strip: '#2d4a3c', title: '#f4f1e6', titleStroke: '#13221b', sub: '#f2c94c', iconBg: '#24392f', iconCircle: '#35564a', scrib: '#4f7465', scrib2: '#3f6052' },
  C: { name: '白い紙×赤', logo: ['#d23a33', '#2b2622', '#3a7bd5', '#d23a33', '#2b2622', '#2f9a4a'], bg: '#fbf7ee', strip: '#ffffff', title: '#2b2622', titleStroke: '#ffffff', sub: '#d23a33', iconBg: '#d23a33', iconCircle: '#fbf7ee', scrib: '#f0c8c4', scrib2: '#e6e0d2' },
};
const V = process.argv[2] || 'A', K = PAL[V];

// クレヨン1本
const crayon = (x, y, s, rot, col) => xf(
  rect(-110, -22, 190, 44, { fill: col, w: 6 }) + rect(-60, -22, 60, 44, { fill: '#fff8e6', w: 4 }) + poly([[80, -22], [130, 0], [80, 22]], { fill: col, w: 6 }),
  { x, y, s, r: rot });
// ぐるぐるのらくがき線
const scribble = (cx, cy, r, col, w = 14) => {
  const pts = [];
  for (let i = 0; i <= 60; i++) { const a = i * 0.42; pts.push([cx + Math.cos(a) * r * (0.5 + i / 120) + i * 2, cy + Math.sin(a) * r * 0.55 * (0.5 + i / 120)]); }
  return line(pts, { w, color: col, passes: 1 });
};
const TITLE = (str, x, y, size, color = INK, stroke = '#fff') =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.18}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;

// 手書き風のロゴ（1文字ずつ少し傾けて、色を変える）
const LOGO = (str, cx, y, size, cols, stroke) => {
  const chars = [...str], step = size * 0.98, x0 = cx - (step * (chars.length - 1)) / 2;
  return chars.map((ch, i) => {
    const x = x0 + i * step, r = [-6, 4, -3, 5, -4, 3][i % 6], dy = [0, -10, 6, -6, 8, -4][i % 6];
    return `<g transform="translate(${x} ${y + dy}) rotate(${r})" filter="url(#wobble)"><text x="0" y="0" font-family="Yusei Magic" font-size="${size}" text-anchor="middle" fill="${cols[i % cols.length]}" stroke="${stroke}" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke fill">${ch}</text></g>`;
  }).join('');
};

// すわったネコ（グラフを見上げている）
const sitCat = (x, y) => {
  const G = '#9aa0a8';
  let s = '';
  s += line([[x + 55, y + 50], [x + 95, y + 20], [x + 90, y - 30]], { w: 10, color: INK, passes: 1 });               // しっぽ
  s += ellipse(x, y + 20, 62, 72, { fill: G });                                                                       // からだ
  s += ellipse(x - 25, y + 88, 20, 12, { fill: G, w: 5 }) + ellipse(x + 25, y + 88, 20, 12, { fill: G, w: 5 });       // 足
  s += ellipse(x, y - 70, 48, 42, { fill: G });                                                                       // あたま
  s += poly([[x - 40, y - 92], [x - 34, y - 135], [x - 12, y - 104]], { fill: G, w: 5 }) + poly([[x + 12, y - 104], [x + 34, y - 135], [x + 40, y - 92]], { fill: G, w: 5 });
  s += ellipse(x - 26, y - 80, 5, 7, { fill: INK, w: 3 }) + ellipse(x - 4, y - 80, 5, 7, { fill: INK, w: 3 });   // 目（左＝グラフの方を見る）
  s += line([[x - 18, y - 58], [x - 12, y - 54], [x - 6, y - 58]], { w: 4, color: INK, passes: 1 });
  // 前足はそろえて、ちょこんとすわる
  s += ellipse(x - 20, y + 60, 14, 22, { fill: G, w: 5 }) + ellipse(x + 8, y + 62, 14, 22, { fill: G, w: 5 });
  return s;
};

function icon() {
  let s = `<rect width="800" height="800" fill="${K.iconBg}"/>`;
  s += scribble(150, 170, 120, K.scrib, 16) + scribble(620, 640, 120, K.scrib, 16);
  s += `<circle cx="400" cy="430" r="300" fill="${K.iconCircle}"/>`;
  s += guide({ x: 400, y: 1080, s: 2.9, expr: 'smile', arms: [12, 8, 125, 10], look: [0.4, -0.2] });
  s += crayon(610, 520, 0.95, -35, RED);
  return s;
}

function banner() {
  const W = 2560, H = 1440;
  let s = `<rect width="${W}" height="${H}" fill="${K.bg}"/>`;
  // まわり（PC・テレビでだけ見える所）：らくがき風に会社の小物を散らす
  s += scribble(250, 300, 160, K.scrib) + scribble(2300, 1150, 160, K.scrib) + scribble(2250, 260, 120, K.scrib2) + scribble(300, 1180, 120, K.scrib2);
  s += xf(bulb(0, 0, 1.3, 1), { x: 280, y: 720 }) + xf(playingCard(0, 0, 1.0, 10, '♠'), { x: 420, y: 1080 }) + gear(2200, 620, 110, 15) + building(2360, 900, 200, 300, '#d8b080');
  s += taxi(260, 450, 0.8) + crayon(2300, 420, 1.2, 20, '#3a8ad8') + crayon(200, 1000, 1.0, -30, RED);
  // 中央の帯（どの画面でも見える 1546×423）
  const x0 = (W - 1546) / 2, y0 = (H - 423) / 2;
  s += `<rect x="${x0}" y="${y0}" width="1546" height="423" rx="40" fill="${K.strip}"/>`;
  s += xf(guide({ x: 0, y: 0, s: 0.95, expr: 'smile', arms: [12, 8, 125, 10] }), { x: x0 + 190, y: y0 + 405 });
  s += crayon(x0 + 350, y0 + 175, 0.6, -35, RED);
  s += LOGO('らくがき経済', W / 2 - 20, y0 + 215, 150, K.logo, K.titleStroke);
  s += line([[W / 2 - 420, y0 + 252], [W / 2 - 150, y0 + 262], [W / 2 + 150, y0 + 250], [W / 2 + 390, y0 + 258]], { w: 12, color: K.sub, passes: 2 });
  s += TITLE('会社とお金の話を、らくがきで。', W / 2 - 20, y0 + 345, 54, K.title, K.titleStroke);
  // 右はし：上がるグラフ、ビル、コインの山。その横にすわったネコ
  const R = x0 + 1175;
  s += building(R + 40, y0 + 330, 70, 150, '#d8b080') + building(R + 115, y0 + 330, 55, 95, '#c49a6a');
  [0, 1, 2, 3].forEach((i) => { s += ellipse(R + 175, y0 + 365 - i * 17, 30, 11, { fill: '#f2c230', w: 4 }); });
  s += text('¥', R + 175, y0 + 280, { size: 42, color: '#f2c230', font: 'Zen Maru Gothic', weight: 900 });
  const g = [[R + 10, y0 + 250], [R + 60, y0 + 200], [R + 100, y0 + 222], [R + 190, y0 + 110]];
  s += line(g, { w: 13, color: '#3fbf5a', passes: 2 }) + poly([[R + 212, y0 + 80], [R + 168, y0 + 104], [R + 214, y0 + 134]], { fill: '#3fbf5a', w: 5 });
  s += sitCat(R + 300, y0 + 310);
  return { s, W, H };
}

const { shot, close } = await openShooter(ROOT, path.join(OUT, '_w'), { w: 800, h: 800 });
await shot(svgDoc(defs(0) + icon(), 800, 800), path.join(OUT, `icon${V}.png`));
await close();
const b = banner();
const sh2 = await openShooter(ROOT, path.join(OUT, '_w2'), { w: b.W, h: b.H });
await sh2.shot(svgDoc(defs(0) + b.s, b.W, b.H), path.join(OUT, `banner${V}.png`));
await sh2.close();
console.log(OUT);
