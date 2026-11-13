// サンリオの絵（行ごとのカット）。声ファイルの番号（章タイトル込みの通し番号）ごとに、行の数だけカットを並べる
// 実在のキャラクター（ハローキティなど）・サンリオのロゴ・人物の似顔絵は描かない。
// 「小さな白い猫」は後ろ姿と赤いリボンだけ（顔は描かない）
import { C, text, line, ellipse, rect, poly, arrow, sparkles } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import { sign, bubble, cross, building, townRow, chartDown, desk, plane, calculator, rainCloud, shop, sneakyCat as cat } from '../lib/cprops.mjs';
import { factory, moneyBag } from '../lib/cprops2.mjs';
import { worldMap, letter, billPile } from '../lib/cprops3.mjs';
import { silkworm, cocoon, mulberry, silkBolt, kencho, basin, silkPile, sandal, giftBox, heartCard, heart, pencil, smallCase, whiteCat, clearPurse, parkHall, mug, tee } from '../lib/cprops5.mjs';
import { cam, typeText, big, fill, glow } from '../lib/shots.mjs';

const PINK = '#e86a7a', RED = '#c8423a', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', NAVY = '#24345c', YEL = '#f2c230', MINT = '#a8d8c8', SKY = '#cfe6f5';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [40, -60, 40, -60], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50] };

