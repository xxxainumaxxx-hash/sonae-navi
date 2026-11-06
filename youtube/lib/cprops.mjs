// クレヨン調の小物（会社・歴史もの用）。実在ロゴや製品の見た目はまねない。
import { C, ellipse, line, poly, rect, blob, text, arrow, g } from './crayon.mjs';

export function card(x, y, s = 1, rot = 0, kind = 0) {
  let b = rect(-70, -110, 140, 220, { fill: C.red });
  b += rect(-54, -94, 108, 188, { fill: kind ? C.white : C.dark, w: 4 });
  if (kind) b += ellipse(0, -30, 32, 32, { fill: C.red, w: 5 }) + poly([[-50, 80], [-20, 20], [0, 50], [26, 10], [50, 80]], { fill: C.green, w: 5 });
  else b += ellipse(8, -36, 36, 36, { fill: C.white, w: 5 }) + poly([[-54, 90], [-54, 40], [-10, 0], [20, 40], [54, 20], [54, 90]], { fill: C.red, w: 5 });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${b}</g>`;
}

export function shop(x, y, s = 1) {
  let b = rect(-280, -280, 560, 280, { fill: C.brown });
  for (let i = -220; i < 280; i += 70) b += line([[i, -270], [i, -10]], { w: 4, color: '#6b4325', passes: 1 });
  b += poly([[-340, -280], [340, -280], [280, -400], [-280, -400]], { fill: C.dark });
  for (let i = 0; i < 4; i++) b += rect(-170 + i * 86, -270, 80, 160, { fill: '#2f4a7a', w: 5 });
  b += text('花', -130, -175, { size: 64, color: C.white, font: 'Zen Maru Gothic', weight: 900 });
  b += text('札', -44, -175, { size: 64, color: C.white, font: 'Zen Maru Gothic', weight: 900 });
  b += ellipse(230, -220, 30, 42, { fill: C.red });
  return g(b, x, y, s);
}

export function taxi(x, y, s = 1, spin = 0) {
  let b = poly([[-220, 0], [-230, -70], [-140, -90], [-80, -160], [80, -160], [140, -90], [230, -70], [220, 0]], { fill: C.yellow });
  b += poly([[-70, -140], [-10, -140], [-10, -92], [-120, -92]], { fill: C.sky, w: 5 });
  b += poly([[10, -140], [70, -140], [120, -92], [10, -92]], { fill: C.sky, w: 5 });
  b += rect(-46, -200, 92, 38, { fill: C.white, w: 5 }) + text('TAXI', 0, -170, { size: 30, font: 'Zen Maru Gothic', weight: 900 });
  for (const wx of [-130, 130]) {
    b += ellipse(wx, 0, 48, 48, { fill: C.dark });
    b += `<g transform="rotate(${spin} ${wx} 0)">${line([[wx - 30, 0], [wx + 30, 0]], { w: 5, color: C.gray, passes: 1 })}</g>`;
  }
  return g(b, x, y, s);
}

export function riceBox(x, y, s = 1) {
  let b = rect(-110, -150, 220, 280, { fill: C.orange });
  b += ellipse(0, -30, 70, 30, { fill: C.white }) + poly([[-70, -30], [-50, 30], [50, 30], [70, -30]], { fill: C.red });
  b += rect(-90, 60, 180, 46, { fill: C.white, w: 5 }) + text('すぐごはん', 0, 94, { size: 32, font: 'Zen Maru Gothic', weight: 700 });
  return g(b, x, y, s);
}

// のびる手：ext 0〜1 でのびる
export function extendHand(x, y, s = 1, ext = 1) {
  const n = 6, L = 22 + 48 * ext, H = 50 - 22 * ext;
  let b = '';
  for (let i = 0; i < n; i++) {
    const x0 = i * L;
    b += line([[x0, -H], [x0 + L, H]], { w: 9, color: C.gold, passes: 1 }) + line([[x0, H], [x0 + L, -H]], { w: 9, color: C.gold, passes: 1 });
  }
  b += rect(-50, -70, 36, 46, { fill: C.red, w: 5 }) + rect(-50, 24, 36, 46, { fill: C.red, w: 5 });
  const ex = n * L;
  b += poly([[ex, -H], [ex + 60, -H - 34], [ex + 84, -14], [ex + 40, -8]], { fill: C.red, w: 5 });
  b += poly([[ex, H], [ex + 60, H + 34], [ex + 84, 14], [ex + 40, 8]], { fill: C.red, w: 5 });
  return g(b, x, y, s);
}

export function calculator(x, y, s = 1) {
  let b = rect(-100, -150, 200, 300, { fill: C.gray });
  b += rect(-76, -122, 152, 62, { fill: '#c8d4ae', w: 5 }) + text('0.', 60, -76, { size: 44, anchor: 'end' });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) b += rect(-76 + c * 40, -40 + r * 44, 32, 32, { fill: c === 3 ? C.orange : C.white, w: 4 });
  return g(b, x, y, s);
}

export function handheld(x, y, s = 1, blip = 0) {
  let b = rect(-200, -120, 400, 240, { fill: C.rice });
  b += rect(-100, -88, 200, 150, { fill: C.dark, w: 5 }) + rect(-86, -74, 172, 122, { fill: '#c8d4ae', w: 4 });
  b += ellipse(-30 + blip * 60, -10, 12, 12, { fill: C.ink, w: 4 });
  b += rect(-175, -25, 54, 18, { fill: C.dark, w: 3 }) + rect(-157, -43, 18, 54, { fill: C.dark, w: 3 });
  b += ellipse(150, -20, 17, 17, { fill: C.red, w: 5 }) + ellipse(150, 36, 17, 17, { fill: C.red, w: 5 });
  return g(b, x, y, s);
}

// テレビ＋ゲーム機。hop で画面のキャラがジャンプ
export function tvConsole(x, y, s = 1, hop = 0) {
  let b = rect(-250, -340, 500, 360, { fill: C.brown });
  b += rect(-210, -300, 360, 280, { fill: '#25324a', w: 5 });
  const px = [[2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [2, 2], [4, 2], [2, 3], [3, 3], [4, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [2, 5], [4, 5]];
  for (const [cx, cy] of px) b += `<rect x="${-100 + cx * 20}" y="${-230 + cy * 20 - hop * 60}" width="20" height="20" fill="${cy < 2 ? C.red : cy < 4 ? C.skin : C.blue}"/>`;
  b += `<rect x="-210" y="-90" width="360" height="22" fill="${C.green}"/>`;
  b += ellipse(195, -250, 16, 16, { fill: C.gray, w: 5 }) + ellipse(195, -195, 16, 16, { fill: C.gray, w: 5 });
  b += rect(-170, 50, 280, 74, { fill: C.white });
  b += rect(-150, 72, 70, 16, { fill: C.red, w: 3 });
  b += line([[-170, 100], [-250, 140], [-290, 190]], { w: 5, passes: 1 }) + rect(-370, 175, 130, 66, { fill: C.white });
  return g(b, x, y, s);
}

export function bulb(x, y, s = 1, on = 1) {
  let b = on ? `<circle cx="0" cy="-40" r="${110 * on}" fill="${C.yellow}" opacity="${0.35 * on}"/>` : '';
  b += ellipse(0, -50, 72, 76, { fill: on ? C.yellow : C.white });
  b += rect(-32, 22, 64, 48, { fill: C.gray, w: 6 });
  b += line([[-22, -10], [-20, -50], [-6, -30], [6, -54], [20, -10]], { w: 5, passes: 1 });
  return g(b, x, y, s);
}

export function gear(x, y, r, rot = 0, color = C.gray) {
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2, rr = i % 2 ? r : r * 0.78;
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${poly(pts, { fill: color })}${ellipse(0, 0, r * 0.28, r * 0.28, { fill: C.white })}</g>`;
}

