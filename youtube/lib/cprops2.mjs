// クレヨン調の小物（トヨタ回など、ものづくり・工場もの）。実在のロゴや車種の形はまねない。
import { C, ellipse, line, poly, rect, text, g } from './crayon.mjs';

const WOOD = '#b98a58', WOOD2 = '#8a5a34', IRON = '#6b7280', IRON2 = '#4b5563', INDIGO = '#2f4a7a', CLOTH = '#f4efe2';

// 木の機織り機（手織り）。run：0〜1で筬（おさ）が前後する、cut：糸が切れている
export function woodLoom(x, y, s = 1, { run = 0, cut = false, cloth = 0.5 } = {}) {
  let b = '';
  // 脚と枠
  b += rect(-230, -40, 30, 240, { fill: WOOD2, w: 5 }) + rect(200, -40, 30, 240, { fill: WOOD2, w: 5 });
  b += rect(-230, -300, 30, 260, { fill: WOOD2, w: 5 }) + rect(200, -300, 30, 260, { fill: WOOD2, w: 5 });
  b += rect(-240, -320, 480, 30, { fill: WOOD, w: 5 }) + rect(-240, -60, 480, 30, { fill: WOOD, w: 5 });
  // たて糸
  for (let i = 0; i < 9; i++) {
    const xx = -170 + i * 42;
    if (cut && i === 4) b += line([[xx, -290], [xx + 6, -200]], { w: 3, color: C.red, passes: 1 }) + line([[xx - 4, -150], [xx, -70]], { w: 3, color: C.red, passes: 1 });
    else b += line([[xx, -290], [xx, -70]], { w: 3, color: '#e9e2cf', passes: 1 });
  }
  // 織り上がった布
  b += rect(-190, -70 - 80 * cloth, 380, 80 * cloth, { fill: INDIGO, w: 4 });
  // 筬（前後に動く棒）
  const by = -230 + Math.sin(run * Math.PI * 2) * 30;
  b += rect(-210, by, 420, 20, { fill: WOOD, w: 5 });
  // 足のふみ板
  b += poly([[-150, 170], [-20, 150], [-20, 170], [-150, 190]], { fill: WOOD, w: 4 }) + poly([[20, 150], [150, 170], [150, 190], [20, 170]], { fill: WOOD, w: 4 });
  return g(b, x, y, s);
}

// 動力で動く鉄の織機（ベルトと歯車）。run：0〜1
export function powerLoom(x, y, s = 1, { run = 0, cut = false, lamp = false } = {}) {
  let b = '';
  b += rect(-260, -260, 520, 300, { fill: IRON, w: 6 });
  b += rect(-220, -230, 440, 160, { fill: '#e9e2cf', w: 4 });
  for (let i = 0; i < 10; i++) {
    const xx = -200 + i * 44;
    if (cut && i === 5) b += line([[xx, -225], [xx + 8, -170]], { w: 3, color: C.red, passes: 1 });
    else b += line([[xx, -225], [xx, -80]], { w: 3, color: '#cfc6b0', passes: 1 });
  }
  b += rect(-220, -120, 440, 50, { fill: INDIGO, w: 4 });
  // 歯車とベルト
  const a = run * 360;
  b += `<g transform="translate(-200 -20) rotate(${a})">${ellipse(0, 0, 50, 50, { fill: IRON2, w: 5 }) + [0, 60, 120].map((k) => line([[0, 0], [Math.cos(k * Math.PI / 180) * 45, Math.sin(k * Math.PI / 180) * 45]], { w: 5, color: '#9aa0a8', passes: 1 })).join('')}</g>`;
  b += line([[-200, -70], [-200, -330]], { w: 10, color: '#3a2a20', passes: 1 }) + line([[-160, -20], [-160, -330]], { w: 10, color: '#3a2a20', passes: 1 });
  b += rect(-280, 40, 560, 30, { fill: IRON2, w: 5 }) + rect(-250, 70, 30, 120, { fill: IRON2, w: 5 }) + rect(220, 70, 30, 120, { fill: IRON2, w: 5 });
  // 止まったときのランプ
  if (lamp) b += ellipse(220, -290, 30, 30, { fill: '#ffd23a', w: 5 }) + `<circle cx="220" cy="-290" r="60" fill="#ffd23a" opacity="0.3"/>`;
  return g(b, x, y, s);
}

