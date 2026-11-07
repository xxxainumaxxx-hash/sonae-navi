// 「1行＝1カット」で映像を組むための道具（参考チャンネルの撮り方）
import { C } from './crayon.mjs';
import { tw, ease, clamp, lerp } from './anim.mjs';

// ナレーションの k 行目が読まれている間は、list[k] のカットを出す。
// 各カットには (tl＝そのカット内の秒, dur＝カットの長さ, t＝場面全体の秒) が渡される。
export function shots(t, c, list) {
  let k = 0;
  for (let i = 0; i < list.length; i++) if (t >= c.at(i) - 0.05) k = i;
  const t0 = k === 0 ? 0 : c.at(k);
  const t1 = k + 1 < list.length ? c.at(k + 1) : c.d;
  return list[k](t - t0, Math.max(0.5, t1 - t0), t);
}

// カット内でカメラをゆっくり動かす（寄る・引く・横へ流れる）
export function cam(inner, tl, dur, { z0 = 1, z1 = 1.08, x0 = 960, x1 = x0, y0 = 540, y1 = y0 } = {}) {
  const k = ease.inOut(clamp(tl / dur));
  const z = lerp(z0, z1, k), x = lerp(x0, x1, k), y = lerp(y0, y1, k);
  return `<g transform="translate(960 540) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})">${inner}</g>`;
}

// 1文字ずつ打たれて出る文字（タイプライター風）
export function typeText(str, x, y, tl, { size = 90, color = C.white, cps = 12, font = 'Zen Maru Gothic', weight = 900, anchor = 'middle', delay = 0 } = {}) {
  const chars = [...str];
  const n = Math.max(0, Math.min(chars.length, Math.floor((tl - delay) * cps)));
  if (!n) return '';
  const cursor = n < chars.length && Math.floor(tl * 4) % 2 ? '｜' : '';
  return `<text x="${x}" y="${y}" font-family="${font}" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="${anchor}" filter="url(#wobble)">${chars.slice(0, n).join('')}${cursor}</text>`;
}

// 数字のカウントアップ（例：150,000,000）
export function countUp(target, tl, dur = 1.6) {
  const v = Math.round(target * ease.out(clamp(tl / dur)));
  return v.toLocaleString('en-US');
}

// 白フチの極太見出し
export function big(str, x, y, size, color, { stroke = C.white } = {}) {
  return `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke fill" filter="url(#wobble)">${str}</text>`;
}

// 画面いっぱいの色（クレヨンのざらつき無しのベタ。背景用）
export const fill = (col) => `<rect x="-200" y="-200" width="2320" height="1480" fill="${col}"/>`;
// 中心が明るいスポットライト
let _g = 0;
export const glow = (x, y, r, col = '#fff6d8', op = 0.22) => {
  const id = `glw${++_g}`;
  return `<radialGradient id="${id}"><stop offset="0%" stop-color="${col}" stop-opacity="${op * 1.6}"/><stop offset="60%" stop-color="${col}" stop-opacity="${op * 0.6}"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></radialGradient>` +
    `<ellipse cx="${x}" cy="${y}" rx="${r * 1.3}" ry="${r * 1.1}" fill="url(#${id})"/>`;
};
