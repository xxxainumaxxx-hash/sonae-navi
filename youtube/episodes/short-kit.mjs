// ショート（縦 1080×1920）用の共通の道具
// 画面の使い方：上のテロップ 150〜340／絵の主役 380〜1280／字幕 1290〜1380／その下はスマホのボタンと説明文で隠れる
import { C, text, ellipse, rect, line, poly } from '../lib/crayon.mjs';
import { kid, worker } from '../lib/cfolk.mjs';
import { sneakyCat } from '../lib/cprops.mjs';
import { cam as cam0, typeText, fill, glow } from '../lib/shots.mjs';
import { ease, clamp, lerp } from '../lib/anim.mjs';

export const RED = '#d23a33', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6';
export const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50], hold: [40, -60, 40, -60] };
export const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
export const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
export { kid, worker };
// 腰から上（縦画面）：顔が画面のまん中より少し上に来る
export const vmid = (fn, x, o = {}) => fn({ x, y: 1640, s: 2.5, ...o });
// 顔のアップ
export const vclose = (fn, x, o = {}) => fn({ x, y: 1980, s: 3.8, ...o });
// カメラ（縦画面の中心が基準）
export const cam = (inner, tl, d, o = {}) => cam0(inner, tl, d, o);
// 太いフチの文字
export const T = (str, x, y, size, color, stroke = INK) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
// 黒い画面に年号などを1文字ずつ
export const blackType = (str, tl, size = 130) => fill('#111') + typeText(str, 540, 900, tl, { size, color: C.white, cps: 7, font: 'Yomogi', weight: 400 });
// すみっこのネコ（全カット共通の小ネタ）
export const catCorner = (t, toy = '') => sneakyCat(170, 1500, t, toy);
export { fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp };
