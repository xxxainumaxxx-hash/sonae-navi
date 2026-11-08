// 任天堂（本番）のサムネイル 3案：node thumbnail.mjs 07-thumb A（B / C）
// ルール：要素は3つまで、文字は大きく短く（小さく表示されても読める）、顔は大きく、任天堂の赤と白
import { C, text, line, ellipse, rect, poly, sparkles } from '../lib/crayon.mjs';
import { xf } from '../lib/anim.mjs';
import { kid, worker } from '../lib/cfolk.mjs';
import { hanafuda, bwHandheld, trophy, taxi, riceBox, cross, extendHand, ball, gear } from '../lib/cprops.mjs';
import { big, fill, glow } from '../lib/shots.mjs';

export const meta = { id: '07-thumb', title: '任天堂サムネイル', theme: 'crayon' };

const RED = '#d23a33', CREAM = '#fbf3e6', INK = '#2b2622';
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });
// 太いフチの文字（左寄せ／中央）
const T = (str, x, y, size, color, stroke = INK, anchor = 'middle') =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="${anchor}" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;

const VARIANTS = {
  // A：花札屋 → 世界一（変化を見せる）
  A: () => {
    let s = fill(CREAM) + `<polygon points="1000,-50 2000,-50 2000,1150 760,1150" fill="${RED}"/>` + glow(1450, 500, 600, '#ffffff', 0.25);
    s += xf(hanafuda(0, 0, 2.6, -10, 1), { x: 430, y: 560 });
    s += xf(`<rect x="-150" y="-240" width="300" height="480" fill="#f3efe2"/>` + bwHandheld(0, 0, 1, 0.3), { x: 1430, y: 470, s: 1.35, r: 6 }) + xf(trophy(0, 0, 0.9), { x: 1800, y: 200 }) + sparkles(1170, 250, 70, C.yellow) + sparkles(1790, 560, 60, C.yellow);
    s += `<path d="M720,600 L1050,600" stroke="${INK}" stroke-width="52" stroke-linecap="round"/><path d="M1030,510 L1170,600 L1030,690Z" fill="${INK}"/>`;
    s += `<path d="M720,600 L1050,600" stroke="${C.white}" stroke-width="30" stroke-linecap="round"/><path d="M1045,540 L1140,600 L1045,660Z" fill="${C.white}"/>`;
    s += T('花札屋が', 430, 210, 170, INK, C.white) + T('世界の任天堂に', 1300, 1010, 170, C.yellow);
    return s;
  },
  // B：つぶれかけた（ピンチの顔）
  B: () => {
    let s = fill('#4a4f5c') + glow(560, 620, 600, '#ffffff', 0.12);
    s += pres({ x: 520, y: 1500, s: 3.6, expr: 'worry', sweat: true, arms: [60, 95, 60, 95], look: [1, 0.2] });
    s += xf(taxi(0, 0, 1.3), { x: 1260, y: 600 }) + xf(cross(0, 0, 1.9), { x: 1260, y: 560 });
    s += xf(riceBox(0, 0, 0.95), { x: 1700, y: 560 }) + xf(cross(0, 0, 1.3), { x: 1700, y: 540 });
    s += T('つぶれかけた', 1290, 240, 190, C.white, INK) + T('任天堂', 1340, 1010, 220, RED, C.white);
    return s;
  },
  // C：社員のひまつぶしが会社を救った
  C: () => {
    let s = fill('#d6e4dc') + gear(150, 140, 110, 10) + gear(330, 90, 70, 30, '#8e8a84') + glow(700, 600, 650, '#fff6d0', 0.45);
    s += worker({ x: 640, y: 1460, s: 3.4, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] });
    s += extendHand(1150, 680, 1.6, 0.8) + ball(1830, 680, 62, RED);
    s += T('ひまつぶし', 1330, 260, 210, C.yellow, INK) + T('が会社を救った', 1330, 470, 120, C.white, INK);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
