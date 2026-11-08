// ショート02：任天堂の名前の意味（縦・ループ）
// 最後「この3文字に、隠れている言葉は…」→ 最初「「運を天に任せる」。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { hanafuda, shop, townRow, sign, bubble, cross } from '../lib/cprops.mjs';
import { shots, big } from '../lib/shots.mjs';
import { RED, CREAM, INK, SEPIA, P, kid, vmid, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's02-name', format: 'short', title: '任天堂の名前の意味', telop: '任天堂の名前<br>どういう意味？', theme: 'crayon' };

const crafts = (o) => kid({ hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', pants: '#4a3a2a', ...o });
const dice = (x, y, s = 1, r = 0) => xf(rect(-60, -60, 120, 120, { fill: C.white }) + [[-28, -28], [28, 28], [0, 0], [28, -28], [-28, 28]].map(([a, b]) => ellipse(a, b, 11, 11, { fill: INK, w: 3 })).join(''), { x, y, s, r });
// 縦書きの「任天堂」（光る文字）
const nin = (tl, lit = [1, 1, 1]) => ['任', '天', '堂'].map((ch, i) => T(ch, 540, 800 + i * 210, 200, lit[i] ? RED : '#c9b9a8', C.white)).join('');

const LIST = [
  // 0 「運を天に任せる」。
  (tl, d) => {
    let s = fill('#cfe6f5') + glow(540, 700, 700, '#fff', 0.4);
    for (let i = 0; i < 3; i++) s += ellipse(((tl * 60 + i * 380) % 1300) - 100, 520 + i * 160, 150, 60, { fill: C.white, w: 5 });
    s += dice(540, 1100, 1.6, tl * 200) + typeText('運を天に任せる', 540, 820, tl, { size: 110, color: INK, cps: 10, font: 'Zen Maru Gothic', weight: 900 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  },
  // 1 これが、社名の由来と言われている。
  [
    (tl, d) => {
      let s = fill(CREAM);
      [...'運を天に任せる'].forEach((ch, i) => { const on = ch === '天' || ch === '任'; s += T(ch, 540, 520 + i * 120, 110, on ? RED : '#b9ad9e', C.white); });
      s += `<ellipse cx="540" cy="${520 + 2 * 120 - 38}" rx="90" ry="70" fill="none" stroke="${RED}" stroke-width="10"/><ellipse cx="540" cy="${520 + 4 * 120 - 38}" rx="90" ry="70" fill="none" stroke="${RED}" stroke-width="10"/>`;
      return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d) => cam(fill(CREAM) + glow(540, 900, 600, RED, 0.12) + nin(tl) + enter(sign('社名の由来', 540, 560, { size: 80, fill: C.yellow }), tl, 0.2, { cx: 540, cy: 560 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 2 始まりは1889年、花札のお店。
  [
    (tl) => blackType('1889年', tl),
    (tl, d, t) => cam(fill(SEPIA) + townRow(1000, 4, -300, 340) + shop(540, 1080, 1.3) + crafts({ x: 740, y: 1500, s: 1.6, blink: blinking(t, 1), arms: P.cheer, expr: 'smile', flip: true }) +
      enter(sign('花札のお店', 540, 600, { size: 80, fill: C.white }), tl, 0.2, { cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 3 花札は、運で勝負が決まる遊び。
  [
    (tl, d) => {
      let s = fill('#2f2626') + glow(540, 860, 600, '#ffcf8a', 0.25) + rect(-100, 700, 1280, 700, { fill: '#2f6b48' });
      for (let i = 0; i < 5; i++) { const k = clamp(tl * 1.6 - i * 0.2); s += hanafuda(lerp(540, 200 + i * 170, ease.out(k)), lerp(1500, 950 + (i % 2) * 60, ease.out(k)), 0.8, -20 + i * 10, i % 4); }
      return cam(s, tl, d, { z0: 1.06, z1: 1.0 });
    },
    (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + dice(380, 960, 1.4, tl * 240) + dice(720, 1000, 1.4, -tl * 200) +
      T('運で勝負！', 540, 680, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.06, x0: 540 + shake(tl, 0.2, 0.3, 8) }),
  ],
  // 4 だから、この名前がぴったりだった。
  (tl, d) => {
    const sw = Math.sin(tl * 2.2) * 3;
    let s = fill('#c9a878') + glow(540, 860, 600, '#fff3d6', 0.35) + line([[300, 300], [360, 720]], { w: 8 }) + line([[780, 300], [720, 720]], { w: 8 });
    s += `<g transform="rotate(${sw.toFixed(2)} 540 300)">` + rect(160, 700, 760, 340, { fill: '#7a5230', w: 10 }) + text('任天堂', 540, 935, { size: 190, color: '#2b1a10', font: 'Zen Maru Gothic', weight: 900 }) + '</g>';
    s += xf(T('ぴったり！', 540, 1240, 120, C.yellow), { s: popS(tl, 0.4), cx: 540, cy: 1200 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  },
  // 5 あなたは、運まかせ派？実力派？
  [
    (tl, d, t) => {
      let s = fill('#fff2c8') + `<polygon points="540,-400 2400,-400 2400,2400 540,2400" fill="#d6e6f5"/>`;
      s += kid({ x: 280, y: 1480, s: 1.5, hair: 'messy', shirt: C.orange, arms: P.cheer, blink: blinking(t, 1), expr: 'smile' }) + dice(280, 700, 1.0, tl * 200);
      s += kid({ x: 720, y: 1480, s: 1.5, hair: 'side', glasses: true, shirt: C.blue, arms: P.think, blink: blinking(t, 2), flip: true }) + xf(rect(-70, -90, 140, 180, { fill: '#7a8fb0' }) + line([[0, -90], [0, 90]], { w: 5, passes: 1 }), { x: 720, y: 700 });
      s += T('運まかせ', 280, 900, 80, INK, C.white) + T('実力', 720, 900, 80, INK, C.white) + xf(T('VS', 540, 760, 110, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 720 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたは？', 540, 800, 150, C.white, INK) + enter(bubble('コメントで教えて', 540, 1040, { size: 70 }), tl, 0.3, { cx: 540, cy: 1040 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 6 この3文字に、隠れている言葉は…（→ 1行目へ）
  (tl, d) => {
    let s = fill('#1d2030') + glow(540, 860, 600, '#fff6d8', 0.2) + nin(tl);
    s += xf(big('？', 790, 760, 200, C.yellow), { s: popS(tl, 0.5), cx: 790, cy: 700 }) + xf(big('？', 240, 1120, 160, C.yellow), { s: popS(tl, 0.8), cx: 240, cy: 1070 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.08 });
  },
];

export const scenes = [{
  narration: [
    '「運を天に任せる」。',
    'これが、社名の由来と言われている。',
    '始まりは1889年、花札のお店。',
    '花札は、運で勝負が決まる遊び。',
    'だから、この名前がぴったりだった。',
    'あなたは、運まかせ派？実力派？',
    'この3文字に、隠れている言葉は…',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, hanafuda(0, 0, 0.25, 15 + Math.sin(t * 3) * 10, 2)),
}];
