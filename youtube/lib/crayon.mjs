// クレヨン風の線画をコードで描くための部品集（画像生成AIは使わない）
// すべて SVG 文字列を返す。座標は 1920x1080 のキャンバス基準。

// ---------- 乱数（毎回同じ絵になるようにシード付き） ----------
let _seed = 1;
export function seed(n) { _seed = n >>> 0 || 1; }
function rnd() {
  _seed |= 0; _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const j = (a) => (rnd() * 2 - 1) * a; // ±a のゆらぎ
// 形（座標）から乱数の種を決める：同じ形なら毎コマ同じ線、動いた部分だけ描き直される（手描きアニメと同じ）
let _salt = 0;
export function salt(n) { _salt = n | 0; }
function hseed(...nums) {
  let h = 2166136261 ^ _salt;
  for (const v of nums.flat(3)) { h = Math.imul(h ^ Math.round((+v || 0) * 10), 16777619); }
  _seed = (h >>> 0) || 1;
}

// ---------- 色（クレヨン12色くらいのイメージ） ----------
export const C = {
  ink: '#2b2622', paper: '#f6efe0', white: '#fffdf7',
  red: '#e0473c', orange: '#f08a2c', yellow: '#f6c632', green: '#4aa564',
  blue: '#3f7fd1', sky: '#8cc4ec', brown: '#9a6a3f', pink: '#f2a0a8',
  gray: '#a8a29a', dark: '#3d3a36', gold: '#e8b43a', rice: '#fbf8ef', skin: '#f7d7b5',
  fur: '#c47a3c', furDark: '#8f5226', cream: '#f8e6c8',
};

// ---------- 絵柄テーマ ----------
const BASE = { ...C };
export const THEMES = {
  crayon: { label: 'A クレヨン', bg: 'paper', paper: '#f6efe0', ink: '#2b2622', lineW: 1, fill: 'crayon', grain: 1.75, fillGrain: 1.95, fillOpacity: 0.92 },
  pencil: { label: 'B 色えんぴつ', bg: 'paper', paper: '#fbf8f1', ink: '#4a4038', lineW: 0.55, fill: 'hatch', grain: 1.9, fillGrain: 2.2, fillOpacity: 0.95 },
  marker: { label: 'C ノートにマジック', bg: 'notebook', paper: '#fdfdfb', ink: '#161616', lineW: 1.25, fill: 'flat', grain: 2.6, fillGrain: 2.6, fillOpacity: 1 },
  chalk:  { label: 'D 黒板チョーク', bg: 'board', paper: '#2e4a3b', ink: '#f3f0e6', lineW: 1, fill: 'crayon', grain: 1.8, fillGrain: 2.15, fillOpacity: 1, dark: '#59605c' },
  kraft:  { label: 'E クラフト紙', bg: 'paper', paper: '#cfa676', ink: '#2b2622', lineW: 1.05, fill: 'crayon', grain: 1.75, fillGrain: 2.0, fillOpacity: 0.95 },
};
export let T = THEMES.crayon;
export function setTheme(name) {
  T = THEMES[name] || THEMES.crayon;
  Object.assign(C, BASE, { paper: T.paper, ink: T.ink }, T.dark ? { dark: T.dark } : {});
}

// ---------- フィルター（クレヨンのざらざら＆線のゆれ） ----------
// boil を変えると線がわずかに震える＝手描きアニメっぽい「ゆれ」
export function defs(boil = 0) {
  return `<defs>
  <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${3 + boil * 7}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="grain" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${11 + boil}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 ${T.grain}" result="mask"/>
    <feComposite in="SourceGraphic" in2="mask" operator="in" result="tex"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="${5 + boil * 3}" result="n2"/>
    <feDisplacementMap in="tex" in2="n2" scale="6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="fillgrain" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.7 0.12" numOctaves="3" seed="${21 + boil}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 ${T.fillGrain}" result="mask"/>
    <feComposite in="SourceGraphic" in2="mask" operator="in" result="tex"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="${8 + boil * 5}" result="n2"/>
    <feDisplacementMap in="tex" in2="n2" scale="7" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  ${hatchPatterns()}
  <filter id="paper">
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="2" result="p"/>
    <feColorMatrix in="p" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.10 0"/>
  </filter>
</defs>`;
}

function hatchPatterns() {
  if (T.fill !== 'hatch') return '';
  return [...new Set(Object.values(C))].map((c) =>
    `<pattern id="h${c.slice(1)}" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
      <line x1="0" y1="3" x2="13" y2="3" stroke="${c}" stroke-width="7" stroke-linecap="round"/></pattern>`).join('');
}

export function paper(W = 1920, H = 1080) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  if (T.bg === 'notebook') {
    for (let y = 120; y < H; y += 64) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#9cc3e4" stroke-width="2"/>`;
    s += `<line x1="150" y1="0" x2="150" y2="${H}" stroke="#e79a9a" stroke-width="3"/>`;
  }
  if (T.bg === 'board') {
    s += `<rect width="${W}" height="${H}" filter="url(#paper)" opacity="0.9"/>`;
    s += `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#7a5a3a" stroke-width="40"/>`;
    return s;
  }
  return s + `<rect width="${W}" height="${H}" filter="url(#paper)"/>`;
}

