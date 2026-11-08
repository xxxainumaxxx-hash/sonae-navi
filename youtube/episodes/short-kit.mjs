// ショート（縦 1080×1920）用の共通の道具
// 画面の使い方（YouTube の画面に隠れない所）：右はしの x880 より右はボタン列、y1520 より下はチャンネル名と説明文で隠れる。
// 上のテロップ 150〜340／絵の主役 380〜1280／字幕 1290〜1380／その下はスマホのボタンと説明文で隠れる
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
// すみっこのネコ（全カット共通の小ネタ）。
// line を渡すと、その行（問いかけの行）で一度だけ、ネコが跳ねて左下を指さし「本編はこちら」と知らせる（約2秒）。
// 左下のチャンネル名のすぐ上に、YouTube の「関連動画」ボタン（本編へのリンク）が出るので、そこを指す。
// 最初と最後のコマでは何もしない＝ループのつなぎ目は変わらない。
export const CAT_POINT = { offset: 0.3, dur: 2.0 };
export const catCorner = (t, toy = '', c = null, line = null) => {
  const X = 150, Y = 1440;
  const t0 = c && line !== null ? c.at(line) + CAT_POINT.offset : -99;
  const k = (t - t0) / CAT_POINT.dur;
  if (k < 0 || k > 1) return sneakyCat(X, Y, t, toy);
  const show = ease.out(clamp(k / 0.15)) * ease.out(clamp((1 - k) / 0.15));   // 出て、戻る
  const hop = Math.abs(Math.sin(Math.min(k, 0.3) / 0.3 * Math.PI)) * 40;        // 最初に一度ぴょん
  let s = sneakyCat(X, Y - hop, t, '');
  // 前足で左下を指す
  const py = Y - hop + lerp(20, 60, show);
  s += line_([[X - 70, Y - hop + 10], [X - 80, py + 20]]) + ellipse(X - 80, py + 26, 16 * show + 1, 14 * show + 1, { fill: C.gray, w: 4 });
  // 赤い札「本編はこちら ↓」（上下にゆれる）
  const bx = 470, by = 1450 + Math.sin(t * 9) * 8, sc = (0.5 + 0.5 * show).toFixed(3);
  s += `<g opacity="${show.toFixed(3)}" transform="translate(${bx} ${by}) scale(${sc}) rotate(-3)">` +
    `<rect x="-215" y="-52" width="430" height="104" rx="52" fill="#d23a33" stroke="#2b2622" stroke-width="8"/>` +
    `<text x="0" y="20" font-family="Zen Maru Gothic" font-weight="900" font-size="58" text-anchor="middle" fill="#fff">本編はこちら ↓</text></g>`;
  return s;
};
const line_ = (pts) => line(pts, { w: 10, color: C.gray, passes: 1 });
export { fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp };
