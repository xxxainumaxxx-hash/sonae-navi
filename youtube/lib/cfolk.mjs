// クレヨン調の人物（関節つきの腕・口パク・まばたき）。原点は足元。
import { C, ellipse, line, poly } from './crayon.mjs';

// arms: [左肩角度, 左ひじ角度, 右肩角度, 右ひじ角度]（度。0=真下、90=横、180=真上）
export const ARMS = {
  idle: [12, 8, 12, 8], point: [12, 8, 125, 10], wave: [12, 8, 150, -30], shrug: [60, 95, 60, 95],
  cheer: [160, 10, 160, 10], hold: [20, -100, 20, -100], think: [12, 8, 30, -180], hips: [50, -90, 50, -90],
};

export function kid({
  x, y, s = 1, flip = false, expr = 'smile', mouth = 0, blink = false, arms = 'idle', look = [0, 0],
  hair = 'messy', hairColor = '#3a2d25', skin = C.skin, shirt = C.blue, pants = '#3b4a6b',
  glasses = false, mustache = false, tie = null, jacket = null, sweat = false, tilt = 0, legs = 0,
} = {}) {
  const A = typeof arms === 'string' ? ARMS[arms] : arms;
  let b = '';
  // 足（legs: 歩くときの振り -1〜1）
  const lx = 22 * legs;
  b += line([[-26, -78], [-30 - lx, -8]], { w: 10 }) + line([[26, -78], [30 + lx, -8]], { w: 10 });
  b += ellipse(-40 - lx, -6, 26, 12, { fill: C.dark }) + ellipse(40 + lx, -6, 26, 12, { fill: C.dark });
  // 腕（関節を角度から計算）
  const arm = (side, sh, el) => {
    const sx = side * 60, sy = -180;
    const a1 = (sh * Math.PI) / 180, a2 = ((sh + el) * Math.PI) / 180;
    const ex = sx + side * Math.sin(a1) * 66, ey = sy + Math.cos(a1) * 66;
    const hx = ex + side * Math.sin(a2) * 58, hy = ey + Math.cos(a2) * 58;
    return { pts: [[sx, sy], [ex, ey], [hx, hy]], hand: [hx, hy] };
  };
  const L = arm(-1, A[0], A[1]), R = arm(1, A[2], A[3]);
  const sleeve = jacket || shirt;
  for (const a of [L, R]) b += line(a.pts, { w: 22, color: C.ink, passes: 1 }) + line(a.pts, { w: 13, color: sleeve, passes: 1, amp: 1 });
  // 体
  b += poly([[-60, -195], [60, -195], [78, -66], [-78, -66]], { fill: shirt });
  if (jacket) {
    b += poly([[-60, -195], [-14, -195], [-8, -66], [-78, -66]], { fill: jacket });
    b += poly([[60, -195], [14, -195], [8, -66], [78, -66]], { fill: jacket });
  }
  if (tie) b += poly([[-9, -192], [9, -192], [14, -120], [0, -100], [-14, -120]], { fill: tie, w: 5 });
  for (const a of [L, R]) b += ellipse(a.hand[0], a.hand[1], 17, 17, { fill: skin, w: 6 });
  // 頭（tilt で少しかしげる）
  let h = '';
  h += ellipse(-82, -272, 14, 19, { fill: skin, w: 6 }) + ellipse(82, -272, 14, 19, { fill: skin, w: 6 });
  h += ellipse(0, -278, 84, 80, { fill: skin });
  h += ellipse(-46, -250, 15, 9, { fill: C.pink, color: null }) + ellipse(46, -250, 15, 9, { fill: C.pink, color: null });
  if (hair === 'messy') {
    h += poly([[-86, -280], [-88, -322], [-66, -352], [-34, -368], [-8, -362], [14, -374], [40, -360], [70, -346], [88, -314], [86, -280],
      [70, -312], [40, -326], [12, -316], [-16, -330], [-44, -316], [-70, -312]], { fill: hairColor });
  } else if (hair === 'side') {
    h += poly([[-86, -276], [-88, -326], [-56, -360], [0, -372], [56, -362], [86, -330], [86, -280], [70, -316], [20, -334], [-40, -322], [-70, -310]], { fill: hairColor });
  } else if (hair === 'bald') {
    h += poly([[-84, -262], [-86, -300], [-76, -318], [-70, -290], [-74, -262]], { fill: hairColor, w: 5 });
    h += poly([[84, -262], [86, -300], [76, -318], [70, -290], [74, -262]], { fill: hairColor, w: 5 });
  }
  // 目
  const [ox, oy] = look;
  const eye = (ex) => {
    if (blink) return line([[ex - 14, -276], [ex + 14, -276]], { w: 6, passes: 1 });
    if (expr === 'wow') return ellipse(ex, -276, 15, 18, { fill: '#fff', w: 6 }) + ellipse(ex + ox * 4, -274 + oy * 4, 5, 5, { fill: C.ink, w: 4 });
    return ellipse(ex + ox * 5, -276 + oy * 5, 7, 8, { fill: C.ink, w: 5 });
  };
  h += eye(-30) + eye(30);
  if (glasses) h += ellipse(-30, -276, 27, 25, { w: 6 }) + ellipse(30, -276, 27, 25, { w: 6 }) + line([[-4, -280], [4, -280]], { w: 5, passes: 1 });
  const brow = {
    worry: [[[-46, -302], [-16, -312]], [[16, -312], [46, -302]]], wow: [[[-46, -314], [-16, -320]], [[16, -320], [46, -314]]],
    angry: [[[-46, -312], [-16, -300]], [[16, -300], [46, -312]]],
  }[expr];
  if (brow) for (const bb of brow) h += line(bb, { w: 6, passes: 1 });
  // 口：mouth 0〜1 で開き具合（口パク）
  if (mouth > 0.08) {
    const hgt = 6 + mouth * 22;
    h += ellipse(0, -232 + hgt / 4, 16 + mouth * 4, hgt, { fill: '#7a2a2a', w: 5 });
  } else if (expr === 'worry') {
    h += line([[-20, -232], [-8, -238], [6, -230], [20, -236]], { w: 6, passes: 1 });
  } else if (expr === 'wow') {
    h += ellipse(0, -230, 10, 12, { fill: '#7a2a2a', w: 5 });
  } else {
    h += line([[-24, -238], [-8, -224], [10, -224], [26, -238]], { w: 6, passes: 1 });
  }
  if (mustache) h += poly([[-34, -246], [-14, -258], [0, -250], [14, -258], [34, -246], [0, -242]], { fill: hairColor, w: 5 });
  if (sweat) h += poly([[100, -320], [90, -292], [100, -280], [110, -292]], { fill: C.sky, w: 4 });
  b += `<g transform="rotate(${tilt} 0 -200)">${h}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">${b}</g>`;
}

// 案内役（このチャンネルのナレーター）
export const guide = (o) => kid({ hair: 'messy', shirt: C.orange, ...o });
export const boss = (o) => kid({ hair: 'bald', hairColor: '#d8d2c8', mustache: true, shirt: C.white, jacket: '#4a4a55', tie: C.red, pants: '#33333b', ...o });
export const worker = (o) => kid({ hair: 'side', glasses: true, shirt: C.sky, ...o });
