// ショート04：ゲーム機を「おもちゃ」として売った（縦・ループ）
import { C, text } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, blinking, shake } from '../lib/anim.mjs';
import { kid } from '../lib/cfolk.mjs';
import { tvConsole, toyRobot, dustyPile, sign, band, sneakyCat, bubble, cross } from '../lib/cprops.mjs';

export const meta = { id: 's04-america', format: 'short', title: 'ゲーム機を「おもちゃ」として売った', telop: 'ゲーム機なのに<br>「おもちゃ」と言い張った', theme: 'crayon' };

const salary = (o) => kid({ hair: 'side', glasses: true, shirt: C.white, jacket: '#555', tie: C.blue, pants: '#444', ...o });
// 決めカット：おもちゃ売り場のゲーム機＋ロボット
const shelf = (t) => `<rect x="80" y="1180" width="920" height="40" fill="#b07a46" stroke="#2b2622" stroke-width="6"/>` +
  tvConsole(400, 1040, 0.6, Math.max(0, Math.sin(t * 5))) + toyRobot(800, 1010, 0.8, Math.sin(t * 3) * 6) + sign('おもちゃ売り場', 540, 560, { size: 66, fill: C.yellow });

export const scenes = [{
  narration: [
    'ゲーム機を、おもちゃとして売った。',
    '1985年のアメリカ。',
    'ゲームは売れない、と言われていた。',
    'そこで、ロボットのおもちゃとセットに。',
    '置いた場所は、おもちゃ売り場。',
    '名前も「ゲーム機」と呼ばなかった。',
    'これ、うまい作戦？ずるい？',
    'そして任天堂がやったのは…',
  ],
  draw: (t, c) => {
    let s = band(-20, 1960, '#e8ecf3');
    const loop = t < c.at(1) || t > c.at(7) + 0.6;
    if (loop) s += shelf(t);
    else if (t < c.at(3)) {
      s += enter(sign('1985年 アメリカ', 540, 470, { size: 60, fill: C.white }), t, c.at(1), { cx: 540, cy: 470 });
      if (t > c.at(2)) {
        s += xf(dustyPile(540, 1150, 1.0), { s: popS(t, c.at(2)), cx: 540, cy: 1000 });
        s += salary({ x: 860 + shake(t, c.at(2) + 0.5, 0.5, 10), y: 1150, s: 0.8, expr: 'angry', flip: true, arms: [12, 8, 60, 60], blink: blinking(t, 1) });
        s += enter(bubble('いらない！', 760, 640, { size: 50 }), t, c.at(2) + 0.4, { cx: 760, cy: 640 });
      }
    } else if (t < c.at(5)) {
      s += xf(tvConsole(0, 0, 0.6, 0), { x: 400, y: 1040, s: popS(t, c.at(3)), cx: 0, cy: -150 });
      s += xf(toyRobot(0, 0, 0.8, Math.sin(t * 3) * 6), { x: 800, y: 1010, s: popS(t, c.at(3) + 0.4), cx: 0, cy: -60 });
      s += enter(text('＋', 600, 950, { size: 120, color: C.red, font: 'Zen Maru Gothic', weight: 900 }), t, c.at(3) + 0.3, { cx: 600, cy: 910 });
      if (t > c.at(4)) s = band(-20, 1960, '#e8ecf3') + shelf(t);
    } else if (t < c.at(6)) {
      s += shelf(t);
      s += xf(sign('ゲーム機', 540, 760, { size: 60, fill: C.white }) + cross(540, 760, 0.9), { s: popS(t, c.at(5)), cx: 540, cy: 760 });
      s += enter(sign('Entertainment System', 540, 880, { size: 30, fill: C.sky }), t, c.at(5) + 0.6, { cx: 540, cy: 880 });
    } else {
      s += kid({ x: 300, y: 1150, s: 0.9, hair: 'messy', shirt: C.blue, arms: [160, 10, 160, 10], blink: blinking(t, 1) }) + sign('うまい！', 300, 520, { size: 56, fill: C.yellow });
      s += kid({ x: 780, y: 1150, s: 0.9, hair: 'side', shirt: C.pink, arms: [60, 95, 60, 95], blink: blinking(t, 2), flip: true, expr: 'worry' }) + sign('ずるい？', 780, 520, { size: 56, fill: C.white });
    }
    s += sneakyCat(200, 1470, t, toyRobot(0, 0, 0.2, Math.sin(t * 4) * 15));
    return s;
  },
}];