// 下がっていくグラフ：k 0〜1 で線がのびる
export function chartDown(x, y, s = 1, k = 1) {
  let b = rect(-200, -150, 400, 300, { fill: C.white });
  b += line([[-160, 110], [170, 110]], { w: 5, passes: 1 }) + line([[-160, 110], [-160, -120]], { w: 5, passes: 1 });
  const P = [[-150, -90], [-80, -50], [-20, -70], [50, 10], [150, 80]];
  const n = Math.max(2, Math.round(1 + k * (P.length - 1)));
  const pts = P.slice(0, n);
  if (k > 0.05) b += line(pts, { w: 12, color: C.red });
  return g(b, x, y, s);
}

export function cross(x, y, s = 1) {
  return g(line([[-60, -60], [60, 60]], { w: 26, color: C.red }) + line([[60, -60], [-60, 60]], { w: 26, color: C.red }), x, y, s);
}

export function sign(str, x, y, { size = 64, fill = C.yellow, color = C.ink, rot = -3 } = {}) {
  const w = str.length * size * 0.95 + 70, h = size + 44;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${rect(-w / 2, -h / 2, w, h, { fill })}${text(str, 0, size * 0.36, { size, color, font: 'Zen Maru Gothic', weight: 900 })}</g>`;
}

export { arrow };
