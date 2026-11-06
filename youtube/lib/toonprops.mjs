// カートゥーン調の小物（実在ロゴ・商品の見た目はまねない、一般的な形）
import { K, oval, box, poly, blob, shape, stroke, seg, label, g, ellD, rrectD } from './toon.mjs';

// 花札っぽいカード（一般的な図柄：赤い月と山）
export function card(x, y, s = 1, rot = 0, kind = 0) {
  let b = box(-80, -125, 160, 250, 14, { fill: K.darkRed, shade: 0.15 });
  b += box(-64, -109, 128, 218, 8, { fill: kind ? K.cream : K.black, w: 4, shade: 0 });
  if (kind) {
    b += oval(0, -30, 40, 40, { fill: K.red, w: 0, shade: 0 });
    b += `<path d="M-60,100 Q-30,30 0,60 Q30,10 60,100Z" fill="${K.green}"/>`;
  } else {
    b += oval(10, -40, 44, 44, { fill: K.cream, w: 0, shade: 0 });
    b += `<path d="M-64,105 L-64,40 Q-20,-10 20,40 Q40,10 64,30 L64,105Z" fill="${K.red}"/>`;
  }
  return g(b, x, y, s, rot);
}

// 昔の京都のお店
export function shop(x, y, s = 1) {
  let b = box(-300, -300, 600, 300, 0, { fill: K.wood, shade: 0.15 });
  for (let i = -260; i < 300; i += 40) b += seg(i, -290, i, -10, { w: 3, color: K.darkWood });
  b += poly([[-360, -300], [360, -300], [300, -420], [-300, -420]], { fill: '#4a4744', shade: 0.25 });
  for (let i = -330; i < 340; i += 44) b += seg(i, -305, i * 0.83, -415, { w: 3, color: '#2a2725' });
  // のれん
  for (let i = 0; i < 4; i++) b += box(-180 + i * 92, -290, 86, 170, 4, { fill: K.navy, w: 6, shade: 0.1 });
  b += label('花', -137, -190, { size: 60, color: K.white }) + label('札', -45, -190, { size: 60, color: K.white });
  // ちょうちん
  b += oval(250, -230, 34, 46, { fill: K.red, shade: 0.2 });
  b += seg(250, -276, 250, -296, { w: 5 });
  b += box(-300, -10, 600, 20, 4, { fill: K.darkWood, shade: 0 });
  return g(b, x, y, s);
}

export function taxi(x, y, s = 1) {
  let b = blob([[-230, 0], [-240, -80], [-150, -100], [-90, -170], [90, -170], [150, -100], [240, -80], [230, 0]], { fill: K.yellow });
  b += poly([[-80, -150], [-10, -150], [-10, -100], [-130, -100]], { fill: K.sky, w: 6, shade: 0 });
  b += poly([[10, -150], [80, -150], [130, -100], [10, -100]], { fill: K.sky, w: 6, shade: 0 });
  b += box(-50, -210, 100, 40, 8, { fill: K.white, shade: 0 }) + label('TAXI', 0, -178, { size: 30 });
  b += oval(-140, 0, 52, 52, { fill: K.black, shade: 0 }) + oval(-140, 0, 20, 20, { fill: K.gray, shade: 0 });
  b += oval(140, 0, 52, 52, { fill: K.black, shade: 0 }) + oval(140, 0, 20, 20, { fill: K.gray, shade: 0 });
  return g(b, x, y, s);
}

export function riceBox(x, y, s = 1) {
  let b = box(-120, -170, 240, 300, 10, { fill: K.orange });
  b += oval(0, -40, 80, 34, { fill: K.white, shade: 0.1 });
  b += shape('M-80,-40 Q-70,40 0,44 Q70,40 80,-40Z', { fill: K.red, shade: 0.15 });
  b += box(-100, 60, 200, 50, 8, { fill: K.white, w: 5, shade: 0 }) + label('すぐごはん', 0, 97, { size: 34 });
  return g(b, x, y, s);
}

// のびる手のおもちゃ（ひし形の格子）
export function extendHand(x, y, s = 1, n = 6) {
  let b = '';
  const L = 70;
  for (let i = 0; i < n; i++) {
    const x0 = i * L;
    b += seg(x0, -40, x0 + L, 40, { w: 14, color: K.ink }) + seg(x0, 40, x0 + L, -40, { w: 14, color: K.ink });
    b += seg(x0, -40, x0 + L, 40, { w: 7, color: K.yellow }) + seg(x0, 40, x0 + L, -40, { w: 7, color: K.yellow });
  }
  // 持ち手
  b += box(-60, -70, 40, 50, 12, { fill: K.red }) + box(-60, 20, 40, 50, 12, { fill: K.red });
  // つかむ手
  const ex = n * L;
  b += shape(`M${ex},-40 Q${ex + 70},-80 ${ex + 90},-20 L${ex + 50},-10Z`, { fill: K.red });
  b += shape(`M${ex},40 Q${ex + 70},80 ${ex + 90},20 L${ex + 50},10Z`, { fill: K.red });
  return g(b, x, y, s);
}

