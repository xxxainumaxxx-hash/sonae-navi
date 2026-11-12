// クレヨン調の小物（アシックス回など、靴・スポーツ）。実在のロゴ・マーク・商品の形はまねない（靴は一般的な形）。
import { C, ellipse, line, poly, rect, text, g } from './crayon.mjs';

const RUBBER = '#e9e2cf', SOLE = '#c9a46a';

// 運動靴（横から、右向き）。col：本体の色、high：くるぶしまでの高い靴（バスケット用）
export function shoe(x, y, s = 1, { col = '#f4efe2', accent = '#2f4a7a', high = false, holes = false } = {}) {
  const top = high ? -170 : -110;
  let b = poly([[-170, -20], [-170, top], [-90, top - 10], [-40, -70], [60, -80], [150, -60], [190, -30], [190, -20]], { fill: col });
  b += rect(-180, -24, 380, 28, { fill: RUBBER, w: 6 });
  b += line([[-60, -64], [-20, -44]], { w: 5, passes: 1 }) + line([[-30, -74], [10, -54]], { w: 5, passes: 1 }) + line([[0, -82], [40, -62]], { w: 5, passes: 1 });
  b += line([[-140, -40], [100, -40]], { w: 8, color: accent, passes: 1 });
  if (holes) for (let i = 0; i < 4; i++) b += ellipse(-120 + i * 26, top + 30 + (high ? 20 : 10), 6, 6, { fill: '#2b2622', w: 2 });
  return g(b, x, y, s);
}

// 靴の底（下から見た形）。cups：吸盤のようなくぼみ（0〜1で見えてくる）
export function sole(x, y, s = 1, cups = 0) {
  let b = poly([[-90, -230], [-30, -260], [40, -250], [90, -200], [95, -40], [80, 120], [40, 220], [-30, 230], [-75, 170], [-90, 40]], { fill: RUBBER });
  if (cups > 0) for (let r = 0; r < 7; r++) for (let c = 0; c < 3; c++) {
    if ((r * 3 + c) / 21 > cups) continue;
    b += ellipse(-45 + c * 45, -190 + r * 60, 16, 16, { fill: '#c9b89a', w: 4 }) + ellipse(-45 + c * 45, -190 + r * 60, 7, 7, { fill: '#a89878', w: 2 });
  }
  return g(b, x, y, s);
}

// タコの足の形（中心線・左右のふち・吸盤の位置）。tentacle と tentacleCup で共通
function tentacleGeo(curl) {
  const N = 28, pts = [];
  for (let i = 0; i <= N; i++) { const t = i / N; pts.push([t * 380 - 190, -Math.sin(t * Math.PI * (0.9 + curl)) * 80 * (1 - t * 0.3) + t * t * curl * 60]); }
  const L = [], R = [], cups = [];
  for (let i = 0; i <= N; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const w = 38 * (1 - (i / N) * 0.85);
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
    if (i % 3 === 1 && i < N - 1) cups.push([pts[i][0] - nx * w * 0.55, pts[i][1] - ny * w * 0.55, w * 0.45]);
  }
  return { L, R, cups };
}

// タコの足（吸盤つき）。curl：0〜1で丸まる。根元が太く、先が細い、なめらかな形
export function tentacle(x, y, s = 1, curl = 0.3) {
  const { L, R, cups } = tentacleGeo(curl);
  let b = poly([...L, ...R.reverse()], { fill: '#c8605a' });
  for (const [cx, cy, r] of cups) b += ellipse(cx, cy, r, r, { fill: '#f2c4b8', w: 3 }) + ellipse(cx, cy, r * 0.4, r * 0.4, { fill: '#d88a80', w: 2 });
  return g(b, x, y, s);
}

// タコの足の k 番目の吸盤が、画面のどこにあるか（丸で指すとき用）。[x, y, 半径]
export function tentacleCup(x, y, s, curl, k) {
  const c = tentacleGeo(curl).cups[k];
  return [x + c[0] * s, y + c[1] * s, c[2] * s];
}

