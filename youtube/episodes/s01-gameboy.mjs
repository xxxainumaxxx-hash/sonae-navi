// ショート01：白黒のゲームボーイが、カラーに圧勝した（縦・ループ）
// 1行＝1〜2カット。最後のカット（子どもとゲームボーイ）が最初のカットにつながる。
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { bwHandheld, colorHandheld, battery, sign, trophy, bubble, cross } from '../lib/cprops.mjs';
import { shots, countUp, big } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, vmid, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = {
  id: 's01-gameboy',
  format: 'short',
  title: 'ゲームボーイは、なぜカラーに勝てたのか',
  telop: 'ゲームボーイは<br>なぜ勝った？',
  theme: 'crayon',
};

const GB = (x, y, s, tl = 0) => xf(`<rect x="-150" y="-240" width="300" height="480" fill="#f3efe2"/>` + bwHandheld(0, 0, 1, tl % 1), { x, y, s });
const GG = (x, y, s, dim = 0) => colorHandheld(x, y, s, dim);
const kids = (t, y = 1460, s = 1.05) => [[100, C.blue, 'messy'], [250, C.pink, 'side'], [680, C.green, 'messy'], [830, C.orange, 'side']]
  .map(([x, col, h], i) => kid({ x, y: y - Math.abs(Math.sin(t * 6 + i)) * 14, s, shirt: col, hair: h, arms: P.cheer, blink: blinking(t, i), expr: 'smile', flip: x > 540 })).join('');

