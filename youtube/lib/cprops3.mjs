// クレヨン調の小物（ホンダ回など、乗り物・戦後の町）。実在のロゴや車種の形はまねない（バイクは一般的な形）。
import { C, ellipse, line, poly, rect, text, g } from './crayon.mjs';

const IRON = '#6b7280', IRON2 = '#4b5563', TIRE = '#2b2b30', RIM = '#c0c4ca';

const wheelAt = (wx, wy, r, rot) => `<g transform="translate(${wx} ${wy}) rotate(${rot})">${ellipse(0, 0, r, r, { fill: 'none', color: TIRE, w: 9 }) +
  [0, 60, 120].map((a) => line([[-Math.cos(a * Math.PI / 180) * r, -Math.sin(a * Math.PI / 180) * r], [Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r]], { w: 3, color: '#8a8f96', passes: 1 })).join('') +
  ellipse(0, 0, 9, 9, { fill: RIM, w: 3 })}</g>`;

// 自転車（横から）。wheel：車輪の回転（度）、load：荷台の荷物、motor：小さなエンジン付き、smoke：0〜1の排気
export function bicycle(x, y, s = 1, { wheel = 0, load = false, motor = false, smoke = 0, col = '#3a4a6b' } = {}) {
  let b = wheelAt(-140, -80, 80, wheel) + wheelAt(140, -80, 80, wheel);
  b += line([[-140, -80], [-40, -80], [-80, -210], [-140, -80]], { w: 8, color: col, passes: 1 });
  b += line([[-40, -80], [90, -210], [-80, -210]], { w: 8, color: col, passes: 1 }) + line([[90, -210], [140, -80]], { w: 8, color: col, passes: 1 });
  b += line([[-80, -210], [-95, -240]], { w: 7, color: col, passes: 1 }) + rect(-130, -255, 70, 16, { fill: '#3a2e28', w: 3 });
  b += line([[90, -210], [80, -260], [120, -265]], { w: 7, color: col, passes: 1 });
  if (load) b += rect(-250, -200, 170, 110, { fill: '#c9a46a' }) + line([[-250, -150], [-80, -150]], { w: 4, color: '#7a5a34', passes: 1 }) + rect(-230, -260, 120, 60, { fill: '#d9c08a' });
  if (motor) b += rect(-60, -150, 90, 70, { fill: IRON }) + rect(-45, -175, 60, 26, { fill: IRON2, w: 4 }) + line([[30, -110], [120, -100]], { w: 7, color: IRON2, passes: 1 }) + rect(10, -255, 70, 40, { fill: '#c8423a', w: 4 });
  if (smoke) for (let i = 0; i < 4; i++) b += `<circle cx="${-220 - i * 50}" cy="${-110 - i * 22 * smoke}" r="${16 + i * 9}" fill="#9a9aa0" opacity="${0.55 - i * 0.12}"/>`;
  return g(b, x, y, s);
}

// オートバイ（一般的な形）。race：レース用の前かがみの形、num：ゼッケン番号
export function motorBike(x, y, s = 1, { wheel = 0, col = '#c8423a', race = false, num = '' } = {}) {
  let b = wheelAt(-150, -80, 85, wheel) + wheelAt(150, -80, 85, wheel);
  b += line([[-150, -80], [-40, -150], [150, -80]], { w: 9, color: IRON2, passes: 1 });
  b += rect(-70, -175, 120, 80, { fill: IRON }) + rect(-55, -205, 90, 32, { fill: IRON2, w: 4 });
  if (race) {
    b += poly([[-180, -180], [-60, -250], [110, -250], [180, -170], [120, -140], [-160, -150]], { fill: col });
    b += ellipse(-100, -205, 40, 40, { fill: C.white, w: 5 }) + (num ? text(num, -100, -190, { size: 44, font: 'Zen Maru Gothic', weight: 900 }) : '');
    b += poly([[110, -250], [150, -300], [175, -290], [160, -230]], { fill: C.sky, w: 4 });
  } else {
    b += poly([[-40, -230], [80, -230], [110, -190], [-20, -185]], { fill: col }) + rect(-170, -215, 120, 22, { fill: '#3a2e28', w: 4 });
    b += line([[110, -190], [140, -270], [180, -275]], { w: 8, color: IRON2, passes: 1 }) + ellipse(160, -230, 18, 16, { fill: '#ffe9a0', w: 4 });
  }
  b += line([[40, -110], [210, -95]], { w: 8, color: '#8a8f96', passes: 1 });
  return g(b, x, y, s);
}