// 虎（横から、右向き、走る）。t：走りの動き
export function tiger(x, y, s = 1, t = 0) {
  const OR = '#e8902c', WH = '#fbf3e2', K = '#2b2622', a = Math.sin(t * 10);
  const legC = (lx, ph, far) => {
    const sw = Math.sin(ph) * 70;
    return line([[lx, -130], [lx + sw * 0.5, -64], [lx + sw, -4]], { w: 40, color: far ? '#c8761e' : OR, passes: 1 }) + ellipse(lx + sw + 6, -4, 22, 12, { fill: far ? '#c8761e' : OR, w: 4 });
  };
  let b = '';
  // 奥の足
  b += legC(-150, t * 10 + Math.PI, true) + legC(130, t * 10, true);
  // しっぽ（しま入り、先が黒）
  b += line([[-230, -170], [-310, -230 + a * 10], [-360, -300 + a * 16]], { w: 22, color: OR, passes: 1 });
  b += ellipse(-362, -304 + a * 16, 14, 14, { fill: K, w: 2 });
  // 胴体と白いおなか
  b += ellipse(-20, -170, 230, 82, { fill: OR });
  b += ellipse(-20, -118, 170, 30, { fill: WH, color: null });
  // 胴体のしま（上から下へ、細くなるくさび形）
  for (const sx of [-180, -110, -40, 30, 100]) b += poly([[sx - 14, -248], [sx + 14, -246], [sx + 4, -170], [sx - 2, -170]], { fill: K, color: null });
  // 手前の足
  b += legC(-120, t * 10, false) + legC(160, t * 10 + Math.PI, false);
  // 頭
  b += ellipse(230, -230, 96, 86, { fill: OR });
  b += ellipse(180, -310, 26, 26, { fill: OR }) + ellipse(180, -310, 12, 12, { fill: K, color: null });
  b += ellipse(280, -306, 26, 26, { fill: OR }) + ellipse(280, -306, 12, 12, { fill: K, color: null });
  b += ellipse(286, -196, 52, 40, { fill: WH });
  b += poly([[272, -222], [302, -222], [287, -204]], { fill: K, color: null });
  b += line([[287, -204], [287, -188], [270, -180]], { w: 4, passes: 1 }) + line([[287, -188], [304, -180]], { w: 4, passes: 1 });
  b += ellipse(250, -250, 10, 12, { fill: K, w: 2 }) + ellipse(310, -250, 10, 12, { fill: K, w: 2 });
  // 顔のしま
  b += poly([[220, -316], [236, -316], [230, -282]], { fill: K, color: null }) + poly([[150, -250], [190, -244], [150, -236]], { fill: K, color: null }) + poly([[152, -214], [188, -214], [152, -200]], { fill: K, color: null });
  return g(b, x, y, s);
}

// バスケットボールのコート（上から見た形）
export function court(x, y, w = 900, h = 480) {
  const L = x - w / 2, T = y - h / 2, W = '#fdfbf3', kw = w * 0.2, kh = h * 0.36;
  let b = rect(L, T, w, h, { fill: '#d9a35e' });
  for (let i = 1; i < 8; i++) b += line([[L, T + (h * i) / 8], [L + w, T + (h * i) / 8]], { w: 2, color: '#c48a48', passes: 1 });
  b += rect(L + 20, T + 20, w - 40, h - 40, { fill: 'none', color: W, w: 6 });
  b += line([[x, T + 20], [x, T + h - 20]], { w: 6, color: W, passes: 1 }) + ellipse(x, y, h * 0.14, h * 0.14, { fill: 'none', color: W, w: 6 });
  for (const side of [-1, 1]) {
    const ex = side < 0 ? L + 20 : L + w - 20, kx = side < 0 ? ex : ex - kw;
    b += rect(kx, y - kh / 2, kw, kh, { fill: '#b8553a', color: W, w: 6 });
    const fx = ex + side * -kw;
    b += ellipse(fx, y, kh / 2, kh / 2, { fill: 'none', color: W, w: 6 });
    const R = h * 0.42, pts = [];
    for (let k = 0; k <= 20; k++) { const th = -Math.PI / 2 + (Math.PI * k) / 20; pts.push([ex - side * Math.cos(th) * R * 1.1, y + Math.sin(th) * R]); }
    b += line(pts, { w: 6, color: W, passes: 1 });
    // ゴール（リング）
    b += line([[ex, y - 40], [ex, y + 40]], { w: 8, color: '#5a5a5a', passes: 1 }) + ellipse(ex - side * 30, y, 22, 22, { fill: 'none', color: '#e8602c', w: 7 });
  }
  return b;
}

// タコとキュウリの酢の物（小皿）
export function sunomono(x, y, s = 1) {
  let b = ellipse(0, 0, 200, 60, { fill: '#fdfbf3' }) + ellipse(0, -6, 150, 36, { fill: '#e6eef2', w: 4 });
  for (let i = 0; i < 6; i++) b += ellipse(-100 + i * 40, -14 - (i % 2) * 8, 22, 12, { fill: '#8fb07a', w: 3 }) + ellipse(-100 + i * 40, -14 - (i % 2) * 8, 10, 5, { fill: '#dfe9c8', w: 2 });
  for (let i = 0; i < 4; i++) b += ellipse(-70 + i * 50, -24 + (i % 2) * 6, 24, 16, { fill: '#c8605a', w: 3 }) + ellipse(-70 + i * 50, -20 + (i % 2) * 6, 6, 6, { fill: '#f2c4b8', w: 2 });
  return g(b, x, y, s);
}

