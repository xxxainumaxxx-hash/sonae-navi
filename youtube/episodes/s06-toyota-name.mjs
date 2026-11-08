// ショート06：トヨダなのに、なぜトヨタ？（縦・ループ）
// 最後「だから、トヨダではなく…」→ 最初「創業家の名字は、トヨダ。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { sign, bubble, cross, houseFrame } from '../lib/cprops.mjs';
import { shots, big, countUp } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, vmid, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's06-toyota-name', format: 'short', title: 'トヨダなのに、なぜトヨタ？', telop: 'トヨダなのに<br>なぜトヨタ？', theme: 'crayon' };

const plate = (str, x, y, s = 1) => xf(rect(-220, -70, 440, 140, { fill: '#7a5230' }) + rect(-200, -55, 400, 110, { fill: '#9a6a40', w: 5 }) + text(str, 0, 28, { size: 80, color: '#fdfbf3', font: 'Zen Maru Gothic', weight: 900 }), { x, y, s });

const LIST = [
  // 0 創業家の名字は、トヨダ。
  (tl, d) => cam(fill(CREAM) + houseFrame(540, 1200, 1.0) + plate('とよだ', 540, 820, 1.3), tl, d, { z0: 1.0, z1: 1.06 }),
  // 1 なのに会社の名前は、トヨタ。なぜ？
  (tl, d) => cam(fill(CREAM) + T('とよだ', 540, 700, 130, INK, C.white) + xf(T('↓', 540, 860, 110, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 820 }) + xf(T('トヨタ', 540, 1060, 150, RED, C.white), { s: popS(tl, 0.6), cx: 540, cy: 1000 }) + xf(big('？', 880, 860, 160, RED), { s: popS(tl, 1.2), cx: 880, cy: 800 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 2 1936年、新しいマークを全国から募集した。
  [
    (tl) => blackType('1936年', tl),
    (tl, d) => { let s = fill('#fbe9d0'); const n = Math.floor(clamp(tl / (d * 0.7)) * 30); for (let i = 0; i < n; i++) s += xf(rect(-60, -40, 120, 80, { fill: '#fdfbf3', w: 4 }), { x: 140 + ((i * 137) % 800), y: 560 + ((i * 89) % 700), r: (i * 23) % 30 - 15 }); return cam(s + T('マーク募集', 540, 520, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }); },
  ],
  // 3 集まったのは、およそ2万7000。
  (tl, d) => cam(fill('#fbe9d0') + `<rect x="140" y="760" width="800" height="240" rx="40" fill="${INK}" opacity="0.85"/>` + big(countUp(27000, tl, 1.2), 540, 940, 140, C.yellow, { stroke: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 理由その1。にごらない方が、すっきり聞こえる。
  (tl, d) => { const k = clamp((tl - 0.8) / 0.6); return cam(fill(CREAM) + T('理由①', 540, 560, 80, RED, C.white) + T('トヨ', 460, 920, 180, INK, C.white) + T('タ', 720, 920, 180, INK, C.white) + xf(text('゛', 0, 0, { size: 170, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 800 + k * 150, y: 800 - k * 260, r: k * 90, o: 1 - k }), tl, d, { z0: 1.0, z1: 1.05 }); },
  // 5 理由その2。カタカナのトヨタは8画。末広がりで縁起がいい。
  (tl, d) => { const n = Math.max(0, Math.min(8, Math.floor(tl * 3.5))); return cam(fill('#fff2c8') + T('理由②', 540, 560, 80, RED, C.white) + T('トヨタ', 540, 860, 170, INK, C.white) + [...Array(n)].map((_, i) => text(String(i + 1), 260 + i * 80, 1020, { size: 46, color: RED, font: 'Zen Maru Gothic', weight: 900 })).join('') + (n >= 8 ? xf(T('八＝末広がり', 540, 1220, 80, RED, C.white), { s: popS(tl, 8 / 3.5), cx: 540, cy: 1190 }) : ''), tl, d, { z0: 1.0, z1: 1.05 }); },
  // 6 あなたは、トヨダとトヨタ、どっち派？
  (tl, d, t) => cam(fill('#d6e6f5') + `<polygon points="540,-400 2400,-400 2400,2400 540,2400" fill="#fbe0dc"/>` + T('トヨダ', 280, 760, 90, INK, C.white) + T('トヨタ', 800, 760, 90, RED, C.white) + xf(T('VS', 540, 900, 110, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 860 }) +
    kid({ x: 280, y: 1460, s: 1.4, hair: 'messy', shirt: C.blue, arms: P.point, blink: blinking(t, 1) }) + kid({ x: 800, y: 1460, s: 1.4, hair: 'side', shirt: C.pink, arms: P.point, blink: blinking(t, 2), flip: true }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 7 だから、トヨダではなく…（→ 1行目へ）
  (tl, d) => cam(fill(CREAM) + plate('とよだ', 540, 820, 1.3) + xf(cross(540, 820, 1.6), { s: popS(tl, 0.4), cx: 540, cy: 820 }), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    '創業家の名字は、とよだ。',
    'なのに会社の名前は、トヨタ。なぜ？',
    '1936年、新しいマークを全国から募集した。',
    '集まったのは、およそ2万7000。',
    '理由その1。にごらない方が、すっきり聞こえる。',
    '理由その2。カタカナのトヨタは8画。末広がりで縁起がいい。',
    'あなたは、トヨダとトヨタ、どっち派？',
    'だから、とよだではなく…',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
