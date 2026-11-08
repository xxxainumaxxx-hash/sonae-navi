// 任天堂（本番）のサムネイル 3案：node thumbnail.mjs 07-thumb A（B / C）
// 参考チャンネルのサムネから学んだ型：
//  ・背景は「場面」（店・会社・工場）。飾りの集中線ではなく、場所がわかる絵
//  ・上に大きな白い文字（暗い影つき）で「題材の名前」だけ（任天堂）。話の中身は絵で見せる
//  ・左に人物（表情はっきり）、右に主役の物を大きく。脇役が驚いて見ている
//  ・まわりを暗くして、主役にスポットライト。上がる／下がるグラフの線を重ねる
import { C, line, rect, ellipse, poly, text, sparkles } from '../lib/crayon.mjs';
import { xf } from '../lib/anim.mjs';
import { kid, worker, guide } from '../lib/cfolk.mjs';
import { hanafuda, bwHandheld, taxi, riceBox, extendHand, ball, gear, townRow, shop, trophy } from '../lib/cprops.mjs';
import { fill } from '../lib/shots.mjs';

export const meta = { id: '07-thumb', title: '任天堂サムネイル', theme: 'crayon' };

const RED = '#d23a33', INK = '#1e1a17';
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });

// まわりを暗く（ビネット）＋主役にスポットライト
const vignette = (op = 0.55) => `<radialGradient id="vg" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${op}"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#vg)"/>`;
const spot = (x, y, r, col = '#fff3c8', op = 0.5) => `<radialGradient id="sp${x}"><stop offset="0%" stop-color="${col}" stop-opacity="${op}"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></radialGradient><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.9}" fill="url(#sp${x})"/>`;
// 上の大きな白い文字（暗い影＋細いフチ）
const TITLE = (str, size = 200, y = 210) =>
  `<text x="963" y="${y + 12}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="#000" fill-opacity="0.55" stroke="#000" stroke-opacity="0.55" stroke-width="${size * 0.12}" stroke-linejoin="round">${str}</text>` +
  `<text x="960" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="#fff" stroke="${INK}" stroke-width="${size * 0.06}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
// グラフの線（太い・フチつき）
const chart = (pts, col) => {
  const p = pts.map((q) => q.join(',')).join(' '), [a, b] = pts.slice(-2);
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 70;
  const tip = [b[0] + Math.cos(ang) * h, b[1] + Math.sin(ang) * h];
  const l = [b[0] + Math.cos(ang + 2.2) * h * 0.7, b[1] + Math.sin(ang + 2.2) * h * 0.7], r = [b[0] + Math.cos(ang - 2.2) * h * 0.7, b[1] + Math.sin(ang - 2.2) * h * 0.7];
  return `<polyline points="${p}" fill="none" stroke="${INK}" stroke-width="46" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${p}" fill="none" stroke="${col}" stroke-width="28" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<polygon points="${tip} ${l} ${r}" fill="${col}" stroke="${INK}" stroke-width="9"/>`;
};
// 木の板の壁（花札屋の中）
const woodWall = () => {
  let s = fill('#5a3a24');
  for (let i = 0; i < 12; i++) s += rect(i * 170 - 20, -40, 160, 1200, { fill: i % 2 ? '#6b4630' : '#61402a', w: 4 });
  return s;
};

const VARIANTS = {
  // A：花札屋 → 世界一のゲーム会社（暗い花札屋の中、光るゲーム機）
  A: () => {
    let s = woodWall() + rect(-40, 820, 2000, 300, { fill: '#3a2618' });
    s += [0, 1, 2, 3, 4].map((i) => hanafuda(140 + i * 150, 330, 0.55, -6 + i * 4, i % 4)).join('') + rect(60, 410, 780, 18, { fill: '#2a1a10' });
    s += chart([[860, 900], [1100, 760], [1250, 800], [1500, 480], [1760, 300]], '#4fd65a');
    s += spot(1380, 560, 560) + xf(`<rect x="-150" y="-240" width="300" height="480" fill="#f3efe2"/>` + bwHandheld(0, 0, 1, 0.3), { x: 1380, y: 600, s: 1.25, r: 8 }) + sparkles(1680, 420, 70, '#ffd23a') + sparkles(1110, 470, 60, '#ffd23a');
    s += kid({ x: 520, y: 1520, s: 3.2, hair: 'bald', hairColor: '#3a2d25', mustache: true, shirt: '#7a5a3a', expr: 'wow', arms: [20, -100, 160, 10], look: [1, -0.2] });
    s += vignette(0.6) + TITLE('任天堂', 280, 255);
    return s;
  },
  // B：倒産寸前（夜の社長室、急降下のグラフ、うしろに失敗した事業）
  B: () => {
    let s = fill('#3b1f24') + `<radialGradient id="rb"><stop offset="0%" stop-color="#8a2a2a"/><stop offset="100%" stop-color="#2a1418"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#rb)"/>`;
    s += xf(taxi(0, 0, 1.0), { x: 1450, y: 760, o: 0.85 }) + xf(riceBox(0, 0, 0.8), { x: 1760, y: 700, o: 0.85 });
    s += chart([[700, 300], [950, 380], [1100, 340], [1350, 620], [1620, 640], [1840, 940]], RED);
    s += rect(-40, 900, 2000, 220, { fill: '#4a2c1c' });
    s += spot(640, 600, 520, '#ffd8b0', 0.35) + pres({ x: 640, y: 1560, s: 3.3, expr: 'worry', sweat: true, arms: [60, 95, 60, 95], look: [1, 0.3] });
    s += guide({ x: 1180, y: 1300, s: 1.6, expr: 'wow', arms: [160, 10, 160, 10], look: [-1, -0.3], flip: true });
    s += vignette(0.6) + TITLE('任天堂', 280, 255);
    return s;
  },
  // C：ひまつぶし（夜の工場、スポットライトの中でのびる手を伸ばす横井）
  C: () => {
    let s = fill('#26303a') + [0, 1, 2, 3].map((i) => rect(80 + i * 470, 300, 360, 620, { fill: '#323e4a', w: 5 })).join('') + gear(260, 380, 110, 15, '#56606c') + gear(1650, 420, 130, 30, '#56606c');
    s += rect(-40, 880, 2000, 260, { fill: '#1c242c' });
    s += `<polygon points="560,-40 880,-40 1150,1100 280,1100" fill="#fff6d0" opacity="0.16"/>` + spot(720, 640, 480, '#fff3c8', 0.45);
    s += worker({ x: 600, y: 1540, s: 3.2, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] });
    s += extendHand(1080, 700, 1.5, 0.8) + ball(1730, 700, 75, RED) + sparkles(1800, 560, 60, '#ffd23a');
    s += pres({ x: 1720, y: 1400, s: 1.6, expr: 'wow', arms: [12, 8, 12, 8], look: [-1, -0.3], flip: true });
    s += vignette(0.6) + TITLE('任天堂', 280, 255);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