// はし
export function chopsticks(x, y, s = 1, rot = -20) {
  return g(`<g transform="rotate(${rot})">${line([[-200, -10], [180, -2]], { w: 10, color: '#7a5a34', passes: 1 }) + line([[-200, 14], [180, 6]], { w: 10, color: '#7a5a34', passes: 1 })}</g>`, x, y, s);
}

// バスケットボール
export function basketball(x, y, r = 50) {
  return ellipse(x, y, r, r, { fill: '#e07a3a' }) + line([[x - r, y], [x + r, y]], { w: 5, passes: 1 }) + line([[x, y - r], [x, y + r]], { w: 5, passes: 1 }) +
    `<path d="M ${x - r * 0.7} ${y - r * 0.7} q ${r * 0.5} ${r * 0.7} 0 ${r * 1.4}" fill="none" stroke="${C.ink}" stroke-width="5"/><path d="M ${x + r * 0.7} ${y - r * 0.7} q ${-r * 0.5} ${r * 0.7} 0 ${r * 1.4}" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
}

// 体育館（板の床と、かご）
export function gym(y = 880) {
  let b = rect(-200, -200, 2400, y + 200, { fill: '#e8dcc4', color: null });
  for (let i = 0; i < 12; i++) b += rect(-200 + i * 200, y, 200, 400, { fill: i % 2 ? '#c99a5a' : '#c4945a', w: 3 });
  b += line([[-200, y + 90], [2200, y + 70]], { w: 5, color: '#f4efe2', passes: 1 });
  b += rect(1560, 200, 220, 150, { fill: C.white, w: 6 }) + rect(1620, 270, 100, 60, { fill: 'none', w: 5 }) + ellipse(1670, 370, 50, 14, { fill: 'none', color: '#d2523a', w: 6 });
  b += line([[1670, 384], [1650, 460]], { w: 3, passes: 1 }) + line([[1670, 384], [1690, 460]], { w: 3, passes: 1 });
  return b;
}

// 黒板
export function blackboard(x, y, w = 700, h = 400) {
  return rect(x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 40, { fill: '#8a6a40' }) + rect(x - w / 2, y - h / 2, w, h, { fill: '#2f4a3a', w: 5 });
}

// 足の裏とマメ
export function footBlister(x, y, s = 1, blister = 1) {
  let b = poly([[-60, -200], [10, -220], [70, -190], [80, -60], [60, 80], [70, 180], [20, 220], [-40, 200], [-60, 100], [-80, -60]], { fill: '#f6d2b0' });
  for (let i = 0; i < 5; i++) b += ellipse(-50 + i * 30, -225 + Math.abs(i - 2) * 8, 16, 18, { fill: '#f6d2b0', w: 4 });
  if (blister) b += ellipse(0, 120, 34 * blister, 30 * blister, { fill: '#f2a0a0', w: 4 }) + ellipse(30, -120, 26 * blister, 22 * blister, { fill: '#f2a0a0', w: 4 });
  return g(b, x, y, s);
}

// 走る人（横向き・右へ）。t：足の動き、shirt / pants：色、shoes：靴をはく
function shade(hex, k = 0.72) {
  const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(v * k).toString(16).padStart(2, '0');
  return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255);
}
export function runner(x, y, s = 1, t = 0, { shirt = '#3a6ea5', pants = '#2b2622', skin = '#f6d2b0', hair = '#2a2420', shoes = true, num = '' } = {}) {
  const a = Math.sin(t * 9), L1 = 100, L2 = 100;
  // ふち取りした太い線（明るい背景でも手足が見えるように）
  const limb = (pts, w, col) => line(pts, { w: w + 8, color: C.ink, passes: 1 }) + line(pts, { w, color: col, passes: 1 });
  const leg = (ph, far) => {
    const th = ph * 0.6, kx = Math.sin(th) * L1, ky = Math.cos(th) * L1;
    // うしろに蹴った足は、ひざが曲がって足先が上がる（地面に寝ないように）
    const ang = th - 0.2 - Math.max(0, -ph) * 0.9, fx = kx + Math.sin(ang) * L2, fy = ky + Math.cos(ang) * L2;
    const pc = far ? shade(pants) : pants, sk = far ? shade(skin, 0.85) : skin;
    // もも（パンツの色）と、すね（肌の色）
    return limb([[0, -200], [kx, -200 + ky]], 24, pc) + limb([[kx, -200 + ky], [fx, -200 + fy]], 22, sk) +
      (shoes ? ellipse(fx + 18, -200 + fy + 6, 26, 12, { fill: far ? '#d8d0bc' : '#f4efe2', w: 4 }) : ellipse(fx + 14, -200 + fy + 4, 20, 9, { fill: sk, w: 4 }));
  };
  const arm = (ph, far) => limb([[10, -350], [10 + ph * 50, -290], [10 + ph * 50 + 40, -270 - ph * 20]], 16, far ? shade(skin, 0.85) : skin);
  let b = leg(-a, true) + arm(-a, true);
  b += poly([[-28, -200], [26, -200], [40, -360], [-10, -370]], { fill: shirt });
  if (num) b += rect(-12, -330, 44, 40, { fill: C.white, w: 3 }) + text(num, 10, -300, { size: 28, font: 'Zen Maru Gothic', weight: 900 });
  b += leg(a, false);
  b += poly([[-28, -200], [26, -200], [30, -250], [-24, -250]], { fill: shirt, color: null });
  b += arm(a, false);
  b += ellipse(20, -420, 54, 52, { fill: skin }) + poly([[-34, -430], [-30, -470], [20, -480], [64, -450], [40, -455], [0, -450]], { fill: hair });
  b += ellipse(48, -428, 5, 6, { fill: C.ink, w: 2 }) + ellipse(40, -402, 10, 6, { fill: C.pink, color: null });
  return g(b, x, y, s);
}

// 石畳の道
export function cobble(y = 880) {
  let b = rect(-200, y, 2400, 400, { fill: '#b8b0a4', color: null });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 22; c++) b += rect(-200 + c * 110 + (r % 2) * 55, y + 10 + r * 50, 100, 42, { fill: (r + c) % 3 ? '#a8a094' : '#c4bcb0', w: 3 });
  return b;
}

// メダル
export function medal(x, y, s = 1, col = '#c98a4a', label = '3') {
  return g(line([[-40, -160], [0, -50]], { w: 16, color: '#3a6ea5', passes: 1 }) + line([[40, -160], [0, -50]], { w: 16, color: '#d2523a', passes: 1 }) + ellipse(0, 0, 60, 60, { fill: col }) + text(label, 0, 22, { size: 60, font: 'Zen Maru Gothic', weight: 900 }), x, y, s);
}

// テレビ（昔の箱型）。inner：画面に描くもの（-150〜150, -100〜100 の中）
export function oldTV(x, y, s = 1, inner = '') {
  return g(rect(-200, -150, 400, 280, { fill: '#7a5a3a' }) + rect(-160, -120, 320, 220, { fill: '#cfe0e8', w: 6 }) + `<g>${inner}</g>` +
    line([[-60, 130], [-90, 190]], { w: 8, passes: 1 }) + line([[60, 130], [90, 190]], { w: 8, passes: 1 }), x, y, s);
}

// 靴の箱
export function shoeBox(x, y, s = 1, col = '#d2523a') {
  return g(rect(-90, -60, 180, 60, { fill: col }) + rect(-96, -76, 192, 22, { fill: col, w: 5 }) + line([[-60, -30], [60, -30]], { w: 4, color: '#f4efe2', passes: 1 }), x, y, s);
}

// 車（トランクを開けた、うしろから見た形）
export function carTrunk(x, y, s = 1) {
  let b = rect(-260, -200, 520, 200, { fill: '#5a6e8a' }) + poly([[-220, -200], [-160, -320], [160, -320], [220, -200]], { fill: '#5a6e8a' });
  b += rect(-200, -190, 400, 120, { fill: '#2b2b30', w: 5 }) + poly([[-220, -320], [220, -320], [200, -440], [-200, -440]], { fill: '#6b7f9a' });
  for (let i = 0; i < 3; i++) b += shoeBox(-120 + i * 120, -80, 0.6, ['#d2523a', '#3a6ea5', '#f2c230'][i]);
  b += ellipse(-180, 10, 40, 40, { fill: '#2b2b30' }) + ellipse(180, 10, 40, 40, { fill: '#2b2b30' });
  return g(b, x, y, s);
}

// 契約書（rip：0〜1で二つに裂ける）
export function contract(x, y, s = 1, rip = 0) {
  const half = (dx, rot, clip) => `<g transform="translate(${dx} 0) rotate(${rot})">${rect(clip ? 0 : -150, -200, 150, 400, { fill: '#fdfbf3' }) +
    [0, 1, 2, 3, 4].map((i) => line([[clip ? 20 : -130, -140 + i * 60], [clip ? 130 : -20, -140 + i * 60]], { w: 4, color: '#9a9488', passes: 1 })).join('')}</g>`;
  return g(half(-rip * 80, -rip * 12, false) + half(rip * 80, rip * 12, true), x, y, s);
}