// 小さなバイク（足を上げずに乗れる低い形）。tray：出前のせいろを何段か載せる（持つのは人の手）
export function stepBike(x, y, s = 1, { wheel = 0, col = '#3f7a5a' } = {}) {
  let b = wheelAt(-130, -60, 62, wheel) + wheelAt(130, -60, 62, wheel);
  b += poly([[-150, -110], [-20, -110], [10, -60], [60, -60], [110, -200], [140, -200], [100, -60], [-130, -40]], { fill: col });
  b += poly([[60, -60], [110, -200], [150, -195], [120, -70]], { fill: C.white, w: 5 });
  b += rect(-160, -150, 120, 26, { fill: '#3a2e28', w: 4 }) + line([[130, -200], [120, -250], [170, -255]], { w: 7, color: IRON2, passes: 1 });
  b += ellipse(160, -215, 15, 14, { fill: '#ffe9a0', w: 4 }) + rect(-90, -90, 80, 40, { fill: IRON, w: 4 });
  return g(b, x, y, s);
}

// せいろの山（出前）。n：段数
export function sobaTrays(x, y, s = 1, n = 5) {
  let b = '';
  for (let i = 0; i < n; i++) b += rect(-90, -40 - i * 40, 180, 38, { fill: i % 2 ? '#b98a58' : '#a07a50', w: 4 });
  return g(b, x, y, s);
}

// 焼け跡（崩れた壁と、焦げた柱）
export function ruins(x, y, s = 1) {
  let b = poly([[-420, 0], [-420, -160], [-360, -200], [-300, -120], [-240, -170], [-200, 0]], { fill: '#6a5a4e' });
  b += poly([[120, 0], [120, -220], [180, -260], [230, -150], [300, -190], [330, 0]], { fill: '#5a4c42' });
  for (const [px, ph] of [[-120, 240], [-40, 180], [420, 260]]) b += rect(px - 14, -ph, 28, ph, { fill: '#2e2622', w: 4 });
  b += poly([[-500, 0], [-300, -40], [0, -20], [260, -50], [520, 0]], { fill: '#8a7a6a' });
  return g(b, x, y, s);
}

// 昔の電車（満員）。heads：窓から見える頭の数
export function oldTrain(x, y, s = 1, { crowd = true } = {}) {
  let b = rect(-520, -230, 1040, 230, { fill: '#7a5a3a' }) + rect(-520, -250, 1040, 30, { fill: '#4a3a2a', w: 5 });
  for (let i = 0; i < 6; i++) {
    const wx = -470 + i * 165;
    b += rect(wx, -200, 120, 90, { fill: C.sky, w: 4 });
    if (crowd) for (let k = 0; k < 3; k++) b += ellipse(wx + 22 + k * 38, -140, 18, 20, { fill: C.skin, w: 3 }) + ellipse(wx + 22 + k * 38, -156, 18, 9, { fill: '#2a2420', w: 3 });
  }
  for (const wx of [-400, -260, 260, 400]) b += ellipse(wx, 10, 34, 34, { fill: TIRE });
  return g(b, x, y, s);
}

// 島（海に浮かぶ、上から見た形）
export function island(x, y, s = 1) {
  let b = ellipse(0, 0, 420, 160, { fill: '#7fb6d8', color: null }) ;
  b += poly([[-200, 20], [-160, -60], [-60, -110], [60, -100], [170, -40], [210, 30], [120, 80], [-40, 90], [-170, 70]], { fill: '#8fb07a' });
  b += line([[-150, 40], [-60, -60], [80, -60], [160, 20], [40, 60], [-150, 40]], { w: 6, color: '#c8423a', passes: 1 });
  return g(b, x, y, s);
}

