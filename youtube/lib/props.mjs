// キャラクター「ソナエ」と小物。原点はキャラの足元／小物の中心。
import { C, ellipse, line, poly, rect, blob, text, g, sparkles } from './crayon.mjs';

// ---------- 主人公：黄色い防災ヘルメットの「ソナエ」 ----------
// expr: smile | wow | think | wink    pose: point | wave | hold | cheer | none
export function sonae({ x, y, s = 1, expr = 'smile', pose = 'point', flip = false } = {}) {
  let b = '';
  // 足
  b += line([[-28, -70], [-34, -8]], { w: 9 }) + line([[28, -70], [34, -8]], { w: 9 });
  b += ellipse(-44, -6, 26, 13, { fill: C.dark }) + ellipse(44, -6, 26, 13, { fill: C.dark });
  // 体（オレンジのパーカー）
  b += poly([[-62, -190], [62, -190], [82, -64], [-82, -64]], { fill: C.orange });
  b += line([[0, -186], [0, -70]], { w: 4, color: C.dark });
  // 腕
  const L = [-66, -175], R = [66, -175];
  const hand = (hx, hy) => ellipse(hx, hy, 17, 17, { fill: C.skin, w: 6 });
  if (pose === 'point') {
    b += line([L, [-100, -110], [-92, -82]], { w: 9 }) + hand(-92, -78);
    b += line([R, [140, -230], [175, -265]], { w: 9 }) + hand(178, -268);
    b += line([[188, -280], [215, -312]], { w: 7 });
  } else if (pose === 'wave') {
    b += line([L, [-100, -110], [-92, -82]], { w: 9 }) + hand(-92, -78);
    b += line([R, [130, -230], [150, -300]], { w: 9 }) + hand(152, -306);
    b += line([[190, -330], [205, -300]], { w: 5 }) + line([[200, -360], [225, -335]], { w: 5 });
  } else if (pose === 'hold') {
    b += line([L, [-90, -130], [-40, -128]], { w: 9 }) + hand(-36, -128);
    b += line([R, [90, -130], [40, -128]], { w: 9 }) + hand(36, -128);
  } else if (pose === 'cheer') {
    b += line([L, [-120, -240], [-135, -300]], { w: 9 }) + hand(-136, -306);
    b += line([R, [120, -240], [135, -300]], { w: 9 }) + hand(136, -306);
  } else {
    b += line([L, [-96, -110], [-90, -80]], { w: 9 }) + hand(-90, -76);
    b += line([R, [96, -110], [90, -80]], { w: 9 }) + hand(90, -76);
  }
  // 頭
  b += ellipse(0, -275, 82, 78, { fill: C.skin });
  // ほっぺ
  b += ellipse(-48, -250, 15, 9, { fill: C.pink, color: null });
  b += ellipse(48, -250, 15, 9, { fill: C.pink, color: null });
  // ヘルメット
  b += poly([[-92, -292], [-84, -340], [-50, -375], [0, -387], [50, -375], [84, -340], [92, -292]], { fill: C.yellow });
  b += line([[-108, -290], [108, -290]], { w: 10 });
  b += line([[0, -372], [0, -300]], { w: 5, color: C.dark });
  // ヘルメットの緑十字
  b += rect(-48, -350, 30, 30, { fill: C.white, w: 4 });
  b += line([[-33, -344], [-33, -326]], { w: 6, color: C.green, passes: 1 }) + line([[-42, -335], [-24, -335]], { w: 6, color: C.green, passes: 1 });
  // 顔
  if (expr === 'wow') {
    b += ellipse(-28, -268, 12, 15, { w: 6 }) + ellipse(28, -268, 12, 15, { w: 6 });
    b += ellipse(0, -228, 14, 17, { fill: C.dark, w: 6 });
    b += line([[-40, -300], [-18, -306]], { w: 5 }) + line([[18, -306], [40, -300]], { w: 5 });
  } else if (expr === 'think') {
    b += ellipse(-28, -268, 6, 7, { fill: C.ink, w: 5 }) + ellipse(28, -268, 6, 7, { fill: C.ink, w: 5 });
    b += line([[-16, -228], [18, -232]], { w: 6 });
    b += line([[-40, -292], [-16, -290]], { w: 5 }) + line([[16, -296], [40, -302]], { w: 5 });
    b += poly([[96, -300], [86, -270], [96, -258], [106, -270]], { fill: C.sky, w: 4 });
  } else if (expr === 'wink') {
    b += ellipse(-28, -268, 6, 7, { fill: C.ink, w: 5 });
    b += line([[16, -268], [28, -276], [40, -268]], { w: 6 });
    b += line([[-28, -238], [-10, -222], [12, -222], [30, -238]], { w: 6 });
  } else {
    b += ellipse(-28, -268, 6, 7, { fill: C.ink, w: 5 }) + ellipse(28, -268, 6, 7, { fill: C.ink, w: 5 });
    b += line([[-28, -238], [-10, -222], [12, -222], [30, -238]], { w: 6 });
  }
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  return `<g transform="${t}">${b}</g>`;
}

