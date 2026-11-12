// クレヨン調の小物（サンリオ回：絹・サンダル・贈り物・白い猫）
// 実在のキャラクターは描かない。「小さな白い猫」は後ろ姿・シルエットと赤いリボンだけで表す（顔は描かない）
import { C, ellipse, line, poly, rect, text, g } from './crayon.mjs';

const SILK = '#f4ecdc', SILK2 = '#e6dcc6';

// 蚕（横から、右向き）。t：もぞもぞ動く
export function silkworm(x, y, s = 1, t = 0) {
  let b = '';
  for (let i = 0; i < 8; i++) b += ellipse(-140 + i * 38, -24 - Math.abs(Math.sin(t * 4 + i * 0.6)) * 8, 26, 24, { fill: '#f6f2e8', w: 4 });
  b += ellipse(150, -28, 24, 22, { fill: '#e8e0d0', w: 4 }) + ellipse(160, -32, 4, 4, { fill: C.ink, w: 2 });
  return g(b, x, y, s);
}

// まゆ
export function cocoon(x, y, s = 1) {
  return g(ellipse(0, 0, 70, 44, { fill: '#fbf7ee' }) + line([[-50, -10], [50, -16]], { w: 3, color: '#d8d0c0', passes: 1 }) + line([[-46, 12], [48, 8]], { w: 3, color: '#d8d0c0', passes: 1 }), x, y, s);
}

// 桑の葉（枝つき）
export function mulberry(x, y, s = 1) {
  let b = line([[0, 0], [0, -260]], { w: 12, color: '#7a5a34', passes: 1 });
  for (const [dx, dy, r] of [[-70, -80, -30], [70, -140, 30], [-60, -200, -20], [50, -250, 20]]) {
    b += `<g transform="translate(${dx} ${dy}) rotate(${r})">${ellipse(0, 0, 60, 40, { fill: '#6a9a4a' }) + line([[-50, 0], [50, 0]], { w: 3, color: '#4a7a34', passes: 1 })}</g>`;
  }
  return g(b, x, y, s);
}

// 絹の反物（白くつやのある布）
export function silkBolt(x, y, s = 1, col = SILK) {
  return g(rect(-120, -40, 240, 80, { fill: col }) + line([[-110, -20], [110, -20]], { w: 4, color: '#ffffff', passes: 1 }) +
    ellipse(120, 0, 22, 40, { fill: SILK2, w: 5 }) + ellipse(120, 0, 8, 14, { fill: '#cfc6b0', w: 3 }), x, y, s);
}

// 県庁（昔の役所の建物）。label：看板の文字
export function kencho(x, y, s = 1, label = '県庁') {
  let b = rect(-360, -300, 720, 300, { fill: '#d8d0c0' }) + poly([[-400, -300], [0, -400], [400, -300]], { fill: '#8a7a6a' });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) b += rect(-310 + c * 110, -260 + r * 110, 60, 70, { fill: '#cfe0e8', w: 3 });
  b += rect(-60, -110, 120, 110, { fill: '#7a5a3a' }) + rect(-110, -170, 220, 56, { fill: '#fbf3e6', w: 4 }) + text(label, 0, -128, { size: 38, font: 'Zen Maru Gothic', weight: 900 });
  b += line([[0, -400], [0, -500]], { w: 6, passes: 1 }) + poly([[0, -500], [80, -480], [0, -460]], { fill: '#fbf3e6' });
  return g(b, x, y, s);
}

// 山に囲まれた盆地（背景）
export function basin(y = 880) {
  return poly([[-200, y], [200, y - 380], [520, y - 200], [800, y - 420], [1150, y - 220], [1480, y - 400], [1800, y - 240], [2120, y - 360], [2200, y]], { fill: '#7a9a6a' }) +
    poly([[-200, y], [300, y - 200], [700, y - 120], [1100, y - 220], [1500, y - 110], [1900, y - 200], [2200, y]], { fill: '#9ab87a' });
}

// 倉庫の中：積み上がった絹（n：0〜1で増える）
export function silkPile(x, y, s = 1, n = 1) {
  let b = '';
  const total = Math.round(3 + n * 12);
  for (let i = 0; i < total; i++) { const r = Math.floor(i / 4), c = i % 4; b += silkBolt(-330 + c * 220 + (r % 2) * 40, -40 - r * 82, 0.85, i % 3 ? SILK : '#efe4cc'); }
  return g(b, x, y, s);
}

// ゴムのサンダル（上から見た形）。flower：花の絵
export function sandal(x, y, s = 1, { col = '#f2a6b4', flower = false, rot = 0 } = {}) {
  let b = ellipse(0, 0, 70, 160, { fill: col }) + ellipse(0, 4, 54, 140, { fill: '#fbe3e8', color: null });
  b += line([[-50, 30], [0, -80], [50, 30]], { w: 14, color: '#d26a7a', passes: 1 });
  if (flower) for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; b += ellipse(Math.cos(a) * 20, -80 + Math.sin(a) * 20, 16, 16, { fill: '#fff4a8', w: 3 }); }
  if (flower) b += ellipse(0, -80, 12, 12, { fill: '#f28a3a', w: 3 });
  return g(`<g transform="rotate(${rot})">${b}</g>`, x, y, s);
}