// シャトル（よこ糸を運ぶ木の部品）
export function shuttle(x, y, s = 1, rot = 0) {
  const b = poly([[-90, 0], [-50, -20], [50, -20], [90, 0], [50, 20], [-50, 20]], { fill: WOOD, w: 5 }) + ellipse(0, 0, 26, 9, { fill: CLOTH, w: 3 });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${b}</g>`;
}

// 糸巻き
export function spool(x, y, s = 1, col = CLOTH) {
  return g(rect(-40, -60, 80, 120, { fill: col, w: 4 }) + rect(-55, -75, 110, 20, { fill: WOOD2, w: 4 }) + rect(-55, 55, 110, 20, { fill: WOOD2, w: 4 }) +
    [0, 1, 2, 3].map((i) => line([[-38, -40 + i * 26], [38, -30 + i * 26]], { w: 3, color: '#cfc6b0', passes: 1 })).join(''), x, y, s);
}

// 反物（巻いた布）
export function clothRoll(x, y, s = 1, col = INDIGO) {
  return g(rect(-120, -40, 240, 80, { fill: col }) + ellipse(120, 0, 22, 40, { fill: col, w: 5 }) + ellipse(120, 0, 8, 14, { fill: '#e9e2cf', w: 3 }), x, y, s);
}

// 昔のトラック（一般的な形）。wheel：タイヤの回転角、smoke：0〜1で故障の煙
export function oldTruck(x, y, s = 1, { wheel = 0, smoke = 0, col = '#5a6e8a' } = {}) {
  let b = rect(-260, -170, 300, 150, { fill: '#a07a50' });
  b += poly([[40, -20], [40, -200], [170, -200], [230, -110], [240, -20]], { fill: col });
  b += poly([[70, -180], [160, -180], [205, -115], [70, -115]], { fill: C.sky, w: 4 });
  b += rect(-280, -30, 540, 30, { fill: '#3a3a40', w: 5 });
  for (const wx of [-170, 150]) b += `<g transform="translate(${wx} 10) rotate(${wheel})">${ellipse(0, 0, 45, 45, { fill: '#2b2b30' }) + ellipse(0, 0, 18, 18, { fill: '#9aa0a8', w: 4 }) + line([[-30, 0], [30, 0]], { w: 4, color: '#9aa0a8', passes: 1 })}</g>`;
  if (smoke) for (let i = 0; i < 4; i++) b += `<circle cx="${220 + i * 20}" cy="${-140 - i * 45 * smoke}" r="${22 + i * 10}" fill="#8a8a90" opacity="${0.6 - i * 0.12}"/>`;
  return g(b, x, y, s);
}

// 昔の乗用車（一般的な丸い形）
export function oldCar(x, y, s = 1, { wheel = 0, col = '#3a4a6b' } = {}) {
  let b = poly([[-230, -20], [-230, -90], [-150, -110], [-90, -190], [90, -190], [150, -110], [230, -90], [230, -20]], { fill: col });
  b += poly([[-70, -175], [-5, -175], [-5, -115], [-125, -115]], { fill: C.sky, w: 4 }) + poly([[5, -175], [70, -175], [125, -115], [5, -115]], { fill: C.sky, w: 4 });
  for (const wx of [-140, 140]) b += `<g transform="translate(${wx} -15) rotate(${wheel})">${ellipse(0, 0, 42, 42, { fill: '#2b2b30' }) + ellipse(0, 0, 16, 16, { fill: '#c0c4ca', w: 4 }) + line([[-28, 0], [28, 0]], { w: 4, color: '#9aa0a8', passes: 1 })}</g>`;
  b += ellipse(215, -70, 14, 12, { fill: '#ffe9a0', w: 4 });
  return g(b, x, y, s);
}

// エンジン（ばらばらにした部品つき）。apart：0〜1で部品が散らばる
export function engine(x, y, s = 1, apart = 0) {
  let b = rect(-130, -110, 260, 170, { fill: IRON });
  for (let i = 0; i < 4; i++) b += rect(-110 + i * 58, -160, 44, 50, { fill: IRON2, w: 4 });
  b += ellipse(-170, 0, 40, 40, { fill: IRON2, w: 5 }) + rect(-130, 60, 260, 30, { fill: '#3a3a40', w: 4 });
  const parts = [[-260, -200, 'piston'], [260, -180, 'gear'], [-280, 140, 'bolt'], [280, 140, 'piston'], [0, 200, 'gear']];
  for (const [px, py, k] of parts) {
    const xx = px * apart, yy = py * apart;
    if (apart < 0.05) continue;
    if (k === 'piston') b += rect(xx - 22, yy - 30, 44, 50, { fill: '#c0c4ca', w: 4 }) + rect(xx - 6, yy + 20, 12, 40, { fill: '#9aa0a8', w: 3 });
    if (k === 'gear') b += ellipse(xx, yy, 34, 34, { fill: '#c0c4ca', w: 5 }) + ellipse(xx, yy, 10, 10, { fill: IRON2, w: 3 });
    if (k === 'bolt') b += rect(xx - 30, yy - 8, 60, 16, { fill: '#c0c4ca', w: 3 }) + rect(xx - 40, yy - 16, 16, 32, { fill: '#9aa0a8', w: 3 });
  }
  return g(b, x, y, s);
}

// かんばん（部品の名前と数を書いたカード）
export function kanban(x, y, s = 1, rot = 0, label = '部品A', n = 10) {
  const b = rect(-90, -120, 180, 240, { fill: '#fff8e6' }) + rect(-90, -120, 180, 50, { fill: C.blue, w: 4 }) +
    text('かんばん', 0, -84, { size: 30, color: C.white, font: 'Zen Maru Gothic', weight: 900 }) +
    text(label, 0, -10, { size: 40, font: 'Zen Maru Gothic', weight: 900 }) + text(`${n}個`, 0, 60, { size: 46, color: C.red, font: 'Zen Maru Gothic', weight: 900 });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${b}</g>`;
}

