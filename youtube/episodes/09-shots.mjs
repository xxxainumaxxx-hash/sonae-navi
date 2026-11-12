// アシックスの絵（行ごとのカット）。声ファイルの番号（章タイトル込みの通し番号）ごとに、行の数だけカットを並べる
// 実在のロゴ（ナイキ・オニツカタイガー・五輪マーク）、実在の商品の形、人物の似顔絵、映画の衣装は描かない。靴は一般的な形
import { C, text, line, ellipse, rect, poly, arrow, sparkles } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking, ease, lerp, clamp } from '../lib/anim.mjs';
import { kid, guide, worker } from '../lib/cfolk.mjs';
import { sign, bubble, cross, building, townRow, chartDown, trophy, plane, desk, sneakyCat as cat } from '../lib/cprops.mjs';
import { factory, moneyBag } from '../lib/cprops2.mjs';
import { ruins, worldMap, letter } from '../lib/cprops3.mjs';
import { tentacleCup, tiger, court } from '../lib/cprops4.mjs';
import { shoe, sole, tentacle, sunomono, chopsticks, basketball, gym, blackboard, footBlister, runner, cobble, medal, oldTV, shoeBox, carTrunk, contract } from '../lib/cprops4.mjs';
import { cam, typeText, countUp, big, fill, glow } from '../lib/shots.mjs';

const NAVY = '#24345c', RED = '#c8423a', CREAM = '#fbf3e6', INK = '#2b2622', SEPIA = '#ead2a6', ASH = '#cfc6bc', BLUE = '#2f4a7a', YEL = '#f2c230';
const P = { idle: [12, 8, 12, 8], point: [12, 8, 125, 10], cheer: [160, 10, 160, 10], shrug: [60, 95, 60, 95], hold: [40, -60, 40, -60], wave: [12, 8, 150, -30], think: [12, 8, 30, -180], hips: [50, -90, 50, -90], raise: [12, 8, 100, -50], work: [40, -40, 70, -20] };

const onitsuka = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', jacket: '#6b6b4a', pants: '#4a4a38', ...o });   // 戦後すぐ（軍服の上着）
const onitsuka2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: NAVY, tie: RED, pants: NAVY, ...o });   // 社長になってから
const phil = (o) => kid({ hair: 'messy', hairColor: '#c9a04a', shirt: C.white, jacket: '#8a6a40', tie: '#3a6ea5', pants: '#5a4a3a', ...o });
const teacher = (o) => kid({ hair: 'side', hairColor: '#7a7a7a', glasses: true, shirt: C.white, jacket: '#5a6a5a', pants: '#3a3a3a', ...o });
const youth = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#7a6a58', pants: '#4a4038', ...o });
const player = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: C.white, pants: BLUE, ...o });
const mid = (fn, x, o = {}) => fn({ x, y: 1100, s: 1.85, ...o });
const T = (str, x, y, size, color, stroke = INK) => `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
const head = (str, tl, color = INK) => typeText(str, 960, 150, tl, { size: 70, color, font: 'Yomogi', weight: 400 });
const blackType = (str, tl, size = 130) => fill('#111') + typeText(str, 960, 580, tl, { size, color: C.white, cps: 6, font: 'Yomogi', weight: 400 });
const floor = (col = '#a07a50', y = 880) => rect(-200, y, 2400, 400, { fill: col, color: null });
const burntKobe = () => fill(ASH) + `<rect x="-200" y="-200" width="2400" height="700" fill="#e7c9a8" opacity="0.5"/>` + ruins(500, 880, 1.2) + ruins(1500, 880, 0.9) + floor('#8a7a6a');
const sound = (str, x, y, tl, t0 = 0, col = RED, size = 90) => (tl > t0 ? xf(text(str, 0, 0, { size, color: col, font: 'Zen Maru Gothic', weight: 900, rot: -8 }), { x: x + Math.sin(tl * 30) * 3, y, s: popS(tl, t0) }) : '');
const yen = (v, x, y, size, color) => big(v, x, y, size, color, { stroke: INK });
const table = () => fill('#f1e2c8') + rect(-200, 640, 2400, 600, { fill: '#b98a58', color: null }) + line([[-200, 640], [2200, 640]], { w: 6, passes: 1 });
// 上がるグラフ（線と矢印）
const chartUp = (pts, col, k = 1) => {
  const n = Math.max(2, Math.ceil(pts.length * k)); const ps = pts.slice(0, n);
  const p = ps.map((q) => q.join(',')).join(' '), [a, b] = ps.slice(-2);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 60;
  return `<polyline points="${p}" fill="none" stroke="${INK}" stroke-width="40" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${p}" fill="none" stroke="${col}" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<polygon points="${b[0] + Math.cos(ang) * h},${b[1] + Math.sin(ang) * h} ${b[0] + Math.cos(ang + 2.2) * h * 0.7},${b[1] + Math.sin(ang + 2.2) * h * 0.7} ${b[0] + Math.cos(ang - 2.2) * h * 0.7},${b[1] + Math.sin(ang - 2.2) * h * 0.7}" fill="${col}" stroke="${INK}" stroke-width="8"/>`;
};
// 映画館のスクリーン（中は一般的な走る人の影）
const cinema = (tl) => fill('#1d1a24') + rect(360, 140, 1200, 620, { fill: '#e8e2d4', w: 8 }) + `<g opacity="0.85">${runner(960 + Math.sin(tl * 2) * 60, 700, 1.0, tl, { shirt: '#5a5a5a', pants: '#3a3a3a', skin: '#8a8a8a', hair: '#3a3a3a' })}</g>` +
  [0, 1, 2, 3, 4, 5, 6].map((i) => ellipse(300 + i * 220, 1000, 70, 60, { fill: '#3a3444', color: null })).join('');

// ───── 章タイトル（紺）
export const chapterCard = (no, title) => (t) => fill(NAVY) + glow(960, 540, 700, '#ffffff', 0.1) +
  [0, 1, 2, 3, 4, 5].map((i) => line([[0, 200 + i * 140], [1920, 220 + i * 140]], { w: 3, color: '#3a4c7a', passes: 1 })).join('') +
  typeText(no, 960, 440, t, { size: 70, color: C.white, cps: 10, font: 'Yomogi', weight: 400 }) +
  typeText(title, 960, 620, t, { size: 104, color: C.white, cps: 10, delay: 0.4, font: 'Yomogi', weight: 400 });