// 贈り物の箱（リボンつき）
export function giftBox(x, y, s = 1, col = '#e86a7a', rib = '#fbe36a') {
  let b = rect(-80, -120, 160, 120, { fill: col }) + rect(-90, -140, 180, 30, { fill: col, w: 5 });
  b += rect(-12, -140, 24, 140, { fill: rib, w: 3 }) + ellipse(-26, -152, 26, 16, { fill: rib, w: 4 }) + ellipse(26, -152, 26, 16, { fill: rib, w: 4 });
  return g(b, x, y, s);
}

// カード（ハートつき）
export function heartCard(x, y, s = 1, rot = 0, col = '#fbf3e6') {
  return g(`<g transform="rotate(${rot})">${rect(-90, -120, 180, 240, { fill: col }) + heart(0, -10, 0.8, '#e86a7a')}</g>`, x, y, s);
}

// ハート
export function heart(x, y, s = 1, col = '#e86a7a') {
  return g(`<path d="M 0 40 C -70 -10 -50 -70 0 -40 C 50 -70 70 -10 0 40 Z" fill="${col}" stroke="${C.ink}" stroke-width="5"/>`, x, y, s);
}

// えんぴつ
export function pencil(x, y, s = 1, rot = -30, col = '#7ab0e0') {
  return g(`<g transform="rotate(${rot})">${rect(-110, -16, 190, 32, { fill: col }) + poly([[80, -16], [120, 0], [80, 16]], { fill: '#f2d6a8' }) + rect(-130, -16, 22, 32, { fill: '#f2a6b4', w: 4 })}</g>`, x, y, s);
}

// 小物入れ（ふたつきの丸い缶）
export function smallCase(x, y, s = 1, col = '#a8d8c8') {
  return g(rect(-70, -80, 140, 80, { fill: col }) + ellipse(0, -80, 70, 20, { fill: col }) + ellipse(0, -84, 50, 12, { fill: '#fbf3e6', w: 3 }), x, y, s);
}

// 小さな白い猫（後ろ姿・座っている）。赤いリボン。顔は描かない。t：しっぽが揺れる
export function whiteCat(x, y, s = 1, t = 0, { bow = true } = {}) {
  const sw = Math.sin(t * 2) * 14;
  let b = `<path d="M 60 -40 q 70 ${-20 + sw} 60 ${-90 + sw}" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M 60 -40 q 70 ${-20 + sw} 60 ${-90 + sw}" fill="none" stroke="#ffffff" stroke-width="20" stroke-linecap="round"/>`;
  b += ellipse(0, -80, 90, 80, { fill: '#ffffff' });
  b += poly([[-90, -200], [-80, -280], [-30, -230]], { fill: '#ffffff' }) + poly([[90, -200], [80, -280], [30, -230]], { fill: '#ffffff' });
  b += ellipse(0, -200, 110, 90, { fill: '#ffffff' });
  if (bow) b += ellipse(-86, -262, 30, 22, { fill: '#e23a3a', w: 4 }) + ellipse(-30, -272, 30, 22, { fill: '#e23a3a', w: 4 }) + ellipse(-58, -266, 13, 13, { fill: '#c42a2a', w: 4 });
  return g(b, x, y, s);
}

// 透明な小さなお財布（中に小さな白い猫の後ろ姿）
export function clearPurse(x, y, s = 1, cat = true) {
  let b = rect(-130, -100, 260, 180, { fill: '#e8f4f8' }) + line([[-130, -100], [130, -100]], { w: 10, color: '#e86a7a', passes: 1 }) + ellipse(110, -100, 14, 14, { fill: '#e86a7a', w: 4 });
  if (cat) b += whiteCat(0, 70, 0.45, 0);
  b += line([[-110, -70], [-60, 40]], { w: 6, color: '#ffffff', passes: 1 });
  return g(b, x, y, s);
}

// 屋内のテーマパーク（大きな建物と旗）
export function parkHall(x, y, s = 1) {
  let b = rect(-420, -260, 840, 260, { fill: '#f6d6e0' }) + `<path d="M -420 -260 Q 0 -560 420 -260 Z" fill="#f2b6c8" stroke="${C.ink}" stroke-width="6"/>`;
  for (let i = 0; i < 5; i++) b += rect(-340 + i * 150, -200, 80, 100, { fill: '#cfe0e8', w: 3 });
  b += rect(-80, -130, 160, 130, { fill: '#e86a7a' });
  for (const fx of [-380, 380]) b += line([[fx, -260], [fx, -400]], { w: 5, passes: 1 }) + poly([[fx, -400], [fx + 60, -380], [fx, -360]], { fill: '#fbe36a' });
  return g(b, x, y, s);
}

// キャラクターのグッズ（マグカップ・Tシャツ）。mark：ハートの印
export function mug(x, y, s = 1, col = '#fbf3e6') {
  return g(rect(-60, -130, 120, 130, { fill: col }) + `<path d="M 60 -100 q 50 0 50 40 q 0 40 -50 40" fill="none" stroke="${C.ink}" stroke-width="10"/>` + heart(0, -66, 0.5), x, y, s);
}
export function tee(x, y, s = 1, col = '#a8d8f0') {
  return g(poly([[-110, -200], [-40, -220], [40, -220], [110, -200], [160, -130], [110, -100], [100, 0], [-100, 0], [-110, -100], [-160, -130]], { fill: col }) + heart(0, -110, 0.6), x, y, s);
}
