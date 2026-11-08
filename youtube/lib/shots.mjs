// 「1行＝1カット」で映像を組むための道具（参考チャンネルの撮り方）
import { C } from './crayon.mjs';
import { tw, ease, clamp, lerp } from './anim.mjs';

// 画面の大きさ（横動画 1920×1080／ショート 1080×1920）。animate.mjs が setCanvas で設定する
let CW = 1920, CH = 1080;
export function setCanvas(w, h) { CW = w; CH = h; }

// ナレーションの k 行目が読まれている間は、list[k] のカットを出す。
// 各カットには (tl＝そのカット内の秒, dur＝カットの長さ, t＝場面全体の秒) が渡される。
// list[k] を配列 [f1, f2, …] にすると、その行の途中で別の絵に切りかわる（字幕の区切りに合わせる）。
// カットの変わり目には、パッと寄って落ち着く／横に流れる／ズームで飛びこむ、を混ぜる。
const wrap = (inner, z, x, y) => `<g transform="translate(${CW / 2} ${CH / 2}) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})">${inner}</g>`;
function flat(c, list) {
  // [{f, a, b}]：絵ごとの開始・終了時刻
  const out = [];
  for (let k = 0; k < list.length; k++) {
    const a = k === 0 ? 0 : c.at(k), b = k + 1 < list.length ? c.at(k + 1) : c.d;
    const fs = Array.isArray(list[k]) ? list[k] : [list[k]];
    const n = fs.length;
    // 区切り時刻：均等割りに一番近い字幕の区切り（なければ均等割り）
    const marks = (c.subs || []).map((u) => u.from).filter((x) => x > a + 1.2 && x < b - 1.2);
    let prev = a;
    fs.forEach((f, i) => {
      let end = b;
      if (i < n - 1) {
        const ideal = a + ((b - a) * (i + 1)) / n;
        const near = marks.filter((x) => x > prev + 1.2).sort((p, q) => Math.abs(p - ideal) - Math.abs(q - ideal))[0];
        end = near !== undefined && Math.abs(near - ideal) < (b - a) / n / 2 ? near : ideal;
      }
      out.push({ f, a: prev, b: end, line: k });
      prev = end;
    });
  }
  return out;
}
// 効果音用：カットの切りかわり（場面の頭からの秒と、切りかえ方）を記録する
export const CUTS = new Map();
export function shots(t, c, list) {
  const L = flat(c, list);
  let k = 0;
  for (let i = 0; i < L.length; i++) if (t >= L[i].a - 0.05) k = i;
  const draw = (i, tt) => L[i].f(tt - L[i].a, Math.max(0.5, L[i].b - L[i].a), tt);
  let inner = draw(k, t);
  const tin = t - L[k].a, T = 0.3;
  const kinds = ['punch', 'whip', 'punch', 'dive', 'whipUp', 'cut'];
  const kind = k === 0 ? 'dive' : kinds[(k * 7 + Math.round(c.d)) % kinds.length];
  if (c.start !== undefined) CUTS.set(`${(c.start + L[k].a).toFixed(2)}`, { t: +(c.start + L[k].a).toFixed(3), kind, first: k === 0 });
  if (tin < T) {
    const e = ease.out(clamp(tin / T));
    if (kind === 'punch') inner = wrap(inner, lerp(1.06, 1, e), CW / 2, CH / 2);
    if (kind === 'dive') inner = wrap(inner, lerp(1.3, 1, e), CW / 2, CH / 2) + `<rect x="-400" y="-400" width="2800" height="2800" fill="#fff" opacity="${(0.45 * (1 - e)).toFixed(3)}"/>`;
    if ((kind === 'whip' || kind === 'whipUp') && k > 0) {
      const prev = draw(k - 1, L[k].a - 0.001);
      const dx = kind === 'whip' ? CW : 0, dy = kind === 'whipUp' ? CH : 0;
      inner = `<g transform="translate(${(-dx * e).toFixed(1)} ${(-dy * e).toFixed(1)})">${prev}</g><g transform="translate(${(dx * (1 - e)).toFixed(1)} ${(dy * (1 - e)).toFixed(1)})">${inner}</g>`;
    }
  }
  return inner;
}

// カット内でカメラをゆっくり動かす（寄る・引く・横へ流れる）
export function cam(inner, tl, dur, { z0 = 1, z1 = 1.08, x0 = CW / 2, x1 = x0, y0 = CH / 2, y1 = y0 } = {}) {
  const k = ease.inOut(clamp(tl / dur));
  const z = 1 + (lerp(z0, z1, k) - 1) * 1.8, x = CW / 2 + (lerp(x0, x1, k) - CW / 2) * 1.3, y = CH / 2 + (lerp(y0, y1, k) - CH / 2) * 1.3;
  return `<g transform="translate(${CW / 2} ${CH / 2}) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})">${inner}</g>`;
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
export const fill = (col) => `<rect x="-400" y="-400" width="2800" height="2800" fill="${col}"/>`;
// 中心が明るいスポットライト
let _g = 0;
export const glow = (x, y, r, col = '#fff6d8', op = 0.22) => {
  const id = `glw${++_g}`;
  return `<radialGradient id="${id}"><stop offset="0%" stop-color="${col}" stop-opacity="${op * 1.6}"/><stop offset="60%" stop-color="${col}" stop-opacity="${op * 0.6}"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></radialGradient>` +
    `<ellipse cx="${x}" cy="${y}" rx="${r * 1.3}" ry="${r * 1.1}" fill="url(#${id})"/>`;
};
