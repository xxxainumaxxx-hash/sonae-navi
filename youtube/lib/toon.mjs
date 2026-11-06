// くっきりカートゥーン調（太い黒線・影・ドラマチックな照明）を SVG で描く部品集
// 画像生成AIは使わない。座標は 1920x1080。

// ---------- 乱数 ----------
let _seed = 1;
export function seed(n) { _seed = n >>> 0 || 1; _id = 0; }
function rnd() {
  _seed |= 0; _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const j = (a) => (rnd() * 2 - 1) * a;
let _id = 0;
const uid = (p) => `${p}${++_id}`;

// ---------- 色 ----------
export const K = {
  ink: '#1c1a1a', white: '#fffaf2', skin: '#f3c9a0', skinShade: '#d9a679',
  red: '#d8423a', darkRed: '#7e1f1c', orange: '#ee8a2e', yellow: '#f5c542', gold: '#d9a236',
  green: '#4f9a5a', teal: '#2f7f86', blue: '#3a6fc4', navy: '#1f2f55', sky: '#9fd0f0',
  brown: '#8a5a34', wood: '#b07a46', darkWood: '#6b4325', gray: '#9a9693', light: '#e9e3d8',
  black: '#242424', hair: '#2a2420', cream: '#f6ecd6', purple: '#6a4c9c',
};

// ---------- 共通の定義（boil で線がわずかに揺れる） ----------
export function defs(boil = 0) {
  return `<defs>
  <filter id="boil" x="-3%" y="-3%" width="106%" height="106%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${4 + boil * 9}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="film">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${30 + boil}" result="p"/>
    <feColorMatrix in="p" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.07 0"/>
  </filter>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
  </radialGradient>
</defs>`;
}

// 全体を包む：線の揺れ＋フィルム粒子＋周辺減光
export function frame(inner) {
  return `<rect width="1920" height="1080" fill="#111"/>
<g filter="url(#boil)"><g transform="translate(960 540) scale(1.012) translate(-960 -540)">${inner}</g></g>
<rect width="1920" height="1080" fill="url(#vig)"/>
<rect width="1920" height="1080" filter="url(#film)"/>`;
}

// ---------- 背景 ----------
// スポットライトのような放射グラデーション
export function stage(base, glow, { x = 50, y = 40 } = {}) {
  const id = uid('bg');
  return `<radialGradient id="${id}" cx="${x}%" cy="${y}%" r="70%">
    <stop offset="0%" stop-color="${glow}"/><stop offset="100%" stop-color="${base}"/></radialGradient>
  <rect width="1920" height="1080" fill="url(#${id})"/>`;
}

// 光の筋
export function rays(cx, cy, color = '#fff', n = 12, op = 0.08) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, b = a + Math.PI / n / 1.4;
    s += `<path d="M${cx},${cy} L${cx + Math.cos(a) * 2400},${cy + Math.sin(a) * 2400} L${cx + Math.cos(b) * 2400},${cy + Math.sin(b) * 2400}Z" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

export function floor(y, color, line = K.ink) {
  return `<rect x="-20" y="${y}" width="1960" height="${1100 - y}" fill="${color}"/>
  <path d="M-20,${y} L1940,${y}" stroke="${line}" stroke-width="6" opacity="0.5"/>`;
}

// カーテン（劇場）
export function curtains(color = K.darkRed) {
  let s = '';
  for (let i = 0; i < 24; i++) {
    const x = i * 84 - 20;
    s += `<path d="M${x},-10 C${x + 30},300 ${x - 20},700 ${x + 10},1090 L${x + 90},1090 C${x + 60},700 ${x + 110},300 ${x + 84},-10Z" fill="${color}" opacity="${0.75 + (i % 3) * 0.1}"/>`;
    s += `<path d="M${x + 42},0 C${x + 60},360 ${x + 30},700 ${x + 50},1090" stroke="#000" stroke-width="10" opacity="0.18" fill="none"/>`;
  }
  return s;
}

// ---------- パス ----------
export function smooth(pts, closed = true) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + 'Z' : d;
}
export const ellD = (cx, cy, rx, ry = rx) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1,0 ${cx + rx},${cy} A${rx},${ry} 0 1,0 ${cx - rx},${cy}Z`;
export const polyD = (pts) => `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' L')}Z`;
export const rrectD = (x, y, w, h, r) =>
  `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;

// ---------- 塗り＋影＋輪郭 ----------
// shade: 光は左上から。右下側に影（形をずらしたマスクで三日月状の影を作る）
export function shape(d, { fill = K.white, w = 7, stroke = K.ink, shade = 0.22, sx = 18, sy = 14, hi = false } = {}) {
  let s = `<path d="${d}" fill="${fill}"/>`;
  if (shade) {
    const m = uid('m');
    s += `<mask id="${m}"><rect x="-500" y="-500" width="3000" height="2200" fill="#fff"/><path d="${d}" fill="#000" transform="translate(${-sx} ${-sy})"/></mask>`;
    s += `<path d="${d}" fill="#000" opacity="${shade}" mask="url(#${m})"/>`;
  }
  if (hi) {
    const c = uid('c');
    s += `<clipPath id="${c}"><path d="${d}"/></clipPath><g clip-path="url(#${c})" opacity="0.35"><path d="${d}" fill="none" stroke="#fff" stroke-width="16" transform="translate(7 7)" filter="url(#soft)"/></g>`;
  }
  if (w) s += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
  return s;
}
export const oval = (cx, cy, rx, ry, o) => shape(ellD(cx, cy, rx, ry), o);
export const box = (x, y, w, h, r, o) => shape(rrectD(x, y, w, h, r), o);
export const poly = (pts, o) => shape(polyD(pts), o);
export const blob = (pts, o) => shape(smooth(pts), o);

export function stroke(pts, { w = 8, color = K.ink, closed = false, cap = 'round' } = {}) {
  return `<path d="${smooth(pts, closed)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
}
export function seg(x1, y1, x2, y2, { w = 8, color = K.ink } = {}) {
  return `<path d="M${x1},${y1} L${x2},${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}
// 太い腕・脚：輪郭付きのチューブ
export function tube(pts, { w = 34, fill = K.white, ink = K.ink, edge = 7 } = {}) {
  const d = smooth(pts, false);
  return `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + edge * 2}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ---------- 文字 ----------