// チェッカーフラッグ。wave：0〜1でゆれる
export function checkerFlag(x, y, s = 1, wave = 0) {
  let b = line([[0, 0], [0, -320]], { w: 9, color: '#3a2e28', passes: 1 });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const dx = c * 34, dy = -320 + r * 34 + Math.sin(c * 0.9 + wave * 6) * 8;
    b += `<rect x="${dx}" y="${dy}" width="34" height="34" fill="${(r + c) % 2 ? '#2b2b30' : '#ffffff'}" stroke="#2b2b30" stroke-width="3"/>`;
  }
  return g(b, x, y, s);
}

// 表彰台（1・2・3）
export function podium(x, y, s = 1) {
  let b = rect(-330, -160, 220, 160, { fill: '#c0c4ca' }) + rect(-110, -240, 220, 240, { fill: '#f2c230' }) + rect(110, -120, 220, 120, { fill: '#c99a6a' });
  b += text('2', -220, -60, { size: 80, font: 'Zen Maru Gothic', weight: 900 }) + text('1', 0, -110, { size: 90, font: 'Zen Maru Gothic', weight: 900 }) + text('3', 220, -40, { size: 70, font: 'Zen Maru Gothic', weight: 900 });
  return g(b, x, y, s);
}

// 世界地図（ざっくりした大陸の形）。hi：光らせる地域の番号の配列（0 アジア 1 ヨーロッパ 2 アフリカ 3 北アメリカ 4 南アメリカ 5 オーストラリア）
export function worldMap(x, y, s = 1, hi = []) {
  const land = [
    [[180, -200], [420, -230], [520, -120], [470, -20], [360, 30], [260, -40], [170, -90]],
    [[-30, -230], [130, -240], [160, -150], [60, -120], [-20, -150]],
    [[-20, -90], [130, -90], [160, 40], [80, 190], [10, 120], [-40, 0]],
    [[-560, -230], [-330, -250], [-280, -130], [-380, -40], [-470, -70], [-560, -150]],
    [[-380, 10], [-280, 30], [-250, 140], [-330, 260], [-380, 140]],
    [[380, 120], [500, 110], [530, 190], [420, 210]],
  ];
  let b = rect(-620, -300, 1240, 560, { fill: '#cfe6f5', color: null });
  land.forEach((p, i) => { b += poly(p, { fill: hi.includes(i) ? '#f2c230' : '#9cc08a', w: 5 }); });
  return g(b, x, y, s);
}

// 請求書の山
export function billPile(x, y, s = 1, n = 6) {
  let b = '';
  for (let i = 0; i < n; i++) b += `<g transform="translate(${(i % 2 ? 1 : -1) * 10} ${-i * 26}) rotate(${(i * 7) % 11 - 5})">${rect(-110, -20, 220, 26, { fill: '#fdfbf3', w: 4 })}</g>`;
  b += text('請求書', 0, -n * 26 - 20, { size: 46, color: '#c8423a', font: 'Zen Maru Gothic', weight: 900 });
  return g(b, x, y, s);
}

// 黒電話。ring：0〜1でゆれる
export function phone(x, y, s = 1, ring = 0) {
  const r = Math.sin(ring * 40) * 8 * (ring > 0 ? 1 : 0);
  let b = rect(-90, -80, 180, 80, { fill: '#2b2b30' }) + ellipse(0, -40, 34, 34, { fill: '#9aa0a8', w: 4 });
  b += `<g transform="rotate(${r} 0 -100)">${rect(-110, -130, 220, 36, { fill: '#2b2b30' })}</g>`;
  return g(b, x, y, s);
}

// 手紙（封筒）
export function letter(x, y, s = 1, rot = 0) {
  return g(`<g transform="rotate(${rot})">${rect(-80, -50, 160, 100, { fill: '#fdfbf3', w: 4 }) + line([[-80, -50], [0, 10], [80, -50]], { w: 4, passes: 1 })}</g>`, x, y, s);
}

