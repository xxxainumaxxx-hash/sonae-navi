// ショート16：サンリオは、払う側から受け取る側へ（縦・ループ）
// 最後「今の大きな稼ぎも、始まりは借り物の絵。」→ 最初「サンリオは昔、キャラクターにお金を払っていた。」
import { popS, xf, enter, blinking, tw } from '../lib/anim.mjs';
import { bubble, building } from '../lib/cprops.mjs';
import { moneyBag } from '../lib/cprops2.mjs';
import { billPile } from '../lib/cprops3.mjs';
import { whiteCat, mug, heart } from '../lib/cprops5.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, rect, line, poly, C, clamp } from './short-kit.mjs';
import { tsuji2, PINK, YEL } from './short-sanrio.mjs';

export const meta = { id: 's16-sanrio-license', format: 'short', title: 'サンリオは、払う側から受け取る側へ', telop: 'サンリオは<br>払う側から受け取る側へ', theme: 'crayon' };

// 下向きの矢印（上から下へお金が流れる）
const down = (x, y1, y2) => line([[x, y1], [x, y2]], { w: 14, passes: 1 }) + poly([[x - 30, y2 - 10], [x + 30, y2 - 10], [x, y2 + 30]], { fill: INK });
const pay = (tl, d) => cam(fill('#e9dcc6') + mug(540, 780, 1.3) + T('借りた絵', 540, 600, 80, INK, C.white) + down(540, 830, 930) + xf(moneyBag(0, 0, 0.8, '¥'), { x: 540, y: 1100, s: popS(tl, 0.3) }) + T('払う', 820, 960, 80, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 });

const LIST = [
  // 0 サンリオは昔、キャラクターにお金を払っていた。
  pay,
  // 1 人気のあるキャラクターは、使用料も高い。
  (tl, d) => cam(fill('#fbf3e6') + billPile(540, 1110, 1.2, Math.round(2 + clamp(tl / 1.2) * 6)) + T('使用料', 540, 640, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  // 2 借りれば、使うたびにお金がかかる。人気も、相手しだいだ。
  (tl, d) => cam(fill('#efe6d6') + mug(540, 840, 1.2) + [0, 1, 2].map((i) => (tl > 0.3 + i * 0.4 ? xf(moneyBag(0, 0, 0.55, '¥'), { x: 300 + i * 240, y: 1090, s: popS(tl, 0.3 + i * 0.4) }) : '')).join('') + T('使うたびに', 540, 620, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  // 3 「自分たちで、キャラクターを生み出そう」。
  (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 500, YEL, 0.35) + vmid(tsuji2, 540, { blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + enter(bubble('自分たちで生み出そう！', 540, 620, { size: 56 }), tl, 0.2, { cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 4 自分たちで作るだけでなく、ほかの会社に、キャラクターを使ってもらうのだ。
  (tl, d, t) => cam(fill('#fde8ee') + whiteCat(540, 860, 0.8, t) + [0, 1, 2].map((i) => building(260 + i * 280, 1130, 200, 220 + i * 60, ['#c8d0e0', '#e0d0c8', '#d0e0c8'][i])).join('') + T('使ってもらう', 540, 620, 90, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  // 5 使ってもらうたびに、使用料が入ってくる。かつて自分たちが払っていた側から、受け取る側になったのだ。
  [
    (tl, d) => cam(fill('#fff2c8') + whiteCat(540, 960, 0.8, tl) + [0, 1, 2].map((i) => (tl > 0.2 + i * 0.35 ? xf(moneyBag(0, 0, 0.55, '¥'), { x: 260 + i * 280, y: tw(tl, 0.2 + i * 0.35, 0.6, 1500, 1100), s: 1 }) : '')).join('') + T('使用料が入る', 540, 620, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#fbf3e6') + T('払う側', 540, 700, 100, '#aaa', C.white) + down(540, 760, 880) + xf(T('受け取る側', 540, 1040, 110, PINK, C.white), { s: popS(tl, 0.4), cx: 540, cy: 1000 }), tl, d, { z0: 1.0, z1: 1.04 }),
  ],
  // 6 あなたなら、どのキャラクターを使いたい？
  (tl, d) => cam(fill(PINK) + glow(540, 860, 600, '#fff', 0.2) + T('あなたなら', 540, 700, 100, C.white, INK) + T('どれを使いたい？', 540, 850, 96, YEL, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 7 今の大きな稼ぎも、始まりは借り物の絵。（→ 1行目へ）
  (tl, d) => cam(fill('#e9dcc6') + mug(540, 780, 1.3) + T('借りた絵', 540, 600, 80, INK, C.white), tl, d, { z0: 1.05, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'サンリオは昔、キャラクターにお金を払っていた。',
    '人気のあるキャラクターは、使用料も高い。',
    '借りれば、使うたびにお金がかかる。人気も、相手しだいだ。',
    '「自分たちで、キャラクターを生み出そう」。',
    '自分たちで作るだけでなく、ほかの会社に、キャラクターを使ってもらうのだ。',
    '使ってもらうたびに、使用料が入ってくる。かつて自分たちが払っていた側から、受け取る側になったのだ。',
    'あなたなら、どのキャラクターを使いたい？',
    '今の大きな稼ぎも、始まりは借り物の絵。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