// サムネ風の極太タイトル（白文字＋黒フチ＋影）
export function title(str, x, y, { size = 120, color = K.white, edge = 22, anchor = 'middle', rot = 0 } = {}) {
  const t = (fill, sw, dx = 0, dy = 0, op = 1) =>
    `<text x="${x + dx}" y="${y + dy}" font-family="Dela Gothic One" font-size="${size}" text-anchor="${anchor}" fill="${fill}" stroke="${K.ink}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke fill" opacity="${op}" transform="rotate(${rot} ${x} ${y})">${str}</text>`;
  return t('#000', edge, 8, 10, 0.35) + t(color, edge);
}
export function label(str, x, y, { size = 56, color = K.ink, anchor = 'middle', weight = 900, rot = 0 } = {}) {
  return `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="${weight}" font-size="${size}" text-anchor="${anchor}" fill="${color}" transform="rotate(${rot} ${x} ${y})">${str}</text>`;
}
// ラベル札（白い角丸＋文字）
export function tag(str, x, y, { size = 52, fill = K.white, color = K.ink, rot = -3 } = {}) {
  const w = str.length * size * 0.98 + 60, h = size + 40;
  return `<g transform="rotate(${rot} ${x} ${y})">${box(x - w / 2, y - h / 2, w, h, 18, { fill, shade: 0.12 })}${label(str, x, y + size * 0.36, { size, color })}</g>`;
}

export function g(inner, x = 0, y = 0, s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${inner}</g>`;
}

// 失敗スタンプ（×）
export function cross(x, y, s = 1, color = K.red) {
  return g(`<path d="M-70,-70 L70,70 M70,-70 L-70,70" stroke="${K.ink}" stroke-width="44" stroke-linecap="round"/>
  <path d="M-70,-70 L70,70 M70,-70 L-70,70" stroke="${color}" stroke-width="28" stroke-linecap="round"/>`, x, y, s);
}
// 効果線（驚き・ひらめき）
export function burst(x, y, r1, r2, n = 10, color = K.ink, w = 8) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    s += seg(x + Math.cos(a) * r1, y + Math.sin(a) * r1, x + Math.cos(a) * r2, y + Math.sin(a) * r2, { w, color });
  }
  return s;
}
