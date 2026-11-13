// サンリオのサムネイル 3案：node thumbnail.mjs 12-thumb A（B / C）  型はホンダ（13-thumb）と同じ
// 実在のキャラクターは描かない。白い猫は後ろ姿と赤いリボンだけ
import { C, line, rect, ellipse, poly, text, sparkles } from '../lib/crayon.mjs';
import { kid } from '../lib/cfolk.mjs';
import { silkBolt, silkPile, kencho, basin, sandal, whiteCat, heart, giftBox } from '../lib/cprops5.mjs';
import { worldMap } from '../lib/cprops3.mjs';
import { fill } from '../lib/shots.mjs';

export const meta = { id: '12-thumb', title: 'サンリオサムネイル', theme: 'crayon' };

const RED = '#d23a33', INK = '#1e1a17', NAVY = '#24345c', PINK = '#e86a7a';
const tsuji = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: '#5a5a5a', tie: '#3a4a6b', pants: '#4a4a4a', ...o });
const tsuji2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: NAVY, tie: PINK, pants: NAVY, ...o });

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
  // A：絹から「かわいい」へ（暗い倉庫の売れ残りの絹、スポットに白い猫の後ろ姿、驚く辻）
  A: () => {
    let s = fill('#2a2430') + `<radialGradient id="ra"><stop offset="0%" stop-color="#7a4a5a"/><stop offset="100%" stop-color="#1e1a24"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#ra)"/>`;
    s += `<g opacity="0.55">${silkPile(1500, 1080, 0.8, 1)}</g>`;
    s += spot(1280, 640, 520, '#ffe0ea', 0.55) + whiteCat(1280, 1000, 1.5, 0) + sparkles(1520, 420, 80, '#ffd23a');
    s += heart(1560, 640, 0.9, PINK);
    s += tsuji2({ x: 480, y: 1540, s: 3.2, expr: 'wow', arms: [20, -100, 160, 10], look: [1, -0.2] });
    s += vignette(0.6) + TITLE('サンリオ', 240, 240);
    return s;
  },
  // B：県庁を辞めた男（山梨の山と県庁、飛び出す辻、「元・公務員」）
  B: () => {
    let s = fill('#dcecf2') + basin(1000) + rect(-40, 1000, 2000, 200, { fill: '#a8b878' });
    s += kencho(1450, 1000, 1.0, '山梨県庁');
    s += tsuji({ x: 620, y: 1500, s: 3.0, expr: 'wow', arms: [160, 10, 160, 10], look: [-1, -0.2] });
    s += `<rect x="1180" y="330" width="560" height="140" rx="30" fill="${INK}" opacity="0.9"/><text x="1460" y="430" font-family="Zen Maru Gothic" font-weight="900" font-size="88" text-anchor="middle" fill="#ffd23a">元・公務員</text>`;
    s += vignette(0.45) + TITLE('サンリオ', 240, 240);
    return s;
  },
  // C：花柄のサンダル（大きなサンダル、上がるグラフ、笑う辻）
  C: () => {
    let s = fill('#fde8ee') + `<radialGradient id="rc"><stop offset="0%" stop-color="#fff6f8"/><stop offset="100%" stop-color="#e8a0b0"/></radialGradient><rect x="-50" y="-50" width="2020" height="1180" fill="url(#rc)"/>`;
    s += chart([[760, 900], [960, 820], [1080, 850], [1400, 600], [1760, 380]], '#4fd65a');
    s += spot(1250, 700, 460, '#fff6c8', 0.6) + sandal(1200, 800, 1.5, { flower: true, rot: -12 }) + sandal(1400, 820, 1.5, { flower: true, rot: 12 }) + sparkles(1600, 520, 70, '#ffd23a');
    s += tsuji2({ x: 460, y: 1540, s: 3.1, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] });
    s += vignette(0.4) + TITLE('サンリオ', 240, 240);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