export const SHOTS = {
  // ───── つかみ
  '01': [
    // 0 夕ごはんに出た、タコの酢の物。
    (tl, d) => cam(table() + glow(960, 640, 500, '#fff3d6', 0.4) + sunomono(960, 700, 2.0), tl, d, { z0: 1.15, z1: 1.0 }),
    // 1 その吸盤からヒントを得た運動靴が、やがて世界中のランナーに選ばれるようになる。
    [
      (tl, d) => cam(fill('#f6e6dc') + tentacle(960, 560, 2.4, 0.2 + Math.sin(tl * 2) * 0.05) + xf(T('吸盤', 1500, 300, 110, RED, C.white), { s: popS(tl, 0.3), cx: 1500, cy: 260 }), tl, d, { z0: 1.0, z1: 1.08 }),
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 520, 1.2, [0, 1, 2, 3, 4, 5]) + floor('#b9a27a', 880) + [0, 1, 2].map((i) => runner(tw(tl, 0, d, -100, 2100) - i * 420, 980, 0.8, tl + i, { shirt: [RED, BLUE, '#3f7a5a'][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 2 アシックスだ。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, BLUE, 0.08) + xf(T('アシックス', 960, 640, 230, INK, C.white), { s: popS(tl, 0, 0.3), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.1 }),
    // 3 しかも、あのナイキは、最初はこの会社の靴を、アメリカで売る会社だった。
    [
      (tl, d) => cam(fill('#e2e6ee') + shoe(960, 720, 2.2, { col: '#f4efe2', accent: RED }) + xf(T('日本の靴', 960, 260, 110, INK, C.white), { s: popS(tl, 0.2), cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d, t) => cam(fill('#fbe9d0') + carTrunk(1250, 900, 1.1) + mid(phil, 520, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + xf(T('アメリカで販売', 1250, 230, 90, RED, C.white), { s: popS(tl, 0.3), cx: 1250, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 4 戦争から帰った一人の青年が、神戸で始めた小さな靴屋。
    [
      (tl, d, t) => cam(burntKobe() + mid(onitsuka, 960, { blink: blinking(t, 1), arms: P.idle, expr: 'smile' }), tl, d, { z0: 1.08, z1: 1.0 }),
      (tl, d) => cam(fill('#cfe0e8') + floor('#b9a070') + factory(960, 880, 1.0, '#d9c9a8', false) + sign('靴', 960, 450, { size: 90, fill: C.white, rot: 0 }) + head('神戸', tl), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 5 しかし、アメリカの若者との関係は、やがて終わりを迎える。一番のお客さんを失った会社は、どうやって世界に羽ばたいたのか。
    [
      (tl, d) => cam(fill('#3a3a44') + glow(960, 540, 600, '#fff', 0.1) + contract(960, 560, 1.4, clamp((tl - 0.6) / 0.8)) + head('別れ', tl, C.white), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, 1.0, 0.4, 8) }),
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 540, 1.25, [0, 1, 2, 3, 4, 5]) + xf(shoe(0, 0, 1.0, { accent: BLUE }), { x: lerp(560, 1400, ease.inOut(clamp(tl / (d * 0.8)))), y: 420 - Math.sin(clamp(tl / (d * 0.8)) * Math.PI) * 160, r: -10 }) + T('どうやって世界へ？', 960, 170, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 6 今回は、アシックスが世界のブランドになるまでを見ていきましょう。
    (tl, d, t) => cam(fill('#fdf1dc') + mid(guide, 520, { blink: blinking(t, 3), arms: P.point, look: [1, 0] }) + shoe(1320, 760, 1.6, { accent: BLUE }) + enter(bubble('世界のブランドへ', 1320, 330, { size: 60 }), tl, 0.4, { cx: 1320, cy: 330 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 物語は、戦争が終わったあとの神戸から始まる。
    (tl, d) => cam(burntKobe() + `<rect x="-200" y="-200" width="2400" height="1500" fill="#000" opacity="${0.3 - clamp(tl / d) * 0.15}"/>` + head('戦後の神戸', tl, C.white), tl, d, { z0: 1.12, z1: 1.0 }),
  ],

  // ───── 焼け野原の神戸
  '03': [
    // 0 戦争が終わった日本。神戸の町は、焼け野原になっていた。
    (tl, d) => cam(burntKobe(), tl, d, { z0: 1.12, z1: 1.0 }),
    // 1 その中に、戦争から生きて帰った一人の青年がいた。鬼塚喜八郎。
    [
      (tl, d, t) => cam(burntKobe() + xf(onitsuka({ x: 0, y: 0, s: 1.85, blink: blinking(t, 1), expr: 'smile' }), { x: 960, y: 1100, o: clamp(tl / 0.6) }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => cam(fill(CREAM) + mid(onitsuka, 700, { blink: blinking(t, 1), arms: P.hips, expr: 'smile' }) + typeText('鬼塚喜八郎', 1340, 520, tl, { size: 90, color: INK, delay: 0.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 鳥取県の生まれで、戦争中は軍隊にいた。神戸には、親しい知り合いの家族を頼ってやってきたと言われている。
    [
      (tl, d) => cam(fill('#cfe0e8') + poly([[-200, 700], [400, 380], [1000, 700]], { fill: '#8fb07a' }) + poly([[700, 700], [1300, 400], [2000, 700]], { fill: '#7ea06a' }) + floor('#b9a070', 700) + head('鳥取県', tl), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d, t) => cam(fill('#e7d8c0') + floor('#a07a50') + xf(arrow(500, 300, 1170, 300, { w: 16 }), { s: popS(tl, 0.3), cx: 840, cy: 300 }) + T('神戸へ', 1450, 330, 110, RED, C.white) + onitsuka({ x: tw(tl, 0, d, 300, 700), y: 1120, s: 1.5, legs: Math.sin(tl * 8), blink: blinking(t, 1), expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 3 町では、行き場を失った若者たちが、うつむいて過ごしていた。
    (tl, d, t) => cam(fill(ASH) + ruins(960, 880, 1.0) + floor('#8a7a6a') + [500, 960, 1420].map((x, i) => youth({ x, y: 1120, s: 1.5, blink: blinking(t, i), expr: 'worry', arms: P.shrug, tilt: 6 })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 仕事もなく、食べるものも足りない。夢を持てない時代だった。
    (tl, d) => cam(fill('#5a5246') + floor('#3e382f', 860) + ellipse(960, 760, 220, 60, { fill: '#fdfbf3' }) + ellipse(960, 750, 160, 40, { fill: '#e6e0d4', w: 4 }) + T('食べものが足りない', 960, 300, 90, C.white), tl, d, { z0: 1.08, z1: 1.0 }),
    // 5 「スポーツで、若者たちを元気にしたい」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 700, YEL, 0.3) + mid(onitsuka, 600, { blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }) + enter(bubble('スポーツで、若者を元気に！', 1300, 330, { size: 58 }), tl, 0.2, { cx: 1300, cy: 330 }) + basketball(1300, 700, 70), tl, d, { z0: 1.0, z1: 1.06 }),
    // 6 鬼塚は、そう考えるようになったと言われている。
    (tl, d, t) => cam(fill('#fbe9d0') + mid(onitsuka, 960, { blink: blinking(t, 1), arms: P.think, expr: 'smile' }) + sparkles(1120, 420, 60, YEL), tl, d, { z0: 1.0, z1: 1.08 }),
    // 7 そして神戸で、1949年に小さな会社を立ち上げる。売るのは、スポーツの靴だ。
    [
      (tl) => blackType('1949年', tl),
      (tl, d, t) => cam(fill('#cfe0e8') + floor('#b9a070') + factory(1250, 880, 0.9, '#d9c9a8', false) + sign('靴', 1250, 480, { size: 80, fill: C.white, rot: 0 }) + mid(onitsuka, 520, { blink: blinking(t, 1), arms: P.point, expr: 'smile' }) + shoe(1660, 880, 0.6, { accent: BLUE }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 8 資金は少ない。社員も、ほんの数人。
    (tl, d, t) => cam(fill('#e9dcc6') + floor('#a07a50') + moneyBag(1500, 700, 0.6, '¥') + [0, 1, 2].map((i) => worker({ x: 420 + i * 340, y: 1100, s: 1.4, blink: blinking(t, i), expr: 'smile', arms: P.work })).join('') + T('数人だけ', 960, 260, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 9 それでも鬼塚は、「スポーツを通して、健やかな若者を育てたい」という思いを、最後まで手放さなかった。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(onitsuka, 960, { blink: blinking(t, 1), arms: [12, 8, 70, -40], expr: 'smile' }) + xf(T('健やかな若者を', 960, 230, 100, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
  ],

  // ───── いちばん難しい靴
  '04': [
    // 0 だが鬼塚は、靴づくりの素人だった。
    (tl, d, t) => cam(fill('#e2e6ee') + mid(onitsuka2, 760, { blink: blinking(t, 1), arms: P.shrug, expr: 'worry', sweat: true }) + shoe(1400, 760, 1.0, { accent: BLUE }) + T('？', 1400, 450, 140, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 1 そこで、知り合いの高校の先生に相談した。どんな靴から作ればいいか。
    (tl, d, t) => cam(fill('#e9dcc6') + blackboard(960, 340, 700, 300) + mid(onitsuka2, 520, { blink: blinking(t, 1), arms: P.point, expr: 'smile' }) + mid(teacher, 1400, { blink: blinking(t, 2), arms: P.think, expr: 'smile', flip: true }) + enter(bubble('どんな靴から？', 960, 760, { size: 56 }), tl, 0.3, { cx: 960, cy: 760 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 先生がすすめたのは、バスケットボールの靴だった。
    (tl, d, t) => cam(fill('#e9dcc6') + court(1150, 400, 900, 480) + basketball(1500, 720, 60) +
      mid(teacher, 420, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + xf(shoe(0, 0, 1.1, { high: true, accent: RED }), { x: 1100, y: 820, s: popS(tl, 0.4) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 急に走り、急に止まる。いちばん難しい靴だ。
    [
      (tl, d, t) => cam(gym(880) + player({ x: tw(tl, 0, d * 0.7, 300, 1100), y: 1100, s: 1.5, blink: blinking(t, 1), expr: 'smile', legs: Math.sin(tl * 12), arms: P.cheer }) + basketball(tw(tl, 0, d * 0.7, 460, 1260), 700, 50), tl, d, { z0: 1.0, z1: 1.04 }),
      (tl, d) => cam(fill('#fff2c8') + xf(sign('いちばん難しい', 960, 540, { size: 170, fill: RED, color: C.white }), { s: popS(tl, 0.1), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.06 }),
    ],
    // 4 床をしっかりつかみながら、足首を守らなければならない。
    (tl, d) => cam(gym(880) + shoe(960, 880, 2.2, { high: true, accent: RED }) + xf(arrow(960, 620, 960, 760, { w: 12, color: RED }), { s: popS(tl, 0.3), cx: 960, cy: 690 }) + T('足首を守る', 960, 300, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
    // 5 当時の日本には、本格的なバスケットボールの靴を作れる会社は、ほとんどなかった。
    (tl, d) => cam(fill('#e2e6ee') + [0, 1, 2].map((i) => factory(420 + i * 540, 900, 0.6, '#c9c2b0', false) + xf(cross(420 + i * 540, 700, 1.0), { s: popS(tl, 0.3 + i * 0.3), cx: 420 + i * 540, cy: 700 })).join('') + T('作れる会社がない', 960, 260, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 「いちばん難しい靴が作れれば、ほかの靴も作れる」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(onitsuka2, 560, { blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }) + enter(bubble('いちばん難しい靴が作れれば、ほかも作れる', 1220, 320, { size: 46 }), tl, 0.2, { cx: 1220, cy: 320 }) + shoe(1300, 780, 1.1, { high: true, accent: RED }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 7 鬼塚は、あえて難しい道を選んだ。
    (tl, d, t) => cam(fill('#cfe0e8') + poly([[-200, 1100], [960, 300], [2100, 1100]], { fill: '#8fa0b0' }) + onitsuka2({ x: lerp(500, 760, ease.out(clamp(tl / d))), y: lerp(1180, 980, ease.out(clamp(tl / d))), s: 1.3, legs: Math.sin(tl * 6), blink: blinking(t, 1), expr: 'smile' }) + sign('難しい道', 1200, 420, { size: 70, fill: C.white }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 8 鬼塚は、体育館に通い、選手たちの足の動きをじっと観察した。
    (tl, d, t) => cam(gym(880) + player({ x: 1250 + Math.sin(tl * 3) * 120, y: 1100, s: 1.5, blink: blinking(t, 2), expr: 'smile', legs: Math.sin(tl * 10), arms: P.cheer }) + mid(onitsuka2, 420, { blink: blinking(t, 1), arms: P.think, expr: 'smile', look: [1, 0.4] }) + ellipse(1250, 1060, 130, 40, { fill: 'none', color: RED, w: 8 }), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── すべる靴
  '05': [
    // 0 だが、作っても作っても、うまくいかない。
    (tl, d, t) => cam(fill('#e9dcc6') + floor('#a07a50') + [0, 1, 2, 3, 4, 5].map((i) => shoe(1250 + (i % 3) * 150, 860 - Math.floor(i / 3) * 110, 0.5, { accent: BLUE })).join('') + mid(onitsuka2, 560, { blink: blinking(t, 1), arms: P.think, expr: 'worry', sweat: true }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 急に止まろうとすると、靴の底がすべってしまうのだ。
    (tl, d, t) => { const k = clamp((tl - 0.5) / 0.6); return cam(gym(880) + player({ x: 700 + k * 260, y: 1100, s: 1.5, blink: true, expr: 'wow', tilt: k * -28, arms: P.cheer }) + sound('ツルッ', 1350, 420, tl, 0.5, RED, 110) + line([[640, 1110], [1000, 1110]], { w: 6, color: '#f4efe2', passes: 1 }), tl, d, { z0: 1.0, z1: 1.04, x0: 960 + shake(tl, 0.6, 0.4, 8) }); },
    // 2 ゴムを変え、形を変え、何足も試作を重ねた。
    (tl, d) => cam(fill('#e9dcc6') + [0, 1, 2, 3].map((i) => xf(shoe(0, 0, 1.1, { col: ['#f4efe2', '#e8d8c0', '#d8e0e8', '#f0e0d8'][i], accent: [BLUE, RED, '#3f7a5a', YEL][i] }), { x: 280 + i * 450, y: 680, s: popS(tl, i * 0.35) })).join('') + T('何足も', 960, 260, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 靴をかかえて体育館に通い、選手に履いてもらっては、意見を聞く。
    (tl, d, t) => cam(gym(880) + mid(onitsuka2, 600, { blink: blinking(t, 1), arms: P.hold, expr: 'smile' }) + shoeBox(600, 900, 1.0) + mid(player, 1320, { blink: blinking(t, 2), arms: P.point, expr: 'smile', flip: true }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 「止まれない」「すべる」。返ってくるのは、そんな声ばかりだった。
    (tl, d, t) => cam(gym(880) + [500, 960, 1420].map((x, i) => player({ x, y: 1120, s: 1.4, blink: blinking(t, i), expr: 'worry', arms: P.shrug })).join('') + enter(bubble('止まれない', 520, 360, { size: 56 }), tl, 0.2, { cx: 520, cy: 360 }) + enter(bubble('すべる', 1400, 320, { size: 56 }), tl, 0.7, { cx: 1400, cy: 320 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 それでも、すべらない靴はできなかった。
    (tl, d, t) => cam(fill('#3a3a44') + glow(960, 500, 500, '#fff', 0.12) + mid(onitsuka2, 960, { blink: blinking(t, 1), arms: P.shrug, expr: 'worry', sweat: true, tilt: -6 }), tl, d, { z0: 1.0, z1: 1.1 }),
    // 6 答えは、思いもよらない場所にあった。
    (tl, d) => cam(fill('#1d2030') + `<polygon points="860,-40 1060,-40 1260,1100 660,1100" fill="#fff6d0" opacity="0.2"/>` + xf(T('？', 960, 640, 260, YEL), { s: popS(tl, 0.3), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
  ],

  // ───── タコの吸盤
  '07': [
    // 0 鬼塚は、食卓でも靴のことばかり考えていた。
    (tl, d, t) => cam(table() + sunomono(1250, 720, 0.9) + mid(onitsuka2, 600, { blink: blinking(t, 1), arms: P.think, expr: 'smile', y: 1180 }) + xf(shoe(0, 0, 0.6, { accent: BLUE }), { x: 760, y: 300 + bob(tl, 8, 1), s: popS(tl, 0.3) }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 ある日の夕ごはん。皿に、キュウリとタコの酢の物があった。
    (tl, d) => cam(table() + glow(960, 640, 500, '#fff3d6', 0.4) + sunomono(960, 720, 2.0), tl, d, { z0: 1.12, z1: 1.0 }),
    // 2 鬼塚は、タコの足の吸盤に目を止めた。
    [
      (tl, d) => cam(table() + sunomono(960, 760, 1.6) + chopsticks(1150, 560, 1.4, -30), tl, d, { z0: 1.0, z1: 1.08 }),
      (tl, d) => cam(fill('#f6e6dc') + tentacle(960, 560, 2.6, 0.3) + (([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r * 1.9 + Math.sin(tl * 5) * 6}" fill="none" stroke="${RED}" stroke-width="12"/>`)(tentacleCup(960, 560, 2.6, 0.3, 3)), tl, d, { z0: 1.1, z1: 1.0 }),
    ],
    // 3 吸盤は、ピタッと吸い付いて、すべらない。
    (tl, d) => cam(fill('#e6eef2') + rect(-200, 700, 2400, 600, { fill: '#fdfbf3', color: null }) + tentacle(960, lerp(520, 640, ease.out(clamp(tl / 0.6))), 2.2, 0.1) + (tl > 0.6 ? sound('ピタッ', 1450, 360, tl, 0.6, RED, 120) : ''), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 「これを、靴の底にできないか」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(1300, 500, 500, YEL, 0.4) + mid(onitsuka2, 560, { blink: blinking(t, 1), arms: P.raise, expr: 'wow' }) + tentacle(1300, 420, 0.9, 0.3) + xf(arrow(1300, 520, 1300, 640, { w: 12 }), { s: popS(tl, 0.3), cx: 1300, cy: 580 }) + sole(1300, 860, 0.6, 0), tl, d, { z0: 1.0, z1: 1.05 }),
    // 5 靴の底に、吸盤のようなくぼみを付けてみた。すると、急に止まっても、すべらない。
    [
      (tl, d) => cam(fill('#e2e6ee') + sole(960, 560, 1.7, clamp(tl / (d * 0.8))), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d, t) => { const k = clamp((tl - 0.4) / 0.4); return cam(gym(880) + player({ x: 700 + k * 200, y: 1100, s: 1.5, blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + (tl > 0.8 ? sound('ピタッ', 1300, 420, tl, 0.8, '#3f7a5a', 110) : ''), tl, d, { z0: 1.0, z1: 1.04 }); },
    ],
    // 6 こうして生まれたバスケットボールの靴は、選手たちの評判になった。
    (tl, d, t) => cam(gym(880) + [500, 960, 1420].map((x, i) => player({ x, y: 1120, s: 1.4, blink: blinking(t, i), expr: 'smile', arms: P.cheer })).join('') + xf(shoe(0, 0, 0.9, { high: true, accent: RED }), { x: 960, y: 420, s: popS(tl, 0.2) }) + sparkles(1120, 360, 60, YEL), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 全国の大会で、鬼塚の靴を履いたチームが、次々と活躍するようになる。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 600, 600, YEL, 0.3) + [0, 1, 2].map((i) => xf(trophy(0, 0, 0.9), { x: 520 + i * 440, y: 640, s: popS(tl, 0.2 + i * 0.4) })).join('') + T('次々と優勝', 960, 230, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 ブランドの名前は「タイガー」。のちの「オニツカタイガー」の始まりだ。
    (tl, d) => cam(fill('#f2c230') + glow(960, 540, 700, '#fff', 0.2) + xf(T('タイガー', 960, 600, 220, INK, C.white), { s: popS(tl, 0.2), cx: 960, cy: 520 }) + typeText('のちの オニツカタイガー', 960, 800, tl, { size: 70, color: INK, delay: 0.8 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 9 強くて、しなやかに走る虎のように、という思いが込められていたと言われている。
    (tl, d) => cam(fill('#f6e2b4') + floor('#c9a46a') + tiger(tw(tl, 0, d, 500, 1300), 900, 1.5, tl) + T('しなやかに走る虎', 960, 240, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── マラソンの靴
  '08': [
    // 0 次に鬼塚が目を付けたのは、マラソンだった。
    (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a9a', 880) + [0, 1].map((i) => runner(tw(tl, 0, d, 200, 1500) - i * 360, 980, 0.95, tl + i * 0.4, { shirt: [RED, BLUE][i], num: String(i + 1) })).join('') + T('マラソン', 960, 260, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 当時のマラソン選手は、足袋のような薄い靴で走ることも多かった。
    (tl, d) => cam(fill('#f1e2c8') + xf(`<g>${poly([[-170, -20], [-170, -90], [-60, -110], [100, -70], [180, -30], [180, -20]], { fill: '#f4efe2' }) + line([[60, -80], [60, -24]], { w: 5, passes: 1 }) + rect(-180, -24, 370, 10, { fill: '#c9c2b0', w: 4 })}</g>`, { x: 960, y: 700, s: 2.2 }) + T('薄い', 960, 300, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
    // 2 長い距離を走ると、足の裏にマメができる。原因は、靴の中の熱と、こすれだった。
    [
      (tl, d) => cam(fill('#fdf1dc') + footBlister(960, 560, 1.5, clamp((tl - 0.3) / 0.6)) + T('マメ', 1400, 420, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d) => cam(fill('#3a2a24') + glow(960, 560, 500, '#f2a23a', 0.4) + shoe(960, 760, 2.0, { accent: BLUE }) + [0, 1, 2].map((i) => `<path d="M ${820 + i * 120} 560 q 20 -40 0 -80 q -20 -40 0 -80" fill="none" stroke="#f2a23a" stroke-width="10" opacity="0.8"/>`).join('') + T('熱とこすれ', 960, 230, 100, C.white, '#9a2e28'), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 3 そこで鬼塚は、靴に空気が通る工夫をして、足を冷やすようにした。
    (tl, d) => cam(fill('#d8ecf6') + shoe(960, 760, 2.0, { accent: BLUE, holes: true }) + [0, 1, 2, 3].map((i) => { const k = (tl * 0.8 + i * 0.25) % 1; return line([[300 + k * 600, 540 + i * 40], [420 + k * 600, 540 + i * 40]], { w: 8, color: '#5aa0d8', passes: 1 }); }).join('') + T('空気を通す', 960, 260, 100, BLUE, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 鬼塚は、医者に話を聞き、マメができる仕組みを調べ上げた。
    (tl, d, t) => cam(fill('#eef2f2') + mid(onitsuka2, 560, { blink: blinking(t, 1), arms: P.think, expr: 'smile' }) + mid(kid, 1360, { hair: 'side', hairColor: '#5a5a5a', glasses: true, shirt: C.white, jacket: C.white, pants: '#5a6a7a', blink: blinking(t, 2), arms: P.point, expr: 'smile', flip: true }) + footBlister(960, 420, 0.6, 1), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 「マメのできないマラソンシューズ」。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 560, 600, YEL, 0.4) + shoe(960, 760, 2.0, { accent: RED, holes: true }) + xf(sign('マメのできないマラソンシューズ', 960, 300, { size: 64, fill: C.white, rot: -2 }), { s: popS(tl, 0.2), cx: 960, cy: 300 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 6 鬼塚は、足の中で汗がこもらないよう、靴の横に小さな穴を開けた。
    (tl, d) => cam(fill('#e2e6ee') + shoe(960, 780, 2.4, { accent: BLUE, holes: true }) + `<circle cx="${960 - 120 * 2.4 + 40}" cy="${780 - 80 * 2.4}" r="${120 + Math.sin(tl * 5) * 8}" fill="none" stroke="${RED}" stroke-width="12"/>` + T('小さな穴', 1450, 300, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
    // 7 この靴は、日本の多くのランナーに使われるようになる。
    (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a9a', 880) + [0, 1, 2, 3].map((i) => runner(tw(tl, 0, d, 100, 1700) - i * 300, 980, 0.8, tl + i * 0.3, { shirt: [RED, BLUE, '#3f7a5a', YEL][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 走る人の悩みを、一つずつ技術で解決する。これが、鬼塚のものづくりだった。
    (tl, d) => { let s = fill('#fdf1dc');
      ['すべる', 'マメ', 'むれる'].forEach((lb, i) => { const x = 330 + i * 630;
        s += rect(x - 270, 260, 540, 420, { fill: ['#fff2c8', '#f6e0dc', '#d6e6f2'][i] }) + text(lb, x, 470, { size: 80, font: 'Zen Maru Gothic', weight: 900 }) +
          xf(text('✓', 0, 0, { size: 130, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { x: x + 170, y: 360, s: popS(tl, 0.3 + i * 0.5) }); });
      return cam(s + T('技術で解決', 960, 840, 90, RED, C.white), tl, d, { z0: 1.0, z1: 1.03 }); },
  ],

  // ───── はだしのランナー
  '09': [
    // 0 舞台は1960年、ローマオリンピックのマラソン。
    [
      (tl) => blackType('1960年', tl),
      (tl, d) => cam(fill('#f6e2c0') + cobble(880) + [0, 1, 2].map((i) => rect(200 + i * 600, 300, 300, 580, { fill: '#e8d0a8', w: 6 })).join('') + T('ローマ', 960, 240, 110, INK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    ],
    // 1 優勝したのは、なんと、はだしで走ったエチオピアのアベベ選手だった。
    (tl, d) => cam(fill('#f6e2c0') + cobble(880) + runner(tw(tl, 0, d, 300, 1300), 990, 1.1, tl, { shirt: '#3f7a5a', pants: '#e8e0d0', skin: '#8a5a3a', shoes: false, num: '11' }) + T('はだし！', 1500, 300, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 石畳の道を、靴を履かずに42キロ。世界中が驚いた。
    [
      (tl, d) => cam(fill('#f6e2c0') + cobble(700) + xf(T('42キロ', 960, 400, 180, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 340 }), tl, d, { z0: 1.0, z1: 1.06 }),
      (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 540, 1.25, [0, 1, 2, 3, 4, 5]) + [0, 1, 2, 3, 4].map((i) => xf(T('！', 0, 0, 90, RED, C.white), { x: [1300, 960, 1000, 520, 640][i], y: [400, 320, 520, 330, 640][i], s: popS(tl, i * 0.15) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 3 「この選手に、自分の靴を履いてもらいたい」。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(onitsuka2, 560, { blink: blinking(t, 1), arms: P.hold, expr: 'smile' }) + shoe(560, 820, 0.7, { accent: RED }) + enter(bubble('この選手に履いてほしい', 1300, 330, { size: 56 }), tl, 0.2, { cx: 1300, cy: 330 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 4 鬼塚は、靴を履いてもらおうと、アベベ選手に会いに行ったと言われている。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(onitsuka2, 600, { blink: blinking(t, 1), arms: [12, 8, 70, -20], expr: 'smile' }) + mid(kid, 1320, { hair: 'messy', hairColor: '#1a1410', skin: '#8a5a3a', shirt: '#3f7a5a', pants: '#e8e0d0', blink: blinking(t, 2), arms: [12, 8, 70, -20], expr: 'smile', flip: true }) + shoeBox(960, 820, 1.0), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 そして迎えた、1964年の東京オリンピック。
    [
      (tl) => blackType('1964年', tl),
      (tl, d) => cam(fill('#cfe6f5') + rect(-200, 640, 2400, 600, { fill: '#c86a4a', color: null }) + [0, 1, 2, 3, 4, 5].map((i) => line([[-200, 700 + i * 60], [2200, 700 + i * 60]], { w: 4, color: '#f4efe2', passes: 1 })).join('') + rect(200, 300, 1520, 340, { fill: '#a8b0b8', w: 6 }) + T('東京', 960, 240, 110, INK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    ],
    // 6 マラソンで銅メダルを取った円谷幸吉選手の足には、鬼塚の会社の靴があった。
    [
      (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 600, YEL, 0.35) + xf(medal(0, 0, 2.0), { x: 960, y: 620, s: popS(tl, 0.2) }) + T('銅メダル', 960, 230, 110, '#9a5a2a', C.white), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#c86a4a') + [0, 1, 2, 3].map((i) => line([[-200, 700 + i * 80], [2200, 700 + i * 80]], { w: 4, color: '#f4efe2', passes: 1 })).join('') + xf(shoe(0, 0, 2.2, { accent: RED }), { x: 960, y: 760 }) + `<circle cx="960" cy="640" r="${280 + Math.sin(tl * 4) * 10}" fill="none" stroke="${YEL}" stroke-width="12"/>`, tl, d, { z0: 1.1, z1: 1.0 }),
    ],
    // 7 日本中が、テレビの前で声援を送ったレースだった。
    (tl, d, t) => cam(fill('#e9dcc6') + floor('#a07a50') + oldTV(960, 560, 1.2, runner(0, 90, 0.4, tl, { shirt: C.white })) + [400, 1520].map((x, i) => kid({ x, y: 1120, s: 1.4, hair: i ? 'bob' : 'messy', shirt: [C.blue, C.pink][i], blink: blinking(t, i), expr: 'smile', arms: P.cheer, flip: i === 1 })).join('') + sound('がんばれ！', 960, 220, tl, 0.3, RED, 90), tl, d, { z0: 1.0, z1: 1.04 }),
    // 8 神戸の小さな靴屋は、世界の舞台に立った。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 500, 700, YEL, 0.35) + factory(960, 880, 0.9, '#d9c9a8', false) + sparkles(1250, 500, 80, YEL) + T('世界の舞台へ', 960, 230, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    // 9 そしてこのころ、一人のアメリカの若者が、鬼塚の会社をたずねてきていた。
    (tl, d, t) => cam(fill('#1d2030') + `<polygon points="860,-40 1060,-40 1260,1100 660,1100" fill="#fff6d0" opacity="0.2"/>` + xf(phil({ x: 0, y: 0, s: 1.85, blink: blinking(t, 2), expr: 'smile' }), { x: 960, y: 1100, o: clamp(tl / 0.6) }) + T('？', 1300, 400, 140, YEL), tl, d, { z0: 1.12, z1: 1.0 }),
  ],

  // ───── アメリカから来た若者
  '11': [
    // 0 その若者の名前は、フィル・ナイト。大学を出たばかりの、陸上選手だった。
    [
      (tl, d, t) => cam(fill(CREAM) + mid(phil, 700, { blink: blinking(t, 2), arms: P.hips, expr: 'smile' }) + typeText('フィル・ナイト', 1340, 520, tl, { size: 84, color: INK, delay: 0.2 }), tl, d, { z0: 1.0, z1: 1.05 }),
      (tl, d) => cam(fill('#cfe0e8') + floor('#c86a4a', 880) + runner(tw(tl, 0, d, 300, 1500), 990, 1.1, tl, { shirt: '#3f7a5a', hair: '#c9a04a' }), tl, d, { z0: 1.0, z1: 1.04 }),
    ],
    // 1 大学で陸上の名コーチに学んだ彼は、靴がどれほど大切かを、身をもって知っていた。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(phil, 600, { blink: blinking(t, 2), arms: P.hold, expr: 'smile' }) + shoe(600, 820, 0.7, { accent: BLUE }) + mid(kid, 1350, { hair: 'side', hairColor: '#8a8a8a', shirt: '#3a6ea5', pants: '#3a3a3a', blink: blinking(t, 3), arms: P.point, expr: 'smile', flip: true }) + T('靴が大切', 960, 240, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 世界を旅する途中で、日本に立ち寄ったのだ。
    (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 540, 1.25, [0]) + xf(plane(0, 0, 0.6), { x: lerp(500, 1450, ease.inOut(clamp(tl / (d * 0.9)))), y: lerp(300, 330, clamp(tl / d)) - Math.sin(clamp(tl / d) * Math.PI) * 120, r: -6 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 彼は、日本の運動靴は、品質が良くて値段が安いと考えていた。
    (tl, d, t) => cam(fill('#fbe9d0') + mid(phil, 560, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + shoe(1300, 700, 1.2, { accent: RED }) + enter(sign('品質が良い', 1300, 380, { size: 64, fill: C.white }), tl, 0.2, { cx: 1300, cy: 380 }) + enter(sign('安い', 1300, 900 - 60, { size: 64, fill: YEL }), tl, 0.7, { cx: 1300, cy: 840 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 「この靴を、アメリカで売らせてほしい」。
    (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 940, 1.2) + mid(onitsuka2, 520, { blink: blinking(t, 1), arms: P.idle, expr: 'smile' }) + mid(phil, 1400, { blink: blinking(t, 2), arms: P.point, expr: 'smile', flip: true }) + enter(bubble('アメリカで売らせて！', 1300, 300, { size: 56 }), tl, 0.2, { cx: 1300, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 鬼塚は、熱心に語るこの若者を気に入り、アメリカでの販売を任せることにした。
    (tl, d, t) => cam(fill('#fff2c8') + glow(960, 560, 600, YEL, 0.35) + onitsuka2({ x: 700, y: 1180, s: 2.0, blink: blinking(t, 1), arms: [12, 8, 70, -30], expr: 'smile' }) + phil({ x: 1220, y: 1180, s: 2.0, blink: blinking(t, 2), arms: [12, 8, 70, -30], expr: 'smile', flip: true }) + xf(T('任せた！', 960, 220, 110, RED, C.white), { s: popS(tl, 0.3), cx: 960, cy: 180 }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 6 まだ会社もない若者の、思い切った申し出だった。
    (tl, d, t) => cam(fill('#e2e6ee') + mid(phil, 960, { blink: blinking(t, 2), arms: P.cheer, expr: 'smile' }) + xf(T('会社はまだない', 960, 240, 100, INK, C.white), { s: popS(tl, 0.3), cx: 960, cy: 200 }), tl, d, { z0: 1.0, z1: 1.06 }),
    // 7 その場で考えた会社の名前を名乗ったとも言われている。
    (tl, d, t) => cam(fill('#e9dcc6') + mid(phil, 600, { blink: blinking(t, 2), arms: P.think, expr: 'smile' }) + enter(bubble('会社の名前は…', 1250, 360, { size: 60 }), tl, 0.3, { cx: 1250, cy: 360 }) + sparkles(800, 380, 50, YEL), tl, d, { z0: 1.0, z1: 1.05 }),
    // 8 こうして、彼はアメリカで、鬼塚の会社の靴を売り始める。
    (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 540, 1.25, [3]) + xf(shoeBox(0, 0, 1.0), { x: lerp(1500, 520, ease.inOut(clamp(tl / (d * 0.8)))), y: 330 - Math.sin(clamp(tl / (d * 0.8)) * Math.PI) * 140 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 9 その会社が、のちの「ナイキ」だ。
    (tl, d) => cam(fill('#1d2030') + glow(960, 540, 600, '#fff', 0.15) + xf(T('のちの ナイキ', 960, 600, 170, C.white, INK), { s: popS(tl, 0.2), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
    // 10 陸上のコーチだった恩師と二人、それぞれ500ドルずつを出し合って始めた、小さな会社だった。
    (tl, d, t) => cam(fill('#fbe9d0') + mid(phil, 520, { blink: blinking(t, 2), arms: P.hold, expr: 'smile' }) + mid(kid, 1400, { hair: 'side', hairColor: '#8a8a8a', shirt: '#3a6ea5', pants: '#3a3a3a', blink: blinking(t, 3), arms: P.hold, expr: 'smile', flip: true }) +
      xf(moneyBag(0, 0, 0.7, '$'), { x: 760, y: 640, s: popS(tl, 0.3) }) + xf(moneyBag(0, 0, 0.7, '$'), { x: 1160, y: 640, s: popS(tl, 0.6) }) + T('500ドルずつ', 960, 240, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── 売れていく靴
  '12': [
    // 0 若者は、陸上の大会に車で乗り付け、トランクから靴を売った。
    (tl, d, t) => cam(fill('#cfe0e8') + floor('#9ab07a', 880) + carTrunk(1250, 920, 1.1) + mid(phil, 520, { blink: blinking(t, 2), arms: P.wave, expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 選手たちに直接話しかけ、履いてもらい、感想を聞く。地道な売り方だった。
    (tl, d, t) => cam(fill('#cfe0e8') + floor('#9ab07a', 880) + mid(phil, 600, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + mid(player, 1320, { shirt: '#3f7a5a', blink: blinking(t, 1), arms: P.idle, expr: 'smile', flip: true }) + enter(bubble('どう？', 960, 360, { size: 60 }), tl, 0.2, { cx: 960, cy: 360 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 日本の靴は、アメリカのランナーたちに人気になった。
    (tl, d) => cam(fill('#cfe0e8') + floor('#c86a4a', 880) + [0, 1, 2, 3].map((i) => runner(tw(tl, 0, d, 100, 1700) - i * 300, 980, 0.8, tl + i * 0.3, { shirt: [RED, BLUE, '#3f7a5a', YEL][i], hair: ['#c9a04a', '#5a3a2a', '#c9a04a', '#2a2420'][i] })).join('') + T('人気！', 960, 260, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 売り上げは、どんどん伸びていった。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 600, YEL, 0.3) + chartUp([[400, 900], [700, 780], [900, 800], [1200, 560], [1500, 300]], '#4fd65a', clamp(tl / (d * 0.8)) + 0.2) + T('どんどん', 600, 260, 110, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 若者たちは、日本の靴をもとに、アメリカの選手に合わせた改良まで提案するようになった。
    (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 940, 1.2) + shoe(960, 640, 1.4, { accent: BLUE }) + mid(phil, 460, { blink: blinking(t, 2), arms: P.point, expr: 'smile' }) + enter(sign('改良の提案', 1450, 380, { size: 64, fill: C.white }), tl, 0.4, { cx: 1450, cy: 380 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 だが、二つの会社の関係は、長くは続かなかった。
    (tl, d) => cam(fill('#3a3a44') + glow(960, 540, 600, '#fff', 0.1) + factory(560, 880, 0.7, '#c9c2b0', false) + building(1360, 880, 300, 400, '#8a8f96') + xf(T('…', 960, 600, 160, C.white), { s: popS(tl, 0.4), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.06 }),
  ],

  // ───── 別れ
  '13': [
    // 0 どこに、どれだけ売るのか。誰が、どこまで決めるのか。
    (tl, d, t) => cam(fill('#e2e6ee') + desk(960, 940, 1.4) + mid(onitsuka2, 520, { blink: blinking(t, 1), arms: P.point, expr: 'angry' }) + mid(phil, 1400, { blink: blinking(t, 2), arms: P.point, expr: 'angry', flip: true }) + enter(bubble('どこに？', 640, 300, { size: 56 }), tl, 0.2, { cx: 640, cy: 300 }) + enter(bubble('誰が決める？', 1300, 300, { size: 56 }), tl, 0.8, { cx: 1300, cy: 300 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 1 二つの会社の考えは、少しずつ食い違っていった。
    (tl, d) => cam(fill('#e9dcc6') + xf(arrow(960, 600, 960 - tl * 120, 300, { w: 14 }), {}) + xf(arrow(960, 600, 960 + tl * 120, 300, { w: 14, color: RED }), {}) + T('食い違い', 960, 860, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 2 お互いに、相手を信じきれなくなっていったのだ。
    (tl, d, t) => cam(fill('#3a3a44') + glow(960, 540, 500, '#fff', 0.1) + mid(onitsuka2, 600, { blink: blinking(t, 1), arms: P.idle, expr: 'worry', look: [1, 0] }) + mid(phil, 1320, { blink: blinking(t, 2), arms: P.idle, expr: 'worry', flip: true, look: [-1, 0] }), tl, d, { z0: 1.0, z1: 1.05 }),
    // 3 ついに二つの会社は、1970年代のはじめに、たもとを分かつ。
    (tl, d) => cam(fill('#2a1418') + glow(960, 540, 600, '#9a2e28', 0.4) + contract(960, 560, 1.5, clamp((tl - 0.5) / 0.8)) + T('1970年代', 960, 200, 90, C.white, '#9a2e28'), tl, d, { z0: 1.0, z1: 1.05, x0: 960 + shake(tl, 0.9, 0.4, 10) }),
    // 4 若者は、自分たちで靴を作り始めた。それが「ナイキ」ブランドの始まりだ。
    (tl, d, t) => cam(fill('#e9dcc6') + desk(960, 940, 1.2) + mid(phil, 560, { blink: blinking(t, 2), arms: P.work, expr: 'smile' }) + xf(shoe(0, 0, 1.3, { col: '#e8e8e8', accent: '#5a5a5a' }), { x: 1300, y: 760, s: popS(tl, 0.4) }) + T('自分たちの靴', 1300, 300, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 新しいブランドの名前は、ギリシャ神話の勝利の女神から付けられた。
    (tl, d) => cam(fill('#f2eadc') + [0, 1, 2, 3].map((i) => rect(360 + i * 380, 300, 70, 560, { fill: '#e8e0d0', w: 6 })).join('') + poly([[300, 300], [1620, 300], [960, 140]], { fill: '#e8e0d0' }) + rect(280, 860, 1360, 60, { fill: '#d8d0c0' }) + T('勝利の女神', 960, 640, 110, '#9a7a2a', C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    // 6 一番のお客さんを失った鬼塚の会社。だが、ここからが本当の勝負だった。
    [
      (tl, d, t) => cam(fill('#3a3a44') + glow(960, 500, 500, '#fff', 0.12) + mid(onitsuka2, 960, { blink: blinking(t, 1), arms: P.shrug, expr: 'worry' }), tl, d, { z0: 1.0, z1: 1.08 }),
      (tl, d, t) => cam(fill('#fff2c8') + glow(960, 500, 600, YEL, 0.35) + mid(onitsuka2, 960, { blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }) + xf(T('ここからが勝負', 960, 230, 100, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 190 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
  ],

  // ───── 三つの会社がひとつに
  '15': [
    // 0 鬼塚の会社は1977年、ほかの二つのスポーツ用品の会社と一緒になった。
    (tl, d) => { const k = ease.inOut(clamp((tl - 0.5) / 1.2)); return cam(fill('#cfe0e8') + floor('#b9a070') + [-1, 0, 1].map((i) => xf(factory(0, 0, 0.55, ['#d9c9a8', '#c9d0d8', '#e0c8c0'][i + 1], false), { x: 960 + i * 520 * (1 - k), y: 880, o: 1 - k * (i === 0 ? 0 : 1) })).join('') +
      (k > 0.5 ? xf(building(0, 0, 520, 480, '#a8b4c8'), { x: 960, y: 880, s: popS(tl, 1.1), cx: 0, cy: -240 }) : '') + T('1977年', 960, 220, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }); },
    // 1 新しい名前は「アシックス」。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, BLUE, 0.08) + xf(T('アシックス', 960, 620, 210, BLUE, C.white), { s: popS(tl, 0.1), cx: 960, cy: 540 }), tl, d, { z0: 1.0, z1: 1.08 }),
    // 2 世界と戦うには、もっと大きな力が必要だった。
    (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 600, 1.0, [0, 1, 2, 3, 4, 5]) + T('もっと大きな力', 960, 170, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 これは、古代ローマの言葉の頭文字から取った名前だ。
    (tl, d) => cam(fill('#f2eadc') + [0, 1, 2].map((i) => rect(560 + i * 340, 340, 70, 520, { fill: '#e8e0d0', w: 6 })).join('') + poly([[480, 340], [1440, 340], [960, 190]], { fill: '#e8e0d0' }) + T('古代ローマの言葉', 960, 150, 90, INK, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    // 4 ラテン語の「アニマ・サーナ・イン・コルポレ・サーノ」。
    (tl, d) => cam(fill('#e9dcc6') + blackboard(960, 500, 1500, 520) + typeText('Anima Sana', 960, 430, tl, { size: 96, color: '#f4efe2', font: 'Yomogi', weight: 400, cps: 8 }) + typeText('In Corpore Sano', 960, 590, tl, { size: 96, color: '#f4efe2', font: 'Yomogi', weight: 400, cps: 8, delay: 1.2 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 頭文字をつなげると、A、S、I、C、S。アシックスになる。
    (tl, d) => { const words = [['A', 'nima', 380], ['S', 'ana', 680], ['I', 'n', 920], ['C', 'orpore', 1080], ['S', 'ano', 1430]];
      let s = fill('#e9dcc6') + blackboard(960, 460, 1600, 420);
      // 頭文字は大きな黄色、残りは白。頭文字のまわりに丸
      words.forEach(([h, rest, x], i) => { s += text(h, x, 490, { size: 110, color: YEL, anchor: 'start' }) + text(rest, x + 62, 490, { size: 84, color: '#f4efe2', anchor: 'start' }) + (tl > 0.4 + i * 0.35 ? `<circle cx="${x + 34}" cy="454" r="58" fill="none" stroke="${YEL}" stroke-width="8"/>` : ''); });
      return cam(s + (tl > 2.2 ? xf(T('A・S・I・C・S', 960, 860, 110, BLUE, C.white), { s: popS(tl, 2.2), cx: 960, cy: 820 }) : ''), tl, d, { z0: 1.0, z1: 1.03 }); },
    // 6 意味は、「健全な身体に、健全な精神があれかし」。
    (tl, d) => cam(fill('#fff2c8') + glow(960, 540, 700, YEL, 0.3) + typeText('健全な身体に、', 960, 470, tl, { size: 100, color: INK, cps: 9 }) + typeText('健全な精神があれかし', 960, 640, tl, { size: 100, color: RED, cps: 9, delay: 0.9 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 7 スポーツで若者を元気にしたい。鬼塚が戦後に願ったことが、そのまま社名になった。
    [
      (tl, d, t) => cam(burntKobe() + mid(onitsuka, 960, { blink: blinking(t, 1), arms: P.cheer, expr: 'smile' }), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, BLUE, 0.08) + T('アシックス', 960, 560, 180, BLUE, C.white) + typeText('＝ 戦後の願い', 960, 760, tl, { size: 80, color: RED, delay: 0.3 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
  ],

  // ───── 眠っていたブランドの復活
  '16': [
    // 0 新しい会社になって、「オニツカタイガー」の名前は、しばらく使われなくなった。
    (tl, d) => cam(fill('#4a453e') + floor('#2e2a25', 860) + [0, 1, 2, 3, 4].map((i) => shoeBox(400 + i * 280, 860 - (i % 2) * 70, 1.1, '#8a6a4a')).join('') + `<rect x="-200" y="-200" width="2400" height="1500" fill="#b9a27a" opacity="0.15"/>` + T('しばらく眠る', 960, 260, 100, C.white), tl, d, { z0: 1.06, z1: 1.0 }),
    // 1 ところが2002年、昔の靴が見直され、オニツカタイガーのブランドが復活する。
    [
      (tl) => blackType('2002年', tl),
      (tl, d) => cam(fill('#fff2c8') + glow(960, 600, 600, YEL, 0.4) + shoe(960, 760, 2.0, { col: '#f2c230', accent: INK }) + sparkles(1260, 520, 80, YEL) + xf(T('復活', 960, 260, 140, RED, C.white), { s: popS(tl, 0.2), cx: 960, cy: 220 }), tl, d, { z0: 1.0, z1: 1.05 }),
    ],
    // 2 だが、昔の靴のデザインを懐かしむ声は、世界中に残っていた。
    (tl, d) => cam(fill('#cfe6f5') + worldMap(960, 540, 1.25, [0, 1, 3, 5]) + [0, 1, 2, 3].map((i) => xf(text('♥', 0, 0, { size: 60, color: RED, font: 'Zen Maru Gothic', weight: 900 }), { x: [1300, 960, 520, 640][i], y: [400, 320, 330, 640][i], s: popS(tl, i * 0.2) })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 翌年、ハリウッドの映画で主人公が履いたことで、世界中で話題になった。
    (tl, d) => cam(cinema(tl), tl, d, { z0: 1.06, z1: 1.0 }),
    // 4 今では、海外の人が日本に来て、お土産に買っていく人気のブランドだ。
    (tl, d, t) => cam(fill('#fbe9d0') + floor('#a07a50') + rect(1150, 360, 560, 520, { fill: '#e8d8c0' }) + [0, 1, 2].map((i) => shoe(1430, 500 + i * 130, 0.5, { col: ['#f2c230', '#f4efe2', '#d8e0e8'][i], accent: [INK, RED, BLUE][i] })).join('') +
      [380, 720].map((x, i) => kid({ x, y: 1120, s: 1.4, hair: i ? 'bob' : 'messy', hairColor: ['#c9a04a', '#7a4a2a'][i], shirt: [C.blue, C.pink][i], blink: blinking(t, i), expr: 'smile', arms: P.point })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
    // 5 昔のデザインが、今の若者には新しく見えたのだ。
    (tl, d) => cam(fill('#fdf1dc') + `<rect x="200" y="260" width="620" height="560" fill="#ead2a6" stroke="${INK}" stroke-width="7"/>` + shoe(510, 640, 1.0, { col: '#f2c230', accent: INK }) + xf(arrow(860, 540, 1060, 540, { w: 14 }), { s: popS(tl, 0.3), cx: 960, cy: 540 }) + shoe(1410, 640, 1.0, { col: '#f2c230', accent: INK }) + sparkles(1600, 420, 60, YEL) + text('昔', 510, 340, { size: 70, font: 'Zen Maru Gothic', weight: 900 }) + text('今', 1410, 340, { size: 70, font: 'Zen Maru Gothic', weight: 900 }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 6 今のアシックスは、売り上げの8割以上を海外で稼いでいる。
    (tl, d) => { const k = clamp(tl / 1.2); const a = -Math.PI / 2 + Math.PI * 2 * 0.8 * k; const r = 280;
      return cam(fill('#fff2c8') + `<circle cx="960" cy="560" r="${r}" fill="#d6dce4" stroke="${INK}" stroke-width="7"/>` + `<path d="M 960 560 L 960 ${560 - r} A ${r} ${r} 0 ${k > 0.625 ? 1 : 0} 1 ${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r} Z" fill="${BLUE}" stroke="${INK}" stroke-width="7"/>` +
        T('海外 8割以上', 960, 240, 100, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }); },
    // 7 世界のトップランナーの足元にも、アシックスの靴がある。
    (tl, d) => cam(fill('#cfe0e8') + floor('#c86a4a', 880) + [0, 1, 2].map((i) => runner(tw(tl, 0, d, 200, 1600) - i * 380, 990, 1.0, tl + i * 0.3, { shirt: [RED, BLUE, YEL][i], skin: ['#f6d2b0', '#8a5a3a', '#e8b890'][i], num: String(i + 1) })).join('') + T('世界のトップランナー', 960, 260, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  ],

  // ───── まとめ
  '17': [
    // 0 焼け野原の神戸で、若者を元気にしたいと願った青年。
    (tl, d, t) => cam(burntKobe() + mid(onitsuka, 960, { blink: blinking(t, 1), arms: P.think, expr: 'smile' }), tl, d, { z0: 1.06, z1: 1.0 }),
    // 1 いちばん難しい靴から始め、タコの吸盤で答えを見つけた。
    [
      (tl, d) => cam(gym(880) + shoe(960, 860, 2.0, { high: true, accent: RED }), tl, d, { z0: 1.06, z1: 1.0 }),
      (tl, d) => cam(table() + glow(960, 640, 500, '#fff3d6', 0.4) + sunomono(960, 720, 1.8), tl, d, { z0: 1.0, z1: 1.08 }),
    ],
    // 2 一番のお客さんに去られても、走ることをやめなかった。
    (tl, d) => cam(fill('#cfe0e8') + floor('#9a9a9a', 880) + runner(tw(tl, 0, d, 300, 1500), 990, 1.1, tl, { shirt: BLUE }), tl, d, { z0: 1.0, z1: 1.04 }),
    // 3 そして今、アシックスとナイキは、世界の舞台で競い合うライバルになった。
    (tl, d) => cam(fill('#cfe0e8') + floor('#c86a4a', 880) + runner(tw(tl, 0, d, 300, 1300), 990, 1.0, tl, { shirt: BLUE, num: '1' }) + runner(tw(tl, 0, d, 0, 1000), 990, 1.0, tl + 0.5, { shirt: '#5a5a5a', num: '2' }) + T('ライバル', 960, 260, 120, RED, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
    // 4 アシックスという名前には、今もあの言葉が込められている。
    (tl, d) => cam(fill(CREAM) + glow(960, 520, 800, BLUE, 0.08) + T('アシックス', 960, 600, 200, BLUE, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
    // 5 「健全な身体に、健全な精神があれかし」
    (tl) => fill('#111') + typeText('健全な身体に、', 960, 480, tl, { size: 96, color: C.white, cps: 8, font: 'Yomogi', weight: 400 }) + typeText('健全な精神があれかし', 960, 640, tl, { size: 96, color: YEL, cps: 8, delay: 1.0, font: 'Yomogi', weight: 400 }),
    // 6 あなたが今、はいている靴は、どこの靴ですか？ ぜひコメントで教えてください。
    (tl, d, t) => {
      let s = fill('#fdf1dc');
      [['タコの吸盤', (x, y) => tentacle(x, y - 40, 0.6, 0.3)], ['はだしのランナー', (x, y) => runner(x, y + 140, 0.55, t, { shoes: false, skin: '#8a5a3a', shirt: '#3f7a5a' })], ['ASICS', (x, y) => shoe(x, y + 40, 0.8, { accent: BLUE })]].forEach(([lb, f], i) => {
        const x = 330 + i * 630;
        s += rect(x - 290, 160, 580, 560, { fill: [SEPIA, '#fff2c8', '#d6dce4'][i] }) + f(x, 480) + text(lb, x, 680, { size: 56, font: 'Zen Maru Gothic', weight: 900 });
        s += xf(text('✓', x + 200, 260, { size: 130, color: C.green, font: 'Zen Maru Gothic', weight: 900 }), { s: popS(tl, 0.4 + i * 0.5), cx: x + 200, cy: 220 });
      });
      return s + enter(bubble('今はいている靴は？', 960, 820, { size: 48 }), tl, d * 0.5, { cx: 960, cy: 820 });
    },
    // 7 この動画が面白かったら、チャンネル登録もお願いします。
    (tl, d, t) => cam(fill(NAVY) + glow(800, 500, 700, '#fff', 0.2) + mid(guide, 700, { blink: blinking(t, 9), arms: P.wave }) + xf(sign('チャンネル登録', 1400, 520, { size: 90, fill: C.white, color: NAVY, rot: -4 }), { s: popS(tl, 0.3), cx: 1400, cy: 520 }), tl, d, { z0: 1.0, z1: 1.06, x0: 960 }),
  ],
};

// すみっこのネコ（小ネタ）：[声ファイル, 行, ネコが持っているもの]
const CATS = [['05', 3, () => shoe(0, 0, 0.18)], ['07', 1, () => tentacle(0, 0, 0.18, 0.4)], ['09', 7, () => ''], ['12', 0, () => shoeBox(0, 0, 0.25)], ['17', 7, () => '']];
const withCat = (f, toy) => (tl, d, t) => f(tl, d, t) + cat(lerp(-160, 140, ease.out(clamp((tl - 0.4) / 0.7))), 1010, tl, toy());
for (const [k, i, toy] of CATS) {
  const e = SHOTS[k][i];
  SHOTS[k][i] = Array.isArray(e) ? e.map((f) => withCat(f, toy)) : withCat(e, toy);
}

// ───── 終了画面（20秒・声なし）
export const endScreen = (t) => {
  let s = fill(NAVY) + glow(960, 500, 900, '#ffffff', 0.12);
  for (let i = 0; i < 10; i++) {
    const k = (t * 0.05 + i * 0.1) % 1;
    s += xf([(x, y, sc) => shoe(x, y, sc * 0.6), (x, y, sc) => tentacle(x, y, sc * 0.4), (x, y, sc) => shoeBox(x, y, sc * 0.6)][i % 3](0, 0, 0.8), { x: (i * 211) % 1920, y: lerp(1180, -100, k), r: t * 20 + i * 30, o: 0.22 });
  }
  s += typeText('次に見るならこちら', 960, 200, t, { size: 80, color: C.white, cps: 14 });
  for (const x of [160, 1020]) s += `<rect x="${x}" y="300" width="740" height="416" rx="24" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="22 14"/>`;
  s += `<circle cx="960" cy="900" r="92" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="6" stroke-dasharray="18 12"/>`;
  s += cat(lerp(-160, 150, ease.out(clamp((t - 1) / 0.8))), 1010, t, '');
  return s;
};
