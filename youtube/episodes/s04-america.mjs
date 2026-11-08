// ショート04：ゲーム機を「おもちゃ」として売った（縦・ループ）
// 最後「任天堂の作戦は、たったひとつ。」→ 最初「ゲーム機を、おもちゃとして売った。」
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { tvConsole, toyRobot, dustyPile, sign, bubble, cross, building, plane, ball } from '../lib/cprops.mjs';
import { shots, big } from '../lib/shots.mjs';
import { RED, CREAM, INK, P, kid, pres, salary, vmid, vclose, cam, T, catCorner, fill, glow, typeText, text, ellipse, rect, line, poly, C, ease, clamp, lerp } from './short-kit.mjs';

export const meta = { id: 's04-america', format: 'short', title: 'ゲーム機を「おもちゃ」として売った', telop: 'ゲーム機なのに<br>「おもちゃ」と言い張った', theme: 'crayon' };

// おもちゃ売り場の棚（ゲーム機とロボットが並ぶ）
const shelf = (tl, withSign = true) => {
  let s = fill('#fff2c8') + rect(-100, 1160, 1280, 50, { fill: '#b07a46' }) + rect(-100, 700, 1280, 30, { fill: '#b07a46' });
  s += ball(120, 650, 45, C.blue) + toyRobot(780, 600, 0.6) + tvConsole(340, 1100, 0.65, Math.max(0, Math.sin(tl * 5))) + toyRobot(710, 1080, 1.0, Math.sin(tl * 3) * 6);
  if (withSign) s += sign('おもちゃ売り場', 540, 620, { size: 80, fill: RED, color: C.white });
  return s;
};

const LIST = [
  // 0 ゲーム機を、おもちゃとして売った。
  (tl, d, t) => cam(shelf(tl) + kid({ x: 560, y: 1700, s: 1.5, hair: 'messy', shirt: C.green, arms: P.cheer, blink: blinking(t, 1), expr: 'smile' }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 1 1985年のアメリカ。
  (tl, d) => {
    let s = fill('#1d2a4a') + glow(540, 700, 700, '#ffcf8a', 0.15);
    for (let i = 0; i < 30; i++) s += `<circle cx="${(i * 197) % 1080}" cy="${380 + (i * 113) % 400}" r="3" fill="#fff" opacity="${0.4 + 0.4 * Math.sin(tl * 3 + i)}"/>`;
    [[120, 160, 520], [330, 200, 700], [560, 180, 600], [770, 220, 760], [980, 160, 560]].forEach(([x, w, h]) => { s += building(x, 1300, w, h, '#3a4a6a'); });
    s += plane(tw(tl, 0, d, -300, 1400), 470, 0.7) + T('1985年 アメリカ', 540, 1240, 90, C.white, INK);
    return cam(s, tl, d, { z0: 1.0, z1: 1.05 });
  },
  // 2 ゲームは売れない、と言われていた。
  (tl, d, t) => cam(fill('#e2e6ee') + dustyPile(330, 1250, 1.1) + vmid(salary, 680, { flip: true, look: [-1, 0], arms: [12, 8, 60, 60], blink: blinking(t, 8), expr: 'angry', tilt: Math.sin(tl * 9) * 6 }) +
    enter(bubble('ゲーム？いらない！', 540, 620, { size: 66 }), tl, 0.2, { cx: 540, cy: 620 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 3 そこで、ロボットのおもちゃとセットに。
  (tl, d) => cam(fill('#fff2c8') + glow(540, 900, 600, C.yellow, 0.3) + xf(tvConsole(0, 0, 0.7, 0), { x: 300, y: 1000, s: popS(tl, 0.1), cx: 0, cy: -150 }) +
    xf(T('＋', 510, 900, 160, RED, C.white), { s: popS(tl, 0.5), cx: 540, cy: 850 }) + xf(toyRobot(0, 0, 1.3, Math.sin(tl * 3) * 6), { x: 730, y: 980, s: popS(tl, 0.8), cx: 0, cy: 0 }) +
    T('セットで売る', 540, 640, 100, INK, C.white), tl, d, { z0: 1.0, z1: 1.06 }),
  // 4 置いた場所は、おもちゃ売り場。
  (tl, d) => cam(shelf(tl), tl, d, { z0: 1.12, z1: 1.0, y0: 900 }),
  // 5 名前も「ゲーム機」と呼ばなかった。
  (tl, d) => cam(fill(CREAM) + xf(sign('ゲーム機', 540, 640, { size: 120, fill: C.white }) + cross(540, 640, 2.0), { s: popS(tl, 0.1), cx: 540, cy: 640 }) +
    typeText('Entertainment', 540, 980, tl, { size: 90, color: RED, delay: 0.7, cps: 16 }) + typeText('System', 540, 1100, tl, { size: 90, color: RED, delay: 1.5, cps: 16 }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 6 これ、うまい作戦？ずるい？
  [
    (tl, d, t) => cam(fill('#fff2c8') + glow(540, 800, 600, C.yellow, 0.35) + vmid(kid, 540, { hair: 'messy', shirt: C.orange, arms: P.cheer, blink: blinking(t, 1), expr: 'smile' }) + T('うまい！', 540, 660, 150, RED, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
    (tl, d, t) => cam(fill('#d6e6f5') + vmid(kid, 540, { hair: 'side', shirt: C.blue, arms: P.hips, blink: blinking(t, 2), expr: 'angry' }) + T('ずるい？', 540, 660, 150, C.blue, C.white), tl, d, { z0: 1.0, z1: 1.05 }),
  ],
  // 7 任天堂の作戦は、たったひとつ。（→ 1行目の絵へ）
  (tl, d, t) => cam(fill(RED) + glow(540, 900, 600, '#fff', 0.2) + vmid(pres, 540, { arms: [12, 8, 175, 0], blink: blinking(t, 3), expr: 'smile' }) + xf(T('1', 800, 720, 260, C.yellow, INK), { s: popS(tl, 0.3), cx: 800, cy: 640 }), tl, d, { z0: 1.0, z1: 1.06 }),
];

export const scenes = [{
  narration: [
    'ゲーム機を、おもちゃとして売った。',
    '1985年のアメリカ。',
    'ゲームは売れない、と言われていた。',
    'そこで、ロボットのおもちゃとセットに。',
    '置いた場所は、おもちゃ売り場。',
    '名前も「ゲーム機」と呼ばなかった。',
    'これ、うまい作戦？ずるい？',
    '任天堂の作戦は、たったひとつ。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, toyRobot(0, 0, 0.2, Math.sin(t * 3) * 8)),
}];