const LIST = [
  // 0 白黒のゲームボーイが、カラーに圧勝した。
  [
    (tl, d, t) => cam(fill(RED) + glow(540, 800, 600, '#fff', 0.25) + GB(540, 920, 1.05, tl) + xf(trophy(0, 0, 1.0), { x: 540, y: 520 + bob(tl, 10, 1), s: popS(tl, 0.1), cx: 0, cy: 0 }) + kids(t), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => {
      let s = fill('#2b2f3a') + glow(540, 800, 600, C.yellow, 0.2) + rect(60, 1180, 960, 30, { fill: '#c9a227' });
      s += GB(330, 860, 0.95, tl) + xf(GG(0, 0, 0.8, 1), { x: 700, y: 1060, r: 70 + shake(tl, 0, 0.4, 6) });
      s += T('勝ち！', 330, 560, 120, C.yellow) + T('K.O.', 700, 820, 90, C.white, RED);
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
  ],
  // 1 1989年、任天堂が出した携帯ゲーム機。
  [
    (tl) => blackType('1989年', tl),
    (tl, d, t) => cam(fill('#f6efe0') + glow(540, 900, 600, '#fff', 0.4) + vmid(kid, 540, { hair: 'messy', shirt: C.blue, arms: P.hold, blink: blinking(t, 1), expr: 'smile', look: [0, 0.5] }) + GB(540, 1260, 0.62, tl) +
      enter(sign('持ち運べるゲーム機', 540, 520, { size: 70, fill: C.yellow }), tl, 0.2, { cx: 540, cy: 520 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 2 1年後、セガのゲームギアが登場。
  [
    (tl, d) => {
      const k = tl > 0.8 ? 1 : 0;
      let s = fill('#e8eaf2') + rect(290, 600, 500, 560, { fill: C.white }) + rect(290, 600, 500, 120, { fill: RED });
      s += xf(text(k ? '1990' : '1989', 540, 1000, { size: 170, font: 'Zen Maru Gothic', weight: 900 }), { s: k ? popS(tl, 0.8) : 1, cx: 540, cy: 860 });
      return cam(s + T('1年後', 540, 540, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d) => cam(fill('#1d2433') + glow(540, 860, 500, C.sky, 0.3) + xf(GG(0, 0, 1.4, 0), { x: tw(tl, 0, 0.5, 1400, 540, ease.out), y: 880 }) + typeText('ゲームギア（セガ）', 540, 600, tl, { size: 70, color: C.white, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 3 こっちは、きれいなカラー画面。
  (tl, d) => {
    let s = fill('#fdf3fa');
    ['#ff8a8a', '#ffd36a', '#8ee08e', '#8ac8ff', '#c49aff'].forEach((col, i) => { s += `<circle cx="540" cy="880" r="${700 - i * 110}" fill="${col}" opacity="0.35"/>`; });
    s += xf(GG(0, 0, 1.6, 0), { x: 540, y: 940, r: Math.sin(tl * 2) * 3 }) + T('カラー！', 540, 580, 130, C.white, RED);
    return cam(s, tl, d, { z0: 1.0, z1: 1.08 });
  },
  // 4 なのに、なぜ白黒が勝った？
  (tl, d) => cam(fill('#efe6d6') + GB(270, 900, 0.85, tl) + GG(700, 920, 0.7) + xf(big('？', 540, 700, 260, RED), { s: popS(tl, 0.3), cx: 540, cy: 620 }) +
    text('白黒', 300, 1210, { size: 64, font: 'Zen Maru Gothic', weight: 900 }) + text('カラー', 700, 1210, { size: 64, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 5 ゲームギアは、電池が数時間でなくなる。
  (tl, d) => {
    const lv = tw(tl, 0.4, d * 0.85, 1, 0, (k) => k);
    let s = fill('#2b2f3a') + glow(540, 760, 500, C.blue, 0.25) + xf(GG(0, 0, 1.3, lv < 0.05 ? 1 : 0), { x: 540, y: 720 });
    s += battery(540, 1080, 1.8, lv) + T('数時間でカラッポ', 540, 540, 76, C.white, INK);
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 540 + shake(tl, d * 0.85, 0.4, 10) });
  },
  // 6 ゲームボーイは、電池4本で約30時間。
  [
    (tl, d) => cam(fill('#e2f1dc') + glow(540, 800, 600, C.green, 0.25) + GB(540, 760, 1.0, tl) + [0, 1, 2, 3].map((i) => xf(battery(0, 0, 0.7, 1), { x: 270 + i * 180, y: 1160, s: popS(tl, 0.2 + i * 0.15), cx: 0, cy: 0 })).join('') +
      T('電池4本', 540, 560, 100, C.green, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => {
      let s = fill('#e2f1dc') + ellipse(540, 760, 300, 300, { fill: C.white, w: 9 });
      s += line([[540, 760], [540 + Math.sin(tl * 14) * 230, 760 - Math.cos(tl * 14) * 230]], { w: 12, passes: 1 }) + line([[540, 760], [540 + Math.sin(tl * 1.2) * 150, 760 - Math.cos(tl * 1.2) * 150]], { w: 16, passes: 1 });
      s += GB(780, 1150, 0.45, tl) + T(countUp(30, tl, 1.0) + '時間', 540, 1220, 130, C.green, C.white);
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
  ],
  // 7 値段も、12,500円と19,800円。
  [
    (tl, d) => cam(fill('#e2f1dc') + GB(540, 760, 0.9, tl) + T(countUp(12500, tl, 0.9) + '円', 540, 1200, 140, C.green, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#fbe3e3') + GG(540, 780, 1.2) + T(countUp(19800, tl, 0.9) + '円', 540, 1200, 140, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d, t) => cam(fill('#fff2c8') + vmid(kid, 540, { hair: 'side', shirt: C.orange, arms: P.think, blink: blinking(t, 2), look: [0, -0.5] }) +
      xf(sign('12,500円', 0, 0, { size: 70, fill: '#cfeec4' }), { x: 250, y: 540, r: -6 }) + xf(sign('19,800円', 0, 0, { size: 70, fill: '#f6c4c4' }), { x: 680, y: 640, r: 6 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 8 しかも、テトリスが大ヒット。
  (tl, d) => {
    let s = fill('#1d2433') + glow(540, 860, 600, C.yellow, 0.2) + GB(540, 880, 1.15, 0);
    for (let i = 0; i < 8; i++) s += xf(`<rect x="-30" y="-30" width="60" height="60" fill="${[RED, C.blue, C.green, C.yellow][i % 4]}" stroke="${INK}" stroke-width="5"/>`, { x: 430 + (i % 4) * 70, y: tw(tl, i * 0.15, i * 0.15 + 0.4, 300, 860 - Math.floor(i / 4) * 70, (k) => k), s: tl > i * 0.15 ? 1 : 0 });
    s += enter(sign('大ヒット！', 540, 520, { size: 100, fill: C.yellow, rot: -4 }), tl, 0.3, { cx: 540, cy: 520 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  },
  // 9 あなたなら、どっちを買う？
  (tl, d, t) => {
    let s = fill('#d8ecd0') + `<polygon points="540,-400 2400,-400 2400,2400 540,2400" fill="#f6d6d6"/>`;
    s += GB(260, 820, 0.75, tl) + GG(690, 820, 0.62) + T('どっち？', 540, 590, 150, C.white, INK);
    s += kid({ x: 280, y: 1480, s: 1.4, hair: 'messy', shirt: C.green, arms: P.point, blink: blinking(t, 1) }) + kid({ x: 700, y: 1480, s: 1.4, hair: 'side', shirt: C.pink, arms: P.point, blink: blinking(t, 2), flip: true });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  },
  // 10 子どもたちの答えは、はっきりしていた。（→ 1行目の絵へつながる）
  (tl, d, t) => cam(fill(RED) + glow(540, 800, 600, '#fff', 0.25) + GB(540, 920, 1.05, tl) + kids(t) + xf(trophy(0, 0, 1.0), { x: 540, y: 520, s: popS(tl, d * 0.6), cx: 0, cy: 0 }), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    '白黒のゲームボーイが、カラーに圧勝した。',
    '1989年、任天堂が出した携帯ゲーム機。',
    '1年後、セガのゲームギアが登場。',
    'こっちは、きれいなカラー画面。',
    'なのに、なぜ白黒が勝った？',
    'ゲームギアは、電池が数時間でなくなる。',
    'ゲームボーイは、電池4本で約30時間。',
    '値段も、12,500円と19,800円。',
    'しかも、テトリスが大ヒット。',
    'あなたなら、どっちを買う？',
    '子どもたちの答えは、はっきりしていた。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, GB(0, 0, 0.12, t), c, 9),
}];
