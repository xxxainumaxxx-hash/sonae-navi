// 任天堂（本番）第1章まで：長い行の途中に入れる「別の絵」
// 1行が長い（約3.6秒以上）ときは、同じ絵を引っぱらず、言葉に合わせて別の絵に切りかえる。
import { C, text, line, ellipse, rect, poly, arrow, sparkles } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid } from '../lib/cfolk.mjs';
import {
  shop, hanafuda, playingCard, cardBox, townRow, building, plane, bwHandheld, toyRobot, gear, bulb, cross, sign, bubble,
} from '../lib/cprops.mjs';
import { cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const RED = '#d23a33', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', NIGHT = '#23263a';
const P = { idle: [12, 8, 12, 8], cheer: [160, 10, 160, 10], hold: [20, -100, 20, -100], wave: [12, 8, 150, -30], point: [12, 8, 125, 10] };
const crafts = (o) => kid({ hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', pants: '#4a3a2a', ...o });
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const coin = (x, y, s = 1) => ellipse(x, y, 26 * s, 26 * s, { fill: C.yellow, w: 5 }) + ellipse(x, y, 8 * s, 8 * s, { fill: '#c9a227', w: 3 });
const lantern = (x, y, str, sw) => `<g transform="rotate(${sw} ${x} ${y - 160})">` + line([[x, y - 160], [x, y - 90]], { w: 5 }) +
  ellipse(x, y, 90, 110, { fill: C.red, w: 7 }) + rect(x - 60, y - 112, 120, 18, { fill: INK, w: 4 }) + rect(x - 60, y + 94, 120, 18, { fill: INK, w: 4 }) +
  text(str, x, y + 22, { size: 60, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) + '</g>';

// ───── つかみ（声ファイル 01）
const H = {
  // 1 「その店が130年後、」→ 年が進んでいく
  1: { before: [(tl, d) => {
    const k = ease.inOut(clamp(tl / (d * 0.85)));
    let s = fill(CREAM) + glow(960, 540, 800, C.yellow, 0.2) + shop(330, 820, 0.75);
    s += arrow(620, 640, lerp(640, 1560, k), 640, { color: RED, w: 14, head: 46 });
    s += big(String(Math.round(lerp(1889, 2019, k))) + '年', lerp(700, 1560, k), 560, 90, INK);
    s += xf(big('130年後', 960, 300, 150, RED), { s: popS(tl, d * 0.45), cx: 960, cy: 250 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
  // 3 「…つぶれかけている。」→ 会社のビルがかたむく
  3: { after: [(tl, d) => {
    const k = clamp(tl / d);
    let s = fill('#7d828c') + glow(960, 300, 700, '#fff', 0.1);
    const b = building(0, 0, 520, 640, '#c9b28f') + text('会社', 0, -660, { size: 70, font: 'Zen Maru Gothic', weight: 900 }) +
      line([[-140, -500], [-60, -380], [-120, -260], [-40, -120]], { w: 8, color: INK, passes: 1 }) + line([[120, -560], [60, -420], [140, -300]], { w: 8, color: INK, passes: 1 });
    s += xf(b, { x: 960, y: 960, r: -2 - 8 * ease.inOut(k) + Math.sin(tl * 14) * 1.5, cx: 0, cy: 0 });
    s += rect(-200, 960, 2400, 300, { fill: '#5a5e66', color: null });
    s += xf(arrow(1560, 220, 1560, 760, { color: RED, w: 24, head: 70 }), { s: popS(tl, 0.3), cx: 1560, cy: 500 });
    s += enter(sign('ピンチ', 420, 260, { size: 100, fill: RED, color: C.white }), tl, d * 0.4, { cx: 420, cy: 260 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 960 + shake(tl, d * 0.4, 0.5, 14) });
  }] },
  // 4 「救ったのは、すごい発明ではない。」→ すごそうなロボットに×
  4: { before: [(tl, d) => {
    let s = fill('#1f2a44') + glow(960, 520, 700, '#9fd0ff', 0.2);
    s += gear(420, 300, 120, tl * 50, '#8e96a8') + gear(1500, 320, 90, -tl * 60, '#8e96a8') + sparkles(1400, 640, 70, C.yellow) + sparkles(520, 700, 60, C.yellow);
    s += toyRobot(960, 760, 2.4, Math.sin(tl * 5) * 6);
    s += xf(cross(960, 560, 3.4), { s: popS(tl, d * 0.55), cx: 960, cy: 560 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 5 「今回は、任天堂が130年生き残ってきた理由を」→ 花札→トランプ→ゲーム機
  5: { before: [(tl, d) => {
    let s = fill(CREAM) + glow(960, 560, 800, RED, 0.08);
    s += xf(hanafuda(0, 0, 1.5, -6, 1), { x: 380, y: 600, s: popS(tl, 0.1), cx: 0, cy: 0 });
    s += xf(arrow(560, 600, 760, 600, { color: INK, w: 10 }), { s: popS(tl, 0.4), cx: 660, cy: 600 });
    s += xf(playingCard(0, 0, 1.6, 6, '♠'), { x: 960, y: 600, s: popS(tl, 0.6), cx: 0, cy: 0 });
    s += xf(arrow(1160, 600, 1360, 600, { color: INK, w: 10 }), { s: popS(tl, 0.9), cx: 1260, cy: 600 });
    s += xf(bwHandheld(0, 0, 1.0, (tl * 2) % 1), { x: 1560, y: 600, s: popS(tl, 1.1), cx: 0, cy: 0 });
    s += enter(sign('なぜ生き残れた？', 960, 190, { size: 80, fill: RED, color: C.white }), tl, 1.4, { cx: 960, cy: 190 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
};

// ───── 京都の花札屋（声ファイル 03）
const K = {
  // 1 「山内房治郎という職人が、」→ 職人の紹介
  1: { before: [(tl, d, t) => {
    let s = fill('#d9b98a') + glow(800, 500, 700, '#fff3d6', 0.3);
    s += rect(80, 230, 560, 16, { fill: C.brown, w: 4 }) + [0, 1, 2, 3].map((i) => hanafuda(150 + i * 135, 170, 0.42, -4 + i * 3, i)).join('');
    s += mid(crafts, 720, { arms: [12, 8, 100, -50], blink: blinking(t, 1), expr: 'smile', look: [1, 0] }) + hanafuda(1090, 700, 0.8, 8, 1);
    s += typeText('山内房治郎', 1420, 460, tl, { size: 110, color: INK, delay: 0.2, cps: 8 });
    s += enter(sign('職人', 1420, 640, { size: 80, fill: C.white }), tl, 0.9, { cx: 1420, cy: 640 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 1000 });
  }] },
  // 2 「花札は江戸時代、賭け事に使われ、」→ 賭け事の場面
  2: { before: [(tl, d, t) => {
    let s = fill('#2a2020') + glow(960, 520, 650, '#ffcf8a', 0.25) + lantern(960, 300, '賭', Math.sin(tl * 2) * 4);
    s += kid({ x: 380, y: 1150, s: 1.85, hair: 'messy', shirt: '#4a5a7a', jacket: '#3a3a48', blink: blinking(t, 2), arms: P.hold, expr: 'smile', look: [1, 0] });
    s += kid({ x: 1540, y: 1150, s: 1.85, hair: 'bald', hairColor: '#3a2d25', shirt: '#7a4a3a', blink: blinking(t, 4), arms: P.hold, expr: 'angry', flip: true, look: [-1, 0] });
    s += rect(560, 760, 800, 300, { fill: '#6b4a32' });
    for (let i = 0; i < 3; i++) s += hanafuda(800 + i * 150, 820, 0.55, -10 + i * 10, i);
    for (let i = 0; i < 5; i++) s += coin(700 + i * 120, 920 - Math.abs(Math.sin(tl * 5 + i)) * 30, 1);
    s += typeText('江戸時代', 300, 160, tl, { size: 60, color: C.white });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 3 「新しい商売にはうってつけのタイミングだった。」→ ひらめく職人
  3: { after: [(tl, d, t) => {
    let s = fill('#fdf0d0') + glow(700, 400, 600, C.yellow, 0.35) + shop(1450, 880, 0.9);
    s += mid(crafts, 640, { arms: P.cheer, blink: blinking(t, 1), expr: 'smile' });
    s += xf(bulb(640, 300, 1.4, 1), { s: popS(tl, 0.2), cx: 640, cy: 300 });
    s += enter(sign('チャンス！', 1400, 260, { size: 100, fill: RED, color: C.white }), tl, 0.5, { cx: 1400, cy: 260 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 4 「花札には、季節の絵が描かれている。」→ 季節の4分割
  4: { after: [(tl, d) => {
    const cols = ['#d8ecd0', '#fde0ea', '#262c4a', '#fde3c4'];
    let s = fill(CREAM);
    cols.forEach((col, i) => {
      const y = tw(tl, i * 0.18, i * 0.18 + 0.4, -1100, 0, ease.out);
      let p = rect(i * 480 + 10, 20, 460, 1040, { fill: col, w: 6 });
      const cx = i * 480 + 250;
      if (i === 0) for (let j = 0; j < 3; j++) p += poly([[cx - 120 + j * 120, 700], [cx - 60 + j * 120, 420], [cx + j * 120, 700]], { fill: C.green, w: 5 });
      if (i === 1) for (let j = 0; j < 7; j++) p += ellipse(cx - 140 + (j * 97) % 280, 300 + (j * 131) % 420 + bob(tl, 14, 0.5, j * 0.2), 30, 30, { fill: C.pink, w: 4 });
      if (i === 2) p += ellipse(cx, 420, 120, 120, { fill: C.white, w: 6 }) + poly([[i * 480 + 20, 760], [cx - 40, 560], [cx + 60, 660], [i * 480 + 470, 560], [i * 480 + 470, 760]], { fill: RED, w: 5 });
      if (i === 3) for (let j = 0; j < 6; j++) p += xf(poly([[0, -40], [12, -12], [40, -10], [18, 8], [26, 38], [0, 22], [-26, 38], [-18, 8], [-40, -10], [-12, -12]], { fill: C.orange, w: 4 }), { x: cx - 120 + (j * 89) % 240, y: 300 + (j * 113) % 420, r: tl * 60 + j * 40 });
      p += text(['松', '桜', '月', '紅葉'][i], cx, 860, { size: 90, font: 'Zen Maru Gothic', weight: 900, color: i === 2 ? C.white : INK });
      s += `<g transform="translate(0 ${y.toFixed(1)})">${p}</g>`;
    });
    return cam(s, tl, d, { z0: 1.04, z1: 1.0 });
  }] },
  // 5 「房治郎の花札は、絵が美しく、しかも丈夫だと評判になった。」（元の絵は作業台と重なるので差しかえ）
  5: { replace: [
    (tl, d) => {
      let s = fill('#fff6e0') + glow(960, 520, 700, C.yellow, 0.35);
      s += xf(hanafuda(0, 0, 3.0, Math.sin(tl * 2) * 5, 1), { x: 960, y: 520 });
      s += sparkles(600, 300, 70, C.yellow) + sparkles(1330, 380, 60, C.yellow) + sparkles(1300, 760, 50, C.yellow);
      s += enter(sign('絵が美しい', 960, 900, { size: 80, fill: C.white }), tl, 0.4, { cx: 960, cy: 900 }).replace(/translate\(960 900\)/, 'translate(960 860)');
      return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
    },
    (tl, d, t) => {
      let s = fill(SEPIA) + townRow(760, 7, -200, 340) + shop(960, 880, 1.15);
      [[300, C.blue, 'messy'], [560, C.pink, 'side'], [1360, C.green, 'messy'], [1620, C.orange, 'side']].forEach(([x, col, h], i) => {
        s += kid({ x, y: 1110 - Math.abs(Math.sin(tl * 5 + i)) * 10, s: 1.5, shirt: col, hair: h, blink: blinking(t, i), arms: P.cheer, expr: 'smile', flip: x > 960 });
      });
      s += enter(bubble('じょうぶ！', 430, 330, { size: 54 }), tl, 0.2, { cx: 430, cy: 330 }) + enter(bubble('きれい！', 1490, 330, { size: 54 }), tl, 0.5, { cx: 1490, cy: 330 });
      s += enter(sign('評判', 960, 170, { size: 90, fill: RED, color: C.white }), tl, 0.8, { cx: 960, cy: 170 });
      return cam(s, tl, d, { z0: 1.06, z1: 1.0 });
    },
  ] },
  // 6 「京都や大阪の賭場では、」→ 夜の街にちょうちん
  6: { before: [(tl, d) => {
    let s = fill('#1c1a2c') + ellipse(1700, 160, 70, 70, { fill: '#fff3c4', w: 5 });
    s += `<g opacity="0.55">${townRow(900, 7, -200, 340)}</g>`;
    s += xf(lantern(620, 470, '京都', Math.sin(tl * 2) * 5), { s: popS(tl, 0.1), cx: 620, cy: 470 });
    s += xf(lantern(1300, 470, '大阪', Math.sin(tl * 2 + 1) * 5), { s: popS(tl, 0.5), cx: 1300, cy: 470 });
    s += glow(620, 470, 260, '#ff9a6a', 0.25) + glow(1300, 470, 260, '#ff9a6a', 0.25);
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 7 「よく売れる花札は、」→ 店から札が飛んでいき、お金が入ってくる
  7: { before: [(tl, d) => {
    let s = fill('#f6e2b8') + townRow(760, 7, -200, 340) + shop(960, 900, 1.2);
    for (let i = 0; i < 8; i++) {
      const k = (tl * 0.9 + i * 0.125) % 1, side = i % 2 ? 1 : -1;
      s += hanafuda(960 + side * k * 800, 640 - Math.sin(k * Math.PI) * 360, 0.5, side * k * 200, i % 4);
      const k2 = (tl * 0.9 + i * 0.125 + 0.5) % 1;
      s += coin(960 - side * (1 - k2) * 800, 600 - Math.sin(k2 * Math.PI) * 300, 1.1);
    }
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 8 「ちなみに「任天堂」という社名は、」→ 店の看板
  8: { before: [(tl, d) => {
    const sw = Math.sin(tl * 2.2) * 3;
    let s = fill('#c9a878') + glow(960, 480, 700, '#fff3d6', 0.3);
    s += line([[640, 0], [700, 260]], { w: 8 }) + line([[1280, 0], [1220, 260]], { w: 8 });
    s += `<g transform="rotate(${sw.toFixed(2)} 960 0)">` + rect(500, 250, 920, 360, { fill: '#7a5230', w: 10 }) + rect(540, 290, 840, 280, { fill: '#9a6a40', w: 5 }) +
      text('任天堂', 960, 500, { size: 210, color: '#2b1a10', font: 'Zen Maru Gothic', weight: 900 }) + '</g>';
    s += enter(sign('社名', 380, 800, { size: 80, fill: C.white }), tl, 0.4, { cx: 380, cy: 800 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.08, y0: 460 });
  }] },
  // 10 「トランプの製造にも乗り出す。」→ トランプを作る機械
  10: { after: [(tl, d) => {
    let s = fill('#dfe6ee') + glow(960, 400, 800, '#fff', 0.3);
    s += gear(560, 360, 130, tl * 70, '#8e96a8') + gear(760, 260, 90, -tl * 95, '#a8aebb') + gear(1360, 330, 110, tl * 80, '#8e96a8');
    s += rect(300, 520, 520, 260, { fill: '#6b7280' }) + text('印刷', 560, 680, { size: 70, color: C.white, font: 'Zen Maru Gothic', weight: 900 });
    s += rect(-100, 790, 2200, 50, { fill: INK, w: 4 });
    for (let i = 0; i < 7; i++) { const x = 820 + ((tl * 260 + i * 200) % 1400); s += playingCard(x, 720, 0.55, 0, i % 2 ? '♥' : '♠', i % 2 ? RED : INK); }
    s += enter(sign('日本初', 1500, 560, { size: 90, fill: C.yellow }), tl, 0.4, { cx: 1500, cy: 560 });
    return cam(s, tl, d, { z0: 1.05, z1: 1.0 });
  }] },
  // 11 「さらに、全国のたばこ屋でトランプを売ってもらう仕組みを作り、」→ 1軒のたばこ屋
  11: { before: [(tl, d, t) => {
    let s = fill('#e8f0e0') + glow(960, 400, 700, '#fff', 0.3);
    s += rect(360, 200, 1200, 760, { fill: '#c49a6a' }) + rect(420, 230, 520, 110, { fill: C.white, w: 5 }) + text('たばこ', 680, 315, { size: 80, color: RED, font: 'Zen Maru Gothic', weight: 900 });
    s += rect(560, 420, 800, 420, { fill: '#f6efe0' });
    s += kid({ x: 960, y: 980, s: 1.5, hair: 'side', hairColor: '#9a9a9a', shirt: '#8a6aa8', blink: blinking(t, 6), arms: P.hold, expr: 'smile' });
    s += rect(420, 800, 1080, 120, { fill: '#8a5a34' });
    for (let i = 0; i < 4; i++) s += xf(playingCard(0, 0, 0.5, -8 + i * 6, i % 2 ? '♥' : '♠', i % 2 ? RED : INK), { x: 640 + i * 200, y: 770, s: popS(tl, 0.3 + i * 0.25), cx: 0, cy: 0 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
};

// ───── 22歳の社長（声ファイル 04）
const Y = {
  // 1 「創業者のひ孫だった。」→ 家系図
  1: { after: [(tl, d, t) => {
    let s = fill('#efe8f6') + glow(960, 500, 800, '#fff', 0.3);
    const who = [
      [300, crafts({ x: 0, y: 0, s: 1.15, blink: blinking(t, 1) }), '創業者'],
      [740, kid({ x: 0, y: 0, s: 1.15, hair: 'side', hairColor: '#4a3a30', shirt: '#6a7a5a', blink: blinking(t, 2), mustache: true }), '2代目'],
      [1180, kid({ x: 0, y: 0, s: 1.15, hair: 'messy', shirt: '#8a7a6a', blink: blinking(t, 3) }), ''],
      [1620, pres({ x: 0, y: 0, s: 1.15, blink: blinking(t, 4), expr: 'smile' }), '山内溥'],
    ];
    who.forEach(([x, f, lab], i) => {
      s += xf(f, { x, y: 820, s: popS(tl, i * 0.35), cx: 0, cy: -150 });
      if (lab) s += xf(text(lab, x, 900, { size: 54, font: 'Zen Maru Gothic', weight: 900, color: i === 3 ? RED : INK }), { s: popS(tl, i * 0.35 + 0.1), cx: x, cy: 880 });
      if (i) s += xf(arrow(x - 330, 560, x - 110, 560, { w: 8 }), { s: popS(tl, i * 0.35 - 0.1), cx: x - 220, cy: 560 });
    });
    s += enter(sign('ひ孫', 1620, 220, { size: 100, fill: RED, color: C.white }), tl, 1.4, { cx: 1620, cy: 220 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.04 });
  }] },
  // 3 「1953年、日本で初めてプラスチック製のトランプを発売。」→ 紙とプラスチック
  3: { before: [(tl, d) => {
    let s = fill('#e6f0f7') + glow(1300, 540, 600, '#fff', 0.5);
    s += xf(rect(-140, -200, 280, 400, { fill: '#e6d8b8' }) + text('紙', 0, 30, { size: 110, color: '#8a7a5a', font: 'Zen Maru Gothic', weight: 900 }), { x: 560, y: 560, r: -6 });
    s += xf(playingCard(0, 0, 2.6, 6, '♠'), { x: 1320, y: 560, s: popS(tl, 0.4), cx: 0, cy: 0 });
    s += `<rect x="1180" y="330" width="80" height="460" fill="#fff" opacity="${(0.35 + 0.3 * Math.sin(tl * 4)).toFixed(2)}" transform="rotate(20 1220 560)"/>`;
    s += sparkles(1560, 320, 60, C.yellow) + sparkles(1080, 800, 50, C.yellow);
    s += xf(arrow(760, 560, 1000, 560, { w: 12, color: RED }), { s: popS(tl, 0.2), cx: 880, cy: 560 });
    s += typeText('1953年　プラスチック製', 960, 160, tl, { size: 60, color: INK });
    return cam(s, tl, d, { z0: 1.0, z1: 1.06, x0: 1000 });
  }] },
  // 4 「1959年には、アメリカの人気キャラクターを印刷した」→ アメリカから来たキャラクター
  4: { before: [(tl, d) => {
    let s = fill('#cfe6f5') + glow(960, 300, 900, '#fff', 0.3) + rect(-200, 760, 2400, 500, { fill: '#5a9ad0', color: null });
    s += plane(tw(tl, 0, d * 0.7, -300, 2200), 220, 1.0);
    s += typeText('1959年　アメリカの人気キャラクター', 960, 150, tl, { size: 58, color: INK, delay: 0.2 });
    s += xf(cardBox(0, 0, 2.6, C.yellow), { x: 960, y: 560, s: popS(tl, 0.5), r: Math.sin(tl * 3) * 4, cx: 0, cy: 0 });
    s += sparkles(1280, 380, 60, RED) + sparkles(640, 720, 50, RED);
    return cam(s, tl, d, { z0: 1.0, z1: 1.06 });
  }] },
  // 6 「子どもが家族と遊ぶおもちゃに」→ 子どもがトランプを持ってにっこり
  6: { after: [(tl, d, t) => {
    let s = fill('#ffe9d0') + rect(1200, 160, 460, 360, { fill: '#cfe6f5' }) + line([[1430, 160], [1430, 520]], { w: 6 }) + line([[1200, 340], [1660, 340]], { w: 6 }) + glow(800, 520, 700, '#fff', 0.35);
    s += mid(kid, 820, { shirt: C.blue, hair: 'messy', blink: blinking(t, 1), arms: [12, 8, 100, -50], expr: 'smile', tilt: Math.sin(tl * 3) * 4 });
    for (let i = 0; i < 5; i++) s += playingCard(1090 + i * 60, 760, 0.6, -24 + i * 12, i % 2 ? '♥' : '♠', i % 2 ? RED : INK);
    s += enter(sign('おもちゃ', 1450, 640, { size: 100, fill: C.yellow }), tl, 0.4, { cx: 1450, cy: 640 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  }] },
  // 7 「任天堂は株式を上場し、」→ 株の掲示板に「上場」のハンコ
  7: { before: [(tl, d) => {
    let s = fill('#26303a') + glow(960, 480, 700, '#9fd0ff', 0.12) + rect(260, 140, 1400, 760, { fill: '#1a2028' });
    ['電機', '鉄道', '任天堂', '銀行', '食品'].forEach((w, i) => {
      const y = 260 + i * 140, me = w === '任天堂';
      s += text(w, 520, y + 20, { size: 64, color: me ? C.yellow : '#9aa', font: 'Zen Maru Gothic', weight: 900 });
      s += text(String(300 + ((i * 137 + Math.floor(tl * 6)) % 600)), 1000, y + 20, { size: 64, color: me ? C.yellow : '#7f8', font: 'Zen Maru Gothic', weight: 900 });
    });
    const k = popS(tl, d * 0.45, 0.25);
    s += xf(ellipse(0, 0, 180, 180, { fill: 'none', color: RED, w: 16 }) + text('上場', 0, 40, { size: 110, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: 1400, y: 520, s: k ? 2 - k : 0, r: -12, cx: 0, cy: 0 });
    return cam(s, tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, d * 0.45 + 0.2, 0.3, 12) });
  }] },
  // 8 「会社はぐんぐん成長していく。」→ 店がビルに育つ
  8: { after: [(tl, d) => {
    const k = ease.out(clamp(tl / (d * 0.8)));
    let s = fill('#e3eef8') + glow(960, 300, 900, '#fff', 0.3) + rect(-200, 940, 2400, 300, { fill: '#9ab08a', color: null });
    const h = lerp(260, 760, k);
    s += building(960, 940, lerp(360, 520, k), h, '#d8b080') + text('任天堂', 960, 940 - h - 30, { size: 70, color: RED, font: 'Zen Maru Gothic', weight: 900 });
    s += xf(arrow(1480, 860, 1480, 300, { color: RED, w: 22, head: 60 }), { s: popS(tl, 0.3), cx: 1480, cy: 580 });
    return cam(s, tl, d, { z0: 1.05, z1: 1.0, y0: 520 });
  }] },
};

// list の k 行目に、別の絵を前・後ろに足す／差しかえる
export function withExtras(list, ex) {
  return list.map((f, k) => {
    const e = ex[k];
    if (!e) return f;
    if (e.replace) return e.replace;
    return [...(e.before || []), f, ...(e.after || [])];
  });
}
export const EXTRA = { '01': H, '03': K, '04': Y };
