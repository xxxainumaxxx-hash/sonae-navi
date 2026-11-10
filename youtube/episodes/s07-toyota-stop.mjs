// ショート07：トヨタの工場では、誰でもラインを止められる（縦・ループ）
// 最後「その考え方は、100年以上前の機織り機から来ている。」→ 最初「トヨタの工場では、誰でもラインを止められる。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { sign, bubble, cross } from '../lib/cprops.mjs';
import { woodLoom, powerLoom, andon, assemblyLine } from '../lib/cprops2.mjs';
import { shots, big } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, worker, vmid, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's07-toyota-stop', format: 'short', title: 'トヨタの工場では、誰でもラインを止められる', telop: 'トヨタの工場は<br>誰でもラインを止められる', theme: 'crayon' };

const LIST = [
  // 0 トヨタの工場では、誰でもラインを止められる。
  (tl, d) => { const p = clamp((tl - 0.6) / 0.3); return cam(fill('#d6dce4') + andon(540, 900, 1.0, { pulled: p, on: p >= 1 }) + assemblyLine(540, 1180, 0.55, tl, p >= 1), tl, d, { z0: 1.0, z1: 1.06 }); },
  // 1 おかしいと思ったら、ひもを引くだけ。
  (tl, d, t) => cam(fill('#d6dce4') + andon(620, 880, 1.0, { pulled: clamp((tl - 0.8) / 0.3) }) + vmid(worker, 380, { y: 1480, s: 2.0, blink: blinking(t, 5), arms: [12, 8, 150, -10], look: [1, -0.6] }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 2 新人でも、止めていい。
  (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.3) + vmid(kid, 540, { hair: 'messy', shirt: C.sky, blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }) + enter(sign('新人でもOK', 540, 560, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 540, cy: 560 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 3 止めれば、すぐに直せる。不良品を作り続けない。
  (tl, d) => cam(fill('#e2f1dc') + assemblyLine(540, 1050, 0.55, 0, true) + xf(cross(540, 760, 1.8), { s: popS(tl, 0.6), cx: 540, cy: 760 }) + T('不良品を作らない', 540, 560, 76, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 これ、あなたの職場でもできる？
  (tl, d, t) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたの職場', 540, 760, 100, C.white, INK) + T('でもできる？', 540, 900, 100, C.yellow, INK) + enter(bubble('コメントで教えて', 540, 1120, { size: 66 }), tl, 0.3, { cx: 540, cy: 1120 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 5 元になったのは、糸が切れたら自分で止まる、機織り機。
  (tl, d) => cam(fill('#d6dce4') + powerLoom(540, 1100, 1.0, { run: tl < 1 ? tl * 2 : 2, cut: tl > 0.8, lamp: tl > 1.0 }) + (tl > 1.0 ? xf(T('ピタッ', 540, 640, 110, RED, C.white), { s: popS(tl, 1.0), cx: 540, cy: 600 }) : ''), tl, d, { z0: 1.0, z1: 1.06 }),
  // 6 その考え方は、100年以上前の機織り機から来ている。（→ 1行目へ）
  (tl, d) => cam(fill(CREAM) + `<rect x="-200" y="-200" width="1480" height="2400" fill="#8a6a40" opacity="0.18"/>` + woodLoom(540, 1080, 1.1, { cut: true }) + T('100年以上前', 540, 560, 90, INK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'トヨタの工場では、誰でもラインを止められる。',
    'おかしいと思ったら、ひもを引くだけ。',
    '新人でも、止めていい。',
    '止めれば、すぐに直せる。不良品を作り続けない。',
    'これ、あなたの職場でもできる？',
    '元になったのは、糸が切れたら自分で止まる、機織り機。',
    'その考え方は、100年以上前の機織り機から来ている。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 4),
}];