// 設計図（青い紙に白い線）
export function blueprint(x, y, s = 1, rot = 0) {
  let b = rect(-200, -140, 400, 280, { fill: '#2f5a9a' });
  b += ellipse(-80, 20, 60, 60, { fill: 'none', color: '#e8f0ff', w: 4 }) + ellipse(90, 20, 60, 60, { fill: 'none', color: '#e8f0ff', w: 4 });
  b += line([[-80, 20], [0, -60], [90, 20]], { w: 4, color: '#e8f0ff', passes: 1 }) + line([[-170, -110], [170, -110]], { w: 3, color: '#e8f0ff', passes: 1 });
  return g(`<g transform="rotate(${rot})">${b}</g>`, x, y, s);
}

// 鍛冶屋の金床と火
export function anvil(x, y, s = 1, spark = 0) {
  let b = poly([[-120, -60], [120, -60], [90, -20], [40, -20], [60, 60], [-60, 60], [-40, -20], [-150, -20]], { fill: IRON2 });
  if (spark) for (let i = 0; i < 6; i++) b += line([[0, -70], [Math.cos(i) * 90 * spark, -70 - Math.abs(Math.sin(i * 1.7)) * 90 * spark]], { w: 4, color: '#f2a23a', passes: 1 });
  return g(b, x, y, s);
}

// ジェット機（一般的な小型機の形）
export function jet(x, y, s = 1) {
  let b = poly([[-220, 0], [150, -22], [230, 0], [150, 22]], { fill: C.white });
  b += poly([[-20, -10], [-110, -130], [-60, -130], [60, -10]], { fill: '#c0c4ca', w: 5 }) + poly([[-20, 10], [-110, 130], [-60, 130], [60, 10]], { fill: '#c0c4ca', w: 5 });
  b += rect(-170, -50, 70, 30, { fill: IRON, w: 4 }) + poly([[-220, 0], [-250, -80], [-200, -80], [-170, -6]], { fill: '#3a4a6b', w: 5 });
  for (let i = 0; i < 5; i++) b += ellipse(40 + i * 26, -6, 7, 7, { fill: C.sky, w: 3 });
  return g(b, x, y, s);
}

// 油の入ったびん（松の根の油）
export function oilJar(x, y, s = 1) {
  return g(rect(-50, -120, 100, 120, { fill: '#c99a4a' }) + rect(-30, -150, 60, 32, { fill: '#7a5a34', w: 4 }) + text('油', 0, -40, { size: 50, font: 'Zen Maru Gothic', weight: 900 }), x, y, s);
}

