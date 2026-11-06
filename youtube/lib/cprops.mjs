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

// ---------- 任天堂フル版で追加 ----------
// 花札の図柄いろいろ（0:月と山 1:日の出 2:桜 3:紅葉）
export function hanafuda(x, y, s = 1, rot = 0, kind = 0) {
  let b = rect(-70, -110, 140, 220, { fill: C.red });
  b += rect(-54, -94, 108, 188, { fill: kind === 0 ? C.dark : C.white, w: 4 });
  if (kind === 0) b += ellipse(8, -36, 36, 36, { fill: C.white, w: 5 }) + poly([[-54, 90], [-54, 40], [-10, 0], [20, 40], [54, 20], [54, 90]], { fill: C.red, w: 5 });
  if (kind === 1) b += ellipse(0, -30, 32, 32, { fill: C.red, w: 5 }) + poly([[-50, 80], [-20, 20], [0, 50], [26, 10], [50, 80]], { fill: C.green, w: 5 });
  if (kind === 2) for (const [px, py] of [[-20, -50], [20, -20], [-14, 20], [24, 50], [-24, 70]]) b += ellipse(px, py, 18, 18, { fill: C.pink, w: 4 });
  if (kind === 3) for (const [px, py] of [[-18, -50], [22, -10], [-16, 40], [20, 70]]) b += poly([[px, py - 22], [px + 8, py - 6], [px + 24, py - 4], [px + 10, py + 8], [px + 14, py + 24], [px, py + 14], [px - 14, py + 24], [px - 10, py + 8], [px - 24, py - 4], [px - 8, py - 6]], { fill: C.orange, w: 4 });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${b}</g>`;
}

// トランプ（♠）
export function playingCard(x, y, s = 1, rot = 0, suit = '♠', col = C.ink) {
  const b = rect(-70, -100, 140, 200, { fill: C.white }) + text(suit, 0, 40, { size: 110, color: col, font: 'Zen Maru Gothic', weight: 900 }) +
    text('A', -44, -56, { size: 40, color: col, font: 'Zen Maru Gothic', weight: 900 });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${b}</g>`;
}

// キャラクタートランプの箱（オリジナルのくまの顔）
export function cardBox(x, y, s = 1, col = C.sky) {
  let b = rect(-70, -95, 140, 190, { fill: col });
  b += ellipse(0, -10, 42, 40, { fill: C.brown, w: 5 }) + ellipse(-32, -44, 14, 14, { fill: C.brown, w: 4 }) + ellipse(32, -44, 14, 14, { fill: C.brown, w: 4 });
  b += ellipse(-14, -16, 5, 6, { fill: C.ink, w: 3 }) + ellipse(14, -16, 5, 6, { fill: C.ink, w: 3 }) + ellipse(0, 6, 14, 10, { fill: C.rice, w: 3 });
  b += text('トランプ', 0, 70, { size: 28, font: 'Zen Maru Gothic', weight: 700 });
  return g(b, x, y, s);
}

// 京都の町家の並び（背景）
export function townRow(y, n = 6, x0 = 0, w = 340) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    s += rect(x + 10, y - 200, w - 30, 200, { fill: i % 2 ? '#c99a66' : '#b98a58', w: 5 });
    s += poly([[x - 10, y - 200], [x + w, y - 200], [x + w - 30, y - 270], [x + 20, y - 270]], { fill: '#5b5652', w: 5 });
    s += rect(x + 50, y - 150, 70, 90, { fill: '#e8d6b0', w: 4 }) + rect(x + w - 140, y - 150, 70, 90, { fill: '#e8d6b0', w: 4 });
  }
  return s;
}

export function desk(x, y, s = 1) {
  return g(rect(-230, -20, 460, 40, { fill: C.brown }) + rect(-210, 20, 40, 150, { fill: C.brown, w: 5 }) + rect(170, 20, 40, 150, { fill: C.brown, w: 5 }), x, y, s);
}

export function building(x, y, w, h, col = C.gray) {
  let s = rect(x - w / 2, y - h, w, h, { fill: col });
  for (let yy = y - h + 30; yy < y - 40; yy += 60) for (let xx = x - w / 2 + 25; xx < x + w / 2 - 30; xx += 55) s += rect(xx, yy, 28, 34, { fill: C.sky, w: 3 });
  return s;
}

export function plane(x, y, s = 1) {
  let b = poly([[-170, 0], [130, -18], [175, 0], [130, 18]], { fill: C.white });
  b += poly([[-10, -8], [-70, -110], [-30, -110], [50, -8]], { fill: C.sky, w: 5 }) + poly([[-10, 8], [-70, 100], [-30, 100], [50, 8]], { fill: C.sky, w: 5 });
  b += poly([[-170, 0], [-190, -60], [-150, -60], [-130, -4]], { fill: C.red, w: 5 });
  return g(b, x, y, s);
}

