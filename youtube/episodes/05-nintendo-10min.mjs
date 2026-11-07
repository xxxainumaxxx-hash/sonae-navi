// ロング01：任天堂は、なぜ生き残れたのか（10分版・13場面）
// ナレーションは scripts/long-01-nintendo.md から読み込む（台本を直せば、そのまま反映される）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, text, arrow, poly, line, ellipse, rect } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, camera, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import {
  taxi, riceBox, extendHand, calculator, handheld, tvConsole, bulb, gear, chartDown, cross, sign, shop,
  hanafuda, playingCard, cardBox, townRow, desk, building, plane, dpad, bwHandheld, colorHandheld,
  battery, bubble, rainCloud, trophy, ball, band, lightGun, target, loveMeter, toyRobot, dustyPile, goldSeal,
  redGoggle, dualScreen, remote, hybridConsole, houseFrame, gate,
} from '../lib/cprops.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const md = fs.readFileSync(path.join(HERE, '../scripts/long-01-nintendo.md'), 'utf8');
const body = md.split('## 台本')[1].split('## ショートの')[0];
const NAR = body.split(/^### 【\d+】.*$/m).slice(1).map((b) => b.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim()));

export const meta = {
  id: '05-nintendo-10min',
  title: '任天堂は、なぜ生き残れたのか',
  theme: 'crayon',
};

const big = (str, x, y, size, color) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${C.white}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill" filter="url(#wobble)">${str}</text>`;
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const P = {
  idle: [12, 8, 12, 8], point: [12, 8, 125, 10], wave: [12, 8, 150, -30], cheer: [160, 10, 160, 10],
  shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100], think: [12, 8, 30, -180], paint: [12, 8, 70, -60], aim: [12, 8, 90, 0],
};
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: C.red, pants: '#2c3350', ...o });
const crafts = (o) => kid({ hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', pants: '#4a3a2a', ...o });
const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
const calmPres = (o) => kid({ hair: 'side', hairColor: '#4a3a30', glasses: true, shirt: '#7a8fb0', pants: '#3b4a6b', ...o });
const at = (c, k) => c.at(k);
const after = (t, c, k, d = 0) => t >= c.at(k) + d;
const between = (t, c, a, b) => t >= c.at(a) && (b == null || t < c.at(b));
const g2 = (inner, x, y) => `<g transform="translate(${x} ${y})">${inner}</g>`;
const night = () => band(-20, 1120, '#2b3044');
const spot = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.9}" fill="#fff6d8" opacity="0.18"/>`;
const kidsRow = (t, xs, y, sc = 0.6, arms = P.cheer) => xs.map((x, i) => kid({ x, y: y - Math.abs(Math.sin(t * 6 + i)) * 10, s: sc, shirt: [C.blue, C.pink, C.green, C.orange, C.yellow][i % 5], hair: i % 2 ? 'side' : 'messy', arms, blink: blinking(t, i), expr: 'smile' })).join('');

export const scenes = [
  // 01 つかみ
  {
    narration: NAR[0],
    draw: (t, c) => {
      let s = night() + spot(1200, 520, 420);
      if (between(t, c, 5)) {
        s = night() + spot(960, 420, 600);
        s += enter(big('任天堂は', 960, 300, 130, C.white), t, at(c, 5), { cx: 960, cy: 260 });
        s += enter(big('なぜ生き残れた？', 960, 470, 130, C.yellow), t, at(c, 5) + 0.6, { cx: 960, cy: 430 });
        if (after(t, c, 6)) s += xf(extendHand(0, 0, 0.9, 0.5 + 0.5 * Math.sin(t * 3)), { x: 1150, y: 760, s: popS(t, at(c, 6)), cx: 0, cy: 0 });
      } else if (t < at(c, 2)) {
        for (let i = 0; i < 5; i++) s += xf(tvConsole(0, 0, 0.45, Math.max(0, Math.sin(t * 5 + i))), { x: 380 + i * 300, y: 700 + bob(t, 10, 0.6, i * 0.2), s: popS(t, 0.2 + i * 0.25), cx: 0, cy: -150 });
      } else if (t < at(c, 4)) {
        s += xf(hanafuda(0, 0, 2.2, Math.sin(t * 2) * 6, 0), { x: 1200, y: 540 + bob(t, 10, 0.5), s: popS(t, at(c, 2) + 0.2), cx: 0, cy: 0 });
        if (after(t, c, 3)) {
          s += xf(taxi(0, 0, 0.6, t * 400), { x: tw(t, at(c, 3), at(c, 3) + 0.8, 2200, 1600), y: 900 });
          s += xf(riceBox(0, 0, 0.55), { x: 1780, y: tw(t, at(c, 3) + 0.6, at(c, 3) + 1.1, -300, 640, ease.back) });
          s += xf(cross(1600, 880, 0.8), { s: popS(t, at(c, 3) + 1.4), cx: 1600, cy: 880 }) + xf(cross(1780, 640, 0.8), { s: popS(t, at(c, 3) + 1.7), cx: 1780, cy: 640 });
        }
      } else {
        // 姿を変えてきた：カード → おもちゃ → ゲーム
        s += xf(hanafuda(0, 0, 1.3, -8, 1), { x: 760, y: 520, s: popS(t, at(c, 4)), cx: 0, cy: 0 });
        s += xf(extendHand(0, 0, 0.7, 0.6), { x: 1020, y: 520, s: popS(t, at(c, 4) + 0.5), cx: 0, cy: 0 });
        s += xf(handheld(0, 0, 0.6, (t * 0.8) % 1), { x: 1620, y: 520, s: popS(t, at(c, 4) + 1.0), cx: 0, cy: 0 });
        s += arrow(880, 520, 960, 520, { w: 10, head: 30 }) + arrow(1380, 520, 1460, 520, { w: 10, head: 30 });
      }
      s += guide({ x: between(t, c, 5) ? 360 : 230, y: 960, s: 1.15, mouth: c.mouth, blink: blinking(t), arms: mix(P.idle, P.point, clamp((t - 0.6) * 3)), look: [1, -0.3] });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 540 });
    },
  },
  // 02 京都の花札屋
  {
    narration: NAR[1],
    draw: (t, c) => {
      let s = band(-20, 700, '#f3dcb6') + townRow(760, 7, -200, 340) + band(760, 400, '#d9c3a0');
      if (t < at(c, 2)) {
        s += enter(sign('1889年・京都', 960, 130, { size: 76, fill: C.white }), t, 0.3, { cx: 960, cy: 130 });
        s += xf(shop(960, 900, 1.15), { y: tw(t, 0, 0.6, -900, 0, ease.back) });
        s += crafts({ x: 1500, y: 960, s: 1.0, blink: blinking(t, 1), arms: mix(P.idle, P.wave, clamp((t - at(c, 1)) * 3)), look: [-1, 0], flip: true });
      } else if (t < at(c, 4)) {
        // 江戸：禁止 → 明治：解禁
        s += xf(hanafuda(0, 0, 1.6, -6, 0), { x: 760, y: 520, s: popS(t, at(c, 2)), cx: 0, cy: 0 });
        if (t < at(c, 3)) s += xf(cross(760, 520, 1.6), { s: popS(t, at(c, 2) + 0.6), cx: 760, cy: 520 });
        s += enter(sign(t < at(c, 3) ? '江戸時代：禁止' : '明治：販売OK！', 1300, 400, { size: 64, fill: t < at(c, 3) ? C.white : C.yellow }), t, at(c, 2) + 0.3, { cx: 1300, cy: 400 });
      } else if (t < at(c, 5)) {
        [1, 2, 0, 3].forEach((k, i) => { s += xf(hanafuda(0, 0, 1.5, -12 + i * 8, k), { x: 480 + i * 320, y: 520 + bob(t, 8, 0.5, i * 0.3), s: popS(t, at(c, 4) + i * 0.3), cx: 0, cy: 0 }); });
      } else if (t < at(c, 8)) {
        const grow = tw(t, at(c, 7), at(c, 7) + 1.2, 0.85, 1.15, ease.back);
        s += xf(shop(0, 0, 1), { x: 760, y: 900, s: grow });
        s += crafts({ x: 1400, y: 960, s: 1.05, blink: blinking(t, 1), arms: mix(P.paint, [12, 8, 70, -20], (Math.sin(t * 8) + 1) / 2), look: [1, 0.3] });
        s += hanafuda(1560, 760, 0.7, 10, 2);
        s += enter(bubble('きれい！じょうぶ！', 1560, 330, { size: 46 }), t, at(c, 5) + 0.3, { cx: 1560, cy: 330 });
        for (let i = 0; i < 4; i++) s += enter(kid({ x: 180 + i * 120, y: 980, s: 0.55, shirt: [C.blue, C.green, C.pink, C.yellow][i], hair: i % 2 ? 'messy' : 'side', blink: blinking(t, i) }), t, at(c, 6) + i * 0.2, { how: 'left', dist: 600 });
      } else if (t < at(c, 10)) {
        s += enter(big('任', 560, 560, 260, C.red), t, at(c, 8), { cx: 560, cy: 470 });
        s += enter(big('天', 960, 560, 260, C.red), t, at(c, 8) + 0.3, { cx: 960, cy: 470 });
        s += enter(big('堂', 1360, 560, 260, C.red), t, at(c, 8) + 0.6, { cx: 1360, cy: 470 });
        s += enter(sign('運を天に任せる？', 960, 780, { size: 70, fill: C.white }), t, at(c, 8) + 1.2, { cx: 960, cy: 780 });
      } else {
        s += xf(playingCard(0, 0, 1.8, -8, '♠'), { x: 660, y: 480, s: popS(t, at(c, 10)), cx: 0, cy: 0 });
        s += xf(playingCard(0, 0, 1.8, 8, '♥', C.red), { x: 1000, y: 480, s: popS(t, at(c, 10) + 0.3), cx: 0, cy: 0 });
        s += enter(sign('日本初のトランプ', 820, 830, { size: 64, fill: C.yellow }), t, at(c, 10) + 0.5, { cx: 820, cy: 830 });
        if (after(t, c, 11)) {
          s += xf(rect(1300, 560, 380, 260, { fill: '#b98a58' }) + rect(1330, 600, 320, 120, { fill: C.white, w: 4 }) + text('たばこ', 1490, 680, { size: 56, font: 'Zen Maru Gothic', weight: 900 }) +
            playingCard(1420, 780, 0.5, -10, '♠') + playingCard(1560, 780, 0.5, 10, '♥', C.red), { s: popS(t, at(c, 11)), cx: 1490, cy: 690 });
        }
      }
      return camera(s, { z: 1.03, x: tw(t, 0, c.d, 920, 1000, ease.inOut), y: 540 });
    },
  },
  // 03 22歳の社長
  {
    narration: NAR[2],
    draw: (t, c) => {
      let s = band(-20, 760, '#e9e1f2') + band(760, 400, '#c8b8a0');
      if (t < at(c, 3)) {
        const walk = clamp((t - at(c, 1) + 0.3) / 1.0);
        s += enter(sign('1949年', 960, 140, { size: 76, fill: C.white }), t, 0.2, { cx: 960, cy: 140 });
        s += desk(1100, 760, 1.2);
        s += pres({ x: lerp(-200, 760, ease.out(walk)), y: 960, s: 1.25, legs: walk > 0 && walk < 1 ? Math.sin(t * 14) : 0, blink: blinking(t, 2),
          arms: after(t, c, 2) ? mix(P.idle, P.cheer, clamp((t - at(c, 2)) * 4)) : P.idle, look: [1, 0] });
        s += enter(sign('22歳で社長に', 1250, 330, { size: 70, fill: C.yellow }), t, at(c, 1) + 0.6, { cx: 1250, cy: 330 });
      } else if (t < at(c, 4)) {
        s += xf(playingCard(0, 0, 2.0, Math.sin(t * 2) * 8, '♠'), { x: 760, y: 520, s: popS(t, at(c, 3)), cx: 0, cy: 0 });
        s += enter(sign('日本初のプラスチック製', 1300, 300, { size: 58, fill: C.yellow }), t, at(c, 3) + 0.3, { cx: 1300, cy: 300 });
        s += rainCloud(1300, 560, t, 0.8);
        s += enter(sign('水に強い！', 1300, 860, { size: 60, fill: C.sky }), t, at(c, 3) + 1.5, { cx: 1300, cy: 860 });
      } else if (t < at(c, 5)) {
        const n = Math.floor(clamp((t - at(c, 4)) / 2.5) * 12);
        for (let i = 0; i < n; i++) s += cardBox(560 + (i % 4) * 160, 860 - Math.floor(i / 4) * 200, 0.75, [C.sky, C.pink, C.yellow, C.green][i % 4]);
        s += enter(sign('大ヒット！', 1380, 240, { size: 84, fill: C.yellow, rot: -4 + Math.sin(t * 6) * 2 }), t, at(c, 4) + 1.5, { cx: 1380, cy: 240 });
        s += pres({ x: 1500, y: 960, s: 1.0, blink: blinking(t, 2), arms: P.cheer, look: [-1, 0], flip: true });
      } else if (t < at(c, 7)) {
        s += desk(960, 760, 1.6);
        if (t < at(c, 6)) {
          for (let i = 0; i < 3; i++) s += kid({ x: 620 + i * 340, y: 960, s: 0.95, hair: 'side', shirt: C.white, jacket: '#555', blink: blinking(t, i), arms: P.hold, mustache: i === 1 });
        } else {
          [[560, C.blue, 'messy'], [820, C.pink, 'side'], [1100, C.green, 'messy'], [1360, C.orange, 'side']].forEach(([x, col, h], i) => { s += kid({ x, y: 960, s: 0.85, shirt: col, hair: h, blink: blinking(t, i), arms: P.hold, tilt: Math.sin(t * 3 + i) * 4 }); });
        }
        for (let i = 0; i < 5; i++) s += playingCard(780 + i * 90, 730 - Math.abs(Math.sin(t * 4 + i)) * 30, 0.4, -20 + i * 10, i % 2 ? '♥' : '♠', i % 2 ? C.red : C.ink);
        s += enter(sign(t < at(c, 6) ? '大人の遊び' : '家族の遊び', 960, 180, { size: 70, fill: C.white }), t, at(c, 5), { cx: 960, cy: 180 });
      } else {
        s += xf(cardBox(0, 0, 1.2, C.yellow) + g2(cardBox(0, 0, 1.2, C.pink), 180, 30) + g2(cardBox(0, 0, 1.2, C.sky), -180, 30), { x: 760, y: 500, s: popS(t, at(c, 7)), cx: 0, cy: 0 });
        s += enter(sign('日本トップクラス', 760, 820, { size: 64, fill: C.yellow }), t, at(c, 7) + 0.4, { cx: 760, cy: 820 });
        s += pres({ x: 1450, y: 960, s: 1.15, blink: blinking(t, 2), arms: after(t, c, 9) ? P.think : P.cheer, expr: after(t, c, 9) ? 'worry' : 'smile', flip: true, look: [-1, 0] });
        if (after(t, c, 9)) s += xf(rect(1700, 200, 60, 700, { fill: C.gray }), { x: tw(t, at(c, 9), at(c, 9) + 0.6, 400, 0, ease.back) });
      }
      return camera(s, { z: 1.02, x: 960, y: 540 });
    },
  },
  // 04 カードの限界と、失敗つづき
  {
    narration: NAR[3],
    draw: (t, c) => {
      let s = band(-20, 820, '#cfe6f5') + band(820, 300, '#9a9690');
      if (t < at(c, 3)) {
        if (t < 2.0) s += plane(tw(t, 0, 2.0, -300, 2200), 300 + Math.sin(t * 2) * 20, 1.1);
        const z = tw(t, at(c, 0) + 2, at(c, 1) + 0.5, 1, 1.6, ease.inOut);
        let city = '';
        [[260, 180, 600], [520, 200, 720], [1400, 220, 680], [1680, 180, 560]].forEach(([x, w, h]) => { city += building(x, 840, w, h); });
        city += building(960, 840, 200, 220, '#d8b080') + text('トランプ会社', 960, 590, { size: 40, font: 'Zen Maru Gothic', weight: 900 });
        if (t > 1.6) s += camera(city, { z, x: 960, y: lerp(540, 700, (z - 1) / 0.6) });
        s += pres({ x: 1560, y: 980, s: 1.0, expr: after(t, c, 1) ? 'wow' : 'smile', blink: blinking(t, 3), look: [-1, -0.5], flip: true, arms: after(t, c, 2) ? P.think : P.idle });
        if (after(t, c, 1)) s += enter(bubble('この程度…？', 1450, 300, { size: 56 }), t, at(c, 1), { cx: 1450, cy: 300 });
      } else {
        s = band(-20, 840, '#dfe3ea') + band(840, 300, '#a9a39a');
        const t4 = at(c, 4), t6 = at(c, 6);
        s += enter(sign('1960年代', 960, 140, { size: 70, fill: C.white }), t, at(c, 3), { cx: 960, cy: 140 });
        if (t > t4) s += taxi(tw(t, t4, t4 + 1.0, -500, 640, ease.out), 760, 0.95, t < t4 + 1 ? t * 500 : 0);
        if (t > t4 + 1.4) s += xf(riceBox(1300, 700, 0.9), { y: tw(t, t4 + 1.4, t4 + 1.9, -900, 0, ease.back) });
        if (after(t, c, 5)) for (let i = 0; i < 3; i++) s += xf(text('？', 0, 0, { size: 120, color: C.gray, font: 'Zen Maru Gothic', weight: 900 }), { x: 1650 + i * 80, y: 600 - i * 60, s: popS(t, at(c, 5) + i * 0.3), cx: 0, cy: -40 });
        const sk = shake(t, t6, 0.5) + shake(t, t6 + 0.4, 0.5);
        s += xf(cross(640, 660, 1.1), { s: popS(t, t6), cx: 640, cy: 660 }) + xf(cross(1300, 680, 1.1), { s: popS(t, t6 + 0.4), cx: 1300, cy: 680 });
        if (after(t, c, 8)) s += xf(chartDown(0, 0, 0.8, tw(t, at(c, 8), at(c, 8) + 3, 0, 1, (k) => k)), { x: 1580, y: 280, s: popS(t, at(c, 8)), cx: 0, cy: 0 });
        s += pres({ x: 230 + sk, y: 980, s: 1.0, expr: after(t, c, 6) ? 'worry' : 'smile', sweat: after(t, c, 6), blink: blinking(t, 4), look: [1, 0],
          arms: after(t, c, 6) ? P.shrug : mix(P.idle, P.point, clamp((t - t4) * 3)) });
        if (after(t, c, 10)) s += rainCloud(260, 380, t, 0.9);
        s = camera(s, { z: 1.02, x: 960 + sk * 0.6, y: 540 });
      }
      return s;
    },
  },
  // 05 ひまつぶしのおもちゃ
  {
    narration: NAR[4],
    draw: (t, c) => {
      let s = band(-20, 820, '#d6e4dc') + band(820, 300, '#8f9a92');
      s += gear(1650, 200, 110, t * 40) + gear(1820, 330, 80, -t * 55, '#8e8a84') + gear(200, 180, 90, -t * 35);
      if (t < at(c, 3)) {
        s += poly([[900, 860], [900, 480], [1300, 480], [1300, 860]], { fill: '#a8a29a' }) + gear(1100, 640, 90, t * 90, C.gray);
        s += worker({ x: 640, y: 960, s: 1.3, blink: blinking(t, 5), arms: mix(P.idle, [12, 8, 90, 20], (Math.sin(t * 6) + 1) / 2), look: [1, 0] });
        s += enter(sign('点検係の若者', 640, 260, { size: 64, fill: C.white }), t, at(c, 1), { cx: 640, cy: 260 });
        if (after(t, c, 2)) s += enter(bubble('ひま…', 560, 420, { size: 56 }), t, at(c, 2) + 1, { cx: 560, cy: 420 });
      } else if (t < at(c, 5)) {
        const ext = 0.5 - 0.5 * Math.cos(t * 2.4);
        s += worker({ x: 520, y: 960, s: 1.4, arms: P.hold, blink: blinking(t, 5), look: [1, 0], tilt: Math.sin(t * 2.4) * 3 });
        s += extendHand(600, 810, 1.3, ext);
        const grabbed = ext > 0.85;
        s += ball(grabbed ? 600 + 6 * (22 + 48 * ext) * 1.3 + 90 : 1320, grabbed ? 810 : 900 - Math.abs(Math.sin(t * 3)) * 60, 40, C.red);
      } else if (t < at(c, 7)) {
        s += worker({ x: 420, y: 960, s: 1.2, arms: P.hold, blink: blinking(t, 5), look: [1, 0], expr: after(t, c, 6) ? 'wow' : 'smile' });
        s += extendHand(490, 830, 1.1, 0.4 + 0.3 * Math.sin(t * 3));
        s += enter(pres({ x: 1450, y: 980, s: 1.1, expr: 'smile', flip: true, look: [-1, 0], blink: blinking(t, 6), arms: after(t, c, 6) ? [12, 8, 125, 10] : P.idle }), t, at(c, 5), { how: 'right', dist: 700 });
        if (after(t, c, 6)) s += enter(bubble('それを商品にしろ', 1340, 330, { size: 52 }), t, at(c, 6), { cx: 1340, cy: 330 });
      } else if (t < at(c, 9)) {
        s = band(-20, 1120, '#fbf3df');
        const n = Math.floor(clamp((t - at(c, 7)) / 3) * 15);
        for (let i = 0; i < n; i++) s += g2(extendHand(0, 0, 0.45, 0.2), 380 + (i % 5) * 260, 900 - Math.floor(i / 5) * 160);
        s += enter(sign('1966年 大ヒット！', 960, 200, { size: 90, fill: C.yellow, rot: -4 + Math.sin(t * 6) * 2 }), t, at(c, 7) + 0.4, { cx: 960, cy: 200 });
        if (after(t, c, 8)) s += enter(big('100万個超え？', 960, 400, 100, C.red), t, at(c, 8), { cx: 960, cy: 360 });
      } else {
        s = band(-20, 1120, '#fbf3df');
        s += enter(sign('開発の部署へ', 960, 180, { size: 70, fill: C.white }), t, at(c, 9), { cx: 960, cy: 180 });
        s += worker({ x: 960, y: 960, s: 1.3, arms: P.cheer, blink: blinking(t, 5), mouth: 0 });
        [(x, y) => extendHand(x - 100, y, 0.4, 0.6), (x, y) => bulb(x, y, 0.5, 1), (x, y) => ball(x, y, 40, C.blue), (x, y) => gear(x, y, 50, t * 60)].forEach((f, i) => {
          const a = t * 0.8 + i * 1.57; s += xf(f(960 + Math.cos(a) * 500, 520 + Math.sin(a) * 220), { s: popS(t, at(c, 9) + i * 0.3), cx: 960, cy: 520 });
        });
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 540 });
    },
  },
  // 06 枯れた技術の水平思考
  {
    narration: NAR[5],
    draw: (t, c) => {
      let s = band(-20, 1120, '#eef3e2');
      if (t < at(c, 6)) {
        s += enter(big('枯れた技術の', 960, 220, 110, C.ink), t, at(c, 1), { cx: 960, cy: 190 });
        s += enter(big('水平思考', 960, 380, 140, C.green), t, at(c, 1) + 0.5, { cx: 960, cy: 340 });
        const slide = tw(t, at(c, 3), at(c, 3) + 2, 0, 1, ease.inOut);
        if (after(t, c, 2)) {
          const parts = calculator(0, 0, 0.6) + g2(bulb(0, 0, 0.5, 0), 150, 20) + gear(-140, 30, 60, t * 30);
          s += xf(parts, { x: lerp(520, 1450, slide), y: 720, s: popS(t, at(c, 2)) * (1 - slide * 0.6) });
        }
        if (after(t, c, 3)) s += arrow(700, 640, lerp(700, 1200, slide), 640, { w: 14, head: 50 });
        if (after(t, c, 3, 2)) s += xf(handheld(1450, 720, 0.85, (t * 0.8) % 1), { s: popS(t, at(c, 3) + 2), cx: 1450, cy: 720 });
        if (after(t, c, 4)) s += enter(sign('新しい技術＝高い・こわれやすい', 960, 860, { size: 50, fill: C.pink }), t, at(c, 4), { cx: 960, cy: 860 });
        if (after(t, c, 5)) s += enter(sign('使い慣れた技術＝安い・たくさん作れる', 960, 860, { size: 50, fill: C.yellow, rot: 3 }), t, at(c, 5), { cx: 960, cy: 860 });
      } else if (t < at(c, 8)) {
        const fire = (t - at(c, 6)) % 2.2;
        s += enter(sign('1970年 光線銃', 960, 150, { size: 72, fill: C.white }), t, at(c, 6), { cx: 960, cy: 150 });
        s += kid({ x: 380, y: 960, s: 1.1, hair: 'messy', shirt: C.blue, arms: P.aim, blink: blinking(t, 7), look: [1, 0] });
        s += lightGun(560, 640, 0.9, fire < 0.2 ? 1 - fire * 5 : 0);
        if (fire < 0.3) s += line([[720, 630], [1350, 560]], { w: 6, color: C.yellow, passes: 1 });
        s += target(1420, 560, 1.2, fire > 0.25 && fire < 1.6 ? 1 : 0);
        s += rect(1340, 660, 160, 60, { fill: '#2f4a7a', w: 5 }) + text('太陽電池', 1420, 702, { size: 30, color: C.white, font: 'Zen Maru Gothic', weight: 700 });
        if (after(t, c, 7)) s += enter(sign('安い！こわれにくい！', 960, 900, { size: 56, fill: C.yellow }), t, at(c, 7), { cx: 960, cy: 900 });
      } else if (t < at(c, 10)) {
        const v = 0.5 + 0.45 * Math.sin(t * 2.2);
        s += kid({ x: 620, y: 960, s: 1.1, hair: 'messy', shirt: C.blue, arms: [12, 8, 70, -50], blink: blinking(t, 1), tilt: 5, expr: 'smile' });
        s += kid({ x: 1300, y: 960, s: 1.1, hair: 'side', shirt: C.pink, arms: [70, -50, 12, 8], blink: blinking(t, 2), tilt: -5, expr: 'smile', flip: true });
        s += loveMeter(960, 520, 1.1, v);
        s += enter(sign('ラブテスター', 960, 170, { size: 70, fill: C.pink }), t, at(c, 8), { cx: 960, cy: 170 });
        if (after(t, c, 9)) s += enter(bubble('実は電気をはかってるだけ', 1450, 300, { size: 40 }), t, at(c, 9), { cx: 1450, cy: 300 });
        s += ellipse(960, 760, 40, 30, { fill: C.red }) + text('♥', 960, 778, { size: 50, color: C.white });
      } else {
        s += enter(big('これが任天堂の武器', 960, 300, 110, C.red), t, at(c, 10), { cx: 960, cy: 260 });
        s += xf(extendHand(0, 0, 0.6, 0.6) + g2(lightGun(0, 0, 0.6), 520, 0) + g2(loveMeter(0, 0, 0.6, 0.8), 960, 0), { x: 380, y: 680, s: popS(t, at(c, 10) + 0.3), cx: 480, cy: 0 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1.04, 1, ease.inOut), x: 960, y: 540 });
    },
  },
  // 07 新幹線の電卓
  {
    narration: NAR[6],
    draw: (t, c) => {
      let s = '';
      if (t < at(c, 2)) {
        s += band(-20, 1120, '#e6eef6');
        for (let i = 0; i < 4; i++) {
          const wx = 200 + i * 460;
          s += poly([[wx, 140], [wx + 360, 140], [wx + 360, 420], [wx, 420]], { fill: C.sky, w: 6 });
          const mx = ((wx + 380 - t * 900) % 460 + 460) % 460;
          s += `<clipPath id="win${i}"><rect x="${wx}" y="140" width="360" height="280"/></clipPath><g clip-path="url(#win${i})">${poly([[wx + mx - 120, 420], [wx + mx, 290], [wx + mx + 120, 420]], { fill: C.green, color: null })}${poly([[wx + mx - 340, 420], [wx + mx - 240, 330], [wx + mx - 140, 420]], { fill: '#6fae7a', color: null })}</g>`;
        }
        s += band(760, 400, '#b9a58a');
        s += salary({ x: 760, y: 980, s: 1.15, blink: blinking(t, 7), arms: P.hold, look: [0, 0.5], tilt: Math.sin(t * 1.5) * 2 });
        s += calculator(760, 830, 0.35);
        s += worker({ x: 1400, y: 980, s: 1.1, flip: true, look: [-1, 0], blink: blinking(t, 5), arms: after(t, c, 1) ? P.think : P.idle });
        if (after(t, c, 1)) s += xf(bulb(1400, 420, 0.7, 1), { s: popS(t, at(c, 1)), cx: 1400, cy: 400 });
      } else if (t < at(c, 4)) {
        s += band(-20, 1120, '#fbf3df');
        const m = tw(t, at(c, 2) + 0.5, at(c, 3), 0, 1, ease.inOut);
        if (m < 1) s += xf(calculator(0, 0, 1.0), { x: 960, y: 560, s: 1 - m, cx: 0, cy: 0 });
        if (m > 0) s += xf(handheld(0, 0, 1.2, (t * 0.8) % 1), { x: 960, y: 560, s: m, cx: 0, cy: 0 });
        s += enter(sign('1980年', 960, 160, { size: 70, fill: C.white }), t, at(c, 2), { cx: 960, cy: 160 });
      } else if (t < at(c, 6)) {
        s += band(-20, 1120, '#f3ece2');
        for (let i = 0; i < 5; i++) s += xf(calculator(0, 0, 0.5), { x: 320 + i * 320, y: 560 + bob(t, 10, 1, i * 0.2), s: popS(t, at(c, 4) + i * 0.15), cx: 0, cy: 0 });
        s += enter(sign('電卓戦争', 960, 170, { size: 80, fill: C.red, color: C.white }), t, at(c, 4) + 0.3, { cx: 960, cy: 170 });
        if (after(t, c, 5)) s += enter(sign('液晶が安くなった！', 960, 840, { size: 64, fill: C.yellow }), t, at(c, 5), { cx: 960, cy: 880 });
      } else if (t < at(c, 8)) {
        s += band(-20, 1120, '#fbf3df');
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2 + t * 0.4;
          s += xf(handheld(0, 0, 0.3, (t + i) % 1), { x: 960 + Math.cos(a) * 700, y: 560 + Math.sin(a) * 360, s: popS(t, at(c, 6) + i * 0.1), cx: 0, cy: 0 });
        }
        s += enter(big('世界中で大ヒット', 960, 580, 110, C.red), t, at(c, 6) + 0.2, { cx: 960, cy: 540 });
        if (after(t, c, 7)) s += enter(sign('4000万台以上', 960, 760, { size: 64, fill: C.yellow }), t, at(c, 7), { cx: 960, cy: 760 });
      } else {
        s += band(-20, 1120, '#e8eaf6');
        s += xf(dpad(0, 0, 2.6), { x: 960, y: 560, s: popS(t, at(c, 8)), cx: 0, cy: 0, r: Math.sin(t * 2) * 5 });
        s += enter(sign('十字キー', 960, 200, { size: 80, fill: C.yellow }), t, at(c, 8) + 0.3, { cx: 960, cy: 200 });
      }
      return camera(s, { z: 1.02, x: 960, y: 540 });
    },
  },
  // 08 ファミコン
  {
    narration: NAR[7],
    draw: (t, c) => {
      let s = band(-20, 1120, '#fdf0d8');
      if (t < at(c, 3)) {
        s += enter(sign('1983年', 960, 140, { size: 72, fill: C.white }), t, 0.2, { cx: 960, cy: 140 });
        s += xf(tvConsole(960, 760, 1.05, Math.max(0, Math.sin(t * 5))), { s: popS(t, 0.3), cx: 960, cy: 600 });
        if (after(t, c, 1)) s += enter(sign('14,800円', 1550, 380, { size: 76, fill: C.yellow, rot: 6 }), t, at(c, 1), { cx: 1550, cy: 380 });
        if (after(t, c, 2)) s += xf(dpad(0, 0, 1.2), { x: 400, y: 420, s: popS(t, at(c, 2)), cx: 0, cy: 0 });
      } else if (t < at(c, 5)) {
        s += xf(tvConsole(0, 0, 0.7, 0), { x: 520, y: 700, s: 1, cx: 0, cy: 0 });
        s += xf(tvConsole(0, 0, 0.9, Math.max(0, Math.sin(t * 5))), { x: 1360, y: 760, s: popS(t, at(c, 4)), cx: 0, cy: 0 });
        s += enter(sign('ほかのゲーム機', 520, 240, { size: 52, fill: C.white }), t, at(c, 3), { cx: 520, cy: 240 });
        if (after(t, c, 4)) s += enter(sign('色あざやか！', 1360, 220, { size: 64, fill: C.yellow }), t, at(c, 4) + 0.3, { cx: 1360, cy: 220 });
      } else {
        for (let i = 0; i < 3; i++) s += xf(houseFrame(0, 0, 0.75) + g2(tvConsole(0, 0, 0.35, Math.max(0, Math.sin(t * 5 + i))), 0, -40), { x: 380 + i * 580, y: 820, s: popS(t, at(c, 5) + i * 0.3), cx: 0, cy: -200 });
        if (after(t, c, 6)) s += enter(sign('1985年 社会現象に！', 960, 150, { size: 68, fill: C.red, color: C.white }), t, at(c, 6), { cx: 960, cy: 150 });
        if (after(t, c, 7)) s += kidsRow(t, [260, 480, 1440, 1660], 1010, 0.55);
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.04, ease.inOut), x: 960, y: 540 });
    },
  },
  // 09 アメリカでの品質の番人
  {
    narration: NAR[8],
    draw: (t, c) => {
      let s = band(-20, 840, '#e2e6ee') + band(840, 300, '#b0a89c');
      if (t < at(c, 3)) {
        s += enter(sign('アメリカ', 960, 140, { size: 72, fill: C.white }), t, 0.2, { cx: 960, cy: 140 });
        if (after(t, c, 1)) s += xf(dustyPile(760, 840, 1.2), { s: popS(t, at(c, 1)), cx: 760, cy: 700 });
        if (after(t, c, 1, 1)) s += enter(sign('アタリショック', 760, 330, { size: 64, fill: C.gray, color: C.white }), t, at(c, 1) + 1, { cx: 760, cy: 330 });
        if (after(t, c, 2)) s += salary({ x: 1450, y: 980, s: 1.1, flip: true, look: [-1, 0], arms: [12, 8, 60, 60], blink: blinking(t, 8), expr: 'angry', tilt: Math.sin(t * 8) * 6 });
        if (after(t, c, 2)) s += enter(bubble('ゲーム機？いらない！', 1450, 330, { size: 46 }), t, at(c, 2) + 0.3, { cx: 1450, cy: 330 });
      } else if (t < at(c, 5)) {
        s += xf(tvConsole(0, 0, 0.75, 0) + toyRobot(380, 60, 1.0, Math.sin(t * 3) * 6), { x: 700, y: 760, s: popS(t, at(c, 3)), cx: 0, cy: -100 });
        s += enter(sign('おもちゃ売り場へ', 1450, 300, { size: 62, fill: C.yellow }), t, at(c, 3) + 0.6, { cx: 1450, cy: 300 });
        if (after(t, c, 4)) s += enter(sign('Entertainment System', 960, 160, { size: 60, fill: C.white }), t, at(c, 4), { cx: 960, cy: 160 });
      } else {
        for (let i = 0; i < 6; i++) s += xf(rect(-60, -80, 120, 160, { fill: [C.sky, C.pink, C.yellow, C.green, C.orange, C.blue][i] }) + goldSeal(30, -40, 0.45, t * 30), { x: 380 + i * 230, y: 600, s: popS(t, at(c, 5) + i * 0.2), cx: 0, cy: 0 });
        s += enter(sign('品質の番人', 960, 200, { size: 80, fill: C.gold }), t, at(c, 5) + 0.3, { cx: 960, cy: 200 });
        if (after(t, c, 6)) s += kidsRow(t, [360, 600, 1320, 1560], 1010, 0.6);
        if (after(t, c, 7)) s += enter(big('ゲーム＝任天堂', 960, 380, 90, C.red), t, at(c, 7), { cx: 960, cy: 350 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.04, ease.inOut), x: 960, y: 540 });
    },
  },
  // 10 白黒のゲームボーイ
  {
    narration: NAR[9],
    draw: (t, c) => {
      let s = band(-20, 1120, '#f1ece2');
      const t2 = at(c, 2);
      const lvA = tw(t, t2, t2 + 3, 1, 0.8, (k) => k), lvB = tw(t, t2 + 1, t2 + 3.2, 1, 0, (k) => k);
      if (t < at(c, 5)) {
        s += enter(sign('1989年', 960, 120, { size: 64, fill: C.white }), t, 0.2, { cx: 960, cy: 120 });
        s += xf(bwHandheld(0, 0, 1.0, (t * 0.7) % 1, 0), { x: 560, y: 560, s: popS(t, 0.4), cx: 0, cy: 0 });
        if (after(t, c, 1)) s += enter(sign('白黒', 560, 230, { size: 64, fill: C.white }), t, at(c, 1), { cx: 560, cy: 230 });
        if (after(t, c, 2)) {
          s += xf(colorHandheld(0, 0, 0.9, lvB < 0.05 ? 1 : 0), { x: 1360, y: 520, s: popS(t, t2), cx: 0, cy: 0 });
          s += enter(sign('カラー', 1360, 230, { size: 64, fill: C.white }), t, t2 + 0.3, { cx: 1360, cy: 230 });
          s += battery(560, 880, 0.9, lvA) + battery(1360, 820, 0.9, lvB);
          s += enter(sign('高い！', 1680, 380, { size: 56, fill: C.pink, rot: 6 }), t, t2 + 2.5, { cx: 1680, cy: 380 });
        }
        if (after(t, c, 3)) {
          s += enter(sign('安い！長持ち！', 900, 760, { size: 46, fill: C.yellow, rot: -6 }), t, at(c, 3), { cx: 900, cy: 760 });
          for (let i = 0; i < 4; i++) s += xf(`<rect x="-30" y="-30" width="60" height="60" fill="${[C.red, C.blue, C.green, C.yellow][i]}" stroke="${C.ink}" stroke-width="5"/>`, { x: 470 + i * 60, y: tw(t, at(c, 3) + 1 + i * 0.2, at(c, 3) + 1.6 + i * 0.2, 300, 470, (k) => k), s: popS(t, at(c, 3) + 1 + i * 0.2), cx: 0, cy: 0 });
        }
        if (after(t, c, 4)) s += enter(sign('テトリスとセット', 960, 860, { size: 52, fill: C.white }), t, at(c, 4), { cx: 960, cy: 860 });
      } else {
        s += xf(bwHandheld(0, 0, 1.0, (t * 0.7) % 1, 0), { x: 960, y: 600, s: 1, cx: 0, cy: 0 });
        s += xf(trophy(0, 0, 1.0), { x: 960, y: 240 + bob(t, 8, 1), s: popS(t, at(c, 5)), cx: 0, cy: 0 });
        s += kidsRow(t, [300, 520, 1400, 1620], 1010, 0.62);
        if (after(t, c, 6)) s += enter(sign('世界で1億台超え', 1520, 400, { size: 60, fill: C.yellow }), t, at(c, 6), { cx: 1520, cy: 400 });
        if (after(t, c, 7)) s += enter(big('枯れた技術の勝ち', 520, 400, 80, C.green), t, at(c, 7), { cx: 520, cy: 370 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.04, ease.inOut), x: 960, y: 540 });
    },
  },
  // 11 生みの親の挫折
  {
    narration: NAR[10],
    draw: (t, c) => {
      let s;
      if (t < at(c, 4)) {
        s = band(-20, 840, '#3a2630') + band(840, 300, '#5a4048');
        s += enter(sign('1995年', 960, 130, { size: 64, fill: C.white }), t, at(c, 1), { cx: 960, cy: 130 });
        if (after(t, c, 1)) s += xf(redGoggle(960, 640, 1.3), { s: popS(t, at(c, 1)), cx: 960, cy: 600 });
        if (after(t, c, 2)) s += `<ellipse cx="960" cy="580" rx="${300 + Math.sin(t * 3) * 20}" ry="200" fill="#ff3b30" opacity="0.12"/>`;
        if (after(t, c, 3)) s += dustyPile(400, 860, 0.8) + dustyPile(1520, 860, 0.8) + xf(text('売れない…', 960, 860, { size: 70, color: C.white, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(t, at(c, 3) + 0.4), cx: 960, cy: 830 });
      } else if (t < at(c, 7)) {
        // 夕焼けの門を去る
        s = band(-20, 840, '#f2a65a') + `<circle cx="1500" cy="700" r="160" fill="#f26b3a" opacity="0.8"/>` + band(840, 300, '#7a5a48');
        s += gate(960, 860, 1.2);
        const walk = tw(t, at(c, 4), c.d, 0, 1, (k) => k);
        s += worker({ x: lerp(700, 1400, walk), y: 960, s: 1.0 - walk * 0.3, blink: blinking(t, 5), legs: Math.sin(t * 6), look: [1, 0], expr: 'smile' });
        if (after(t, c, 5)) s += xf(bwHandheld(0, 0, 0.5, (t * 0.7) % 1), { x: 420, y: 560, s: popS(t, at(c, 5)) * 0.8, cx: 0, cy: 0 }) + enter(sign('最後の大きな仕事', 420, 330, { size: 46, fill: C.white }), t, at(c, 5) + 0.5, { cx: 420, cy: 330 });
        if (after(t, c, 6)) s += enter(sign('責任説は本人も会社も否定', 960, 160, { size: 54, fill: C.white }), t, at(c, 6), { cx: 960, cy: 160 });
      } else {
        s = band(-20, 1120, '#2b3044');
        for (let i = 0; i < 30; i++) s += `<circle cx="${(i * 197) % 1920}" cy="${(i * 113) % 700}" r="${2 + (i % 3)}" fill="#fff" opacity="${0.4 + 0.4 * Math.sin(t * 2 + i)}"/>`;
        if (t < at(c, 8)) s += worker({ x: 960, y: 960, s: 1.2, blink: blinking(t, 5), arms: P.hold, look: [0, 0.4] }) + xf(gear(960, 760, 50, t * 40), { s: 1 });
        else s += xf(text('横井軍平（1941〜1997）', 960, 520, { size: 72, color: C.white, font: 'Zen Maru Gothic', weight: 700 }), { o: tw(t, at(c, 8), at(c, 8) + 1.5, 0, 1) });
      }
      return camera(s, { z: tw(t, 0, c.d, 1.02, 1.06, ease.inOut), x: 960, y: 540 });
    },
  },
  // 12 受け継がれた考え方
  {
    narration: NAR[11],
    draw: (t, c) => {
      let s = band(-20, 1120, '#eaf2f6');
      if (t < at(c, 2)) {
        s += xf(bwHandheld(0, 0, 1.0, (t * 0.7) % 1, 0), { x: 960, y: 560, s: 1, cx: 0, cy: 0 });
        if (after(t, c, 1)) {
          // 画面の中のオリジナルの小さなモンスター
          s += xf(ellipse(0, 0, 40, 34, { fill: '#3b4a2c' }) + ellipse(-24, -34, 10, 16, { fill: '#3b4a2c' }) + ellipse(24, -34, 10, 16, { fill: '#3b4a2c' }), { x: 960, y: 455 + bob(t, 8, 2), s: popS(t, at(c, 1)), cx: 0, cy: 0 });
          s += enter(sign('1996年 大ブーム', 1500, 300, { size: 60, fill: C.yellow }), t, at(c, 1) + 0.4, { cx: 1500, cy: 300 });
          s += kidsRow(t, [300, 520, 1400, 1620], 1010, 0.62);
        }
      } else if (t < at(c, 7)) {
        s += calmPres({ x: 300, y: 960, s: 1.1, blink: blinking(t, 9), arms: after(t, c, 3) ? P.point : P.idle, look: [1, 0] });
        s += enter(bubble('ゲームをする人を増やそう', 520, 300, { size: 46 }), t, at(c, 2), { cx: 520, cy: 300 });
        if (after(t, c, 3)) s += xf(dualScreen(0, 0, 0.9, (Math.sin(t * 3) + 1) / 2), { x: 980, y: 600, s: popS(t, at(c, 3)), cx: 0, cy: 0 });
        if (after(t, c, 3, 1.2)) s += xf(remote(0, 0, 1.1, Math.sin(t * 4) * 30), { x: 1500, y: 600, s: popS(t, at(c, 3) + 1.2), cx: 0, cy: 0 });
        if (after(t, c, 4)) s += salary({ x: 980, y: 1060, s: 0.55, arms: P.hold, blink: blinking(t, 3) }) + enter(sign('大人もハマった', 980, 240, { size: 50, fill: C.white }), t, at(c, 4) + 0.5, { cx: 980, cy: 240 });
        if (after(t, c, 5)) s += enter(sign('性能は低め → 1億台超え', 1500, 860, { size: 46, fill: C.yellow }), t, at(c, 5), { cx: 1500, cy: 860 });
      } else if (t < at(c, 9)) {
        s += xf(tvConsole(0, 0, 0.8, 0), { x: 960, y: 760, s: 1, cx: 0, cy: 0 }) + xf(cross(960, 520, 1.1), { s: popS(t, at(c, 7) + 1.2), cx: 960, cy: 520 });
        s += enter(sign('思うように売れなかった', 960, 160, { size: 60, fill: C.gray, color: C.white }), t, at(c, 7) + 0.6, { cx: 960, cy: 160 });
        if (after(t, c, 8)) s += enter(big('また「遊び方」で勝負', 960, 860, 80, C.red), t, at(c, 8), { cx: 960, cy: 830 });
      } else {
        const split = after(t, c, 10) ? (Math.sin(t * 2) + 1) / 2 : 0;
        s += xf(hybridConsole(0, 0, 1.0, split), { x: 960, y: 560, s: popS(t, at(c, 9)), cx: 0, cy: 0 });
        s += enter(sign('2017年', 960, 160, { size: 64, fill: C.white }), t, at(c, 9) + 0.2, { cx: 960, cy: 160 });
        if (after(t, c, 10)) s += kidsRow(t, [360, 1560], 1010, 0.62, P.hold);
        if (after(t, c, 11)) s += xf(trophy(0, 0, 0.9), { x: 1620, y: 420, s: popS(t, at(c, 11)), cx: 0, cy: 0 }) + enter(sign('任天堂で一番売れた', 960, 330, { size: 56, fill: C.yellow }), t, at(c, 11) + 0.3, { cx: 960, cy: 330 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.04, ease.inOut), x: 960, y: 540 });
    },
  },
  // 13 まとめ
  {
    narration: NAR[12],
    draw: (t, c) => {
      let s = band(-20, 1120, '#fdf1dc');
      const items = [
        (x, y) => hanafuda(x, y, 0.8, t * 30, 1), (x, y) => extendHand(x - 120, y, 0.45, 0.5 + 0.5 * Math.sin(t * 3)),
        (x, y) => handheld(x, y, 0.5, t % 1), (x, y) => bwHandheld(x, y, 0.4, t % 1), (x, y) => playingCard(x, y, 0.7, -t * 30, '♥', C.red), (x, y) => lightGun(x, y, 0.5),
      ];
      items.forEach((f, i) => { const a = t * 0.6 + (i / items.length) * Math.PI * 2; s += f(960 + Math.cos(a) * 720, 560 + Math.sin(a) * 340); });
      s += enter(big('性能より「遊び方」', 960, 190, 110, C.red), t, at(c, 1), { cx: 960, cy: 160 });
      const pump = Math.sin(t * 4) * 0.5 + 0.5;
      s += guide({ x: 960, y: 940 - pump * 14, s: 1.3, mouth: c.mouth, blink: blinking(t, 9), arms: after(t, c, 5) ? P.wave : mix(P.cheer, P.idle, pump * 0.3) });
      if (after(t, c, 6)) s += enter(sign('チャンネル登録', 1560, 560, { size: 58, fill: C.red, color: C.white, rot: -3 }), t, at(c, 6), { cx: 1560, cy: 560 });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 560 });
    },
  },
];

// サムネイル（1920x1080で描いて1280x720に縮小）：顔＋ひと言、左→右の変化
export function thumbnail() {
  let s = band(-20, 1120, '#2b3044') + spot(1350, 520, 520);
  s += hanafuda(380, 560, 2.3, -10, 0);
  s += `<path d="M640,560 L980,560" stroke="${C.white}" stroke-width="40" stroke-linecap="round"/><path d="M960,480 L1080,560 L960,640Z" fill="${C.white}"/>`;
  s += handheld(1400, 520, 1.25, 0.3);
  s += xf(trophy(0, 0, 0.9), { x: 1720, y: 230, s: 1, cx: 0, cy: 0 });
  s += big('花札屋', 380, 210, 150, C.yellow) + big('世界の任天堂', 1380, 960, 130, C.yellow);
  s += pres({ x: 820, y: 1100, s: 1.2, expr: 'wow', arms: [160, 10, 160, 10], look: [1, -0.6] });
  return s;
}