export function calculator(x, y, s = 1) {
  let b = box(-110, -160, 220, 320, 22, { fill: K.gray });
  b += box(-84, -130, 168, 70, 8, { fill: '#b9c7a3', w: 6, shade: 0 }) + label('12345', 0, -80, { size: 40, color: '#33402a' });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) b += box(-84 + c * 44, -40 + r * 46, 36, 36, 8, { fill: c === 3 ? K.orange : K.light, w: 4, shade: 0.1 });
  return g(b, x, y, s);
}

// 携帯ゲーム機（一般形）
export function handheld(x, y, s = 1) {
  let b = box(-220, -130, 440, 260, 30, { fill: K.cream });
  b += box(-110, -95, 220, 160, 10, { fill: '#202a24', shade: 0 });
  b += box(-95, -80, 190, 130, 6, { fill: '#b9c7a3', w: 4, shade: 0 });
  b += oval(-20, -10, 16, 16, { fill: K.ink, w: 0, shade: 0 }) + box(-70, 10, 110, 14, 4, { fill: K.ink, w: 0, shade: 0 });
  b += box(-190, -30, 60, 20, 4, { fill: K.black, w: 0, shade: 0 }) + box(-170, -50, 20, 60, 4, { fill: K.black, w: 0, shade: 0 });
  b += oval(160, -20, 20, 20, { fill: K.red, w: 5 }) + oval(160, 40, 20, 20, { fill: K.red, w: 5 });
  return g(b, x, y, s);
}

// テレビ＋家庭用ゲーム機（一般形）
export function tvConsole(x, y, s = 1) {
  let b = box(-260, -360, 520, 380, 30, { fill: K.wood });
  b += box(-220, -320, 380, 300, 24, { fill: '#1d2a3a', shade: 0 });
  // 画面のドット絵（オリジナルの小さな勇者）
  const px = [[2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [2, 2], [4, 2], [2, 3], [3, 3], [4, 3], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [2, 5], [4, 5]];
  for (const [cx, cy] of px) b += `<rect x="${-110 + cx * 22}" y="${-260 + cy * 22}" width="22" height="22" fill="${cy < 2 ? K.red : cy < 4 ? K.skin : K.blue}"/>`;
  b += `<rect x="-220" y="-90" width="380" height="20" fill="${K.green}"/>`;
  b += oval(200, -260, 18, 18, { fill: K.gray, w: 5 }) + oval(200, -200, 18, 18, { fill: K.gray, w: 5 });
  b += box(-180, 50, 300, 80, 12, { fill: K.light });
  b += box(-160, 70, 80, 16, 4, { fill: K.red, w: 3, shade: 0 });
  b += stroke([[-180, 100], [-260, 140], [-300, 200]], { w: 6 }) + box(-380, 180, 140, 70, 16, { fill: K.light });
  return g(b, x, y, s);
}

export function bulb(x, y, s = 1, glow = true) {
  let b = glow ? `<circle cx="0" cy="-40" r="120" fill="${K.yellow}" opacity="0.5" filter="url(#glow)"/>` : '';
  b += oval(0, -50, 80, 84, { fill: K.yellow, hi: true });
  b += box(-36, 26, 72, 54, 10, { fill: K.gray, shade: 0.2 });
  b += `<path d="M-26,-10 Q-26,-56 -12,-40 Q0,-24 10,-48 Q22,-70 26,-10" fill="none" stroke="${K.ink}" stroke-width="6" stroke-linecap="round"/>`;
  return g(b, x, y, s);
}

export function gear(x, y, r, color = K.gray) {
  const pts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, rr = i % 2 ? r : r * 0.8;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return poly(pts, { fill: color, shade: 0.2 }) + oval(x, y, r * 0.28, r * 0.28, { fill: K.light, shade: 0 });
}

// 下がるグラフ
export function chartDown(x, y, s = 1) {
  let b = box(-220, -160, 440, 320, 16, { fill: K.white, shade: 0.12 });
  b += seg(-180, 120, 190, 120, { w: 6 }) + seg(-180, 120, -180, -130, { w: 6 });
  b += stroke([[-170, -100], [-90, -60], [-20, -80], [60, 20], [160, 90]], { w: 14, color: K.red });
  b += poly([[160, 90], [118, 92], [150, 56]], { fill: K.red, w: 5, shade: 0 });
  return g(b, x, y, s);
}
