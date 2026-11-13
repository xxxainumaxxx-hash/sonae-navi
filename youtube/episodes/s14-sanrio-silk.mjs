// ショート14：サンリオは、もともと絹を売る会社だった（縦・ループ）
// 最後「世界の『かわいい』も、始まりは売れ残ったシルク。」→ 最初「サンリオは、もともと絹を売る会社だった。」
import { popS, xf, enter, blinking, tw } from '../lib/anim.mjs';
import { bubble, chartDown } from '../lib/cprops.mjs';
import { silkBolt, kencho, basin, silkPile, sandal, heart } from '../lib/cprops5.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, rect, C, clamp, lerp, ease } from './short-kit.mjs';
import { tsuji, tsuji2, girl, girl2, shelves, PINK, YEL } from './short-sanrio.mjs';

export const meta = { id: 's14-sanrio-silk', format: 'short', title: 'サンリオは、もともと絹を売る会社だった', telop: 'サンリオは昔<br>絹を売る会社だった', theme: 'crayon' };

const bolts = (tl, pop = true) => [0, 1, 2].map((i) => (pop ? xf(silkBolt(0, 0, 1.6), { x: 540, y: 1020 - i * 140, s: popS(tl, i * 0.2) }) : silkBolt(540, 1020 - i * 140, 1.6))).join('');

const LIST = [
  // 0 サンリオは、もともと絹を売る会社だった。
  (tl, d) => cam(fill('#efe6d6') + glow(540, 950, 500, '#fff', 0.4) + bolts(tl, false) + xf(T('絹（シルク）', 540, 640, 100, INK, C.white), { s: popS(tl, 0.3), cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 1 創業者は、山梨県庁を辞めた一人の職員。
  (tl, d, t) => cam(fill('#dcecf2') + basin(1250) + rect(-300, 1250, 1700, 900, { fill: '#a8b878', color: null }) + kencho(300, 1250, 0.6, '山梨県庁') + tsuji({ x: tw(tl, 0, d, 650, 850), y: 1400, s: 1.6, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 2 絹は、思うように売れなかった。
  (tl, d) => cam(fill('#d8d0c4') + bolts(tl, false) + chartDown(540, 560, 0.7, clamp(tl / 1.2)), tl, d, { z0: 1.0, z1: 1.04 }),
  // 3 倉庫には、売れ残った絹が積み上がっていく。
  (tl, d) => cam(fill('#8a7a6a') + rect(-300, 1120, 1700, 900, { fill: '#5a4a3a', color: null }) + silkPile(540, 1120, 0.95, clamp(tl / (d * 0.8))), tl, d, { z0: 1.0, z1: 1.05 }),
  // 4 そこで売り出したのは、ゴムのサンダル。
  (tl, d) => cam(fill('#fbeee0') + glow(540, 950, 500, '#fff', 0.4) + xf(sandal(0, 0, 1.6, { rot: -10 }), { x: 400, y: 960, s: popS(tl, 0.1) }) + xf(sandal(0, 0, 1.6, { rot: 10 }), { x: 680, y: 960, s: popS(tl, 0.3) }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 5 ただのサンダルではない。小さな花の絵を付けたのだ。
  (tl, d) => cam(fill('#fbeee0') + glow(540, 950, 500, YEL, 0.3) + sandal(540, 960, 2.3, { flower: tl > 0.8 }) + T('花の絵', 540, 640, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
  // 6 すると、これが売れた。
  (tl, d, t) => cam(shelves() + [0, 1, 2].map((i) => sandal(260 + i * 280, 770, 0.8, { flower: true })).join('') + [[260, girl], [800, girl2]].map(([x, f], i) => f({ x, y: 1640, s: 1.6, blink: blinking(t, i), expr: 'smile', arms: P.cheer })).join('') + xf(T('売れた！', 540, 640, 120, RED, C.white), { s: popS(tl, 0.2), cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 7 同じサンダルでも、かわいい絵が付いているだけで、人は手に取ってくれる。
  (tl, d) => cam(fill('#fbeee0') + sandal(330, 860, 1.4) + T('ふつう', 330, 1120, 64, INK, C.white) + sandal(750, 860, 1.4, { flower: true }) + T('花の絵', 750, 1120, 64, PINK, C.white) + xf(heart(0, 0, 0.8), { x: 880, y: 600, s: popS(tl, 0.6) }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 8 あなたなら、何に絵を付ける？
  (tl, d) => cam(fill(PINK) + glow(540, 860, 600, '#fff', 0.2) + T('あなたなら', 540, 700, 100, C.white, INK) + T('何に絵を付ける？', 540, 850, 90, YEL, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 9 世界の「かわいい」も、始まりは売れ残ったシルク。（→ 1行目へ）
  (tl, d) => cam(fill('#efe6d6') + glow(540, 950, 500, '#fff', 0.4) + bolts(tl, false), tl, d, { z0: 1.05, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'サンリオは、もともと絹を売る会社だった。',
    '創業者は、山梨県庁を辞めた一人の職員。',
    '絹は、思うように売れなかった。',
    '倉庫には、売れ残った絹が積み上がっていく。',
    'そこで売り出したのは、ゴムのサンダル。',
    'ただのサンダルではない。小さな花の絵を付けたのだ。',
    'すると、これが売れた。',
    '同じサンダルでも、かわいい絵が付いているだけで、人は手に取ってくれる。',
    'あなたなら、何に絵を付ける？',
    '世界の「かわいい」も、始まりは売れ残ったシルク。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 8),
}];
