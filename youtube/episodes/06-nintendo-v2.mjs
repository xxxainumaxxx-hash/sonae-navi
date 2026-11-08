// 任天堂 v2：新しい映像ルール（1行＝1カット、アップ、赤×白、タイプ文字）で作り直す試作。冒頭の3場面＋章タイトル
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, text, line, ellipse, rect, poly } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import { taxi, riceBox, extendHand, handheld, cross, sign, shop, hanafuda, playingCard, cardBox, townRow, desk, ball, rainCloud, bubble } from '../lib/cprops.mjs';
import { shots, cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const md = fs.readFileSync(path.join(HERE, '../scripts/long-01-nintendo.md'), 'utf8');
const body = md.split('## 台本')[1].split('## ショートの')[0];
const NAR = body.split(/^### 【\d+】.*$/m).slice(1).map((b) => b.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim()));

export const meta = { id: '06-nintendo-v2', title: '任天堂は、なぜ生き残れたのか（v2試作）', theme: 'crayon' };

// 任天堂の赤と白
const RED = '#d23a33', DEEP = '#7e1f1c', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', NIGHT = '#23263a';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [20, -100, 20, -100], paint: [12, 8, 70, -60], wave: [12, 8, 150, -30], hips: [50, -90, 50, -90] };
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
const crafts = (o) => kid({ hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', pants: '#4a3a2a', ...o });
// バストアップ：顔が画面の上3分の1あたりに来るよう大きく置く
// 人物は基本「腰から上（画面の高さの5〜6割）」。close: true のときだけ顔のアップ
const bust = (fn, x, o = {}) => { const { close, ...r } = o; return fn({ x, ...r, y: close ? 1290 : 1100, s: close ? (r.s || 3.0) : 1.85 }); };

// 職人が作業台で、筆を持って花札に色を塗っている（腰から上）
function paintingCloseup(tl) {
  const k = 0.25 + 0.75 * clamp(tl / 2.4); // 塗り終わった割合
  let s = glow(1260, 560, 700, '#fff3d6', 0.35);
  // 奥の壁に、できあがった札を並べた棚
  s += rect(80, 290, 560, 16, { fill: C.brown, w: 4 }) + [0, 1, 2, 3].map((i) => hanafuda(150 + i * 135, 230, 0.42, -4 + i * 3, i)).join('');
  // 職人（右手を上げて筆を持つ）
  s += crafts({ x: 700, y: 1100, s: 1.85, arms: [12, 8, 100, -50], blink: blinking(tl, 3), expr: 'smile', look: [1, 0.3] });
  // 塗る前の白い札 → 左から色が入っていく
  const cx = 1270, cy = 610, sc = 2.2;
  s += `<g transform="translate(${cx} ${cy}) rotate(4) scale(${sc})">${rect(-70, -110, 140, 220, { fill: C.white })}</g>`;
  const w = 330 * k;
  s += `<clipPath id="paintclip"><rect x="${cx - 165}" y="${cy - 260}" width="${w}" height="520"/></clipPath><g clip-path="url(#paintclip)">${hanafuda(cx, cy, sc, 4, 1)}</g>`;
  // 筆：手から、いま塗っている所へ
  const tipx = cx - 150 + w, tipy = cy - 80 + Math.sin(tl * 8) * 120;
  s += line([[1013, 815], [tipx, tipy]], { w: 16, color: '#8a5a34', passes: 1 }) + ellipse(tipx, tipy, 16, 24, { fill: C.red, w: 5 });
  s += ellipse(1013, 815, 30, 30, { fill: C.skin, w: 6 });
  // 手前の作業台（足を隠す）
  s += `<rect x="-200" y="872" width="2400" height="500" fill="#a8774a"/>` + rect(-200, 870, 2400, 500, { fill: '#a8774a', w: 6 }) + ellipse(560, 920, 90, 22, { fill: C.red, w: 4 }) + ellipse(760, 930, 70, 18, { fill: C.green, w: 4 }) + ellipse(400, 935, 60, 16, { fill: C.yellow, w: 4 });
  return s;
}

export const scenes = [
  // ───── つかみ（約2秒ごとにカット）
  {
    narration: NAR[0],
    list: (c) => [
      // 0 花札を手で塗っていた、京都の小さな店。
      (tl, d) => {
        if (tl < d * 0.6) return cam(fill(SEPIA) + paintingCloseup(tl), tl, d * 0.6, { z0: 1.0, z1: 1.1, x0: 960, x1: 1060, y0: 540 });
        return cam(fill(SEPIA) + townRow(820, 7, -200, 340) + fill('none') + shop(960, 900, 1.25), tl - d * 0.6, d * 0.4, { z0: 1.3, z1: 1.0, y0: 620, y1: 560 });
      },
      // 1 その店が130年後、ゲーム機を1億5000万台以上売る会社になる。
      (tl, d) => {
        let s = fill(RED) + glow(960, 520, 700, '#ffffff', 0.12);
        for (let i = 0; i < 9; i++) s += xf(handheld(0, 0, 0.42, (tl + i) % 1), { x: 260 + (i % 3) * 700 + (i > 2 ? 100 : 0), y: 230 + Math.floor(i / 3) * 300, s: popS(tl, i * 0.15), cx: 0, cy: 0 });
        s += `<rect x="260" y="400" width="1400" height="300" rx="40" fill="${INK}" opacity="0.85"/>`;
        s += big(countUp(150000000, tl, 1.8), 960, 600, 170, C.yellow, { stroke: INK });
        s += typeText('台以上', 960, 680, tl, { size: 60, color: C.white, delay: 1.6 });
        return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
      },
      // 2 任天堂だ。
      (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, RED, 0.1) + xf(big('任天堂', 960, 640, 300, RED), { s: popS(tl, 0, 0.3), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.1 }),
      // 3 だがその途中、タクシー会社やインスタントごはんに…つぶれかけている。
      (tl, d) => {
        let s = fill('#9aa0a8') + rainCloud(960, 140, tl, 2.0);
        s += taxi(tw(tl, 0, 0.8, -400, 560, ease.out), 760, 1.4, tl * 500);
        s += xf(riceBox(1400, 640, 1.3), { y: tw(tl, 0.6, 1.1, -900, 0, ease.back) });
        s += xf(cross(560, 640, 1.6), { s: popS(tl, d * 0.6), cx: 560, cy: 640 }) + xf(cross(1400, 620, 1.6), { s: popS(tl, d * 0.6 + 0.2), cx: 1400, cy: 620 });
        const sk = shake(tl, d * 0.6, 0.5, 16);
        return cam(s, tl, d, { z0: 1.05, z1: 1.0, x0: 960 + sk });
      },
      // 4 救ったのは、すごい発明ではない。ひとりの社員の「ひまつぶし」だった。
      (tl, d) => {
        const ext = 0.5 - 0.5 * Math.cos(tl * 2.6);
        let s = fill(NIGHT) + glow(900, 560, 520);
        s += worker({ x: 520, y: 1290, s: 2.6, arms: P.hold, blink: blinking(tl, 5), look: [1, 0] }) + extendHand(620, 930, 2.0, ext);
        s += ball(620 + 6 * (22 + 48 * ext) * 2.0 + 140, 930, 70, RED);
        return cam(s, tl, d, { z0: 1.0, z1: 1.12, x0: 900 });
      },
      // 5 今回は、任天堂が130年生き残ってきた理由を見ていきましょう。
      (tl, d, t) => cam(fill(RED) + glow(700, 500, 600, '#fff', 0.15) + bust(guide, 620, { mouth: c.mouth, blink: blinking(t), arms: P.point, look: [1, -0.3] }) +
        xf(big('130年', 1400, 420, 170, C.white, { stroke: INK }), { s: popS(tl, 0.3), cx: 1400, cy: 360 }) + typeText('生き残った理由', 1400, 600, tl, { size: 80, color: C.yellow, delay: 0.6 }), tl, d, { z0: 1.0, z1: 1.06, x0: 900 }),
      // 6 物語は、1889年の京都から始まる。
      (tl) => fill('#111') + typeText('1889年　京都', 960, 580, tl, { size: 110, color: C.white, cps: 6, font: 'Yomogi', weight: 400 }),
    ],
  },
  // ───── 第1章のタイトル（約2.2秒・声なし）
  {
    narration: [], silent: 2.4,
    draw: (t) => fill(RED) + typeText('第1章', 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
      typeText('花札屋、つぶれかける', 960, 620, t, { size: 120, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 }),
  },
  // ───── 京都の花札屋
  {
    narration: NAR[1],
    list: (c) => [
      // 0 始まりは1889年、京都。
      (tl, d) => cam(fill(SEPIA) + glow(960, 300, 900, '#fff', 0.2) + townRow(860, 9, -400, 340) + rect(-200, 860, 2400, 400, { fill: '#cdb38a', color: null }) +
        enter(sign('1889年・京都', 960, 160, { size: 80, fill: C.white }), tl, 0.2, { cx: 960, cy: 160 }), tl, d, { z0: 1.0, z1: 1.0, x0: 760, x1: 1160 }),
      // 1 山内房治郎という職人が、花札を作る小さな店を開いた。
      (tl, d, t) => cam(fill(SEPIA) + townRow(760, 7, -200, 340) + shop(560, 900, 1.1) + bust(crafts, 1300, { blink: blinking(t, 1), arms: P.wave, look: [-1, 0], flip: true }) +
        typeText('山内房治郎', 1300, 200, tl, { size: 70, color: INK, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.08, x0: 1000 }),
      // 2 花札は江戸時代、賭け事に使われ、たびたび禁止されてきた遊びだ。
      (tl, d) => cam(fill('#3a2c2a') + glow(960, 540, 500, '#ffcf8a', 0.15) + hanafuda(960, 540, 3.0, -5, 0) + xf(cross(960, 540, 3.0), { s: popS(tl, d * 0.5), cx: 960, cy: 540 }) +
        typeText('江戸時代', 300, 160, tl, { size: 60, color: C.white }), tl, d, { z0: 1.0, z1: 1.1 }),
      // 3 明治に入って販売が認められたばかりで…チャンスだった。
      (tl, d) => cam(fill(CREAM) + glow(960, 540, 700, C.yellow, 0.25) + hanafuda(960, 540, 3.0, 5, 1) + enter(sign('販売OK！', 960, 940, { size: 80, fill: C.yellow }), tl, 0.3, { cx: 960, cy: 940 }) +
        typeText('明治', 300, 160, tl, { size: 60, color: INK }), tl, d, { z0: 1.1, z1: 1.0 }),
      // 4 松、桜、月、紅葉。花札には、季節の絵が描かれている。
      (tl, d) => {
        let s = fill('#f3e2c0');
        [[1, '松'], [2, '桜'], [0, '月'], [3, '紅葉']].forEach(([k, w], i) => {
          s += xf(hanafuda(0, 0, 1.9, -8 + i * 5, k) + text(w, 0, 300, { size: 70, font: 'Zen Maru Gothic', weight: 900 }), { x: 360 + i * 400, y: 460 + bob(tl, 10, 0.6, i * 0.3), s: popS(tl, i * 0.45), cx: 0, cy: 0 });
        });
        return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
      },
      // 5 房治郎の花札は、絵が美しく、しかも丈夫だと評判になった。
      (tl, d, t) => cam(fill(CREAM) + paintingCloseup(tl + 2) + bust(crafts, 1550, { s: 2.6, blink: blinking(t, 1), arms: P.paint, look: [-1, 0.3], flip: true }) +
        enter(bubble('きれい！じょうぶ！', 1450, 200, { size: 54 }), tl, 0.5, { cx: 1450, cy: 200 }), tl, d, { z0: 1.0, z1: 1.06, x0: 1000 }),
      // 6 京都や大阪の賭場では、新品のカードが次々と使われる。
      (tl, d) => {
        let s = fill('#2f2626') + glow(960, 600, 700, '#ffcf8a', 0.18) + rect(160, 640, 1600, 500, { fill: '#2f6b48' });
        for (let i = 0; i < 10; i++) {
          const k = (tl * 1.3 + i * 0.37) % 1;
          s += hanafuda(lerp(960, 300 + (i % 5) * 330, k), lerp(1100, 760 + Math.floor(i / 5) * 160, k), 0.8, i * 30 * k, i % 4);
        }
        return cam(s, tl, d, { z0: 1.08, z1: 1.0 });
      },
      // 7 よく売れる花札は、すぐに店の看板商品になった。
      (tl, d) => cam(fill(SEPIA) + townRow(760, 7, -200, 340) + xf(shop(0, 0, 1), { x: 960, y: 960, s: tw(tl, 0, 1.0, 0.9, 1.35, ease.back) }) +
        enter(sign('看板商品', 960, 180, { size: 80, fill: RED, color: C.white }), tl, 0.4, { cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.04 }),
      // 8 ちなみに「任天堂」という社名は、「運を天に任せる」という意味だと言われている。（伏線）
      (tl, d) => cam(fill(CREAM) + big('任', 560, 560, 300, RED) + big('天', 960, 560, 300, RED) + big('堂', 1360, 560, 300, RED) +
        typeText('運を天に任せる', 960, 820, tl, { size: 100, color: INK, delay: 0.3, cps: 12, font: 'Yomogi', weight: 400 }), tl, d, { z0: 1.0, z1: 1.08 }),
      // 9 カード遊びの店にふさわしい名前だ。
      (tl, d) => cam(fill(CREAM) + big('任天堂', 960, 460, 200, RED) + hanafuda(500, 800, 1.2, -12 + Math.sin(tl * 3) * 6, 0) + hanafuda(1420, 800, 1.2, 12, 2) +
        xf(text('🎲', 960, 860, { size: 160 }), { r: tl * 90, cx: 960, cy: 810 }), tl, d, { z0: 1.06, z1: 1.0 }),
      // 10 1902年、任天堂は日本で初めて、トランプの製造にも乗り出す。
      (tl, d) => cam(fill('#1d2a3a') + glow(960, 540, 700, '#fff', 0.14) + xf(playingCard(0, 0, 2.6, -8, '♠'), { x: 760, y: 560, s: popS(tl, 0.2), cx: 0, cy: 0 }) +
        xf(playingCard(0, 0, 2.6, 8, '♥', RED), { x: 1160, y: 560, s: popS(tl, 0.5), cx: 0, cy: 0 }) + typeText('1902年　日本初のトランプ', 960, 1000, tl, { size: 64, color: C.white, delay: 0.6 }).replace('y="1000"', 'y="160"'), tl, d, { z0: 1.0, z1: 1.08 }),
      // 11 さらに、全国のたばこ屋でトランプを売ってもらう仕組みを作り、売り場を一気に広げた。
      (tl, d) => {
        let s = fill('#e8f0e0');
        const n = Math.floor(clamp(tl / (d * 0.8)) * 15);
        for (let i = 0; i < n; i++) {
          const x = 220 + (i % 5) * 370, y = 260 + Math.floor(i / 5) * 280;
          s += rect(x - 120, y - 80, 240, 170, { fill: '#b98a58' }) + rect(x - 100, y - 60, 200, 60, { fill: C.white, w: 4 }) + text('たばこ', x, y - 15, { size: 34, font: 'Zen Maru Gothic', weight: 900 }) + playingCard(x, y + 40, 0.28, 0, '♠');
        }
        return cam(s, tl, d, { z0: 1.3, z1: 1.0, x0: 600, x1: 960 });
      },
      // 12 任天堂は、カードの会社として着実に大きくなっていった。
      (tl, d, t) => cam(fill(SEPIA) + townRow(760, 9, -400, 340) + shop(960, 900, 1.3) + bust(crafts, 1550, { s: 2.4, blink: blinking(t, 1), arms: P.cheer }) +
        enter(sign('カードの会社', 600, 180, { size: 70, fill: C.white }), tl, 0.3, { cx: 600, cy: 180 }), tl, d, { z0: 1.1, z1: 1.0 }),
    ],
  },
  // ───── 22歳の社長
  {
    narration: NAR[2],
    list: (c) => [
      // 0 時代は進み、1949年。
      (tl) => fill('#111') + typeText('1949年', 960, 580, tl, { size: 130, color: C.white, cps: 6, font: 'Yomogi', weight: 400 }),
      // 1 任天堂を継いだのは、わずか22歳の山内溥。創業者のひ孫だった。
      (tl, d, t) => cam(fill('#e7e0f0') + glow(700, 500, 600, '#fff', 0.3) + bust(pres, 620, { blink: blinking(t, 2), look: [1, 0], expr: 'smile' }) +
        xf(big(countUp(22, tl, 1.0) + '歳', 1400, 520, 220, RED), { s: popS(tl, 0.2), cx: 1400, cy: 440 }) + typeText('山内溥', 1400, 720, tl, { size: 80, color: INK, delay: 1.0 }), tl, d, { z0: 1.0, z1: 1.06, x0: 900 }),
      // 2 若き社長は、とにかく大胆だった。
      (tl, d, t) => cam(fill(RED) + glow(960, 400, 700, '#fff', 0.18) + bust(pres, 960, { close: true, s: 3.4, blink: blinking(t, 2), arms: P.hips, look: [0, 0], expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.15, y0: 500, y1: 420 }),
      // 3 1953年、日本で初めてプラスチック製のトランプを発売。紙より丈夫で、水にも強い。
      (tl, d) => {
        let s = fill('#cfe6f5') + xf(playingCard(0, 0, 3.0, Math.sin(tl * 2) * 6, '♠'), { x: 960, y: 600 }) + rainCloud(960, 120, tl, 2.0);
        for (let i = 0; i < 8; i++) { const k = (tl * 1.5 + i * 0.13) % 1; s += ellipse(700 + i * 70, lerp(260, 900, k), 10, 18, { fill: C.sky, w: 3 }); }
        s += typeText('1953年　プラスチック製', 380, 1000, tl, { size: 54, color: INK }).replace('y="1000"', 'y="170"'); // 雲にかからないよう左上
        s += enter(sign('水に強い！', 1500, 900, { size: 70, fill: C.yellow }), tl, d * 0.6, { cx: 1500, cy: 900 });
        return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
      },
      // 4 1959年には、アメリカの人気キャラクターをトランプに印刷して売り出し、大ヒットさせた。
      (tl, d) => {
        let s = fill('#fff2c8') + glow(960, 540, 700, C.yellow, 0.3);
        const n = Math.floor(clamp(tl / (d * 0.7)) * 16);
        for (let i = 0; i < n; i++) s += cardBox(360 + (i % 6) * 240, 900 - Math.floor(i / 6) * 270, 1.15, [C.sky, C.pink, C.yellow, C.green][i % 4]);
        s += enter(sign('大ヒット！', 960, 160, { size: 100, fill: RED, color: C.white, rot: -4 + Math.sin(tl * 6) * 2 }), tl, d * 0.5, { cx: 960, cy: 160 });
        return cam(s, tl, d, { z0: 1.15, z1: 1.0, y0: 700, y1: 540 });
      },
      // 5 それまでトランプには、大人が賭け事に使うイメージがあった。
      (tl, d, t) => {
        let s = fill('#2f2626') + glow(960, 560, 600, '#ffcf8a', 0.18) + rect(200, 760, 1520, 400, { fill: '#2f6b48' });
        s += kid({ x: 520, y: 1290, s: 2.4, hair: 'side', shirt: C.white, jacket: '#444', blink: blinking(t, 3), arms: P.hold, expr: 'smile', mustache: true });
        s += kid({ x: 1400, y: 1290, s: 2.4, hair: 'bald', hairColor: '#555', shirt: C.white, jacket: '#555', blink: blinking(t, 4), arms: P.hold, flip: true, look: [-1, 0] });
        for (let i = 0; i < 4; i++) s += playingCard(760 + i * 130, 820, 0.6, -15 + i * 10, i % 2 ? '♥' : '♠', i % 2 ? RED : INK);
        return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
      },
      // 6 それが、子どもが家族と遊ぶおもちゃに変わったのだ。
      (tl, d, t) => {
        let s = fill('#ffe9d0') + glow(960, 500, 800, '#fff', 0.35) + rect(200, 780, 1520, 400, { fill: '#c88a5a' });
        [[400, C.blue, 'messy', 1.9], [800, C.pink, 'side', 1.6], [1180, C.green, 'messy', 1.6], [1560, C.orange, 'side', 1.9]].forEach(([x, col, h, sc], i) => {
          s += kid({ x, y: 1240, s: sc, shirt: col, hair: h, blink: blinking(t, i), arms: P.hold, tilt: Math.sin(tl * 3 + i) * 5, expr: 'smile', flip: x > 960 });
        });
        for (let i = 0; i < 5; i++) s += playingCard(700 + i * 130, 520 - Math.abs(Math.sin(tl * 4 + i)) * 50, 0.55, -20 + i * 10, i % 2 ? '♥' : '♠', i % 2 ? RED : INK);
        return cam(s, tl, d, { z0: 1.08, z1: 1.0 });
      },
      // 7 任天堂は株式を上場し、トランプでは国内トップクラスの会社になった。
      (tl, d) => {
        let s = fill(CREAM) + rect(300, 220, 1320, 760, { fill: C.white });
        const k = clamp(tl / (d * 0.8));
        const pts = [[380, 900], [620, 840], [860, 760], [1100, 600], [1340, 430], [1560, 280]].slice(0, Math.max(2, Math.ceil(k * 6)));
        s += line(pts, { w: 16, color: RED });
        s += enter(sign('上場', 560, 330, { size: 70, fill: C.yellow }), tl, 0.4, { cx: 560, cy: 330 });
        s += enter(sign('国内トップクラス', 1300, 900, { size: 64, fill: RED, color: C.white }), tl, d * 0.6, { cx: 1300, cy: 900 });
        return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 900, x1: 1060 });
      },
      // 8 社長の決断ひとつで、会社はぐんぐん成長していく。
      (tl, d, t) => cam(fill(RED) + glow(960, 400, 800, '#fff', 0.2) + bust(pres, 960, { blink: blinking(t, 2), arms: mix(P.cheer, P.idle, (Math.sin(tl * 5) + 1) / 4), expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.1, y0: 560, y1: 480 }),
      // 9 だが、このあと任天堂は、大きな壁にぶつかる。
      (tl, d, t) => {
        const k = clamp(tl / d);
        let s = fill(lerp(0, 1, k) > 0.5 ? '#5a5f6a' : '#9aa0a8');
        s += pres({ x: lerp(300, 1150, ease.out(clamp(tl / (d * 0.7)))), y: 1100, s: 2.0, legs: Math.sin(tl * 12), blink: blinking(t, 2), expr: k > 0.7 ? 'wow' : 'smile', look: [1, 0] });
        s += rect(1400, -100, 600, 1300, { fill: '#6b6b70' });
        for (let r = 0; r < 8; r++) s += line([[1400, r * 160], [2000, r * 160]], { w: 6, color: INK, passes: 1 });
        return cam(s, tl, d, { z0: 1.0, z1: 1.12, x0: 960, x1: 1200 });
      },
    ],
  },
];
// list(c) を持つ場面は、それを1行＝1カットで並べて描く
for (const s of scenes) if (s.list) s.draw = (t, c) => shots(t, c, s.list(c));