// ───── 横向きで乗っている人（右向き）。自転車・小さなバイクと一緒に使う
// x, y, s：乗り物と同じ位置と大きさ。hip：腰（サドルの上）、grip：ハンドルを握る手の位置、
// crank：ペダルの軸（自転車）、theta：ペダルの角度（こいでいるとき回す）、foot：足を置く場所（バイク。crank の代わり）
// back / front を分けて返す：うしろ側の足は乗り物の奥、手前の足と体は乗り物の手前に描く
const SKIN = '#f6d2b0';
function legIK(hx, hy, fx, fy, L1, L2) {
  const dx = fx - hx, dy = fy - hy, dist = Math.min(L1 + L2 - 1, Math.hypot(dx, dy));
  const a = Math.atan2(dy, dx), c = Math.acos((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist));
  const ka = a - c; // ひざは前（右）に出す
  return [hx + Math.cos(ka) * L1, hy + Math.sin(ka) * L1];
}
export function sideRider(x, y, s = 1, { hip = [-95, -275], grip = [118, -268], crank = [-40, -80], theta = 0, foot = null, hair = '#2a2420', shirt = '#7a6a58', pants = '#4a4038', k = 1, armUp = false, blink = false, smile = true } = {}) {
  const L1 = 92 * k, L2 = 96 * k;
  const pedal = (ang) => foot ? foot : [crank[0] + Math.cos(ang) * 38, crank[1] + Math.sin(ang) * 38];
  const leg = (ang, col, shoe) => {
    const [fx, fy] = pedal(ang), [kx, ky] = legIK(hip[0], hip[1], fx, fy, L1, L2);
    return line([[hip[0], hip[1]], [kx, ky], [fx, fy]], { w: 26 * k, color: col, passes: 1 }) + ellipse(fx + 10, fy + 4, 24 * k, 12 * k, { fill: shoe, w: 4 });
  };
  const back = leg(theta + Math.PI, '#3a3330', '#1e1a18');
  // 体（前かがみ）
  const sh = [hip[0] + 55 * k, hip[1] - 140 * k];
  let f = leg(theta, pants, C.dark);
  f += poly([[hip[0] - 30 * k, hip[1] + 10], [hip[0] + 28 * k, hip[1] + 12], [sh[0] + 34 * k, sh[1] + 8], [sh[0] - 30 * k, sh[1] - 6]], { fill: shirt });
  // 腕（ひじを少し曲げてハンドルへ。armUp なら上に上げる）
  // armUp：もう片方の手を頭の上に上げる（出前のせいろを持つ）。頭のうしろ側なので、頭より先に描く
  if (armUp) f += line([[sh[0] - 10 * k, sh[1]], [sh[0] - 55 * k, sh[1] - 85 * k], [sh[0] - 40 * k, sh[1] - 170 * k]], { w: 20 * k, color: shirt, passes: 1 }) + ellipse(sh[0] - 40 * k, sh[1] - 170 * k, 14 * k, 14 * k, { fill: SKIN, w: 4 });
  const hand = grip;
  const el = [(sh[0] + hand[0]) / 2 + 6, (sh[1] + hand[1]) / 2 + 26 * k];
  f += line([[sh[0], sh[1]], el, hand], { w: 20 * k, color: shirt, passes: 1 }) + ellipse(hand[0], hand[1], 14 * k, 14 * k, { fill: SKIN, w: 4 });
  // 頭（横顔・右向き）
  const hx = sh[0] + 24 * k, hy = sh[1] - 78 * k, r = 66 * k;
  f += ellipse(hx, hy, r, r * 0.95, { fill: SKIN });
  f += ellipse(hx + r * 0.95, hy + r * 0.12, 10 * k, 12 * k, { fill: SKIN, w: 4 }); // 鼻
  f += poly([[hx - r * 1.02, hy + r * 0.3], [hx - r * 1.05, hy - r * 0.4], [hx - r * 0.6, hy - r * 0.95], [hx + r * 0.2, hy - r * 1.05], [hx + r * 0.85, hy - r * 0.6], [hx + r * 0.55, hy - r * 0.45], [hx - r * 0.05, hy - r * 0.55], [hx - r * 0.35, hy - r * 0.1], [hx - r * 0.5, hy + r * 0.45]], { fill: hair });
  f += ellipse(hx - r * 0.25, hy + r * 0.05, 12 * k, 14 * k, { fill: SKIN, w: 4 }); // 耳
  f += blink ? line([[hx + r * 0.42, hy - r * 0.05], [hx + r * 0.62, hy - r * 0.05]], { w: 5, passes: 1 }) : ellipse(hx + r * 0.52, hy - r * 0.08, 6 * k, 8 * k, { fill: C.ink, w: 3 });
  f += ellipse(hx + r * 0.45, hy + r * 0.35, 13 * k, 8 * k, { fill: C.pink, color: null });
  f += smile ? `<path d="M ${hx + r * 0.55} ${hy + r * 0.5} q ${12 * k} ${10 * k} ${24 * k} ${-2 * k}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` : line([[hx + r * 0.55, hy + r * 0.55], [hx + r * 0.78, hy + r * 0.55]], { w: 5, passes: 1 });
  return { back: g(back, x, y, s), front: g(f, x, y, s) };
}
