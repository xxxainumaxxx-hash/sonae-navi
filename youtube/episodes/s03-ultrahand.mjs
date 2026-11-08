// ショート03：任天堂を救ったひまつぶし（縦・ループ）
// 最後「たったひとつの、ひまつぶし。」→ 最初「のびる手のおもちゃが、任天堂を救った。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { extendHand, ball, sign, bubble, rainCloud, gear, chartDown, bulb } from '../lib/cprops.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, worker, pres, vmid, vclose, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's03-ultrahand', format: 'short', title: '任天堂を救ったひまつぶし', telop: '任天堂を救ったのは<br>社員のひまつぶし', theme: 'crayon' };

const ext = (tl) => 0.5 - 0.5 * Math.cos(tl * 2.6);
// のびる手が画面を横切ってボールをつかむ（冒頭と最後）
const heroHand = (tl) => {
  const e = ext(tl), tip = 60 + 6 * (22 + 48 * e) * 1.5 + 120;
  return extendHand(60, 880, 1.5, e) + ball(e > 0.85 ? tip : 900, e > 0.85 ? 880 : 1000 - Math.abs(Math.sin(tl * 3)) * 80, 70, RED);
};

const LIST = [
  // 0 のびる手のおもちゃが、任天堂を救った。
  [
    (tl, d) => cam(fill('#fff2c8') + glow(540, 880, 600, C.yellow, 0.35) + heroHand(tl) + T('のびる手', 540, 700, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d, t) => cam(fill('#fff2c8') + glow(540, 880, 600, C.yellow, 0.35) + vmid(worker, 540, { arms: P.cheer, blink: blinking(t, 5), expr: 'smile' }) +
      enter(sign('任天堂を救った', 540, 620, { size: 80, fill: RED, color: C.white }), tl, 0.2, { cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 1 1960年代、会社はピンチだった。
  [
    (tl) => blackType('1960年代', tl, 120),
    (tl, d, t) => cam(fill('#6b707c') + rainCloud(540, 520, tl, 1.4) + vmid(pres, 540, { expr: 'worry', sweat: true, arms: P.shrug, blink: blinking(t, 2), tilt: Math.sin(tl * 2) * 3 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 2 点検係の若い社員が、
  (tl, d, t) => cam(fill('#d6e4dc') + gear(860, 620, 140, tl * 80) + gear(980, 800, 80, -tl * 100, '#8e8a84') + vmid(worker, 460, { arms: P.idle, blink: blinking(t, 5), look: [1, 0] }) +
    enter(sign('点検係', 330, 620, { size: 80, fill: C.white }), tl, 0.1, { cx: 330, cy: 620 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 3 ひまつぶしに作った「のびる手」。
  (tl, d, t) => cam(fill('#e4ecd8') + ellipse(850, 560, 110, 110, { fill: C.white, w: 7 }) + line([[850, 560], [850 + Math.sin(tl * 3) * 80, 560 - Math.cos(tl * 3) * 80]], { w: 8, passes: 1 }) +
    vmid(worker, 460, { arms: P.raise, blink: blinking(t, 5), look: [1, 0], expr: 'smile' }) + extendHand(700, 1400, 1.0, ext(tl)) + enter(bubble('ひまつぶし♪', 420, 620, { size: 60 }), tl, 0.2, { cx: 420, cy: 620 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 社長が見て、ひとこと。
  (tl, d, t) => cam(fill('#d6e4dc') + rect(620, 380, 420, 1000, { fill: '#b98a58' }) + vmid(pres, tw(tl, 0, 0.6, 1200, 820, ease.out), { flip: true, look: [-1, 0], blink: blinking(t, 3), expr: 'wow' }) +
    xf(T('！', 560, 700, 200, RED, C.white), { s: popS(tl, 0.5), cx: 560, cy: 640 }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 5 「それを商品にしろ」（決め台詞：顔のアップ）
  (tl, d, t) => cam(fill(RED) + glow(540, 900, 600, '#fff', 0.2) + vclose(pres, 540, { arms: P.point, blink: blinking(t, 3), expr: 'smile' }) +
    enter(bubble('それを商品にしろ', 540, 600, { size: 72 }), tl, 0.05, { cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.1 }),
  // 6 結果、大ヒット。
  (tl, d) => {
    let s = fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.3);
    const n = Math.floor(clamp(tl / (d * 0.8)) * 12);
    for (let i = 0; i < n; i++) s += xf(rect(-110, -70, 220, 140, { fill: [C.sky, C.pink, C.yellow][i % 3] }) + extendHand(-80, 0, 0.3, 0.3), { x: 220 + (i % 3) * 320, y: 1240 - Math.floor(i / 3) * 170 });
    s += enter(sign('大ヒット！', 540, 620, { size: 110, fill: RED, color: C.white, rot: -5 }), tl, 0.1, { cx: 540, cy: 620 });
    return cam(s, tl, d, { z0: 1.08, z1: 1.0 });
  },
  // 7 あなたのひまつぶし、商品になりそう？
  [
    (tl, d, t) => cam(fill('#e8f0fa') + glow(540, 860, 600, '#fff', 0.4) + vmid(kid, 540, { hair: 'messy', shirt: C.orange, arms: P.think, blink: blinking(t, 4), look: [0.3, -0.6] }) +
      xf(bulb(820, 560, 1.0, 1), { s: popS(tl, 0.6), cx: 820, cy: 560 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('商品に', 540, 760, 150, C.white, INK) + T('なりそう？', 540, 940, 150, C.yellow, INK) +
      enter(bubble('コメントで教えて', 540, 1120, { size: 66 }), tl, 0.3, { cx: 540, cy: 1120 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 8 たったひとつの、ひまつぶし。（→ 1行目の絵へ）
  (tl, d) => cam(fill('#1d2030') + `<ellipse cx="540" cy="880" rx="560" ry="300" fill="#fff6d0" opacity="0.2"/>` + heroHand(tl), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'のびる手のおもちゃが、任天堂を救った。',
    '1960年代、会社はピンチだった。',
    '点検係の若い社員が、',
    'ひまつぶしに作った「のびる手」。',
    '社長が見て、ひとこと。',
    '「それを商品にしろ」',
    '結果、大ヒット。',
    'あなたのひまつぶし、商品になりそう？',
    'たったひとつの、ひまつぶし。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, extendHand(0, 0, 0.18, 0.5 + 0.5 * Math.sin(t * 3))),
}];