// ラインを止めるひもとランプ（アンドン）。pulled：0〜1、on：ランプがつく
export function andon(x, y, s = 1, { pulled = 0, on = false } = {}) {
  let b = line([[-400, -300], [400, -300]], { w: 8, color: '#3a3a40', passes: 1 });
  b += line([[0, -300], [0, -120 + pulled * 60]], { w: 6, color: '#f2c230', passes: 1 }) + ellipse(0, -110 + pulled * 60, 14, 14, { fill: '#f2c230', w: 4 });
  b += rect(-160, -460, 320, 110, { fill: '#2b2b30' });
  b += [0, 1, 2].map((i) => rect(-140 + i * 100, -440, 80, 70, { fill: on && i === 1 ? '#ffd23a' : '#4b4b52', w: 4 })).join('');
  if (on) b += `<rect x="-60" y="-440" width="80" height="70" fill="#ffd23a" opacity="0.5" filter="url(#wobble)"/>` + `<circle cx="-20" cy="-405" r="110" fill="#ffd23a" opacity="0.18"/>`;
  return g(b, x, y, s);
}

// 組み立てライン（ベルトと流れてくる車体）。t：時間、stop：止まっているか
export function assemblyLine(x, y, s = 1, t = 0, stop = false) {
  let b = rect(-900, 0, 1800, 50, { fill: '#3a3a40' });
  for (let i = 0; i < 18; i++) b += ellipse(-880 + i * 104, 50, 18, 18, { fill: '#9aa0a8', w: 3 });
  const off = stop ? 0 : (t * 120) % 520;
  for (let i = -1; i < 4; i++) b += g(poly([[-150, 0], [-150, -70], [-90, -80], [-50, -140], [70, -140], [110, -80], [150, -70], [150, 0]], { fill: [C.white, '#c0c4ca', '#e9e2cf'][(i + 3) % 3] }), -700 + i * 520 + off, 0, 1);
  return g(b, x, y, s);
}

// 汽船
export function ship(x, y, s = 1) {
  let b = poly([[-260, 0], [260, 0], [200, 80], [-220, 80]], { fill: '#3a3a40' });
  b += rect(-160, -80, 300, 80, { fill: CLOTH }) + rect(-40, -170, 60, 90, { fill: C.red, w: 5 }) + rect(-40, -170, 60, 20, { fill: '#2b2b30', w: 4 });
  for (let i = 0; i < 5; i++) b += ellipse(-130 + i * 60, -40, 14, 14, { fill: C.sky, w: 3 });
  return g(b, x, y, s);
}

