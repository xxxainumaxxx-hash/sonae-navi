// ショート03：任天堂を救ったひまつぶし（縦・ループ）
import { C, text } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, blinking, clamp } from '../lib/anim.mjs';
import { kid, worker } from '../lib/cfolk.mjs';
import { extendHand, ball, sign, band, sneakyCat, bubble, rainCloud, gear } from '../lib/cprops.mjs';

export const meta = { id: 's03-ultrahand', format: 'short', title: '任天堂を救ったひまつぶし', telop: '任天堂を救ったのは<br>社員のひまつぶし', theme: 'crayon' };

const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: C.red, pants: '#2c3350', ...o });
const HOLD = [20, -100, 20, -100], CHEER = [160, 10, 160, 10];
// 決めカット：のびる手でボールをつかむ若者（冒頭と最後）
const hero = (t) => {
  const ext = 0.5 - 0.5 * Math.cos(t * 2.4);
  return worker({ x: 260, y: 1150, s: 1.0, arms: HOLD, blink: blinking(t, 5), look: [1, 0] }) + extendHand(320, 1040, 0.85, ext) +
    ball(320 + 6 * (22 + 48 * ext) * 0.85 + 60, 1040, 34, C.red);
};

export const scenes = [{
  narration: [
    '任天堂を救ったのは、社員の遊び道具。',
    '1960年代、会社はピンチだった。',
    '点検係の若い社員が、',
    'ひまつぶしに作った「のびる手」。',
    '社長が見て、ひとこと。',
    '「それを商品にしろ」',
    '結果、大ヒット。',
    'あなたのひまつぶし、商品になりそう？',
    'こうして、任天堂を救ったのは…',
  ],
  draw: (t, c) => {
    let s = band(-20, 1960, '#e6efe8');
    s += gear(880, 500, 90, t * 40) + gear(990, 610, 60, -t * 55, '#8e8a84');
    const loop = t < c.at(1) || t > c.at(8) + 0.6;
    if (loop) {
      s += hero(t) + enter(sign('大ヒット！', 540, 560, { size: 80, fill: C.yellow, rot: -4 }), t, 0, { cx: 540, cy: 560 });
    } else if (t < c.at(2)) {
      s += pres({ x: 540, y: 1150, s: 1.1, expr: 'worry', sweat: true, arms: [60, 95, 60, 95], blink: blinking(t, 2) }) + rainCloud(540, 520, t, 0.9);
    } else if (t < c.at(4)) {
      s += hero(t);
      if (t > c.at(3)) s += enter(bubble('ひまつぶし♪', 400, 600, { size: 50 }), t, c.at(3), { cx: 400, cy: 600 });
    } else if (t < c.at(6)) {
      s += hero(t);
      s += enter(pres({ x: 820, y: 1150, s: 0.95, flip: true, look: [-1, 0], arms: t > c.at(5) ? [12, 8, 125, 10] : [12, 8, 12, 8], blink: blinking(t, 3) }), t, c.at(4), { how: 'right', dist: 600 });
      if (t > c.at(5)) s += enter(bubble('それを商品にしろ', 600, 560, { size: 50 }), t, c.at(5), { cx: 600, cy: 560 });
    } else if (t < c.at(7)) {
      const n = Math.floor(clamp((t - c.at(6)) / 1.2) * 9);
      for (let i = 0; i < n; i++) s += `<g transform="translate(${180 + (i % 3) * 300} ${1150 - Math.floor(i / 3) * 170})">${extendHand(0, 0, 0.4, 0.2)}</g>`;
      s += enter(sign('大ヒット！', 540, 560, { size: 80, fill: C.yellow, rot: -4 }), t, c.at(6), { cx: 540, cy: 560 });
    } else {
      s += kid({ x: 540, y: 1150, s: 1.1, hair: 'messy', shirt: C.orange, arms: [12, 8, 30, -180], blink: blinking(t, 4) });
      s += enter(text('？', 760, 620, { size: 200, color: C.red, font: 'Zen Maru Gothic', weight: 900 }), t, c.at(7), { cx: 760, cy: 560 });
    }
    s += sneakyCat(200, 1470, t, extendHand(0, 0, 0.18, 0.5 + 0.5 * Math.sin(t * 3)));
    return s;
  },
}];
