// ショート11：アシックスの靴は、タコから生まれた（縦・ループ）
// 最後「世界のランナーが履く靴も、始まりは夕ごはんの一皿。」→ 最初「アシックスの靴は、タコから生まれた。」
import { tw, popS, xf, enter, blinking } from '../lib/anim.mjs';
import { bubble } from '../lib/cprops.mjs';
import { shoe, sole, tentacle, sunomono, chopsticks, basketball, gym, runner } from '../lib/cprops4.mjs';
import { worldMap } from '../lib/cprops3.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, text, rect, C, ease, clamp, lerp } from './short-kit.mjs';
import { onitsuka2, player, BLUE, YEL } from './short-asics.mjs';

export const meta = { id: 's11-asics-octopus', format: 'short', title: 'アシックスの靴は、タコから生まれた', telop: 'アシックスの靴は<br>タコから生まれた', theme: 'crayon' };

const table = () => fill('#f3e3c8') + rect(-300, 1000, 1700, 1000, { fill: '#b0814f', color: null });
const sound = (str, x, y, tl, t0, col = RED, size = 110) => (tl > t0 ? xf(text(str, 0, 0, { size, color: col, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x, y, s: popS(tl, t0) }) : '');
const dish = (tl, d) => cam(table() + glow(540, 1000, 500, '#fff3d6', 0.4) + sunomono(540, 1020, 2.2) + chopsticks(700, 860, 1.3, -30), tl, d, { z0: 1.0, z1: 1.06 });

const LIST = [
  // 0 アシックスの靴は、タコから生まれた。
  (tl, d) => cam(fill('#f6e6dc') + tentacle(540, 800, 1.6, 0.3) + xf(shoe(0, 0, 1.2, { accent: BLUE }), { x: 540, y: 1120, s: popS(tl, 0.4) }) + xf(T('タコ → 靴？', 540, 620, 100, RED, C.white), { s: popS(tl, 0.2), cx: 540, cy: 590 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 1 創業者が最初に挑んだのは、バスケットボールの靴。
  (tl, d, t) => cam(gym(1250) + vmid(onitsuka2, 330, { blink: blinking(t, 1), arms: P.point, expr: 'smile' }) + xf(shoe(0, 0, 1.0, { high: true, accent: RED }), { x: 800, y: 1000, s: popS(tl, 0.3) }) + basketball(820, 700, 70), tl, d, { z0: 1.0, z1: 1.04 }),
  // 2 急に止まろうとすると、靴の底がすべってしまうのだ。
  (tl, d, t) => { const k = clamp(tl / (d * 0.6)); return cam(gym(1250) + player({ x: lerp(200, 640, ease.out(k)), y: 1600, s: 2.2, blink: blinking(t, 1), expr: tl > d * 0.5 ? 'wow' : 'smile', arms: P.cheer }) + sound('ツルッ', 760, 700, tl, d * 0.45), tl, d, { z0: 1.0, z1: 1.04 }); },
  // 3 ある日の夕ごはん。皿に、キュウリとタコの酢の物があった。
  dish,
  // 4 吸盤は、ピタッと吸い付いて、すべらない。
  (tl, d) => cam(fill('#e6eef2') + rect(-300, 1060, 1700, 900, { fill: '#fdfbf3', color: null }) + tentacle(540, lerp(880, 990, ease.out(clamp(tl / 0.6))), 2.0, 0.1) + sound('ピタッ', 760, 680, tl, 0.6), tl, d, { z0: 1.0, z1: 1.05 }),
  // 5 靴の底に、吸盤のようなくぼみを付けてみた。すると、急に止まっても、すべらない。
  [
    (tl, d) => cam(fill('#e2e6ee') + sole(540, 900, 1.25, clamp(tl / (d * 0.8))) + T('くぼみ', 540, 600, 96, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d, t) => { const k = clamp((tl - 0.3) / 0.4); return cam(gym(1250) + player({ x: 300 + k * 240, y: 1600, s: 2.2, blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + (tl > 0.7 ? sound('ピタッ', 780, 680, tl, 0.7, '#3f7a5a') : ''), tl, d, { z0: 1.0, z1: 1.04 }); },
  ],
  // 6 あなたなら、何をヒントにする？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたなら', 540, 720, 100, C.white, INK) + T('何をヒントにする？', 540, 870, 90, YEL, INK) + enter(bubble('コメントで教えて', 540, 1100, { size: 66 }), tl, 0.3, { cx: 540, cy: 1100 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 7 世界のランナーが履く靴も、始まりは夕ごはんの一皿。（→ 1行目へ）
  [
    (tl, d, t) => cam(fill('#cfe0e8') + rect(-300, 1180, 1700, 900, { fill: '#c86a4a', color: null }) + [0, 1, 2].map((i) => runner(tw(tl, 0, d, -100, 1100) - i * 300, 1290, 0.85, t + i * 0.3, { shirt: [BLUE, RED, '#3f7a5a'][i], num: String(i + 1) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#f6e6dc') + tentacle(540, 800, 1.6, 0.3), tl, d, { z0: 1.06, z1: 1.0 }),
  ],
];

export const scenes = [{
  narration: [
    'アシックスの靴は、タコから生まれた。',
    '創業者が最初に挑んだのは、バスケットボールの靴。',
    '急に止まろうとすると、靴の底がすべってしまうのだ。',
    'ある日の夕ごはん。皿に、キュウリとタコの酢の物があった。',
    '吸盤は、ピタッと吸い付いて、すべらない。',
    '靴の底に、吸盤のようなくぼみを付けてみた。すると、急に止まっても、すべらない。',
    'あなたなら、何をヒントにする？',
    '世界のランナーが履く靴も、始まりは夕ごはんの一皿。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
