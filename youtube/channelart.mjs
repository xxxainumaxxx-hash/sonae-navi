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
  D: { name: 'からし', bg: '#e9b832', strip: '#f2c94c', title: '#2b2622', titleStroke: '#fff8e6', sub: '#c0392b', iconBg: '#e9b832', iconCircle: '#fbe7a6', scrib: '#d9a425', scrib2: '#f5d66e', logo: ['#2b2622', '#c0392b', '#2b2622', '#2a6fbf', '#2b2622', '#2f9a4a'] },
  E: { name: '赤', bg: '#b8342e', strip: '#cc4038', title: '#fff8ec', titleStroke: '#5a1412', sub: '#ffd23a', iconBg: '#b8342e', iconCircle: '#e06a5f', scrib: '#a02a25', scrib2: '#d4554c', logo: ['#fff8ec', '#ffd23a', '#fff8ec', '#ffe0a0', '#fff8ec', '#bfe8ff'] },
  F: { name: 'ティール', bg: '#1d5257', strip: '#246167', title: '#f4f1e6', titleStroke: '#0c2a2d', sub: '#ffb36b', iconBg: '#1d5257', iconCircle: '#33787d', scrib: '#2f6e73', scrib2: '#2a6469', logo: ['#f4f1e6', '#ffd23a', '#f4f1e6', '#ff9a8a', '#f4f1e6', '#b5f0d0'] },
  G: { name: 'クラフト紙', bg: '#d4ad7a', strip: '#e3c08f', title: '#2b2622', titleStroke: '#f8ecd8', sub: '#b8342e', iconBg: '#d4ad7a', iconCircle: '#f1dcbc', scrib: '#c49a63', scrib2: '#e6c79c', logo: ['#2b2622', '#b8342e', '#2b2622', '#2a6fbf', '#2b2622', '#2f8a4a'] },
  H: { name: '夜の紫', bg: '#33284f', strip: '#3f3262', title: '#f6f0ff', titleStroke: '#170f2a', sub: '#ffd23a', iconBg: '#33284f', iconCircle: '#57478a', scrib: '#4a3c74', scrib2: '#43366a', logo: ['#f6f0ff', '#ffd23a', '#f6f0ff', '#ff9ac0', '#f6f0ff', '#9fe0ff'] },
  I: { name: 'さくら', bg: '#f6d9d2', strip: '#fbe9e4', title: '#2b2622', titleStroke: '#ffffff', sub: '#c0392b', iconBg: '#e88f86', iconCircle: '#fbe9e4', scrib: '#efc0b8', scrib2: '#f3cfc8', logo: ['#c0392b', '#2b2622', '#2a6fbf', '#c0392b', '#2b2622', '#2f9a4a'] },
  S: { name: 'スケッチブック', sketch: true, bg: '#b98a5a', strip: '#fbf8f0', title: '#2b2622', titleStroke: '#fbf8f0', sub: '#d23a33', iconBg: '#fbf8f0', iconCircle: '#f3ead6', scrib: '#e8dcc4', scrib2: '#efe4cf', logo: ['#d23a33', '#2b2622', '#2a6fbf', '#e08a1e', '#2b2622', '#2f9a4a'] },
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
  if (K.sketch) {
    // 机の木目
    s = `<rect width="${W}" height="${H}" fill="${K.bg}"/>`;
    for (let i = 0; i < 16; i++) s += line([[0, 60 + i * 92 + (i % 3) * 8], [W, 70 + i * 92 - (i % 2) * 10]], { w: 4, color: '#a5784b', passes: 1 });
    s += `<rect width="${W}" height="${H}" filter="url(#paper)" opacity="0.8"/>`;
    // スケッチブックの紙（影・紙・ざらつき）とリング
    const px = x0 - 130, py = y0 + 4, pw = 1546 + 260, ph = 423 + 120;
    s += `<rect x="${px + 18}" y="${py + 24}" width="${pw}" height="${ph}" rx="10" fill="#000" opacity="0.25"/>`;
    s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="10" fill="${K.strip}"/>` + `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="10" filter="url(#paper)"/>`;
    s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="10" fill="none" stroke="#d8ccb4" stroke-width="4"/>`;
    for (let i = 0; i < 26; i++) { const rx = px + 50 + i * ((pw - 100) / 25);
      s += `<circle cx="${rx}" cy="${py + 30}" r="9" fill="#5a4a3a"/>` + `<path d="M${rx - 10},${py + 32} C${rx - 12},${py - 14} ${rx + 12},${py - 14} ${rx + 10},${py + 32}" fill="none" stroke="#8a8f96" stroke-width="7" stroke-linecap="round"/>`; }
    // 机の上の小物：クレヨン、消しゴム、消しかす
    s += crayon(px + pw + 120, y0 + 60, 1.3, 95, '#2a6fbf') + crayon(px + pw + 70, y0 + 330, 1.3, 75, '#e08a1e') + crayon(px - 140, y0 + 250, 1.3, -80, '#2f9a4a');
    s += xf(rect(-60, -30, 120, 60, { fill: '#f6c7c0' }) + rect(-60, -30, 45, 60, { fill: '#5a8fd0', w: 4 }), { x: px - 120, y: y0 + 470, r: -18 });
  } else {
    s += `<rect x="${x0}" y="${y0}" width="1546" height="423" rx="40" fill="${K.strip}"/>`;
  }
  s += xf(guide({ x: 0, y: 0, s: 0.95, expr: 'smile', arms: [12, 8, 125, 10] }), { x: x0 + 190, y: y0 + 405 });
  s += crayon(x0 + 350, y0 + 175, 0.6, -35, RED);
  s += LOGO('らくがき経済', W / 2 - 20, y0 + 215, 150, K.logo, K.titleStroke);
  s += line([[W / 2 - 420, y0 + 252], [W / 2 - 150, y0 + 262], [W / 2 + 120, y0 + 250], [W / 2 + 320, y0 + 258]], { w: 12, color: K.sub, passes: 2 });
  s += TITLE('会社とお金の話を、らくがきで。', W / 2 - 20, y0 + 345, 54, K.title, K.titleStroke);
  // 右はし（案：node channelart.mjs A 1〜4）
  const R = x0 + 1175, RV = process.argv[3] || '1';
  const coinStack = (x, y, n) => { let c = ''; for (let i = 0; i < n; i++) c += ellipse(x, y - i * 17, 30, 11, { fill: '#f2c230', w: 4 }); return c; };
  const arrowUp = (pts, col = '#3fbf5a') => { const [p, q] = pts.slice(-2); const a = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const tip = [q[0] + Math.cos(a) * 34, q[1] + Math.sin(a) * 34];
    return line(pts, { w: 13, color: col, passes: 2 }) + poly([tip, [q[0] + Math.cos(a + 2) * 26, q[1] + Math.sin(a + 2) * 26], [q[0] + Math.cos(a - 2) * 26, q[1] + Math.sin(a - 2) * 26]], { fill: col, w: 5 }); };
  if (RV === '1') {
    // ① グラフ＋ビル＋コイン＋すわったネコ
    s += building(R + 60, y0 + 345, 70, 140, '#d8b080') + building(R + 130, y0 + 345, 55, 90, '#c49a6a') + coinStack(R + 190, y0 + 375, 4);
    s += text('¥', R + 190, y0 + 290, { size: 42, color: '#f2c230', font: 'Zen Maru Gothic', weight: 900 });
    s += arrowUp([[R + 45, y0 + 205], [R + 85, y0 + 165], [R + 120, y0 + 185], [R + 195, y0 + 95]]);
    s += sitCat(R + 300, y0 + 310);
  } else if (RV === '2') {
    // ② 小さなノートに、ぐるぐる・矢印・円グラフのメモ書き
    s += xf(rect(-150, -150, 300, 300, { fill: '#fdfbf3' }) + [0, 1, 2, 3, 4].map((i) => line([[-130, -95 + i * 52], [130, -95 + i * 52]], { w: 3, color: '#9cc3e4', passes: 1 })).join('') +
      `<circle cx="-60" cy="-40" r="55" fill="#ff8a7a" stroke="${INK}" stroke-width="5"/><path d="M-60,-40 L-60,-95 A55,55 0 0,1 -8,-58 Z" fill="#8fd0ff" stroke="${INK}" stroke-width="5"/>` +
      text('¥', 60, -20, { size: 70, color: '#d23a33', font: 'Yusei Magic' }) + arrowUp([[-110, 110], [-40, 70], [10, 90], [100, 30]]), { x: R + 205, y: y0 + 215, r: 6, s: 0.85 });
    s += crayon(R + 300, y0 + 360, 0.5, -40, '#f2b544');
  } else if (RV === '3') {
    // ③ ひらめきの電球と、お金の袋（アイデアがお金になる）
    s += xf(bulb(0, 0, 0.8, 1), { x: R + 150, y: y0 + 130 }) + sparkles(R + 150, y0 + 70, 55, '#f2c230');
    s += arrowUp([[R + 190, y0 + 175], [R + 215, y0 + 205]], '#f2b544');
    s += ellipse(R + 245, y0 + 300, 80, 75, { fill: '#c9a36a' }) + poly([[R + 215, y0 + 228], [R + 275, y0 + 228], [R + 290, y0 + 205], [R + 200, y0 + 205]], { fill: '#c9a36a', w: 5 }) +
      text('¥', R + 245, y0 + 325, { size: 70, color: INK, font: 'Yusei Magic' }) + coinStack(R + 140, y0 + 380, 3);
  } else {
    // ④ ネコがお昼寝。まわりに会社の小物（お店・工場・コイン・電球）が、ふわふわ浮かぶ
    s += ellipse(R + 180, y0 + 360, 90, 40, { fill: '#9aa0a8' }) + ellipse(R + 110, y0 + 340, 42, 36, { fill: '#9aa0a8' }) +
      poly([[R + 82, y0 + 318], [R + 86, y0 + 282], [R + 106, y0 + 308]], { fill: '#9aa0a8', w: 5 }) + poly([[R + 114, y0 + 306], [R + 132, y0 + 280], [R + 138, y0 + 312]], { fill: '#9aa0a8', w: 5 }) +
      line([[R + 92, y0 + 340], [R + 104, y0 + 344]], { w: 4, color: INK, passes: 1 }) + line([[R + 116, y0 + 340], [R + 128, y0 + 344]], { w: 4, color: INK, passes: 1 }) +
      line([[R + 265, y0 + 360], [R + 300, y0 + 330], [R + 290, y0 + 300]], { w: 10, color: INK, passes: 1 });
    s += text('z', R + 165, y0 + 290, { size: 40, color: K.title, font: 'Yusei Magic' }) + text('Z', R + 195, y0 + 255, { size: 56, color: K.title, font: 'Yusei Magic' });
    s += building(R + 60, y0 + 230, 60, 110, '#d8b080') + xf(bulb(0, 0, 0.55, 1), { x: R + 260, y: y0 + 90 }) + coinStack(R + 280, y0 + 240, 3) + gear(R + 150, y0 + 90, 45, 20);
  }
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