// 新幹線（横から）
export function train(x, y, s = 1) {
  let b = poly([[-700, -120], [300, -120], [520, -40], [560, 40], [-700, 40]], { fill: C.white });
  b += rect(-700, 0, 1240, 22, { fill: C.blue, w: 4 });
  for (let i = 0; i < 6; i++) b += rect(-660 + i * 150, -95, 110, 70, { fill: C.sky, w: 4 });
  return g(b, x, y, s);
}

export function dpad(x, y, s = 1) {
  return g(rect(-90, -30, 180, 60, { fill: C.dark }) + rect(-30, -90, 60, 180, { fill: C.dark }), x, y, s);
}

// 白黒の携帯ゲーム機（たて型・一般形）。dim で画面が暗くなる
export function bwHandheld(x, y, s = 1, blip = 0, dim = 0) {
  let b = rect(-150, -240, 300, 480, { fill: C.rice });
  b += rect(-115, -205, 230, 180, { fill: C.dark, w: 5 }) + rect(-95, -185, 190, 140, { fill: dim ? '#5c6350' : '#b6c49a', w: 4 });
  if (!dim) b += ellipse(-50 + blip * 100, -110, 14, 14, { fill: '#3b4a2c', w: 3 }) + rect(-80, -70, 160, 12, { fill: '#3b4a2c', w: 0 });
  b += rect(-120, 50, 90, 28, { fill: C.dark, w: 3 }) + rect(-89, 20, 28, 90, { fill: C.dark, w: 3 });
  b += ellipse(70, 50, 22, 22, { fill: C.red, w: 4 }) + ellipse(110, 20, 22, 22, { fill: C.red, w: 4 });
  return g(b, x, y, s);
}

// カラー画面のライバル機（よこ型・一般形）
export function colorHandheld(x, y, s = 1, dim = 0) {
  let b = rect(-260, -150, 520, 300, { fill: '#3d3d46' });
  b += rect(-130, -110, 260, 200, { fill: C.dark, w: 5 });
  if (!dim) {
    b += rect(-110, -90, 220, 160, { fill: C.sky, w: 3 });
    b += ellipse(-30, -10, 30, 30, { fill: C.yellow, w: 4 }) + rect(-110, 30, 220, 40, { fill: C.green, w: 0 }) + ellipse(50, 0, 20, 20, { fill: C.red, w: 4 });
  } else b += rect(-110, -90, 220, 160, { fill: '#1e1e22', w: 3 });
  b += rect(-225, -15, 70, 24, { fill: C.dark, w: 3 }) + rect(-202, -38, 24, 70, { fill: C.dark, w: 3 });
  b += ellipse(190, -20, 20, 20, { fill: C.blue, w: 4 }) + ellipse(190, 40, 20, 20, { fill: C.blue, w: 4 });
  return g(b, x, y, s);
}

// 電池（level 0〜1）
export function battery(x, y, s = 1, level = 1) {
  const col = level > 0.5 ? C.green : level > 0.2 ? C.yellow : C.red;
  let b = rect(-80, -36, 160, 72, { fill: C.white }) + rect(80, -16, 16, 32, { fill: C.dark, w: 4 });
  if (level > 0.02) b += rect(-68, -24, 136 * level, 48, { fill: col, w: 0, color: null });
  return g(b, x, y, s);
}

export function bubble(str, x, y, { size = 54, w = null } = {}) {
  const ww = w || str.length * size + 80;
  return ellipse(x, y, ww / 2, size * 1.1, { fill: C.white }) + poly([[x - 30, y + size * 0.9], [x - 70, y + size * 2], [x + 10, y + size]], { fill: C.white, w: 5 }) +
    text(str, x, y + size * 0.35, { size, font: 'Zen Maru Gothic', weight: 900 });
}

export function rainCloud(x, y, t = 0, s = 1) {
  let b = ellipse(-60, 0, 80, 55, { fill: C.gray }) + ellipse(40, -20, 90, 65, { fill: C.gray }) + ellipse(110, 10, 60, 45, { fill: C.gray });
  for (let i = 0; i < 6; i++) {
    const dy = ((t * 300 + i * 53) % 160);
    b += line([[-80 + i * 40, 60 + dy], [-88 + i * 40, 90 + dy]], { w: 5, color: C.blue, passes: 1 });
  }
  return g(b, x, y, s);
}

export function trophy(x, y, s = 1) {
  let b = poly([[-80, -120], [80, -120], [60, 0], [-60, 0]], { fill: C.gold });
  b += rect(-16, 0, 32, 60, { fill: C.gold, w: 5 }) + rect(-70, 60, 140, 40, { fill: C.brown, w: 5 });
  b += line([[-80, -100], [-130, -80], [-110, -30], [-62, -30]], { w: 8, passes: 1 }) + line([[80, -100], [130, -80], [110, -30], [62, -30]], { w: 8, passes: 1 });
  return g(b, x, y, s);
}

export function ball(x, y, r = 40, col = C.red) { return ellipse(x, y, r, r, { fill: col }); }

// 地面・空など（背景の色面）
export function band(y, h, col) { return poly([[-60, y], [1980, y], [1980, y + h], [-60, y + h]], { fill: col, color: null }); }
