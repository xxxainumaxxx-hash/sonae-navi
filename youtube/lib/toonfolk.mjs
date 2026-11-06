// まる頭カートゥーンの人物。原点は足元。
import { K, oval, box, blob, poly, tube, stroke, seg, shape, smooth, g } from './toon.mjs';

// expr: smile | talk | wow | worry | sad | smirk | angry
// pose: idle | point | shrug | hold | cheer | think | wave
// hair: messy | side | bald | bob | none
export function person({
  x, y, s = 1, flip = false, expr = 'smile', pose = 'idle', look = [0, 0],
  hair = 'messy', hairColor = K.hair, skin = K.skin, shirt = K.green, pants = K.navy,
  glasses = false, beard = false, tie = null, jacket = null, sweat = false, mustache = false,
} = {}) {
  let b = '';
  const hand = (hx, hy) => oval(hx, hy, 22, 22, { fill: skin, w: 6, shade: 0.15, sx: 6, sy: 5 });
  // 脚と靴
  b += tube([[-30, -90], [-34, -22]], { w: 30, fill: pants }) + tube([[30, -90], [34, -22]], { w: 30, fill: pants });
  b += oval(-44, -14, 36, 18, { fill: K.black, w: 6, shade: 0 }) + oval(44, -14, 36, 18, { fill: K.black, w: 6, shade: 0 });
  // 腕（体の後ろ側を先に）
  const SL = [-64, -190], SR = [64, -190];
  const arms = {
    idle: [[SL, [-92, -140], [-88, -98]], [SR, [92, -140], [88, -98]]],
    point: [[SL, [-92, -140], [-88, -98]], [SR, [140, -230], [190, -275]]],
    shrug: [[SL, [-130, -150], [-160, -205]], [SR, [130, -150], [160, -205]]],
    hold: [[SL, [-90, -130], [-36, -140]], [SR, [90, -130], [36, -140]]],
    cheer: [[SL, [-120, -260], [-140, -330]], [SR, [120, -260], [140, -330]]],
    think: [[SL, [-92, -140], [-88, -98]], [SR, [80, -130], [40, -235]]],
    wave: [[SL, [-92, -140], [-88, -98]], [SR, [130, -240], [150, -320]]],
  }[pose] || [];
  const armCol = jacket || shirt;
  for (const a of arms) b += tube(a, { w: 30, fill: armCol });
  // 胴体
  b += blob([[-66, -205], [0, -214], [66, -205], [86, -120], [80, -70], [0, -62], [-80, -70], [-86, -120]], { fill: shirt });
  if (jacket) {
    b += blob([[-66, -205], [-20, -210], [-8, -64], [-80, -70], [-86, -120]], { fill: jacket, shade: 0.18 });
    b += blob([[66, -205], [20, -210], [8, -64], [80, -70], [86, -120]], { fill: jacket, shade: 0.18 });
  }
  if (tie) b += poly([[-10, -205], [10, -205], [16, -120], [0, -98], [-16, -120]], { fill: tie, w: 5, shade: 0.15 });
  for (const a of arms) b += hand(...a[a.length - 1]);
  if (pose === 'point') b += tube([[190, -275], [218, -306]], { w: 12, fill: skin, edge: 5 });
  // 頭
  b += oval(-108, -318, 18, 24, { fill: skin, w: 6, shade: 0 }) + oval(108, -318, 18, 24, { fill: skin, w: 6, shade: 0 });
  b += oval(0, -330, 112, 108, { fill: skin, shade: 0.16, sx: 22, sy: 16 });
  if (beard) {
    let dots = '';
    for (let i = 0; i < 70; i++) {
      const a = Math.PI * (0.12 + 0.76 * (i / 70)), r = 70 + (i * 37 % 30);
      dots += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(-330 + Math.sin(a) * r * 0.95).toFixed(1)}" r="3.2" fill="${K.ink}" opacity="0.55"/>`;
    }
    b += dots;
  }
  // 髪
  if (hair === 'messy') {
    b += blob([[-114, -312], [-120, -370], [-96, -420], [-60, -452], [-20, -470], [10, -462], [40, -478], [70, -452],
      [104, -430], [122, -380], [114, -318], [96, -360], [60, -392], [20, -380], [-14, -398], [-48, -380], [-84, -372]], { fill: hairColor, shade: 0.25 });
  } else if (hair === 'side') {
    b += blob([[-114, -310], [-118, -378], [-80, -428], [-10, -446], [60, -438], [104, -408], [118, -350], [112, -310],
      [96, -360], [40, -392], [-30, -380], [-78, -370]], { fill: hairColor, shade: 0.25 });
  } else if (hair === 'bald') {
    b += blob([[-111, -296], [-113, -352], [-104, -380], [-96, -350], [-99, -300]], { fill: hairColor, w: 4, shade: 0 });
    b += blob([[111, -296], [113, -352], [104, -380], [96, -350], [99, -300]], { fill: hairColor, w: 4, shade: 0 });
  } else if (hair === 'bob') {
    b += blob([[-122, -260], [-126, -380], [-80, -440], [0, -456], [80, -440], [126, -380], [122, -260], [96, -268],
      [96, -350], [40, -390], [-40, -388], [-96, -350], [-96, -268]], { fill: hairColor, shade: 0.25 });
  }
  // 顔
  const [lx, ly] = look;
  const eye = (ex, small = false) =>
    oval(ex, -330, 26, 30, { fill: '#fff', w: 6, shade: 0 }) +
    oval(ex + lx * 9, -326 + ly * 9, small ? 6 : 11, small ? 6 : 12, { fill: K.ink, w: 0, shade: 0 });
  const brow = (x1, y1, x2, y2) => seg(x1, y1, x2, y2, { w: 10 });
  b += eye(-40, expr === 'wow') + eye(40, expr === 'wow');
  if (glasses) {
    b += `<g fill="none" stroke="${K.ink}" stroke-width="7">
      <circle cx="-40" cy="-330" r="42"/><circle cx="40" cy="-330" r="42"/></g>` + seg(-2, -336, 2, -336, { w: 7 });
  }
  const B = { // 眉
    smile: [[-64, -380, -20, -384], [20, -384, 64, -380]], talk: [[-64, -382, -20, -386], [20, -386, 64, -382]],
    wow: [[-64, -398, -20, -404], [20, -404, 64, -398]], worry: [[-62, -372, -20, -388], [20, -388, 62, -372]],
    sad: [[-62, -384, -22, -372], [22, -372, 62, -384]], smirk: [[-62, -380, -20, -382], [20, -396, 62, -386]],
    angry: [[-62, -390, -20, -372], [20, -372, 62, -390]],
  }[expr];
  for (const bb of B) b += brow(...bb);
  b += stroke([[-6, -300], [6, -292], [-2, -284]], { w: 6 }); // 鼻
  const mouth = {
    smile: `<path d="M-38,-262 Q0,-226 38,-262" fill="none" stroke="${K.ink}" stroke-width="8" stroke-linecap="round"/>`,
    talk: shape('M-34,-264 Q0,-262 34,-264 Q30,-222 0,-220 Q-30,-222 -34,-264Z', { fill: '#7a2a2a', w: 7, shade: 0 }) +
      `<path d="M-18,-232 Q0,-244 18,-232 Q10,-222 0,-221 Q-10,-222 -18,-232Z" fill="#e57a7a"/>`,
    wow: oval(0, -248, 20, 26, { fill: '#7a2a2a', w: 7, shade: 0 }),
    worry: `<path d="M-34,-250 q12,-12 24,0 t24,0 t20,-4" fill="none" stroke="${K.ink}" stroke-width="7" stroke-linecap="round"/>`,
    sad: `<path d="M-30,-240 Q0,-266 30,-240" fill="none" stroke="${K.ink}" stroke-width="8" stroke-linecap="round"/>`,
    smirk: `<path d="M-30,-256 Q10,-250 40,-272" fill="none" stroke="${K.ink}" stroke-width="8" stroke-linecap="round"/>`,
    angry: `<path d="M-32,-246 L32,-246" fill="none" stroke="${K.ink}" stroke-width="9" stroke-linecap="round"/>`,
  }[expr];
  b += mouth;
  if (mustache) b += shape('M-46,-270 Q-24,-298 0,-282 Q24,-298 46,-270 Q24,-276 0,-268 Q-24,-276 -46,-270Z', { fill: hairColor, w: 5, shade: 0 });
  if (sweat) b += shape('M128,-410 Q112,-372 128,-362 Q144,-372 128,-410Z', { fill: K.sky, w: 5, shade: 0 });
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${b}</g>`;
}

// ナレーター（このチャンネルの案内役）
export const narrator = (o) => person({ hair: 'messy', shirt: K.teal, pants: K.navy, ...o });
