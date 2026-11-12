// ショート12：ナイキは昔、日本の靴を売る会社だった（縦・ループ）
// 最後「世界一のスポーツブランドも、始まりは…」→ 最初「ナイキは昔、日本の靴を売る会社だった。」
import { tw, popS, xf, enter, blinking } from '../lib/anim.mjs';
import { bubble } from '../lib/cprops.mjs';
import { shoe, carTrunk, contract, runner } from '../lib/cprops4.mjs';
import { worldMap } from '../lib/cprops3.mjs';
import { factory } from '../lib/cprops2.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, rect, C, ease, clamp, lerp } from './short-kit.mjs';
import { onitsuka2, phil, BLUE, YEL } from './short-asics.mjs';

export const meta = { id: 's12-asics-nike', format: 'short', title: 'ナイキは昔、日本の靴を売る会社だった', telop: 'ナイキは昔<br>日本の靴を売っていた', theme: 'crayon' };

const shoes3 = (tl, y = 1100) => [0, 1, 2].map((i) => shoe(220 + i * 320, y - (i % 2) * 50, 0.75, { accent: [BLUE, RED, '#3f7a5a'][i] })).join('');
const open = (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + shoes3(tl) + T('日本の靴', 540, 640, 110, RED, C.white) + T('MADE IN JAPAN', 540, 790, 60, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 });

const LIST = [
  // 0 ナイキは昔、日本の靴を売る会社だった。
  open,
  // 1 神戸の靴の会社を、一人のアメリカの若者がたずねてきた。
  (tl, d, t) => cam(fill('#e7d8c0') + rect(-300, 1250, 1700, 900, { fill: '#a07a50', color: null }) + factory(780, 1250, 0.9) + T('神戸', 780, 700, 90, INK, C.white) + phil({ x: tw(tl, 0, d, -100, 330), y: 1640, s: 2.2, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 2 その若者の名前は、フィル・ナイト。大学を出たばかりの、陸上選手だった。
  (tl, d, t) => cam(fill('#fbf3e6') + vmid(phil, 540, { blink: blinking(t, 1), arms: P.hips, expr: 'smile' }) + xf(T('フィル・ナイト', 540, 640, 96, INK, C.white), { s: popS(tl, 0.2), cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 3 「この靴を、アメリカで売らせてほしい」。
  (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 500, YEL, 0.3) + phil({ x: 300, y: 1640, s: 2.0, blink: blinking(t, 1), arms: P.hold, expr: 'smile' }) + onitsuka2({ x: 800, y: 1640, s: 2.0, blink: blinking(t, 2), expr: 'smile', flip: true }) + enter(bubble('アメリカで売らせて！', 540, 620, { size: 64 }), tl, 0.2, { cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 4 だが、二つの会社の関係は、長くは続かなかった。
  (tl, d) => cam(fill('#3a2a2a') + glow(540, 900, 500, '#c8423a', 0.3) + contract(540, 950, 1.3, ease.inOut(clamp((tl - 0.4) / 0.8))), tl, d, { z0: 1.0, z1: 1.05 }),
  // 5 若者は、自分たちで靴を作り始めた。それが「ナイキ」ブランドの始まりだ。
  [
    (tl, d, t) => cam(fill('#e9dcc6') + phil({ x: 330, y: 1640, s: 2.0, blink: blinking(t, 1), arms: P.point, expr: 'smile' }) + xf(shoe(0, 0, 0.9, { accent: '#e8602c' }), { x: 780, y: 1050, s: popS(tl, 0.3) }) + T('自分たちの靴', 540, 640, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#1d1a24') + glow(540, 900, 600, '#fff', 0.12) + xf(T('のちの ナイキ', 540, 940, 120, C.white, INK), { s: popS(tl, 0.2), cx: 540, cy: 900 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 6 そして今、アシックスとナイキは、世界の舞台で競い合うライバルになった。
  (tl, d, t) => cam(fill('#cfe0e8') + rect(-300, 1180, 1700, 900, { fill: '#c86a4a', color: null }) + runner(tw(tl, 0, d, 100, 820), 1290, 0.9, t, { shirt: BLUE, num: '1' }) + runner(tw(tl, 0, d, 60, 800), 1290, 0.9, t + 0.4, { shirt: '#e8602c', num: '2' }) + T('ライバル', 540, 640, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  // 7 あなたは、どっちの靴が好き？
  (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('あなたは', 540, 700, 100, C.white, INK) + T('どっちが好き？', 540, 850, 100, YEL, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 8 世界一のスポーツブランドも、始まりは…（→ 1行目へ）
  (tl, d) => cam(fill('#cfe6f5') + worldMap(540, 880, 0.85, [0, 1, 2, 3, 4, 5]) + shoes3(tl, 1250), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'ナイキは昔、日本の靴を売る会社だった。',
    '神戸の靴の会社を、一人のアメリカの若者がたずねてきた。',
    'その若者の名前は、フィル・ナイト。大学を出たばかりの、陸上選手だった。',
    '「この靴を、アメリカで売らせてほしい」。',
    'だが、二つの会社の関係は、長くは続かなかった。',
    '若者は、自分たちで靴を作り始めた。それが「ナイキ」ブランドの始まりだ。',
    'そして今、アシックスとナイキは、世界の舞台で競い合うライバルになった。',
    'あなたは、どっちの靴が好き？',
    '世界一のスポーツブランドも、始まりは…',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 7),
}];
