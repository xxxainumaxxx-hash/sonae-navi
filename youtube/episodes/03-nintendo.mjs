// 試作第3話：任天堂は、なぜ生き残れたのか（クレヨン×アニメ版）
// draw(t, ctx)：t＝場面の中の秒数。ctx.mouth＝口パク(0〜1)、ctx.at(k)＝k番目の文が始まる秒
import { C, text } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, camera, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { guide, boss, worker } from '../lib/cfolk.mjs';
import { card, shop, taxi, riceBox, extendHand, calculator, handheld, tvConsole, bulb, gear, chartDown, cross, sign, arrow } from '../lib/cprops.mjs';

export const meta = {
  id: '03-nintendo',
  title: '任天堂は、なぜ生き残れたのか',
  description: 'カード屋さんから始まった任天堂。失敗続きの時代に会社を救ったのは、社員が遊びで作ったおもちゃだった。',
  theme: 'crayon',
};

// クレヨンの極太見出し（白フチ）
const big = (str, x, y, size, color) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${C.white}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill" filter="url(#wobble)">${str}</text>`;
// 腕のポーズを途中でなめらかに切りかえる
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], wave: [12, 8, 150, -30], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100] };

export const scenes = [
  // 1 つかみ
  {
    narration: ['任天堂は、もともとゲームの会社じゃなかった。', 'じゃあ、なんで世界中で遊ばれる会社になれたのか？'],
    draw: (t, c) => {
      const walk = clamp(t / 0.9);
      const gx = lerp(-200, 520, ease.out(walk));
      const armWave = t > 1 ? Math.sin(t * 5) * 12 : 0;
      let s = '';
      s += enter(big('任天堂は', 960, 200, 120, C.ink), t, 0.15, { cx: 960, cy: 160 });
      s += enter(big('なぜ生き残れた？', 1000, 350, 120, C.red), t, 0.55, { cx: 1000, cy: 310 });
      s += xf(card(0, 0, 1.15, -14 + bob(t, 4, 0.5), 0), { x: 1180, y: 600 + bob(t, 12, 0.6), s: popS(t, 0.9) });
      s += xf(card(0, 0, 1.15, 10 + bob(t, 4, 0.5, 0.3), 1), { x: 1420, y: 590 + bob(t, 12, 0.6, 0.4), s: popS(t, 1.15) });
      s += xf(handheld(0, 0, 0.8, (t * 0.7) % 1), { x: 1320, y: 860 + bob(t, 8, 0.7, 0.2), s: popS(t, 1.5) });
      s += guide({ x: gx, y: 930 + (walk < 1 ? -Math.abs(Math.sin(t * 14)) * 14 : 0), s: 1.25, legs: walk < 1 ? Math.sin(t * 14) : 0,
        arms: walk < 1 ? P.idle : mix(P.idle, [12, 8, 125 + armWave, 10], clamp((t - 0.9) * 4)), mouth: c.mouth, blink: blinking(t), look: [1, -0.4] });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.06, ease.inOut), x: 960, y: 560 });
    },
  },
  // 2 はじまり
  {
    narration: ['始まりは1889年の京都。', '花札という、絵の描かれたカードを作る、小さなお店だった。'],
    draw: (t, c) => {
      let s = '';
      s += xf(shop(960, 840, 1.2), { y: tw(t, 0, 0.6, -900, 0, ease.back) });
      s += enter(sign('1889年・京都', 960, 150, { size: 70, fill: C.white }), t, 0.5, { cx: 960, cy: 150 });
      s += xf(card(0, 0, 0.9, -15 + bob(t, 6, 0.4), 1), { x: 360, y: 430 + bob(t, 18, 0.5), s: popS(t, c.at(1)) });
      s += xf(card(0, 0, 0.9, 12 + bob(t, 6, 0.4, 0.5), 0), { x: 1560, y: 400 + bob(t, 18, 0.5, 0.5), s: popS(t, c.at(1) + 0.25) });
      s += guide({ x: 1640, y: 920, s: 0.95, mouth: c.mouth, blink: blinking(t, 1), arms: P.point, flip: true, look: [-1, 0] });
      return camera(s, { z: 1.04, x: tw(t, 0, c.d, 900, 1020, ease.inOut), y: 560 });
    },
  },
  // 3 失敗つづき
  {
    narration: ['でも1960年代、カードの売れゆきが落ちていく。', 'あせった会社は、タクシーやインスタントのごはんなど、', 'いろんな商売に手を出すけど、うまくいかなかった。'],
    draw: (t, c) => {
      const t2 = c.at(1);
      const taxiIn = tw(t, t2, t2 + 1.0, -500, 980, ease.out);
      const x1 = t2 + 1.3, x2 = t2 + 2.6, x3 = t2 + 3.2;
      const sk = shake(t, x1, 0.4) + shake(t, x3, 0.4);
      let s = '';
      s += xf(chartDown(420, 320, 0.9, tw(t, 0.4, 2.6, 0, 1, (k) => k)), { s: popS(t, 0.1), cx: 420, cy: 320 });
      if (t > t2) s += taxi(taxiIn, 660, 0.95, t * 400);
      s += xf(cross(980, 560, 1), { s: popS(t, x1), cx: 980, cy: 560 });
      s += enter(riceBox(1500, 640, 0.9), t, x2, { how: 'up', dist: 900 });
      s += xf(cross(1500, 600, 1), { s: popS(t, x3), cx: 1500, cy: 600 });
      const worry = Math.sin(t * 3) * 0.5 + 0.5;
      s += boss({ x: 300 + sk, y: 920, s: 1.05, expr: 'worry', sweat: true, arms: mix(P.idle, P.shrug, t > t2 + 1.3 ? 1 : worry * 0.4), blink: blinking(t, 2), look: [1, 0], tilt: Math.sin(t * 2) * 3 });
      return camera(s, { z: 1.02, x: 960 + sk * 0.5, y: 540 });
    },
  },
  // 4 のびる手
  {
    narration: ['そんなとき、工場で機械を直していた若い社員が、', 'ひまつぶしに作った「のびる手」のおもちゃ。', 'これを社長が見つけて商品にしたら、大ヒットした。'],
    draw: (t, c) => {
      const t2 = c.at(2);
      const ext = 0.5 - 0.5 * Math.cos(t * 2.4);
      let s = '';
      s += gear(1680, 200, 100, t * 40) + gear(1840, 330, 72, -t * 55, '#8e8a84');
      s += xf(text('工場', 260, 200, { size: 80, color: C.gray, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(t, 0.2), cx: 260, cy: 170 });
      s += worker({ x: 520, y: 920, s: 1.4, arms: P.hold, blink: blinking(t, 3), look: [1, 0], tilt: Math.sin(t * 2.4) * 3 });
      s += xf(extendHand(600, 770, 1.3, ext), { s: popS(t, c.at(1)), cx: 560, cy: 770 });
      if (t > t2 - 0.2) {
        s += enter(boss({ x: 1560, y: 920, s: 1.05, expr: t > t2 + 0.6 ? 'wow' : 'smile', flip: true, look: [-1, 0], blink: blinking(t, 4),
          arms: t > t2 + 0.6 ? mix(P.idle, P.cheer, clamp((t - t2 - 0.6) * 4)) : P.idle }), t, t2 - 0.2, { how: 'right', dist: 700 });
        s += xf(bulb(1560, 360, 0.85, clamp((t - t2 - 0.6) * 3)), { s: popS(t, t2 + 0.6), cx: 1560, cy: 340 });
        s += enter(sign('大ヒット！', 960, 170, { size: 84, fill: C.yellow, rot: -4 + Math.sin(t * 6) * 2 }), t, t2 + 1.0, { cx: 960, cy: 170 });
      }
      return camera(s, { z: tw(t, t2, t2 + 1.5, 1, 1.08, ease.inOut), x: tw(t, t2, t2 + 1.5, 960, 1100, ease.inOut), y: 560 });
    },
  },
  // 5 考え方
  {
    narration: ['その社員の考え方が「枯れた技術の水平思考」。', '最新の技術じゃなく、安くなったありふれた技術を、', '新しい遊びに使うこと。'],
    draw: (t, c) => {
      const t2 = c.at(1);
      let s = '';
      s += enter(big('枯れた技術の', 960, 230, 110, C.ink), t, 0.2, { cx: 960, cy: 200 });
      s += enter(big('水平思考', 960, 390, 140, C.green), t, 0.7, { cx: 960, cy: 350 });
      s += enter(calculator(500, 660, 0.8), t, t2, { how: 'left', dist: 900 });
      s += xf(bulb(760, 660, 0.6, 0), { s: popS(t, t2 + 0.4), cx: 760, cy: 640 });
      const k = tw(t, t2 + 1.0, t2 + 1.7, 0, 1);
      if (k > 0.05) s += arrow(920, 650, lerp(920, 1180, k), 650, { w: 12, head: 46 });
      s += xf(handheld(1480, 650, 0.85, (t * 0.8) % 1), { s: popS(t, t2 + 1.8), cx: 1480, cy: 650 });
      s += enter(text('ふつうの部品', 630, 870, { size: 54, font: 'Zen Maru Gothic', weight: 700 }), t, t2 + 0.5, { cx: 630, cy: 850 });
      s += enter(text('新しい遊び', 1480, 870, { size: 54, color: C.red, font: 'Zen Maru Gothic', weight: 700 }), t, t2 + 2.0, { cx: 1480, cy: 850 });
      return camera(s, { z: tw(t, 0, c.d, 1.05, 1, ease.inOut), x: 960, y: 540 });
    },
  },
  // 6 ゲーム機へ
  {
    narration: ['たとえば、電卓の部品を使った携帯ゲーム機が大ヒット。', 'この流れが、のちの家庭用ゲーム機につながっていく。'],
    draw: (t, c) => {
      const t2 = c.at(1);
      let s = '';
      s += xf(calculator(300, 600, 0.75), { s: popS(t, 0.1), cx: 300, cy: 600 });
      s += enter(sign('電卓', 300, 360, { size: 52, fill: C.white }), t, 0.3, { cx: 300, cy: 360 });
      const k1 = tw(t, 0.8, 1.3, 0, 1); if (k1 > 0.05) s += arrow(430, 600, lerp(430, 580, k1), 600, { w: 12, head: 40 });
      s += xf(handheld(820, 600, 0.75, (t * 0.8) % 1), { s: popS(t, 1.4), cx: 820, cy: 600 });
      s += enter(sign('携帯ゲーム機', 820, 400, { size: 52, fill: C.white }), t, 1.6, { cx: 820, cy: 400 });
      const k2 = tw(t, t2, t2 + 0.5, 0, 1); if (k2 > 0.05) s += arrow(1010, 600, lerp(1010, 1160, k2), 600, { w: 12, head: 40 });
      const hop = Math.max(0, Math.sin(t * 6));
      s += xf(tvConsole(1500, 720, 0.9, hop), { s: popS(t, t2 + 0.6), cx: 1500, cy: 600 });
      s += enter(sign('家庭用ゲーム機', 1460, 240, { size: 52, fill: C.yellow }), t, t2 + 0.9, { cx: 1460, cy: 240 });
      return camera(s, { z: tw(t, t2, c.d, 1, 1.06, ease.inOut), x: tw(t, t2, c.d, 960, 1100, ease.inOut), y: 560 });
    },
  },
  // 7 まとめ
  {
    narration: ['任天堂が強いのは、すごい性能よりも', '「おもしろい遊び方」で勝負してきたから。', 'あなたが最初に遊んだゲーム、何だった？'],
    draw: (t, c) => {
      let s = '';
      const orbit = (k, r, ph) => [960 + Math.cos(t * 0.8 + ph) * r, 560 + Math.sin(t * 0.8 + ph) * r * 0.45];
      const [ax, ay] = orbit(0, 620, 0), [bx, by] = orbit(0, 620, 2.1), [cx2, cy2] = orbit(0, 620, 4.2);
      s += card(ax, ay, 0.8, t * 30, 0) + handheld(bx, by, 0.55) + card(cx2, cy2, 0.8, -t * 30, 1);
      s += enter(big('性能より「遊び方」', 960, 200, 110, C.red), t, 0.2, { cx: 960, cy: 170 });
      const pump = Math.sin(t * 4) * 0.5 + 0.5;
      s += guide({ x: 960, y: 930 - pump * 16, s: 1.3, mouth: c.mouth, blink: blinking(t, 5), arms: mix(P.cheer, P.wave, t > c.at(2) ? 1 : pump * 0.3), look: [0, 0] });
      return camera(s, { z: tw(t, 0, c.d, 1, 1.05, ease.inOut), x: 960, y: 560 });
    },
  },
];
