// トヨタ（本番）の映像：場面ごとの「1行＝1カット」リスト。長い行（約5.5秒以上）は配列にして途中で別の絵に切りかえる
// ルール：scripts/ART_DIRECTION.md（人物は腰から上、顔アップは決め台詞だけ、背景に色と場所、カメラは止めない、字幕の上 y≈890 より下に看板を置かない）
import { C, text, line, ellipse, rect, poly, arrow, sparkles } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import { sign, bubble, cross, gear, building, plane, townRow, chartDown, rainCloud, trophy, houseFrame, bulb, sneakyCat as cat } from '../lib/cprops.mjs';
import { woodLoom, powerLoom, shuttle, spool, clothRoll, oldTruck, oldCar, engine, kanban, andon, assemblyLine, ship, moneyBag, factory, bank, shelf, shoji } from '../lib/cprops2.mjs';
import { cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const INDIGO = '#2b3a67', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', NIGHT = '#1f2438', RED = '#c8423a', WOODBG = '#d9b98a';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [40, -60, 40, -60], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50], work: [40, -40, 70, -20] };
// 人物（似顔絵にしない）
const boy = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#6a5a4a', pants: '#4a3a2a', ...o });
const sakichi = (o) => kid({ hair: 'side', hairColor: '#3a2d25', mustache: true, shirt: '#e9e2cf', jacket: '#4a3a2e', pants: '#3a2e24', ...o });
const kiichiro = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: '#4a5568', tie: '#2a6fbf', pants: '#3b4a6b', ...o });
const exec = (o) => kid({ hair: 'side', hairColor: '#6a6a6a', mustache: true, shirt: C.white, jacket: '#2b2b30', tie: '#7a2a2a', pants: '#2b2b30', ...o });
const villager = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#5a6e9a', pants: '#3a3a48', ...o });
const engineer = (o) => kid({ hair: 'side', hairColor: '#3a2d25', glasses: true, shirt: '#c9c2b0', jacket: '#7a8590', pants: '#4b5563', ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const close = (fn, x, o = {}) => fn({ x, y: 1290, s: 3.0, ...o });
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });
const blackType = (str, tl, size = 130) => fill('#111') + typeText(str, 960, 580, tl, { size, color: C.white, cps: 6, font: 'Yomogi', weight: 400 });
const T = (str, x, y, size, color, stroke = INK) => `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
const floor = (col = '#a07a50', y = 880) => rect(-200, y, 2400, 400, { fill: col, color: null });
const lamp = (x, y, k = 1) => line([[x, 0], [x, y - 40]], { w: 5, passes: 1 }) + ellipse(x, y, 34, 40, { fill: '#ffd98a' }) + `<circle cx="${x}" cy="${y}" r="${180 * k}" fill="#ffd98a" opacity="0.22"/>`;
const village = () => fill('#cfe0e8') + poly([[-200, 700], [300, 420], [800, 700]], { fill: '#8fb07a' }) + poly([[600, 700], [1200, 380], [1900, 700]], { fill: '#7ea06a' }) + floor('#b9a070', 700) +
  [0, 1, 2].map((i) => houseFrame(300 + i * 650, 760, 0.55)).join('');
const loomRoom = (night = false) => fill(night ? '#2a2430' : '#d8c3a0') + floor(night ? '#3a2e28' : '#a07a50') + (night ? '' : rect(1300, 180, 380, 300, { fill: '#cfe6f5', w: 8 }));
// 工具箱（取っ手つき・スパナの印）。x,y は箱の下の中心
const toolbox = (x, y) => line([[x - 40, y - 90], [x - 40, y - 120], [x + 40, y - 120], [x + 40, y - 90]], { w: 7, color: '#2b2b30', passes: 1 }) +
  rect(x - 85, y - 90, 170, 90, { fill: RED }) + line([[x - 85, y - 62], [x + 85, y - 62]], { w: 4, passes: 1 }) +
  line([[x - 30, y - 18], [x + 22, y - 44]], { w: 9, color: '#e9e2cf', passes: 1 }) + ellipse(x + 28, y - 47, 11, 11, { fill: '#e9e2cf', w: 3 });
const yen = (v, x, y, size, color) => big(v, x, y, size, color, { stroke: INK });

// ───── 章タイトル（藍色）
export const chapterCard = (no, title) => (t) => fill(INDIGO) + glow(960, 540, 700, '#ffffff', 0.1) +
  [0, 1, 2, 3, 4, 5].map((i) => line([[0, 200 + i * 140], [1920, 220 + i * 140]], { w: 3, color: '#3d4f86', passes: 1 })).join('') +
  typeText(no, 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
  typeText(title, 960, 620, t, { size: 110, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 });

export const SHOTS = {
  // ───── つかみ
  '01': [
    // 0 大工の息子が作った、木の機織り機。
    (tl, d) => cam(fill(SEPIA) + glow(960, 500, 600, '#fff3d6', 0.4) + woodLoom(960, 680, 1.2, { run: tl * 0.8 }), tl, d, { z0: 1.25, z1: 1.05 }),
    // 1 その機械から生まれた会社が、今では1年に1000万台以上の車を売っている。
    [
      (tl, d) => cam(fill('#cfe6f5') + floor('#8a8f96', 760) + [0, 1, 2, 3].map((i) => oldCar(tw(tl, 0, d, -300, 2300) - i * 520, 860, 0.7, { wheel: tl * 400, col: ['#3a4a6b', C.white, '#9a3a3a', '#5a6e8a'][i] })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill(INDIGO) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="300" y="380" width="1320" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
        yen(countUp(10000000, tl, 1.4), 960, 600, 170, C.yellow) + typeText('台以上（1年）', 960, 690, tl, { size: 60, color: C.white, delay: 1.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 トヨタだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, RED, 0.08) + xf(T('トヨタ', 960, 640, 280, INK, C.white), { s: popS(tl, 0, 0.3), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.1 }),
    // 3 だがその始まりは、車ではなかった。布を織る機械と、それをイギリスに売ったお金だった。
    [
      (tl, d) => cam(fill('#e2e6ee') + oldCar(960, 700, 1.4) + xf(cross(960, 560, 2.6), { s: popS(tl, 0.5), cx: 960, cy: 560 }), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, 0.5, 0.4, 10) }),
      (tl, d) => cam(fill(SEPIA) + woodLoom(560, 720, 1.0, { run: tl }) + xf(arrow(860, 500, 1100, 500, { w: 16 }), { s: popS(tl, 0.3), cx: 980, cy: 500 }) + xf(moneyBag(0, 0, 1.3), { x: 1380, y: 520, s: popS(tl, 0.7), cx: 0, cy: 0 }) +
        typeText('イギリスへ', 1380, 200, tl, { size: 70, color: INK, delay: 0.9 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 しかも生みの親は、一度自分の会社を追い出されている。
    (tl, d, t) => cam(fill('#5a5f6a') + rainCloud(700, 200, tl, 1.4) + factory(1450, 760, 0.9, '#9a8f80') + mid(sakichi, 640, { expr: 'worry', arms: P.idle, blink: blinking(t, 3), look: [-1, 0.2], flip: true }) +
      xf(text('出ていけ！', 1450, 300, { size: 80, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.5), cx: 1450, cy: 270 }), tl, d, { z0: 1.0, z1: 1.08, x0: 900 }),
    // 5 1台の機織り機から、どうやって世界一の自動車会社が生まれたのか。
    (tl, d) => cam(fill(CREAM) + woodLoom(450, 700, 0.8, { run: tl }) + xf(arrow(720, 520, 1100, 520, { w: 14 }), { s: popS(tl, 0.3), cx: 910, cy: 520 }) + oldCar(1400, 700, 1.0) +
      xf(trophy(0, 0, 0.9), { x: 1400, y: 300 + bob(tl, 8, 1), s: popS(tl, 0.8), cx: 0, cy: 0 }) + xf(big('？', 910, 420, 160, RED), { s: popS(tl, 1.2), cx: 910, cy: 360 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 今回は、トヨタが車を作るまでと、つぶれかけてから世界一になるまでを見ていきましょう。
    [
      (tl, d, t) => cam(fill('#e7eef6') + glow(700, 500, 600, '#fff', 0.3) + mid(guide, 620, { blink: blinking(t), arms: P.point, look: [1, -0.3] }) + xf(oldTruck(0, 0, 0.9, { wheel: tl * 300 }), { x: 1400, y: 700 }) +
        typeText('車を作るまで', 1400, 300, tl, { size: 70, color: INK, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05, x0: 900 }),
      (tl, d, t) => cam(fill('#e7eef6') + mid(guide, 620, { blink: blinking(t), arms: P.cheer, expr: 'smile' }) + chartDown(1400, 520, 1.0, 1) + xf(arrow(1250, 760, 1600, 300, { w: 18, color: '#2f9a4a', head: 50 }), { s: popS(tl, 0.6), cx: 1420, cy: 530 }) +
        typeText('どん底から世界一へ', 1400, 160, tl, { size: 64, color: RED, delay: 0.2 }), tl, d, { z0: 1.0, z1: 1.05, x0: 900 }),
    ],
    // 7 物語は、1867年の静岡から始まる。
    (tl) => blackType('1867年　静岡', tl),
  ],

  // ───── 村の機織り
  '03': [
    // 0 1867年、今の静岡県の小さな村に、ひとりの男の子が生まれた。豊田佐吉。大工の息子だった。
    [
      (tl, d) => cam(village() + typeText('1867年　静岡', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.06, x0: 800, x1: 1100 }),
      (tl, d, t) => cam(fill('#e8dcc4') + floor() + mid(boy, 760, { s: 1.5, y: 1060, blink: blinking(t, 1), expr: 'smile' }) + typeText('豊田佐吉', 1350, 420, tl, { size: 110, color: INK, cps: 8 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
      (tl, d, t) => cam(fill('#e8dcc4') + floor() + rect(1150, 640, 500, 40, { fill: '#b98a58' }) + mid(kid, 560, { hair: 'side', hairColor: '#3a2d25', shirt: '#6a5a4a', blink: blinking(t, 2), arms: P.work }) +
        mid(boy, 1000, { s: 1.4, y: 1040, blink: blinking(t, 1), look: [-1, 0], flip: true }) + enter(sign('大工の息子', 1400, 300, { size: 70, fill: C.white }), tl, 0.3, { cx: 1400, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 当時の村では、女の人たちが夜遅くまで、手と足を使って布を織っていた。
    (tl, d, t) => cam(loomRoom(true) + lamp(960, 260) + woodLoom(700, 820, 0.95, { run: tl * 1.2 }) + villager({ x: 700, y: 1250, s: 1.6, arms: P.work, blink: blinking(t, 4), look: [0, -0.5] }) +
      woodLoom(1450, 820, 0.8, { run: tl * 1.2 + 0.3 }) + villager({ x: 1450, y: 1200, s: 1.35, arms: P.work, blink: blinking(t, 5) }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 2 一日中働いても、織れる布はほんの少し。佐吉の母も、その一人だったと言われている。
    [
      (tl, d) => cam(fill('#e8dcc4') + glow(960, 540, 600, '#fff', 0.3) + clothRoll(960, 540, 0.6 + 0.1 * Math.min(1, tl)) + xf(text('ほんの少し', 960, 360, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.6), cx: 960, cy: 340 }) +
        `<circle cx="1550" cy="300" r="110" fill="${C.white}" stroke="${INK}" stroke-width="8"/>` + line([[1550, 300], [1550 + Math.sin(tl * 6) * 80, 300 - Math.cos(tl * 6) * 80]], { w: 8, passes: 1 }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => cam(loomRoom(true) + lamp(1100, 260) + woodLoom(1100, 820, 0.95, { run: tl }) + villager({ x: 1100, y: 1250, s: 1.6, arms: P.work, blink: blinking(t, 4), shirt: '#8a5a7a' }) +
        mid(boy, 450, { s: 1.3, y: 1020, blink: blinking(t, 1), look: [1, -0.2] }) + enter(bubble('おかあさん…', 520, 330, { size: 50 }), tl, 0.4, { cx: 520, cy: 330 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 機織りは、農家の大事な稼ぎだった。だが、使う道具は何百年もほとんど変わっていない。
    [
      (tl, d) => cam(village() + clothRoll(700, 560, 0.9) + xf(moneyBag(0, 0, 0.8, '¥'), { x: 1250, y: 540, s: popS(tl, 0.4), cx: 0, cy: 0 }) + xf(arrow(860, 540, 1080, 540, { w: 14 }), { s: popS(tl, 0.2), cx: 970, cy: 540 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#d8c3a0') + glow(960, 500, 600, '#fff', 0.2) + woodLoom(960, 760, 1.1, { run: tl * 0.5 }) + typeText('何百年も、同じ道具', 960, 160, tl, { size: 70, color: INK }) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.15"/>`, tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 4 「もっと楽に、もっと速く織れる機械を作れないか」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(900, 500, 700, C.yellow, 0.3) + close(boy, 760, { blink: blinking(t, 1), expr: 'smile', look: [1, -0.4], arms: P.think }) + xf(bulb(1350, 330, 1.2, 1), { s: popS(tl, 0.2), cx: 1350, cy: 300 }) +
      enter(bubble('もっと速く！', 1400, 640, { size: 64 }), tl, 0.5, { cx: 1400, cy: 640 }), tl, d, { z0: 1.0, z1: 1.1, y0: 540, y1: 480 }),
    // 5 大工の仕事を手伝いながら、佐吉は機械のことばかり考えるようになる。
    (tl, d, t) => cam(fill('#e8dcc4') + floor() + rect(300, 700, 700, 40, { fill: '#b98a58' }) + mid(boy, 650, { s: 1.6, y: 1060, blink: blinking(t, 1), arms: P.work, look: [0.5, -0.4] }) +
      ellipse(1350, 380, 260, 170, { fill: C.white }) + ellipse(1130, 600, 30, 24, { fill: C.white, w: 5 }) + ellipse(1080, 660, 18, 15, { fill: C.white, w: 4 }) + gear(1270, 360, 60, tl * 60) + gear(1380, 420, 45, -tl * 80) + shuttle(1420, 320, 0.7, 20), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 家の納屋にこもり、夜中まで木を削る。村の人たちは、変わり者だとうわさした。
    (tl, d, t) => {
      if (tl < d * 0.5) return cam(fill('#2a2430') + lamp(800, 300) + floor('#3a2e28') + mid(boy, 760, { s: 1.6, y: 1060, blink: blinking(t, 1), arms: [40, -40, 70 + Math.sin(tl * 10) * 20, -20] }) +
        rect(900, 760, 300, 40, { fill: '#b98a58' }) + [0, 1, 2].map((i) => line([[950 + i * 60, 760], [940 + i * 60 - 30, 740 - Math.abs(Math.sin(tl * 8 + i)) * 40]], { w: 5, color: '#d8b080', passes: 1 })).join('') +
        `<circle cx="1500" cy="200" r="60" fill="#fff3c4"/>`, tl, d * 0.5, { z0: 1.0, z1: 1.05 });
      return cam(village() + villager({ x: 600, y: 1100, s: 1.5, blink: blinking(t, 4), look: [1, 0] }) + villager({ x: 1300, y: 1100, s: 1.5, blink: blinking(t, 5), look: [-1, 0], flip: true, shirt: '#8a6a4a' }) +
        enter(bubble('変わり者だね', 950, 380, { size: 54 }), tl - d * 0.5, 0.1, { cx: 950, cy: 380 }), tl - d * 0.5, d * 0.5, { z0: 1.05, z1: 1.0 });
    },
  ],

  // ───── 木の機織り機
  '04': [
    // 0 1890年、23歳の佐吉は、木でできた新しい機織り機を作り上げた。翌年には特許も取った。
    [
      (tl) => blackType('1890年', tl),
      (tl, d, t) => cam(fill('#e8dcc4') + glow(1200, 500, 600, '#fff', 0.3) + floor() + mid(sakichi, 560, { blink: blinking(t, 2), arms: P.point, expr: 'smile', mustache: false, look: [1, 0] }) + woodLoom(1300, 820, 1.0, { run: tl }) +
        xf(T('23歳', 560, 280, 100, RED, C.white), { s: popS(tl, 0.2), cx: 560, cy: 250 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.25) + xf(rect(-260, -340, 520, 680, { fill: '#fdfbf3' }) + text('特許', 0, -200, { size: 110, font: 'Zen Maru Gothic', weight: 900 }) + woodLoom(0, 180, 0.5) +
        ellipse(160, 230, 70, 70, { fill: 'none', color: RED, w: 10 }), { x: 960, y: 540, s: popS(tl, 0.1), cx: 0, cy: 0 }) + typeText('1891年', 1500, 300, tl, { size: 70, color: INK, delay: 0.5 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 1 片手で動かせて、それまでより速く、きれいに布が織れる。
    (tl, d) => cam(fill('#e8dcc4') + floor() + woodLoom(820, 840, 1.15, { run: tl * 2.5, cloth: 0.3 + tl * 0.08 }) + clothRoll(1500, 600, 0.9) + sparkles(1500, 450, 60, C.yellow) +
      enter(sign('速い・きれい', 1500, 260, { size: 64, fill: C.yellow }), tl, 0.5, { cx: 1500, cy: 260 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 2 普通なら、ここで売って一安心だ。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, '#fff', 0.3) + mid(villager, 600, { arms: P.cheer, expr: 'smile', blink: blinking(t, 3) }) + xf(moneyBag(0, 0, 0.8, '¥'), { x: 1300, y: 560 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }) +
      enter(bubble('ひと安心♪', 1300, 250, { size: 54 }), tl, 0.4, { cx: 1300, cy: 250 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 だが、佐吉は満足しなかった。人の力ではなく、機械の力で動く織機を作りたい。
    [
      (tl, d, t) => cam(fill('#e2dccd') + woodLoom(1350, 820, 0.9) + mid(sakichi, 620, { blink: blinking(t, 2), arms: P.hips, expr: 'angry', mustache: false, look: [1, 0] }) + xf(big('まだまだ', 1350, 260, 110, RED), { s: popS(tl, 0.4), cx: 1350, cy: 220 }), tl, d, { z0: 1.0, z1: 1.06, x0: 900 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + ellipse(960, 500, 480, 320, { fill: C.white }) + gear(760, 440, 110, tl * 90) + gear(940, 560, 80, -tl * 120) + powerLoom(1150, 600, 0.6, { run: tl }) +
        typeText('機械の力で', 960, 150, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 1896年、佐吉は日本で初めての、動力で動く織機を完成させる。
    [
      (tl) => blackType('1896年', tl),
      (tl, d) => cam(fill('#d6dce4') + glow(960, 500, 700, '#fff', 0.3) + floor('#8a8f96') + powerLoom(960, 760, 1.1, { run: tl * 1.5 }) +
        enter(sign('日本初', 1550, 260, { size: 90, fill: RED, color: C.white }), tl, 0.5, { cx: 1550, cy: 260 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 5 それまで一人一台だった機織りを、一人で何台も受け持てるようになった。
    (tl, d, t) => {
      if (tl < d * 0.45) return cam(fill('#d8c3a0') + floor() + woodLoom(960, 820, 0.95, { run: tl * 2 }) + villager({ x: 960, y: 1250, s: 1.6, arms: P.work, blink: blinking(t, 4) }) + T('1人1台', 960, 200, 90, INK, C.white), tl, d * 0.45, { z0: 1.0, z1: 1.04 });
      const k = tl - d * 0.45;
      return cam(fill('#d6dce4') + floor('#8a8f96') + [0, 1, 2, 3].map((i) => powerLoom(300 + i * 440, 760, 0.55, { run: k * 1.5 + i * 0.2 })).join('') + worker({ x: lerp(300, 1600, (Math.sin(k * 1.2) + 1) / 2), y: 1150, s: 1.3, legs: Math.sin(k * 8), blink: blinking(t, 5) }) +
        T('1人で何台も', 960, 200, 90, RED, C.white), k, d * 0.55, { z0: 1.05, z1: 1.0 });
    },
    // 6 布の質は良く、値段は外国製よりずっと安い。注文が次々と舞い込んだ。
    (tl, d) => {
      let s = fill('#fff2c8') + glow(960, 500, 700, '#fff', 0.3) + powerLoom(600, 760, 0.8, { run: tl }) + xf(sign('外国製より安い', 1350, 280, { size: 60, fill: C.yellow }), { s: popS(tl, 0.2), cx: 1350, cy: 280 });
      for (let i = 0; i < 8; i++) { const k = clamp((tl - 1.5 - i * 0.25) / 0.6); if (k > 0) s += xf(rect(-70, -45, 140, 90, { fill: C.white }) + text('注文', 0, 15, { size: 34, font: 'Zen Maru Gothic', weight: 900 }), { x: lerp(2100, 1200 + (i % 4) * 140, ease.out(k)), y: 520 + Math.floor(i / 4) * 130, r: (i * 17) % 20 - 10 }); }
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
  ],

  // ───── 追い出された発明家
  '05': [
    // 0 評判を聞きつけた大きな商社が、佐吉に声をかけた。
    (tl, d, t) => cam(fill('#e6e0d4') + building(1500, 880, 360, 560, '#c9b08a') + text('商社', 1500, 300, { size: 60, font: 'Zen Maru Gothic', weight: 900 }) + mid(sakichi, 600, { blink: blinking(t, 2), look: [1, 0], expr: 'smile' }) +
      exec({ x: 1150, y: 1100, s: 1.6, blink: blinking(t, 6), flip: true, look: [-1, 0], arms: P.point }) + enter(bubble('いっしょにやろう', 1000, 300, { size: 54 }), tl, 0.4, { cx: 1000, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 1907年、佐吉の織機を作るための大きな会社がつくられる。佐吉は技術の責任者になった。
    [
      (tl) => blackType('1907年', tl),
      (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a90', 900) + xf(factory(0, 0, 1.4), { x: 960, y: 900, s: popS(tl, 0.1), cx: 0, cy: -200 }) + typeText('織機の会社', 960, 160, tl, { size: 80, color: INK, delay: 0.4 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#e8eef6') + mid(sakichi, 760, { blink: blinking(t, 2), arms: P.cheer, expr: 'smile' }) + enter(sign('技術の責任者', 1400, 400, { size: 70, fill: C.yellow }), tl, 0.3, { cx: 1400, cy: 400 }) + gear(1450, 650, 80, tl * 60), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    ],
    // 2 だが、ここで問題が起きる。佐吉は、利益よりも新しい発明を優先した。
    [
      (tl, d) => cam(fill('#5a5f6a') + rainCloud(960, 220, tl, 1.6) + factory(960, 880, 1.2, '#9a8f80') + xf(big('！', 960, 600, 200, C.yellow), { s: popS(tl, 0.3), cx: 960, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 0.3, 0.4, 10) }),
      (tl, d) => {
        const a = tw(tl, 0.3, 1.3, 0, 14, ease.back);
        let s = fill('#eaf2f6') + rect(940, 360, 40, 520, { fill: '#8a5a34' }) + rect(760, 860, 400, 40, { fill: '#8a5a34' });
        s += `<g transform="rotate(${a.toFixed(2)} 960 360)">` + line([[460, 360], [1460, 360]], { w: 16, passes: 1 }) + sign('利益', 460, 520, { size: 64, fill: C.white }) + sign('発明', 1460, 520, { size: 70, fill: RED, color: C.white }) + gear(1460, 680, 60, tl * 60) + '</g>';
        return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
      },
    ],
    // 3 「発明にお金を使いすぎだ」。会社の重役たちと、ぶつかるようになる。
    [
      (tl, d, t) => cam(fill('#e6e0d4') + [480, 960, 1440].map((x, i) => exec({ x, y: 1120, s: 1.5, blink: blinking(t, i + 6), expr: 'angry', arms: i === 1 ? P.point : P.idle })).join('') + rect(300, 860, 1320, 50, { fill: '#7a5230' }) +
        enter(bubble('お金を使いすぎだ！', 960, 260, { size: 60 }), tl, 0.1, { cx: 960, cy: 260 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#e6e0d4') + mid(sakichi, 600, { blink: blinking(t, 2), expr: 'angry', arms: P.hips, look: [1, 0] }) + mid(exec, 1350, { blink: blinking(t, 7), expr: 'angry', flip: true, look: [-1, 0], arms: P.hips }) +
        xf(text('ムッ', 960, 380, { size: 110, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.3), cx: 960, cy: 340 }) + sparkles(960, 520, 60, RED), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 0.3, 0.5, 8) }),
    ],
    // 4 1910年、話し合いは決裂した。佐吉は、自分の発明でできた会社を去った。
    [
      (tl, d) => cam(fill('#3a3a44') + head('1910年', tl, C.white) + xf(rect(-300, -200, 600, 400, { fill: '#fdfbf3' }) + text('契約', 0, -80, { size: 80, font: 'Zen Maru Gothic', weight: 900 }), { x: 960 - tw(tl, 1.0, 1.6, 0, 120), y: 560, r: -tw(tl, 1.0, 1.6, 0, 12) }) +
        (tl > 1.0 ? line([[960, 340], [930, 470], [990, 600], [940, 760]], { w: 10, color: RED, passes: 1 }) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => {
        const k = tw(tl, 0, d, 0, 1, (x) => x);
        return cam(fill('#f2a65a') + `<circle cx="1550" cy="640" r="200" fill="#f26b3a" opacity="0.8"/>` + floor('#7a5a48', 860) + factory(1450, 880, 1.0, '#c9b08a') +
          sakichi({ x: lerp(1200, 400, k), y: 1060, s: 1.5 - k * 0.3, blink: blinking(t, 2), legs: Math.sin(tl * 7), look: [-1, 0.3], flip: true, expr: 'worry' }), tl, d, { z0: 1.0, z1: 1.04 });
      },
    ],
    // 5 43歳。発明家として、いちばん脂の乗った時期だった。
    (tl, d, t) => cam(fill('#3b2f3f') + glow(760, 560, 500, '#ffd8b0', 0.3) + mid(sakichi, 760, { blink: blinking(t, 2), expr: 'worry', arms: P.idle, look: [0.5, 0.3] }) + xf(T('43歳', 1400, 480, 150, C.white), { s: popS(tl, 0.1), cx: 1400, cy: 420 }) +
      typeText('いちばんの働きざかり', 1400, 660, tl, { size: 54, color: '#ffd8b0', delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.08, x0: 1000 }),
    // 6 失意の佐吉は、アメリカとヨーロッパへ旅に出る。
    (tl, d) => cam(fill('#1d3a5a') + glow(960, 540, 800, '#9fd0ff', 0.12) + poly([[200, 330], [620, 280], [700, 560], [420, 680], [220, 540]], { fill: '#6a9a6a' }) + poly([[900, 300], [1180, 260], [1220, 460], [960, 480]], { fill: '#6a9a6a' }) +
      poly([[1600, 380], [1660, 340], [1690, 460], [1620, 520]], { fill: '#6a9a6a' }) + text('アメリカ', 450, 760, { size: 50, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) + text('ヨーロッパ', 1050, 560, { size: 50, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) +
      ship(lerp(1620, 500, ease.inOut(clamp(tl / d))), 470 - Math.sin(clamp(tl / d) * Math.PI) * 120, 0.35), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 外国の工場を見て回った佐吉は、ある手ごたえをつかむ。自分の織機は、世界でも戦える。
    [
      (tl, d, t) => cam(fill('#cfd6de') + floor('#8a8f96') + [0, 1, 2].map((i) => powerLoom(500 + i * 480, 760, 0.55, { run: tl + i * 0.3 })).join('') + mid(sakichi, 1600, { blink: blinking(t, 2), arms: P.think, look: [-1, 0], flip: true }) +
        typeText('外国の工場', 760, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.04, x0: 1000 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(900, 500, 700, C.yellow, 0.3) + mid(sakichi, 700, { blink: blinking(t, 2), arms: P.cheer, expr: 'smile' }) + xf(trophy(0, 0, 1.0), { x: 1350, y: 380 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }) +
        enter(sign('世界でも戦える', 1350, 700, { size: 64, fill: RED, color: C.white }), tl, 0.5, { cx: 1350, cy: 700 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    ],
    // 8 帰国した佐吉は、もう一度、ゼロから自分の工場を立ち上げる。
    (tl, d, t) => {
      const k = ease.out(clamp(tl / (d * 0.8)));
      return cam(fill('#cfe0e8') + floor('#9a9a90', 900) + `<g opacity="${k.toFixed(2)}">${factory(1300, 900, 0.9)}</g>` + [0, 1, 2].map((i) => rect(1000 + i * 300, 900 - k * 300, 20, k * 300, { fill: '#b98a58', w: 4 })).join('') +
        mid(sakichi, 560, { blink: blinking(t, 2), arms: P.point, expr: 'smile', look: [1, 0] }) + xf(T('ゼロから', 560, 260, 90, RED, C.white), { s: popS(tl, 0.3), cx: 560, cy: 230 }), tl, d, { z0: 1.0, z1: 1.04 });
    },
    // 9 今度は、誰にも口を出させない。自分の工場で、自分の発明を試すためだ。
    [
      (tl, d, t) => cam(fill('#e6e0d4') + rect(960, 0, 30, 1080, { fill: '#8a5a34' }) + rect(990, 0, 940, 1080, { fill: '#d8c3a0' }) + exec({ x: 500, y: 1100, s: 1.6, blink: blinking(t, 6), arms: P.point, expr: 'angry' }) +
        xf(cross(500, 380, 1.4), { s: popS(tl, 0.4), cx: 500, cy: 380 }) + mid(sakichi, 1450, { blink: blinking(t, 2), arms: P.hips, expr: 'smile', look: [-1, 0], flip: true }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#2a2430') + lamp(960, 240) + floor('#3a2e28') + powerLoom(1250, 780, 0.75, { run: tl }) + mid(sakichi, 560, { blink: blinking(t, 2), arms: P.work, look: [1, 0], expr: 'smile' }) + gear(1250, 250, 70, tl * 60), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 10 そしてこの工場から、世界を驚かせる機械が生まれることになる。
    (tl, d) => cam(fill('#1f2438') + glow(960, 560, 600, '#fff6d0', 0.25) + factory(960, 900, 1.2, '#8a8070') + xf(text('？', 960, 500, { size: 240, color: '#ffd23a', font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.8), cx: 960, cy: 420 }) +
      `<circle cx="960" cy="560" r="${200 + Math.sin(tl * 4) * 20}" fill="#fff6d0" opacity="0.12"/>`, tl, d, { z0: 1.0, z1: 1.12 }),
  ],

  // ───── 糸が切れたら止まる
  '07': [
    // 0 機織りでいちばん困るのは、糸が切れることだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 540, 600, '#fff', 0.3) + line([[300, 540], [lerp(940, 900, clamp((tl - 1.2) * 3)), 540 + (tl > 1.2 ? 30 : 0)]], { w: 10, color: '#cfc6b0', passes: 1 }) +
      line([[lerp(980, 1020, clamp((tl - 1.2) * 3)), 540 - (tl > 1.2 ? 30 : 0)], [1620, 540]], { w: 10, color: '#cfc6b0', passes: 1 }) + (tl > 1.2 ? xf(text('プツン', 960, 420, { size: 90, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 1.2), cx: 960, cy: 390 }) : ''), tl, d, { z0: 1.0, z1: 1.15 }),
    // 1 佐吉の織機には、すごい工夫があった。糸が切れると、機械が自分で止まるのだ。
    [
      (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + powerLoom(1250, 760, 0.85, { run: tl }) + mid(sakichi, 520, { blink: blinking(t, 2), arms: P.point, expr: 'smile', look: [1, 0] }) + xf(bulb(520, 300, 0.8, 1), { s: popS(tl, 0.3), cx: 520, cy: 280 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
      (tl, d) => cam(fill('#d6dce4') + glow(960, 500, 600, '#fff', 0.3) + powerLoom(960, 760, 1.15, { run: tl < 1 ? tl * 2 : 2, cut: tl > 0.8, lamp: tl > 1.0 }) + (tl > 1.0 ? xf(sign('ピタッ', 1500, 260, { size: 90, fill: C.yellow }), { s: popS(tl, 1.0), cx: 1500, cy: 260 }) : ''), tl, d, { z0: 1.0, z1: 1.08 }),
    ],
    // 2 糸が切れたまま動き続けると、傷のある布が大量にできてしまう。
    (tl, d) => {
      let s = fill('#e2dccd') + powerLoom(560, 720, 0.75, { run: tl * 2, cut: true });
      const n = Math.floor(clamp(tl / (d * 0.8)) * 8);
      for (let i = 0; i < n; i++) s += clothRoll(1150 + (i % 2) * 330, 860 - Math.floor(i / 2) * 110, 0.6) + line([[1100 + (i % 2) * 330, 830 - Math.floor(i / 2) * 110], [1180 + (i % 2) * 330, 890 - Math.floor(i / 2) * 110]], { w: 6, color: RED, passes: 1 });
      return cam(s + typeText('傷のある布', 1300, 160, tl, { size: 70, color: RED }), tl, d, { z0: 1.0, z1: 1.05 });
    },
    // 3 止まれば、すぐに直せる。ムダな布は出ない。
    (tl, d, t) => cam(fill('#e2f1dc') + glow(960, 500, 600, '#fff', 0.3) + powerLoom(1250, 760, 0.8, { lamp: true }) + mid(worker, 560, { blink: blinking(t, 5), arms: P.work, look: [1, 0], expr: 'smile' }) +
      enter(sign('すぐ直せる', 1250, 220, { size: 70, fill: C.yellow }), tl, 0.3, { cx: 1250, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    // 4 しかも、人が機械に付きっきりでいる必要がない。一人で何台もの機械を見られるようになった。
    [
      (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + powerLoom(960, 760, 0.8, { run: tl }) + worker({ x: 960, y: 1180, s: 1.5, blink: blinking(t, 5), arms: P.idle, expr: 'worry' }) +
        xf(cross(960, 520, 2.4), { s: popS(tl, 0.8), cx: 960, cy: 520 }) + typeText('付きっきり', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + [0, 1, 2, 3, 4].map((i) => powerLoom(220 + i * 370, 760, 0.45, { run: tl + i * 0.2, lamp: i === 3 })).join('') +
        worker({ x: lerp(300, 1500, (Math.sin(tl * 1.4) + 1) / 2), y: 1150, s: 1.3, legs: Math.sin(tl * 8), blink: blinking(t, 5), expr: 'smile' }) + T('1人で何台も', 960, 200, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 5 「おかしいときは、機械が止まる」。
    (tl, d) => cam(fill(INDIGO) + glow(960, 500, 600, '#fff', 0.15) + powerLoom(960, 700, 0.9, { cut: true, lamp: true }) + typeText('おかしいときは、止まる', 960, 180, tl, { size: 80, color: C.white, cps: 12 }), tl, d, { z0: 1.0, z1: 1.08 }),
    // 6 この考え方は、のちにトヨタの車づくりの土台になる。トヨタではこれを「自働化」と呼んでいる。にんべんの付いた「働」だ。
    [
      (tl, d) => cam(fill('#e2e6ee') + powerLoom(500, 720, 0.7, { lamp: true }) + xf(arrow(800, 520, 1050, 520, { w: 16 }), { s: popS(tl, 0.3), cx: 925, cy: 520 }) + assemblyLine(1450, 760, 0.5, tl) +
        typeText('のちの車づくりへ', 1200, 180, tl, { size: 64, color: INK, delay: 0.4 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.2) + xf(T('自働化', 960, 600, 240, INK, C.white), { s: popS(tl, 0.1), cx: 960, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d) => cam(fill(CREAM) + T('自', 560, 600, 240, INK, C.white) + T('働', 960, 600, 240, RED, C.white) + T('化', 1360, 600, 240, INK, C.white) +
        `<ellipse cx="${905}" cy="${520}" rx="${70}" ry="${110}" fill="none" stroke="${RED}" stroke-width="12" opacity="${clamp(tl * 2).toFixed(2)}"/>` + typeText('にんべん＝人の知恵', 960, 840, tl, { size: 60, color: RED, delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.08, x0: 960, x1: 930 }),
    ],
  ],

  // ───── 世界一の自動織機
  '08': [
    // 0 佐吉には、息子がいた。豊田喜一郎。東京の大学で機械を学んだ、若い技術者だ。
    [
      (tl, d, t) => cam(fill('#e8eef6') + glow(800, 500, 600, '#fff', 0.3) + mid(sakichi, 560, { blink: blinking(t, 2), arms: P.point, expr: 'smile', look: [1, 0] }) + mid(kiichiro, 1300, { blink: blinking(t, 3), arms: P.idle, look: [-1, 0], flip: true }) +
        enter(sign('息子', 1300, 260, { size: 70, fill: C.white }), tl, 0.4, { cx: 1300, cy: 260 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#e8eef6') + mid(kiichiro, 700, { blink: blinking(t, 3), arms: P.hold, expr: 'smile' }) + typeText('豊田喜一郎', 1380, 420, tl, { size: 100, color: INK, cps: 8 }) +
        enter(sign('東京の大学で機械を学ぶ', 1380, 620, { size: 50, fill: C.yellow }), tl, 1.2, { cx: 1380, cy: 620 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    ],
    // 1 発明一筋の父と、理屈で考える息子。二人は親子で、さらに上を目指した。
    [
      (tl, d, t) => cam(fill('#fbf3e6') + rect(960, 0, 10, 1080, { fill: INK, color: null }) + rect(0, 0, 960, 1080, { fill: '#f2e2c8', color: null }) + rect(970, 0, 960, 1080, { fill: '#dde8f2', color: null }) +
        mid(sakichi, 480, { blink: blinking(t, 2), arms: P.work, look: [0.5, 0.3] }) + gear(780, 320, 60, tl * 60) + mid(kiichiro, 1440, { blink: blinking(t, 3), arms: P.think, look: [-0.5, -0.3], flip: true }) +
        text('E=?', 1180, 320, { size: 60, color: INK, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.03 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 400, 700, C.yellow, 0.3) + mid(sakichi, 640, { blink: blinking(t, 2), arms: P.cheer, expr: 'smile' }) + mid(kiichiro, 1280, { blink: blinking(t, 3), arms: P.cheer, expr: 'smile', flip: true }) +
        xf(arrow(960, 700, 960, 220, { w: 20, color: '#2f9a4a', head: 60 }), { s: popS(tl, 0.4), cx: 960, cy: 460 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 狙ったのは、動きを止めずに、糸を自動で補充できる織機だ。
    (tl, d) => {
      const k = (tl * 0.8) % 1;
      return cam(fill('#d6dce4') + glow(960, 500, 600, '#fff', 0.3) + powerLoom(960, 760, 1.0, { run: tl * 1.5 }) + shuttle(lerp(1700, 1180, ease.inOut(k)), 520, 1.2, 0) + xf(arrow(1650, 420, 1300, 420, { w: 12, color: '#2f9a4a' }), { o: 0.8 }) +
        typeText('止めずに、糸を補充', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.06 });
    },
    // 3 1924年、ついに「G型自動織機」が完成する。
    (tl, d) => cam(fill(INDIGO) + glow(960, 540, 700, '#fff', 0.2) + head('1924年', tl, C.white) + xf(powerLoom(0, 0, 1.15, { run: tl * 2 }), { x: 960, y: 760, s: popS(tl, 0.2), cx: 0, cy: -150 }) +
      sparkles(1500, 400, 80, C.yellow) + sparkles(420, 420, 70, C.yellow) + enter(sign('G型自動織機', 960, 860, { size: 70, fill: C.yellow }), tl, 0.8, { cx: 960, cy: 860 }).replace(/translate\(960 860\)/, 'translate(960 300)'), tl, d, { z0: 1.0, z1: 1.06 }),
    // 4 機械が止まらない。人の手もほとんどいらない。当時の世界最高レベルの機織り機だった。
    [
      (tl, d) => cam(fill('#d6dce4') + floor('#8a8f96') + [0, 1, 2, 3].map((i) => powerLoom(280 + i * 450, 760, 0.55, { run: tl * 2 + i * 0.25 })).join('') + T('止まらない', 960, 200, 90, INK, C.white), tl, d, { z0: 1.06, z1: 1.0, x0: 800, x1: 1100 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.35) + powerLoom(960, 720, 0.9, { run: tl * 2 }) + xf(trophy(0, 0, 1.1), { x: 960, y: 230 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }) +
        enter(sign('世界最高レベル', 1550, 520, { size: 60, fill: RED, color: C.white }), tl, 0.6, { cx: 1550, cy: 520 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 佐吉が、納屋で木を削り始めてから、およそ40年。ついに、世界の頂点に手が届いた。
    [
      (tl, d, t) => cam(fill('#2a2430') + lamp(800, 300) + floor('#3a2e28') + mid(boy, 760, { s: 1.6, y: 1060, blink: blinking(t, 1), arms: [40, -40, 70, -20] }) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.25"/>` +
        xf(T('およそ40年', 1400, 460, 110, C.white), { s: popS(tl, 0.4), cx: 1400, cy: 420 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#cfe6f5') + poly([[200, 1080], [960, 320], [1720, 1080]], { fill: '#8fa0b0' }) + poly([[800, 480], [960, 320], [1120, 480], [1040, 440], [960, 480], [880, 440]], { fill: C.white, w: 5 }) +
        sakichi({ x: 960, y: 330, s: 0.9, arms: P.cheer, expr: 'smile', blink: blinking(t, 2) }) + line([[1110, 330], [1110, 90]], { w: 6, passes: 1 }) + poly([[1110, 90], [1250, 125], [1110, 160]], { fill: RED, w: 5 }), tl, d, { z0: 1.05, z1: 1.0, y0: 500 }),
    ],
    // 6 1926年、この織機を作るための会社が生まれる。その名も、「豊田自動織機製作所」。
    [
      (tl) => blackType('1926年', tl),
      (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a90', 900) + xf(factory(0, 0, 1.5), { x: 960, y: 900, s: popS(tl, 0.1), cx: 0, cy: -200 }) +
        enter(sign('豊田自動織機製作所', 960, 230, { size: 64, fill: C.white }), tl, 0.6, { cx: 960, cy: 230 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 7 のちに、トヨタグループの出発点となる会社だ。
    (tl, d) => cam(fill(CREAM) + factory(600, 760, 0.7) + xf(arrow(860, 560, 1080, 560, { w: 14 }), { s: popS(tl, 0.2), cx: 970, cy: 560 }) + [0, 1, 2].map((i) => building(1250 + i * 170, 760, 130, 220 + i * 80, ['#d8b080', '#c9b08a', '#b9a070'][i])).join('') +
      enter(sign('出発点', 600, 300, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 600, cy: 300 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 特許を売ったお金で
  '09': [
    // 0 この織機の評判は、海を越えた。
    (tl, d) => cam(fill('#5a9ad0') + `<rect x="-200" y="-200" width="2320" height="560" fill="#cfe6f5"/>` + [0, 1, 2, 3].map((i) => line([[-200, 520 + i * 90], [2200, 530 + i * 90]], { w: 5, color: '#8fc0e8', passes: 1 })).join('') +
      xf(powerLoom(0, 0, 0.3), { x: tw(tl, 0, d, 200, 1700, (x) => x), y: 320 - Math.abs(Math.sin(tl * 3)) * 20 }) + ship(tw(tl, 0, d, 200, 1700, (x) => x), 470, 0.6), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 機織り機の本場はイギリスだ。日本は長い間、イギリスの機械をお手本にしてきた。
    (tl, d, t) => cam(fill('#d8dfe6') + floor('#8a8f96') + factory(500, 860, 0.9, '#a89a8a') + text('イギリス', 500, 420, { size: 70, color: INK, font: 'Zen Maru Gothic', weight: 900 }) +
      mid(engineer, 1400, { blink: blinking(t, 4), arms: P.hold, look: [-1, 0], flip: true }) + xf(rect(-110, -80, 220, 160, { fill: '#fdfbf3' }) + text('お手本', 0, 15, { size: 44, font: 'Zen Maru Gothic', weight: 900 }), { x: 1400, y: 820 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 そのイギリスの大手メーカー、プラット社が、特許を使わせてほしいと言ってきたのだ。
    [
      (tl, d, t) => cam(fill('#d8dfe6') + floor('#8a8f96') + factory(960, 860, 1.4, '#a89a8a') + enter(sign('プラット社', 960, 220, { size: 80, fill: C.white }), tl, 0.3, { cx: 960, cy: 220 }), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d, t) => cam(fill('#e6e0d4') + mid(engineer, 600, { blink: blinking(t, 4), arms: P.point, look: [1, 0], hair: 'side', hairColor: '#c9a060', expr: 'wow' }) + powerLoom(1350, 780, 0.7, { run: tl }) +
        enter(bubble('特許を使わせて！', 900, 280, { size: 56 }), tl, 0.4, { cx: 900, cy: 280 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 教わる側だった日本の機械が、本場に技術を売る。立場が、逆転した瞬間だった。
    [
      (tl, d) => cam(fill(CREAM) + text('日本', 500, 360, { size: 90, font: 'Zen Maru Gothic', weight: 900 }) + text('イギリス', 1420, 360, { size: 90, font: 'Zen Maru Gothic', weight: 900 }) +
        xf(arrow(1200, 520, 720, 520, { w: 18 }), { o: tl < 1.5 ? 1 : 0.2 }) + (tl > 1.5 ? xf(arrow(720, 640, 1200, 640, { w: 22, color: RED, head: 60 }), { s: popS(tl, 1.5), cx: 960, cy: 640 }) : '') + typeText('技術', 960, 760, tl, { size: 60, color: RED, delay: 1.6 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.2) + xf(T('逆転！', 960, 620, 220, C.white), { s: popS(tl, 0.1), cx: 960, cy: 540, r: Math.sin(tl * 3) * 3 }), tl, d, { z0: 1.0, z1: 1.1 }),
    ],
    // 4 1929年、豊田はプラット社に特許の権利を譲った。その額、およそ10万ポンド。
    [
      (tl, d, t) => cam(fill('#e6e0d4') + head('1929年', tl) + mid(sakichi, 600, { blink: blinking(t, 2), arms: P.hold, look: [1, 0], expr: 'smile' }) + mid(engineer, 1350, { blink: blinking(t, 4), arms: P.hold, look: [-1, 0], flip: true, hairColor: '#c9a060' }) +
        xf(rect(-110, -70, 220, 140, { fill: '#fdfbf3' }) + text('特許', 0, 15, { size: 50, font: 'Zen Maru Gothic', weight: 900 }), { x: 975, y: 760 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.35) + xf(moneyBag(0, 0, 1.4, '£'), { x: 560, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0 }) + `<rect x="900" y="400" width="820" height="260" rx="40" fill="${INK}" opacity="0.85"/>` +
        yen(countUp(100000, tl, 1.2) + '£', 1310, 590, 130, C.yellow) + typeText('およそ', 1310, 360, tl, { size: 50, color: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 今のお金にすると、数十億円とも言われる大金だ。
    (tl, d) => {
      let s = fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.35);
      for (let i = 0; i < 14; i++) { const k = clamp(tl * 1.2 - i * 0.07); s += xf(moneyBag(0, 0, 0.45, '¥'), { x: 300 + (i % 7) * 220, y: lerp(-200, 520 + Math.floor(i / 7) * 220, ease.out(k)) }); }
      return cam(s + T('数十億円？', 960, 220, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 });
    },
    // 6 この交渉のためにイギリスへ渡った喜一郎は、もうひとつのものを見ていた。町を走る、たくさんの自動車だ。
    [
      (tl, d, t) => cam(fill('#cfe6f5') + plane(tw(tl, 0, d, -300, 2300), 260, 0.9) + mid(kiichiro, 700, { blink: blinking(t, 3), arms: P.hold, look: [1, 0] }) + ship(1450, 820, 0.6) + typeText('イギリスへ', 1400, 160, tl, { size: 64, color: INK }), tl, d, { z0: 1.0, z1: 1.04, x0: 1000 }),
      (tl, d, t) => cam(fill('#d8dfe6') + townRow(720, 7, -200, 340) + floor('#7a7a80', 760) + [0, 1, 2, 3].map((i) => oldCar(((tl * 300 + i * 560) % 2600) - 300, 900, 0.6, { wheel: tl * 400, col: ['#3a4a6b', '#2b2b30', '#7a2a2a', '#5a6e5a'][i] })).join('') +
        kiichiro({ x: 1650, y: 1150, s: 1.3, blink: blinking(t, 3), look: [-1, 0], flip: true, expr: 'wow' }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(900, 450, 600, C.yellow, 0.3) + close(kiichiro, 760, { blink: blinking(t, 3), expr: 'wow', look: [1, -0.3] }) + xf(oldCar(0, 0, 0.8), { x: 1450, y: 500, s: popS(tl, 0.3), cx: 0, cy: -100 }) + sparkles(1450, 300, 60, C.yellow), tl, d, { z0: 1.0, z1: 1.08, y0: 540, y1: 480 }),
    ],
    // 7 「これからは、自動車の時代になる」。
    (tl, d, t) => cam(fill(INDIGO) + glow(900, 500, 700, '#fff', 0.2) + close(kiichiro, 760, { blink: blinking(t, 3), arms: P.point, expr: 'smile', look: [1, -0.2] }) + enter(bubble('自動車の時代だ', 1420, 300, { size: 60 }), tl, 0.05, { cx: 1420, cy: 300 }), tl, d, { z0: 1.0, z1: 1.1, y0: 540, y1: 480 }),
    // 8 佐吉は、息子の夢を応援していたと言われている。そして1930年、63歳でこの世を去った。
    [
      (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 600, '#fff', 0.35) + mid(sakichi, 600, { blink: blinking(t, 2), arms: [12, 8, 120, -40], expr: 'smile', look: [1, 0] }) + mid(kiichiro, 1300, { blink: blinking(t, 3), arms: P.hold, expr: 'smile', flip: true, look: [-1, 0] }) +
        xf(oldCar(0, 0, 0.5), { x: 1300, y: 300 + bob(tl, 6, 1) }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => {
        let s = fill('#1c2030');
        for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${(i * 113) % 1000}" r="${2 + (i % 3)}" fill="#fff" opacity="${0.3 + 0.4 * Math.sin(tl * 2 + i)}"/>`;
        return cam(s + xf(text('豊田佐吉（1867〜1930）', 960, 560, { size: 84, color: C.white, font: 'Zen Maru Gothic', weight: 700 }), { o: tw(tl, 0.3, 1.6, 0, 1) }), tl, d, { z0: 1.0, z1: 1.04 });
      },
    ],
    // 9 父が残した特許のお金と、ものづくりの考え方。それを手に、息子はとんでもない挑戦を始める。
    [
      (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.2) + xf(moneyBag(0, 0, 1.0, '£'), { x: 640, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0 }) + T('＋', 960, 600, 140, INK, C.white) + xf(powerLoom(0, 0, 0.6, { lamp: true }), { x: 1300, y: 700, s: popS(tl, 0.5), cx: 0, cy: -150 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(900, 500, 700, C.yellow, 0.3) + mid(kiichiro, 700, { blink: blinking(t, 3), arms: P.cheer, expr: 'smile' }) + xf(oldCar(0, 0, 0.9), { x: 1400, y: 620, s: popS(tl, 0.4), cx: 0, cy: -100 }) +
        enter(sign('とんでもない挑戦', 1400, 260, { size: 60, fill: RED, color: C.white }), tl, 0.7, { cx: 1400, cy: 260 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    ],
  ],

  // ───── エンジンの分解から
  '11': [
    // 0 1933年、豊田自動織機製作所の中に、自動車部ができた。
    (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a90', 900) + factory(960, 900, 1.3) + head('1933年', tl) + xf(sign('自動車部', 1350, 520, { size: 70, fill: C.yellow, rot: 4 }), { s: popS(tl, 0.8), cx: 1350, cy: 520 }), tl, d, { z0: 1.0, z1: 1.1, x0: 960, x1: 1200, y0: 540, y1: 560 }),
    // 1 だが、車を作った経験のある人は、ほとんどいない。
    (tl, d, t) => cam(fill('#e6e0d4') + [500, 960, 1420].map((x, i) => mid(worker, x, { s: 1.5, y: 1060, blink: blinking(t, i + 4), expr: 'worry', arms: P.shrug, look: [0, -0.3] })).join('') +
      [500, 960, 1420].map((x, i) => xf(text('？', x + 80, 380, { size: 90, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.3 + i * 0.2), cx: x + 80, cy: 350 })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 喜一郎たちは、外国の車のエンジンをバラバラに分解し、部品を一つひとつ調べるところから始めた。
    [
      (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + engine(1250, 700, 1.1, tw(tl, 0.5, d * 0.9, 0, 1)) + mid(kiichiro, 500, { blink: blinking(t, 3), arms: P.work, look: [1, 0.3] }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
      (tl, d, t) => {
        let s = fill('#e8eef6') + rect(200, 600, 1520, 40, { fill: '#8a5a34' });
        for (let i = 0; i < 8; i++) s += xf(engine(0, 0, 0.18, 1), { x: 300 + i * 190, y: 560, s: popS(tl, i * 0.1), cx: 0, cy: 0 }) + xf(text(`No.${i + 1}`, 0, 0, { size: 28, font: 'Zen Maru Gothic', weight: 900 }), { x: 300 + i * 190, y: 700, s: popS(tl, i * 0.1 + 0.05), cx: 0, cy: -10 });
        return cam(s + mid(engineer, 960, { y: 1350, blink: blinking(t, 4), arms: P.raise, look: [0, -0.6] }) + typeText('一つひとつ調べる', 960, 160, tl, { size: 64, color: INK }), tl, d, { z0: 1.04, z1: 1.0, x0: 700, x1: 1200 });
      },
    ],
    // 3 鉄の質も、部品の精度も、何もかもが手探りだった。
    (tl, d, t) => cam(fill('#3a3a44') + lamp(960, 260) + floor('#2a2a30') + mid(kiichiro, 960, { blink: blinking(t, 3), arms: P.think, expr: 'worry', look: [0.3, -0.4], sweat: true }) +
      ['鉄の質', '精度', '設計'].map((w, i) => xf(sign(w + '？', 0, 0, { size: 54, fill: C.white }), { x: [380, 1540, 1500][i], y: [380, 360, 700][i], s: popS(tl, 0.3 + i * 0.3), r: [-6, 5, -4][i] })).join(''), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 社内にも、反対の声は多かった。「織機でもうかっているのに、なぜ車なのか」。
    (tl, d, t) => cam(fill('#e6e0d4') + [480, 960, 1440].map((x, i) => exec({ x, y: 1120, s: 1.5, blink: blinking(t, i + 6), expr: 'angry', arms: P.idle })).join('') + rect(300, 860, 1320, 50, { fill: '#7a5230' }) +
      enter(bubble('なぜ車なんだ！', 960, 260, { size: 60 }), tl, 0.3, { cx: 960, cy: 260 }) + xf(cross(1550, 520, 0.9), { s: popS(tl, 1.2), cx: 1550, cy: 520 }) + xf(oldCar(0, 0, 0.35), { x: 1550, y: 560 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 当時の日本の道を走る車は、ほとんどがアメリカ製。日本の会社が車を作るなど、無謀だと思われていた。
    [
      (tl, d) => cam(fill('#e2dccd') + townRow(720, 7, -200, 340) + floor('#9a9086', 760) + [0, 1, 2].map((i) => oldCar(((tl * 260 + i * 700) % 2600) - 300, 900, 0.6, { wheel: tl * 400, col: '#2b2b30' })).join('') +
        enter(sign('ほとんどアメリカ製', 960, 220, { size: 60, fill: C.white }), tl, 0.3, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#5a5f6a') + rainCloud(960, 200, tl, 1.5) + mid(kiichiro, 960, { blink: blinking(t, 3), arms: P.hips, expr: 'angry', look: [0, -0.3] }) + xf(T('無謀だ', 1500, 500, 110, C.white, INK), { s: popS(tl, 0.4), cx: 1500, cy: 460, r: 6 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 6 それでも1935年にトラック、1936年には乗用車を完成させる。
    [
      (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3) + head('1935年', tl) + xf(oldTruck(0, 0, 1.3, { wheel: tl * 200 }), { x: 960, y: 760, s: popS(tl, 0.2), cx: 0, cy: -100 }) + sparkles(1450, 400, 60, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3) + head('1936年', tl) + xf(oldCar(0, 0, 1.4, { wheel: tl * 200 }), { x: 960, y: 760, s: popS(tl, 0.2), cx: 0, cy: -100 }) + sparkles(1450, 400, 60, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 7 機織り機の会社が、本当に車を作ってしまったのだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.2) + woodLoom(500, 760, 0.8, { run: tl }) + xf(arrow(760, 520, 1060, 520, { w: 18, color: RED, head: 50 }), { s: popS(tl, 0.2), cx: 910, cy: 520 }) + xf(oldCar(0, 0, 1.0, { wheel: tl * 200 }), { x: 1400, y: 700, s: popS(tl, 0.5), cx: 0, cy: -100 }) +
      xf(big('本当に！', 960, 260, 110, RED), { s: popS(tl, 0.9), cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],

  // ───── トヨダからトヨタへ
  '12': [
    // 0 1937年、自動車の部門が独立し、「トヨタ自動車工業」が生まれた。
    [
      (tl) => blackType('1937年', tl),
      (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a90', 900) + factory(600, 900, 0.9) + xf(arrow(900, 600, 1080, 600, { w: 16 }), { s: popS(tl, 0.2), cx: 990, cy: 600 }) + xf(factory(0, 0, 1.0, '#d8c3a0'), { x: 1400, y: 900, s: popS(tl, 0.4), cx: 0, cy: -200 }) +
        enter(sign('トヨタ自動車工業', 1400, 230, { size: 56, fill: C.yellow }), tl, 0.8, { cx: 1400, cy: 230 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 1 その前の年、会社は新しいマークを、全国から募集していた。集まった案は、およそ2万7000。
    [
      (tl, d) => cam(fill('#e8eef6') + xf(rect(-320, -380, 640, 760, { fill: '#fdfbf3' }) + text('新しいマーク', 0, -250, { size: 64, font: 'Zen Maru Gothic', weight: 900 }) + text('募集', 0, -120, { size: 120, color: RED, font: 'Zen Maru Gothic', weight: 900 }) +
        `<circle cx="0" cy="140" r="130" fill="none" stroke="${INK}" stroke-width="8" stroke-dasharray="20 14"/>` + text('？', 0, 180, { size: 110, color: '#9aa0a8', font: 'Zen Maru Gothic', weight: 900 }), { x: 960, y: 540, s: popS(tl, 0.1), cx: 0, cy: 0 }) + head('1936年', tl), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => {
        let s = fill('#fbe9d0');
        const n = Math.floor(clamp(tl / (d * 0.7)) * 40);
        for (let i = 0; i < n; i++) s += xf(rect(-60, -40, 120, 80, { fill: '#fdfbf3', w: 4 }) + line([[-40, -10], [40, -10]], { w: 3, color: '#9a9488', passes: 1 }), { x: 200 + ((i * 137) % 1520), y: 320 + ((i * 89) % 520), r: (i * 23) % 30 - 15 });
        return cam(s + `<rect x="560" y="420" width="800" height="240" rx="40" fill="${INK}" opacity="0.85"/>` + yen(countUp(27000, tl, 1.5), 960, 600, 140, C.yellow) + typeText('案', 1340, 600, tl, { size: 60, color: C.white, delay: 1.4 }), tl, d, { z0: 1.0, z1: 1.04 });
      },
    ],
    // 2 選ばれたマークに書かれていたのが、「トヨタ」の3文字だった。
    (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.25) + xf(`<circle cx="0" cy="0" r="260" fill="#fdfbf3" stroke="${INK}" stroke-width="10"/>` + T('トヨタ', 0, 60, 150, INK, '#fdfbf3'), { x: 960, y: 520, s: popS(tl, 0.3), cx: 0, cy: 0 }) +
      sparkles(1300, 300, 70, C.yellow) + sparkles(620, 760, 60, C.yellow), tl, d, { z0: 1.0, z1: 1.08 }),
    // 3 名字は「とよだ」なのに、会社の名前は「トヨタ」。
    (tl, d) => cam(fill(CREAM) + rect(0, 0, 960, 1080, { fill: '#f2e2c8', color: null }) + T('とよだ', 480, 520, 150, INK, C.white) + text('名字', 480, 300, { size: 64, font: 'Zen Maru Gothic', weight: 900 }) +
      xf(T('トヨタ', 1440, 520, 150, RED, C.white) + text('会社', 1440, 300, { size: 64, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.9), cx: 1440, cy: 440 }) + xf(text('？', 960, 560, { size: 160, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 1.6), cx: 960, cy: 500 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 にごらない方が、すっきり聞こえるからだ。そして、家の名前から離れ、社会の会社になるという意味も込められていた。
    [
      (tl, d) => {
        const k = clamp((tl - 0.8) / 0.6);
        return cam(fill(CREAM) + glow(960, 540, 700, '#fff', 0.3) + T('トヨ', 860, 600, 220, INK, C.white) + T('タ', 1160, 600, 220, INK, C.white) +
          xf(text('゛', 0, 0, { size: 200, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 1260 + k * 200, y: 470 - k * 300, r: k * 90, o: 1 - k }) + typeText('すっきり', 960, 860, tl, { size: 70, color: RED, delay: 1.2 }).replace('y="860"', 'y="820"'), tl, d, { z0: 1.0, z1: 1.05 });
      },
      (tl, d, t) => cam(fill('#e8eef6') + houseFrame(500, 860, 0.8) + text('家', 500, 700, { size: 90, font: 'Zen Maru Gothic', weight: 900 }) + xf(arrow(760, 620, 1080, 620, { w: 16 }), { s: popS(tl, 0.3), cx: 920, cy: 620 }) +
        [0, 1, 2, 3].map((i) => kid({ x: 1200 + i * 150, y: 1000, s: 0.9, hair: i % 2 ? 'side' : 'messy', shirt: [C.blue, C.pink, C.green, C.orange][i], blink: blinking(t, i), arms: P.cheer, expr: 'smile' })).join('') + text('社会', 1420, 560, { size: 90, color: RED, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 5 さらに、カタカナの「トヨタ」は8画。末広がりで縁起がいい、という理由もあったとされている。
    [
      (tl, d) => {
        const n = Math.max(0, Math.min(8, Math.floor(tl * 3)));
        return cam(fill(CREAM) + T('トヨタ', 960, 560, 220, INK, C.white) + [...Array(n)].map((_, i) => xf(text(String(i + 1), 0, 0, { size: 50, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 640 + i * 90, y: 760, s: popS(tl, i / 3), cx: 0, cy: -15 })).join('') +
          (n >= 8 ? xf(T('8画', 960, 230, 110, RED, C.white), { s: popS(tl, 8 / 3), cx: 960, cy: 190 }) : ''), tl, d, { z0: 1.0, z1: 1.05 });
      },
      (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3) + xf(T('八', 960, 680, 420, RED, C.white), { s: popS(tl, 0.1), cx: 960, cy: 520 }) + sparkles(600, 300, 70, C.yellow) + sparkles(1320, 300, 70, C.yellow) +
        enter(sign('末広がり', 1450, 760, { size: 70, fill: C.white }), tl, 0.5, { cx: 1450, cy: 760 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 6 ちなみに、創業家の名字は、今も「とよだ」のままだ。
    (tl, d) => cam(fill(CREAM) + xf(rect(-200, -60, 400, 120, { fill: '#7a5230' }) + rect(-180, -45, 360, 90, { fill: '#9a6a40', w: 5 }) + text('とよだ', 0, 25, { size: 70, color: '#fdfbf3', font: 'Zen Maru Gothic', weight: 900 }), { x: 960, y: 520, r: -2 }) +
      typeText('今も「とよだ」', 960, 220, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.08 }),
  ],

  // ───── 壊れるトラック
  '13': [
    // 0 だが、出来上がったトラックは、よく壊れた。
    (tl, d) => cam(fill('#cfd6de') + floor('#9a9086', 760) + oldTruck(960, 880, 1.2, { smoke: clamp(tl - 0.5), wheel: tl < 0.5 ? tl * 300 : 150 }) + (tl > 0.8 ? xf(T('プスン…', 1350, 400, 90, INK, C.white), { s: popS(tl, 0.8), cx: 1350, cy: 370 }) : ''), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 0.5, 0.4, 10) }),
    // 1 故障の知らせが入るたび、喜一郎たちは現場に飛んでいき、その場で直した。
    (tl, d, t) => {
      if (tl < d * 0.4) return cam(fill('#e6e0d4') + rect(700, 300, 160, 240, { fill: '#2b2b30' }) + ellipse(780, 360, 40, 40, { fill: '#9aa0a8', w: 4 }) + xf(text('リリリン', 1150, 380, { size: 80, color: RED, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x: Math.sin(tl * 30) * 4 }) +
        mid(kiichiro, 1450, { blink: blinking(t, 3), expr: 'wow', look: [-1, 0], flip: true }), tl, d * 0.4, { z0: 1.0, z1: 1.04 });
      const k = tl - d * 0.4;
      return cam(fill('#cfd6de') + floor('#9a9086', 760) + oldTruck(1350, 880, 0.9, { smoke: 0.5 }) + kiichiro({ x: lerp(-100, 900, ease.out(clamp(k / 1.2))), y: 1150, s: 1.4, legs: Math.sin(k * 10), blink: blinking(t, 3), arms: P.hold, look: [1, 0] }) +
        toolbox(lerp(-100, 900, ease.out(clamp(k / 1.2))) + 100, 880), k, d * 0.6, { z0: 1.0, z1: 1.04 });
    },
    // 2 部品を持って夜行列車に飛び乗り、遠くの町まで修理に行ったこともあったという。
    (tl, d) => {
      let s = fill('#1c2030');
      for (let i = 0; i < 30; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${(i * 73) % 400}" r="2" fill="#fff" opacity="0.6"/>`;
      s += `<circle cx="1600" cy="160" r="70" fill="#fff3c4"/>` + floor('#2a2a30', 760);
      s += g2(rect(-700, -120, 900, 160, { fill: '#3a3a44' }) + [0, 1, 2, 3, 4].map((i) => rect(-660 + i * 170, -95, 110, 60, { fill: '#ffd98a', w: 4 })).join('') + rect(200, -180, 200, 220, { fill: '#2b2b30', w: 5 }) + rect(280, -260, 50, 80, { fill: '#2b2b30', w: 5 }), tw(tl, 0, d, -200, 2600, (x) => x), 720);
      return cam(s + typeText('夜行列車で', 960, 900, tl, { size: 64, color: C.white }).replace('y="900"', 'y="200"'), tl, d, { z0: 1.0, z1: 1.04 });
    },
    // 3 売って終わりではなく、壊れたら直しに行く。お客さんの不満から、次の改良が生まれる。
    [
      (tl, d, t) => cam(fill('#cfd6de') + floor('#9a9086', 760) + oldTruck(1200, 880, 0.9) + kiichiro({ x: 700, y: 1150, s: 1.4, blink: blinking(t, 3), arms: P.work, look: [1, 0.3] }) + [0, 1, 2].map((i) => sparkles(1000 + i * 90, 760 - (i % 2) * 40, 26, C.yellow)).join('') +
        enter(sign('直しに行く', 960, 230, { size: 70, fill: C.yellow }), tl, 0.3, { cx: 960, cy: 230 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#e8eef6') + mid(villager, 520, { blink: blinking(t, 4), expr: 'angry', arms: P.hips, look: [1, 0] }) + enter(bubble('また壊れた！', 600, 300, { size: 50 }), tl, 0.1, { cx: 600, cy: 300 }) +
        xf(arrow(860, 600, 1080, 600, { w: 16 }), { s: popS(tl, 0.5), cx: 970, cy: 600 }) + xf(rect(-170, -120, 340, 240, { fill: '#fdfbf3' }) + text('改良', 0, -30, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 }) + oldTruck(0, 80, 0.3), { x: 1380, y: 560, s: popS(tl, 0.8), cx: 0, cy: 0 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 4 「壊れないトラック」を作るための、地道な日々が続いた。
    (tl, d, t) => cam(fill('#2a2430') + lamp(960, 240) + floor('#3a2e28') + engine(1300, 700, 0.8, 0.3) + mid(kiichiro, 620, { blink: blinking(t, 3), arms: P.work, look: [1, 0.3] }) + `<circle cx="1650" cy="180" r="60" fill="#fff3c4"/>`, tl, d, { z0: 1.0, z1: 1.06 }),
    // 5 だが、この会社の本当の試練は、まだこの先にあった。
    (tl, d) => {
      const k = clamp(tl / d);
      return cam(fill(k > 0.5 ? '#2a2630' : '#5a5560') + rainCloud(960, 220, tl, 1.6) + factory(960, 880, 1.2, '#8a8070') + xf(text('…', 960, 520, { size: 200, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), { o: k }), tl, d, { z0: 1.0, z1: 1.12 });
    },
  ],

  // ───── 倒産寸前
  '15': [
    // 0 戦争が終わると、日本は物不足と不景気に包まれた。
    (tl, d, t) => cam(fill('#8a8a80') + townRow(760, 7, -200, 340) + floor('#7a7068', 760) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#5a4a3a" opacity="0.2"/>` +
      [500, 1400].map((x, i) => villager({ x, y: 1150, s: 1.4, blink: blinking(t, i + 4), expr: 'worry', arms: P.shrug })).join('') + enter(sign('物不足・不景気', 960, 220, { size: 70, fill: C.white }), tl, 0.4, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 車は売れても、代金が入ってこない。お金が回らない。
    (tl, d) => cam(fill('#e2e6ee') + oldTruck(560, 760, 0.9) + xf(arrow(860, 600, 1100, 600, { w: 16 }), { s: popS(tl, 0.2), cx: 980, cy: 600 }) + xf(moneyBag(0, 0, 0.8, '¥'), { x: 1400, y: 600, o: 0.4 }) +
      xf(cross(1400, 600, 1.4), { s: popS(tl, 1.2), cx: 1400, cy: 600 }) + typeText('お金が回らない', 960, 180, tl, { size: 70, color: RED, delay: 1.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 2 1949年の年末、あと2億円が集まらなければ、会社はつぶれるところまで追い込まれた。
    [
      (tl, d) => cam(fill('#3a3a44') + head('1949年　年末', tl, C.white) + `<rect x="400" y="380" width="1120" height="300" rx="40" fill="#1c1c22" opacity="0.9"/>` + yen('あと ' + countUp(2, tl, 0.8) + '億円', 960, 590, 150, C.yellow), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => cam(fill('#2a2630') + rainCloud(960, 200, tl, 1.6) + factory(1300, 880, 1.0, '#6a6058') + mid(kiichiro, 600, { blink: blinking(t, 3), expr: 'worry', sweat: true, arms: P.shrug, look: [1, 0.3] }) +
        xf(T('倒産寸前', 1300, 420, 110, RED, C.white), { s: popS(tl, 0.4), cx: 1300, cy: 380, r: Math.sin(tl * 8) * 2 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, 0.4, 0.4, 10) }),
    ],
    // 3 日本銀行が仲立ちし、銀行がお金を貸してくれることになった。ただし、条件が付いた。
    [
      (tl, d) => cam(fill('#e8eef6') + bank(960, 860, 1.3) + [0, 1, 2].map((i) => xf(moneyBag(0, 0, 0.5, '¥'), { x: 600 + i * 360, y: tw(tl, 0.5 + i * 0.2, 1.2 + i * 0.2, 1200, 520, ease.out) })).join('') + typeText('銀行が貸してくれる', 960, 160, tl, { size: 64, color: INK }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill(CREAM) + xf(rect(-340, -300, 680, 600, { fill: '#fdfbf3' }) + text('条件', 0, -170, { size: 100, color: RED, font: 'Zen Maru Gothic', weight: 900 }) + line([[-260, -60], [260, -60]], { w: 4, color: '#9a9488', passes: 1 }) +
        line([[-260, 40], [260, 40]], { w: 4, color: '#9a9488', passes: 1 }) + line([[-260, 140], [100, 140]], { w: 4, color: '#9a9488', passes: 1 }), { x: 960, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0, r: -3 }), tl, d, { z0: 1.0, z1: 1.08 }),
    ],
    // 4 車を売る会社を別に分けること。そして、人を減らすこと。
    [
      (tl, d) => cam(fill('#e8eef6') + factory(960, 860, 1.2) + (tl > 0.6 ? line([[960, 300], [940, 560], [980, 880]], { w: 12, color: RED, passes: 1 }) : '') + xf(factory(0, 0, 0.6), { x: 960 + tw(tl, 0.8, 1.6, 0, 500), y: 860, o: tl > 0.8 ? 1 : 0 }) +
        enter(sign('① 売る会社を分ける', 960, 200, { size: 56, fill: C.white }), tl, 0.2, { cx: 960, cy: 200 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => cam(fill('#d8dfe6') + [0, 1, 2, 3, 4, 5].map((i) => xf(worker({ x: 0, y: 0, s: 1.0, blink: blinking(t, i), expr: 'worry' }), { x: 300 + i * 260, y: 1000, o: i > 2 ? 1 - clamp(tl - 0.6) * 0.8 : 1 })).join('') +
        enter(sign('② 人を減らす', 960, 220, { size: 70, fill: RED, color: C.white }), tl, 0.2, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 5 1950年、およそ1600人が会社を去ることになった。それに反対する争いが、2か月近く続いた。
    [
      (tl, d) => cam(fill('#3a3a44') + head('1950年', tl, C.white) + `<rect x="460" y="380" width="1000" height="300" rx="40" fill="#1c1c22" opacity="0.9"/>` + yen('およそ' + countUp(1600, tl, 1.0) + '人', 960, 590, 130, C.yellow), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#cfd6de') + factory(1350, 860, 1.0, '#8a8070') + [300, 520, 740, 960].map((x, i) => worker({ x, y: 1120, s: 1.3, blink: blinking(t, i), expr: 'angry', arms: [160, 10, 12, 8] })).join('') +
        [300, 740].map((x) => line([[x + 70, 760], [x + 70, 420]], { w: 6, passes: 1 }) + rect(x - 30, 330, 200, 100, { fill: C.white }) + text('反対！', x + 70, 400, { size: 58, color: RED, font: 'Zen Maru Gothic', weight: 900 })).join('') + typeText('2か月近く', 1350, 200, tl, { size: 70, color: INK, delay: 0.4 }), tl, d, { z0: 1.0, z1: 1.04, x0: 960 + Math.sin(tl * 6) * 4 }),
    ],
    // 6 喜一郎は、その責任を取って社長を辞めた。
    (tl, d, t) => {
      const k = tw(tl, 0.4, d, 0, 1, (x) => x);
      return cam(fill('#3b2f3f') + glow(760, 500, 500, '#ffd8b0', 0.25) + rect(400, 900, 900, 60, { fill: '#5a4030' }) + text('社長', 850, 880, { size: 50, color: '#d8c3a0', font: 'Zen Maru Gothic', weight: 900 }) +
        kiichiro({ x: lerp(850, 1550, k), y: 1150, s: 1.6, blink: blinking(t, 3), expr: 'worry', legs: k > 0 && k < 1 ? Math.sin(tl * 7) : 0, look: [1, 0.3] }), tl, d, { z0: 1.0, z1: 1.04 });
    },
    // 7 皮肉なことに、その直後、朝鮮半島で戦争が始まる。アメリカ軍から、トラックの大量の注文が舞い込み、会社は持ち直していく。
    [
      (tl, d) => cam(fill('#2a2a34') + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a3a2a" opacity="${(0.2 + 0.1 * Math.sin(tl * 3)).toFixed(2)}"/>` + typeText('その直後', 960, 520, tl, { size: 110, color: C.white, cps: 6, font: 'Yomogi', weight: 400 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => {
        let s = fill('#e8eef6');
        for (let i = 0; i < 10; i++) { const k = clamp((tl - 0.3 - i * 0.15) / 0.5); if (k > 0) s += xf(rect(-80, -55, 160, 110, { fill: C.white }) + text('注文', 0, 15, { size: 40, font: 'Zen Maru Gothic', weight: 900 }) + oldTruck(0, 40, 0.12), { x: lerp(2100, 300 + (i % 5) * 330, ease.out(k)), y: 420 + Math.floor(i / 5) * 200, r: (i * 17) % 20 - 10 }); }
        return cam(s + typeText('トラックの大量注文', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.04 });
      },
      (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + factory(700, 860, 1.0) + [0, 1, 2].map((i) => oldTruck(((tl * 220 + i * 520) % 2200) - 200, 960, 0.45, { wheel: tl * 300 })).join('') +
        xf(arrow(1350, 760, 1650, 300, { w: 22, color: '#2f9a4a', head: 60 }), { s: popS(tl, 0.3), cx: 1500, cy: 530 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 8 喜一郎は社長に戻ることなく、1952年、57歳で亡くなった。
    (tl, d) => {
      let s = fill('#1c2030');
      for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${(i * 113) % 1000}" r="${2 + (i % 3)}" fill="#fff" opacity="${0.3 + 0.4 * Math.sin(tl * 2 + i)}"/>`;
      return cam(s + xf(text('豊田喜一郎（1894〜1952）', 960, 560, { size: 84, color: C.white, font: 'Zen Maru Gothic', weight: 700 }), { o: tw(tl, 0.3, 1.6, 0, 1) }), tl, d, { z0: 1.0, z1: 1.04 });
    },
  ],

  // ───── ムダをなくす工場
  '16': [
    // 0 だが、喜一郎が残したものは、会社の中で生き続けた。
    (tl, d) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.35) + factory(960, 860, 1.3) + xf(bulb(960, 300, 1.0, 1), { s: popS(tl, 0.4), cx: 960, cy: 300 }) + sparkles(1200, 260, 60, C.yellow), tl, d, { z0: 1.06, z1: 1.0 }),
    // 1 喜一郎は、こんな言葉を工場に掲げていた。「ジャスト・イン・タイム」。
    [
      (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + mid(kiichiro, 600, { blink: blinking(t, 3), arms: P.point, look: [1, -0.4], expr: 'smile' }) + rect(1000, 250, 700, 200, { fill: '#fdfbf3' }) + line([[1100, 250], [1100, 150]], { w: 5, passes: 1 }) + line([[1600, 250], [1600, 150]], { w: 5, passes: 1 }) +
        typeText('ジャスト・イン・タイム', 1350, 375, tl, { size: 54, color: INK, delay: 0.5 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
      (tl, d) => cam(fill(INDIGO) + glow(960, 540, 700, '#fff', 0.15) + xf(T('ジャスト・イン・タイム', 960, 600, 120, C.white), { s: popS(tl, 0.1), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
    ],
    // 2 必要なものを、必要なときに、必要な分だけ作る。作りすぎは、ムダだからだ。
    [
      (tl, d) => cam(fill(CREAM) + ['必要なものを', '必要なときに', '必要な分だけ'].map((w, i) => xf(sign(w, 0, 0, { size: 64, fill: [C.yellow, C.white, '#cfeec4'][i] }), { x: 960, y: 300 + i * 200, s: popS(tl, i * 0.6), r: [-3, 2, -2][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => {
        let s = fill('#e2dccd');
        for (let i = 0; i < 18; i++) s += rect(300 + (i % 6) * 220, 760 - Math.floor(i / 6) * 150, 180, 130, { fill: '#c9a36a' });
        return cam(s + xf(cross(960, 560, 3.0), { s: popS(tl, 0.6), cx: 960, cy: 560 }) + typeText('作りすぎ＝ムダ', 960, 160, tl, { size: 70, color: RED }), tl, d, { z0: 1.0, z1: 1.05 });
      },
    ],
    // 3 この考えを工場全体の仕組みにしたのが、技術者の大野耐一だった。
    (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + assemblyLine(1300, 760, 0.6, tl) + mid(engineer, 560, { blink: blinking(t, 4), arms: P.point, look: [1, 0], expr: 'smile' }) + typeText('大野耐一', 1300, 300, tl, { size: 100, color: INK, cps: 8 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    // 4 ヒントになったのは、アメリカのスーパーマーケット。お客さんが買った分だけ、棚に商品を補充する。
    [
      (tl, d, t) => cam(fill('#fdf3e4') + shelf(1250, 860, 1.2) + mid(engineer, 520, { blink: blinking(t, 4), arms: P.think, look: [1, -0.2] }) + xf(bulb(520, 280, 0.7, 1), { s: popS(tl, 0.8), cx: 520, cy: 260 }) +
        enter(sign('スーパーマーケット', 1250, 200, { size: 60, fill: C.white }), tl, 0.2, { cx: 1250, cy: 200 }), tl, d, { z0: 1.0, z1: 1.04, x0: 1000 }),
      (tl, d) => cam(fill('#fdf3e4') + shelf(960, 900, 1.5, clamp(tl / d)) + xf(arrow(1500, 760, 1300, 760, { w: 14, color: '#2f9a4a' }), { o: Math.sin(clamp(tl / d) * Math.PI) }) + typeText('買った分だけ補充', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 5 工場でも、使った部品の分だけ、カードを回して次を作らせる。これが「かんばん」と呼ばれる仕組みだ。
    [
      (tl, d) => {
        const k = (tl * 0.5) % 1;
        return cam(fill('#d6dce4') + factory(450, 840, 0.7) + factory(1470, 840, 0.7, '#d8c3a0') + text('部品をつくる', 450, 280, { size: 50, font: 'Zen Maru Gothic', weight: 900 }) + text('車をつくる', 1470, 280, { size: 50, font: 'Zen Maru Gothic', weight: 900 }) +
          kanban(lerp(1300, 620, k), 460 - Math.sin(k * Math.PI) * 120, 0.6, -6), tl, d, { z0: 1.0, z1: 1.04 });
      },
      (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.2) + xf(kanban(0, 0, 1.8, -4, 'ハンドル', 20), { x: 960, y: 520, s: popS(tl, 0.1), cx: 0, cy: 0 }) + enter(sign('かんばん', 1500, 260, { size: 80, fill: C.yellow }), tl, 0.4, { cx: 1500, cy: 260 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 6 そして、佐吉の織機から受け継いだ「自働化」。
    (tl, d) => cam(fill(CREAM) + powerLoom(560, 720, 0.7, { lamp: true }) + xf(arrow(830, 520, 1080, 520, { w: 14 }), { s: popS(tl, 0.2), cx: 955, cy: 520 }) + xf(T('自働化', 1400, 560, 150, INK, C.white), { s: popS(tl, 0.5), cx: 1400, cy: 500 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 今もトヨタの工場では、おかしいと思ったら、誰でもひもを引いてラインを止められる。
    [
      (tl, d, t) => cam(fill('#d6dce4') + andon(960, 600, 1.0) + assemblyLine(960, 900, 0.8, tl) + mid(worker, 600, { y: 1300, blink: blinking(t, 5), arms: P.raise, look: [1, -0.6] }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d, t) => {
        const p = clamp((tl - 0.4) / 0.3);
        return cam(fill('#d6dce4') + andon(960, 640, 1.2, { pulled: p, on: p >= 1 }) + assemblyLine(960, 940, 0.8, 1, p >= 1) + (p >= 1 ? xf(sign('ライン停止', 1500, 380, { size: 64, fill: C.yellow }), { s: popS(tl, 0.7), cx: 1500, cy: 380 }) : ''), tl, d, { z0: 1.0, z1: 1.06 });
      },
    ],
    // 8 糸が切れたら止まった、あの木の機織り機と同じ考え方だ。
    (tl, d) => cam(fill(CREAM) + rect(960, 0, 10, 1080, { fill: INK, color: null }) + woodLoom(480, 760, 0.8, { cut: true }) + andon(1440, 760, 0.65, { pulled: 1, on: true }) + xf(T('＝', 960, 600, 160, RED, C.white), { s: popS(tl, 0.4), cx: 960, cy: 540 }) +
      typeText('同じ考え方', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 9 この2つを柱にした作り方は、「トヨタ生産方式」と呼ばれ、世界中の工場がまねをするようになった。
    [
      (tl, d) => cam(fill('#e8eef6') + poly([[460, 300], [960, 120], [1460, 300]], { fill: INDIGO }) + rect(460, 300, 1000, 40, { fill: INDIGO }) + rect(560, 340, 140, 460, { fill: '#fdfbf3' }) + rect(1220, 340, 140, 460, { fill: '#fdfbf3' }) +
        text('ジャスト・', 630, 520, { size: 40, font: 'Zen Maru Gothic', weight: 900 }) + text('イン・タイム', 630, 580, { size: 40, font: 'Zen Maru Gothic', weight: 900 }) + text('自働化', 1290, 560, { size: 50, font: 'Zen Maru Gothic', weight: 900 }) +
        typeText('トヨタ生産方式', 960, 260, tl, { size: 60, color: C.white, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => {
        let s = fill('#d9ecf7') + `<circle cx="960" cy="560" r="330" fill="${C.sky}" stroke="${INK}" stroke-width="8"/>` + poly([[760, 420], [880, 380], [940, 470], [860, 560], [760, 520]], { fill: C.green }) + poly([[1020, 600], [1160, 560], [1200, 680], [1080, 740]], { fill: C.green });
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + tl * 0.5; s += xf(factory(0, 0, 0.18, '#d8c3a0', false), { x: 960 + Math.cos(a) * 520, y: 600 + Math.sin(a) * 380, s: popS(tl, i * 0.1), cx: 0, cy: -100 }); }
        return cam(s + typeText('世界中がまねをした', 960, 160, tl, { size: 64, color: INK }), tl, d, { z0: 1.12, z1: 1.0 });
      },
    ],
    // 10 「かんばん」は、英語でもそのまま「カンバン」と呼ばれている。
    (tl, d) => cam(fill(CREAM) + kanban(620, 540, 1.3, -6) + xf(T('KANBAN', 1350, 580, 140, INK, C.white), { s: popS(tl, 0.4), cx: 1350, cy: 520 }) + text('英語でも', 1350, 360, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],

  // ───── まとめ
  '17': [
    // 0 母を楽にしたいと思った少年の、木の機織り機。
    (tl, d, t) => cam(fill('#2a2430') + lamp(1100, 260) + floor('#3a2e28') + woodLoom(1100, 820, 0.95, { run: tl }) + villager({ x: 1100, y: 1250, s: 1.6, arms: P.work, blink: blinking(t, 4), shirt: '#8a5a7a' }) + mid(boy, 450, { s: 1.3, y: 1020, blink: blinking(t, 1), look: [1, -0.2] }) +
      `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.2"/>`, tl, d, { z0: 1.06, z1: 1.0 }),
    // 1 自分の会社を追い出されても、発明をやめなかった父。
    (tl, d, t) => cam(fill('#2a2430') + lamp(960, 240) + floor('#3a2e28') + powerLoom(1250, 780, 0.75, { run: tl }) + mid(sakichi, 560, { blink: blinking(t, 2), arms: P.work, look: [1, 0] }) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.2"/>`, tl, d, { z0: 1.06, z1: 1.0 }),
    // 2 その特許のお金で、車という新しい夢に挑んだ息子。
    (tl, d, t) => cam(fill('#d6dce4') + floor('#8a8f96') + engine(1250, 700, 1.0, 0.6) + mid(kiichiro, 500, { blink: blinking(t, 3), arms: P.work, look: [1, 0.3] }) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.15"/>`, tl, d, { z0: 1.06, z1: 1.0 }),
    // 3 トヨタの始まりは、車ではなく、二代にわたる「ものづくり」への執念だった。
    (tl, d, t) => cam(fill('#fbe9d0') + glow(960, 500, 700, '#fff', 0.35) + mid(sakichi, 600, { blink: blinking(t, 2), arms: P.idle, expr: 'smile' }) + mid(kiichiro, 1320, { blink: blinking(t, 3), arms: P.idle, expr: 'smile', flip: true }) +
      typeText('二代のものづくり', 960, 180, tl, { size: 80, color: RED, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 あの日、糸が切れて止まった機織り機の考え方は、今も世界中の工場で生きている。
    [
      (tl, d) => cam(fill(CREAM) + glow(960, 500, 600, '#fff', 0.3) + woodLoom(960, 760, 1.1, { cut: true }) + `<circle cx="960" cy="440" r="${80 + Math.sin(tl * 4) * 8}" fill="none" stroke="${RED}" stroke-width="10"/>`, tl, d, { z0: 1.0, z1: 1.1, y0: 540, y1: 480 }),
      (tl, d) => cam(fill('#d6dce4') + andon(960, 800, 1.0, { pulled: 1, on: true }) + assemblyLine(960, 940, 0.8, tl) + typeText('今も生きている', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 5 佐吉は、こんな言葉を残したとされている。
    (tl, d, t) => cam(fill('#1c2030') + glow(560, 560, 500, '#fff6d8', 0.22) + mid(sakichi, 760, { blink: blinking(t, 2), arms: P.idle, look: [1, 0], expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.06, x0: 900 }),
    // 6 「障子を開けてみよ。外は広いぞ」（名言：障子があいて外が見える）
    (tl, d, t) => {
      let s = fill('#1c2030') + glow(560, 560, 500, '#fff6d8', 0.22) + shoji(1300, 540, 0.8, ease.inOut(clamp((tl - 0.5) / 1.5))) + mid(sakichi, 520, { blink: blinking(t, 2), arms: P.idle, look: [1, 0], expr: 'smile' });
      s += text('“', 900, 200, { size: 160, color: C.yellow, font: 'Zen Maru Gothic', weight: 900 }) + typeText('障子を開けてみよ。', 1300, 130, tl, { size: 60, color: C.white, cps: 10 }) + typeText('外は広いぞ', 1300, 240, tl, { size: 76, color: C.yellow, cps: 10, delay: 1.6 });
      return s;
    },
    // 7 あなたの身の回りで、意外な会社から始まった商品を知っていたら、ぜひコメントで教えてください。
    (tl, d, t) => {
      let s = fill('#fdf1dc');
      [['機織り機', (x, y) => woodLoom(x, y, 0.45)], ['特許', (x, y) => moneyBag(x, y, 0.7, '£')], ['トラック', (x, y) => oldTruck(x, y, 0.6)]].forEach(([lb, f], i) => {
        const x = 330 + i * 630;
        s += rect(x - 290, 160, 580, 560, { fill: [SEPIA, '#fff2c8', '#d6dce4'][i] }) + f(x, 520) + text(lb, x, 680, { size: 56, font: 'Zen Maru Gothic', weight: 900 });
        s += xf(text('✓', x + 200, 260, { size: 130, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.4 + i * 0.5), cx: x + 200, cy: 220 });
      });
      return s + enter(bubble('意外な始まりの商品、知ってる？', 960, 800, { size: 44 }), tl, d * 0.5, { cx: 960, cy: 800 });
    },
    // 8 この動画が面白かったら、チャンネル登録もお願いします。
    (tl, d, t) => cam(fill(INDIGO) + glow(800, 500, 700, '#fff', 0.2) + mid(guide, 700, { blink: blinking(t, 9), arms: P.wave }) + xf(sign('チャンネル登録', 1400, 520, { size: 90, fill: C.white, color: INDIGO, rot: -4 }), { s: popS(tl, 0.3), cx: 1400, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 }),
  ],
};

const g2 = (inner, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;

// すみっこのネコ（小ネタ）：[声ファイル, 行, ネコが持っているもの]
const CATS = [['04', 1, () => shuttle(0, 0, 0.3)], ['08', 3, () => spool(0, 0, 0.25)], ['11', 2, () => ''], ['16', 5, () => kanban(0, 0, 0.25)], ['17', 8, () => '']];
const withCat = (f, toy) => (tl, d, t) => f(tl, d, t) + cat(lerp(-160, 140, ease.out(clamp((tl - 0.4) / 0.7))), 1010, tl, toy());
for (const [k, i, toy] of CATS) {
  const e = SHOTS[k][i];
  SHOTS[k][i] = Array.isArray(e) ? e.map((f) => withCat(f, toy)) : withCat(e, toy);
}

// ───── 終了画面（20秒・声なし）：関連動画2本とチャンネル登録ボタンの枠
export const endScreen = (t) => {
  let s = fill(INDIGO) + glow(960, 500, 900, '#ffffff', 0.12);
  for (let i = 0; i < 10; i++) {
    const k = (t * 0.05 + i * 0.1) % 1;
    s += xf([(x, y, sc) => shuttle(x, y, sc), (x, y, sc) => spool(x, y, sc * 0.5), (x, y, sc) => oldCar(x, y, sc * 0.4)][i % 3](0, 0, 0.8), { x: (i * 211) % 1920, y: lerp(1180, -100, k), r: t * 20 + i * 30, o: 0.22 });
  }
  s += typeText('次に見るならこちら', 960, 200, t, { size: 80, color: C.white, cps: 14 });
  for (const x of [160, 1020]) s += `<rect x="${x}" y="300" width="740" height="416" rx="24" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="22 14"/>`;
  s += `<circle cx="960" cy="900" r="92" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="18 12"/>`;
  s += cat(lerp(-160, 150, ease.out(clamp((t - 1) / 0.8))), 1010, t, '');
  return s;
};