// ---------- 小物 ----------
export function onigiri(x, y, s = 1) {
  let b = poly([[0, -95], [40, -60], [88, 30], [70, 62], [-70, 62], [-88, 30], [-40, -60]], { fill: C.rice });
  b += rect(-40, 8, 80, 56, { fill: C.dark, w: 5 });
  b += ellipse(-24, -15, 5, 5, { fill: C.ink, w: 4 }) + ellipse(24, -15, 5, 5, { fill: C.ink, w: 4 });
  return g(b, x, y, s);
}

export function priceTag(x, y, label, { color = C.white, size = 64, w = 220, rot = -4 } = {}) {
  let b = poly([[-w / 2, -50], [w / 2 - 30, -50], [w / 2, 0], [w / 2 - 30, 50], [-w / 2, 50]], { fill: color });
  b += ellipse(w / 2 - 34, 0, 8, 8, { w: 4 });
  b += text(label, -10, size * 0.35, { size });
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${b}</g>`;
}

export function riceBag(x, y, s = 1) {
  let b = poly([[-80, -110], [80, -110], [95, 110], [-95, 110]], { fill: C.white });
  b += line([[-80, -110], [-60, -130], [-20, -118], [20, -132], [60, -118], [80, -110]], { w: 6 });
  b += ellipse(0, -60, 30, 18, { fill: C.green, w: 5 });
  b += text('おこめ', 0, 40, { size: 46 });
  return g(b, x, y, s);
}

export function nori(x, y, s = 1) {
  let b = rect(-70, -90, 140, 180, { fill: C.dark });
  b += text('のり', 0, 20, { size: 50, color: C.white });
  return g(b, x, y, s);
}

export function coin(x, y, r, sym, fill = C.gold) {
  return ellipse(x, y, r, r, { fill, w: 6 }) + text(sym, x, y + r * 0.38, { size: r * 1.1, font: 'Zen Maru Gothic', weight: 700 });
}

export function truck(x, y, s = 1) {
  let b = rect(-180, -120, 230, 140, { fill: C.blue });
  b += poly([[50, -80], [130, -80], [170, -30], [170, 20], [50, 20]], { fill: C.sky });
  b += rect(80, -66, 45, 36, { fill: C.white, w: 5 });
  b += ellipse(-110, 30, 34, 34, { fill: C.dark }) + ellipse(110, 30, 34, 34, { fill: C.dark });
  b += text('はこぶ', -65, -30, { size: 52, color: C.white });
  return g(b, x, y, s);
}

export function factory(x, y, s = 1) {
  let b = poly([[-170, 100], [-170, -30], [-90, -80], [-90, -30], [-10, -80], [-10, -30], [70, -80], [70, 100]], { fill: C.gray });
  b += rect(80, -180, 50, 280, { fill: C.brown });
  b += ellipse(120, -230, 40, 26, { fill: C.white, w: 5 }) + ellipse(160, -280, 50, 30, { fill: C.white, w: 5 });
  b += rect(-130, 20, 50, 50, { fill: C.sky, w: 5 }) + rect(-40, 20, 50, 50, { fill: C.sky, w: 5 });
  return g(b, x, y, s);
}

export function bolt(x, y, s = 1) {
  return g(poly([[10, -110], [-50, 10], [-5, 10], [-25, 110], [55, -20], [8, -20], [35, -110]], { fill: C.yellow }), x, y, s);
}

export function gasCan(x, y, s = 1) {
  let b = blob(-75, -90, 150, 180, 20, { fill: C.red });
  b += rect(-20, -120, 40, 32, { fill: C.dark, w: 5 });
  b += text('ガソリン', 0, 14, { size: 28, color: C.white, font: 'Zen Maru Gothic', weight: 700 });
  return g(b, x, y, s);
}

export function wheat(x, y, s = 1) {
  let b = line([[0, 120], [0, -60]], { w: 7, color: C.brown });
  for (let i = 0; i < 4; i++) {
    b += ellipse(-18, -40 - i * 32, 16, 24, { fill: C.gold, w: 5 }) + ellipse(18, -40 - i * 32, 16, 24, { fill: C.gold, w: 5 });
  }
  b += ellipse(0, -170, 14, 22, { fill: C.gold, w: 5 });
  return g(b, x, y, s);
}

export function oilBottle(x, y, s = 1) {
  let b = poly([[-45, -60], [45, -60], [55, 110], [-55, 110]], { fill: C.yellow });
  b += rect(-22, -120, 44, 60, { fill: C.gold, w: 5 });
  b += text('あぶら', 0, 40, { size: 28 });
  return g(b, x, y, s);
}

// ローリングストックの棚
export function shelf(x, y, s = 1) {
  let b = rect(-260, -220, 520, 440, { fill: C.brown });
  b += line([[-260, -10], [260, -10]], { w: 8 });
  // 上段：水
  for (let i = 0; i < 4; i++) {
    const bx = -190 + i * 120;
    b += rect(bx - 35, -190, 70, 170, { fill: C.sky, w: 5 }) + rect(bx - 14, -210, 28, 22, { fill: C.blue, w: 4 });
  }
  // 下段：かんづめ
  for (let i = 0; i < 5; i++) {
    const bx = -200 + i * 100;
    b += rect(bx - 40, 70, 80, 120, { fill: i % 2 ? C.red : C.green, w: 5 });
  }
  return g(b, x, y, s);
}

// くるっと回る矢印（ローリング）
export function loopArrow(x, y, r, color = C.green) {
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const a = (-80 + i * 22) * Math.PI / 180;
    pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
  }
  // 矢じり：進む向き（接線）の逆側に2本
  const a = (-80 + 14 * 22) * Math.PI / 180;
  const [ex, ey] = pts[pts.length - 1];
  const dir = Math.atan2(Math.cos(a), -Math.sin(a));
  const h = (da) => [ex - 46 * Math.cos(dir + da), ey - 46 * Math.sin(dir + da)];
  return line(pts, { color, w: 12 }) + line([h(-0.5), [ex, ey], h(0.5)], { color, w: 12 });
}

export function question(x, y, s = 1, color = C.blue) {
  return text('？', x, y, { size: 160 * s, color, font: 'Zen Maru Gothic', weight: 900, rot: 10 });
}

export { sparkles };

// ---------- 候補キャラ：備えるリス「リスケ」 ----------
// どんぐりを貯めこむ＝備蓄の象徴。helmet:true で防災ヘルメット付き
export function risu({ x, y, s = 1, expr = 'smile', pose = 'hold', helmet = false, flip = false } = {}) {
  let b = '';
  // しっぽ（体の後ろで大きくくるん）
  b += poly([[40, -60], [130, -80], [190, -160], [205, -260], [180, -350], [120, -395], [62, -380],
    [42, -335], [70, -305], [112, -300], [125, -250], [110, -190], [70, -140], [35, -115]], { fill: C.fur, amp: 3 });
  b += line([[150, -130], [175, -230], [160, -320], [118, -350]], { w: 4, color: C.furDark });
  // 足
  b += ellipse(-38, -10, 30, 14, { fill: C.furDark }) + ellipse(38, -10, 30, 14, { fill: C.furDark });
  // 体
  b += ellipse(0, -110, 82, 100, { fill: C.fur });
  b += ellipse(0, -95, 50, 70, { fill: C.cream, color: null });
  // 耳
  if (!helmet) {
    b += ellipse(-52, -330, 22, 32, { fill: C.fur }) + ellipse(52, -330, 22, 32, { fill: C.fur });
    b += ellipse(-52, -326, 10, 17, { fill: C.pink, color: null }) + ellipse(52, -326, 10, 17, { fill: C.pink, color: null });
  }
  // 頭
  b += ellipse(0, -255, 88, 76, { fill: C.fur });
  b += ellipse(0, -232, 52, 40, { fill: C.cream, color: null });
  if (helmet) {
    b += poly([[-90, -272], [-82, -322], [-48, -355], [0, -366], [48, -355], [82, -322], [90, -272]], { fill: C.yellow });
    b += line([[-104, -270], [104, -270]], { w: 10 });
    b += rect(-16, -345, 32, 30, { fill: C.white, w: 4 });
    b += line([[0, -339], [0, -321]], { w: 6, color: C.green, passes: 1 }) + line([[-9, -330], [9, -330]], { w: 6, color: C.green, passes: 1 });
  }
  // 顔
  if (expr === 'wow') {
    b += ellipse(-32, -255, 13, 16, { fill: C.white, w: 6 }) + ellipse(32, -255, 13, 16, { fill: C.white, w: 6 });
    b += ellipse(0, -212, 12, 14, { fill: C.dark, w: 5 });
  } else if (expr === 'think') {
    b += ellipse(-32, -255, 7, 8, { fill: C.ink, w: 5 }) + ellipse(32, -255, 7, 8, { fill: C.ink, w: 5 });
    b += line([[-12, -212], [14, -215]], { w: 5 });
  } else {
    b += ellipse(-32, -255, 8, 9, { fill: C.ink, w: 5 }) + ellipse(32, -255, 8, 9, { fill: C.ink, w: 5 });
    b += line([[-16, -214], [0, -205], [16, -214]], { w: 5 });
  }
  b += ellipse(0, -230, 9, 6, { fill: C.dark, w: 4 });
  b += ellipse(-58, -225, 14, 9, { fill: C.pink, color: null }) + ellipse(58, -225, 14, 9, { fill: C.pink, color: null });
  // どんぐり（手に持つ）
  if (pose === 'hold') {
    b += ellipse(0, -140, 34, 40, { fill: C.brown });
    b += poly([[-38, -170], [38, -170], [30, -192], [-30, -192]], { fill: C.furDark, w: 5 });
    b += line([[0, -192], [4, -206]], { w: 5 });
    b += ellipse(-40, -150, 16, 14, { fill: C.fur, w: 5 }) + ellipse(40, -150, 16, 14, { fill: C.fur, w: 5 });
  } else if (pose === 'point') {
    b += ellipse(-60, -130, 16, 14, { fill: C.fur, w: 5 });
    b += line([[60, -170], [130, -230]], { w: 9 }) + ellipse(136, -236, 16, 14, { fill: C.fur, w: 5 });
  }
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  return `<g transform="${t}">${b}</g>`;
}