// お金の袋（£や¥）
export function moneyBag(x, y, s = 1, mark = '£') {
  return g(ellipse(0, 30, 110, 100, { fill: '#c9a36a' }) + poly([[-40, -60], [40, -60], [60, -90], [-60, -90]], { fill: '#c9a36a', w: 5 }) + line([[-45, -60], [45, -60]], { w: 8, color: WOOD2, passes: 1 }) +
    text(mark, 0, 70, { size: 110, font: 'Yusei Magic', color: '#3a2a20' }), x, y, s);
}

// 工場の建物（のこぎり屋根）
export function factory(x, y, s = 1, col = '#c9b08a', chimney = true) {
  let b = rect(-300, -200, 600, 200, { fill: col });
  for (let i = 0; i < 4; i++) b += poly([[-300 + i * 150, -200], [-300 + i * 150, -290], [-150 + i * 150, -200]], { fill: '#8a8f96', w: 5 });
  for (let i = 0; i < 5; i++) b += rect(-270 + i * 115, -150, 70, 60, { fill: C.sky, w: 4 });
  b += rect(-50, -90, 100, 90, { fill: WOOD2, w: 5 });
  if (chimney) b += rect(220, -380, 50, 180, { fill: '#8a5a44', w: 5 });
  return g(b, x, y, s);
}

// 銀行の建物（柱）
export function bank(x, y, s = 1) {
  let b = poly([[-260, -280], [0, -380], [260, -280]], { fill: '#e6e0d4' }) + rect(-260, -280, 520, 30, { fill: '#d6d0c4', w: 5 });
  for (let i = 0; i < 5; i++) b += rect(-230 + i * 110, -250, 50, 230, { fill: '#f2eee4', w: 4 });
  b += rect(-280, -20, 560, 30, { fill: '#d6d0c4', w: 5 }) + text('BANK', 0, -300, { size: 40, font: 'Zen Maru Gothic', weight: 900 });
  return g(b, x, y, s);
}

// スーパーマーケットの棚（減った分だけ補充）。k：0〜1で手前の段が減って戻る
export function shelf(x, y, s = 1, k = 0) {
  let b = rect(-300, -360, 600, 380, { fill: '#e6e0d4' });
  const cols = [C.red, C.yellow, C.green, C.sky, C.orange];
  for (let r = 0; r < 3; r++) {
    b += rect(-300, -360 + r * 125 + 105, 600, 16, { fill: '#a0a4aa', w: 4 });
    const n = r === 2 ? Math.round(8 - 3 * Math.sin(k * Math.PI)) : 8;
    for (let i = 0; i < n; i++) b += rect(-280 + i * 70, -360 + r * 125 + 35, 55, 70, { fill: cols[(i + r) % 5], w: 4 });
  }
  return g(b, x, y, s);
}

// 障子（あけると外が見える）。open：0〜1
export function shoji(x, y, s = 1, open = 0) {
  let b = rect(-300, -300, 600, 600, { fill: '#cfe6f5' }) + `<circle cx="120" cy="-140" r="70" fill="#ffd23a" opacity="0.8"/>` + poly([[-300, 300], [-300, 100], [-100, 0], [100, 120], [300, 40], [300, 300]], { fill: '#8fbf6a', w: 5 });
  const paneL = (dx) => { let p = rect(-300 + dx, -300, 300, 600, { fill: '#fbf7ee' }); for (let i = 1; i < 4; i++) p += line([[-300 + dx + i * 75, -300], [-300 + dx + i * 75, 300]], { w: 4, color: WOOD2, passes: 1 }); for (let j = 1; j < 6; j++) p += line([[-300 + dx, -300 + j * 100], [dx, -300 + j * 100]], { w: 4, color: WOOD2, passes: 1 }); return p; };
  b += paneL(-open * 280) + `<g transform="translate(${300 + open * 280} 0)">${paneL(0)}</g>`;
  b += rect(-320, -320, 640, 30, { fill: WOOD2, w: 5 }) + rect(-320, 290, 640, 30, { fill: WOOD2, w: 5 });
  return g(b, x, y, s);
}
