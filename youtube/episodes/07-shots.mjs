// 任天堂（本番）の映像：場面ごとの「1行＝1カット」リスト
// ルール：scripts/ART_DIRECTION.md（人物は腰から上、顔アップは決め台詞だけ、背景に色と場所、カメラは止めない）
import { C, text, line, ellipse, rect, poly, arrow } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import {
  taxi, riceBox, extendHand, handheld, tvConsole, bulb, gear, chartDown, cross, sign, shop, hanafuda, playingCard, cardBox,
  townRow, desk, building, plane, train, dpad, bwHandheld, colorHandheld, battery, bubble, rainCloud, trophy, ball, band,
  calculator, lightGun, target, loveMeter, toyRobot, dustyPile, goldSeal, redGoggle, dualScreen, remote, hybridConsole, houseFrame, gate,
} from '../lib/cprops.mjs';
import { shots, cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';
import { withExtras, EXTRA } from './07-extra1.mjs';
import { scenes as v2 } from './06-nintendo-v2.mjs';

const RED = '#d23a33', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', NIGHT = '#23263a', GRAY = '#9aa0a8', DUSK = '#3b2a3a';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], aim: [12, 8, 90, 0] };
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
const calmPres = (o) => kid({ hair: 'side', hairColor: '#4a3a30', glasses: true, shirt: '#7a8fb0', pants: '#3b4a6b', ...o });
// 腰から上（画面の高さの5〜6割）／決め台詞だけ顔のアップ
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const close = (fn, x, o = {}) => fn({ x, y: 1290, s: 3.0, ...o });
const g2 = (inner, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
const kids = (t, xs, y, sc = 0.9, arms = P.cheer) => xs.map((x, i) => kid({ x, y: y - Math.abs(Math.sin(t * 6 + i)) * 12, s: sc, shirt: [C.blue, C.pink, C.green, C.orange, C.yellow][i % 5], hair: i % 2 ? 'side' : 'messy', arms, blink: blinking(t, i), expr: 'smile', flip: x > 960 })).join('');
// 黒い画面に、1文字ずつ年号など
const blackType = (str, tl, size = 120) => fill('#111') + typeText(str, 960, 580, tl, { size, color: C.white, cps: 6, font: 'Yomogi', weight: 400 });
// 上に年号などの見出し（タイプ文字）
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });

