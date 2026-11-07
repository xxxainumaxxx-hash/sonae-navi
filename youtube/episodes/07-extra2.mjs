// 任天堂（本番）第2〜4章：長い行の途中に入れる「別の絵」
// before＝元の絵の前、after＝元の絵の後ろに入る。行の長さを均等に分け、字幕の区切りに近いところで切りかわる。
import { C, text, line, ellipse, rect, poly, arrow, sparkles, bigUp } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, worker } from '../lib/cfolk.mjs';
import {
  taxi, riceBox, extendHand, handheld, tvConsole, bulb, gear, chartDown, cross, sign, shop, hanafuda, playingCard, townRow, building,
  plane, train, dpad, bwHandheld, colorHandheld, battery, bubble, trophy, ball, calculator, lightGun, target, toyRobot, dustyPile,
  goldSeal, redGoggle, dualScreen, remote, hybridConsole, houseFrame,
} from '../lib/cprops.mjs';
import { cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const RED = '#d23a33', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', GRAY = '#9aa0a8';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50] };
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
const calmPres = (o) => kid({ hair: 'side', hairColor: '#4a3a30', glasses: true, shirt: '#7a8fb0', pants: '#3b4a6b', ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const g2 = (inner, x, y, s = 1, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${inner}</g>`;
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });
const coin = (x, y, s = 1) => ellipse(x, y, 26 * s, 26 * s, { fill: C.yellow, w: 5 }) + ellipse(x, y, 8 * s, 8 * s, { fill: '#c9a227', w: 3 });
const heart = (x, y, s = 1, col = C.pink) => g2(poly([[0, 30], [-40, -6], [-34, -34], [-12, -38], [0, -20], [12, -38], [34, -34], [40, -6]], { fill: col, w: 5 }), x, y, s);
const bolt = (x, y, s = 1) => g2(poly([[-10, -60], [30, -60], [6, -6], [34, -6], [-24, 70], [-6, 10], [-34, 10]], { fill: C.yellow, w: 5 }), x, y, s);
const box = (x, y, w, h, col, label, size = 50) => rect(x - w / 2, y - h / 2, w, h, { fill: col }) + (label ? text(label, x, y + size * 0.35, { size, font: 'Zen Maru Gothic', weight: 900 }) : '');
// 棒グラフ（[値0〜1, 色, ラベル]）
const bars = (tl, items, { x0 = 460, base = 820, h = 520, gap = 300, delay = 0.2 } = {}) => items.map(([v, col, lb], i) => {
  const k = tw(tl, delay + i * 0.2, delay + i * 0.2 + 0.7, 0, v, ease.out), x = x0 + i * gap;
  return rect(x - 80, base - h * k, 160, Math.max(4, h * k), { fill: col }) + text(lb, x, base + 70, { size: 50, font: 'Zen Maru Gothic', weight: 900 });
}).join('') + rect(x0 - 160, base, gap * items.length + 20, 10, { fill: INK, color: null });
// めくれるカレンダー
const calendar = (tl, a, b, x = 960, y = 540) => {
  const k = tl > 0.9 ? 1 : 0;
  return rect(x - 260, y - 300, 520, 600, { fill: C.white }) + rect(x - 260, y - 300, 520, 130, { fill: RED }) +
    line([[x - 150, y - 330], [x - 150, y - 270]], { w: 12, passes: 1 }) + line([[x + 150, y - 330], [x + 150, y - 270]], { w: 12, passes: 1 }) +
    xf(text(k ? b : a, x, y + 120, { size: 160, font: 'Zen Maru Gothic', weight: 900 }), { s: k ? popS(tl, 0.9) : 1, cx: x, cy: y + 60 });
};
// 新聞
const paper = (str, x, y, r = 0) => g2(rect(-360, -240, 720, 480, { fill: '#f4f0e6' }) + text(str, 0, -110, { size: 76, font: 'Zen Maru Gothic', weight: 900 }) +
  [0, 1, 2, 3].map((i) => line([[-300, -10 + i * 60], [i === 3 ? 60 : 300, -10 + i * 60]], { w: 8, color: '#9a9488', passes: 1 })).join(''), x, y, 1, r);
// ゲームセンターの筐体
const arcade = (x, y, s = 1, glowOn = 1) => g2(rect(-120, -320, 240, 640, { fill: '#3a3a8a' }) + rect(-90, -260, 180, 150, { fill: glowOn ? '#5ad1ff' : '#223' }) +
  rect(-110, -60, 220, 40, { fill: '#555' }) + ellipse(-40, -40, 16, 16, { fill: RED, w: 4 }) + ellipse(30, -40, 16, 16, { fill: C.yellow, w: 4 }), x, y, s);

// ───── 05 カードの限界と、失敗つづき
const S05 = {
  // 「アメリカで世界最大級のトランプ会社を見学したとき、」→ 飛行機の窓ぎわの山内
  0: { before: [(tl, d, t) => {
    let s = fill('#dfe6ee') + rect(1080, 200, 520, 420, { fill: '#9fd0f0', w: 10 });
    s += `<clipPath id="pw"><rect x="1080" y="200" width="520" height="420"/></clipPath><g clip-path="url(#pw)">` +
      [0, 1, 2].map((i) => ellipse(((1700 - tl * 300 - i * 260) % 700 + 700) % 700 + 1000, 300 + i * 100, 110, 45, { fill: C.white, w: 4 })).join('') + '</g>';
    s += mid(pres, 640, { blink: blinking(t, 2), look: [1, -0.2], arms: P.idle });
    s += enter(sign('アメリカへ', 1340, 760, { size: 80, fill: C.yellow }), tl, 0.4, { cx: 1340, cy: 760 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「この程度の大きさなのか」→ 定規で測っても小さい
  1: { after: [(tl, d) => {
    let s = fill('#cfe6f5') + rect(-200, 900, 2400, 300, { fill: '#9ab08a', color: null });
    s += building(820, 900, 300, 380, '#d8b080') + text('世界一', 820, 490, { size: 54, font: 'Zen Maru Gothic', weight: 900 });
    s += rect(1180, 100, 90, 800, { fill: C.yellow });
    for (let i = 0; i < 16; i++) s += line([[1180, 140 + i * 48], [1180 + (i % 4 ? 30 : 60), 140 + i * 48]], { w: 5, passes: 1 });
    s += xf(arrow(1120, 520, 990, 520, { color: RED, w: 12 }), { s: popS(tl, 0.5), cx: 1050, cy: 520 }) + enter(sign('意外と小さい', 1500, 300, { size: 70, fill: C.white }), tl, 0.8, { cx: 1500, cy: 300 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 「そこで1960年代、任天堂は本業とは関係のない商売に」→ 新しい商売を考える社長
  3: { before: [(tl, d, t) => {
    let s = fill('#f4ead6') + rect(1050, 160, 760, 560, { fill: C.white, w: 8 }) + hanafuda(1430, 440, 0.7, 0, 1);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy], i) => { s += xf(arrow(1430, 440, 1430 + dx * 280, 440 + dy * 180, { w: 8, color: RED }) + text('？', 1430 + dx * 320, 450 + dy * 210, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.3 + i * 0.25), cx: 1430, cy: 440 }); });
    s += mid(pres, 560, { blink: blinking(t, 2), arms: P.point, look: [1, -0.3] });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 「お湯をかけるだけのインスタントライス」→ やかんでお湯
  4: { after: [(tl, d) => {
    let s = fill('#fdf3e4') + glow(960, 600, 600, '#fff', 0.3) + riceBox(1080, 720, 1.6);
    s += g2(ellipse(0, 0, 170, 120, { fill: '#a0a8b0' }) + poly([[120, -30], [300, -110], [310, -90], [150, 10]], { fill: '#a0a8b0' }) + rect(-60, -150, 120, 40, { fill: INK }), 640, 360, 1, 20);
    for (let i = 0; i < 6; i++) { const k = (tl * 2 + i / 6) % 1; s += ellipse(lerp(900, 1040, k), lerp(330, 600, k), 8, 14, { fill: C.sky, w: 3 }); }
    for (let i = 0; i < 3; i++) s += line([[1040 + i * 50, 520], [1020 + i * 50 + Math.sin(tl * 4 + i) * 20, 440], [1050 + i * 50, 360]], { w: 6, color: '#bbb', passes: 1 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 「カードとは、技術も売り方もまるで違ったからだ。」→ 花札屋 ≠ タクシー
  7: { after: [(tl, d) => {
    let s = fill('#efe6d6') + rect(60, 160, 820, 640, { fill: SEPIA }) + rect(1040, 160, 820, 640, { fill: '#cfd6de' });
    s += shop(470, 640, 0.8) + taxi(1450, 640, 1.0);
    s += xf(big('≠', 960, 560, 240, RED), { s: popS(tl, 0.4), cx: 960, cy: 480 });
    s += text('カード', 470, 900, { size: 60, font: 'Zen Maru Gothic', weight: 900 }) + text('タクシー', 1450, 900, { size: 60, font: 'Zen Maru Gothic', weight: 900 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
  // 「任天堂は、それを身をもって学んだ。」→ ノートに「教訓」
  8: { after: [(tl, d, t) => {
    let s = fill('#e8e2f0') + glow(960, 500, 700, '#fff', 0.3) + mid(pres, 640, { blink: blinking(t, 2), arms: P.hold, expr: 'smile', sweat: true, look: [1, 0.4] });
    s += g2(rect(-260, -180, 520, 360, { fill: C.white }) + line([[0, -180], [0, 180]], { w: 6, passes: 1 }) + text('教訓', -130, 20, { size: 80, color: RED, font: 'Zen Maru Gothic', weight: 900 }), 1340, 520, 1, -4);
    s += typeText('得意なことで勝負する', 1340, 820, tl, { size: 58, color: INK, delay: 0.4 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 「追い打ちをかけるように、トランプのブームも去り、」→ トランプが風で飛んでいく
  9: { before: [(tl, d) => {
    let s = fill('#9aa6b4') + glow(960, 300, 800, '#fff', 0.1) + rect(260, 780, 1400, 40, { fill: C.brown });
    for (let i = 0; i < 12; i++) {
      const k = clamp(tl * 0.8 - i * 0.08);
      s += playingCard(lerp(380 + (i % 6) * 220, -300, ease.in ? ease.in(k) : k * k), lerp(700 - Math.floor(i / 6) * 120, 200 + (i % 3) * 120, k), 0.55, k * 400, i % 2 ? '♥' : '♠', i % 2 ? RED : INK);
    }
    for (let i = 0; i < 4; i++) s += line([[1900 - ((tl * 900 + i * 400) % 2200), 200 + i * 160], [2100 - ((tl * 900 + i * 400) % 2200), 200 + i * 160]], { w: 6, color: C.white, passes: 1 });
    s += typeText('ブームが去る', 960, 160, tl, { size: 80, color: C.white });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「そのとき会社を救ったのは、工場のすみで、」→ 大きな工場のすみ
  12: { before: [(tl, d) => {
    let s = fill('#4a4e58') + rect(-200, 820, 2400, 400, { fill: '#3a3d45', color: null });
    for (let i = 0; i < 4; i++) s += rect(120 + i * 380, 360, 300, 460, { fill: '#6b7080' }) + gear(270 + i * 380, 300, 70, tl * 40 * (i % 2 ? -1 : 1), '#8e96a8');
    const k = tw(tl, 0.3, d * 0.8, 0, 1, ease.inOut);
    s += `<ellipse cx="1700" cy="800" rx="${60 + k * 120}" ry="${40 + k * 80}" fill="#fff6d0" opacity="${0.3 + k * 0.3}"/>` + ellipse(1700, 790, 30, 30, { fill: C.skin, w: 4 });
    s += xf(arrow(1500, 500, 1660, 720, { color: C.yellow, w: 12 }), { s: popS(tl, d * 0.5), cx: 1580, cy: 610 }) + enter(sign('工場のすみ', 1400, 420, { size: 70, fill: C.yellow }), tl, d * 0.5, { cx: 1400, cy: 420 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.1, x0: 960, x1: 1200, y0: 540, y1: 600 });
  }] },
};

// ───── 07 ひまつぶしのおもちゃ
const S07 = {
  // 「そのころ、任天堂の工場に、ひとりの若い技術者がいた。」→ 工場でひとりに丸
  0: { before: [(tl, d, t) => {
    let s = fill('#d6e4dc') + rect(-200, 840, 2400, 400, { fill: '#8f9a92', color: null }) + gear(200, 200, 100, tl * 30) + gear(1750, 220, 90, -tl * 40);
    [300, 620, 1300, 1620].forEach((x, i) => { s += kid({ x, y: 980, s: 1.1, hair: i % 2 ? 'side' : 'messy', shirt: '#8a96a6', blink: blinking(t, i), arms: mix(P.idle, [12, 8, 90, 20], (Math.sin(tl * 5 + i) + 1) / 2) }); });
    s += worker({ x: 960, y: 980, s: 1.1, blink: blinking(t, 5) });
    s += `<circle cx="960" cy="760" r="${tl > 0.5 ? 210 : 0}" fill="none" stroke="${RED}" stroke-width="12"/>`;
    return cam(s, tl, d, { z0: 1.0, z1: 1.12, y0: 540, y1: 600 });
  }] },
  // 「大学で電子工学を学んだ横井だが、」→ 卒業と電子回路
  2: { before: [(tl, d, t) => {
    let s = fill('#e8eef6') + glow(800, 500, 600, '#fff', 0.3) + mid(worker, 680, { blink: blinking(t, 5), arms: P.cheer, expr: 'smile' });
    s += poly([[680 - 130, 470], [680, 420], [680 + 130, 470], [680, 520]], { fill: INK, w: 4 });
    s += g2(rect(-220, -150, 440, 300, { fill: '#2f6b48' }) + [0, 1, 2].map((i) => line([[-180, -90 + i * 90], [-40, -90 + i * 90], [-40, -40 + i * 90], [180, -40 + i * 90]], { w: 6, color: C.yellow, passes: 1 })).join('') +
      rect(-30, -120, 60, 40, { fill: INK }) + rect(60, 0, 60, 40, { fill: INK }), 1380, 520, popS(tl, 0.3));
    s += typeText('電子工学', 1380, 820, tl, { size: 70, color: INK, delay: 0.5 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 「格子の形をした腕が、伸びたり縮んだりして、」→ 設計図
  4: { before: [(tl, d) => {
    const ext = 0.5 - 0.5 * Math.cos(tl * 2.4);
    let s = fill('#2a4f86');
    for (let i = 0; i < 20; i++) s += line([[i * 100, 0], [i * 100, 1080]], { w: 2, color: '#4a6fa6', passes: 1 }) + line([[0, i * 60], [1920, i * 60]], { w: 2, color: '#4a6fa6', passes: 1 });
    const n = 5, w = 60 + ext * 80;
    for (let i = 0; i < n; i++) s += line([[400 + i * w, 460], [400 + (i + 1) * w, 620]], { w: 8, color: C.white, passes: 1 }) + line([[400 + i * w, 620], [400 + (i + 1) * w, 460]], { w: 8, color: C.white, passes: 1 });
    s += arrow(400, 760, 400 + n * w, 760, { color: C.yellow, w: 8 }) + arrow(400 + n * w, 760, 400, 760, { color: C.yellow, w: 8 });
    s += typeText('格子の腕', 960, 200, tl, { size: 80, color: C.white });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「それを見つけた山内は、」→ 社長が見つける
  5: { before: [(tl, d, t) => {
    let s = fill('#d6e4dc') + rect(-200, 880, 2400, 400, { fill: '#8f9a92', color: null }) + gear(1700, 200, 100, tl * 40);
    s += mid(pres, 700, { blink: blinking(t, 6), look: [1, 0], expr: tl > 0.6 ? 'wow' : 'smile', arms: P.idle });
    s += xf(text('！', 860, 420, { size: 200, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.6), cx: 860, cy: 380 });
    s += xf(extendHand(1250, 760, 1.2, 0.5 + 0.5 * Math.sin(tl * 2.4)), { o: 0.9 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.08, x0: 900 });
  }] },
  // 「…大ヒットとなった。」→ 子どもがのびる手で遊ぶ
  7: { after: [(tl, d, t) => {
    const ext = 0.5 - 0.5 * Math.cos(tl * 3);
    let s = fill('#fff2c8') + glow(900, 500, 700, '#fff', 0.35) + mid(kid, 560, { hair: 'messy', shirt: C.orange, arms: P.hold, blink: blinking(t, 1), expr: 'smile', look: [1, 0] });
    s += extendHand(620, 780, 1.4, ext) + ball(620 + 6 * (22 + 48 * ext) * 1.4 + 110, 780, 60, C.blue);
    s += enter(sign('おもしろい！', 1400, 300, { size: 80, fill: RED, color: C.white }), tl, 0.4, { cx: 1400, cy: 300 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「点検係だった横井は、新設された開発部門に移り、」→ 開発部門のドアへ
  9: { before: [(tl, d, t) => {
    const k = tw(tl, 0, d * 0.9, 0, 1, (x) => x);
    let s = fill('#e6e0d4') + rect(1300, 220, 420, 700, { fill: '#b98a58' }) + rect(1340, 260, 340, 120, { fill: C.white, w: 5 }) + text('開発部門', 1510, 340, { size: 56, font: 'Zen Maru Gothic', weight: 900 });
    s += ellipse(1640, 600, 18, 18, { fill: C.yellow, w: 4 }) + rect(-200, 920, 2400, 300, { fill: '#a89c8a', color: null });
    s += worker({ x: lerp(360, 1100, k), y: 1060, s: 1.6, legs: Math.sin(tl * 8), blink: blinking(t, 5), look: [1, 0], arms: P.hold }) + box(lerp(360, 1100, k), 640, 220, 140, '#d8b080', 'おもちゃ', 40);
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
};

// ───── 08 枯れた技術の水平思考
const S08 = {
  // 「それを、まったく別の使い道に横へずらし、」→ 電卓を見て考える
  3: { before: [(tl, d, t) => {
    let s = fill('#f0ead8') + rect(-200, 820, 2400, 400, { fill: '#a07a50', color: null }) + mid(worker, 640, { blink: blinking(t, 5), arms: P.think, look: [1, 0.3] });
    s += xf(calculator(1250, 640, 1.1), { r: Math.sin(tl * 2) * 4 }) + enter(bubble('別の使い道は？', 1300, 260, { size: 60 }), tl, 0.4, { cx: 1300, cy: 260 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
  }] },
  // 「たとえば1970年の「光線銃」。当時まだ珍しかった太陽電池を、光を感じるセンサーとして使い、」
  6: { before: [
    (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3) + head('1970年', tl) + xf(lightGun(0, 0, 2.2, 0), { x: 960, y: 560, s: popS(tl, 0.2), r: -8, cx: 0, cy: 0 }) +
      sparkles(1400, 360, 70, RED) + typeText('光線銃', 960, 880, tl, { size: 90, color: RED, delay: 0.5 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => {
      let s = fill('#1d2433') + glow(1200, 540, 600, C.yellow, 0.25);
      s += g2(rect(-220, -150, 440, 300, { fill: '#2f4a7a' }) + [0, 1, 2].map((i) => line([[-220, -50 + i * 50], [220, -50 + i * 50]], { w: 4, color: '#8ab', passes: 1 })).join(''), 1250, 540);
      for (let i = 0; i < 5; i++) { const k = (tl * 1.5 + i * 0.2) % 1; s += line([[200 + k * 700, 300 + i * 60], [300 + k * 700, 320 + i * 55]], { w: 10, color: C.yellow, passes: 1 }); }
      s += text('太陽電池', 1250, 800, { size: 64, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) + enter(sign('＝ 光のセンサー', 1250, 220, { size: 70, fill: C.yellow }), tl, 0.6, { cx: 1250, cy: 220 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
    },
  ] },
  // 「最新の技術で勝負しない。」→ 高い最新マシンに×
  7: { before: [(tl, d) => {
    let s = fill('#1f2a44') + glow(960, 500, 600, C.sky, 0.25) + g2(rect(-300, -220, 600, 380, { fill: '#c0c8d8' }) + rect(-250, -180, 500, 290, { fill: '#5ad1ff' }) + rect(-80, 160, 160, 60, { fill: '#888' }), 960, 520);
    s += sign('最新', 960, 160, { size: 80, fill: C.white }) + sign('￥￥￥', 1450, 360, { size: 80, fill: C.yellow, rot: 8 });
    s += xf(cross(960, 520, 3.0), { s: popS(tl, d * 0.5), cx: 960, cy: 520 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 「男女が手を握ると、」→ 手をにぎる
  8: { before: [(tl, d) => {
    let s = fill('#fde6ea') + glow(960, 540, 600, '#fff', 0.35);
    s += rect(-200, 470, 1000, 120, { fill: C.blue }) + rect(1120, 470, 1000, 120, { fill: C.pink });
    s += ellipse(880, 530, 110, 90, { fill: C.skin, w: 7 }) + ellipse(1040, 530, 110, 90, { fill: C.skin, w: 7 });
    for (let i = 0; i < 4; i++) { const k = (tl * 0.7 + i * 0.25) % 1; s += heart(960 + Math.sin(k * 6 + i) * 120, lerp(420, 80, k), 0.8 + k * 0.5); }
    return cam(s, tl, d, { z0: 1.0, z1: 1.1 });
  }] },
  // 「実際には、体を流れるわずかな電気を測っているだけ。」→ 体を流れる電気
  9: { before: [(tl, d, t) => {
    let s = fill('#26283a') + glow(960, 520, 600, C.yellow, 0.15);
    s += kid({ x: 620, y: 1000, s: 1.4, hair: 'messy', shirt: C.blue, arms: [12, 8, 80, -10], blink: blinking(t, 1) }) + kid({ x: 1300, y: 1000, s: 1.4, hair: 'side', shirt: C.pink, arms: [80, -10, 12, 8], blink: blinking(t, 2), flip: true });
    const k = (tl * 1.2) % 1;
    s += line([[700, 720], [960, 700], [1220, 720]], { w: 8, color: C.yellow, passes: 1 }) + bolt(lerp(700, 1220, k), 700, 0.7);
    s += typeText('ほんの少しの電気', 960, 200, tl, { size: 80, color: C.yellow });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
};

// ───── 09 新幹線の電卓
const S09 = {
  // 「あるとき横井は、新幹線の中で、」→ 走る新幹線
  0: { before: [(tl, d) => {
    let s = fill('#cfe6f5') + glow(960, 300, 800, '#fff', 0.3) + poly([[-200, 700], [300, 420], [700, 700]], { fill: '#8fbf8a' }) + poly([[1100, 700], [1600, 380], [2100, 700]], { fill: '#8fbf8a' });
    s += poly([[600, 700], [960, 360], [1320, 700]], { fill: C.white }) + rect(-200, 700, 2400, 60, { fill: '#888', color: null });
    s += train(tw(tl, 0, d, -600, 2400, (x) => x), 640, 1.4);
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
  // 「大人だって遊ぶのではないか」→ 大人がゲームでにっこり
  1: { after: [(tl, d, t) => cam(fill('#e6eef6') + glow(800, 500, 600, '#fff', 0.3) + mid(salary, 760, { blink: blinking(t, 7), arms: P.hold, expr: 'smile', look: [0, 0.6] }) + handheld(760, 840, 0.5, tl % 1) +
    enter(sign('大人も夢中', 1420, 320, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 1420, cy: 320 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
  // 「…「ゲーム&ウオッチ」。」→ 名前
  2: { after: [(tl, d) => cam(fill(RED) + glow(960, 500, 700, '#fff', 0.2) + xf(handheld(0, 0, 1.3, tl % 1), { x: 960, y: 480, s: popS(tl, 0.1), cx: 0, cy: 0 }) +
    xf(big('ゲーム&ウオッチ', 960, 840, 110, C.yellow, { stroke: INK }), { s: popS(tl, 0.4), cx: 960, cy: 800 }), tl, d, { z0: 1.0, z1: 1.06 })] },
  // 「手のひらサイズのゲーム機だ。」→ 手のひらにのる
  3: { after: [(tl, d) => {
    let s = fill('#fdf1dc') + glow(960, 500, 600, '#fff', 0.35);
    s += ellipse(960, 700, 360, 200, { fill: C.skin, w: 8 }) + [0, 1, 2, 3].map((i) => ellipse(700 + i * 150, 560, 60, 110, { fill: C.skin, w: 7 })).join('');
    s += xf(handheld(0, 0, 0.9, tl % 1), { x: 960, y: 640 - Math.abs(Math.sin(tl * 3)) * 20 });
    s += enter(sign('手のひらサイズ', 960, 180, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 960, cy: 180 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「「電卓戦争」の真っただ中。」→ 値下げの値札
  4: { after: [(tl, d) => {
    let s = fill('#2b2f3a') + glow(960, 540, 700, RED, 0.15) + calculator(700, 580, 1.4);
    const p = Math.round(lerp(12000, 3000, ease.out(clamp(tl / (d * 0.8)))) / 100) * 100;
    s += g2(rect(-220, -100, 440, 200, { fill: C.yellow }) + text('￥' + p.toLocaleString('en-US'), 0, 30, { size: 90, font: 'Zen Maru Gothic', weight: 900 }), 1300, 520, 1, 6);
    s += xf(arrow(1300, 680, 1300, 900, { color: RED, w: 18, head: 50 }), { s: popS(tl, 0.3), cx: 1300, cy: 790 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 960 + Math.sin(tl * 18) * 3 });
  }] },
  // 「そのおかげで、液晶の部品はすっかり安くなっていた。」→ 部品の山
  5: { before: [(tl, d) => {
    let s = fill('#efe7d6') + glow(960, 600, 600, '#fff', 0.3);
    for (let i = 0; i < 14; i++) s += xf(rect(-70, -45, 140, 90, { fill: '#c8d4ae', w: 5 }), { x: 560 + (i % 5) * 200 + (Math.floor(i / 5) % 2) * 100, y: 820 - Math.floor(i / 5) * 90, r: (i * 23) % 20 - 10, s: popS(tl, i * 0.06), cx: 0, cy: 0 });
    s += enter(sign('液晶 ￥10', 1500, 300, { size: 80, fill: RED, color: C.white }), tl, 0.8, { cx: 1500, cy: 300 }) + typeText('液晶の部品', 700, 220, tl, { size: 70, color: INK });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「…のちに任天堂の大きな財産になる。」→ 宝箱の十字キー
  8: { after: [(tl, d) => {
    let s = fill('#2a2230') + glow(960, 500, 600, C.yellow, 0.35) + rect(660, 560, 600, 320, { fill: '#8a5a34' }) + rect(660, 600, 600, 40, { fill: C.yellow, color: null });
    s += xf(dpad(0, 0, 1.4), { x: 960, y: tw(tl, 0.2, 1.0, 640, 420, ease.back), s: popS(tl, 0.2), cx: 0, cy: 0 }) + sparkles(700, 360, 60, C.yellow) + sparkles(1240, 380, 60, C.yellow);
    s += typeText('財産', 960, 180, tl, { size: 100, color: C.yellow, delay: 0.6 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「そしてこの十字キーと横井の考え方が、」→ 横井と十字キー
  9: { before: [(tl, d, t) => cam(fill('#e8eaf6') + glow(1300, 400, 600, C.yellow, 0.3) + mid(worker, 640, { blink: blinking(t, 5), arms: P.raise, expr: 'smile', look: [1, -0.3] }) +
    xf(dpad(0, 0, 1.6), { x: 1300, y: 440, r: tl * 20, s: popS(tl, 0.2), cx: 0, cy: 0 }) + xf(bulb(1650, 260, 0.8, 1), { s: popS(tl, 0.6), cx: 1650, cy: 260 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
};

// ───── 11 ファミコン
const S11 = {
  // 「…「ファミリーコンピュータ」を発売した。」→ 赤と白の箱
  0: { after: [(tl, d) => {
    let s = fill('#fdf0d8') + glow(960, 500, 700, RED, 0.15);
    s += xf(rect(-360, -240, 720, 480, { fill: C.white }) + rect(-360, -240, 720, 140, { fill: RED }) + tvConsole(0, 140, 0.55, 0) + text('ファミリーコンピュータ', 0, -150, { size: 50, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), { x: 960, y: 560, s: popS(tl, 0.1), r: Math.sin(tl * 2) * 3, cx: 0, cy: 0 });
    s += sparkles(1420, 300, 60, RED) + sparkles(500, 780, 60, RED);
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 「おもちゃとして手が届く値段にこだわった。」→ おもちゃ売り場の値札
  1: { after: [(tl, d, t) => {
    let s = fill('#fff2c8') + rect(200, 640, 1520, 40, { fill: '#b07a46' }) + rect(200, 320, 1520, 30, { fill: '#b07a46' });
    s += toyRobot(380, 560, 0.8) + ball(620, 590, 50, C.blue) + tvConsole(1000, 560, 0.5, 0) + g2(rect(-110, -50, 220, 100, { fill: C.yellow }) + text('14,800円', 0, 18, { size: 44, font: 'Zen Maru Gothic', weight: 900 }), 1000, 270, 1, -4);
    s += kid({ x: 1500, y: 1110, s: 1.6, hair: 'messy', shirt: C.green, arms: [12, 8, 120, 10], blink: blinking(t, 2), expr: 'smile', flip: true, look: [-1, -0.3] });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「だがファミコンは、ゲームセンターに負けない、」→ ゲームセンター
  4: { before: [(tl, d) => {
    let s = fill('#15152a');
    [300, 700, 1220, 1620].forEach((x, i) => { s += arcade(x, 640, 1.1, (Math.floor(tl * 4) + i) % 3 ? 1 : 0.6); });
    s += `<text x="960" y="200" font-family="Zen Maru Gothic" font-weight="900" font-size="90" text-anchor="middle" fill="#ff5ad1" opacity="${0.6 + 0.4 * Math.sin(tl * 8)}">GAME</text>`;
    s += typeText('ゲームセンター', 960, 950, tl, { size: 70, color: C.white }).replace('y="950"', 'y="320"');
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「…子どもたちの遊びの中心になる。」→ コントローラーを握る子ども
  5: { after: [(tl, d, t) => cam(fill('#ffe9d0') + glow(960, 500, 700, '#fff', 0.35) + mid(kid, 760, { hair: 'messy', shirt: C.blue, arms: P.hold, blink: blinking(t, 3), expr: 'smile', tilt: Math.sin(tl * 6) * 5 }) +
    rect(640, 700, 240, 110, { fill: '#c9c0b4' }) + xf(dpad(0, 0, 0.4), { x: 700, y: 755 }) + tvConsole(1450, 640, 0.7, Math.max(0, Math.sin(tl * 5))), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
  // 「1985年には「スーパーマリオブラザーズ」が登場し、」→ 新聞で大人気
  6: { after: [(tl, d) => cam(fill('#e8e2d4') + xf(paper('大人気！', 0, 0), { x: 960, y: 520, s: popS(tl, 0.1, 0.5), r: tw(tl, 0.1, 0.6, -360, -4, ease.out), cx: 0, cy: 0 }) +
    enter(sign('社会現象', 1500, 860, { size: 80, fill: RED, color: C.white }), tl, 0.7, { cx: 1500, cy: 860 }).replace(/translate\(1500 860\)/, 'translate(1500 800)'), tl, d, { z0: 1.0, z1: 1.05 })] },
  // 「テレビの前に、家族や友だちが集まる。」→ 友だちが遊びに来る
  7: { before: [(tl, d, t) => {
    let s = fill('#cfe6f5') + rect(-200, 860, 2400, 400, { fill: '#9ab08a', color: null }) + houseFrame(1300, 900, 1.6);
    [0, 1, 2].forEach((i) => { const x = tw(tl, i * 0.3, i * 0.3 + d * 0.7, -200 - i * 200, 1000 - i * 150, (k) => k); s += kid({ x, y: 1040, s: 1.2, hair: i % 2 ? 'side' : 'messy', shirt: [C.orange, C.pink, C.green][i], legs: Math.sin(tl * 10 + i), blink: blinking(t, i), expr: 'smile' }); });
    s += enter(bubble('あそぼー！', 600, 300, { size: 60 }), tl, 0.4, { cx: 600, cy: 300 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
};

// ───── 12 アメリカでの品質の番人
const S12 = {
  // 「次の目標は、アメリカ。」→ 日本からアメリカへの矢印
  0: { before: [(tl, d) => {
    let s = fill('#1d3a5a') + glow(960, 540, 800, C.sky, 0.15);
    s += poly([[1500, 380], [1580, 340], [1600, 460], [1520, 520]], { fill: C.green }) + poly([[160, 300], [560, 260], [640, 520], [380, 640], [200, 520]], { fill: C.green });
    s += text('日本', 1560, 600, { size: 54, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) + text('アメリカ', 400, 740, { size: 54, color: C.white, font: 'Zen Maru Gothic', weight: 900 });
    const k = tw(tl, 0.2, d * 0.8, 0, 1, ease.inOut);
    s += line(Array.from({ length: 12 }, (_, i) => { const u = (i / 11) * k; return [lerp(1500, 600, u), 420 - Math.sin(u * Math.PI) * 200]; }), { w: 10, color: C.yellow, passes: 1 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「当時のアメリカでは、質の低いゲームが大量に出回り、ゲームがまったく売れなくなる事件が起きていた。」
  1: { before: [
    (tl, d) => {
      let s = fill('#e2dccd') + rect(160, 220, 1600, 30, { fill: '#8a5a34' }) + rect(160, 560, 1600, 30, { fill: '#8a5a34' });
      for (let i = 0; i < 16; i++) { const x = 260 + (i % 8) * 200, y = 400 + Math.floor(i / 8) * 340; s += xf(rect(-70, -100, 140, 200, { fill: ['#9a9a8a', '#8a8a9a', '#a09080'][i % 3] }) + text('×', 0, 30, { size: 90, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x, y, s: popS(tl, i * 0.05), cx: 0, cy: 0 }); }
      s += enter(sign('質の低いゲーム', 960, 960, { size: 70, fill: C.white }), tl, 0.6, { cx: 960, cy: 960 }).replace(/translate\(960 960\)/, 'translate(960 870)');
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => cam(fill(CREAM) + xf(chartDown(0, 0, 2.2, tw(tl, 0.1, d * 0.8, 0, 1, (k) => k)), { x: 960, y: 560 }) + head('ゲームの売上', tl, RED), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, d * 0.8, 0.4, 14) }),
  ] },
  // 「お店の担当者は、」→ 営業マンがゲーム機を持っていく
  2: { before: [(tl, d, t) => cam(fill('#e2e6ee') + rect(1150, 160, 600, 760, { fill: '#c49a6a' }) + text('TOY STORE', 1450, 260, { size: 60, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) +
    worker({ x: tw(tl, 0, d * 0.8, 300, 820, ease.out), y: 1080, s: 1.6, legs: tl < d * 0.8 ? Math.sin(tl * 8) : 0, blink: blinking(t, 5), arms: P.hold, look: [1, 0] }) + box(tw(tl, 0, d * 0.8, 300, 820, ease.out), 860, 200, 120, RED, '', 0), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「そこで任天堂は、ゲーム機を「おもちゃ」として売り込んだ。」→ ロボットとセットの箱
  3: { before: [(tl, d) => {
    let s = fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3);
    s += xf(rect(-420, -260, 840, 520, { fill: C.white }) + tvConsole(-170, 120, 0.5, 0) + toyRobot(200, 160, 0.9) + line([[0, -260], [0, 260]], { w: 26, color: RED, passes: 1 }) + line([[-420, 0], [420, 0]], { w: 26, color: RED, passes: 1 }), { x: 960, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0 });
    s += enter(sign('おもちゃ', 960, 170, { size: 100, fill: RED, color: C.white }), tl, 0.5, { cx: 960, cy: 170 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「家庭の娯楽の機械、という意味だ。」→ 家族で遊ぶ
  4: { after: [(tl, d, t) => cam(fill('#ffe9d0') + glow(960, 420, 700, '#fff', 0.35) + rect(-200, 840, 2400, 400, { fill: '#c88a5a', color: null }) + tvConsole(960, 700, 0.85, Math.max(0, Math.sin(tl * 5))) +
    [[300, '#555', 'side', 1.5], [600, C.pink, 'side', 1.3], [1330, C.blue, 'messy', 1.2], [1620, C.yellow, 'messy', 1.2]].map(([x, col, h, sc], i) => kid({ x, y: 1080, s: sc, shirt: col, hair: h, arms: P.cheer, blink: blinking(t, i), mustache: i === 0, flip: x > 960, expr: 'smile' })).join(''), tl, d, { z0: 1.0, z1: 1.05 })] },
  // 「さらに、任天堂が認めたソフトにだけ品質の印を付け、」→ 検査してハンコ
  5: { before: [(tl, d, t) => {
    let s = fill('#f3ecdf') + mid(salary, 520, { blink: blinking(t, 3), arms: P.raise, look: [1, 0.3] });
    s += g2(ellipse(0, 0, 70, 70, { fill: 'none', w: 10 }) + line([[50, 50], [130, 130]], { w: 16, passes: 1 }), 900, 520, 1.2);
    s += rect(1100, 380, 200, 280, { fill: C.sky });
    const k = popS(tl, d * 0.5, 0.25);
    s += xf(goldSeal(0, 0, 0.9, 0), { x: 1240, y: 460, s: k ? 2 - k : 0, cx: 0, cy: 0 }) + rect(1400, 380, 200, 280, { fill: '#999' }) + xf(text('×', 1500, 560, { size: 160, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, d * 0.7), cx: 1500, cy: 500 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 「…アメリカでも大成功をおさめる。」→ 売上がのびる
  6: { after: [(tl, d) => cam(fill('#e3eef8') + glow(960, 400, 800, '#fff', 0.3) + bars(tl, [[0.25, GRAY, '1985'], [0.5, C.sky, '1986'], [0.75, C.blue, '1987'], [1, RED, '1988']]) +
    xf(bigUp(1700, 400, 1.3, RED), { s: popS(tl, 1.2), cx: 1700, cy: 400 }) + head('アメリカでの売上', tl), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「アメリカの子どもたちにとっても、」→ アメリカの家
  7: { before: [(tl, d, t) => cam(fill('#cfe6f5') + rect(-200, 840, 2400, 400, { fill: '#8fbf6a', color: null }) + houseFrame(640, 880, 1.4) + houseFrame(1500, 880, 1.2) +
    kid({ x: 1050, y: 1060, s: 1.4, hair: 'messy', hairColor: '#d8a040', shirt: RED, arms: P.cheer, blink: blinking(t, 1), expr: 'smile' }) + enter(bubble('ゲームしよう！', 1050, 300, { size: 60 }), tl, 0.3, { cx: 1050, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 })] },
};

// ───── 13 白黒のゲームボーイ
const S13 = {
  // 「1989年、横井たちのチームは、」→ チームで試作
  0: { before: [(tl, d, t) => {
    let s = fill('#e6e0d4') + rect(-200, 820, 2400, 400, { fill: '#a07a50', color: null });
    [560, 960, 1360].forEach((x, i) => { s += (i === 1 ? worker : kid)({ x, y: 1060, s: 1.5, hair: 'side', glasses: i !== 2, shirt: [C.sky, C.sky, '#9ab'][i], blink: blinking(t, i + 4), arms: mix(P.idle, P.raise, (Math.sin(tl * 3 + i) + 1) / 2), expr: 'smile' }); });
    s += xf(bwHandheld(0, 0, 0.36, tl % 1), { x: 960, y: 900 }) + typeText('横井たちのチーム', 960, 180, tl, { size: 70, color: INK });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「1年後、ライバルのセガが「ゲームギア」を出す。」→ カレンダー
  2: { before: [(tl, d) => cam(fill('#e8eaf2') + calendar(tl, '1989', '1990') + typeText('1年後', 1500, 300, tl, { size: 80, color: RED, delay: 0.9 }), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「だが、カラー画面は電池を大量に使う。」→ 電池が6本吸いこまれる
  4: { before: [(tl, d) => {
    let s = fill('#2b2f3a') + glow(960, 480, 600, C.blue, 0.2) + xf(colorHandheld(0, 0, 1.2, 0), { x: 960, y: 420 });
    for (let i = 0; i < 6; i++) { const k = tw(tl, i * 0.3, i * 0.3 + 0.5, 0, 1, ease.in || ((x) => x * x)); s += xf(battery(0, 0, 0.8, 1), { x: lerp(300 + i * 264, 960, k), y: lerp(880, 460, k), s: 1 - k * 0.8, cx: 0, cy: 0 }); }
    s += typeText('電池をたくさん使う', 960, 160, tl, { size: 70, color: C.white });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「一方のゲームボーイは、電池4本で約30時間。」→ 時計がぐるぐる回っても動く
  5: { after: [(tl, d) => {
    let s = fill('#e7f1e2') + glow(960, 500, 600, C.green, 0.2) + ellipse(560, 520, 240, 240, { fill: C.white, w: 8 });
    s += line([[560, 520], [560 + Math.sin(tl * 12) * 180, 520 - Math.cos(tl * 12) * 180]], { w: 10, passes: 1 }) + line([[560, 520], [560 + Math.sin(tl * 1) * 120, 520 - Math.cos(tl * 1) * 120]], { w: 14, passes: 1 });
    s += xf(bwHandheld(0, 0, 1.0, tl % 1), { x: 1350, y: 520 }) + typeText('30時間', 560, 880, tl, { size: 90, color: C.green, delay: 0.3 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「値段も、…」→ 子どもがゲームボーイを選ぶ
  6: { after: [(tl, d, t) => cam(fill('#fff2c8') + glow(800, 500, 600, '#fff', 0.35) + mid(kid, 760, { hair: 'messy', shirt: C.orange, arms: P.hold, blink: blinking(t, 1), expr: 'smile' }) + bwHandheld(760, 890, 0.36, tl % 1) +
    [0, 1, 2].map((i) => coin(1300 + i * 90, 760 - i * 20 - Math.abs(Math.sin(tl * 4 + i)) * 30, 1.4)).join('') + enter(sign('安い！', 1400, 360, { size: 100, fill: C.yellow }), tl, 0.3, { cx: 1400, cy: 360 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
  // 「アメリカではゲームボーイとセットで売られ、大人まで夢中にさせた。」
  7: { after: [
    (tl, d) => cam(fill('#e3eef8') + glow(960, 500, 700, '#fff', 0.3) + xf(rect(-380, -240, 760, 480, { fill: C.white }) + bwHandheld(-150, 30, 0.6, tl % 1) +
      [0, 1, 2, 3].map((i) => `<rect x="${80 + (i % 2) * 70}" y="${-60 + Math.floor(i / 2) * 70}" width="62" height="62" fill="${[RED, C.blue, C.green, C.yellow][i]}" stroke="${INK}" stroke-width="5"/>`).join('') + text('セット', 160, 190, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 960, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0 }) +
      typeText('アメリカ', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d, t) => cam(fill('#e6eef6') + rect(-200, 780, 2400, 400, { fill: '#b9a58a', color: null }) + mid(salary, 700, { blink: blinking(t, 7), arms: P.hold, expr: 'smile', look: [0, 0.6] }) + bwHandheld(700, 830, 0.42, tl % 1) +
      enter(sign('大人も夢中', 1400, 320, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 1400, cy: 320 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
  ] },
  // 「だがこの大成功のすぐあと、」→ よろこぶ横井
  11: { before: [(tl, d, t) => cam(fill('#fff2c8') + glow(900, 500, 600, C.yellow, 0.3) + mid(worker, 760, { blink: blinking(t, 5), arms: P.cheer, expr: 'smile' }) + xf(trophy(0, 0, 1.0), { x: 1350, y: 460 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
};

// ───── 15 生みの親の挫折
const S15 = {
  // 「横井たちが作った新しいゲーム機「バーチャルボーイ」。」→ 横井がゴーグルを発表
  0: { after: [(tl, d, t) => cam(fill('#3a2630') + glow(1200, 500, 600, RED, 0.25) + mid(worker, 640, { blink: blinking(t, 5), arms: P.point, expr: 'smile', look: [1, 0] }) + xf(redGoggle(1300, 560, 1.2), { s: popS(tl, 0.2), cx: 1300, cy: 520 }) +
    typeText('バーチャルボーイ', 1300, 220, tl, { size: 80, color: C.white, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
  // 「その直前に…「ゲームボーイポケット」。これが、横井にとって任天堂での最後の大きな仕事になった。」
  4: { replace: [
    (tl, d) => cam(fill('#f6dcc0') + glow(960, 500, 600, '#fff', 0.3) + bwHandheld(620, 560, 1.2, tl % 1) + xf(bwHandheld(0, 0, 0.9, tl % 1), { x: 1320, y: 600, s: popS(tl, 0.4), cx: 0, cy: 0 }) +
      text('これまで', 620, 900, { size: 54, font: 'Zen Maru Gothic', weight: 900 }) + typeText('小さく軽く', 1320, 900, tl, { size: 60, color: RED, delay: 0.6 }) + typeText('ゲームボーイポケット', 960, 160, tl, { size: 70, color: INK }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => cam(fill('#f2a65a') + `<circle cx="1500" cy="620" r="220" fill="#f26b3a" opacity="0.8"/>` + mid(worker, 760, { blink: blinking(t, 5), arms: P.hold, expr: 'smile', look: [0, 0.5] }) + bwHandheld(760, 760, 0.4, tl % 1) +
      enter(sign('最後の大きな仕事', 1400, 260, { size: 70, fill: C.white }), tl, 0.5, { cx: 1400, cy: 260 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
  ] },
  // 「失敗の責任を取ったという見方もあるが、」→ 新聞
  5: { before: [(tl, d) => cam(fill('#d8d2c6') + xf(paper('責任を取った？', 0, 0), { x: 960, y: 520, s: popS(tl, 0.1, 0.5), r: tw(tl, 0.1, 0.6, 300, 3, ease.out), cx: 0, cy: 0 }), tl, d, { z0: 1.0, z1: 1.05 })] },
  // 「だが1997年、交通事故により、56歳でこの世を去った。」→ だれもいない作業台
  7: { before: [(tl, d) => {
    let s = fill('#3a3a46') + glow(1000, 420, 500, '#ffe0a0', 0.25) + rect(400, 640, 1120, 40, { fill: '#8a5a34' }) + rect(440, 680, 40, 300, { fill: '#8a5a34' }) + rect(1440, 680, 40, 300, { fill: '#8a5a34' });
    s += line([[1300, 640], [1300, 380], [1100, 330]], { w: 10, color: '#888', passes: 1 }) + poly([[1040, 300], [1160, 300], [1180, 380], [1020, 380]], { fill: '#c9b070' });
    s += extendHand(620, 600, 0.5, 0.3) + gear(900, 600, 40, 0) + bwHandheld(1150, 590, 0.35, 0);
    s += typeText('1997年', 960, 160, tl, { size: 70, color: C.white, font: 'Yomogi', weight: 400 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
};

// ───── 16 受け継がれた考え方
const S16 = {
  // 「横井が去ったあとも、白黒のゲームボーイは生き続けた。」→ 売り場にまだ並ぶ
  0: { after: [(tl, d) => cam(fill('#fff2c8') + rect(200, 700, 1520, 40, { fill: '#b07a46' }) + [0, 1, 2, 3, 4].map((i) => bwHandheld(360 + i * 300, 560, 0.55, (tl + i * 0.2) % 1)).join('') +
    enter(sign('まだ売れてる', 960, 220, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「古いゲームボーイが再び売れ始めたのだ。」→ グラフが再上昇
  1: { after: [(tl, d) => cam(fill('#e3eef8') + bars(tl, [[0.8, C.blue, '1990'], [0.45, GRAY, '1994'], [0.3, GRAY, '1995'], [0.95, RED, '1997']]) + head('ゲームボーイの売れ行き', tl, RED) +
    xf(bigUp(1500, 300, 1.0, RED), { s: popS(tl, 1.0), cx: 1500, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「そして2000年代、社長に就任した岩田聡は、」→ 社長室
  2: { before: [(tl, d, t) => cam(fill('#e8e0d0') + rect(1100, 160, 600, 360, { fill: '#cfe6f5', w: 8 }) + building(1250, 520, 120, 240) + building(1500, 520, 140, 300) +
    mid(calmPres, 760, { blink: blinking(t, 9), arms: P.idle, expr: 'smile' }) + rect(400, 820, 1100, 300, { fill: '#7a5230' }) + box(760, 780, 300, 80, C.white, '社長', 50) + head('2000年代', tl), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 })] },
  // 「性能を競うのではなく、2つの画面とタッチペンのニンテンドーDS。テレビの前で体を動かして遊ぶWii。」
  3: { before: [
    (tl, d) => {
      let s = fill('#1d2433') + head('性能の競争', tl, C.white);
      s += bars(tl, [[0.6, GRAY, 'A社'], [0.8, GRAY, 'B社'], [1, GRAY, 'C社']], { x0: 660, gap: 300 });
      s += xf(cross(960, 540, 2.6), { s: popS(tl, d * 0.55), cx: 960, cy: 540 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => {
      const k = (tl * 0.8) % 1;
      let s = fill('#eaf2f6') + glow(960, 540, 600, '#fff', 0.3) + xf(dualScreen(0, 0, 1.5, 0.5), { x: 960, y: 560 });
      s += g2(line([[0, 0], [160, -260]], { w: 16, color: '#666', passes: 1 }), 900 + Math.sin(k * 6.28) * 60, 680, 1);
      s += typeText('2つの画面＋タッチペン', 960, 160, tl, { size: 70, color: INK });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
  ] },
  // 「DSでは、計算や音読で頭をきたえるソフトがヒットし、」→ 頭をきたえる
  4: { before: [(tl, d) => {
    let s = fill('#fdeef2') + glow(960, 520, 600, '#fff', 0.35);
    s += xf(ellipse(-80, 0, 200, 170, { fill: '#f6b6c8' }) + ellipse(90, 0, 200, 170, { fill: '#f6b6c8' }) + line([[-200, -40], [-60, 30], [-180, 90]], { w: 8, color: '#d27a96', passes: 1 }) + line([[200, -50], [80, 20], [190, 80]], { w: 8, color: '#d27a96', passes: 1 }), { x: 960, y: 500, s: 1 + Math.sin(tl * 6) * 0.03, cx: 0, cy: 0 });
    s += xf(text('1+2=3', 0, 0, { size: 80, color: C.blue, font: 'Zen Maru Gothic', weight: 900 }), { x: 520, y: 260, s: popS(tl, 0.3), cx: 0, cy: -30 }) + xf(text('あいうえお', 0, 0, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 1420, y: 280, s: popS(tl, 0.6), cx: 0, cy: -30 });
    s += sparkles(1400, 700, 60, C.yellow) + typeText('頭をきたえる', 960, 860, tl, { size: 80, color: INK, delay: 0.6 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「Wiiの性能は、ライバルのゲーム機より低かった。」→ 性能の棒グラフ
  5: { before: [(tl, d) => cam(fill('#eaf2f6') + head('性能くらべ', tl) + bars(tl, [[0.9, GRAY, 'ライバル'], [0.85, GRAY, 'ライバル'], [0.35, C.sky, 'Wii']], { x0: 560, gap: 400 }), tl, d, { z0: 1.0, z1: 1.04 })] },
  // 「もちろん、順調なことばかりではない。」→ 雨雲とでこぼこ道
  7: { before: [(tl, d, t) => {
    let s = fill('#7d828c') + rect(-200, 820, 2400, 400, { fill: '#5a5e66', color: null }) + building(960, 820, 420, 520, '#d8b080') + text('任天堂', 960, 260, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 });
    for (let i = 0; i < 3; i++) s += ellipse(500 + i * 450, 160, 160, 70, { fill: '#5a5e66', w: 5 });
    for (let i = 0; i < 16; i++) { const k = (tl * 1.6 + i * 0.063) % 1; s += line([[300 + (i * 97) % 1400, 200 + k * 600], [290 + (i * 97) % 1400, 240 + k * 600]], { w: 5, color: '#cfe6f5', passes: 1 }); }
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「…新しい遊び方で大ヒットする。」→ 外でも遊べる
  9: { after: [(tl, d, t) => cam(fill('#cfe6f5') + rect(-200, 800, 2400, 400, { fill: '#8fbf6a', color: null }) + ellipse(1600, 220, 90, 90, { fill: C.yellow, w: 5 }) + poly([[200, 800], [300, 520], [400, 800]], { fill: C.green }) +
    mid(kid, 900, { hair: 'messy', shirt: C.orange, arms: P.hold, blink: blinking(t, 1), expr: 'smile', look: [0, 0.5] }) + hybridConsole(900, 820, 0.42, 0) + enter(sign('外でも', 1420, 360, { size: 90, fill: C.white }), tl, 0.3, { cx: 1420, cy: 360 }), tl, d, { z0: 1.0, z1: 1.05 })] },
  // 「テレビにつないでも、持ち出しても遊べる。」→ テレビから本体を抜く
  10: { before: [(tl, d) => {
    const k = tw(tl, 0.4, d * 0.8, 0, 1, ease.inOut);
    let s = fill('#ffe9d0') + rect(560, 160, 800, 480, { fill: INK }) + rect(590, 190, 740, 420, { fill: '#5ad1ff' }) + rect(860, 760, 200, 160, { fill: '#555' });
    s += xf(hybridConsole(0, 0, 0.6, 0), { x: 960, y: lerp(760, 380, k) + (k > 0.5 ? 0 : 0), s: lerp(1, 1.4, k), cx: 0, cy: 0 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「Switchは、DSを抜き、」→ 表彰台
  11: { before: [(tl, d) => {
    let s = fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3);
    s += rect(760, 600, 400, 360, { fill: C.yellow }) + rect(360, 720, 400, 240, { fill: '#cfd6de' }) + text('1', 960, 820, { size: 120, font: 'Zen Maru Gothic', weight: 900 }) + text('2', 560, 880, { size: 100, font: 'Zen Maru Gothic', weight: 900 });
    s += xf(dualScreen(0, 0, 0.6, 0.5), { x: 560, y: tw(tl, 0, 0.5, 560, 610, ease.out) }) + xf(hybridConsole(0, 0, 0.55, 0), { x: 960, y: 500, s: popS(tl, 0.6), cx: 0, cy: 0 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
};

// ───── 17 まとめ
const S17 = {
  // 「京都の小さな花札屋から始まり、」→ セピアの花札屋
  0: { before: [(tl, d) => cam(fill(SEPIA) + glow(960, 400, 800, '#fff3d6', 0.3) + townRow(760, 7, -200, 340) + shop(960, 900, 1.25) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a40" opacity="0.15"/>`, tl, d, { z0: 1.1, z1: 1.0 })] },
  // 「だが任天堂は、運に任せてはいなかった。どうすれば人が楽しめるかを、130年間考え抜いてきた。」
  2: { before: [(tl, d) => {
    let s = fill('#2b2630') + glow(960, 500, 600, '#fff', 0.15);
    s += xf(g2(rect(-120, -120, 240, 240, { fill: C.white }) + [[-60, -60], [60, 60], [0, 0], [60, -60], [-60, 60]].map(([x, y]) => ellipse(x, y, 20, 20, { fill: INK, w: 3 })).join(''), 0, 0), { x: 960, y: 540, r: tl < 1 ? tl * 540 : 0, s: popS(tl, 0.1), cx: 0, cy: 0 });
    s += typeText('運まかせ？', 960, 200, tl, { size: 90, color: C.white }) + xf(cross(960, 540, 2.4), { s: popS(tl, d * 0.6), cx: 960, cy: 540 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }], after: [(tl, d, t) => {
    let s = fill('#fdf1dc') + glow(960, 500, 700, '#fff', 0.3);
    s += kid({ x: 400, y: 1060, s: 1.4, hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', blink: blinking(t, 1), arms: P.think }) + pres({ x: 760, y: 1060, s: 1.4, blink: blinking(t, 2), arms: P.think }) +
      worker({ x: 1160, y: 1060, s: 1.4, blink: blinking(t, 5), arms: P.think }) + calmPres({ x: 1540, y: 1060, s: 1.4, blink: blinking(t, 9), arms: P.think });
    [400, 760, 1160, 1540].forEach((x, i) => { s += xf(bulb(x, 380, 0.6, 1), { s: popS(tl, 0.3 + i * 0.25), cx: x, cy: 380 }); });
    s += typeText('130年、考え抜く', 960, 170, tl, { size: 80, color: RED, delay: 1.2 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
  // 「性能ではなく、遊び方で勝負する。」→ 天秤
  3: { before: [(tl, d) => {
    const a = tw(tl, 0.3, 1.3, 0, 14, ease.back);
    let s = fill('#eaf2f6') + glow(960, 500, 700, '#fff', 0.3) + rect(940, 360, 40, 520, { fill: '#8a5a34' }) + rect(760, 860, 400, 40, { fill: '#8a5a34' });
    s += `<g transform="rotate(${a.toFixed(2)} 960 360)">` + line([[460, 360], [1460, 360]], { w: 16, passes: 1 }) + line([[460, 360], [380, 560], [540, 560], [460, 360]], { w: 5, passes: 1 }) + line([[1460, 360], [1380, 560], [1540, 560], [1460, 360]], { w: 5, passes: 1 }) +
      sign('性能', 460, 600, { size: 60, fill: C.white }) + sign('遊び方', 1460, 600, { size: 70, fill: RED, color: C.white }) + '</g>';
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 「…世界中のゲーム開発者が集まる講演で、こう語った。」→ 大きな講演会場
  4: { after: [(tl, d) => {
    let s = fill('#1c2030') + `<polygon points="860,0 1060,0 1260,760 660,760" fill="#fff6d8" opacity="0.15"/>` + rect(500, 720, 920, 60, { fill: '#5a4a3a' });
    s += calmPres({ x: 960, y: 740, s: 0.9, arms: P.raise });
    for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) s += ellipse(80 + i * 160 + (r % 2) * 80, 880 + r * 90, 48, 52, { fill: '#2a2e40', color: '#3a3e50', w: 4 });
    s += typeText('世界中のゲーム開発者', 960, 160, tl, { size: 70, color: C.white });
    return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
  }] },
};

const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
export const EXTRA2 = { '05': S05, '07': S07, '08': S08, '09': S09, '11': S11, '12': S12, '13': S13, '15': S15, '16': S16, '17': S17 };
