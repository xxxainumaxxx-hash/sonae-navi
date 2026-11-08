// ショート05：トヨタの車は、イギリスに売った特許から始まった（縦・ループ）
// 最後「その元手は、たった一枚の特許だった。」→ 最初「トヨタの車は、イギリスに売った特許から始まった。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { sign, bubble, cross } from '../lib/cprops.mjs';
import { woodLoom, powerLoom, moneyBag, ship, oldCar, factory } from '../lib/cprops2.mjs';
import { shots, big, countUp } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, vmid, vclose, cam, T, blackType, catCorner, fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's05-toyota-patent', format: 'short', title: 'トヨタの車は、特許を売ったお金から始まった', telop: 'トヨタの車は<br>機織り機から始まった', theme: 'crayon' };

const sakichi = (o) => kid({ hair: 'side', hairColor: '#3a2d25', mustache: true, shirt: '#e9e2cf', jacket: '#4a3a2e', pants: '#3a2e24', ...o });
const kiichiro = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: '#4a5568', tie: '#2a6fbf', pants: '#3b4a6b', ...o });
const paper = (x, y, s = 1) => xf(rect(-150, -190, 300, 380, { fill: '#fdfbf3' }) + text('特許', 0, -80, { size: 80, font: 'Zen Maru Gothic', weight: 900 }) + woodLoom(0, 120, 0.3) + ellipse(90, 140, 40, 40, { fill: 'none', color: RED, w: 8 }), { x, y, s });

const LIST = [
  // 0 トヨタの車は、イギリスに売った特許から始まった。
  (tl, d) => cam(fill('#fff2c8') + glow(540, 860, 600, C.yellow, 0.35) + paper(540, 760, 1.4) + xf(T('→ 車', 540, 1200, 110, RED, C.white), { s: popS(tl, 0.6), cx: 540, cy: 1160 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 1 豊田佐吉が作った、止まらない機織り機。
  (tl, d, t) => cam(fill('#d6dce4') + powerLoom(560, 1020, 0.9, { run: tl * 2 }) + vmid(sakichi, 540, { y: 1720, s: 1.8, blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + T('止まらない機織り機', 540, 520, 70, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  // 2 その特許を、本場イギリスの会社が欲しがった。
  (tl, d) => cam(fill('#d8dfe6') + factory(540, 1100, 1.1, '#a89a8a') + text('イギリス', 540, 640, { size: 80, font: 'Zen Maru Gothic', weight: 900 }) + enter(bubble('特許をください！', 540, 520, { size: 60 }), tl, 0.3, { cx: 540, cy: 520 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 3 1929年、売った値段は、およそ10万ポンド。
  [
    (tl) => blackType('1929年', tl),
    (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.35) + moneyBag(540, 820, 1.5, '£') + `<rect x="140" y="1080" width="800" height="200" rx="40" fill="${INK}" opacity="0.85"/>` + big(countUp(100000, tl, 1.0) + '£', 540, 1220, 110, C.yellow, { stroke: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 4 今なら、数十億円とも言われる。
  (tl, d) => { let s = fill('#fff2c8'); for (let i = 0; i < 9; i++) { const k = clamp(tl * 1.4 - i * 0.08); s += moneyBag(200 + (i % 3) * 340, lerp(-200, 720 + Math.floor(i / 3) * 220, ease.out(k)), 0.5, '¥'); } return cam(s + T('数十億円？', 540, 520, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }); },
  // 5 息子の喜一郎は、そのお金で、車づくりを始めた。
  (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.3) + vmid(kiichiro, 380, { y: 1700, s: 1.9, blink: blinking(t, 3), arms: P.cheer, expr: 'smile' }) + xf(oldCar(0, 0, 0.7), { x: 760, y: 1000, s: popS(tl, 0.4), cx: 0, cy: -100 }) + moneyBag(780, 640, 0.6, '£'), tl, d, { z0: 1.0, z1: 1.05 }),
  // 6 機織り機の会社が、車の会社になる。あなたは知っていましたか？
  [
    (tl, d) => cam(fill(CREAM) + woodLoom(540, 760, 0.8) + xf(T('↓', 540, 1040, 130, RED, C.white), { s: popS(tl, 0.3), cx: 540, cy: 1000 }) + xf(oldCar(0, 0, 0.9), { x: 540, y: 1260, s: popS(tl, 0.6), cx: 0, cy: -100 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill(RED) + glow(540, 860, 600, '#fff', 0.2) + T('知ってた？', 540, 820, 150, C.white, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],
  // 7 その元手は、たった一枚の特許だった。（→ 1行目へ）
  (tl, d) => cam(fill('#1d2030') + `<ellipse cx="540" cy="860" rx="460" ry="420" fill="#fff6d0" opacity="0.18"/>` + paper(540, 860, 1.3), tl, d, { z0: 1.06, z1: 1.0 }),
];

export const scenes = [{
  narration: [
    'トヨタの車は、イギリスに売った特許から始まった。',
    '豊田佐吉が作った、止まらない機織り機。',
    'その特許を、本場イギリスの会社が欲しがった。',
    '1929年、売った値段は、およそ10万ポンド。',
    '今なら、数十億円とも言われる。',
    '息子の喜一郎は、そのお金で、車づくりを始めた。',
    '機織り機の会社が、車の会社に。あなたは知ってた？',
    'その元手は、たった一枚の特許だった。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 6),
}];
