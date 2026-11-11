// ショート08：ホンダの最初のバイクは、自転車だった（縦・ループ）
// 最後「今では世界中を走るバイクも、もとをたどれば…」→ 最初「ホンダの最初のバイクは、自転車だった。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { sign, bubble } from '../lib/cprops.mjs';
import { engine } from '../lib/cprops2.mjs';
import { bicycle, stepBike, ruins, worldMap } from '../lib/cprops3.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, vmid, cam, T, catCorner, fill, glow, text, rect, poly, C, ease, clamp, lerp } from './short-kit.mjs';
import { soichiro, TOWN, onBike } from './short-honda.mjs';

export const meta = { id: 's08-honda-bicycle', format: 'short', title: 'ホンダの最初のバイクは、自転車だった', telop: 'ホンダの最初のバイクは<br>自転車だった', theme: 'crayon' };

const road = (y = 1150) => rect(-300, y, 1700, 900, { fill: '#b9a27a', color: null });
const sound = (str, x, y, tl, t0, size = 100) => (tl > t0 ? xf(text(str, 0, 0, { size, color: RED, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x: x + Math.sin(tl * 30) * 3, y, s: popS(tl, t0) }) : '');

const LIST = [
  // 0 ホンダの最初のバイクは、自転車だった。
  (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + road(1150) + bicycle(540, 1150, 1.4, { motor: true }) + xf(T('最初のバイク？', 540, 640, 96, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 1 戦争が終わった浜松。人々は、重い荷物を積んで、自転車をこいでいた。
  [
    (tl, d) => cam(fill('#cfc6bc') + ruins(540, 1150, 1.0) + rect(-300, 1150, 1700, 900, { fill: '#8a7a6a', color: null }) + T('戦後の浜松', 540, 630, 90, INK, C.white), tl, d, { z0: 1.08, z1: 1.0 }),
    (tl, d, t) => cam(fill('#e7d8c0') + road(1150) + onBike(tw(tl, 0, d, 200, 900), 1150, 1.15, { ...TOWN, theta: tl * 5, smile: false, blink: blinking(t, 1) }, { wheel: tl * 200, load: true }), tl, d, { z0: 1.0, z1: 1.04 }),
  ],
  // 2 目を付けたのは、軍隊が無線機の電気を作るのに使っていた、小さなエンジンだった。（本編の声）
  (tl, d) => cam(fill('#5a5246') + rect(-300, 1100, 1700, 900, { fill: '#3e382f', color: null }) + [0, 1, 2].map((i) => engine(260 + i * 280, 1100 - (i % 2) * 120, 0.55)).join('') + T('軍隊の余り物', 540, 630, 90, C.yellow), tl, d, { z0: 1.08, z1: 1.0 }),
  // 3 宗一郎はこれを買い集め、自転車に取り付けた。（本編の声）
  (tl, d, t) => cam(fill('#d8cdb8') + road(1180) + bicycle(700, 1180, 1.05, { motor: tl > 0.5 }) + soichiro({ x: 260, y: 1250, s: 1.6, blink: blinking(t, 3), arms: P.point, expr: 'smile', look: [1, 0.3] }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 走ると、バタバタと大きな音がする。人々は親しみを込めて、「バタバタ」と呼んだ。（本編の声）
  [
    (tl, d, t) => cam(fill('#cfe0e8') + road(1150) + onBike(tw(tl, 0, d, 250, 950), 1150, 1.15, { ...TOWN, theta: tl * 3, blink: blinking(t, 1) }, { wheel: tl * 500, motor: true, smoke: 1 }) + sound('バタバタ', tw(tl, 0, d, 250, 950) - 300, 820, tl, 0.2, 110), tl, d, { z0: 1.0, z1: 1.04, y0: 960 + shake(tl, 0, 9, 3) }),
    (tl, d) => cam(fill('#fbe9d0') + road(1150) + bicycle(540, 1150, 1.15, { motor: true }) + enter(bubble('「バタバタ」', 540, 650, { size: 90 }), tl, 0.2, { cx: 540, cy: 650 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 5 坂道も、こがずに登れる。これが飛ぶように売れた。
  [
    (tl, d, t) => cam(fill('#cfe0e8') + `<g transform="rotate(-14 540 1250)">${road(1280) + onBike(tw(tl, 0, d, 200, 860), 1280, 1.0, { ...TOWN, theta: 0.6, blink: blinking(t, 1) }, { wheel: tl * 400, motor: true, smoke: 1, load: true })}</g>` +
      xf(T('こがずに登れる！', 540, 610, 76, RED, C.white), { s: popS(tl, 0.4), cx: 540, cy: 580 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#fff2c8') + road(1150) + [0, 1, 2].map((i) => xf(bicycle(0, 0, 0.55, { motor: true }), { x: 200 + i * 340, y: 1150 - (i % 2) * 40, s: popS(tl, i * 0.15) })).join('') + xf(T('売れた！', 540, 690, 140, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 640 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 6 あなたなら、自転車に何を付けたい？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたなら', 540, 700, 100, C.white, INK) + T('何を付けたい？', 540, 850, 100, C.yellow, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 7 今では世界中を走るバイクも、もとをたどれば…（→ 1行目へ）
  (tl, d) => cam(fill('#cfe6f5') + worldMap(540, 820, 0.85, [0, 1, 2, 3, 4, 5]) + [0, 1, 2].map((i) => stepBike(tw(tl, 0, d, -150, 1250) - i * 360, 1230, 0.5, { wheel: tl * 500, col: [RED, '#3f7a5a', '#3a4a6b'][i] })).join(''), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'ホンダの最初のバイクは、自転車だった。',
    '戦争が終わった浜松。人々は、重い荷物を積んで、自転車をこいでいた。',
    '目を付けたのは、軍隊が無線機の電気を作るのに使っていた、小さなエンジンだった。',
    '宗一郎はこれを買い集め、自転車に取り付けた。',
    '走ると、バタバタと大きな音がする。人々は親しみを込めて、「バタバタ」と呼んだ。',
    '坂道も、こがずに登れる。これが飛ぶように売れた。',
    'あなたなら、自転車に何を付けたい？',
    '今では世界中を走るバイクも、もとをたどれば…',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
