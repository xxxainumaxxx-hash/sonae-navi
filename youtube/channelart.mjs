// チャンネル「らくがき経済」のアイコンとバナーを書き出す：node channelart.mjs
//  out/channel/icon.png（800×800。YouTube では丸く切り取られる）
//  out/channel/banner.png（2560×1440。どの画面でも見えるのは中央の 1546×423 だけ）
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defs, paper, setTheme, C, line, rect, ellipse, poly, text, sparkles } from './lib/crayon.mjs';
import { openShooter, svgDoc } from './lib/shot.mjs';
import { xf } from './lib/anim.mjs';
import { guide } from './lib/cfolk.mjs';
import { hanafuda, bwHandheld, taxi, gear, trophy, sneakyCat, extendHand, building, playingCard } from './lib/cprops.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, 'out', 'channel');
setTheme('crayon');
const RED = '#d23a33', INK = '#2b2622', YEL = '#ffd23a';

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

function icon() {
  let s = `<rect width="800" height="800" fill="${YEL}"/>`;
  s += scribble(150, 170, 120, '#f7a23a', 16) + scribble(620, 640, 120, '#f7a23a', 16);
  s += `<circle cx="400" cy="430" r="300" fill="#fff3c4"/>`;
  s += guide({ x: 400, y: 1080, s: 2.9, expr: 'smile', arms: [12, 8, 125, 10], look: [0.4, -0.2] });
  s += crayon(610, 520, 0.95, -35, RED);
  return s;
}

function banner() {
  const W = 2560, H = 1440;
  let s = `<rect width="${W}" height="${H}" fill="#fbf3e6"/>`;
  // まわり（PC・テレビでだけ見える所）：らくがき風に会社の小物を散らす
  s += scribble(250, 300, 160, '#f2c230') + scribble(2300, 1150, 160, '#f2c230') + scribble(2250, 260, 120, '#9fd0f0') + scribble(300, 1180, 120, '#9fd0f0');
  s += xf(hanafuda(0, 0, 1.2, -14, 1), { x: 280, y: 720 }) + xf(playingCard(0, 0, 1.0, 10, '♠'), { x: 420, y: 1080 }) + gear(2200, 620, 110, 15) + building(2360, 900, 200, 300, '#d8b080');
  s += taxi(260, 450, 0.8) + crayon(2300, 420, 1.2, 20, '#3a8ad8') + crayon(200, 1000, 1.0, -30, RED);
  // 中央の帯（どの画面でも見える 1546×423）
  const x0 = (W - 1546) / 2, y0 = (H - 423) / 2;
  s += `<rect x="${x0}" y="${y0}" width="1546" height="423" rx="40" fill="${YEL}"/>`;
  s += scribble(x0 + 1340, y0 + 90, 70, '#f7a23a', 10);
  s += xf(guide({ x: 0, y: 0, s: 0.95, expr: 'smile', arms: [12, 8, 125, 10] }), { x: x0 + 190, y: y0 + 405 });
  s += crayon(x0 + 350, y0 + 175, 0.6, -35, RED);
  s += TITLE('らくがき経済', W / 2 + 40, y0 + 210, 170, INK);
  s += TITLE('有名な会社の「まさかの始まり」を、らくがきで。', W / 2 + 40, y0 + 330, 52, RED);
  s += xf(bwHandheld(0, 0, 0.42, 0.3), { x: x0 + 1440, y: y0 + 200, r: 8 });
  s += sneakyCat(x0 + 1700, y0 + 520, 0, '');
  return { s, W, H };
}

const { shot, close } = await openShooter(ROOT, path.join(OUT, '_w'), { w: 800, h: 800 });
await shot(svgDoc(defs(0) + icon(), 800, 800), path.join(OUT, 'icon.png'));
await close();
const b = banner();
const sh2 = await openShooter(ROOT, path.join(OUT, '_w2'), { w: b.W, h: b.H });
await sh2.shot(svgDoc(defs(0) + b.s, b.W, b.H), path.join(OUT, 'banner.png'));
await sh2.close();
console.log(OUT);
