// ホンダの絵（行ごとのカット）。声ファイルの番号（章タイトル込みの通し番号）ごとに、行の数だけカットを並べる
// 実在のロゴ・車種の形・人物の似顔絵は描かない。バイクは一般的な形
import { C, text, line, ellipse, rect, poly, arrow, sparkles } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import { sign, bubble, cross, gear, building, townRow, chartDown, trophy, houseFrame, bulb, desk, sneakyCat as cat } from '../lib/cprops.mjs';
import { engine, factory, moneyBag, oldCar } from '../lib/cprops2.mjs';
import { sideRider, bicycle, motorBike, stepBike, sobaTrays, ruins, oldTrain, island, checkerFlag, podium, worldMap, billPile, phone, letter, blueprint, anvil, jet, oilJar } from '../lib/cprops3.mjs';
import { cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const RED = '#c8423a', DRED = '#9a2e28', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', DUSK = '#e8d6c0', ASH = '#cfc6bc';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [40, -60, 40, -60], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50], work: [40, -40, 70, -20], ride: [70, -50, 70, -50] };

const boy = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#6a5a4a', pants: '#4a3a2a', ...o });
const soichiro = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', pants: '#9a9384', ...o });
const fujisawa = (o) => kid({ hair: 'side', hairColor: '#4a4a4a', shirt: C.white, jacket: '#2f3440', tie: '#7a2a2a', pants: '#2f3440', ...o });
const townsman = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#7a6a58', pants: '#4a4038', ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const T = (str, x, y, size, color, stroke = INK) => `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });
const blackType = (str, tl, size = 130) => fill('#111') + typeText(str, 960, 580, tl, { size, color: C.white, cps: 6, font: 'Yomogi', weight: 400 });
const floor = (col = '#a07a50', y = 880) => rect(-200, y, 2400, 400, { fill: col, color: null });
const road = (y = 880) => rect(-200, y, 2400, 400, { fill: '#b9a27a', color: null }) + line([[-200, y + 6], [2200, y + 2]], { w: 5, color: '#8a7a5a', passes: 1 });
const hill = (col = '#9cb98a') => poly([[-200, 900], [700, 520], [1500, 900]], { fill: col }) + rect(-200, 880, 2400, 400, { fill: '#b9a27a', color: null });
const burntTown = () => fill(ASH) + `<rect x="-200" y="-200" width="2400" height="700" fill="#e7c9a8" opacity="0.5"/>` + ruins(500, 880, 1.2) + ruins(1500, 880, 0.9) + floor('#8a7a6a');
const sound = (str, x, y, tl, t0 = 0, col = RED, size = 90) => (tl > t0 ? xf(text(str, 0, 0, { size, color: col, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x: x + Math.sin(tl * 30) * 3, y, s: popS(tl, t0) }) : '');
const yen = (v, x, y, size, color) => big(v, x, y, size, color, { stroke: INK });
// 乗っている人（横向き・座ってこぐ）：うしろの足 → 乗り物 → 体と手前の足 の順に重ねる
const onBike = (x, y, s, o = {}, bo = {}) => { const r = sideRider(x, y, s, o); return r.back + bicycle(x, y, s, bo) + r.front; };
const STEP = { hip: [-100, -168], grip: [165, -252], foot: [-10, -78] };
const onStep = (x, y, s, o = {}, bo = {}, extra = []) => {
  const rs = [sideRider(x, y, s, { ...STEP, ...o }), ...extra.map((e) => sideRider(x, y, s, { ...STEP, ...e }))];
  return rs.map((r) => r.back).join('') + stepBike(x, y, s, bo) + rs.map((r) => r.front).join('');
};
const TOWN = { shirt: '#7a6a58', pants: '#4a4038' };
// 小さな自転車屋（アイコン）
const shopIcon = () => rect(-110, -90, 220, 150, { fill: '#e9d6b0' }) + poly([[-130, -90], [130, -90], [110, -150], [-110, -150]], { fill: RED }) + rect(-80, -60, 70, 120, { fill: C.sky, w: 4 }) + text('自転車', 50, -10, { size: 30, font: 'Zen Maru Gothic', weight: 900 }) + ellipse(50, 30, 22, 22, { fill: 'none', color: '#2b2b30', w: 5 });
// おくるみの赤ちゃん（泣いている）
const babyBundle = (x, y, s, tl) => xf(ellipse(0, 0, 120, 70, { fill: '#f6c8d0' }) + ellipse(-70, -10, 50, 48, { fill: '#f6d2b0' }) +
  poly([[-110, -30], [-90, -62], [-60, -66], [-40, -52]], { fill: '#3a2d25', w: 4 }) + line([[-92, -16], [-80, -12]], { w: 4, passes: 1 }) + line([[-66, -16], [-54, -12]], { w: 4, passes: 1 }) +
  ellipse(-72, 14, 10, 8 + Math.abs(Math.sin(tl * 8)) * 4, { fill: '#7a2a2a', w: 3 }) + line([[-20, -40], [60, 40]], { w: 5, color: '#e8a0b0', passes: 1 }), { x, y: y + Math.sin(tl * 10) * 4, s });
// 「技術」「経営」の札
const tag = (str, x, y, col) => sign(str, x, y, { size: 64, fill: col, color: C.white, rot: 0 });

// ───── 章タイトル（赤）
export const chapterCard = (no, title) => (t) => fill(RED) + glow(960, 540, 700, '#ffffff', 0.12) +
  [0, 1, 2, 3, 4, 5].map((i) => line([[0, 200 + i * 140], [1920, 220 + i * 140]], { w: 3, color: '#d9625a', passes: 1 })).join('') +
  typeText(no, 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
  typeText(title, 960, 620, t, { size: 110, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 });

export const SHOTS = {
  // ───── つかみ
  '01': [
    // 0 戦争が終わった町で、自転車に小さなエンジンを付けた男がいた。
    [
      (tl, d) => cam(burntTown(), tl, d, { z0: 1.15, z1: 1.0 }),
      (tl, d) => cam(fill(SEPIA) + glow(960, 560, 600, '#fff3d6', 0.4) + floor('#a07a50') + bicycle(960, 880, 1.5, { motor: tl > 0.4 }) + (tl > 0.4 ? sparkles(1100, 640, 70, C.yellow) : ''), tl, d, { z0: 1.0, z1: 1.08 }),
    ],
    // 1 その男が作ったバイクは、やがて世界で1億台以上も作られることになる。
    [
      (tl, d) => cam(fill('#cfe6f5') + road(860) + [0, 1, 2, 3].map((i) => stepBike(tw(tl, 0, d, -300, 2400) - i * 480, 860, 0.9, { wheel: tl * 500, col: ['#3f7a5a', RED, '#3a4a6b', '#c99a3a'][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill(DRED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="260" y="380" width="1400" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
        yen(countUp(100000000, tl, 1.4), 960, 600, 160, C.yellow) + typeText('台以上', 960, 690, tl, { size: 60, color: C.white, delay: 1.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 ホンダだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, RED, 0.08) + xf(T('ホンダ', 960, 640, 280, INK, C.white), { s: popS(tl, 0, 0.3), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.1 }),
    // 3 今では、車も、ジェット機まで作る会社だ。
    [
      (tl, d) => cam(fill('#e2e6ee') + road(820) + oldCar(tw(tl, 0, d, 600, 1100), 900, 1.3, { wheel: tl * 300, col: C.white }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#bfe0f5') + `<ellipse cx="400" cy="300" rx="180" ry="60" fill="#fff" opacity="0.8"/><ellipse cx="1500" cy="760" rx="220" ry="70" fill="#fff" opacity="0.8"/>` + jet(tw(tl, 0, d, 500, 1300), tw(tl, 0, d, 700, 380), 1.6), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 その始まりは、軍隊で使われていた、余り物のエンジンだった。
    (tl, d) => cam(fill('#5a5246') + floor('#3e382f', 820) + [0, 1, 2].map((i) => engine(500 + i * 420, 820 - (i === 1 ? 0 : 0), 0.7)).join('') + engine(960, 640, 0.6) +
      xf(T('余り物', 960, 260, 120, C.yellow), { s: popS(tl, 0.5), cx: 960, cy: 220 }), tl, d, { z0: 1.1, z1: 1.0 }),
    // 5 そして、この会社を世界に連れていったのは、一人ではなく、二人の男だった。
    [
      (tl, d, t) => cam(fill(CREAM) + mid(soichiro, 960, { blink: blinking(t, 1), arms: P.hips, expr: 'smile' }) + xf(T('一人？', 1500, 400, 110, INK, C.white), { s: popS(tl, 0.4), cx: 1500, cy: 360 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.3) + mid(soichiro, 640, { blink: blinking(t, 1), arms: P.wave, expr: 'smile' }) + mid(fujisawa, 1280, { blink: blinking(t, 2), arms: P.wave, expr: 'smile', flip: true }) +
        xf(T('二人', 960, 260, 140, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 6 今回は、ホンダが世界一のバイクメーカーになるまでを見ていきましょう。
    (tl, d, t) => cam(fill('#fdf1dc') + mid(guide, 520, { blink: blinking(t, 3), arms: P.point, look: [1, 0] }) + motorBike(1300, 820, 1.3, { col: RED }) +
      enter(bubble('世界一のバイク会社へ', 1300, 300, { size: 56 }), tl, 0.4, { cx: 1300, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 物語は、1946年の浜松から始まる。
    (tl) => blackType('1946年', tl),
  ],

  // ───── 機械好きの少年
  '03': [
    // 0 本田宗一郎は、1906年、静岡県の村に、鍛冶屋の息子として生まれた。
    [
      (tl, d) => cam(fill('#cfe0e8') + poly([[-200, 700], [300, 420], [800, 700]], { fill: '#8fb07a' }) + poly([[600, 700], [1200, 380], [1900, 700]], { fill: '#7ea06a' }) + floor('#b9a070', 700) +
        houseFrame(960, 820, 0.8) + head('1906年', tl), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d, t) => cam(fill('#3a2e28') + `<circle cx="1300" cy="640" r="260" fill="#f2a23a" opacity="0.25"/>` + floor('#2a221e', 900) + anvil(1300, 860, 1.4, (Math.sin(tl * 9) + 1) / 2) +
        mid(boy, 600, { blink: blinking(t, 2), expr: 'wow', look: [1, 0], s: 1.6, y: 1080 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 子どものころ、村に初めて自動車がやってきた。
    (tl, d, t) => cam(fill('#cfe0e8') + hill() + oldCar(tw(tl, 0, d, 2200, 1200), 930, 1.0, { wheel: tl * 200, col: '#2b2b30' }) + mid(boy, 500, { blink: blinking(t, 2), expr: 'wow', look: [1, 0] }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 ガタガタと土の道を走る、黒い鉄のかたまり。村中の人が見物に集まった。
    [
      (tl, d) => cam(fill('#cfe0e8') + road() + oldCar(960, 900 + Math.abs(Math.sin(tl * 12)) * -10, 1.4, { wheel: tl * 300, col: '#2b2b30' }) + `<circle cx="660" cy="860" r="${40 + tl * 20}" fill="#c9b08a" opacity="0.6"/>` + sound('ガタガタ', 1400, 400, tl, 0.3), tl, d, { z0: 1.0, z1: 1.04, y0: 540 + shake(tl, 0, 9, 4) }),
      (tl, d, t) => cam(fill('#cfe0e8') + road() + oldCar(960, 760, 0.8, { col: '#2b2b30' }) + [200, 480, 1440, 1720].map((x, i) => townsman({ x, y: 1130, s: 1.4, blink: blinking(t, i), expr: 'wow', look: [x < 960 ? 1 : -1, 0], flip: x > 960 })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 3 少年は夢中で追いかけ、地面に落ちたオイルのにおいをかいだと言われている。
    [
      (tl, d, t) => cam(fill('#cfe0e8') + road() + oldCar(tw(tl, 0, d, 1300, 1900), 900, 1.0, { wheel: tl * 300, col: '#2b2b30' }) + boy({ x: tw(tl, 0, d, 400, 900), y: 1120, s: 1.5, legs: Math.sin(tl * 12), blink: blinking(t, 2), expr: 'smile', arms: P.cheer }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#cfe0e8') + road(800) + `<ellipse cx="1250" cy="880" rx="200" ry="46" fill="#3a3530"/>` + boy({ x: 600, y: 1560, s: 2.8, blink: true, expr: 'smile', tilt: 12 }) + [0, 1, 2].map((i) => `<path d="M ${1150 + i * 70} 850 q -60 -60 -160 -80 q -100 -20 -200 -60" fill="none" stroke="#8a7a6a" stroke-width="7" opacity="${0.55 - i * 0.12}"/>`).join('') + sound('くんくん', 1450, 380, tl, 0.3, INK, 80), tl, d, { z0: 1.05, z1: 1.12, y0: 600 }),
    ],
    // 4 「いつか、自分で車を作りたい」。
    (tl, d, t) => cam(fill('#2a3050') + sparkles(880, 430, 60, C.yellow) + mid(boy, 700, { blink: blinking(t, 2), expr: 'smile', arms: P.cheer, look: [1, -0.6] }) +
      enter(bubble('いつか、自分で車を作りたい', 1250, 360, { size: 56 }), tl, 0.2, { cx: 1250, cy: 360 }) + xf(oldCar(0, 0, 0.6, { col: RED }), { x: 1300, y: 620, o: 0.9, s: popS(tl, 0.8) }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 その夢が、宗一郎の一生を決めることになる。
    (tl, d, t) => cam(fill(CREAM) + glow(960, 500, 700, C.yellow, 0.2) + boy({ x: 560, y: 1080, s: 1.4, blink: blinking(t, 2), expr: 'smile' }) + xf(arrow(760, 600, 1160, 600, { w: 16 }), { s: popS(tl, 0.3), cx: 960, cy: 600 }) +
      soichiro({ x: 1360, y: 1100, s: 1.8, blink: blinking(t, 3), expr: 'smile', arms: P.hips }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 15歳で東京の自動車修理工場に弟子入りし、機械の腕をみがいていった。
    [
      (tl, d) => cam(fill('#d8dfe6') + townRow(700, 7, 0, 300) + floor('#8a8f96', 880) + head('15歳　東京へ', tl), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + oldCar(1250, 900, 1.2, { col: '#2b2b30' }) + gear(1600, 300, 80, tl * 60, '#9aa0a8') + mid(boy, 560, { blink: blinking(t, 2), arms: P.work, expr: 'smile', look: [1, 0.2] }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 7 最初の仕事は、親方の子どもの子守りだったと言われている。
    (tl, d, t) => cam(fill('#e9dcc6') + floor('#a07a50') + mid(boy, 960, { blink: blinking(t, 2), expr: 'worry', sweat: true, arms: [40, -90, 40, -90] }) + babyBundle(960, 800, 1.3, tl) + sound('えーん', 1450, 360, tl, 0.6, C.blue, 80), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + bob(tl, 6, 1.2) }),
    // 8 それでも宗一郎はあきらめず、やがて修理の腕で一目置かれるようになる。
    (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + engine(1300, 820, 1.0, clamp(1 - tl / (d * 0.6))) + mid(soichiro, 620, { blink: blinking(t, 3), arms: P.work, expr: 'smile', look: [1, 0.2], s: 1.7 }) +
      (tl > d * 0.6 ? xf(T('おおっ', 1450, 400, 100, RED, C.white), { s: popS(tl, d * 0.6), cx: 1450, cy: 360 }) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
    // 9 その後、故郷の浜松で独立し、自分の修理工場を持った。
    (tl, d, t) => cam(fill('#cfe0e8') + floor('#b9a070') + factory(1150, 880, 1.1, '#c9b08a', false) + sign('修理工場', 1150, 520, { size: 60, fill: C.white }) + mid(soichiro, 480, { blink: blinking(t, 3), arms: P.hips, expr: 'smile' }) + head('浜松', tl), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 焼け跡の浜松
  '04': [
    // 0 戦争が終わった浜松の町。
    (tl, d) => cam(burntTown() + `<rect x="-200" y="-200" width="2400" height="1500" fill="#000" opacity="${0.25 - tl * 0.05}"/>`, tl, d, { z0: 1.12, z1: 1.0 }),
    // 1 電車やバスは満員で、ガソリンも足りない。
    [
      (tl, d) => cam(fill('#d8dfe6') + floor('#8a8f96', 880) + oldTrain(tw(tl, 0, d, 900, 1100), 860, 1.2) + T('満員', 1500, 220, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#e2e6ee') + rect(820, 360, 280, 420, { fill: RED }) + rect(870, 420, 180, 120, { fill: '#fdfbf3', w: 5 }) + line([[1100, 520], [1220, 600], [1220, 760]], { w: 10, passes: 1 }) +
        text('0', 960, 515, { size: 90, font: 'Zen Maru Gothic', weight: 900 }) + xf(T('ガソリン足りない', 960, 220, 90, INK, C.white), { s: popS(tl, 0.3), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 物は少なく、町の人たちは、生きていくだけで精一杯だった。
    (tl, d, t) => cam(fill(ASH) + ruins(960, 880, 1.0) + floor('#8a7a6a') + [520, 960, 1400].map((x, i) => townsman({ x, y: 1120, s: 1.5, blink: blinking(t, i), expr: 'worry', arms: P.shrug })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 人々は、重い荷物を積んだ自転車をこいで、遠くまで買い出しに出かけていた。
    (tl, d, t) => cam(fill('#e7d8c0') + road() + [0, 1].map((i) => onBike(tw(tl, 0, d, 300, 1500) - i * 700, 880, 1.1, { ...TOWN, theta: tl * 5 + i, smile: false, blink: blinking(t, i) }, { wheel: tl * 200, load: true })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 坂道では、汗だくになって自転車を押していた。
    (tl, d, t) => cam(fill('#e7d8c0') + `<g transform="rotate(-12 960 800)">${road(820) + bicycle(1000, 820, 1.2, { load: true }) + townsman({ x: 740, y: 1080, s: 1.6, blink: blinking(t, 1), expr: 'worry', sweat: true, arms: [60, -40, 60, -40], tilt: 15 })}</g>` +
      sound('はぁ…はぁ…', 1450, 260, tl, 0.3, INK, 70), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 宗一郎は、その姿を見て考えた。
    (tl, d, t) => cam(fill(DUSK) + floor('#8a7a6a') + mid(soichiro, 760, { blink: blinking(t, 3), arms: P.think, expr: 'smile', look: [1, 0] }) + xf(bicycle(0, 0, 0.6, { load: true }), { x: 1450, y: 840, o: 0.85 }) + T('…', 1000, 380, 120, INK, C.white), tl, d, { z0: 1.0, z1: 1.08 }),
    // 6 「この自転車に、小さなエンジンを付けられないか」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(1350, 500, 500, C.yellow, 0.4) + mid(soichiro, 560, { blink: blinking(t, 3), arms: P.raise, expr: 'wow' }) + bulb(560, 160, 0.9, 1) +
      bicycle(1350, 860, 1.0) + xf(engine(0, 0, 0.35), { x: 1330, y: lerp(400, 700, ease.out(clamp((tl - 0.5) / 0.6))), s: popS(tl, 0.3) }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 自分の機械の腕で、困っている人たちの役に立てるかもしれない。
    (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.35) + mid(soichiro, 760, { blink: blinking(t, 3), arms: P.work, expr: 'smile' }) + gear(1300, 420, 90, tl * 80, '#9aa0a8') + gear(1430, 520, 60, -tl * 120, '#c0c4ca') +
      townsman({ x: 1560, y: 1100, s: 1.5, blink: blinking(t, 1), expr: 'smile', flip: true }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 余り物のエンジン
  '05': [
    // 0 1946年、宗一郎は浜松に小さな研究所を作った。
    [
      (tl) => blackType('1946年', tl),
      (tl, d, t) => cam(fill('#cfe0e8') + floor('#b9a070') + houseFrame(1250, 880, 0.9) + sign('研究所', 1250, 420, { size: 60, fill: C.white }) + mid(soichiro, 520, { blink: blinking(t, 3), arms: P.hips, expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 従業員は、わずか十数人。小さな町工場だった。
    (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + [0, 1, 2, 3, 4].map((i) => worker({ x: 300 + i * 330, y: 1100, s: 1.3, blink: blinking(t, i), expr: 'smile', arms: P.work })).join('') + T('十数人', 960, 230, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 目を付けたのは、軍隊が無線機の電気を作るのに使っていた、小さなエンジンだった。
    [
      (tl, d) => cam(fill('#5a5a4a') + rect(700, 380, 520, 360, { fill: '#5a6a4a' }) + [0, 1, 2].map((i) => ellipse(800 + i * 110, 470, 34, 34, { fill: '#2b2b30', w: 4 })).join('') + rect(780, 560, 360, 120, { fill: '#3a4a3a', w: 4 }) +
        line([[1220, 420], [1400, 250]], { w: 8, color: '#2b2b30', passes: 1 }) + head('無線機', tl, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 560, 500, C.yellow, 0.4) + engine(960, 680, 1.1) + `<circle cx="960" cy="600" r="${260 + Math.sin(tl * 4) * 10}" fill="none" stroke="${RED}" stroke-width="12"/>`, tl, d, { z0: 1.1, z1: 1.0 }),
    ],
    // 3 戦争が終わって、使い道がなくなったものだ。
    (tl, d) => cam(fill('#4a453e') + floor('#2e2a25', 840) + [0, 1, 2, 3, 4].map((i) => engine(320 + i * 320, 840 - (i % 2) * 60, 0.55)).join('') + `<rect x="-200" y="-200" width="2400" height="1500" fill="#b9a27a" opacity="0.15"/>` + T('使い道なし', 960, 240, 100, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    // 4 宗一郎はこれを買い集め、自転車に取り付けた。
    [
      (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + [0, 1, 2].map((i) => engine(1100 + i * 230, 860 - i * 140, 0.45)).join('') + mid(soichiro, 560, { blink: blinking(t, 3), arms: P.hold, expr: 'smile' }) + engine(560, 780, 0.35), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + bicycle(1150, 880, 1.4, { motor: tl > 0.6 }) + mid(soichiro, 520, { blink: blinking(t, 3), arms: P.work, expr: 'smile', look: [1, 0.3] }) + (tl > 0.6 ? sparkles(1270, 650, 70, C.yellow) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 走ると、バタバタと大きな音がする。人々は親しみを込めて、「バタバタ」と呼んだ。
    [
      (tl, d, t) => cam(fill('#cfe0e8') + road() + onBike(tw(tl, 0, d, 300, 1400), 880, 1.2, { ...TOWN, theta: tl * 3, blink: blinking(t, 1) }, { wheel: tl * 500, motor: true, smoke: 1 }) +
        sound('バタバタ', tw(tl, 0, d, 300, 1400) - 420, 560, tl, 0.2, RED, 110), tl, d, { z0: 1.0, z1: 1.04, y0: 540 + shake(tl, 0, 9, 3) }),
      (tl, d, t) => cam(fill('#fbe9d0') + floor('#b9a070') + bicycle(960, 880, 1.0, { motor: true }) + [400, 1520].map((x, i) => townsman({ x, y: 1110, s: 1.5, blink: blinking(t, i), expr: 'smile', arms: P.point, flip: x > 960 })).join('') +
        enter(bubble('「バタバタ」', 960, 280, { size: 80 }), tl, 0.2, { cx: 960, cy: 280 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 6 坂道を、こがずに登れる。それだけで、人々の暮らしは大きく変わった。
    [
      (tl, d, t) => cam(fill('#cfe0e8') + `<g transform="rotate(-12 960 800)">${road(820) + onBike(tw(tl, 0, d, 500, 1300), 820, 1.1, { ...TOWN, theta: 0.6, blink: blinking(t, 1) }, { wheel: tl * 400, motor: true, smoke: 1, load: true })}</g>` +
        xf(T('こがずに登れる！', 560, 200, 80, RED, C.white), { s: popS(tl, 0.4), cx: 560, cy: 170 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.3) + [520, 960, 1400].map((x, i) => townsman({ x, y: 1110, s: 1.5, blink: blinking(t, i), expr: 'smile', arms: P.cheer })).join('') + sparkles(1090, 560, 70, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 7 これが飛ぶように売れた。だが、余り物のエンジンは、すぐに底をつく。
    [
      (tl, d) => cam(fill('#fff2c8') + floor('#b9a070') + [0, 1, 2, 3, 4].map((i) => bicycle(300 + i * 330, 880, 0.6, { motor: true })).join('') + xf(T('売れた！', 960, 280, 140, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 240 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#4a453e') + floor('#2e2a25', 840) + (tl < 0.8 ? engine(960, 840, 0.6) : '') + T('在庫ゼロ', 960, 400, 120, C.white) + xf(cross(960, 760, 1.4), { s: popS(tl, 0.8), cx: 960, cy: 760 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 8 ガソリンが足りないときは、松の根から取った油を混ぜて走らせたとも言われている。
    (tl, d) => cam(fill('#e7d8c0') + floor('#8a6a40') + poly([[300, 880], [380, 300], [440, 300], [520, 880]], { fill: '#7a5a34' }) + poly([[200, 400], [410, 120], [620, 400]], { fill: '#4f7a4a' }) +
      [0, 1, 2].map((i) => line([[400 + i * 30, 880], [330 + i * 60, 980]], { w: 10, color: '#6a4a2a', passes: 1 })).join('') + oilJar(1000, 860, 1.4) + xf(arrow(1120, 700, 1350, 700, { w: 14 }), { s: popS(tl, 0.5), cx: 1235, cy: 700 }) + bicycle(1600, 880, 0.8, { motor: true, smoke: 1 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 自分たちのエンジン
  '07': [
    // 0 「余り物がなくなったら、自分たちで作ればいい」。
    (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + mid(soichiro, 700, { blink: blinking(t, 3), arms: P.point, expr: 'smile' }) + enter(bubble('なければ、作ればいい', 1300, 360, { size: 60 }), tl, 0.2, { cx: 1300, cy: 360 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 宗一郎は、自分で設計したエンジンを作り始めた。
    [
      (tl, d) => cam(fill('#e9dcc6') + desk(960, 900, 1.2) + blueprint(960, 560, 1.4, -3) + line([[1150, 400], [1300, 250]], { w: 10, color: '#c99a3a', passes: 1 }), tl, d, { z0: 1.1, z1: 1.0 }),
      (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + engine(1250, 820, 1.0, clamp(1 - tl / (d * 0.8))) + mid(soichiro, 560, { blink: blinking(t, 3), arms: P.work, expr: 'smile', look: [1, 0.2] }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 部品の一つひとつまで、自分たちで考えて作る。それが宗一郎のやり方だった。
    [
      (tl, d) => cam(fill('#e2e6ee') + [0, 1, 2, 3, 4, 5].map((i) => xf(gear(0, 0, 50 + (i % 3) * 20, tl * 60 * (i % 2 ? 1 : -1), ['#9aa0a8', '#c0c4ca', '#6b7280'][i % 3]), { x: 300 + i * 270, y: 560 + (i % 2) * 120, s: popS(tl, i * 0.15) })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + [0, 1, 2].map((i) => worker({ x: 500 + i * 460, y: 1100, s: 1.5, blink: blinking(t, i), expr: 'smile', arms: P.work })).join('') + gear(960, 300, 90, tl * 60, '#9aa0a8'), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 3 1948年、会社は「本田技研工業」になる。
    [
      (tl) => blackType('1948年', tl),
      (tl, d) => cam(fill('#cfe0e8') + floor('#b9a070') + factory(960, 880, 1.3, '#d9c9a8', false) + xf(sign('本田技研工業', 960, 400, { size: 80, fill: C.white, rot: 0 }), { s: popS(tl, 0.2), cx: 960, cy: 400 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 翌年には、初めての本格的なオートバイを完成させた。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 600, 600, C.yellow, 0.4) + floor('#b9a070') + xf(motorBike(0, 0, 1.6, { col: RED }), { x: 960, y: 880, s: popS(tl, 0.2), cy: -200 }) + sparkles(1260, 520, 80, C.yellow) + head('初めてのオートバイ', tl), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 名前は「ドリーム」。夢という意味だ。
    (tl, d) => cam(fill('#2a3050') + glow(960, 720, 500, '#ffffff', 0.25) + sparkles(1220, 600, 70, C.yellow) + motorBike(960, 900, 1.3, { col: RED }) + xf(T('ドリーム＝夢', 960, 300, 130, C.yellow), { s: popS(tl, 0.2), cx: 960, cy: 260 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 6 だが、宗一郎には、ひとつ大きな弱点があった。
    (tl, d, t) => cam(fill('#3a3a44') + glow(960, 500, 500, '#fff', 0.15) + mid(soichiro, 960, { blink: blinking(t, 3), arms: P.idle, expr: 'smile' }) + xf(T('弱点', 1450, 400, 140, RED, C.white), { s: popS(tl, 0.6), cx: 1450, cy: 360 }), tl, d, { z0: 1.0, z1: 1.1 }),
    // 7 それは、会社にとって命取りにもなりかねない弱点だった。
    (tl, d) => cam(fill('#2a1418') + glow(960, 540, 600, DRED, 0.5) + chartDown(960, 600, 1.4, clamp(tl / (d * 0.7))) + xf(T('命取り？', 960, 230, 120, C.white, DRED), { s: popS(tl, 0.6), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 1.0, 0.4, 8) }),
  ],

  // ───── お金のことは苦手
  '08': [
    // 0 宗一郎は、技術のことになると夢中になる。だが、お金の計算や商売は苦手だった。
    [
      (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 920, 1.3) + blueprint(1250, 700, 0.9, 2) + mid(soichiro, 640, { blink: blinking(t, 3), arms: P.work, expr: 'smile', y: 1180, s: 1.6, look: [1, 0.3] }) + sparkles(820, 590, 60, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#e2e6ee') + mid(soichiro, 760, { blink: blinking(t, 3), arms: P.shrug, expr: 'worry', sweat: true }) + xf(text('1+1=?', 1350, 420, { size: 110, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.3), cx: 1350, cy: 380 }) + moneyBag(1350, 700, 0.9, '¥'), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 一度考え始めると、食事も忘れて、何日も工場にこもるほどだった。
    (tl, d, t) => cam(fill('#2a2430') + `<circle cx="1500" cy="200" r="70" fill="#f4e6b0"/>` + floor('#2e2a25', 860) + engine(1200, 820, 0.8, 0.4) + mid(soichiro, 640, { blink: blinking(t, 3), arms: P.work, expr: 'smile', look: [1, 0.2] }) +
      `<rect x="200" y="160" width="300" height="200" fill="#fdfbf3" stroke="${INK}" stroke-width="6"/>` + text(['1日目', '2日目', '3日目'][Math.min(2, Math.floor(tl / (d / 3)))], 350, 290, { size: 64, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 2 いいエンジンを作っても、売り方がわからない。会社のお金は、いつも足りなかった。
    [
      (tl, d, t) => cam(fill('#e2e6ee') + engine(1250, 760, 0.9) + mid(soichiro, 600, { blink: blinking(t, 3), arms: P.shrug, expr: 'worry' }) + T('どう売る？', 1250, 330, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#2a1418') + glow(960, 540, 600, DRED, 0.4) + moneyBag(960, 640, 1.3 - tl * 0.08, '¥') + xf(T('お金が足りない', 960, 230, 100, C.white, DRED), { s: popS(tl, 0.3), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 気に入らないと、作りかけの部品を放り投げてしまうこともあったと言われている。
    (tl, d, t) => { const k = clamp((tl - 0.6) / 0.8); return cam(fill('#d8cdb8') + floor('#6a6058', 860) + mid(soichiro, 600, { blink: blinking(t, 3), arms: tl < 0.6 ? P.hold : P.cheer, expr: 'angry' }) +
      xf(gear(0, 0, 50, tl * 400, '#9aa0a8'), { x: lerp(780, 1600, k), y: lerp(780, 760, k) - Math.sin(k * Math.PI) * 300 }) + sound('ポイッ', 1350, 320, tl, 0.6), tl, d, { z0: 1.0, z1: 1.05 }); },
    // 4 そこに現れたのが、一人の男だった。
    (tl, d, t) => cam(fill('#1d2030') + `<polygon points="860,-40 1060,-40 1260,1100 660,1100" fill="#fff6d0" opacity="0.2"/>` + xf(fujisawa({ x: 0, y: 0, s: 1.85, blink: blinking(t, 2), expr: 'smile' }), { x: 960, y: 1100, o: clamp(tl / 0.6) }) + T('？', 1300, 400, 140, C.yellow), tl, d, { z0: 1.12, z1: 1.0 }),
  ],

  // ───── 藤沢武夫
  '09': [
    // 0 1949年、宗一郎は、藤沢武夫という男と出会う。
    [
      (tl) => blackType('1949年', tl),
      (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.3) + mid(soichiro, 640, { blink: blinking(t, 1), arms: [12, 8, 70, -20], expr: 'smile' }) + mid(fujisawa, 1280, { blink: blinking(t, 2), arms: [12, 8, 70, -20], expr: 'smile', flip: true }) +
        typeText('藤沢武夫', 1280, 300, tl, { size: 70, color: INK, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 藤沢は、技術のことはわからない。だが、お金と商売のことなら、誰よりもわかる男だった。
    [
      (tl, d, t) => cam(fill('#e2e6ee') + engine(1300, 760, 0.9) + mid(fujisawa, 640, { blink: blinking(t, 2), arms: P.shrug, expr: 'worry' }) + T('？？？', 1300, 380, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(1300, 600, 500, C.yellow, 0.4) + moneyBag(1250, 700, 1.0, '¥') + mid(fujisawa, 640, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + sparkles(1400, 560, 70, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 だが、人の心を読み、どうすれば物が売れるかを考えるのが得意だった。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(fujisawa, 600, { blink: blinking(t, 2), arms: P.think, expr: 'smile' }) + [0, 1, 2].map((i) => townsman({ x: 1150 + i * 250, y: 1100, s: 1.2, blink: blinking(t, i), expr: 'smile', flip: true })).join('') +
      [0, 1, 2].map((i) => xf(text('♥', 0, 0, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 1150 + i * 250, y: 640 - bob(tl, 10, 1, i * 0.3), s: popS(tl, 0.3 + i * 0.2) })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
    // 3 「技術はあなたに任せる。お金と売ることは、わたしに任せてほしい」。
    [
      (tl, d, t) => cam(fill('#fbe9d0') + mid(fujisawa, 1200, { blink: blinking(t, 2), arms: P.point, expr: 'smile', flip: true }) + mid(soichiro, 560, { blink: blinking(t, 1), expr: 'smile' }) + enter(tag('技術', 560, 300, '#3a6ea5'), tl, 0.2, { cx: 560, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#fbe9d0') + mid(fujisawa, 1200, { blink: blinking(t, 2), arms: [12, 8, 40, -120], expr: 'smile', flip: true }) + mid(soichiro, 560, { blink: blinking(t, 1), expr: 'smile' }) + tag('技術', 560, 300, '#3a6ea5') + enter(tag('お金・売る', 1200, 300, RED), tl, 0.2, { cx: 1200, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 二人は、そう約束したと言われている。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 560, 600, C.yellow, 0.35) + soichiro({ x: 680, y: 1180, s: 2.0, blink: blinking(t, 1), arms: [12, 8, 70, -30], expr: 'smile' }) + fujisawa({ x: 1240, y: 1180, s: 2.0, blink: blinking(t, 2), arms: [12, 8, 70, -30], expr: 'smile', flip: true }) +
      xf(T('約束', 960, 220, 120, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 5 技術の宗一郎と、経営の藤沢。この二人三脚が、ホンダを大きく変えていく。
    [
      (tl, d, t) => cam(fill(CREAM) + mid(soichiro, 560, { blink: blinking(t, 1), expr: 'smile', arms: P.hips }) + mid(fujisawa, 1360, { blink: blinking(t, 2), expr: 'smile', arms: P.hips, flip: true }) + tag('技術', 560, 300, '#3a6ea5') + tag('経営', 1360, 300, RED), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#cfe0e8') + road() + soichiro({ x: tw(tl, 0, d, 400, 800), y: 1120, s: 1.6, legs: Math.sin(tl * 8), blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + fujisawa({ x: tw(tl, 0, d, 760, 1160), y: 1120, s: 1.6, legs: -Math.sin(tl * 8), blink: blinking(t, 2), expr: 'smile', arms: P.cheer }) +
        xf(T('二人三脚', 1500, 300, 100, RED, C.white), { s: popS(tl, 0.3), cx: 1500, cy: 260 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 6 藤沢は、全国の自転車屋に手紙を出して、ホンダのエンジンを売ってくれる店を一気に増やした。
    [
      (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 920, 1.2) + mid(fujisawa, 960, { blink: blinking(t, 2), arms: P.work, expr: 'smile', y: 1180, s: 1.6 }) + [0, 1, 2, 3, 4, 5].map((i) => xf(letter(0, 0, 0.8, (i * 13) % 20 - 10), { x: lerp(960, 300 + i * 260, ease.out(clamp((tl - i * 0.2) / 0.6))), y: lerp(700, 260, ease.out(clamp((tl - i * 0.2) / 0.6))) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => { const n = Math.floor(clamp(tl / (d * 0.8)) * 18) + 1; let s = fill('#fbe9d0');
        for (let j = 0; j < n; j++) { const x = 220 + (j % 6) * 296, y = 420 + Math.floor(j / 6) * 220; s += xf(shopIcon(), { x, y, s: popS(tl, j * (d * 0.8) / 18, 0.25) }); }
        return cam(s + head('自転車屋さんが、どんどん仲間に', tl), tl, d, { z0: 1.0, z1: 1.04 }); },
    ],
    // 7 その数は、あっという間に何千という店に広がった。
    (tl, d) => cam(fill('#fbe9d0') + `<rect x="360" y="380" width="1200" height="300" rx="40" fill="${INK}" opacity="0.85"/>` + yen('何千', 960, 600, 180, C.yellow) + typeText('という店に', 960, 800, tl, { size: 70, color: INK, delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 8 宗一郎がいいものを作り、藤沢がそれを売る。ホンダは、ぐんぐん大きくなっていった。
    [
      (tl, d, t) => cam(fill('#fbe9d0') + mid(soichiro, 480, { blink: blinking(t, 1), arms: P.work, expr: 'smile' }) + xf(motorBike(0, 0, 0.7, { col: '#3a4a6b' }), { x: lerp(700, 1200, ease.inOut(clamp(tl / 1.2))), y: 900 }) + mid(fujisawa, 1480, { blink: blinking(t, 2), arms: P.wave, expr: 'smile', flip: true }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#cfe0e8') + floor('#b9a070') + xf(factory(0, 0, 1, '#d9c9a8', false), { x: 960, y: 880, s: lerp(0.6, 1.3, ease.out(clamp(tl / (d * 0.8)))), cx: 0, cy: 0 }) + sparkles(1300, 560, 80, C.yellow) + T('ぐんぐん', 960, 200, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
  ],

  // ───── 無謀な宣言
  '11': [
    // 0 1954年、会社は苦しい時期にあった。
    [
      (tl) => blackType('1954年', tl),
      (tl, d) => cam(fill('#3a3a44') + factory(960, 880, 1.2, '#8a8070') + rainCloudish(tl) + T('苦しい時期', 960, 230, 100, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    ],
    // 1 新しいバイクが売れず、会社は倒産の危機にあったとも言われる。
    (tl, d) => cam(fill('#2a1418') + glow(960, 540, 700, DRED, 0.5) + chartDown(960, 620, 1.5, clamp(tl / (d * 0.7))) + xf(T('倒産の危機', 960, 230, 120, C.white, DRED), { s: popS(tl, 0.8), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 1.2, 0.4, 8) }),
    // 2 そんな中、宗一郎は社員の前で、とんでもない宣言をする。
    (tl, d, t) => cam(fill('#d8cdb8') + floor('#6a6058', 860) + soichiro({ x: 960, y: 900, s: 1.5, blink: blinking(t, 3), arms: P.hold, expr: 'smile' }) + rect(860, 560, 200, 140, { fill: '#fdfbf3', w: 5 }) +
      [0, 1, 2, 3, 4].map((i) => worker({ x: 200 + i * 380, y: 1300, s: 1.5, blink: blinking(t, i), expr: 'smile', flip: i > 2 })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
    // 3 「世界一のオートバイレース、イギリスのマン島TTレースに出場し、勝つ」。
    [
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.4) + mid(soichiro, 560, { blink: blinking(t, 3), arms: P.cheer, expr: 'wow' }) + enter(bubble('世界一のレースに出て、勝つ！', 1250, 340, { size: 60 }), tl, 0.2, { cx: 1250, cy: 340 }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d) => cam(fill('#bfe0f5') + island(960, 560, 1.6) + xf(T('マン島TTレース', 960, 200, 100, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 160 }) + T('イギリス', 960, 860, 70, INK, C.white), tl, d, { z0: 1.1, z1: 1.0 }),
    ],
    // 4 マン島TTレースは、島の一般道を走る、世界でも最も厳しいレースの一つだ。
    (tl, d) => cam(fill('#cfe0e8') + poly([[-200, 900], [500, 400], [1100, 900]], { fill: '#8fb07a' }) + `<path d="M -200 980 C 400 900 600 700 1000 760 S 1700 960 2200 820" fill="none" stroke="#7a7a7a" stroke-width="90"/>` +
      [0, 1].map((i) => motorBike(tw(tl, 0, d, -200, 2000) - i * 500, 900 - i * 60, 0.6, { wheel: tl * 600, race: true, col: [RED, '#3a4a6b'][i] })).join('') + T('世界一きびしい', 1500, 260, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 当時のホンダのバイクは、世界のトップとは、まるで力の差があった。
    (tl, d) => cam(fill('#e2e6ee') + road() + motorBike(tw(tl, 0, d, 400, 1800), 880, 0.8, { wheel: tl * 700, race: true, col: '#3a4a6b' }) + motorBike(tw(tl, 0, d, 300, 700), 880, 0.8, { wheel: tl * 300, race: true, col: RED }) + T('差がありすぎる', 960, 240, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 ヨーロッパのバイクに比べれば、ホンダのエンジンの力は半分にも満たなかったと言われる。
    (tl, d) => { const k = ease.out(clamp(tl / 1.2)); return cam(fill('#fdf1dc') + rect(600, 300, 1000 * k, 140, { fill: '#3a4a6b' }) + rect(600, 560, 440 * k, 140, { fill: RED }) +
      text('ヨーロッパ', 560, 395, { size: 54, font: 'Zen Maru Gothic', weight: 900, anchor: 'end' }) + text('ホンダ', 560, 655, { size: 54, font: 'Zen Maru Gothic', weight: 900, anchor: 'end' }) + (tl > 1.2 ? xf(T('半分以下', 1300, 660, 100, RED, C.white), { s: popS(tl, 1.2), cx: 1300, cy: 620 }) : ''), tl, d, { z0: 1.0, z1: 1.04 }); },
    // 7 社員たちでさえ、無謀だと思ったと言われている。
    (tl, d, t) => cam(fill('#d8cdb8') + [0, 1, 2, 3].map((i) => worker({ x: 300 + i * 440, y: 1100, s: 1.6, blink: blinking(t, i), expr: 'worry', sweat: i % 2 === 0, arms: P.shrug })).join('') + xf(T('無謀だ…', 960, 260, 130, DRED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 世界との差
  '12': [
    // 0 宗一郎は、ヨーロッパのレースを見に行き、その速さに驚いた。
    [
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 560, 1.3, [1]) + xf(arrow(1500, 420, 1000, 330, { w: 14 }), { s: popS(tl, 0.3), cx: 1250, cy: 380 }) + head('ヨーロッパへ', tl), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => cam(fill('#cfe0e8') + road(820) + motorBike(tw(tl, 0, d, -200, 2300), 900, 1.0, { wheel: tl * 900, race: true, col: '#3a4a6b', num: '1' }) + [0, 1, 2].map((i) => line([[tw(tl, 0, d, -200, 2300) - 260 - i * 60, 760 + i * 30], [tw(tl, 0, d, -200, 2300) - 500 - i * 60, 760 + i * 30]], { w: 6, color: '#8a8f96', passes: 1 })).join('') +
        soichiro({ x: 1500, y: 1250, s: 2.0, blink: false, expr: 'wow', look: [-1, 0], flip: true }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 1 自分たちのエンジンの、何倍もの力が出ている。
    (tl, d) => cam(fill('#fdf1dc') + engine(560, 640, 0.7) + engine(1360, 640, 1.3) + T('何倍も', 1360, 230, 120, RED, C.white) + text('ホンダ', 560, 860, { size: 60, font: 'Zen Maru Gothic', weight: 900 }) + text('ヨーロッパ', 1360, 880, { size: 60, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 2 宗一郎は、その差に打ちのめされたと言われている。
    (tl, d, t) => cam(fill('#2a2a34') + `<polygon points="860,-40 1060,-40 1260,1100 660,1100" fill="#fff6d0" opacity="0.15"/>` + mid(soichiro, 960, { blink: blinking(t, 3), arms: P.shrug, expr: 'worry', sweat: true, tilt: -8 }) + rainCloudish(tl, 960, 200), tl, d, { z0: 1.0, z1: 1.1 }),
    // 3 だが、宗一郎はあきらめなかった。部品を持ち帰り、一から調べ直した。
    [
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, C.yellow, 0.35) + mid(soichiro, 960, { blink: blinking(t, 3), arms: P.cheer, expr: 'smile' }) + xf(T('あきらめない', 960, 230, 110, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 920, 1.3) + engine(1200, 700, 0.7, 0.8) + mid(soichiro, 640, { blink: blinking(t, 3), arms: P.work, expr: 'smile', look: [1, 0.3], y: 1180, s: 1.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 エンジンを、もっと速く回す。もっと軽くする。社員たちと、何年も挑戦が続いた。
    [
      (tl, d) => cam(fill('#d8cdb8') + gear(960, 560, 200, tl * 360, '#9aa0a8') + xf(T('もっと速く', 960, 200, 100, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 160 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#2a2430') + `<circle cx="1550" cy="180" r="60" fill="#f4e6b0"/>` + floor('#2e2a25', 860) + engine(960, 820, 0.8) + [0, 1, 2].map((i) => worker({ x: 420 + i * 540, y: 1100, s: 1.5, blink: blinking(t, i), expr: 'smile', arms: P.work })).join('') +
        text(['1年', '2年', '3年', '4年'][Math.min(3, Math.floor(tl / (d / 4)))], 300, 220, { size: 80, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
  ],

  // ───── 完全優勝
  '13': [
    // 0 1959年、ホンダはついにマン島TTレースに初めて出場する。
    [
      (tl) => blackType('1959年', tl),
      (tl, d) => cam(fill('#cfe0e8') + road(820) + checkerFlag(1650, 820, 1.0, tl) + [0, 1, 2].map((i) => motorBike(tw(tl, 0, d, 200, 900) + i * 300, 900, 0.7, { wheel: tl * 600, race: true, col: [RED, '#3a4a6b', '#3f7a5a'][i], num: String(i + 2) })).join('') + T('初出場', 600, 260, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 1 結果は、6位入賞。世界の人たちは、日本から来た小さなチームに驚いた。
    [
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 600, C.yellow, 0.35) + xf(T('6位入賞', 960, 600, 200, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => cam(fill('#cfe0e8') + [0, 1, 2, 3].map((i) => kid({ x: 300 + i * 440, y: 1100, s: 1.5, hair: ['messy', 'side', 'bald', 'side'][i], hairColor: ['#c9a04a', '#8a5a34', '#c9a04a', '#5a3a2a'][i], shirt: [C.blue, '#7a8590', C.green, '#9a6a5a'][i], blink: blinking(t, i), expr: 'wow' })).join('') + sound('！？', 960, 300, tl, 0.2, RED, 140), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 そして2年後の1961年。
    (tl) => blackType('1961年', tl),
    // 3 ホンダは、二つのクラスで、1位から5位までを独り占めした。
    (tl, d) => cam(fill('#cfe0e8') + road(820) + checkerFlag(1650, 820, 1.0, tl) + [0, 1, 2, 3, 4].map((i) => motorBike(tw(tl, 0, d, -300, 1500) - i * 280, 900, 0.6, { wheel: tl * 700, race: true, col: RED, num: String(i + 1) })).join('') + T('1位〜5位', 700, 260, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 上位に並んだのは、すべて日本のバイクだった。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.35) + podium(960, 900, 1.6) + [[-352, -256], [0, -384], [352, -192]].map(([dx, dy], i) => xf(motorBike(0, 0, 0.45, { race: true, col: RED, num: String([2, 1, 3][i]) }), { x: 960 + dx, y: 900 + dy, s: popS(tl, 0.2 + i * 0.2) })).join('') + sparkles(1110, 420, 80, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 「無謀だ」と言われた宣言から、わずか7年。町工場のバイクが、世界の頂点に立った。
    [
      (tl, d) => cam(fill(CREAM) + T('1954', 560, 600, 130, INK, C.white) + xf(arrow(780, 560, 1140, 560, { w: 16 }), { s: popS(tl, 0.3), cx: 960, cy: 560 }) + T('1961', 1360, 600, 130, RED, C.white) + typeText('わずか7年', 960, 820, tl, { size: 90, color: RED, delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#cfe6f5') + poly([[200, 1080], [960, 360], [1720, 1080]], { fill: '#8fa0b0' }) + poly([[800, 510], [960, 360], [1120, 510], [1040, 470], [960, 510], [880, 470]], { fill: C.white, w: 5 }) +
        xf(motorBike(0, 0, 0.5, { col: RED, race: true }), { x: 960, y: 370 }) + line([[1150, 520], [1150, 230]], { w: 6, passes: 1 }) + poly([[1150, 230], [1290, 265], [1150, 300]], { fill: RED, w: 5 }) + sparkles(1110, 300, 70, C.yellow), tl, d, { z0: 1.05, z1: 1.0, y0: 500 }),
    ],
    // 6 日本の町工場が、世界の老舗メーカーを打ち負かしたのだ。
    (tl, d, t) => cam(fill('#fbe9d0') + building(1400, 900, 360, 520, '#8a8f96') + factory(560, 900, 0.8, '#d9c9a8', false) + xf(T('勝った！', 560, 300, 120, RED, C.white), { s: popS(tl, 0.4), cx: 560, cy: 260 }) + sparkles(740, 600, 80, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── そば屋の出前でも
  '15': [
    // 0 レースで勝つ一方で、藤沢は、もっと身近なバイクを考えていた。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(fujisawa, 640, { blink: blinking(t, 2), arms: P.think, expr: 'smile' }) + enter(bubble('もっと身近なバイクを', 1300, 340, { size: 56 }), tl, 0.2, { cx: 1300, cy: 340 }) + xf(stepBike(0, 0, 0.8), { x: 1300, y: 800, o: 0.8, s: popS(tl, 0.8) }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 藤沢と宗一郎は、一緒にヨーロッパを回り、町を走るたくさんの小さなバイクを見ていた。
    [
      (tl, d, t) => cam(fill('#cfe6f5') + worldMap(960, 560, 1.3, [1]) + xf(soichiro({ x: 0, y: 0, s: 0.6, blink: blinking(t, 1), expr: 'smile' }) + fujisawa({ x: 70, y: 0, s: 0.6, blink: blinking(t, 2), expr: 'smile' }), { x: lerp(1400, 980, ease.out(clamp(tl / 1.2))), y: 420 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#e2e6ee') + [0, 1, 2, 3].map((i) => building(260 + i * 460, 760, 300, 360 + (i % 2) * 120, ['#c9b08a', '#a8b0b8', '#d9c0a0', '#b8a8a0'][i])).join('') + road(760) + [0, 1, 2].map((i) => stepBike(tw(tl, 0, d, -200, 2200) - i * 600, 900, 0.7, { wheel: tl * 500, col: ['#c99a3a', '#3a4a6b', RED][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 「そば屋の出前でも、片手で運転できるバイクを作ってほしい」。
    [
      (tl, d, t) => cam(fill('#fbe9d0') + mid(fujisawa, 1300, { blink: blinking(t, 2), arms: P.point, expr: 'smile', flip: true }) + mid(soichiro, 560, { blink: blinking(t, 1), expr: 'wow' }) + enter(bubble('片手で運転できるバイクを', 1100, 300, { size: 56 }), tl, 0.2, { cx: 1100, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#cfe0e8') + road() + onStep(tw(tl, 0, d, 400, 1300), 880, 1.2, { shirt: C.white, pants: '#4a4038', armUp: true, blink: blinking(t, 1) }, { wheel: tl * 400, col: '#3f7a5a' }) +
        sobaTrays(tw(tl, 0, d, 400, 1300) - 102, 880 - 478 * 1.2 - 4 + bob(tl, 4, 2), 0.8, 6), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 3 藤沢の注文から生まれたと言われるのが、1958年の「スーパーカブ」だ。
    [
      (tl) => blackType('1958年', tl),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 600, 600, C.yellow, 0.4) + floor('#b9a070') + xf(stepBike(0, 0, 1.8, { col: '#3f7a5a' }), { x: 960, y: 900, s: popS(tl, 0.2), cy: -150 }) + sparkles(1260, 560, 80, C.yellow) +
        xf(T('スーパーカブ', 960, 230, 120, RED, C.white), { s: popS(tl, 0.4), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 宗一郎は、何度も設計を描き直し、乗りやすさを追い求めた。
    (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 920, 1.3) + [0, 1, 2, 3].map((i) => xf(blueprint(0, 0, 0.6, (i * 9) % 14 - 7), { x: 360 + i * 120, y: 520 + i * 30, s: popS(tl, i * 0.3) })).join('') + mid(soichiro, 1350, { blink: blinking(t, 3), arms: P.work, expr: 'smile', y: 1180, s: 1.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 誰でも乗れて、丈夫で、燃料も少なくてすむ。
    (tl, d) => {
      let s = fill('#fdf1dc');
      ['誰でも乗れる', '丈夫', '燃料が少ない'].forEach((lb, i) => {
        const x = 330 + i * 630;
        s += rect(x - 280, 200, 560, 520, { fill: ['#fff2c8', '#d6dce4', '#e3f1e7'][i] }) + stepBike(x, 560, 0.55, { col: '#3f7a5a' }) + text(lb, x, 660, { size: 54, font: 'Zen Maru Gothic', weight: 900 });
        s += xf(text('✓', x + 200, 300, { size: 120, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.3 + i * 0.6), cx: x + 200, cy: 260 });
      });
      return cam(s, tl, d, { z0: 1.0, z1: 1.03 });
    },
    // 6 女性でも乗りやすいよう、足を大きく上げなくても乗れる形にした。
    (tl, d, t) => cam(fill('#fbe9d0') + floor('#b9a070') + stepBike(1150, 880, 1.5, { col: '#3f7a5a' }) + kid({ x: 620, y: 1100, s: 1.8, hair: 'bob', hairColor: '#2a2420', shirt: C.pink, pants: '#5a4a6a', blink: blinking(t, 2), expr: 'smile', arms: P.point }) +
      xf(arrow(1010, 760, 1010, 640, { w: 12, color: RED }), { s: popS(tl, 0.4), cx: 1010, cy: 700 }) + T('またぐだけ', 1150, 380, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 小さなエンジンで、みんなの暮らしを楽にする。浜松の「バタバタ」と同じ考え方だった。
    [
      (tl, d) => cam(fill(SEPIA) + bicycle(560, 860, 1.0, { motor: true, smoke: 1 }) + T('＝', 960, 640, 160, RED, C.white) + stepBike(1360, 860, 1.1, { col: '#3f7a5a' }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + xf(T('暮らしを楽に', 960, 560, 150, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 500 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
  ],

  // ───── 世界の1億台
  '16': [
    // 0 スーパーカブは、日本だけでなく、世界中の国で走るようになった。
    (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 560, 1.4, [0, 1, 2, 3, 4, 5].slice(0, Math.floor(clamp(tl / (d * 0.8)) * 6) + 1)), tl, d, { z0: 1.0, z1: 1.06 }),
    // 1 アジアの町では、家族を乗せて走る姿や、荷物を山のように積んだ姿が見られる。
    [
      (tl, d, t) => { const bx = tw(tl, 0, d, 400, 1300); return cam(fill('#f5e2c0') + road() + onStep(bx, 880, 1.2, { shirt: C.blue, pants: '#3b4a6b', blink: blinking(t, 1) }, { wheel: tl * 400, col: RED }, [{ hip: [-175, -165], grip: [-70, -330], k: 0.85, shirt: C.pink, pants: '#5a4a6a', hair: '#3a2420', blink: blinking(t, 2) }, { hip: [-5, -170], grip: [150, -250], foot: [50, -80], k: 0.6, shirt: C.yellow, blink: blinking(t, 3) }]), tl, d, { z0: 1.0, z1: 1.04 }); },
      (tl, d, t) => cam(fill('#f5e2c0') + road() + [0, 1, 2, 3].map((i) => rect(tw(tl, 0, d, 400, 1300) - 400, 700 - i * 90, 200, 90, { fill: ['#c9a46a', '#a0c08a', '#d9c08a', '#c98a6a'][i] })).join('') + onStep(tw(tl, 0, d, 400, 1300), 880, 1.2, { ...TOWN, blink: blinking(t, 1) }, { wheel: tl * 400, col: '#3a4a6b' }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 「壊れない」「どこでも直せる」。その信頼が、世界に広がった。
    [
      (tl, d) => cam(fill('#fdf1dc') + stepBike(960, 860, 1.4, { col: '#3f7a5a' }) + enter(sign('壊れない', 560, 300, { size: 80, fill: C.yellow }), tl, 0.2, { cx: 560, cy: 300 }) + enter(sign('どこでも直せる', 1360, 300, { size: 80, fill: '#a8d8b0' }), tl, 0.7, { cx: 1360, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 560, 1.3, [0, 1, 2, 3, 4, 5]) + [0, 1, 2, 3, 4].map((i) => xf(text('♥', 0, 0, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: [1300, 960, 1000, 520, 640][i], y: [400, 320, 520, 330, 640][i], s: popS(tl, i * 0.2) })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 そして2017年、スーパーカブシリーズの生産は、累計で1億台を超えた。
    [
      (tl) => blackType('2017年', tl),
      (tl, d) => cam(fill(DRED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="260" y="380" width="1400" height="320" rx="40" fill="${INK}" opacity="0.85"/>` + yen(countUp(100000000, tl, 1.4), 960, 600, 160, C.yellow) + typeText('台を突破', 960, 690, tl, { size: 60, color: C.white, delay: 1.2 }) + (tl > 1.4 ? sparkles(1680, 400, 90, C.yellow) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 乗り物として、世界で最も多く作られたものの一つと言われている。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 560, 600, C.yellow, 0.35) + trophy(960, 640, 1.4) + xf(T('世界でいちばん多い乗り物の一つ', 960, 220, 80, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 ホンダはその後、車を作り、ジェット機まで作る会社になる。
    [
      (tl, d) => cam(fill('#e2e6ee') + road(820) + oldCar(960, 900, 1.5, { col: C.white }) + head('車', tl), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#bfe0f5') + `<ellipse cx="400" cy="300" rx="180" ry="60" fill="#fff" opacity="0.8"/>` + jet(tw(tl, 0, d, 500, 1300), tw(tl, 0, d, 700, 380), 1.6) + head('ジェット機', tl), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 6 1973年、宗一郎と藤沢は、二人そろって会社を退いた。最後まで、二人三脚だった。
    [
      (tl) => blackType('1973年', tl),
      (tl, d, t) => cam(fill('#f4dcc0') + glow(960, 500, 700, '#ffd8a0', 0.4) + `<circle cx="960" cy="700" r="300" fill="#f2a23a" opacity="0.35"/>` + floor('#8a6a40', 820) + soichiro({ x: tw(tl, 0, d, 1000, 650), y: 1050, s: 1.5, legs: Math.sin(tl * 4), blink: blinking(t, 1), expr: 'smile', flip: true }) +
        fujisawa({ x: tw(tl, 0, d, 1260, 910), y: 1050, s: 1.5, legs: -Math.sin(tl * 4), blink: blinking(t, 2), expr: 'smile', flip: true }) + typeText('最後まで、二人三脚', 960, 200, tl, { size: 80, color: INK, delay: 0.4 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 7 自転車にエンジンを付けた町工場は、世界の乗り物の会社になった。
    (tl, d) => cam(fill(CREAM) + bicycle(380, 820, 0.7, { motor: true }) + xf(arrow(560, 640, 760, 640, { w: 12 }), { s: popS(tl, 0.3), cx: 660, cy: 640 }) + stepBike(960, 820, 0.7, { col: '#3f7a5a' }) +
      xf(arrow(1140, 640, 1340, 640, { w: 12 }), { s: popS(tl, 0.7), cx: 1240, cy: 640 }) + xf(jet(0, 0, 0.7), { x: 1600, y: 600, s: popS(tl, 1.0) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 今では、二輪車の販売台数で、世界のトップを走る会社の一つになっている。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 560, 600, C.yellow, 0.3) + road(820) + [0, 1, 2].map((i) => motorBike(tw(tl, 0, d, 200, 1500) - i * 420, 900, 0.7, { wheel: tl * 500, col: [RED, '#3a4a6b', '#3f7a5a'][i] })).join('') + xf(T('世界のトップ', 960, 250, 120, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 210 }), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── まとめ
  '17': [
    // 0 焼け跡の町で、自転車をこぐ人たちを楽にしたいと思った男。
    (tl, d, t) => cam(burntTown() + bicycle(1300, 880, 0.9, { load: true }) + mid(soichiro, 640, { blink: blinking(t, 3), arms: P.think, expr: 'smile', look: [1, 0] }), tl, d, { z0: 1.06, z1: 1.0 }),
    // 1 オイルのにおいに夢中になった少年は、その夢を世界に広げた。
    [
      (tl, d, t) => cam(fill('#cfe0e8') + road(800) + `<ellipse cx="1250" cy="880" rx="200" ry="46" fill="#3a3530"/>` + boy({ x: 600, y: 1560, s: 2.8, blink: true, expr: 'smile', tilt: 12 }) + [0, 1, 2].map((i) => `<path d="M ${1150 + i * 70} 850 q -60 -60 -160 -80 q -100 -20 -200 -60" fill="none" stroke="#8a7a6a" stroke-width="7" opacity="${0.55 - i * 0.12}"/>`).join(''), tl, d, { z0: 1.05, z1: 1.1, y0: 600 }),
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 560, 1.3, [0, 1, 2, 3, 4, 5]), tl, d, { z0: 1.1, z1: 1.0 }),
    ],
    // 2 苦手なことは、信頼できる相棒に任せた。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 560, 600, C.yellow, 0.35) + soichiro({ x: 680, y: 1180, s: 2.0, blink: blinking(t, 1), arms: [12, 8, 70, -30], expr: 'smile' }) + fujisawa({ x: 1240, y: 1180, s: 2.0, blink: blinking(t, 2), arms: [12, 8, 70, -30], expr: 'smile', flip: true }) + tag('相棒', 960, 220, RED), tl, d, { z0: 1.0, z1: 1.06 }),
    // 3 「無謀だ」と言われた夢を、本当にかなえてしまった。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.35) + podium(960, 900, 1.6) + [[-352, -256], [0, -384], [352, -192]].map(([dx, dy], i) => motorBike(960 + dx, 900 + dy, 0.45, { race: true, col: RED, num: String([2, 1, 3][i]) })).join('') + sparkles(1110, 420, 80, C.yellow), tl, d, { z0: 1.06, z1: 1.0 }),
    // 4 ホンダの始まりは、余り物の小さなエンジンと、二人の男の約束だった。
    [
      (tl, d) => cam(fill(SEPIA) + glow(960, 560, 500, '#fff3d6', 0.4) + engine(960, 700, 1.1), tl, d, { z0: 1.1, z1: 1.0 }),
      (tl, d, t) => cam(fill('#fbe9d0') + mid(soichiro, 640, { blink: blinking(t, 1), arms: [12, 8, 70, -20], expr: 'smile' }) + mid(fujisawa, 1280, { blink: blinking(t, 2), arms: [12, 8, 70, -20], expr: 'smile', flip: true }) + xf(T('約束', 960, 220, 120, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 本田宗一郎は、こんな言葉を残している。
    (tl, d, t) => cam(fill('#1d2030') + glow(960, 500, 600, '#fff', 0.12) + mid(soichiro, 960, { blink: blinking(t, 3), expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.08 }),
    // 6 「チャレンジして失敗を恐れるよりも、何もしないことを恐れろ」
    (tl) => fill('#111') + typeText('チャレンジして失敗を恐れるよりも、', 960, 470, tl, { size: 74, color: C.white, cps: 9, font: 'Yomogi', weight: 400 }) + typeText('何もしないことを恐れろ', 960, 620, tl, { size: 90, color: C.yellow, cps: 9, delay: 1.9, font: 'Yomogi', weight: 400 }) +
      typeText('本田宗一郎', 1500, 800, tl, { size: 50, color: '#bbb', cps: 9, delay: 3.0, font: 'Yomogi', weight: 400 }),
    // 7 あなたが初めて乗ったバイクや車は、何でしたか？ ぜひコメントで教えてください。
    (tl, d, t) => {
      let s = fill('#fdf1dc');
      [['自転車', (x, y) => bicycle(x, y, 0.6, { motor: true })], ['二人三脚', (x, y) => soichiro({ x: x - 80, y: y + 60, s: 0.7, blink: blinking(t, 1), expr: 'smile' }) + fujisawa({ x: x + 80, y: y + 60, s: 0.7, blink: blinking(t, 2), expr: 'smile', flip: true })], ['1億台', (x, y) => stepBike(x, y, 0.7, { col: '#3f7a5a' })]].forEach(([lb, f], i) => {
        const x = 330 + i * 630;
        s += rect(x - 290, 160, 580, 560, { fill: [SEPIA, '#fff2c8', '#d6dce4'][i] }) + f(x, 560) + text(lb, x, 680, { size: 56, font: 'Zen Maru Gothic', weight: 900 });
        s += xf(text('✓', x + 200, 260, { size: 130, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.4 + i * 0.5), cx: x + 200, cy: 220 });
      });
      return s + enter(bubble('初めて乗った乗り物は？', 960, 820, { size: 48 }), tl, d * 0.5, { cx: 960, cy: 820 });
    },
    // 8 この動画が面白かったら、チャンネル登録もお願いします。
    (tl, d, t) => cam(fill(RED) + glow(800, 500, 700, '#fff', 0.2) + mid(guide, 700, { blink: blinking(t, 9), arms: P.wave }) + xf(sign('チャンネル登録', 1400, 520, { size: 90, fill: C.white, color: RED, rot: -4 }), { s: popS(tl, 0.3), cx: 1400, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 }),
  ],
};

// 雨雲（暗い場面用）
function rainCloudish(tl, x = 960, y = 180) {
  let s = `<ellipse cx="${x}" cy="${y}" rx="260" ry="90" fill="#6a6a74"/><ellipse cx="${x - 150}" cy="${y + 20}" rx="150" ry="70" fill="#6a6a74"/><ellipse cx="${x + 160}" cy="${y + 25}" rx="160" ry="70" fill="#6a6a74"/>`;
  for (let i = 0; i < 9; i++) { const k = (tl * 1.5 + i * 0.13) % 1; s += line([[x - 240 + i * 60, y + 80 + k * 300], [x - 250 + i * 60, y + 120 + k * 300]], { w: 4, color: '#8ab0d8', passes: 1 }); }
  return s;
}

// すみっこのネコ（小ネタ）：[声ファイル, 行, ネコが持っているもの]
const CATS = [['05', 5, () => ''], ['09', 7, () => letter(0, 0, 0.35)], ['15', 2, () => sobaTrays(0, 0, 0.25, 3)], ['17', 8, () => '']];
const withCat = (f, toy) => (tl, d, t) => f(tl, d, t) + cat(lerp(-160, 140, ease.out(clamp((tl - 0.4) / 0.7))), 1010, tl, toy());
for (const [k, i, toy] of CATS) {
  const e = SHOTS[k][i];
  SHOTS[k][i] = Array.isArray(e) ? e.map((f) => withCat(f, toy)) : withCat(e, toy);
}

// ───── 終了画面（20秒・声なし）：関連動画2本とチャンネル登録ボタンの枠
export const endScreen = (t) => {
  let s = fill(RED) + glow(960, 500, 900, '#ffffff', 0.12);
  for (let i = 0; i < 10; i++) {
    const k = (t * 0.05 + i * 0.1) % 1;
    s += xf([(x, y, sc) => bicycle(x, y, sc * 0.5), (x, y, sc) => stepBike(x, y, sc * 0.5), (x, y, sc) => engine(x, y, sc * 0.4)][i % 3](0, 0, 0.8), { x: (i * 211) % 1920, y: lerp(1180, -100, k), r: t * 20 + i * 30, o: 0.22 });
  }
  s += typeText('次に見るならこちら', 960, 200, t, { size: 80, color: C.white, cps: 14 });
  for (const x of [160, 1020]) s += `<rect x="${x}" y="300" width="740" height="416" rx="24" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="22 14"/>`;
  s += `<circle cx="960" cy="900" r="92" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="18 12"/>`;
  s += cat(lerp(-160, 150, ease.out(clamp((t - 1) / 0.8))), 1010, t, '');
  return s;
};
