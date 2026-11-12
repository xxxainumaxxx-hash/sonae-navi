// ショート13：アシックスは、5つの言葉の頭文字（縦・ループ）
// 最後「たった5文字に込めた、創業者の願い。」→ 最初「アシックスは、5つの言葉の頭文字だ。」
import { popS, xf, enter, blinking } from '../lib/anim.mjs';
import { bubble } from '../lib/cprops.mjs';
import { blackboard } from '../lib/cprops4.mjs';
import { ruins } from '../lib/cprops3.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, text, rect, C, typeText } from './short-kit.mjs';
import { onitsuka, NAVY, BLUE, YEL } from './short-asics.mjs';

export const meta = { id: 's13-asics-name', format: 'short', title: 'アシックスは、5つの言葉の頭文字', telop: 'アシックスの名前は<br>5つの言葉の頭文字', theme: 'crayon' };

const LETTERS = ['A', 'S', 'I', 'C', 'S'];
const big5 = (tl, t0 = 0.1) => LETTERS.map((ch, i) => t0 < 0 ? T(ch, 160 + i * 190, 980, 170, i % 2 ? RED : BLUE, C.white) : xf(T(ch, 0, 0, 170, i % 2 ? RED : BLUE, C.white), { x: 160 + i * 190, y: 980, s: popS(tl, t0 + i * 0.15) })).join('');
const WORDS = [['A', 'nima'], ['S', 'ana'], ['I', 'n'], ['C', 'orpore'], ['S', 'ano']];
// 黒板に、1語1行で書く（頭文字は黄色で大きく）
const board = (tl, ring) => blackboard(540, 830, 820, 540) + WORDS.map(([h, r], i) => {
  const y = 670 + i * 92, x = 320;
  return text(h, x, y, { size: 84, color: YEL, anchor: 'start' }) + text(r, x + 60, y, { size: 68, color: '#f4efe2', anchor: 'start' }) +
    (ring && tl > 0.3 + i * 0.3 ? `<circle cx="${x + 27}" cy="${y - 29}" r="44" fill="none" stroke="${YEL}" stroke-width="7"/>` : '');
}).join('');

const LIST = [
  // 0 アシックスは、5つの言葉の頭文字だ。
  (tl, d) => cam(fill('#fbf3e6') + big5(tl, -1) + xf(T('5つの言葉', 540, 680, 100, INK, C.white), { s: popS(tl, 0.6), cx: 540, cy: 640 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 1 ラテン語の「アニマ・サーナ・イン・コルポレ・サーノ」。
  (tl, d) => cam(fill('#e9dcc6') + board(tl, false), tl, d, { z0: 1.0, z1: 1.04 }),
  // 2 頭文字をつなげると、A、S、I、C、S。アシックスになる。
  (tl, d) => cam(fill('#e9dcc6') + board(tl, true), tl, d, { z0: 1.0, z1: 1.04 }),
  // 3 意味は、「健全な身体に、健全な精神があれかし」。
  (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, YEL, 0.35) + xf(T('健全な身体に、', 540, 820, 92, INK, C.white), { s: popS(tl, 0.1), cx: 540, cy: 790 }) + xf(T('健全な精神', 540, 1000, 110, RED, C.white), { s: popS(tl, 0.8), cx: 540, cy: 960 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 創業者は、戦争から帰った青年、鬼塚喜八郎。
  (tl, d, t) => cam(fill('#cfc6bc') + ruins(540, 1250, 0.9) + rect(-300, 1250, 1700, 900, { fill: '#8a7a6a', color: null }) + vmid(onitsuka, 540, { blink: blinking(t, 1), expr: 'smile' }) + xf(T('鬼塚喜八郎', 540, 640, 100, INK, C.white), { s: popS(tl, 0.4), cx: 540, cy: 600 }), tl, d, { z0: 1.06, z1: 1.0 }),
  // 5 スポーツで若者を元気にしたい。鬼塚が戦後に願ったことが、そのまま社名になった。
  [
    (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 600, YEL, 0.3) + vmid(onitsuka, 540, { blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }) + enter(bubble('スポーツで若者を元気に！', 540, 620, { size: 58 }), tl, 0.2, { cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#fbf3e6') + big5(tl) + xf(T('＝ 戦後の願い', 540, 720, 90, RED, C.white), { s: popS(tl, 0.6), cx: 540, cy: 690 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 6 あなたの名前には、どんな意味がある？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたの名前の', 540, 700, 96, C.white, INK) + T('意味は？', 540, 850, 110, YEL, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 7 たった5文字に込めた、創業者の願い。（→ 1行目へ）
  (tl, d) => cam(fill('#fbf3e6') + big5(tl, -1), tl, d, { z0: 1.05, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'アシックスは、5つの言葉の頭文字だ。',
    'ラテン語の「アニマ・サーナ・イン・コルポレ・サーノ」。',
    '頭文字をつなげると、A、S、I、C、S。アシックスになる。',
    '意味は、「健全な身体に、健全な精神があれかし」。',
    '創業者は、戦争から帰った青年、鬼塚喜八郎。',
    'スポーツで若者を元気にしたい。鬼塚が戦後に願ったことが、そのまま社名になった。',
    'あなたの名前には、どんな意味がある？',
    'たった5文字に込めた、創業者の願い。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
