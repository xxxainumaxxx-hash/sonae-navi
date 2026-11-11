// ホンダのサムネイル 3案：node thumbnail.mjs 13-thumb A（B / C）  型は任天堂（07-thumb）と同じ
// 参考チャンネルのサムネから学んだ型：
//  ・背景は「場面」（店・会社・工場）。飾りの集中線ではなく、場所がわかる絵
//  ・上に大きな白い文字（暗い影つき）で「題材の名前」だけ（任天堂）。話の中身は絵で見せる
//  ・左に人物（表情はっきり）、右に主役の物を大きく。脇役が驚いて見ている
//  ・まわりを暗くして、主役にスポットライト。上がる／下がるグラフの線を重ねる
import { C, line, rect, ellipse, poly, text, sparkles } from '../lib/crayon.mjs';
import { xf } from '../lib/anim.mjs';
import { kid, worker, guide } from '../lib/cfolk.mjs';
import { gear } from '../lib/cprops.mjs';
import { engine, factory } from '../lib/cprops2.mjs';
import { bicycle, motorBike, stepBike, ruins, podium, worldMap, checkerFlag, sideRider } from '../lib/cprops3.mjs';
import { fill } from '../lib/shots.mjs';

export const meta = { id: '13-thumb', title: 'ホンダサムネイル', theme: 'crayon' };

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

const soichiro = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', pants: '#9a9384', ...o });

const VARIANTS = {
  // A：自転車にエンジン（焼け跡の夕方、光るエンジン付き自転車、上がるグラフ、驚く宗一郎）
  A: () => {
    let s = fill('#5a4a40') + `<radialGradient id="ra"><stop offset="0%" stop-color="#d98a4a"/><stop offset="100%" stop-color="#3a2a24"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#ra)"/>`;
    s += ruins(1500, 900, 1.0) + rect(-40, 880, 2000, 260, { fill: '#3a2e28' });
    s += chart([[720, 640], [940, 540], [1060, 570], [1380, 340], [1700, 180]], '#4fd65a');
    s += spot(1250, 640, 560) + bicycle(1250, 900, 1.6, { motor: true, smoke: 1 }) + sparkles(1380, 480, 80, '#ffd23a');
    s += soichiro({ x: 520, y: 1520, s: 3.2, expr: 'wow', arms: [20, -100, 160, 10], look: [1, -0.2] });
    s += vignette(0.6) + TITLE('ホンダ', 280, 255);
    return s;
  },
  // B：無謀な挑戦（赤い背景、倒産寸前のグラフの先に、表彰台を独占するバイク）
  B: () => {
    let s = fill('#3b1f24') + `<radialGradient id="rb"><stop offset="0%" stop-color="#8a2a2a"/><stop offset="100%" stop-color="#2a1418"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#rb)"/>`;
    s += spot(1350, 640, 560, '#fff3c8', 0.4) + podium(1350, 960, 1.5) + [[-330, -240], [0, -360], [330, -180]].map(([dx, dy], i) => motorBike(1350 + dx, 960 + dy, 0.42, { race: true, col: RED, num: String([2, 1, 3][i]) })).join('');
    s += sparkles(1350, 420, 80, '#ffd23a') + checkerFlag(1760, 960, 0.9, 0.3);
    s += soichiro({ x: 540, y: 1560, s: 3.3, expr: 'wow', arms: [160, 10, 160, 10], look: [1, -0.3] });
    s += vignette(0.6) + TITLE('ホンダ', 280, 255);
    return s;
  },
  // C：1億台（世界地図の前を走る小さなバイク、カウンター）
  C: () => {
    let s = fill('#cfe6f5') + worldMap(1250, 620, 1.1, [0, 1, 2, 3, 4, 5]) + rect(-40, 900, 2000, 260, { fill: '#b9a27a' });
    const r = sideRider(1100, 960, 1.4, { hip: [-100, -168], grip: [165, -252], foot: [-10, -78], shirt: '#e9e2cf', pants: '#9a9384' });
    s += spot(1100, 700, 520, '#fff3c8', 0.4) + r.back + stepBike(1100, 960, 1.4, { col: '#3f7a5a' }) + r.front;
    s += `<rect x="1420" y="430" width="440" height="150" rx="30" fill="${INK}" opacity="0.9"/><text x="1640" y="540" font-family="Zen Maru Gothic" font-weight="900" font-size="100" text-anchor="middle" fill="#ffd23a">1億台</text>`;
    s += soichiro({ x: 480, y: 1540, s: 3.2, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] });
    s += vignette(0.5) + TITLE('ホンダ', 280, 255);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
