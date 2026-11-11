// ショート10：町工場が、世界一のレースで1位から5位（縦・ループ）
// 最後「『無謀だ』と言われた夢は、7年でかなった。」→ 最初「町工場のバイクが、世界一のレースで、1位から5位までを独り占めした。」
import { tw, popS, xf, enter, shake, blinking } from '../lib/anim.mjs';
import { bubble, chartDown } from '../lib/cprops.mjs';
import { motorBike, podium, island, checkerFlag } from '../lib/cprops3.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, vmid, worker, cam, T, catCorner, fill, glow, rect, poly, line, C, ease, clamp, lerp } from './short-kit.mjs';
import { soichiro } from './short-honda.mjs';

export const meta = { id: 's10-honda-race', format: 'short', title: '町工場が、世界一のレースで1位から5位', telop: '町工場のバイクが<br>世界一のレースで完勝', theme: 'crayon' };

const road = (y = 1150) => rect(-300, y, 1700, 900, { fill: '#9a9a9a', color: null });
const podiumShot = (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + podium(540, 1180, 1.25) +
  [[-275, -200], [0, -300], [275, -150]].map(([dx, dy], i) => xf(motorBike(0, 0, 0.36, { race: true, col: RED, num: String([2, 1, 3][i]) }), { x: 540 + dx, y: 1180 + dy, s: popS(tl, 0.2 + i * 0.2) })).join('') +
  T('1位〜5位を独占', 540, 520, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 });

const LIST = [
  // 0 町工場のバイクが、世界一のレースで、1位から5位までを独り占めした。
  podiumShot,
  // 1 ホンダは1954年、倒産の危機だったとも言われる。
  (tl, d) => cam(fill('#2a1418') + glow(540, 900, 600, '#9a2e28', 0.5) + chartDown(540, 980, 1.0, clamp(tl / (d * 0.7))) + xf(T('倒産の危機', 540, 520, 100, C.white, '#9a2e28'), { s: popS(tl, 0.6), cx: 540, cy: 480 }) + T('1954年', 540, 650, 70, C.white, INK), tl, d, { z0: 1.0, z1: 1.06, x0: 540 + shake(tl, 1.0, 0.4, 8) }),
  // 2 それでも、本田宗一郎は宣言した。「マン島TTレースに出て、勝つ」。
  [
    (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + vmid(soichiro, 540, { y: 1500, s: 2.2, blink: blinking(t, 3), arms: P.cheer, expr: 'wow' }) + enter(bubble('世界一のレースで勝つ！', 540, 470, { size: 60 }), tl, 0.2, { cx: 540, cy: 470 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#bfe0f5') + island(540, 900, 1.15) + xf(T('マン島TTレース', 540, 520, 84, RED, C.white), { s: popS(tl, 0.2), cx: 540, cy: 480 }), tl, d, { z0: 1.08, z1: 1.0 }),
  ],
  // 3 社員たちでさえ、無謀だと思ったと言われている。
  (tl, d, t) => cam(fill('#d8cdb8') + [0, 1, 2].map((i) => worker({ x: 200 + i * 340, y: 1250, s: 1.4, blink: blinking(t, i), expr: 'worry', sweat: i !== 1, arms: P.shrug })).join('') + xf(T('無謀だ…', 540, 540, 120, '#9a2e28', C.white), { s: popS(tl, 0.3), cx: 540, cy: 500 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 7年後の1961年。結果は、1位から5位まで、すべてホンダ。
  [
    (tl, d) => cam(fill('#cfe0e8') + road(1150) + checkerFlag(900, 1150, 0.9, tl) + [0, 1, 2, 3, 4].map((i) => motorBike(tw(tl, 0, d, -200, 1100) - i * 230, 1180, 0.45, { wheel: tl * 700, race: true, col: RED, num: String(i + 1) })).join('') + T('1961年', 540, 520, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    podiumShot,
  ],
  // 5 あなたなら、この宣言、信じられた？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたなら', 540, 700, 100, C.white, INK) + T('信じられた？', 540, 850, 100, C.yellow, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 6 「無謀だ」と言われた夢は、7年でかなった。（→ 1行目へ）
  (tl, d) => cam(fill('#cfe6f5') + poly([[60, 1300], [540, 780], [1020, 1300]], { fill: '#8fa0b0' }) + poly([[440, 920], [540, 780], [640, 920], [590, 890], [540, 930], [490, 890]], { fill: C.white, w: 5 }) +
    xf(motorBike(0, 0, 0.42, { col: RED, race: true }), { x: 540, y: 790 }) + line([[700, 980], [700, 740]], { w: 6, passes: 1 }) + poly([[700, 740], [820, 770], [700, 800]], { fill: RED, w: 5 }) + T('7年でかなった', 540, 560, 84, RED, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    '町工場のバイクが、世界一のレースで、1位から5位までを独り占めした。',
    'ホンダは1954年、倒産の危機だったとも言われる。',
    'それでも、本田宗一郎は宣言した。「マン島TTレースに出て、勝つ」。',
    '社員たちでさえ、無謀だと思ったと言われている。',
    '7年後の1961年。結果は、1位から5位まで、すべてホンダ。',
    'あなたなら、この宣言、信じられた？',
    '「無謀だ」と言われた夢は、7年でかなった。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 5),
}];
