// アシックスのサムネイル 3案：node thumbnail.mjs 09-thumb A（B / C）  型はホンダ（13-thumb）と同じ
import { C, line, rect, ellipse, poly, text, sparkles } from '../lib/crayon.mjs';
import { kid } from '../lib/cfolk.mjs';
import { ruins, worldMap } from '../lib/cprops3.mjs';
import { shoe, sole, tentacle, contract, runner, gym } from '../lib/cprops4.mjs';
import { fill } from '../lib/shots.mjs';

export const meta = { id: '09-thumb', title: 'アシックスサムネイル', theme: 'crayon' };

const RED = '#d23a33', INK = '#1e1a17', NAVY = '#24345c', BLUE = '#2f4a7a';
const onitsuka = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', jacket: '#6b6b4a', pants: '#4a4a38', ...o });
const onitsuka2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: NAVY, tie: RED, pants: NAVY, ...o });
const phil = (o) => kid({ hair: 'messy', hairColor: '#c9a04a', shirt: C.white, jacket: '#8a6a40', tie: '#3a6ea5', pants: '#5a4a3a', ...o });

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

const VARIANTS = {
  // A：タコの足 → 靴（暗い背景、スポットに光るタコの足と靴、驚く鬼塚）
  A: () => {
    let s = fill('#2a2430') + `<radialGradient id="ra"><stop offset="0%" stop-color="#6a4a5a"/><stop offset="100%" stop-color="#1e1a24"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#ra)"/>`;
    s += spot(1300, 620, 600, '#fff3c8', 0.45) + tentacle(1300, 520, 2.0, 0.3);
    s += `<polygon points="1280,650 1320,650 1320,690 1360,690 1300,750 1240,690 1280,690" fill="#ffd23a" stroke="${INK}" stroke-width="8"/>`;
    s += shoe(1300, 1010, 1.4, { accent: RED }) + sparkles(1560, 820, 70, '#ffd23a');
    s += onitsuka2({ x: 480, y: 1540, s: 3.2, expr: 'wow', arms: [20, -100, 160, 10], look: [1, -0.2] });
    s += vignette(0.6) + TITLE('アシックス', 220, 235);
    return s;
  },
  // B：ナイキと決別（赤い背景、裂ける契約書、背中合わせの二人）
  B: () => {
    let s = fill('#3b1f24') + `<radialGradient id="rb"><stop offset="0%" stop-color="#8a2a2a"/><stop offset="100%" stop-color="#2a1418"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#rb)"/>`;
    s += spot(960, 650, 520, '#fff3c8', 0.35) + contract(960, 650, 1.3, 0.8);
    s += onitsuka2({ x: 420, y: 1540, s: 3.0, expr: 'worry', arms: [12, 8, 12, 8], look: [-1, 0] });
    s += phil({ x: 1500, y: 1540, s: 3.0, expr: 'worry', arms: [12, 8, 12, 8], flip: true, look: [1, 0] });
    s += `<rect x="1260" y="300" width="520" height="140" rx="30" fill="${INK}" opacity="0.9"/><text x="1520" y="400" font-family="Zen Maru Gothic" font-weight="900" font-size="90" text-anchor="middle" fill="#ffd23a">ナイキと決別</text>`;
    s += vignette(0.6) + TITLE('アシックス', 220, 235);
    return s;
  },
  // C：焼け跡から世界へ（焼け跡の左、世界を走るランナー、上がるグラフ）
  C: () => {
    let s = fill('#cfe6f5') + worldMap(1250, 600, 1.1, [0, 1, 2, 3, 4, 5]) + rect(-40, 900, 2000, 260, { fill: '#c86a4a' });
    s += ruins(330, 900, 0.8);
    s += chart([[700, 760], [900, 680], [1020, 700], [1350, 480], [1720, 300]], '#4fd65a');
    s += spot(1250, 800, 400, '#fff3c8', 0.5) + shoe(1250, 960, 1.6, { accent: BLUE }) + sparkles(1520, 760, 70, '#ffd23a');
    s += onitsuka({ x: 420, y: 1540, s: 3.1, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] });
    s += vignette(0.5) + TITLE('アシックス', 220, 235);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
