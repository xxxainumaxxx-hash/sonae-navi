// ロング01：任天堂は、なぜ生き残れたのか（フル版・約8分）
// 台本：scripts/long-01-nintendo.md
import { C, text, arrow, poly } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, camera, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import {
  card, taxi, riceBox, extendHand, calculator, handheld, tvConsole, bulb, gear, chartDown, cross, sign, shop,
  hanafuda, playingCard, cardBox, townRow, desk, building, plane, train, dpad, bwHandheld, colorHandheld,
  battery, bubble, rainCloud, trophy, ball, band,
} from '../lib/cprops.mjs';

export const meta = {
  id: '04-nintendo-full',
  title: '任天堂は、なぜ生き残れたのか',
  description: '花札屋から始まった任天堂。失敗続きの時代を救ったのは、ひとりの社員のひまつぶしだった。',
  theme: 'crayon',
};

const big = (str, x, y, size, color) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${C.white}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill" filter="url(#wobble)">${str}</text>`;
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const P = {
  idle: [12, 8, 12, 8], point: [12, 8, 125, 10], wave: [12, 8, 150, -30], cheer: [160, 10, 160, 10],
  shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100], think: [12, 8, 30, -180], paint: [12, 8, 70, -60],
};
// 社長（若い経営者）、職人（創業者）、会社員
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: C.red, pants: '#2c3350', ...o });
const crafts = (o) => kid({ hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', pants: '#4a3a2a', ...o });
const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
const at = (c, k) => c.at(k);
const after = (t, c, k, d = 0) => t >= c.at(k) + d;
// 夜・舞台の背景
const night = () => band(-20, 1120, '#2b3044');
const spot = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.9}" fill="#fff6d8" opacity="0.18"/>`;

export const scenes = [
  // 1 つかみ
  {
    narration: ['マリオ、ゼルダ、ポケモン。', '世界中の子どもが知っている、任天堂。', 'でも130年以上前、任天堂が作っていたのは、', 'ゲームじゃない。カードだった。',
      'しかも一度は、タクシー会社やインスタントごはんにまで', '手を出して、つまずいている。', 'そんな会社が、どうして世界で一番有名な', 'ゲーム会社になれたのか。', '今日はその話をしよう。'],
    draw: (t, c) => {
      let s = night() + spot(1200, 520, 420);
      // ゲーム画面がたくさん → カードに
      if (t > at(c, 6)) {
        s = night() + spot(960, 420, 600);
        s += enter(big('任天堂は', 960, 300, 130, C.white), t, at(c, 6), { cx: 960, cy: 260 });
        s += enter(big('なぜ生き残れた？', 960, 470, 130, C.yellow), t, at(c, 7), { cx: 960, cy: 430 });
      } else if (t < at(c, 2)) {
        for (let i = 0; i < 5; i++) s += xf(tvConsole(0, 0, 0.45, Math.max(0, Math.sin(t * 5 + i))), { x: 380 + i * 300, y: 700 + bob(t, 10, 0.6, i * 0.2), s: popS(t, 0.2 + i * 0.25), cx: 0, cy: -150 });
      } else {
        const k = at(c, 3);
        s += xf(hanafuda(0, 0, 2.2, Math.sin(t * 2) * 6, 0), { x: 1200, y: 540 + bob(t, 10, 0.5), s: popS(t, at(c, 2) + 0.2), cx: 0, cy: 0 });
        s += enter(big('カードの会社だった', 1200, 230, 90, C.yellow), t, k, { cx: 1200, cy: 200 });
        if (t > at(c, 4)) {
          s += xf(taxi(0, 0, 0.6, t * 400), { x: tw(t, at(c, 4), at(c, 4) + 0.8, 2200, 1600), y: 900 });
          s += xf(riceBox(0, 0, 0.55), { x: 1780, y: tw(t, at(c, 4) + 0.6, at(c, 4) + 1.1, -300, 640, ease.back) });
          s += xf(cross(1600, 880, 0.8), { s: popS(t, at(c, 5)), cx: 1600, cy: 880 }) + xf(cross(1780, 640, 0.8), { s: popS(t, at(c, 5) + 0.3), cx: 1780, cy: 640 });
        }
      }
      s += guide({ x: t > at(c, 6) ? 360 : 230, y: 960, s: 1.15, mouth: c.mouth, blink: blinking(t), arms: mix(P.idle, P.point, clamp((t - 0.6) * 3)), look: [1, -0.3] });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 540 });
    },
  },
  // 2 京都の小さなカード屋
  {
    narration: ['はじまりは1889年、京都。', '山内房治郎という職人が、花札を作る店を開いた。', '花札は、松や桜、月や鹿など、', '季節の絵が描かれたカード遊び。',
      '房治郎の花札は「きれいで丈夫だ」と評判になり、', '店は少しずつ大きくなっていく。', 'そして1902年、任天堂は日本で初めて', 'トランプの製造にも乗り出した。', 'カードの会社として、順調なスタートだった。'],
    draw: (t, c) => {
      let s = band(-20, 700, '#f3dcb6') + townRow(760, 7, -200, 340) + band(760, 400, '#d9c3a0');
      s += enter(sign('1889年・京都', 960, 130, { size: 76, fill: C.white }), t, 0.3, { cx: 960, cy: 130 });
      if (t < at(c, 2)) {
        s += xf(shop(960, 900, 1.15), { y: tw(t, 0, 0.6, -900, 0, ease.back) });
        s += crafts({ x: 1500, y: 960, s: 1.0, mouth: 0, blink: blinking(t, 1), arms: mix(P.idle, P.wave, clamp((t - at(c, 1)) * 3)), look: [-1, 0], flip: true });
      } else if (t < at(c, 4)) {
        // 花札の図柄を見せる
        [0, 1, 2, 3].forEach((k, i) => { s += xf(hanafuda(0, 0, 1.5, -12 + i * 8, [1, 2, 0, 3][k]), { x: 480 + i * 320, y: 520 + bob(t, 8, 0.5, i * 0.3), s: popS(t, at(c, 2) + i * 0.3), cx: 0, cy: 0 }); });
      } else if (t < at(c, 6)) {
        // 評判で店が大きくなる・職人が色を塗る
        const grow = tw(t, at(c, 5), at(c, 5) + 1.2, 0.85, 1.15, ease.back);
        s += xf(shop(0, 0, 1), { x: 760, y: 900, s: grow });
        s += crafts({ x: 1400, y: 960, s: 1.05, blink: blinking(t, 1), arms: mix(P.paint, [12, 8, 70, -20], (Math.sin(t * 8) + 1) / 2), look: [1, 0.3] });
        s += hanafuda(1560, 760, 0.7, 10, 2);
        s += enter(bubble('きれい！', 1600, 330, { size: 48 }), t, at(c, 4) + 0.3, { cx: 1600, cy: 330 });
        for (let i = 0; i < 4; i++) s += enter(kid({ x: 180 + i * 120, y: 980, s: 0.55, shirt: [C.blue, C.green, C.pink, C.yellow][i], hair: i % 2 ? 'messy' : 'side', blink: blinking(t, i) }), t, at(c, 4) + 0.4 + i * 0.2, { how: 'left', dist: 600 });
      } else {
        s += xf(playingCard(0, 0, 1.8, -8, '♠'), { x: 760, y: 520, s: popS(t, at(c, 7)), cx: 0, cy: 0 });
        s += xf(playingCard(0, 0, 1.8, 8, '♥', C.red), { x: 1160, y: 520, s: popS(t, at(c, 7) + 0.3), cx: 0, cy: 0 });
        s += enter(sign('日本初のトランプ', 960, 830, { size: 64, fill: C.yellow }), t, at(c, 6) + 0.5, { cx: 960, cy: 830 });
      }
      return camera(s, { z: 1.03, x: tw(t, 0, c.d, 920, 1000, ease.inOut), y: 540 });
    },
  },
  // 3 22歳の社長
  {
    narration: ['1949年、任天堂を継いだのは、', 'わずか22歳の山内溥。', '創業者のひ孫だった。', '若い社長は大胆だった。', '1959年、アメリカの人気キャラクターを',
      'トランプに印刷して売り出すと、これが大ヒット。', 'トランプは、大人の遊び道具から、', '子どもが家族と遊ぶおもちゃに変わった。', '任天堂は、トランプで国内トップクラスの会社になっていく。'],
    draw: (t, c) => {
      let s = band(-20, 760, '#e9e1f2') + band(760, 400, '#c8b8a0');
      if (t < at(c, 4)) {
        const walk = clamp(t / 1.0);
        s += desk(1100, 760, 1.2);
        s += pres({ x: lerp(-200, 760, ease.out(walk)), y: 960, s: 1.25, legs: walk < 1 ? Math.sin(t * 14) : 0, blink: blinking(t, 2),
          arms: after(t, c, 3) ? mix(P.idle, P.cheer, clamp((t - at(c, 3)) * 4)) : P.idle, look: [1, 0], expr: 'smile' });
        s += enter(sign('22歳で社長に', 1250, 220, { size: 70, fill: C.yellow }), t, at(c, 1), { cx: 1250, cy: 220 });
      } else if (t < at(c, 6)) {
        // 箱がどんどん積み上がる
        const n = Math.floor(clamp((t - at(c, 4)) / 2.5) * 12);
        for (let i = 0; i < n; i++) s += cardBox(560 + (i % 4) * 160, 860 - Math.floor(i / 4) * 200, 0.75, [C.sky, C.pink, C.yellow, C.green][i % 4]);
        s += enter(sign('大ヒット！', 1380, 240, { size: 84, fill: C.yellow, rot: -4 + Math.sin(t * 6) * 2 }), t, at(c, 5) + 0.5, { cx: 1380, cy: 240 });
        s += pres({ x: 1500, y: 960, s: 1.0, blink: blinking(t, 2), arms: P.cheer, look: [-1, 0], flip: true, mouth: 0 });
      } else {
        // 家族でトランプ
        s += desk(960, 760, 1.6);
        const fam = [[560, C.blue, 'messy'], [820, C.pink, 'side'], [1100, C.green, 'messy'], [1360, C.orange, 'side']];
        fam.forEach(([x, col, h], i) => { s += kid({ x, y: 960, s: 0.85, shirt: col, hair: h, blink: blinking(t, i), arms: P.hold, tilt: Math.sin(t * 3 + i) * 4, expr: 'smile' }); });
        for (let i = 0; i < 5; i++) s += playingCard(780 + i * 90, 730 - Math.abs(Math.sin(t * 4 + i)) * 30, 0.4, -20 + i * 10, i % 2 ? '♥' : '♠', i % 2 ? C.red : C.ink);
        s += enter(sign('国内トップクラス', 960, 180, { size: 70, fill: C.white }), t, at(c, 8), { cx: 960, cy: 180 });
      }
      return camera(s, { z: 1.02, x: 960, y: 540 });
    },
  },
  // 4 カードの限界
  {
    narration: ['ところが山内は、アメリカで', '世界最大級のトランプ会社を見学したとき、', 'こう思ったと言われている。', '「世界一のトランプ会社でも、この程度の大きさなのか」',
      'カードだけでは、会社はこれ以上大きくなれない。', '山内は、次の柱を探しはじめた。'],
    draw: (t, c) => {
      let s = band(-20, 820, '#cfe6f5') + band(820, 300, '#9a9690');
      if (t < at(c, 1)) {
        s += plane(tw(t, 0, at(c, 1), -300, 2200), 300 + Math.sin(t * 2) * 20, 1.1);
      } else {
        // 高いビル群と、小さな会社
        const z = tw(t, at(c, 2), at(c, 3) + 0.5, 1, 1.6, ease.inOut);
        let city = '';
        [[260, 180, 600], [520, 200, 720], [1400, 220, 680], [1680, 180, 560]].forEach(([x, w, h]) => { city += building(x, 840, w, h); });
        city += building(960, 840, 200, 220, '#d8b080') + text('トランプ会社', 960, 590, { size: 40, font: 'Zen Maru Gothic', weight: 900 });
        s += camera(city, { z, x: 960, y: lerp(540, 700, (z - 1) / 0.6) });
        s += pres({ x: 1560, y: 980, s: 1.0, expr: after(t, c, 3) ? 'wow' : 'smile', blink: blinking(t, 3), look: [-1, -0.5], flip: true,
          arms: after(t, c, 4) ? P.think : P.idle, mouth: 0 });
        if (after(t, c, 3)) s += enter(bubble('この程度…？', 1450, 300, { size: 56 }), t, at(c, 3), { cx: 1450, cy: 300 });
        if (after(t, c, 5)) s += enter(big('次の柱は？', 700, 260, 120, C.red), t, at(c, 5), { cx: 700, cy: 220 });
      }
      return s;
    },
  },
  // 5 失敗つづき
  {
    narration: ['1960年代、任天堂は、本業とは関係のない商売に', '次々と手を出した、とされている。', 'タクシー会社。', 'お湯をかけるだけのインスタントライス。', 'でも、どれもうまくいかなかった。',
      'カードとは、技術も売り方もまったく違う分野で、', '強みがなかったんだ。', 'さらに、ブームが去って、トランプの売れゆきも落ちていく。', '会社は、行き場を失いかけていた。'],
    draw: (t, c) => {
      let s = band(-20, 840, '#dfe3ea') + band(840, 300, '#a9a39a');
      const t2 = at(c, 2), t3 = at(c, 3), t4 = at(c, 4);
      if (t > t2) s += taxi(tw(t, t2, t2 + 1.0, -500, 640, ease.out), 760, 0.95, t < t2 + 1 ? t * 500 : 0);
      if (t > t3) s += xf(riceBox(1300, 700, 0.9), { y: tw(t, t3, t3 + 0.5, -900, 0, ease.back) });
      const sk = shake(t, t4, 0.5) + shake(t, t4 + 0.4, 0.5);
      s += xf(cross(640, 660, 1.1), { s: popS(t, t4), cx: 640, cy: 660 }) + xf(cross(1300, 680, 1.1), { s: popS(t, t4 + 0.4), cx: 1300, cy: 680 });
      if (after(t, c, 7)) s += xf(chartDown(0, 0, 0.8, tw(t, at(c, 7), at(c, 7) + 2, 0, 1, (k) => k)), { x: 1580, y: 260, s: popS(t, at(c, 7)), cx: 0, cy: 0 });
      s += pres({ x: 230 + sk, y: 980, s: 1.0, expr: after(t, c, 4) ? 'worry' : 'smile', sweat: after(t, c, 4), blink: blinking(t, 4), look: [1, 0],
        arms: after(t, c, 4) ? P.shrug : mix(P.idle, P.point, clamp((t - t2) * 3)), mouth: 0 });
      if (after(t, c, 8)) s += rainCloud(260, 380, t, 0.9);
      return camera(s, { z: 1.02, x: 960 + sk * 0.6, y: 540 });
    },
  },
  // 6 ひまつぶしのおもちゃ
  {
    narration: ['そのころ、任天堂の工場には、', 'カードを作る機械の点検係として働く', '若い技術者がいた。横井軍平だ。', '横井は、仕事のあいまに、', 'のびたりちぢんだりする「手」のおもちゃを作って遊んでいた。',
      'それを見つけた山内は、こう言ったと伝えられている。', '「それを商品にしろ」', '1966年に発売された「ウルトラハンド」は、大ヒット。', '任天堂は、おもちゃの会社として生まれ変わりはじめた。'],
    draw: (t, c) => {
      let s = band(-20, 820, '#d6e4dc') + band(820, 300, '#8f9a92');
      s += gear(1650, 200, 110, t * 40) + gear(1820, 330, 80, -t * 55, '#8e8a84') + gear(200, 180, 90, -t * 35);
      if (t < at(c, 3)) {
        s += poly([[900, 860], [900, 480], [1300, 480], [1300, 860]], { fill: '#a8a29a' }) + gear(1100, 640, 90, t * 90, C.gray);
        s += worker({ x: 640, y: 960, s: 1.3, blink: blinking(t, 5), arms: mix(P.idle, [12, 8, 90, 20], (Math.sin(t * 6) + 1) / 2), look: [1, 0] });
        s += enter(sign('点検係の若者', 640, 260, { size: 64, fill: C.white }), t, at(c, 1), { cx: 640, cy: 260 });
      } else if (t < at(c, 5)) {
        const ext = 0.5 - 0.5 * Math.cos(t * 2.4);
        s += worker({ x: 520, y: 960, s: 1.4, arms: P.hold, blink: blinking(t, 5), look: [1, 0], tilt: Math.sin(t * 2.4) * 3 });
        s += extendHand(600, 810, 1.3, ext);
        const grabbed = ext > 0.9 || t % 5 > 2.5;
        s += ball(grabbed ? 600 + 6 * (22 + 48 * ext) * 1.3 + 90 : 1300, grabbed ? 810 : 900 - Math.abs(Math.sin(t * 3)) * 60, 40, C.red);
      } else if (!after(t, c, 7)) {
        s += worker({ x: 420, y: 960, s: 1.2, arms: P.hold, blink: blinking(t, 5), look: [1, 0] });
        s += extendHand(490, 830, 1.1, 0.4 + 0.3 * Math.sin(t * 3));
        s += enter(pres({ x: 1450, y: 980, s: 1.1, expr: after(t, c, 6) ? 'smile' : 'wow', flip: true, look: [-1, 0], blink: blinking(t, 6),
          arms: after(t, c, 6) ? [12, 8, 125, 10] : P.idle, mouth: 0 }), t, at(c, 5) - 0.2, { how: 'right', dist: 700 });
        if (after(t, c, 6)) s += enter(bubble('それを商品にしろ', 1340, 330, { size: 52 }), t, at(c, 6), { cx: 1340, cy: 330 });
      } else {
        {
          s = band(-20, 1120, '#fbf3df');
          const n = Math.floor(clamp((t - at(c, 7)) / 2) * 15);
          for (let i = 0; i < n; i++) s += g2(extendHand(0, 0, 0.45, 0.2), 380 + (i % 5) * 260, 900 - Math.floor(i / 5) * 160);
          s += enter(sign('大ヒット！', 960, 200, { size: 96, fill: C.yellow, rot: -4 + Math.sin(t * 6) * 2 }), t, at(c, 7) + 0.4, { cx: 960, cy: 200 });
          s += worker({ x: 1650, y: 980, s: 0.9, arms: P.cheer, blink: blinking(t, 5), mouth: 0 });
        }
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 540 });
    },
  },
  // 7 枯れた技術の水平思考
  {
    narration: ['横井には、のちに有名になる考え方があった。', '「枯れた技術の水平思考」。', '「枯れた技術」とは、もう新しくない、', 'ありふれて安くなった技術のこと。', 'それを、まったく別の使い方に、横にずらして、',
      '新しい遊びを作る。', '最新の技術で勝負しない。', 'だから安く作れて、壊れにくい。', 'これが、任天堂の武器になっていく。'],
    draw: (t, c) => {
      let s = band(-20, 1120, '#eef3e2');
      s += enter(big('枯れた技術の', 960, 220, 110, C.ink), t, at(c, 1), { cx: 960, cy: 190 });
      s += enter(big('水平思考', 960, 380, 140, C.green), t, at(c, 1) + 0.5, { cx: 960, cy: 340 });
      const slide = tw(t, at(c, 4), at(c, 5), 0, 1, ease.inOut);
      if (after(t, c, 2)) {
        const parts = calculator(0, 0, 0.6) + g2(bulb(0, 0, 0.5, 0), 150, 20) + gear(-140, 30, 60, t * 30);
        s += xf(parts, { x: lerp(520, 1450, slide), y: 720, s: popS(t, at(c, 2)) * (1 - slide * 0.6) });
        s += enter(text('ありふれた部品', 520, 920, { size: 54, font: 'Zen Maru Gothic', weight: 700 }), t, at(c, 3), { cx: 520, cy: 900 });
      }
      if (after(t, c, 4)) s += arrow(700, 640, lerp(700, 1200, slide), 640, { w: 14, head: 50 });
      if (after(t, c, 5)) {
        s += xf(handheld(1450, 720, 0.85, (t * 0.8) % 1), { s: popS(t, at(c, 5)), cx: 1450, cy: 720 });
        s += enter(text('新しい遊び', 1450, 920, { size: 54, color: C.red, font: 'Zen Maru Gothic', weight: 700 }), t, at(c, 5) + 0.3, { cx: 1450, cy: 900 });
      }
      if (after(t, c, 7)) {
        s += enter(sign('安い！', 1250, 520, { size: 60, fill: C.yellow }), t, at(c, 7), { cx: 1250, cy: 520 });
        s += enter(sign('こわれにくい！', 1680, 520, { size: 52, fill: C.white, rot: 4 }), t, at(c, 7) + 0.6, { cx: 1680, cy: 520 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1.04, 1, ease.inOut), x: 960, y: 540 });
    },
  },
  // 8 電卓からゲーム機へ
  {
    narration: ['あるとき横井は、新幹線の中で、', '電卓をいじって暇をつぶす人を見かけたという。', '「電卓くらいの大きさのゲームがあれば、', '大人も遊ぶんじゃないか」', '1980年に出た「ゲーム&ウオッチ」は、',
      '電卓に使われていた液晶の技術で作られた、', '手のひらサイズのゲーム機。', 'これが、世界中で大ヒットした。', 'そこで生まれた十字のボタン「十字キー」は、', '1983年のファミリーコンピュータにも受け継がれていく。'],
    draw: (t, c) => {
      let s = '';
      if (t < at(c, 4)) {
        // 窓の外の景色が流れる車内
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
        s += worker({ x: 1400, y: 980, s: 1.1, flip: true, look: [-1, 0], blink: blinking(t, 5), arms: after(t, c, 2) ? P.think : P.idle, mouth: 0 });
        if (after(t, c, 2)) s += xf(bulb(1400, 420, 0.7, 1), { s: popS(t, at(c, 2)), cx: 1400, cy: 400 });
      } else if (t < at(c, 8)) {
        s += band(-20, 1120, '#fbf3df');
        const m = tw(t, at(c, 5), at(c, 6), 0, 1, ease.inOut);
        if (m < 1) s += xf(calculator(0, 0, 1.0), { x: 960, y: 560, s: 1 - m, cx: 0, cy: 0 });
        if (m > 0) s += xf(handheld(0, 0, 1.2, (t * 0.8) % 1), { x: 960, y: 560, s: m, cx: 0, cy: 0 });
        s += enter(sign('1980年', 960, 160, { size: 70, fill: C.white }), t, at(c, 4), { cx: 960, cy: 160 });
        if (after(t, c, 7)) for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + t * 0.4;
          s += xf(handheld(0, 0, 0.3, (t + i) % 1), { x: 960 + Math.cos(a) * 700, y: 560 + Math.sin(a) * 360, s: popS(t, at(c, 7) + i * 0.1), cx: 0, cy: 0 });
        }
      } else {
        s += band(-20, 1120, '#e8eaf6');
        s += xf(dpad(0, 0, 2.2), { x: tw(t, at(c, 9), at(c, 9) + 1.2, 960, 560, ease.inOut), y: 520, s: popS(t, at(c, 8)) * tw(t, at(c, 9), at(c, 9) + 1.2, 1, 0.6), cx: 0, cy: 0 });
        s += enter(sign('十字キー', 960, 200, { size: 80, fill: C.yellow }), t, at(c, 8) + 0.3, { cx: 960, cy: 200 });
        if (after(t, c, 9)) s += xf(tvConsole(1380, 760, 0.9, Math.max(0, Math.sin(t * 6))), { s: popS(t, at(c, 9) + 0.8), cx: 1380, cy: 600 });
      }
      return camera(s, { z: 1.02, x: 960, y: 540 });
    },
  },
  // 9 白黒でも勝てた理由
  {
    narration: ['1989年、横井たちのチームが作った', 'ゲームボーイの画面は、白黒だった。', 'ライバルの中には、カラー画面の携帯ゲーム機もあった。', 'でも、カラーは電池がすぐ切れて、値段も高い。',
      '白黒のゲームボーイは、安くて、電池が長持ち。', '結果は、ゲームボーイの圧勝だった。', 'ここでも「枯れた技術」が勝ったんだ。'],
    draw: (t, c) => {
      let s = band(-20, 1120, '#f1ece2');
      const t3 = at(c, 3);
      const lvA = tw(t, t3, t3 + 3, 1, 0.75, (k) => k), lvB = tw(t, t3, t3 + 2.2, 1, 0, (k) => k);
      s += xf(bwHandheld(0, 0, 1.0, (t * 0.7) % 1, 0), { x: 560, y: 560, s: popS(t, 0.3), cx: 0, cy: 0 });
      if (after(t, c, 2)) s += xf(colorHandheld(0, 0, 0.9, lvB < 0.05 ? 1 : 0), { x: 1360, y: 520, s: popS(t, at(c, 2)), cx: 0, cy: 0 });
      s += enter(sign('白黒', 560, 140, { size: 64, fill: C.white }), t, at(c, 1), { cx: 560, cy: 140 });
      if (after(t, c, 2)) s += enter(sign('カラー', 1360, 140, { size: 64, fill: C.white }), t, at(c, 2) + 0.3, { cx: 1360, cy: 140 });
      if (after(t, c, 3)) {
        s += battery(560, 880, 0.9, after(t, c, 4) ? 1 : lvA) + battery(1360, 820, 0.9, lvB);
        s += enter(sign('高い！', 1680, 300, { size: 56, fill: C.pink, rot: 6 }), t, t3 + 1.2, { cx: 1680, cy: 300 });
      }
      if (after(t, c, 4)) s += enter(sign('安い！長持ち！', 900, 760, { size: 46, fill: C.yellow, rot: -6 }), t, at(c, 4), { cx: 900, cy: 760 });
      if (after(t, c, 5)) {
        s += xf(trophy(0, 0, 1.1), { x: 860, y: 380, s: popS(t, at(c, 5)), cx: 0, cy: 0 });
        for (let i = 0; i < 3; i++) s += enter(kid({ x: 160 + i * 130, y: 1000, s: 0.6, shirt: [C.blue, C.green, C.pink][i], arms: P.cheer, blink: blinking(t, i), expr: 'smile' }), t, at(c, 5) + 0.3 + i * 0.15, { how: 'left', dist: 600 });
      }
      return camera(s, { z: tw(t, 0, c.d, 1, 1.04, ease.inOut), x: 960, y: 540 });
    },
  },
  // 10 まとめ
  {
    narration: ['任天堂が強いのは、すごい性能よりも', '「おもしろい遊び方」で勝負してきたから。', 'そしてその始まりは、カード屋のピンチと、', 'ひとりの社員のひまつぶしだった。',
      'あなたが最初に遊んだ任天堂のゲーム、何だった？', 'コメントで教えてね。'],
    draw: (t, c) => {
      let s = band(-20, 1120, '#fdf1dc');
      const items = [
        (x, y) => hanafuda(x, y, 0.8, t * 30, 1), (x, y) => extendHand(x - 120, y, 0.45, 0.5 + 0.5 * Math.sin(t * 3)),
        (x, y) => handheld(x, y, 0.5, t % 1), (x, y) => bwHandheld(x, y, 0.4, t % 1), (x, y) => playingCard(x, y, 0.7, -t * 30, '♥', C.red),
      ];
      items.forEach((f, i) => {
        const a = t * 0.6 + (i / items.length) * Math.PI * 2;
        s += f(960 + Math.cos(a) * 700, 560 + Math.sin(a) * 330);
      });
      s += enter(big('性能より「遊び方」', 960, 190, 110, C.red), t, 0.2, { cx: 960, cy: 160 });
      const pump = Math.sin(t * 4) * 0.5 + 0.5;
      s += guide({ x: 960, y: 940 - pump * 14, s: 1.3, mouth: c.mouth, blink: blinking(t, 9), arms: after(t, c, 4) ? P.wave : mix(P.cheer, P.idle, pump * 0.3) });
      if (after(t, c, 5)) s += enter(sign('チャンネル登録', 1560, 560, { size: 58, fill: C.red, color: C.white, rot: -3 }), t, at(c, 5), { cx: 1560, cy: 560 });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 560 });
    },
  },
];

// 小物を好きな位置に置く
function g2(inner, x, y) { return `<g transform="translate(${x} ${y})">${inner}</g>`; }