// ───── 章タイトル
export const chapterCard = (no, title) => (t) => fill(RED) + glow(960, 540, 700, '#ffffff', 0.12) +
  typeText(no, 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
  typeText(title, 960, 620, t, { size: 120, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 });

export const SHOTS = {
  // 冒頭の3場面は試作（v2）の絵を使う
  '01': (t, c) => shots(t, c, withExtras(v2[0].list(c), EXTRA['01'])),
  '03': (t, c) => shots(t, c, withExtras(v2[2].list(c), EXTRA['03'])),
  '04': (t, c) => shots(t, c, withExtras(v2[3].list(c), EXTRA['04'])),

  // ───── カードの限界と、失敗つづき
  '05': [
    (tl, d) => {
      let s = fill('#cfe6f5') + glow(960, 300, 900, '#fff', 0.3);
      [[200, 220, 700], [480, 240, 820], [1460, 240, 760], [1740, 220, 640]].forEach(([x, w, h]) => { s += building(x, 900, w, h); });
      s += building(960, 900, 220, 260, '#d8b080') + text('トランプ会社', 960, 620, { size: 44, font: 'Zen Maru Gothic', weight: 900 });
      s += plane(tw(tl, 0, d, -300, 2300), 180, 0.8);
      return cam(s, tl, d, { z0: 1.0, z1: 1.35, y0: 540, y1: 700 });
    },
    (tl, d, t) => cam(fill('#cfe6f5') + building(700, 1000, 300, 420, '#d8b080') + text('世界一の', 700, 470, { size: 50, font: 'Zen Maru Gothic', weight: 900 }) + text('トランプ会社', 700, 535, { size: 46, font: 'Zen Maru Gothic', weight: 900 }) +
      mid(pres, 1450, { expr: 'wow', blink: blinking(t, 3), look: [-1, -0.5], flip: true }) + enter(bubble('この程度…？', 1150, 220, { size: 60 }), tl, 0.2, { cx: 1150, cy: 220 }), tl, d, { z0: 1.0, z1: 1.08, x0: 1000 }),
    (tl, d) => {
      let s = fill(CREAM) + rect(300, 300, 1320, 40, { fill: INK });
      s += text('これ以上は無理', 960, 200, { size: 56, color: RED, font: 'Zen Maru Gothic', weight: 900 });
      const h = tw(tl, 0, d * 0.7, 0, 1, ease.out);
      [0, 1, 2].forEach((i) => { const top = lerp(900, 520, h); s += rect(560 + i * 300, top, 200, 900 - top, { fill: [C.red, C.green, C.yellow][i] }) + hanafuda(660 + i * 300, top - 95, 0.7, 0, i); });
      s += xf(text('ゴツン', 1520, 420, { size: 90, color: INK, font: 'Zen Maru Gothic', weight: 900, rot: 10 }), { s: popS(tl, d * 0.7), cx: 1500, cy: 350 });
      return cam(s, tl, d, { z0: 1.05, z1: 1.0, x0: shake(tl, d * 0.7, 0.4, 12) + 960 });
    },
    (tl, d) => {
      let s = fill('#e8e2d4') + head('1960年代', tl);
      [(x, y) => taxi(x, y, 0.7), (x, y) => riceBox(x, y, 0.7), (x, y) => big('？', x, y + 60, 180, C.blue), (x, y) => big('？', x, y + 60, 180, C.green), (x, y) => big('？', x, y + 60, 180, RED)]
        .forEach((f, i) => { s += xf(f(0, 0), { x: 300 + i * 330, y: 600 + bob(tl, 10, 0.8, i * 0.2), s: popS(tl, 0.4 + i * 0.3), cx: 0, cy: 0 }); });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
    (tl, d) => {
      let s = fill('#dfe8f0') + rect(-200, 820, 2400, 400, { fill: '#9a9690', color: null });
      s += taxi(tw(tl, 0, d * 0.5, -500, 700, ease.out), 780, 1.5, tl < d * 0.5 ? tl * 500 : 0);
      s += xf(riceBox(1480, 640, 1.3), { y: tw(tl, d * 0.45, d * 0.65, -1000, 0, ease.back) });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d, t) => cam(fill(RED) + glow(800, 500, 600, '#fff', 0.18) + mid(pres, 760, { arms: P.hips, expr: 'smile', blink: blinking(t, 2) }) +
      xf(big('大胆！', 1420, 520, 200, C.yellow, { stroke: INK }), { s: popS(tl, 0.3), cx: 1420, cy: 450, r: -6 }), tl, d, { z0: 1.0, z1: 1.08, x0: 900 }),
    (tl, d) => {
      let s = fill('#e8e2d4');
      for (let i = 0; i < 12; i++) s += xf(big('？', 0, 60, 120, [C.blue, C.green, RED, C.orange][i % 4]), { x: 200 + (i % 6) * 300, y: 330 + Math.floor(i / 6) * 380 + bob(tl, 14, 0.8, i * 0.2), s: popS(tl, i * 0.12), cx: 0, cy: 0 });
      return cam(s, tl, d, { z0: 1.1, z1: 1.0 });
    },
    (tl, d) => {
      let s = fill(GRAY) + taxi(620, 760, 1.2) + riceBox(1380, 660, 1.1);
      s += xf(cross(620, 680, 1.8), { s: popS(tl, 0.3), cx: 620, cy: 680 }) + xf(cross(1380, 640, 1.8), { s: popS(tl, 0.7), cx: 1380, cy: 640 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.04, x0: 960 + shake(tl, 0.3, 0.4, 16) + shake(tl, 0.7, 0.4, 16) });
    },
    (tl, d) => {
      let s = fill('#1e1e26') + glow(560, 540, 420, '#fff2c8', 0.4) + hanafuda(560, 560, 2.2, -5, 1);
      s += xf(taxi(0, 0, 0.8) + riceBox(420, -60, 0.6), { x: 1300, y: 640, o: 0.45 });
      s += typeText('得意なこと', 560, 830, tl, { size: 64, color: C.yellow, delay: 0.3 }) + typeText('関係ないこと', 1450, 830, tl, { size: 56, color: '#888', delay: 1.0 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 900 });
    },
    (tl, d) => cam(fill(CREAM) + xf(chartDown(0, 0, 2.2, tw(tl, 0.2, d * 0.9, 0, 1, (k) => k)), { x: 960, y: 560 }) + head('トランプの売れ行き', tl, RED), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d) => {
      let s = fill('#2a2f3a') + glow(960, 540, 600, RED, 0.18);
      s += xf(poly([[-60, -260], [60, -260], [60, 80], [150, 80], [0, 260], [-150, 80], [-60, 80]], { fill: RED }), { x: 960, y: tw(tl, 0, d * 0.6, 420, 560, ease.out) });
      s += typeText('株価', 960, 180, tl, { size: 80, color: C.white });
      return cam(s, tl, d, { z0: 1.0, z1: 1.08, x0: 960 + shake(tl, d * 0.6, 0.4, 14) });
    },
    (tl, d, t) => cam(fill('#5a5f6a') + rainCloud(820, 200, tl, 1.6) + mid(pres, 820, { expr: 'worry', sweat: true, arms: P.shrug, blink: blinking(t, 4), look: [1, 0.3], tilt: Math.sin(tl * 2) * 3 }), tl, d, { z0: 1.0, z1: 1.1, x0: 860 }),
    (tl, d) => {
      let s = fill('#15151c') + gear(300, 260, 120, tl * 20, '#3a3a40') + gear(1650, 820, 160, -tl * 15, '#3a3a40');
      const k = tw(tl, 0.2, d * 0.7, 0, 1);
      s += `<ellipse cx="960" cy="640" rx="${120 + k * 380}" ry="${90 + k * 260}" fill="#fff6d0" opacity="${0.15 + k * 0.15}"/>`;
      s += xf(extendHand(0, 0, 1.3, 0.5 + 0.5 * Math.sin(tl * 2.4)), { x: 700, y: 660, o: clamp(k * 1.5) });
      return cam(s, tl, d, { z0: 1.15, z1: 1.0 });
    },
  ],

  // ───── ひまつぶしのおもちゃ
  '07': [
    (tl, d, t) => cam(fill('#d6e4dc') + gear(1650, 200, 120, tl * 40) + gear(1820, 340, 80, -tl * 55, '#8e8a84') + rect(-200, 880, 2400, 400, { fill: '#8f9a92', color: null }) +
      mid(worker, 700, { blink: blinking(t, 5), look: [1, 0], arms: P.idle }) + typeText('横井軍平', 1350, 520, tl, { size: 110, color: INK, delay: d * 0.55, cps: 8 }), tl, d, { z0: 1.0, z1: 1.08, x0: 960 }),
    (tl, d, t) => cam(fill('#d6e4dc') + rect(1000, 300, 600, 600, { fill: '#a8a29a' }) + gear(1300, 600, 140, tl * 90) +
      mid(worker, 640, { blink: blinking(t, 5), arms: mix(P.idle, [12, 8, 90, 20], (Math.sin(tl * 6) + 1) / 2), look: [1, 0] }) + enter(sign('点検係', 640, 220, { size: 70, fill: C.white }), tl, 0.3, { cx: 640, cy: 220 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
    (tl, d, t) => {
      let s = fill('#e4ecd8') + ellipse(1500, 300, 150, 150, { fill: C.white }) + line([[1500, 300], [1500 + Math.sin(tl * 3) * 110, 300 - Math.cos(tl * 3) * 110]], { w: 10, passes: 1 }) + line([[1500, 300], [1560, 300]], { w: 12, passes: 1 });
      s += mid(worker, 760, { blink: blinking(t, 5), arms: P.think, look: [1, -0.5], tilt: 6 }) + enter(bubble('ひま…', 1100, 260, { size: 70 }), tl, d * 0.5, { cx: 1100, cy: 260 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
    },
    (tl, d, t) => {
      const ext = 0.5 - 0.5 * Math.cos(tl * 2.4);
      return cam(fill('#d6e4dc') + gear(1700, 200, 100, tl * 40) + mid(worker, 600, { arms: [12, 8, 100, -50], blink: blinking(t, 5), look: [1, 0], tilt: Math.sin(tl * 2.4) * 4 }) +
        extendHand(830, 860, 1.3, ext), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
    },
    (tl, d) => {
      const ext = 0.5 - 0.5 * Math.cos(tl * 2.2);
      const tip = 200 + 6 * (22 + 48 * ext) * 2.4 + 200;
      return cam(fill(CREAM) + glow(960, 540, 800, C.yellow, 0.2) + extendHand(200, 560, 2.4, ext) + ball(ext > 0.85 ? tip : 1700, ext > 0.85 ? 560 : 640 - Math.abs(Math.sin(tl * 3)) * 80, 80, RED), tl, d, { z0: 1.05, z1: 1.0 });
    },
    (tl, d, t) => cam(fill('#d6e4dc') + mid(worker, 520, { arms: [12, 8, 100, -50], blink: blinking(t, 5), look: [1, 0], expr: 'wow' }) + extendHand(750, 860, 1.0, 0.4) +
      enter(mid(pres, 1450, { flip: true, look: [-1, 0], blink: blinking(t, 6), arms: P.idle }), tl, 0, { how: 'right', dist: 800 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 決め台詞：顔のアップ
    (tl, d, t) => cam(fill(RED) + glow(900, 500, 700, '#fff', 0.2) + close(pres, 760, { arms: P.point, expr: 'smile', blink: blinking(t, 6), look: [1, 0] }) +
      enter(bubble('それを商品にしろ', 1420, 300, { size: 64 }), tl, 0.1, { cx: 1420, cy: 300 }), tl, d, { z0: 1.0, z1: 1.12, x0: 960, y0: 540, y1: 480 }),
    (tl, d) => {
      let s = fill('#fff2c8') + glow(960, 540, 800, C.yellow, 0.3) + head('1966年', tl);
      const n = Math.floor(clamp(tl / (d * 0.8)) * 15);
      for (let i = 0; i < n; i++) s += g2(rect(-120, -80, 240, 160, { fill: [C.sky, C.pink, C.yellow][i % 3] }) + extendHand(-90, 0, 0.35, 0.3), 330 + (i % 5) * 320, 900 - Math.floor(i / 5) * 190);
      s += enter(sign('大ヒット！', 1500, 260, { size: 90, fill: RED, color: C.white, rot: -5 }), tl, d * 0.5, { cx: 1500, cy: 260 });
      return cam(s, tl, d, { z0: 1.12, z1: 1.0, y0: 680, y1: 540 });
    },
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="300" y="380" width="1320" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
      big(countUp(1000000, tl, 1.6), 960, 600, 170, C.yellow, { stroke: INK }) + typeText('個以上？', 960, 680, tl, { size: 60, color: C.white, delay: 1.4 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d, t) => {
      let s = fill('#fbf3df') + glow(960, 500, 700, '#fff', 0.3) + mid(worker, 960, { arms: P.cheer, blink: blinking(t, 5) });
      [(x, y) => extendHand(x - 90, y, 0.45, 0.6), (x, y) => bulb(x, y, 0.55, 1), (x, y) => lightGun(x, y, 0.5), (x, y) => loveMeter(x, y, 0.45, 0.7)].forEach((f, i) => {
        const a = tl * 0.9 + i * 1.57; s += xf(f(960 + Math.cos(a) * 620, 460 + Math.sin(a) * 260), { s: popS(tl, i * 0.3), cx: 960, cy: 460 });
      });
      s += enter(sign('開発部門', 960, 120, { size: 64, fill: C.white }), tl, 0.2, { cx: 960, cy: 120 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => {
      const k = tw(tl, 0.4, d * 0.6, 0, 1, ease.inOut);
      let s = fill(CREAM) + glow(960, 540, 700, RED, 0.12);
      s += xf(hanafuda(0, 0, 2.0, -6, 1), { x: 560, y: 560, s: 1 - k * 0.3, cx: 0, cy: 0 }) + arrow(800, 560, lerp(800, 1100, k), 560, { w: 16, head: 50 });
      s += xf(extendHand(0, 0, 1.0, 0.6), { x: 1180, y: 560, s: popS(tl, d * 0.55), cx: 200, cy: 0 });
      s += typeText('カードの会社', 560, 840, tl, { size: 56, color: INK }) + typeText('おもちゃの会社', 1450, 840, tl, { size: 56, color: RED, delay: d * 0.55 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
  ],

  // ───── 枯れた技術の水平思考
  '08': [
    (tl, d, t) => cam(fill('#e8eedc') + mid(worker, 800, { arms: P.think, blink: blinking(t, 5), look: [1, -0.5] }) + xf(bulb(1350, 340, 1.2, clamp((tl - d * 0.5) * 3)), { s: popS(tl, d * 0.5), cx: 1350, cy: 300 }), tl, d, { z0: 1.0, z1: 1.08, x0: 1000 }),
    (tl, d) => cam(fill('#2f4a3a') + glow(960, 500, 700, '#fff', 0.15) + typeText('枯れた技術の', 960, 430, tl, { size: 130, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
      xf(big('水平思考', 960, 700, 220, C.yellow, { stroke: INK }), { s: popS(tl, 0.8), cx: 960, cy: 620 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => {
      let s = fill('#efe7d6') + rect(200, 700, 1520, 60, { fill: '#a07a50' });
      [(x) => calculator(x, 560, 0.7), (x) => bulb(x, 600, 0.7, 0), (x) => gear(x, 600, 90, tl * 20)].forEach((f, i) => { s += xf(f(500 + i * 460), { s: popS(tl, i * 0.25), cx: 500 + i * 460, cy: 600 }); });
      s += enter(sign('どこにでもある・安い', 960, 200, { size: 70, fill: C.yellow }), tl, d * 0.5, { cx: 960, cy: 200 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
    (tl, d) => {
      const k = tw(tl, 0.3, d * 0.75, 0, 1, ease.inOut);
      let s = fill('#efe7d6');
      s += xf(calculator(0, 0, 0.6) + g2(bulb(0, 0, 0.5, 0), 160, 30) + gear(-150, 40, 60, tl * 30), { x: lerp(420, 1250, k), y: 600, s: 1 - k * 0.6 });
      s += arrow(560, 420, lerp(560, 1200, k), 420, { w: 16, head: 50 }) + xf(text('横へずらす', 0, 0, { size: 60, font: 'Zen Maru Gothic', weight: 900 }), { x: 880, y: 360 });
      s += xf(handheld(1480, 640, 0.9, tl % 1), { s: popS(tl, d * 0.75), cx: 1480, cy: 640 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d) => {
      let s = fill('#1d2433') + glow(960, 520, 600, C.sky, 0.25) + xf(dualScreen(0, 0, 1.3, 0.5), { x: 960, y: 560 });
      s += enter(sign('￥￥￥', 1450, 300, { size: 90, fill: C.yellow }), tl, 0.4, { cx: 1450, cy: 300 });
      s += xf(line([[860, 420], [920, 500], [880, 580], [960, 680]], { w: 10, color: C.white, passes: 1 }), { o: tl > d * 0.6 ? 1 : 0 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.08, x0: 960 + shake(tl, d * 0.6, 0.3, 12) });
    },
    (tl, d) => {
      let s = fill('#f3ecdf');
      const n = Math.floor(clamp(tl / (d * 0.8)) * 18);
      for (let i = 0; i < n; i++) s += handheld(240 + (i % 6) * 290, 280 + Math.floor(i / 6) * 260, 0.45, (tl + i) % 1);
      s += enter(sign('安い・たくさん作れる', 960, 980, { size: 60, fill: C.yellow }), tl, d * 0.5, { cx: 960, cy: 980 }).replace(/translate\(960 980\)/, 'translate(960 800)');
      return cam(s, tl, d, { z0: 1.1, z1: 1.0 });
    },
    (tl, d, t) => {
      const fire = tl % 2.2;
      let s = fill('#e7efe0') + head('1970年　光線銃', tl);
      s += mid(kid, 420, { hair: 'messy', shirt: C.blue, arms: P.aim, blink: blinking(t, 7), look: [1, 0] }) + lightGun(800, 780, 1.0, fire < 0.2 ? 1 - fire * 5 : 0);
      if (fire < 0.3) s += line([[960, 760], [1420, 560]], { w: 7, color: C.yellow, passes: 1 });
      s += target(1500, 560, 1.4, fire > 0.25 && fire < 1.6 ? 1 : 0) + rect(1410, 690, 180, 70, { fill: '#2f4a7a', w: 5 }) + text('太陽電池', 1500, 738, { size: 34, color: C.white, font: 'Zen Maru Gothic', weight: 700 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 960 });
    },
    (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.2) + lightGun(960, 560, 1.6, 0) +
      enter(sign('安い！', 560, 260, { size: 100, fill: C.yellow, rot: -5 }), tl, 0.3, { cx: 560, cy: 260 }) + enter(sign('こわれにくい！', 1360, 740, { size: 90, fill: C.white, rot: 4 }), tl, d * 0.5, { cx: 1360, cy: 740 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d, t) => {
      const v = 0.5 + 0.45 * Math.sin(tl * 2.2);
      return cam(fill('#fde6ea') + glow(960, 500, 600, '#fff', 0.3) + mid(kid, 560, { hair: 'messy', shirt: C.blue, arms: [12, 8, 70, -50], blink: blinking(t, 1), tilt: 5 }) +
        mid(kid, 1360, { hair: 'side', shirt: C.pink, arms: [70, -50, 12, 8], blink: blinking(t, 2), tilt: -5, flip: true }) + loveMeter(960, 420, 1.0, v) + typeText('ラブテスター', 960, 150, tl, { size: 70, color: RED }), tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => {
      let s = fill('#2c2440') + glow(960, 500, 700, C.pink, 0.2) + loveMeter(960, 560, 1.5, 0.5 + 0.45 * Math.sin(tl * 3));
      for (let i = 0; i < 24; i++) { const k = (tl * 0.4 + i * 0.137) % 1; s += rect(100 + (i * 83) % 1720, lerp(-40, 1100, k), 22, 34, { fill: [C.yellow, C.pink, C.sky, C.green][i % 4], color: null }); }
      s += enter(bubble('電気をはかってるだけ', 1450, 220, { size: 46 }), tl, 0.3, { cx: 1450, cy: 220 }) + enter(sign('パーティーの人気者', 960, 940, { size: 64, fill: C.yellow }), tl, d * 0.55, { cx: 960, cy: 940 }).replace(/translate\(960 940\)/, 'translate(960 790)');
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.18) + g2(extendHand(0, 0, 0.8, 0.6), 160, 560) + lightGun(1000, 560, 0.9) + loveMeter(1560, 560, 0.8, 0.8) +
      typeText('これが任天堂の武器', 960, 220, tl, { size: 90, color: C.white }), tl, d, { z0: 1.06, z1: 1.0 }),
  ],

  // ───── 新幹線の電卓
  '09': [
    (tl, d, t) => {
      let s = fill('#e6eef6');
      for (let i = 0; i < 4; i++) {
        const wx = 160 + i * 440;
        s += rect(wx, 130, 340, 260, { fill: C.sky, w: 6 });
        const mx = ((wx + 360 - tl * 900) % 440 + 440) % 440;
        s += `<clipPath id="w9${i}"><rect x="${wx}" y="130" width="340" height="260"/></clipPath><g clip-path="url(#w9${i})">${poly([[wx + mx - 120, 390], [wx + mx, 270], [wx + mx + 120, 390]], { fill: C.green, color: null })}${poly([[wx + mx - 330, 390], [wx + mx - 230, 300], [wx + mx - 130, 390]], { fill: '#6fae7a', color: null })}</g>`;
      }
      s += rect(-200, 780, 2400, 400, { fill: '#b9a58a', color: null });
      s += mid(salary, 720, { blink: blinking(t, 7), arms: P.hold, look: [0, 0.6], tilt: Math.sin(tl * 1.5) * 2 }) + calculator(720, 830, 0.42);
      s += mid(worker, 1400, { flip: true, look: [-1, 0], blink: blinking(t, 5), arms: P.idle });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
    },
    (tl, d, t) => cam(fill('#fff2c8') + glow(1000, 400, 600, C.yellow, 0.3) + mid(worker, 760, { arms: P.think, blink: blinking(t, 5), look: [1, -0.4] }) +
      xf(bulb(1300, 330, 1.0, 1), { s: popS(tl, 0.2), cx: 1300, cy: 300 }) + enter(bubble('大人も遊ぶ？', 1450, 700, { size: 60 }), tl, 0.6, { cx: 1450, cy: 700 }), tl, d, { z0: 1.0, z1: 1.08, x0: 1000 }),
    (tl, d) => {
      const m = tw(tl, 0.3, d * 0.7, 0, 1, ease.inOut);
      let s = fill(CREAM) + glow(960, 540, 700, RED, 0.12) + head('1980年', tl, RED);
      if (m < 1) s += xf(calculator(0, 0, 1.4), { x: 960, y: 580, s: 1 - m, cx: 0, cy: 0 });
      if (m > 0) s += xf(handheld(0, 0, 1.7, tl % 1), { x: 960, y: 580, s: m, cx: 0, cy: 0 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
    (tl, d) => {
      let s = fill('#efe7d6') + calculator(560, 560, 1.2) + xf(handheld(1380, 560, 1.2, tl % 1), { s: 1 });
      s += line([[640, 430], [1320, 470]], { w: 6, color: RED, passes: 1 }) + enter(sign('同じ液晶', 960, 300, { size: 64, fill: C.yellow }), tl, 0.4, { cx: 960, cy: 300 });
      s += `<ellipse cx="560" cy="440" rx="${110 + Math.sin(tl * 4) * 6}" ry="60" fill="none" stroke="${RED}" stroke-width="8"/><ellipse cx="1380" cy="510" rx="${140 + Math.sin(tl * 4) * 6}" ry="90" fill="none" stroke="${RED}" stroke-width="8"/>`;
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d) => {
      let s = fill('#2b2f3a') + glow(960, 540, 700, RED, 0.18);
      for (let i = 0; i < 6; i++) s += xf(calculator(0, 0, 0.55), { x: 260 + i * 280, y: 600 + Math.sin(tl * 8 + i) * 18, r: Math.sin(tl * 6 + i) * 6, s: popS(tl, i * 0.12), cx: 0, cy: 0 });
      s += typeText('電卓戦争', 960, 200, tl, { size: 110, color: C.yellow });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 960 + Math.sin(tl * 20) * 4 });
    },
    (tl, d) => {
      let s = fill(CREAM) + rect(560, 360, 800, 360, { fill: '#c8d4ae' }) + text('液晶', 960, 600, { size: 140, font: 'Zen Maru Gothic', weight: 900 });
      s += enter(sign('￥ ↓', 1500, 280, { size: 90, fill: C.yellow, rot: 6 }), tl, 0.3, { cx: 1500, cy: 280 }) + typeText('まさに「枯れた技術」', 960, 920, tl, { size: 64, color: RED, delay: d * 0.45 }).replace('y="920"', 'y="880"');
      return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
    },
    (tl, d) => {
      let s = fill('#d9ecf7');
      s += `<circle cx="960" cy="560" r="330" fill="${C.sky}" stroke="${INK}" stroke-width="8"/>` + poly([[760, 420], [880, 380], [940, 470], [860, 560], [760, 520]], { fill: C.green }) + poly([[1020, 600], [1160, 560], [1200, 680], [1080, 740]], { fill: C.green });
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + tl * 0.5; s += xf(handheld(0, 0, 0.3, (tl + i) % 1), { x: 960 + Math.cos(a) * 520, y: 560 + Math.sin(a) * 380, s: popS(tl, i * 0.1), cx: 0, cy: 0 }); }
      return cam(s, tl, d, { z0: 1.12, z1: 1.0 });
    },
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="300" y="380" width="1320" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
      big(countUp(40000000, tl, 1.6), 960, 600, 170, C.yellow, { stroke: INK }) + typeText('台以上', 960, 680, tl, { size: 60, color: C.white, delay: 1.4 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#e8eaf6') + glow(960, 540, 600, C.yellow, 0.25) + xf(dpad(0, 0, 3.2), { x: 960, y: 560, r: Math.sin(tl * 2) * 6, s: popS(tl, 0.1), cx: 0, cy: 0 }) +
      typeText('十字キー', 960, 180, tl, { size: 100, color: RED, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.12 }),
    (tl, d) => {
      let s = fill('#1d2a3a') + glow(960, 540, 700, '#fff', 0.15);
      s += xf(dpad(0, 0, 1.4), { x: lerp(960, 420, tw(tl, 0.2, 1.2, 0, 1, ease.inOut)), y: 540 });
      s += xf(`<circle cx="0" cy="0" r="300" fill="${C.sky}" stroke="${C.white}" stroke-width="8"/>`, { x: 1300, y: 540, s: popS(tl, 1.0), cx: 0, cy: 0 });
      s += typeText('世界のゲームのルールへ', 1300, 560, tl, { size: 46, color: INK, delay: 1.4 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.08 });
    },
  ],

  // ───── ファミコン
  '11': [
    (tl, d) => cam(fill('#fdf0d8') + glow(960, 500, 700, RED, 0.12) + head('1983年', tl, RED) + xf(tvConsole(960, 640, 1.1, Math.max(0, Math.sin(tl * 5))), { s: popS(tl, 0.3), cx: 960, cy: 700 }), tl, d, { z0: 1.0, z1: 1.06, y0: 560 }),
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="360" y="380" width="1200" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
      big(countUp(14800, tl, 1.3) + '円', 960, 600, 180, C.yellow, { stroke: INK }) + typeText('おもちゃとして手が届く値段', 960, 860, tl, { size: 60, color: C.white, delay: 1.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#e8eaf6') + rect(460, 320, 1000, 460, { fill: C.white }) + xf(dpad(0, 0, 1.6), { x: 760, y: 560 }) + ellipse(1200, 520, 50, 50, { fill: RED }) + ellipse(1330, 600, 50, 50, { fill: RED }) +
      `<ellipse cx="760" cy="560" rx="${200 + Math.sin(tl * 5) * 10}" ry="${200 + Math.sin(tl * 5) * 10}" fill="none" stroke="${C.yellow}" stroke-width="12"/>`, tl, d, { z0: 1.0, z1: 1.15, x0: 960, x1: 800 }),
    (tl, d) => cam(fill('#e2dccd') + [0, 1, 2].map((i) => xf(tvConsole(0, 0, 0.55, 0), { x: 380 + i * 580, y: 760, o: 0.85, s: popS(tl, i * 0.3), cx: 0, cy: -150 })).join('') + head('ほかのゲーム機', tl), tl, d, { z0: 1.05, z1: 1.0 }),
    (tl, d) => cam(fill('#1d1d2a') + glow(960, 500, 700, C.yellow, 0.25) + xf(tvConsole(0, 0, 1.3, Math.max(0, Math.sin(tl * 6))), { x: 960, y: 800 }) +
      enter(sign('色あざやか！', 1550, 220, { size: 70, fill: C.yellow, rot: 5 }), tl, 0.4, { cx: 1550, cy: 220 }), tl, d, { z0: 1.0, z1: 1.08, y0: 560 }),
    (tl, d) => {
      let s = fill('#fdf0d8');
      const n = Math.floor(clamp(tl / (d * 0.8)) * 8);
      for (let i = 0; i < n; i++) s += g2(houseFrame(0, 0, 0.5) + g2(tvConsole(0, 0, 0.25, Math.max(0, Math.sin(tl * 5 + i))), 0, -30), 220 + (i % 4) * 490, 520 + Math.floor(i / 4) * 420);
      return cam(s, tl, d, { z0: 1.15, z1: 1.0 });
    },
    (tl, d) => cam(fill(RED) + glow(960, 500, 800, '#fff', 0.2) + typeText('1985年', 960, 260, tl, { size: 80, color: C.white }) +
      xf(big('スーパーマリオブラザーズ', 960, 560, 110, C.yellow, { stroke: INK }), { s: popS(tl, 0.6), cx: 960, cy: 520 }) + enter(sign('社会現象', 960, 820, { size: 80, fill: C.white }), tl, d * 0.55, { cx: 960, cy: 820 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d, t) => cam(fill('#ffe9d0') + glow(960, 420, 700, '#fff', 0.35) + rect(-200, 820, 2400, 400, { fill: '#c88a5a', color: null }) + tvConsole(960, 700, 0.9, Math.max(0, Math.sin(tl * 5))) +
      kids(t, [260, 520, 1400, 1660], 1080, 1.2, P.cheer), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── アメリカでの品質の番人
  '12': [
    (tl, d) => cam(fill('#d6e6f5') + glow(960, 300, 900, '#fff', 0.25) + plane(tw(tl, 0, d, -300, 2300), 260, 1.0) + typeText('アメリカ', 960, 700, tl, { size: 130, color: INK, delay: 0.4, font: 'Yomogi', weight: 400 }) +
      xf(rect(1300, 300, 60, 700, { fill: GRAY }), { s: popS(tl, d * 0.55), cx: 1330, cy: 650 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#3a3a44') + glow(960, 560, 600, '#ffcf8a', 0.15) + dustyPile(960, 900, 1.6) + typeText('アタリショック', 960, 200, tl, { size: 100, color: C.white, delay: d * 0.55 }), tl, d, { z0: 1.0, z1: 1.08, y0: 600 }),
    (tl, d, t) => cam(fill('#e2e6ee') + dustyPile(560, 900, 0.9) + mid(salary, 1300, { flip: true, look: [-1, 0], arms: [12, 8, 60, 60], blink: blinking(t, 8), expr: 'angry', tilt: Math.sin(tl * 9) * 7 }) +
      enter(bubble('ゲーム機？いらない！', 900, 230, { size: 60 }), tl, 0.3, { cx: 900, cy: 230 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1050 }),
    (tl, d) => cam(fill('#fff2c8') + rect(200, 860, 1520, 50, { fill: '#b07a46' }) + tvConsole(700, 760, 0.85, 0) + xf(toyRobot(1300, 720, 1.4, Math.sin(tl * 3) * 6), { s: popS(tl, 0.3), cx: 1300, cy: 720 }) +
      enter(sign('おもちゃ売り場', 960, 180, { size: 80, fill: RED, color: C.white }), tl, d * 0.4, { cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill(CREAM) + xf(sign('ゲーム機', 960, 380, { size: 90, fill: C.white }) + cross(960, 380, 1.4), { s: popS(tl, 0.1), cx: 960, cy: 380 }) +
      typeText('Entertainment System', 960, 700, tl, { size: 90, color: RED, delay: 0.8, cps: 14 }) + typeText('家庭の娯楽の機械', 960, 840, tl, { size: 56, color: INK, delay: 2.4 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => {
      let s = fill('#f3ecdf');
      for (let i = 0; i < 6; i++) s += xf(rect(-80, -110, 160, 220, { fill: [C.sky, C.pink, C.yellow, C.green, C.orange, C.blue][i] }) + goldSeal(40, -60, 0.5, tl * 30), { x: 300 + i * 264, y: 520, s: popS(tl, i * 0.2), cx: 0, cy: 0 });
      s += enter(sign('1社あたりの本数に制限', 960, 880, { size: 60, fill: C.white }), tl, d * 0.6, { cx: 960, cy: 880 });
      return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
    },
    (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + xf(goldSeal(0, 0, 2.4, tl * 20), { x: 960, y: 440, s: popS(tl, 0.1), cx: 0, cy: 0 }) +
      typeText('品質の番人', 960, 860, tl, { size: 100, color: RED, delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d, t) => cam(fill('#d6e6f5') + glow(960, 400, 700, '#fff', 0.3) + tvConsole(960, 680, 0.8, Math.max(0, Math.sin(tl * 5))) + kids(t, [260, 520, 1400, 1660], 1080, 1.2) +
      typeText('ゲームといえば任天堂', 960, 160, tl, { size: 90, color: RED }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── 白黒のゲームボーイ
  '13': [
    (tl, d) => cam(fill('#f1ece2') + glow(960, 540, 700, '#fff', 0.3) + head('1989年', tl) + xf(bwHandheld(0, 0, 1.4, tl % 1, 0), { x: 960, y: 600, s: popS(tl, 0.2), cx: 0, cy: 0 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => cam(fill('#f1ece2') + xf(bwHandheld(0, 0, 2.6, tl % 1, 0), { x: 960, y: 900 }) + typeText('白黒', 1500, 300, tl, { size: 120, color: INK, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.1, y0: 500, y1: 420 }),
    (tl, d) => cam(fill('#e8eaf2') + bwHandheld(500, 580, 1.0, tl % 1) + xf(colorHandheld(0, 0, 1.0, 0), { x: 1380, y: 560, s: popS(tl, 0.3), cx: 0, cy: 0 }) +
      typeText('ゲームギア（セガ）', 1380, 260, tl, { size: 60, color: INK, delay: 0.4 }) + typeText('カラー', 1380, 820, tl, { size: 80, color: C.blue, delay: d * 0.55 }), tl, d, { z0: 1.0, z1: 1.04, x0: 1000 }),
    (tl, d) => cam(fill('#e8eaf2') + xf(colorHandheld(0, 0, 1.6, 0), { x: 960, y: 560 }) + enter(sign('性能は上', 960, 200, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 960, cy: 200 }), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d) => {
      const lv = tw(tl, 0.3, d * 0.8, 1, 0, (k) => k);
      return cam(fill('#2b2f3a') + glow(960, 500, 600, C.blue, 0.2) + xf(colorHandheld(0, 0, 1.3, lv < 0.05 ? 1 : 0), { x: 960, y: 480 }) + battery(960, 860, 1.6, lv) +
        typeText('電池6本で数時間', 960, 160, tl, { size: 70, color: C.white, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, d * 0.8, 0.4, 12) });
    },
    (tl, d) => cam(fill('#e7f1e2') + glow(960, 500, 600, C.green, 0.2) + xf(bwHandheld(0, 0, 1.2, tl % 1, 0), { x: 960, y: 460 }) + battery(960, 880, 1.6, 1) +
      typeText('電池4本で約30時間', 960, 160, tl, { size: 70, color: INK, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#f3ecdf') + bwHandheld(500, 480, 0.8, tl % 1) + colorHandheld(1400, 460, 0.8) +
      xf(big(countUp(12500, tl, 1.0) + '円', 500, 800, 110, C.green), { s: popS(tl, 0.2), cx: 500, cy: 780 }) + xf(big(countUp(19800, tl - 0.8, 1.0) + '円', 1400, 800, 110, RED), { s: popS(tl, 0.8), cx: 1400, cy: 780 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => {
      let s = fill('#1d2433') + glow(960, 540, 600, '#fff', 0.15) + xf(bwHandheld(0, 0, 1.3, 0, 0), { x: 760, y: 560 });
      for (let i = 0; i < 8; i++) s += xf(`<rect x="-34" y="-34" width="68" height="68" fill="${[RED, C.blue, C.green, C.yellow][i % 4]}" stroke="${INK}" stroke-width="5"/>`, { x: 1250 + (i % 4) * 80, y: tw(tl, i * 0.25, i * 0.25 + 0.6, 100, 760 - Math.floor(i / 4) * 80, (k) => k), s: tl > i * 0.25 ? 1 : 0 });
      s += typeText('テトリス', 1370, 180, tl, { size: 100, color: C.yellow });
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 400, 700, C.yellow, 0.35) + xf(bwHandheld(0, 0, 1.1, tl % 1), { x: 960, y: 640 }) + xf(trophy(0, 0, 1.0), { x: 960, y: 220 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }) +
      kids(t, [260, 520, 1400, 1660], 1080, 1.1), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.15) + `<rect x="300" y="380" width="1320" height="320" rx="40" fill="${INK}" opacity="0.85"/>` +
      big(countUp(100000000, tl, 1.6), 960, 600, 160, C.yellow, { stroke: INK }) + typeText('台以上', 960, 680, tl, { size: 60, color: C.white, delay: 1.4 }), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#2f4a3a') + glow(960, 500, 700, '#fff', 0.15) + xf(big('枯れた技術の勝ち', 960, 600, 150, C.yellow, { stroke: INK }), { s: popS(tl, 0.2), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d) => {
      const k = clamp(tl / d);
      return cam(fill(k > 0.5 ? '#2a2630' : '#5a5560') + glow(960, 500, 500, '#fff', 0.15 * (1 - k)) + xf(bwHandheld(0, 0, 1.2, 0, 0), { x: 960, y: 560, o: 1 - k * 0.6 }), tl, d, { z0: 1.0, z1: 1.15 });
    },
  ],

  // ───── 生みの親の挫折
  '15': [
    (tl, d) => cam(fill('#3a2630') + glow(960, 500, 600, RED, 0.2) + head('1995年', tl, C.white) + xf(redGoggle(960, 640, 1.8), { s: popS(tl, 0.3), cx: 960, cy: 600 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => cam(fill('#1a1014') + `<ellipse cx="960" cy="540" rx="${600 + Math.sin(tl * 3) * 30}" ry="380" fill="#ff3b30" opacity="0.18"/>` + redGoggle(960, 600, 2.2) +
      typeText('赤い光で、立体に見える', 960, 180, tl, { size: 70, color: '#ff8a80' }), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d) => cam(fill('#3a2630') + dustyPile(500, 960, 1.1) + dustyPile(1420, 960, 1.1) + redGoggle(960, 560, 1.2) +
      xf(text('売れない…', 960, 300, { size: 110, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.4), cx: 960, cy: 260 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => {
      const walk = tw(tl, 0, d, 0, 1, (k) => k);
      return cam(fill('#f2a65a') + `<circle cx="1520" cy="640" r="200" fill="#f26b3a" opacity="0.8"/>` + rect(-200, 860, 2400, 400, { fill: '#7a5a48', color: null }) + gate(960, 880, 1.6) +
        worker({ x: lerp(760, 1300, walk), y: 1000, s: 1.3 - walk * 0.4, blink: blinking(t, 5), legs: Math.sin(tl * 6), look: [1, 0] }) + typeText('30年以上', 360, 200, tl, { size: 80, color: INK, delay: 0.4 }), tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d) => cam(fill('#f6dcc0') + glow(960, 500, 600, '#fff', 0.3) + xf(bwHandheld(0, 0, 1.0, tl % 1), { x: 960, y: 560, s: tw(tl, 0, 1.2, 1.3, 0.9, ease.out) }) +
      typeText('ゲームボーイポケット', 960, 160, tl, { size: 70, color: INK }) + enter(sign('最後の大きな仕事', 960, 830, { size: 60, fill: C.white }), tl, d * 0.6, { cx: 960, cy: 830 }).replace(/translate\(960 940\)/, 'translate(960 900)'), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill('#e6e0d6') + typeText('「責任を取った」？', 960, 420, tl, { size: 100, color: INK }) + xf(sign('本人も任天堂も否定', 960, 700, { size: 80, fill: C.yellow }), { s: popS(tl, d * 0.5), cx: 960, cy: 700 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => cam(fill('#e4ecd8') + gear(1500, 260, 110, tl * 40) + mid(worker, 820, { arms: P.hold, blink: blinking(t, 5), look: [1, 0.4] }) + gear(960, 860, 70, -tl * 60) + xf(bulb(1300, 520, 0.8, 1), { s: popS(tl, 0.4), cx: 1300, cy: 500 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
    (tl, d) => {
      let s = fill('#1c2030');
      for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${(i * 113) % 1000}" r="${2 + (i % 3)}" fill="#fff" opacity="${0.3 + 0.4 * Math.sin(tl * 2 + i)}"/>`;
      s += xf(text('横井軍平（1941〜1997）', 960, 560, { size: 90, color: C.white, font: 'Zen Maru Gothic', weight: 700 }), { o: tw(tl, 0.4, 2.0, 0, 1) });
      return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
    },
  ],

  // ───── 受け継がれた考え方
  '16': [
    (tl, d) => cam(fill('#eaf2f6') + glow(960, 540, 700, '#fff', 0.3) + xf(bwHandheld(0, 0, 1.6, tl % 1, 0), { x: 960, y: 560 }), tl, d, { z0: 1.1, z1: 1.0 }),
    (tl, d, t) => {
      let s = fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + head('1996年', tl) + xf(bwHandheld(0, 0, 1.2, 0, 0), { x: 960, y: 560 });
      s += xf(ellipse(0, 0, 50, 42, { fill: '#3b4a2c' }) + ellipse(-30, -42, 12, 20, { fill: '#3b4a2c' }) + ellipse(30, -42, 12, 20, { fill: '#3b4a2c' }), { x: 960, y: 420 + bob(tl, 10, 2), s: popS(tl, 0.4), cx: 0, cy: 0 });
      s += kids(t, [260, 520, 1400, 1660], 1080, 1.1) + typeText('ポケットモンスター', 960, 960, tl, { size: 64, color: RED, delay: 0.6 }).replace('y="960"', 'y="260"');
      return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d, t) => cam(fill('#e2eaf4') + glow(700, 500, 600, '#fff', 0.3) + mid(calmPres, 660, { blink: blinking(t, 9), arms: P.point, look: [1, 0] }) + typeText('岩田聡', 1350, 300, tl, { size: 90, color: INK }) +
      enter(bubble('ゲームをする人を増やそう', 1350, 600, { size: 54 }), tl, d * 0.5, { cx: 1350, cy: 600 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
    (tl, d) => cam(fill('#eaf2f6') + xf(dualScreen(0, 0, 1.1, (Math.sin(tl * 3) + 1) / 2), { x: 620, y: 560, s: popS(tl, 0.1), cx: 0, cy: 0 }) + xf(remote(0, 0, 1.4, Math.sin(tl * 4) * 35), { x: 1380, y: 560, s: popS(tl, d * 0.5), cx: 0, cy: 0 }) +
      typeText('DS', 620, 160, tl, { size: 90, color: INK }) + typeText('Wii', 1380, 160, tl, { size: 90, color: INK, delay: d * 0.5 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => cam(fill('#f3ecdf') + mid(salary, 700, { arms: P.hold, blink: blinking(t, 3), look: [0.5, 0.6], jacket: '#2f4a7a', shirt: '#f4efe4' }) + dualScreen(700, 860, 0.5, (Math.sin(tl * 4) + 1) / 2) +
      typeText('計算・音読', 1400, 320, tl, { size: 80, color: INK }) + enter(sign('大人もハマった', 1400, 640, { size: 70, fill: C.yellow }), tl, d * 0.5, { cx: 1400, cy: 640 }), tl, d, { z0: 1.0, z1: 1.05, x0: 1000 }),
    (tl, d) => cam(fill('#eaf2f6') + xf(remote(0, 0, 1.6, Math.sin(tl * 4) * 30), { x: 560, y: 560 }) + enter(sign('性能は低め', 1350, 300, { size: 70, fill: C.white }), tl, 0.2, { cx: 1350, cy: 300 }) +
      xf(big(countUp(100000000, tl - d * 0.4, 1.4), 1350, 640, 100, RED), { s: popS(tl, d * 0.4), cx: 1350, cy: 600 }) + typeText('台以上', 1350, 760, tl, { size: 56, color: INK, delay: d * 0.4 + 1.2 }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => cam(fill('#ffe9d0') + glow(960, 420, 700, '#fff', 0.35) + rect(-200, 840, 2400, 400, { fill: '#c88a5a', color: null }) +
      [[300, '#7a5a3a', 'bald'], [620, C.pink, 'side'], [1300, C.blue, 'messy'], [1620, C.green, 'side']].map(([x, col, h], i) => kid({ x, y: 1080, s: 1.3, shirt: col, hair: h, arms: mix(P.cheer, P.wave, (Math.sin(tl * 5 + i) + 1) / 2), blink: blinking(t, i), mustache: i === 0, flip: x > 960 })).join('') +
      remote(960, 560, 1.0, Math.sin(tl * 6) * 40), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill(GRAY) + xf(tvConsole(0, 0, 1.1, 0), { x: 960, y: 780 }) + xf(cross(960, 480, 1.6), { s: popS(tl, d * 0.5), cx: 960, cy: 480 }) + typeText('Wii U', 960, 160, tl, { size: 90, color: INK }), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d) => cam(fill(RED) + glow(960, 540, 700, '#fff', 0.18) + xf(big('また「遊び方」で勝負', 960, 600, 120, C.white, { stroke: INK }), { s: popS(tl, 0.2), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
    (tl, d) => cam(fill('#e2eef6') + head('2017年', tl) + xf(hybridConsole(0, 0, 1.4, 0), { x: 960, y: 580, s: popS(tl, 0.3), cx: 0, cy: 0 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d, t) => cam(fill('#fff2c8') + xf(hybridConsole(0, 0, 1.0, (Math.sin(tl * 2) + 1) / 2), { x: 960, y: 480 }) + kids(t, [360, 1560], 1080, 1.3, P.hold), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, C.yellow, 0.3) + xf(hybridConsole(0, 0, 1.0, 0), { x: 960, y: 640 }) + xf(trophy(0, 0, 1.1), { x: 960, y: 230 + bob(tl, 8, 1), s: popS(tl, 0.2), cx: 0, cy: 0 }) +
      typeText('任天堂で一番売れたゲーム機', 960, 980, tl, { size: 60, color: RED, delay: 0.6 }).replace('y="980"', 'y="900"'), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── まとめ
  '17': [
    (tl, d) => {
      let s = fill(SEPIA);
      [(x, y) => hanafuda(x, y, 1.2, -8, 1), (x, y) => taxi(x, y, 0.5), (x, y) => extendHand(x - 160, y, 0.7, 0.6), (x, y) => bwHandheld(x, y, 0.6, tl % 1)].forEach((f, i) => { s += xf(f(300 + i * 440, 560), { s: popS(tl, i * 0.45), cx: 300 + i * 440, cy: 560 }); });
      return cam(s, tl, d, { z0: 1.0, z1: 1.04, x0: 900, x1: 1020 });
    },
    (tl, d) => cam(fill(CREAM) + big('任', 560, 560, 300, RED) + big('天', 960, 560, 300, RED) + big('堂', 1360, 560, 300, RED) + typeText('運を天に任せる', 960, 820, tl, { size: 100, color: INK, cps: 8, font: 'Yomogi', weight: 400 }), tl, d, { z0: 1.0, z1: 1.06 }),
    (tl, d) => {
      let s = fill(CREAM) + big('任天堂', 960, 380, 200, RED);
      s += xf(text('運を天に任せる', 960, 640, { size: 100, color: '#888', font: 'Yomogi' }) + cross(960, 610, 1.4), { o: 1 });
      s += xf(text('遊び方を、考え抜く', 960, 880, { size: 110, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, d * 0.45), cx: 960, cy: 840 });
      return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
    },
    (tl, d, t) => {
      let s = fill('#fdf1dc') + glow(960, 500, 700, '#fff', 0.3);
      [(x, y) => hanafuda(x, y, 0.8, tl * 30, 1), (x, y) => extendHand(x - 120, y, 0.45, 0.5 + 0.5 * Math.sin(tl * 3)), (x, y) => handheld(x, y, 0.5, tl % 1), (x, y) => bwHandheld(x, y, 0.4, tl % 1), (x, y) => remote(x, y, 0.6, tl * 40), (x, y) => hybridConsole(x, y, 0.35)]
        .forEach((f, i) => { const a = tl * 0.6 + (i / 6) * Math.PI * 2; s += f(960 + Math.cos(a) * 700, 520 + Math.sin(a) * 330); });
      s += mid(guide, 960, { mouth: 0, blink: blinking(t, 9), arms: P.cheer });
      return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
    },
    (tl, d, t) => cam(fill('#e2eaf4') + mid(calmPres, 760, { blink: blinking(t, 9), arms: P.idle, look: [1, 0] }) + typeText('2005年　ゲーム開発者の講演', 1350, 300, tl, { size: 56, color: INK }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
    // 名言：暗い背景に人物、横に引用（長めに止める）
    (tl, d, t) => {
      let s = fill('#1c2030') + glow(560, 560, 500, '#fff6d8', 0.22) + mid(calmPres, 520, { blink: blinking(t, 9), arms: P.idle, look: [1, 0], expr: 'smile' });
      const qs = ['名刺の上では、私は社長です。', '頭の中では、ゲーム開発者です。', 'でも心の中では、', '私はゲーマーです。'];
      qs.forEach((q, i) => { s += typeText(q, 1000, 340 + i * 130, tl, { size: i === 3 ? 76 : 58, color: i === 3 ? C.yellow : C.white, anchor: 'start', delay: i * (d / 4.2), cps: 10 }); });
      s += text('“', 960, 260, { size: 160, color: C.yellow, font: 'Zen Maru Gothic', weight: 900 }) + text('— 岩田聡', 1000, 900, { size: 46, color: '#bbb', anchor: 'start', font: 'Zen Maru Gothic', weight: 700 });
      return s;
    },
    (tl, d, t) => {
      let s = fill('#fdf1dc');
      [['花札', (x, y) => hanafuda(x, y, 1.1, -6, 1)], ['のびる手', (x, y) => extendHand(x - 170, y, 0.75, 0.6)], ['ゲームボーイ', (x, y) => bwHandheld(x, y, 0.75, tl % 1)]].forEach(([lb, f], i) => {
        const x = 330 + i * 630;
        s += rect(x - 290, 160, 580, 640, { fill: [SEPIA, '#d6e4dc', '#f1ece2'][i] }) + f(x, 450) + text(lb, x, 740, { size: 56, font: 'Zen Maru Gothic', weight: 900 });
        s += xf(text('✓', x + 200, 260, { size: 130, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.4 + i * 0.5), cx: x + 200, cy: 220 });
      });
      s += enter(bubble('あなたが一番遊んだのは？', 960, 880, { size: 46 }), tl, d * 0.5, { cx: 960, cy: 880 }).replace(/translate\(/, 'translate(').replace('cy="920"', 'cy="920"');
      return s;
    },
    (tl, d, t) => cam(fill(RED) + glow(800, 500, 700, '#fff', 0.2) + mid(guide, 700, { blink: blinking(t, 9), arms: P.wave, mouth: 0 }) +
      xf(sign('チャンネル登録', 1400, 520, { size: 90, fill: C.white, color: RED, rot: -4 }), { s: popS(tl, 0.3), cx: 1400, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 }),
  ],
};

// 第2〜4章：長い行の途中に別の絵を足す（07-extra2.mjs）
import { EXTRA2 } from './07-extra2.mjs';
for (const [k, ex] of Object.entries(EXTRA2)) SHOTS[k] = withExtras(SHOTS[k], ex);

// すみっこのネコ（小ネタ）：[声ファイル, 行, ネコが持っているもの]
import { sneakyCat as cat } from '../lib/cprops.mjs';
const CATS = [
  ['07', 4, () => ball(0, 0, 26, C.red)],
  ['11', 7, () => dpad(0, 0, 0.3)],
  ['13', 8, () => bwHandheld(0, 0, 0.18, 0)],
  ['16', 10, () => ''],
  ['17', 7, () => ''],
];
const withCat = (f, toy) => (tl, d, t) => f(tl, d, t) + cat(lerp(-160, 140, ease.out(clamp((tl - 0.4) / 0.7))), 1010, tl, toy());
for (const [k, i, toy] of CATS) {
  const e = SHOTS[k][i];
  SHOTS[k][i] = Array.isArray(e) ? e.map((f) => withCat(f, toy)) : withCat(e, toy);
}

// ───── 終了画面（20秒・声なし）：YouTube の「終了画面」の動画2本とチャンネル登録ボタンを、この枠の上に置く
// 枠の位置（1920×1080）：左の動画 x160〜900・y300〜716／右の動画 x1020〜1760・y300〜716／登録ボタン 中心(960, 900)
export const endScreen = (t) => {
  let s = fill(RED) + glow(960, 500, 900, '#ffffff', 0.14);
  for (let i = 0; i < 10; i++) {
    const k = (t * 0.05 + i * 0.1) % 1;
    s += xf([hanafuda, (x, y, sc, r) => playingCard(x, y, sc, r, '♠'), (x, y, sc) => bwHandheld(x, y, sc * 0.5, 0)][i % 3](0, 0, 0.5, i * 20), { x: (i * 211) % 1920, y: lerp(1180, -100, k), r: t * 20 + i * 30, o: 0.25 });
  }
  s += typeText('次に見るならこちら', 960, 200, t, { size: 80, color: C.white, cps: 14 });
  for (const x of [160, 1020]) s += `<rect x="${x}" y="300" width="740" height="416" rx="24" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="22 14"/>`;
  s += `<circle cx="960" cy="900" r="92" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="18 12"/>`;
  s += cat(lerp(-160, 150, ease.out(clamp((t - 1) / 0.8))), 1010, t, '');
  return s;
};
