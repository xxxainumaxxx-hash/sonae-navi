// アニメーション用の小道具（時間 t は秒）
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const ease = {
  out: (k) => 1 - Math.pow(1 - k, 3),
  inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: (k) => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
};
// t0〜t1 の間に a→b へ変化
export function tw(t, t0, t1, a, b, fn = ease.out) {
  return lerp(a, b, fn(clamp((t - t0) / (t1 - t0))));
}
// ぽんっと出てくる（0→少し大きく→1）
export const popS = (t, t0, dur = 0.35) => (t < t0 ? 0 : tw(t, t0, t0 + dur, 0, 1, ease.back));

// 中心(cx,cy)基準で拡大・回転・移動
export function xf(inner, { x = 0, y = 0, s = 1, r = 0, cx = 0, cy = 0, o = 1 } = {}) {
  if (s <= 0.001 || o <= 0.001) return '';
  return `<g transform="translate(${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})" opacity="${o.toFixed(2)}">${inner}</g>`;
}
// 出現：pop / left / right / up / down（画面外から滑り込み）
export function enter(inner, t, t0, { how = 'pop', cx = 960, cy = 540, dur = 0.45, dist = 1300 } = {}) {
  if (t < t0) return '';
  if (how === 'pop') return xf(inner, { s: popS(t, t0, dur), cx, cy });
  const k = tw(t, t0, t0 + dur, 1, 0, ease.out);
  const dx = how === 'left' ? -dist * k : how === 'right' ? dist * k : 0;
  const dy = how === 'up' ? -dist * k : how === 'down' ? dist * k : 0;
  return xf(inner, { x: dx, y: dy });
}
// ふわふわ上下
export const bob = (t, amp = 8, hz = 0.8, ph = 0) => Math.sin((t * hz + ph) * Math.PI * 2) * amp;
// カメラ：全体をズーム・パン
export function camera(inner, { z = 1, x = 960, y = 540, r = 0 } = {}) {
  return `<g transform="translate(960 540) rotate(${r}) scale(${z.toFixed(4)}) translate(${(-x).toFixed(1)} ${(-y).toFixed(1)})">${inner}</g>`;
}
// 揺れ（驚き・ショック）
export const shake = (t, t0, dur = 0.4, amp = 14) =>
  t < t0 || t > t0 + dur ? 0 : Math.sin((t - t0) * 70) * amp * (1 - (t - t0) / dur);
// まばたき：数秒に1回、2コマだけ目を閉じる
export const blinking = (t, seed = 0) => ((t + seed * 1.37) % 3.1) < 0.12;
