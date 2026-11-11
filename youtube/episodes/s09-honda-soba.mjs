// ショート09：そば屋の出前から、1億台のバイクへ（縦・ループ）
// 最後「始まりは、たった一つの注文だった。」→ 最初「『そば屋の出前でも、片手で運転できるバイクを』。」
import { tw, popS, xf, enter, bob, blinking } from '../lib/anim.mjs';
import { bubble } from '../lib/cprops.mjs';
import { stepBike, sobaTrays, letter } from '../lib/cprops3.mjs';
import { shots, big, countUp } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, vmid, cam, T, blackType, catCorner, fill, glow, text, rect, C, ease, clamp, lerp } from './short-kit.mjs';
import { fujisawa, onStep } from './short-honda.mjs';

export const meta = { id: 's09-honda-soba', format: 'short', title: 'そば屋の出前から、1億台のバイクへ', telop: 'そば屋の出前から<br>1億台のバイクへ', theme: 'crayon' };

const road = (y = 1150) => rect(-300, y, 1700, 900, { fill: '#b9a27a', color: null });
const GREEN = '#3f7a5a';

const LIST = [
  // 0 「そば屋の出前でも、片手で運転できるバイクを」。
  (tl, d, t) => { const bx = tw(tl, 0, d, 300, 760); return cam(fill('#cfe0e8') + road(1180) + onStep(bx, 1180, 1.15, { shirt: C.white, pants: '#4a4038', armUp: true, blink: blinking(t, 1) }, { wheel: tl * 400, col: GREEN }) +
    sobaTrays(bx - 98, 1180 - 478 * 1.15 - 4 + bob(tl, 4, 2), 0.75, 6), tl, d, { z0: 1.0, z1: 1.04 }); },
  // 1 ホンダの藤沢武夫が、そう注文したと言われている。
  (tl, d, t) => cam(fill('#e9dcc6') + vmid(fujisawa, 540, { y: 1500, s: 2.2, blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + enter(bubble('片手で乗れるバイクを', 540, 470, { size: 60 }), tl, 0.2, { cx: 540, cy: 470 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 2 生まれたのが、1958年のスーパーカブ。
  (tl, d) => cam(fill('#fff2c8') + glow(540, 960, 600, C.yellow, 0.4) + road(1180) + xf(stepBike(0, 0, 1.5, { col: GREEN }), { x: 540, y: 1180, s: popS(tl, 0.2), cy: -150 }) +
    xf(T('1958年', 540, 520, 90, INK, C.white), { s: popS(tl, 0.1), cx: 540, cy: 480 }) + xf(T('スーパーカブ', 540, 660, 110, RED, C.white), { s: popS(tl, 0.5), cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 3 足を大きく上げずに乗れて、丈夫で、燃料も少なくてすむ。
  (tl, d) => { let s = fill('#fdf1dc');
    ['足を上げずに乗れる', '丈夫', '燃料が少ない'].forEach((lb, i) => { const y = 560 + i * 240;
      s += rect(140, y - 100, 800, 200, { fill: ['#fff2c8', '#d6dce4', '#e3f1e7'][i] }) + text(lb, 500, y + 22, { size: 60, font: 'Zen Maru Gothic', weight: 900 }) +
        xf(text('✓', 0, 0, { size: 110, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { x: 860, y: y + 36, s: popS(tl, 0.3 + i * 0.6) }); });
    return cam(s, tl, d, { z0: 1.0, z1: 1.03 }); },
  // 4 シリーズの生産は2017年、1億台を超えた。
  (tl, d) => cam(fill('#9a2e28') + glow(540, 860, 600, '#fff', 0.15) + `<rect x="80" y="720" width="920" height="260" rx="40" fill="${INK}" opacity="0.85"/>` + big(countUp(100000000, tl, 1.4), 540, 900, 120, C.yellow, { stroke: INK }) +
    T('2017年', 540, 560, 90, C.white, INK) + (tl > 1.4 ? T('1億台突破', 540, 1150, 100, C.yellow, INK) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
  // 5 あなたの町でも、走っているのを見たことある？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたの町でも', 540, 700, 96, C.white, INK) + T('見たことある？', 540, 850, 100, C.yellow, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 6 始まりは、たった一つの注文だった。（→ 1行目へ）
  (tl, d) => cam(fill(CREAM) + glow(540, 860, 500, '#fff', 0.3) + letter(540, 860, 2.4, -4) + T('たった一つの注文', 540, 560, 84, RED, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    '「そば屋の出前でも、片手で運転できるバイクを」。',
    'ホンダの藤沢武夫が、そう注文したと言われている。',
    '生まれたのが、1958年のスーパーカブ。',
    '足を大きく上げずに乗れて、丈夫で、燃料も少なくてすむ。',
    'シリーズの生産は2017年、1億台を超えた。',
    'あなたの町でも、走っているのを見たことある？',
    '始まりは、たった一つの注文だった。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 5),
}];
