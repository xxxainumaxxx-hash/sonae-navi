// 「1行＝1カット」で映像を組むための道具（参考チャンネルの撮り方）
import { C } from './crayon.mjs';
import { tw, ease, clamp, lerp } from './anim.mjs';

// ナレーションの k 行目が読まれている間は、list[k] のカットを出す。
// 各カットには (tl＝そのカット内の秒, dur＝カットの長さ, t＝場面全体の秒) が渡される。
// テンポ（参考動画に合わせる）：
//  ・1つのカットが長いときは、字幕の区切り（または約2.4秒ごと）で構図を変える（寄り・引き・横）＝2〜3秒ごとに画が変わる
//  ・カットの変わり目は、パッと寄って落ち着く／横に流れる／ズームで飛びこむ、を混ぜる
const BEAT = 2.4;
const FRAMES = [ // 構図の変え方（倍率, 中心x, 中心y）。端の見出しが切れない程度に
  [1.14, 880, 500], [0.95, 960, 540], [1.14, 1040, 500], [1.18, 960, 480], [1.12, 900, 520], [1.14, 1020, 490],
];
const wrap = (inner, z, x, y) => `<g transform="translate(960 540) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})">${inner}</g>`;
function beats(c, t0, t1) {
  // 字幕の区切りを優先して、構図を変える時刻を決める
  const cuts = [t0];
  for (const u of c.subs || []) if (u.from > cuts[cuts.length - 1] + 1.6 && u.from < t1 - 1.4) cuts.push(u.from);
  const out = [t0];
  for (let i = 0; i < cuts.length; i++) {
    const a = cuts[i], b = i + 1 < cuts.length ? cuts[i + 1] : t1;
    if (i) out.push(a);
    const n = Math.floor((b - a) / BEAT);
    for (let j = 1; j < n; j++) out.push(a + ((b - a) * j) / n);
  }
  return out;
}
export function shots(t, c, list) {
  let k = 0;
  for (let i = 0; i < list.length; i++) if (t >= c.at(i) - 0.05) k = i;
  const at = (i) => (i === 0 ? 0 : c.at(i));
  const end = (i) => (i + 1 < list.length ? c.at(i + 1) : c.d);
  const t0 = at(k), t1 = end(k);
  const draw = (i, tt) => list[i](tt - at(i), Math.max(0.5, end(i) - at(i)), tt);
  // いまのビート（構図）
  const bs = beats(c, t0, t1);
  let j = 0; for (let i = 0; i < bs.length; i++) if (t >= bs[i]) j = i;
  const seed = Math.round(c.d * 10) + k * 3;
  const bt = t - bs[j], bd = (j + 1 < bs.length ? bs[j + 1] : t1) - bs[j];
  let inner = draw(k, t);
  if (j > 0) {
    const [z, x, y] = FRAMES[(seed + j) % FRAMES.length];
    const dz = 0.04 * ease.inOut(clamp(bt / bd));
    inner = wrap(inner, z + dz, x, y);
  }
  // 変わり目の演出（カット・ビートの頭の0.3秒）
  const tin = t - (j > 0 ? bs[j] : t0);
  const kind = j > 0 ? 'punch' : k === 0 ? 'dive' : ['punch', 'whip', 'punch', 'dive', 'whipUp'][(seed + k) % 5];
  const T = 0.32;
  if (tin < T) {
    const e = ease.out(clamp(tin / T));
    if (kind === 'punch') inner = wrap(inner, lerp(1.07, 1, e), 960, 540);
    if (kind === 'dive') inner = wrap(inner, lerp(1.35, 1, e), 960, 540) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#fff" opacity="${(0.5 * (1 - e)).toFixed(3)}"/>`;
    if ((kind === 'whip' || kind === 'whipUp') && k > 0) {
      const prev = draw(k - 1, t0 - 0.001);
      const dx = kind === 'whip' ? 1920 : 0, dy = kind === 'whipUp' ? 1080 : 0;
      inner = `<g transform="translate(${(-dx * e).toFixed(1)} ${(-dy * e).toFixed(1)})">${prev}</g><g transform="translate(${(dx * (1 - e)).toFixed(1)} ${(dy * (1 - e)).toFixed(1)})">${inner}</g>`;
    }
  }
  return inner;
}

// カット内でカメラをゆっくり動かす（寄る・引く・横へ流れる）
export function cam(inner, tl, dur, { z0 = 1, z1 = 1.08, x0 = 960, x1 = x0, y0 = 540, y1 = y0 } = {}) {
  const k = ease.inOut(clamp(tl / dur));
  const z = 1 + (lerp(z0, z1, k) - 1) * 1.8, x = 960 + (lerp(x0, x1, k) - 960) * 1.3, y = 540 + (lerp(y0, y1, k) - 540) * 1.3;
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