const tsujiKid = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#9a8a6a', pants: '#5a4a3a', ...o });   // 子どものころ
const tsuji = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: '#5a5a5a', tie: '#3a4a6b', pants: '#4a4a4a', ...o }); // 県庁の職員
const tsuji2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: NAVY, tie: PINK, pants: NAVY, ...o });   // 社長
const clerk = (o) => kid({ hair: 'side', hairColor: '#3a2d25', shirt: C.white, jacket: '#6a6a6a', tie: '#5a3a3a', pants: '#4a4a4a', ...o });
const girl = (o) => kid({ hair: 'bob', hairColor: '#3a2d25', shirt: '#f2a6b4', pants: '#6a7aa8', ...o });
const girl2 = (o) => kid({ hair: 'bob', hairColor: '#5a3a25', shirt: MINT, pants: '#8a6a9a', ...o });
const designer = (o) => kid({ hair: 'bob', hairColor: '#2a2420', glasses: true, shirt: '#fbe36a', pants: '#4a5a7a', ...o });
const farmer = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#8a9a6a', pants: '#5a4a3a', ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const T = (str, x, y, size, color, stroke = INK) => `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });
const blackType = (str, tl, size = 130) => fill('#111') + typeText(str, 960, 580, tl, { size, color: C.white, cps: 6, font: 'Yomogi', weight: 400 });
const floor = (col = '#a07a50', y = 880) => rect(-200, y, 2400, 400, { fill: col, color: null });
const office = () => fill('#e6e2d6') + rect(-200, 640, 2400, 600, { fill: '#b8a890', color: null }) + [300, 960, 1620].map((x) => rect(x - 160, 140, 320, 220, { fill: '#cfe0e8', w: 5 })).join('');
const yamanashi = () => fill('#dcecf2') + basin(900) + floor('#a8b878', 900);
const store = () => fill('#fbeee0') + rect(-200, 760, 2400, 500, { fill: '#d8b890', color: null }) + rect(200, 520, 1520, 40, { fill: '#a07a50' }) + rect(200, 360, 1520, 30, { fill: '#a07a50' });
const sound = (str, x, y, tl, t0 = 0, col = RED, size = 90) => (tl > t0 ? xf(text(str, 0, 0, { size, color: col, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x: x + Math.sin(tl * 30) * 3, y, s: popS(tl, t0) }) : '');
const giftsRow = (tl, y = 640, s = 1) => [(x) => heartCard(x, y, 0.9 * s, -8), (x) => pencil(x, y, 1.1 * s, -30), (x) => smallCase(x, y + 80, 1.0 * s), (x) => giftBox(x, y + 90, 0.9 * s)].map((f, i) => xf(f(0), { x: 360 + i * 400, y: 0, s: popS(tl, 0.2 + i * 0.25) })).join('');
// 上がるグラフ
const chartUp = (pts, col, k = 1) => {
  const n = Math.max(2, Math.ceil(pts.length * k)); const ps = pts.slice(0, n);
  const p = ps.map((q) => q.join(',')).join(' '), [a, b] = ps.slice(-2);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 60;
  return `<polyline points="${p}" fill="none" stroke="${INK}" stroke-width="40" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${p}" fill="none" stroke="${col}" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<polygon points="${b[0] + Math.cos(ang) * h},${b[1] + Math.sin(ang) * h} ${b[0] + Math.cos(ang + 2.2) * h * 0.7},${b[1] + Math.sin(ang + 2.2) * h * 0.7} ${b[0] + Math.cos(ang - 2.2) * h * 0.7},${b[1] + Math.sin(ang - 2.2) * h * 0.7}" fill="${col}" stroke="${INK}" stroke-width="8"/>`;
};
// 世界地図の陸（worldMap と同じ形）のまん中あたり。ハートなどを陸の上に置くとき用
const LAND = [[330, -110], [60, -180], [60, 20], [-430, -150], [-320, 120], [455, 160]];
const onLand = (x, y, s, i) => [x + LAND[i][0] * s, y + LAND[i][1] * s];
const mapHearts = (x, y, s, tl, hs = 0.6, ids = [0, 1, 2, 3, 4, 5]) => ids.map((i, k) => { const [px, py] = onLand(x, y, s, i); return xf(heart(0, 0, hs), { x: px, y: py + bob(tl + k, 6, 1), s: popS(tl, 0.2 + k * 0.2) }); }).join('');
// 店の棚の上に乗せる（棚板の上の面 y=520）
const shelfGifts = (tl) => [(x) => heartCard(x, 424, 0.8, -4), (x) => pencil(x, 505, 1.0, -8), (x) => smallCase(x, 520, 0.9), (x) => giftBox(x, 520, 0.8)].map((f, i) => xf(f(0), { x: 360 + i * 400, y: 0, s: popS(tl, 0.2 + i * 0.25) })).join('');
const catHero = (tl, d, t, bg = '#fde8ee') => cam(fill(bg) + glow(960, 560, 600, '#fff', 0.4) + whiteCat(960, 900, 1.6, t), tl, d, { z0: 1.0, z1: 1.06 });

// ───── 章タイトル（ピンク）
export const chapterCard = (no, title) => (t) => fill('#c25a72') + glow(960, 540, 700, '#ffffff', 0.12) +
  [0, 1, 2, 3, 4, 5].map((i) => line([[0, 200 + i * 140], [1920, 220 + i * 140]], { w: 3, color: '#d0748a', passes: 1 })).join('') +
  typeText(no, 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
  typeText(title, 960, 620, t, { size: 104, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 });

export const SHOTS = {
  // ───── つかみ
  '01': [
    // 0 山梨県庁で働いていた、一人の職員。
    (tl, d, t) => cam(yamanashi() + kencho(1300, 900, 1.0, '山梨県庁') + tsuji({ x: tw(tl, 0, d, 300, 600), y: 1100, s: 1.6, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 彼が作った会社のキャラクターは、今では世界中で愛されている。
    (tl, d, t) => cam(fill(SKY) + worldMap(960, 520, 1.2, [0, 1, 2, 3, 4, 5]) + mapHearts(960, 520, 1.2, tl, 0.7), tl, d, { z0: 1.0, z1: 1.06 }),
    // 2 サンリオだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, PINK, 0.12) + xf(T('サンリオ', 960, 600, 220, PINK, C.white), { s: popS(tl, 0.1), cx: 960, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 3 だがその始まりは、かわいいキャラクターではなかった。絹、シルクを売る会社だった。
    [
      (tl, d) => cam(fill('#fde8ee') + glow(960, 540, 600, '#fff', 0.4) + `<g opacity="0.5">${whiteCat(960, 900, 1.4, tl)}</g>` + cross(960, 560, 2.2), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#efe6d6') + glow(960, 500, 600, '#fff', 0.4) + [0, 1, 2].map((i) => xf(silkBolt(0, 0, 1.4), { x: 960, y: 700 - i * 130, s: popS(tl, i * 0.2) })).join('') + T('絹（シルク）', 960, 200, 110, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 しかも、その絹はまったく売れなかった。
    (tl, d) => cam(fill('#d8d0c4') + silkPile(960, 880, 1.2, 1) + chartDown(1550, 400, 0.8, clamp(tl / 1.2)), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 県庁を飛び出した男は、どうやって世界の人気者を生み出したのか。
    [
      (tl, d, t) => cam(yamanashi() + kencho(600, 900, 0.9, '山梨県庁') + tsuji({ x: tw(tl, 0, d, 900, 1500), y: 1100, s: 1.6, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 12), arms: P.cheer }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill(SKY) + worldMap(960, 600, 1.0, [0, 1, 2, 3, 4, 5]) + whiteCat(960, 860, 0.8, t) + T('どうやって世界へ？', 960, 170, 90, PINK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    ],
    // 6 今回は、サンリオが世界の「かわいい」になるまでを見ていきましょう。
    (tl, d, t) => cam(fill(CREAM) + mid(guide, 520, { blink: blinking(t, 1), arms: P.point, expr: 'smile' }) + xf(heart(0, 0, 2.2), { x: 1300, y: 480 + bob(tl, 10, 1), s: popS(tl, 0.3) }) + T('かわいい', 1300, 820, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 物語は、1960年の山梨から始まる。
    (tl, d) => cam(yamanashi() + T('1960年 山梨', 960, 220, 100, INK, C.white), tl, d, { z0: 1.08, z1: 1.0 }),
  ],

  // ───── 少年時代
  '03': [
    // 0 辻信太郎は、1927年、山梨県に生まれた。
    (tl, d, t) => cam(fill('#f3e6cc') + glow(960, 500, 600, '#fff', 0.4) + mid(tsujiKid, 960, { blink: blinking(t, 1), expr: 'smile', s: 1.5, y: 1060 }) + xf(T('辻信太郎', 960, 230, 110, INK, C.white), { s: popS(tl, 0.3), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 甲府盆地の、山に囲まれた町だった。
    (tl, d) => cam(yamanashi() + townRow(860, 7, 260, 220) + head('甲府盆地', tl), tl, d, { z0: 1.06, z1: 1.0 }),
    // 2 子どものころ、母親を早くに亡くし、さみしい思いをして育ったと言われている。
    (tl, d, t) => cam(fill('#3a3a4a') + glow(960, 520, 500, '#8a8aaa', 0.3) + rainCloud(960, 200, t, 1.2) + mid(tsujiKid, 960, { blink: blinking(t, 1), expr: 'worry', s: 1.5, y: 1060 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 3 戦争の時代。友だちとも、思うように遊べなかった。
    (tl, d, t) => cam(fill('#8a8070') + floor('#6a6050') + mid(tsujiKid, 600, { blink: blinking(t, 1), expr: 'worry', s: 1.5, y: 1060 }) + `<g opacity="0.45">${tsujiKid({ x: 1300, y: 1060, s: 1.3, expr: 'worry', flip: true })}${tsujiKid({ x: 1600, y: 1060, s: 1.3, expr: 'worry', flip: true })}</g>`, tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 誕生日に、小さなプレゼントをもらったときのうれしさを、ずっと覚えていたと言われている。
    (tl, d, t) => cam(fill('#fff2c8') + glow(1250, 560, 500, YEL, 0.4) + mid(tsujiKid, 600, { blink: blinking(t, 1), expr: 'smile', arms: P.hold, s: 1.5, y: 1060 }) + xf(giftBox(0, 0, 1.2), { x: 1250, y: 700 + bob(tl, 8, 1), s: popS(tl, 0.3) }) + sparkles(1400, 460, 60, YEL), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 「人と人が、仲良くなれる世の中にしたい」。
    (tl, d, t) => cam(fill('#fde8ee') + glow(960, 500, 600, '#fff', 0.4) + mid(tsujiKid, 960, { blink: blinking(t, 1), expr: 'smile', s: 1.5, y: 1060, arms: P.cheer }) + enter(bubble('人と人が、仲良く', 960, 220, { size: 60 }), tl, 0.2, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 戦争で人が傷つけ合う姿を見て、その思いはさらに強くなったと言われている。
    (tl, d, t) => cam(fill('#4a3a3a') + glow(960, 520, 600, '#c8423a', 0.25) + mid(tsujiKid, 960, { blink: blinking(t, 1), expr: 'worry', s: 1.5, y: 1060 }) + xf(heart(0, 0, 1.4), { x: 1400, y: 420, s: 0.6 + clamp(tl / d) * 0.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 その思いが、のちの会社の根っこになる。
    (tl, d) => cam(fill('#f3e6cc') + floor('#8a6a4a', 760) + line([[960, 760], [960, 400]], { w: 30, color: '#7a5a34', passes: 1 }) + [[-200, 900], [-80, 980], [80, 980], [200, 900]].map(([dx, yy]) => line([[960, 760], [960 + dx * clamp(tl / 1.2), 760 + (yy - 760) * clamp(tl / 1.2)]], { w: 14, color: '#7a5a34', passes: 1 })).join('') + heart(960, 360, 1.3) + T('根っこ', 1400, 300, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 県庁と絹
  '04': [
    // 0 大人になった辻は、山梨県庁で働いていた。
    (tl, d, t) => cam(office() + desk(960, 900, 1.2) + mid(tsuji, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.hold, y: 1000 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 山梨は、昔から絹の産地だった。蚕を育て、糸を取り、布を織る。
    [
      (tl, d) => cam(yamanashi() + T('絹の産地', 960, 220, 110, INK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d, t) => cam(fill('#efe6d6') + silkworm(420, 560, 1.2, t) + arrow(640, 500, 760, 500, { w: 10 }) + cocoon(900, 500, 1.3) + arrow(1040, 500, 1160, 500, { w: 10 }) + silkBolt(1440, 520, 1.2) + ['蚕', 'まゆ', '絹'].map((s, i) => text(s, [420, 900, 1440][i], 720, { size: 64, font: 'Zen Maru Gothic', weight: 900 })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 桑の葉を育て、その葉で蚕を育てる。山梨の農家にとって、大切な収入だった。
    [
      (tl, d, t) => cam(yamanashi() + [400, 700, 1300, 1600].map((x) => mulberry(x, 900, 1.2)).join('') + farmer({ x: 1000, y: 1100, s: 1.5, blink: blinking(t, 1), expr: 'smile', arms: P.hold }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#f3e6cc') + silkworm(800, 640, 1.6, t) + `<g transform="translate(1250 700) rotate(20)">${ellipse(0, 0, 120, 80, { fill: '#6a9a4a' })}</g>` + yenSign(1500, 300, tl), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 だが、絹の産業は、だんだん元気をなくしていた。
    (tl, d) => cam(fill('#d8d0c4') + factory(700, 880, 1.2, '#b8a890', false) + chartDown(1400, 420, 0.9, clamp(tl / 1.4)), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 外国からの安い糸や、新しい化学の糸に押されていたのだ。
    (tl, d) => cam(fill('#e2e6ee') + silkBolt(560, 560, 1.4) + xf(silkBolt(0, 0, 1.0, '#bfe0f0'), { x: 1300, y: 480, s: popS(tl, 0.3) }) + xf(silkBolt(0, 0, 1.0, '#f0d0e8'), { x: 1400, y: 640, s: popS(tl, 0.6) }) + T('安い', 1350, 260, 90, RED, C.white) + T('化学の糸', 1350, 860, 80, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 そこで県は、絹を売るための会社を作ることにした。
    (tl, d) => cam(yamanashi() + kencho(700, 900, 0.9, '山梨県庁') + arrow(1100, 640, 1300, 640, { w: 12 }) + xf(sign('絹を売る会社', 1550, 580, { size: 70, fill: CREAM }), { s: popS(tl, 0.4), cx: 1550, cy: 580 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 その仕事を任されたのが、辻だった。
    (tl, d, t) => cam(office() + mid(clerk, 520, { blink: blinking(t, 2), expr: 'smile', arms: P.point }) + mid(tsuji, 1300, { blink: blinking(t, 1), expr: 'wow', flip: true }) + xf(letter(0, 0, 0.9), { x: 900, y: 560, s: popS(tl, 0.3) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 辻は山梨県庁の仕事で、数字の計算や、県の産業の仕事に関わっていた。
    (tl, d, t) => cam(office() + desk(960, 900, 1.2) + calculator(1300, 700, 1.0) + mid(tsuji, 700, { blink: blinking(t, 1), expr: 'smile', arms: P.hold, y: 1000 }) + sound('1 + 2 = 3', 1350, 420, tl, 0.3, INK, 70), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── 県庁を辞める
  '05': [
    // 0 辻は1960年、山梨県庁を辞め、その会社の社長になる。
    [
      (tl, d, t) => cam(yamanashi() + kencho(600, 900, 0.9, '山梨県庁') + tsuji({ x: tw(tl, 0, d, 900, 1400), y: 1100, s: 1.6, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.3) + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.hips }) + xf(sign('社長', 1400, 360, { size: 90, fill: CREAM }), { s: popS(tl, 0.3), cx: 1400, cy: 360 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 名前は「山梨シルクセンター」。のちのサンリオだ。
    (tl, d) => cam(fill('#efe6d6') + building(960, 880, 700, 420, '#d8c8a8') + xf(sign('山梨シルクセンター', 960, 400, { size: 72, fill: CREAM, rot: 0 }), { s: popS(tl, 0.2), cx: 960, cy: 400 }) + (tl > 1.2 ? T('のちの サンリオ', 960, 200, 90, PINK, C.white) : ''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 資金を出したのは、山梨県の知事たちだった。
    (tl, d, t) => cam(office() + mid((o) => kid({ hair: 'bald', shirt: C.white, jacket: '#3a3a3a', tie: RED, pants: '#3a3a3a', ...o }), 600, { blink: blinking(t, 2), expr: 'smile', arms: P.hold }) + moneyBag(1300, 760, 1.0, '¥'), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 安定した公務員の仕事を捨てて、商売の世界に飛び込んだのだ。
    (tl, d, t) => cam(fill('#cfe0e8') + kencho(400, 900, 0.7, '県庁') + building(1500, 880, 420, 320, '#e8c8a0') + sign('商売', 1500, 500, { size: 70, fill: CREAM }) + floor('#a07a50') + tsuji({ x: tw(tl, 0, d, 700, 1150), y: 1100 - Math.sin(clamp(tl / d) * Math.PI) * 200, s: 1.5, blink: blinking(t, 1), expr: 'wow', arms: P.cheer }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 周りの人たちは、本気かと驚いた。
    (tl, d, t) => cam(office() + [420, 960, 1500].map((x, i) => mid(clerk, x, { blink: blinking(t, i), expr: 'wow', s: 1.6, y: 1100 })).join('') + sound('本気？', 960, 260, tl, 0.2, RED, 120), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 だが辻には、自分の手で何かを生み出したいという思いがあった。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.raise }) + sparkles(1250, 420, 70, YEL), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 だが、ここから苦労が始まる。
    (tl, d) => cam(fill('#3a3a4a') + rainCloud(960, 300, tl, 1.5) + T('苦労の始まり', 960, 700, 100, C.white, INK), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 商売の経験は、ほとんどなかったからだ。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'worry', arms: P.shrug, sweat: true }) + T('?', 1300, 380, 160, PINK, C.white) + T('?', 620, 420, 120, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 絹が売れない
  '07': [
    // 0 絹は、思うように売れなかった。
    (tl, d, t) => cam(store() + [0, 1, 2, 3].map((i) => silkBolt(400 + i * 360, 484, 0.9)).join('') + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'worry', y: 1180 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 高い。手入れが大変。時代は、安くて手軽な化学繊維に移っていた。
    [
      (tl, d) => cam(fill('#efe6d6') + silkBolt(960, 520, 1.6) + xf(sign('高い', 560, 260, { size: 90, fill: CREAM }), { s: popS(tl, 0.2), cx: 560, cy: 260 }) + xf(sign('手入れが大変', 1360, 260, { size: 70, fill: CREAM }), { s: popS(tl, 0.8), cx: 1360, cy: 260 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(store() + [0, 1, 2].map((i) => silkBolt(500 + i * 460, 480, 1.0, ['#bfe0f0', '#f0d0e8', '#fbe8a8'][i])).join('') + girl({ x: tw(tl, 0, d, 300, 800), y: 1150, s: 1.5, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 倉庫には、売れ残った絹が積み上がっていく。
    (tl, d) => cam(fill('#8a7a6a') + rect(-200, 880, 2400, 400, { fill: '#5a4a3a', color: null }) + silkPile(960, 880, 1.3, clamp(tl / (d * 0.8))), tl, d, { z0: 1.0, z1: 1.06 }),
    // 3 給料を払うお金にも困るほどだったと言われている。
    (tl, d, t) => cam(office() + mid(tsuji2, 700, { blink: blinking(t, 1), expr: 'worry', sweat: true, arms: P.think }) + `<g transform="translate(1350 600)">${rect(-160, -110, 320, 220, { fill: '#e8dcc4' }) + text('給料', 0, -20, { size: 60, font: 'Zen Maru Gothic', weight: 900 }) + text('¥ 0', 0, 70, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 })}</g>`, tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 会社を立ち上げたばかりなのに、本業はすぐにつまずいてしまう。
    (tl, d) => cam(fill('#d8d0c4') + chartDown(960, 520, 1.3, clamp(tl / 1.4)) + T('つまずき', 960, 900 - 60, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 辻は、絹以外のものを売ることを考え始めた。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsuji2, 700, { blink: blinking(t, 1), expr: 'smile', arms: P.think }) + `<g opacity="0.5">${silkBolt(1350, 360, 0.8)}</g>` + cross(1350, 360, 1.0) + T('?', 1350, 760, 140, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 どんなものなら、人は喜んで買ってくれるのか。毎日、そればかり考えていた。
    [
      (tl, d, t) => cam(fill('#fde8ee') + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.think }) + enter(bubble('何なら、喜んでくれる？', 960, 220, { size: 58 }), tl, 0.2, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#2a2a3a') + glow(1300, 300, 300, '#fff6c8', 0.4) + ellipse(1500, 200, 60, 60, { fill: '#fff6c8', w: 4 }) + desk(960, 900, 1.2) + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.think, y: 1000 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
  ],

  // ───── 花柄のサンダル
  '08': [
    // 0 辻が売り出したのは、ゴムのサンダルだった。
    (tl, d) => cam(fill('#fbeee0') + glow(960, 540, 500, '#fff', 0.4) + xf(sandal(0, 0, 1.6, { rot: -10 }), { x: 800, y: 560, s: popS(tl, 0.1) }) + xf(sandal(0, 0, 1.6, { rot: 10 }), { x: 1120, y: 560, s: popS(tl, 0.3) }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 安くて、どこにでもある、ありふれた商品だ。
    (tl, d) => cam(store() + [0, 1, 2, 3, 4, 5].map((i) => sandal(360 + i * 240, 375, 0.9, { col: '#c8c0b0' })).join('') + T('ありふれた', 960, 220, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 ただのサンダルではない。小さな花の絵を付けたのだ。
    (tl, d) => cam(fill('#fbeee0') + glow(960, 540, 500, YEL, 0.3) + sandal(960, 560, 2.2, { flower: tl > 0.8 }) + (tl > 0.8 ? sparkles(1200, 300, 70, YEL) : ''), tl, d, { z0: 1.0, z1: 1.08 }),
    // 3 すると、これが売れた。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 600, YEL, 0.35) + chartUp([[400, 800], [800, 700], [1100, 520], [1500, 260]], '#4fd65a', clamp(tl / 1.0)) + T('売れた！', 600, 300, 130, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 店に並べると、若い女の子たちが次々と手に取っていった。
    (tl, d, t) => cam(store() + [0, 1, 2, 3].map((i) => sandal(500 + i * 300, 390, 0.8, { flower: true })).join('') + [[400, girl], [960, girl2], [1500, girl]].map(([x, f], i) => f({ x, y: 1180, s: 1.3, blink: blinking(t, i), expr: 'smile', arms: P.hold })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 同じサンダルでも、かわいい絵が付いているだけで、人は手に取ってくれる。
    (tl, d) => cam(fill('#fbeee0') + sandal(600, 560, 1.6) + text('ふつう', 600, 880, { size: 64, font: 'Zen Maru Gothic', weight: 900 }) + sandal(1320, 560, 1.6, { flower: true }) + text('花の絵', 1320, 880, { size: 64, color: PINK, font: 'Zen Maru Gothic', weight: 900 }) + xf(heart(0, 0, 0.9), { x: 1500, y: 260, s: popS(tl, 0.6) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 辻は、気づいた。「人は、かわいいものに、心が動く」。
    (tl, d, t) => cam(fill('#fde8ee') + glow(960, 500, 600, '#fff', 0.4) + mid(tsuji2, 700, { blink: blinking(t, 1), expr: 'wow', arms: P.raise }) + xf(heart(0, 0, 1.8), { x: 1350, y: 480 + bob(tl, 10, 1), s: popS(tl, 0.3) }) + T('かわいい ＝ 心が動く', 1300, 820, 70, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 売っているのは、サンダルではない。持つ人の「うれしい気持ち」なのだ。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.3) + mid(girl, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + [0, 1, 2].map((i) => heart(700 + i * 260, 300 - (i % 2) * 60 + bob(tl + i, 10, 1), 0.8)).join('') + T('うれしい気持ち', 960, 160, 80, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 小さな贈り物
  '09': [
    // 0 もうひとつ、辻が大切にしていた考えがあった。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.raise }) + T('もうひとつ', 1400, 360, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 「小さな贈り物で、人と人は仲良くなれる」。
    (tl, d, t) => cam(fill('#fde8ee') + glow(960, 500, 600, '#fff', 0.4) + mid(girl, 560, { blink: blinking(t, 1), expr: 'smile', arms: P.hold }) + mid(girl2, 1360, { blink: blinking(t, 2), expr: 'smile', flip: true }) + xf(giftBox(0, 0, 0.9), { x: 960, y: 640 + bob(tl, 8, 1), s: popS(tl, 0.3) }) + heart(960, 300, 0.9), tl, d, { z0: 1.0, z1: 1.05 }),
    // 2 高いものでなくていい。ちょっとしたプレゼントが、気持ちを伝えてくれる。
    (tl, d) => cam(fill(CREAM) + `<g opacity="0.5">${moneyBag(600, 700, 1.0, '¥')}</g>` + cross(600, 560, 1.2) + xf(giftBox(0, 0, 1.2), { x: 1300, y: 720, s: popS(tl, 0.4) }) + heart(1300, 380, 0.8), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 「ありがとう」「おめでとう」。言葉にしにくい気持ちを、小さな贈り物が運んでくれる。
    [
      (tl, d) => cam(fill('#fde8ee') + xf(heartCard(0, 0, 1.4, -8), { x: 620, y: 520, s: popS(tl, 0.1) }) + text('ありがとう', 620, 820, { size: 60, color: PINK, font: 'Zen Maru Gothic', weight: 900 }) + xf(heartCard(0, 0, 1.4, 8, '#fff6c8'), { x: 1300, y: 520, s: popS(tl, 0.5) }) + text('おめでとう', 1300, 820, { size: 60, color: PINK, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fff2c8') + mid(girl, 500, { blink: blinking(t, 1), expr: 'smile', arms: P.point }) + mid(girl2, 1420, { blink: blinking(t, 2), expr: 'smile', flip: true }) + giftBox(tw(tl, 0, d, 700, 1150), 720 - Math.sin(clamp(tl / d) * Math.PI) * 160, 0.8), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 4 辻は1962年、贈り物の商品を売り始めた。
    (tl, d) => cam(store() + shelfGifts(tl) + T('贈り物の商品', 960, 200, 90, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 カードや文房具、小物入れ。手のひらサイズの、小さなものばかりだった。
    (tl, d) => cam(fill('#fbeee0') + giftsRow(tl, 560) + T('手のひらサイズ', 960, 200, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 かわいい絵の付いた、小さな贈り物。サンリオの形が、ここで見えてきた。
    (tl, d) => cam(fill('#fde8ee') + glow(960, 520, 600, '#fff', 0.4) + giftBox(960, 760, 1.6) + sparkles(1200, 420, 70, YEL) + T('サンリオの形', 960, 200, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 会社の名前を「サンリオ」に変えたのは、1973年のことだ。
    (tl, d) => cam(fill('#efe6d6') + building(960, 880, 700, 420, '#f2d6e0') + xf(sign('サンリオ', 960, 400, { size: 90, fill: CREAM, rot: 0 }), { s: popS(tl, 0.3), cx: 960, cy: 400 }) + T('1973年', 960, 180, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 足りないのは、自分たちだけのキャラクターだった。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsuji2, 600, { blink: blinking(t, 1), expr: 'smile', arms: P.point }) + rect(1100, 280, 500, 500, { fill: CREAM, w: 6 }) + T('?', 1350, 620, 240, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 借りるキャラクター
  '11': [
    // 0 当時、商品に付ける絵は、ほかの会社のキャラクターを借りることが多かった。
    (tl, d) => cam(fill('#e2e6ee') + building(500, 880, 500, 500, '#b8c0d0') + arrow(820, 520, 1100, 520, { w: 12 }) + mug(1350, 760, 1.4) + T('借りる', 960, 400, 80, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 人気のあるキャラクターは、使用料も高い。
    (tl, d) => cam(fill(CREAM) + billPile(960, 820, 1.4, Math.round(2 + clamp(tl / 1.2) * 6)) + T('使用料', 960, 220, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 借りれば、使うたびにお金がかかる。人気も、相手しだいだ。
    (tl, d) => cam(fill('#efe6d6') + [0, 1, 2].map((i) => (tl > 0.3 + i * 0.4 ? xf(moneyBag(0, 0, 0.6, '¥'), { x: 1400, y: 760 - i * 40, s: popS(tl, 0.3 + i * 0.4) }) : '')).join('') + mug(600, 760, 1.3) + arrow(800, 600, 1200, 600, { w: 10 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 相手の都合で、使えなくなることもある。
    (tl, d) => cam(fill('#3a3a4a') + `<g opacity="${(1 - clamp(tl / 1.4) * 0.7).toFixed(2)}">${mug(960, 760, 1.6)}</g>` + (tl > 0.8 ? cross(960, 560, 1.6) : ''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 「自分たちで、キャラクターを生み出そう」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + enter(bubble('自分たちで生み出そう！', 960, 220, { size: 60 }), tl, 0.2, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 辻は、社内に若いデザイナーを集めた。
    (tl, d, t) => cam(office() + [[500, designer], [960, girl2], [1420, designer]].map(([x, f], i) => mid(f, x, { blink: blinking(t, i), expr: 'smile', arms: i === 1 ? P.cheer : P.hold, s: 1.6 })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 テーマは、子どもたちが「かわいい」と思える、自分たちだけの友だちだった。
    (tl, d) => cam(fill('#fde8ee') + rect(560, 200, 800, 560, { fill: CREAM, w: 6 }) + T('テーマ', 960, 360, 80, INK, C.white) + T('自分たちだけの友だち', 960, 560, 70, PINK, C.white) + heart(960, 680, 0.6), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── 小さな白い猫
  '12': [
    // 0 一人のデザイナーが、一匹の小さな白い猫を描いた。1974年のことだ。
    [
      (tl, d, t) => cam(office() + desk(960, 900, 1.2) + mid(designer, 700, { blink: blinking(t, 1), expr: 'smile', arms: P.hold, y: 1000 }) + `<g transform="translate(1250 520) rotate(-6)">${rect(-180, -220, 360, 440, { fill: '#fbfbf6' })}${whiteCat(0, 190, 0.8 * clamp(tl / 1.0 + 0.05), t)}</g>`, tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => catHero(tl, d, t),
    ],
    // 1 ほかにも、いくつものキャラクターが生まれては、消えていった時代だった。
    (tl, d) => cam(fill('#e9dcc6') + [0, 1, 2, 3, 4].map((i) => `<g opacity="${(1 - clamp((tl - i * 0.4) / 0.8)).toFixed(2)}">${rect(220 + i * 300, 360, 220, 280, { fill: CREAM, w: 5 })}${T('?', 330 + i * 300, 560, 120, '#aaa', C.white)}</g>`).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 頭には、赤いリボン。
    (tl, d, t) => cam(fill('#fde8ee') + whiteCat(960, 1100, 2.4, t) + `<circle cx="${960 - 58 * 2.4}" cy="${1100 - 266 * 2.4}" r="${100 + Math.sin(tl * 5) * 6}" fill="none" stroke="${RED}" stroke-width="12"/>`, tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 横向きに座った、シンプルな姿だった。
    (tl, d, t) => cam(fill('#fbf3e6') + whiteCat(960, 900, 1.6, t) + T('シンプル', 960, 200, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 翌年、この猫を付けた小さなお財布が発売されると、子どもたちに大人気になった。
    [
      (tl, d) => cam(store() + xf(clearPurse(0, 0, 1.4), { x: 960, y: 408, s: popS(tl, 0.2) }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(store() + clearPurse(960, 448, 0.9) + [[420, girl], [800, girl2], [1150, girl], [1520, girl2]].map(([x, f], i) => f({ x, y: 1150, s: 1.4, blink: blinking(t, i), expr: 'smile', arms: P.cheer })).join('') + T('大人気！', 960, 200, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 5 手のひらに収まる、透明な小さなお財布だった。
    (tl, d) => cam(fill('#fde8ee') + glow(960, 540, 500, '#fff', 0.4) + ellipse(960, 760, 360, 140, { fill: '#f6d2b0' }) + clearPurse(960, 640, 1.3), tl, d, { z0: 1.0, z1: 1.06 }),
    // 6 名前の由来は、イギリスの物語に出てくる猫の名前だと言われている。
    (tl, d, t) => cam(fill('#efe6d6') + `<g transform="translate(700 560) rotate(-6)">${rect(-240, -300, 480, 600, { fill: '#7a4a5a' }) + rect(-200, -260, 400, 520, { fill: '#fbf3e6', w: 4 }) + text('むかしむかし…', 0, -150, { size: 50, font: 'Yomogi', weight: 400 })}</g>` + whiteCat(700, 800, 0.6, t, { bow: false }) + T('イギリスの物語', 1400, 400, 80, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 イギリスのロンドン生まれ、という設定も付けられた。当時の日本の子どもたちにとって、イギリスはあこがれの国だった。
    [
      (tl, d, t) => cam(fill('#cfd8e6') + building(400, 880, 300, 600, '#a8a0a0') + rect(380, 180, 40, 100, { fill: '#a8a0a0' }) + ellipse(400, 320, 60, 60, { fill: CREAM, w: 5 }) + townRow(880, 5, 700, 260) + whiteCat(1400, 880, 1.0, t) + T('ロンドン生まれ', 1300, 200, 90, NAVY, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(1300, 400, 500, YEL, 0.35) + mid(girl, 560, { blink: blinking(t, 1), expr: 'wow', arms: P.cheer }) + plane(1350, 360 + bob(tl, 10, 1), 1.0) + T('あこがれ', 1350, 700, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
  ],

  // ───── 口のない顔
  '13': [
    // 0 この猫には、ひとつ不思議なところがある。口が描かれていないのだ。
    [
      (tl, d, t) => cam(fill('#fde8ee') + whiteCat(960, 900, 1.6, t) + T('?', 1300, 400, 180, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#fbf3e6') + ellipse(960, 520, 300, 240, { fill: '#ffffff' }) + T('口が ない', 960, 560, 110, PINK, C.white) + `<circle cx="960" cy="620" r="${80 + Math.sin(tl * 5) * 6}" fill="none" stroke="${RED}" stroke-width="10" stroke-dasharray="20 14"/>`, tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 見る人がうれしいときは、うれしそうに。かなしいときは、そっと寄りそうように見える。
    [
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(girl, 600, { blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + whiteCat(1300, 960, 1.0, t) + heart(1300, 340, 0.8), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#3a4a6a') + rainCloud(960, 200, t, 1.0) + mid(girl2, 700, { blink: blinking(t, 1), expr: 'worry' }) + whiteCat(1200, 960, 1.0, t), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 見る人の気持ちを、そのまま映せるようにした、と言われている。
    (tl, d, t) => cam(fill('#e2e6ee') + `<g transform="translate(960 520)">${ellipse(0, 0, 320, 380, { fill: '#cfe0e8', w: 10 }) + line([[-200, -200], [-120, -280]], { w: 10, color: '#ffffff', passes: 1 })}</g>` + heart(960, 520, 1.4) + T('気持ちを 映す', 960, 980 - 100, 80, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 笑った顔に固定しないからこそ、どんな気持ちのときにも寄りそえる。
    (tl, d, t) => cam(fill('#fde8ee') + whiteCat(960, 900, 1.3, t) + [[480, 'smile', girl], [1440, 'worry', girl2]].map(([x, e, f], i) => f({ x, y: 1100, s: 1.5, blink: blinking(t, i), expr: e })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 この小さな工夫が、世界中の人の心をつかむことになる。
    (tl, d, t) => cam(fill(SKY) + worldMap(960, 520, 1.1, [0, 1, 2, 3, 4, 5]) + mapHearts(960, 520, 1.1, tl, 0.6), tl, d, { z0: 1.0, z1: 1.06 }),
    // 5 言葉がいらない顔だからこそ、どの国の人にも届いたのだ。
    (tl, d, t) => cam(fill('#fbf3e6') + whiteCat(960, 900, 1.2, t) + ['Hello', 'Bonjour', 'Hola', '你好'].map((w, i) => enter(bubble(w, [400, 1520, 420, 1500][i], [300, 300, 640, 640][i], { size: 54 }), tl, 0.2 + i * 0.3, { cx: [400, 1520, 420, 1500][i], cy: [300, 300, 640, 640][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── 使ってもらう商売
  '15': [
    // 0 キャラクターが生まれると、サンリオは新しい稼ぎ方を見つけた。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.3) + mid(tsuji2, 600, { blink: blinking(t, 1), expr: 'wow', arms: P.raise }) + whiteCat(1350, 900, 0.9, t) + sparkles(1350, 400, 70, YEL), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 それは、自分たちが昔、お金を払っていたやり方そのものだった。
    (tl, d) => cam(fill('#e9dcc6') + `<g opacity="0.6">${mug(600, 760, 1.2) + arrow(800, 600, 1200, 600, { w: 10 }) + moneyBag(1400, 760, 0.8, '¥')}</g>` + T('昔は 払う側', 960, 220, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 自分たちで作るだけでなく、ほかの会社に、キャラクターを使ってもらうのだ。
    (tl, d, t) => cam(fill('#fde8ee') + whiteCat(500, 900, 0.9, t) + arrow(760, 560, 1100, 560, { w: 12 }) + [0, 1, 2].map((i) => building(1300 + i * 220, 880, 180, 300 + i * 80, ['#c8d0e0', '#e0d0c8', '#d0e0c8'][i])).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 使ってもらうたびに、使用料が入ってくる。かつて自分たちが払っていた側から、受け取る側になったのだ。
    [
      (tl, d) => cam(fill('#fff2c8') + [0, 1, 2, 3].map((i) => (tl > 0.2 + i * 0.35 ? xf(moneyBag(0, 0, 0.6, '¥'), { x: tw(tl, 0.2 + i * 0.35, 0.8, 1700, 700 + i * 30), y: 760 - i * 40, s: 1 }) : '')).join('') + T('使用料', 960, 220, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill(CREAM) + T('払う側', 560, 520, 100, '#aaa', C.white) + arrow(820, 480, 1100, 480, { w: 14 }) + T('受け取る側', 1400, 520, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 4 文房具、服、お菓子、飛行機まで。キャラクターが付いた商品は、世界中に広がっていった。
    [
      (tl, d) => cam(fill('#fbeee0') + [(x) => pencil(x, 560, 1.4), (x) => tee(x, 720, 1.2), (x) => giftBox(x, 720, 1.2, '#f2d6a8', PINK), (x) => plane(x, 560, 0.9)].map((f, i) => xf(f(0), { x: 300 + i * 440, y: 0, s: popS(tl, 0.1 + i * 0.3) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill(SKY) + worldMap(960, 520, 1.2, [0, 1, 2, 3, 4, 5]) + plane(tw(tl, 0, d, 200, 1700), 300, 0.7), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 子ども向けだけでなく、大人向けの商品やブランドとのコラボレーションも生まれた。
    (tl, d, t) => cam(fill('#efe6d6') + mid(girl, 500, { blink: blinking(t, 1), expr: 'smile', s: 1.4 }) + mid(clerk, 1400, { blink: blinking(t, 2), expr: 'smile', arms: P.hold }) + mug(960, 760, 1.2) + T('大人にも', 960, 220, 90, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 絹を売るはずだった会社は、「かわいい」を世界に売る会社になった。
    (tl, d) => cam(fill('#fde8ee') + `<g opacity="0.5">${silkBolt(500, 560, 1.2)}</g>` + arrow(780, 560, 1100, 560, { w: 14 }) + heart(1400, 560, 2.0) + T('かわいい', 1400, 860, 90, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 今では、世界中の会社と手を組み、キャラクターの力でたくさんの商品が生まれている。
    (tl, d) => cam(fill(SKY) + worldMap(960, 520, 1.1, [0, 1, 2, 3, 4, 5]) + [0, 1, 2, 3, 4].map((i) => xf([(x, y) => mug(x, y, 0.5), (x, y) => tee(x, y, 0.5), (x, y) => giftBox(x, y, 0.5), (x, y) => pencil(x, y, 0.6), (x, y) => heartCard(x, y, 0.5)][i](0, 0), { x: 300 + i * 330, y: 820, s: popS(tl, 0.2 + i * 0.2) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── 世界の「かわいい」
  '16': [
    // 0 東京に屋内のテーマパークを開いたのは、1990年だ。
    (tl, d) => cam(fill('#cfe0e8') + floor('#b8b0a0') + xf(parkHall(0, 0, 1.2), { x: 960, y: 880, s: popS(tl, 0.2) }) + T('1990年', 960, 160, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 雨の日でも遊べる、キャラクターたちの世界だ。
    (tl, d, t) => cam(fill('#8a9ab0') + rainCloud(500, 200, t, 1.0) + rainCloud(1500, 220, t + 1, 0.9) + floor('#7a7a7a') + parkHall(960, 880, 1.1) + T('雨でもOK', 960, 960 - 60, 80, C.white, INK), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 今では、サンリオのキャラクターは、世界中の国と地域で愛されている。
    (tl, d) => cam(fill(SKY) + worldMap(960, 520, 1.2, [0, 1, 2, 3, 4, 5]) + mapHearts(960, 520, 1.2, tl, 0.5), tl, d, { z0: 1.0, z1: 1.05 }),
    // 3 あの白い猫だけでなく、たくさんのキャラクターたちが生まれ、それぞれにファンがいる。
    (tl, d, t) => cam(fill('#fde8ee') + whiteCat(960, 900, 1.0, t) + [[420, '#fbe36a'], [700, '#a8d8f0'], [1220, MINT], [1500, '#f2b6c8']].map(([x, col], i) => xf(`<g>${ellipse(0, -100, 90, 90, { fill: col })}${ellipse(-30, -110, 8, 10, { fill: INK, w: 2 })}${ellipse(30, -110, 8, 10, { fill: INK, w: 2 })}</g>`, { x, y: 900, s: popS(tl, 0.2 + i * 0.2) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 世界の有名人が、あの猫のグッズを身に着けて話題になることもある。
    (tl, d, t) => cam(fill('#2a2430') + glow(960, 500, 500, '#fff', 0.2) + mid((o) => kid({ hair: 'bob', hairColor: '#c9a04a', shirt: '#f2b6c8', pants: '#3a3a3a', glasses: true, ...o }), 960, { blink: blinking(t, 1), expr: 'smile', arms: P.wave }) + [0, 1, 2].map((i) => (Math.sin(tl * 6 + i * 2) > 0.7 ? `<circle cx="${400 + i * 560}" cy="${300 + (i % 2) * 200}" r="60" fill="#fff" opacity="0.8"/>` : '')).join('') + T('話題に', 1500, 260, 90, YEL, INK), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 「かわいい」という日本語が、そのまま世界で通じるようになった。
    (tl, d) => cam(fill(SKY) + worldMap(960, 600, 1.0, [0, 1, 2, 3, 4, 5]) + xf(T('KAWAII', 960, 220, 140, PINK, C.white), { s: popS(tl, 0.2), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 日本のアニメやゲームとともに、日本の「かわいい」という文化は世界に広がっていった。
    (tl, d) => cam(fill('#fbf3e6') + [0, 1, 2].map((i) => xf(rect(-150, -110, 300, 220, { fill: ['#cfe0e8', '#fde8ee', '#fff2c8'][i] }) + heart(0, 0, 0.7), { x: 480 + i * 480, y: 520, s: popS(tl, 0.2 + i * 0.3) })).join('') + T('世界へ', 960, 880 - 40, 90, PINK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 その中心にいたのが、口のない、小さな白い猫だった。
    (tl, d, t) => catHero(tl, d, t, '#fff2c8'),
    // 8 かつて売れ残った絹を前に頭を抱えた会社は、今や世界中の人が知るブランドになった。
    [
      (tl, d, t) => cam(fill('#8a7a6a') + silkPile(1200, 880, 0.9, 1) + mid(tsuji2, 600, { blink: blinking(t, 1), expr: 'worry', arms: P.think }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill(SKY) + worldMap(960, 520, 1.1, [0, 1, 2, 3, 4, 5]) + whiteCat(960, 900, 0.9, t) + sparkles(1200, 380, 70, YEL), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
  ],

  // ───── まとめ
  '17': [
    // 0 さみしい少年時代を過ごし、人と人を仲良くしたいと願った男。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsujiKid, 960, { blink: blinking(t, 1), expr: 'worry', s: 1.5, y: 1060 }) + heart(1350, 360, 0.9), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 公務員の安定を捨ててまで、自分の手で何かを生み出そうとした。
    (tl, d, t) => cam(yamanashi() + kencho(500, 900, 0.8, '山梨県庁') + tsuji({ x: tw(tl, 0, d, 900, 1400), y: 1100, s: 1.6, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 8) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 県庁を飛び出し、絹で失敗し、花柄のサンダルで「かわいい」の力に気づいた。
    (tl, d) => cam(fill('#fbeee0') + [(x) => kencho(x, 760, 0.45, '県庁'), (x) => silkBolt(x, 600, 1.0), (x) => sandal(x, 600, 1.1, { flower: true })].map((f, i) => xf(f(0), { x: 380 + i * 580, y: 0, s: popS(tl, 0.2 + i * 0.6) })).join('') + arrow(600, 600, 760, 600, { w: 10 }) + arrow(1180, 600, 1340, 600, { w: 10 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 そして生まれた小さな白い猫は、言葉の通じない世界の人たちの心までつないだ。
    (tl, d, t) => cam(fill(SKY) + worldMap(960, 520, 1.1, [0, 1, 2, 3, 4, 5]) + whiteCat(960, 920, 0.9, t) + [[420, girl], [1500, girl2]].map(([x, f], i) => f({ x, y: 1100, s: 1.3, blink: blinking(t, i), expr: 'smile', arms: P.cheer })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 サンリオの始まりは、絹ではなく、「仲良く」という願いだった。
    (tl, d) => cam(fill('#fde8ee') + glow(960, 500, 600, '#fff', 0.4) + `<g opacity="0.4">${silkBolt(560, 520, 1.0)}</g>` + heart(1300, 520, 1.8) + T('仲良く', 1300, 820, 100, PINK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 辻信太郎が大切にしてきた言葉がある。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(tsuji2, 960, { blink: blinking(t, 1), expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 6 「みんななかよく」
    (tl) => fill('#111') + typeText('みんな なかよく', 960, 560, tl, { size: 130, color: '#f6c8d4', cps: 6, font: 'Yomogi', weight: 400 }),
    // 7 あなたの好きなキャラクターは誰ですか？ ぜひコメントで教えてください。（実在のキャラクターは描かず、白い猫の後ろ姿と、丸い顔の仲間たち）
    (tl, d, t) => cam(fill('#fde8ee') + glow(960, 500, 700, '#fff', 0.4) + whiteCat(960, 760, 1.0, t) +
      [[360, '#fbe36a'], [640, '#a8d8f0'], [1280, MINT], [1560, '#f2b6c8']].map(([x, col], i) => xf(`<g>${ellipse(0, -100, 90, 90, { fill: col })}${ellipse(-30, -110, 8, 10, { fill: INK, w: 2 })}${ellipse(30, -110, 8, 10, { fill: INK, w: 2 })}${ellipse(-50, -80, 14, 9, { fill: C.pink, color: null })}${ellipse(50, -80, 14, 9, { fill: C.pink, color: null })}</g>`, { x, y: 760 + bob(tl + i, 8, 1), s: popS(tl, 0.2 + i * 0.2) })).join('') +
      enter(bubble('好きなキャラクターは？', 960, 230, { size: 64 }), tl, 0.3, { cx: 960, cy: 230 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 この動画が面白かったら、チャンネル登録もお願いします。
    (tl, d, t) => cam(fill('#c25a72') + glow(800, 500, 700, '#fff', 0.2) + mid(guide, 700, { blink: blinking(t, 9), arms: P.wave }) + xf(sign('チャンネル登録', 1400, 520, { size: 90, fill: C.white, color: '#c25a72', rot: -4 }), { s: popS(tl, 0.3), cx: 1400, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 }),
  ],
};

// 円マーク（農家の収入）
function yenSign(x, y, tl) { return xf(big('¥', 0, 0, 200, '#3f7a5a', { stroke: INK }), { x, y, s: popS(tl, 0.4) }); }

// すみっこのネコ（小ネタ）：[声ファイル, 行, ネコが持っているもの]
const CATS = [['04', 1, () => cocoon(0, 0, 0.3)], ['08', 4, () => sandal(0, 0, 0.18, { flower: true })], ['09', 5, () => giftBox(0, 0, 0.25)], ['15', 4, () => pencil(0, 0, 0.3)], ['17', 7, () => '']];
const withCat = (f, toy) => (tl, d, t) => f(tl, d, t) + cat(lerp(-160, 140, ease.out(clamp((tl - 0.4) / 0.7))), 1010, tl, toy());
for (const [k, i, toy] of CATS) {
  const e = SHOTS[k][i];
  SHOTS[k][i] = Array.isArray(e) ? e.map((f) => withCat(f, toy)) : withCat(e, toy);
}

// ───── 終了画面（20秒・声なし）
export const endScreen = (t) => {
  let s = fill('#c25a72') + glow(960, 500, 900, '#ffffff', 0.12);
  for (let i = 0; i < 10; i++) {
    const k = (t * 0.05 + i * 0.1) % 1;
    s += xf([(x, y, sc) => heart(x, y, sc * 0.6), (x, y, sc) => giftBox(x, y, sc * 0.5), (x, y, sc) => sandal(x, y, sc * 0.4, { flower: true })][i % 3](0, 0, 0.8), { x: (i * 211) % 1920, y: lerp(1180, -100, k), r: t * 20 + i * 30, o: 0.22 });
  }
  s += typeText('次に見るならこちら', 960, 200, t, { size: 80, color: C.white, cps: 14 });
  for (const x of [160, 1020]) s += `<rect x="${x}" y="300" width="740" height="416" rx="24" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="22 14"/>`;
  s += `<circle cx="960" cy="900" r="92" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="18 12"/>`;
  s += cat(lerp(-160, 150, ease.out(clamp((t - 1) / 0.8))), 1010, t, '');
  return s;
};
