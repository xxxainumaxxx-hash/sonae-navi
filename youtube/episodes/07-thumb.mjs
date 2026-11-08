// 任天堂（本番）のサムネイル 3案：node thumbnail.mjs 07-thumb A（B / C）
// サムネ専用の描き方：
//  ・主役の顔を画面の半分くらいまで大きく、感情（驚き・焦り・にやり）をはっきり
//  ・文字は5〜6文字だけ、極太＋黒と白の二重フチ、少し傾ける
//  ・集中線の背景で目を引く／主役にはステッカーのような白いフチと影
import { C, sparkles } from '../lib/crayon.mjs';
import { xf } from '../lib/anim.mjs';
import { kid, worker } from '../lib/cfolk.mjs';
import { hanafuda, extendHand, ball } from '../lib/cprops.mjs';
import { fill } from '../lib/shots.mjs';

export const meta = { id: '07-thumb', title: '任天堂サムネイル', theme: 'crayon' };

const RED = '#d23a33', INK = '#1e1a17', YEL = '#ffd23a';
const pres = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: '#2f3b5c', tie: RED, pants: '#2c3350', ...o });

// ステッカーのような白フチ＋影
const FX = `<filter id="stk" x="-20%" y="-20%" width="140%" height="140%">
  <feMorphology operator="dilate" radius="16" in="SourceAlpha" result="d"/>
  <feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="w"/>
  <feOffset in="d" dx="10" dy="14" result="o"/><feFlood flood-color="#000" flood-opacity="0.35"/><feComposite in2="o" operator="in" result="sh"/>
  <feMerge><feMergeNode in="sh"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
const sticker = (inner) => `<g filter="url(#stk)">${inner}</g>`;
// 集中線
const burst = (cx, cy, c1, c2, n = 28) => {
  let s = fill(c1);
  for (let i = 0; i < n; i += 2) {
    const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2;
    s += `<polygon points="${cx},${cy} ${cx + Math.cos(a1) * 3000},${cy + Math.sin(a1) * 3000} ${cx + Math.cos(a2) * 3000},${cy + Math.sin(a2) * 3000}" fill="${c2}"/>`;
  }
  return s;
};
// 極太の二重フチ文字
const BIG = (str, x, y, size, color, rot = 0) => {
  const t = (st, sw, f) => `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;
  return `<g transform="rotate(${rot} ${x} ${y})">${t(INK, size * 0.34, INK)}${t(C.white, size * 0.2, C.white)}${t(color, 0, color)}</g>`;
};

const VARIANTS = {
  // A：元・花札屋（驚く社長と、大きな花札）
  A: () => {
    let s = FX + burst(1250, 560, '#c42f29', '#e0463e');
    s += sticker(xf(hanafuda(0, 0, 3.2, -12, 1), { x: 1560, y: 500 }));
    s += sticker(pres({ x: 600, y: 1720, s: 4.3, expr: 'wow', arms: [160, 10, 160, 10], look: [1, -0.3] }));
    s += sparkles(1830, 200, 90, YEL) + sparkles(1160, 860, 80, YEL);
    s += BIG('元・花札屋', 1340, 1010, 200, YEL, -4);
    return s;
  },
  // B：倒産の危機（焦る社長と、急降下のグラフ）
  B: () => {
    let s = FX + burst(700, 520, '#2a2d38', '#3a3f4e');
    const pts = '1050,180 1300,330 1440,280 1650,640 1880,800';
    s += `<polyline points="${pts}" fill="none" stroke="${INK}" stroke-width="64" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += `<polyline points="${pts}" fill="none" stroke="${RED}" stroke-width="40" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += `<polygon points="1950,860 1770,850 1880,700" fill="${RED}" stroke="${INK}" stroke-width="10"/>`;
    s += sticker(pres({ x: 600, y: 1720, s: 4.3, expr: 'worry', sweat: true, arms: [60, 95, 60, 95], look: [1, 0.2] }));
    s += BIG('倒産の危機', 1360, 1010, 200, '#ff5a4e', 3);
    return s;
  },
  // C：ひまつぶし（にやりと笑う横井と、のびる手）
  C: () => {
    let s = FX + burst(560, 560, '#f2c230', '#ffd95a');
    s += sticker(worker({ x: 520, y: 1720, s: 4.3, expr: 'smile', arms: [12, 8, 125, 10], look: [1, -0.2] }));
    s += sticker(extendHand(1170, 600, 1.55, 0.75) + ball(1790, 600, 85, RED));
    s += BIG('ひまつぶし', 1330, 990, 210, '#ff5a4e', -3);
    return s;
  },
};

export function thumbnail(v = 'A') { return VARIANTS[v](); }