// ---------- パス生成 ----------
function toPath(pts, closed = false) {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + 'Z' : d;
}

// 2点間を細かく割って、手のブレを足す
function shaky(pts, amp) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(2, Math.round(len / 60));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push([a[0] + (b[0] - a[0]) * t + j(amp), a[1] + (b[1] - a[1]) * t + j(amp)]);
    }
  }
  const last = pts[pts.length - 1];
  out.push([last[0] + j(amp), last[1] + j(amp)]);
  return out;
}

const strokeAttr = (color, w) =>
  `fill="none" stroke="${color}" stroke-width="${(w * T.lineW).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" filter="url(#grain)"`;

// ---------- 基本図形 ----------
// 折れ線（クレヨンで2回なぞる）
export function line(pts, { color = C.ink, w = 7, amp = 2.5, passes = 2 } = {}) {
  hseed(pts, w);
  let s = '';
  for (let k = 0; k < passes; k++) {
    s += `<path d="${toPath(shaky(pts, amp))}" ${strokeAttr(color, k ? w * 0.75 : w)} opacity="${k ? 0.75 : 1}"/>`;
  }
  return s;
}

// 楕円の点列（少しいびつ）
function ellipsePts(cx, cy, rx, ry, n = 18, wob = 0.035) {
  const pts = [];
  const a0 = rnd() * Math.PI * 2;
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    const r = 1 + j(wob);
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}

// 塗り（ざらざら、輪郭から少しはみ出す/ずれる）
function fillPath(d, color, opacity = T.fillOpacity) {
  if (T.fill === 'hatch') {
    return `<path d="${d}" fill="${color}" opacity="0.28" filter="url(#wobble)"/>` +
      `<path d="${d}" fill="url(#h${color.slice(1)})" opacity="0.9" filter="url(#fillgrain)"/>`;
  }
  if (T.fill === 'flat') return `<path d="${d}" fill="${color}" opacity="${opacity}" filter="url(#wobble)"/>`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}" filter="url(#fillgrain)"/>`;
}

export function ellipse(cx, cy, rx, ry, { fill, color = C.ink, w = 7, wob } = {}) {
  hseed(cx, cy, rx, ry, w);
  let s = '';
  if (fill) s += fillPath(toPath(ellipsePts(cx + j(5), cy + j(5), rx, ry, 18, wob ?? 0.03), true), fill);
  if (color === null) return s; // 塗りだけ
  // 輪郭：一周より少し多めに描いて「描き終わり」が重なる感じ
  const pts = ellipsePts(cx, cy, rx, ry, 20, wob ?? 0.03);
  pts.push([pts[0][0] + j(4), pts[0][1] + j(4)], [pts[1][0] + j(6), pts[1][1] + j(6)]);
  s += `<path d="${toPath(pts)}" ${strokeAttr(color, w)}/>`;
  return s;
}

export function poly(pts, { fill, color = C.ink, w = 7, amp = 2.5, closed = true } = {}) {
  hseed(pts, w, 7);
  let s = '';
  const all = closed ? [...pts, pts[0]] : pts;
  if (fill) s += fillPath(toPath(shaky(all, amp * 1.5)) + (closed ? 'Z' : ''), fill);
  if (color) s += line(all, { color, w, amp });
  return s;
}

export function rect(x, y, w, h, opts = {}) {
  return poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], opts);
}

// 角丸っぽい四角（点を多めにとる）
export function blob(x, y, w, h, r, opts = {}) {
  const pts = [];
  const corners = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
  for (const [cx, cy, a0] of corners) {
    for (let k = 0; k <= 3; k++) {
      const a = ((a0 + k * 30) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return poly(pts, opts);
}

export function arrow(x1, y1, x2, y2, { color = C.ink, w = 8, head = 34 } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h1 = [x2 - head * Math.cos(a - 0.5), y2 - head * Math.sin(a - 0.5)];
  const h2 = [x2 - head * Math.cos(a + 0.5), y2 - head * Math.sin(a + 0.5)];
  return line([[x1, y1], [x2, y2]], { color, w }) + line([h1, [x2, y2], h2], { color, w });
}

// 太い上向き矢印（値上がりの印）
export function bigUp(x, y, s = 1, color = C.red) {
  const P = (px, py) => [x + px * s, y + py * s];
  return poly([P(0, -120), P(70, -40), P(30, -40), P(30, 90), P(-30, 90), P(-30, -40), P(-70, -40)], { fill: color, w: 6 });
}

// 手書き文字
export function text(str, x, y, { size = 64, color = C.ink, anchor = 'middle', font = 'Yomogi', weight = 400, rot = 0 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" transform="rotate(${rot} ${x} ${y})" filter="url(#wobble)">${str}</text>`;
}

// 動きの線・汗など
export function sparkles(x, y, r = 50, color = C.ink) {
  let s = '';
  for (let i = 0; i < 3; i++) {
    const a = (-60 + i * 35) * Math.PI / 180;
    s += line([[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + 30), y + Math.sin(a) * (r + 30)]], { color, w: 6 });
  }
  return s;
}

export function g(inner, x = 0, y = 0, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
}
