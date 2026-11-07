// ショート01：白黒がカラーに勝った理由（縦・約15秒・ループ）
// ルール：scripts/SHORTS_RULES.md
import { C, text, ellipse, poly, line } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, camera, shake, blinking, clamp } from '../lib/anim.mjs';
import { kid } from '../lib/cfolk.mjs';
import { bwHandheld, colorHandheld, battery, sign, trophy, band, playingCard } from '../lib/cprops.mjs';

export const meta = {
  id: 's01-gameboy',
  format: 'short',
  title: '白黒のゲーム機が、カラーに勝った理由',
  telop: '白黒 vs カラー<br>勝ったのは？',
  theme: 'crayon',
};

const CHEER = [160, 10, 160, 10];
// 小ネタ：すみっこで、ネコがこっそり白黒のゲーム機で遊んでいる
function cat(x, y, t) {
  let b = ellipse(0, 0, 70, 50, { fill: C.gray }) + ellipse(-60, -50, 42, 38, { fill: C.gray });
  b += poly([[-92, -76], [-84, -112], [-64, -84]], { fill: C.gray, w: 5 }) + poly([[-56, -86], [-40, -116], [-30, -82]], { fill: C.gray, w: 5 });
  b += ellipse(-74, -52, 5, 6, { fill: C.ink, w: 3 }) + ellipse(-48, -52, 5, 6, { fill: C.ink, w: 3 });
  b += line([[60, 10], [110, -30 + Math.sin(t * 4) * 12], [130, -70]], { w: 10, color: C.ink, passes: 1 });
  b += bwHandheld(-40, 0, 0.18, (t * 0.6) % 1);
  return `<g transform="translate(${x} ${y})">${b}</g>`;
}

export const scenes = [
  {
    narration: [
      '白黒が、カラーに圧勝した。', // 1行目＝結論（最後のセリフからつながる）
      '1989年、ライバルはカラー画面。',
      'でも、電池はすぐ切れる。',
      'しかも、値段も高い。',
      '白黒は、安くて電池が長持ち。',
      'アメリカでは、テトリス付き。',
      'あなたなら、どっちを買う？',
      '子どもたちの答えは、はっきりしていた。',
    ],
    draw: (t, c) => {
      const t1 = c.at(1), t2 = c.at(2), tP = c.at(3), t3 = c.at(4), tT = c.at(5), t4 = c.at(6), t5 = c.at(7);
      let s = band(-20, 1960, '#f3ecdf');
      const lvB = tw(t, t2, t2 + 1.6, 1, 0, (k) => k);
      const winner = t < t1 || t > t5 + 0.6; // 冒頭と最後（ループのつなぎ目）は勝者の構図
      // 2台のゲーム機
      s += xf(bwHandheld(0, 0, winner ? 1.05 : 0.9, (t * 0.7) % 1, 0), { x: winner ? 540 : 280, y: winner ? 820 : 760, s: 1, cx: 0, cy: 0 });
      if (!winner) {
        s += xf(colorHandheld(0, 0, 0.66, lvB < 0.05 ? 1 : 0), { x: 800 + shake(t, t2 + 1.6, 0.4, 10), y: 740, s: popS(t, t1), cx: 0, cy: 0 });
        s += enter(sign('カラー', 790, 560, { size: 54, fill: C.white }), t, t1 + 0.1, { cx: 790, cy: 560 });
        s += enter(sign('白黒', 290, 470, { size: 54, fill: C.white }), t, t1 + 0.1, { cx: 290, cy: 470 });
        if (t > t2) {
          s += battery(790, 990, 0.85, lvB);
          s += enter(sign('高い！', 900, 430, { size: 50, fill: C.pink, rot: 8 }), t, tP, { cx: 900, cy: 430 });
        }
        if (t > t3) {
          s += battery(290, 990, 0.85, 1);
          s += enter(sign('安い！長持ち！', 300, 1095, { size: 44, fill: C.yellow, rot: -4 }), t, t3 + 0.2, { cx: 300, cy: 1095 });
        }
        if (t > tT && t < t4) {
          for (let i = 0; i < 4; i++) s += xf(`<rect x="-40" y="-40" width="80" height="80" fill="${[C.red, C.blue, C.green, C.yellow][i]}" stroke="${C.ink}" stroke-width="6"/>`, { x: 200 + i * 90, y: tw(t, tT + i * 0.15, tT + i * 0.15 + 0.5, 380, 640 + (i % 2) * 70, (k) => k), s: popS(t, tT + i * 0.15), cx: 0, cy: 0 });
        }
        if (t > t4 && t < t5) {
          s += enter(text('？', 540, 520, { size: 200, color: C.red, font: 'Zen Maru Gothic', weight: 900 }), t, t4, { cx: 540, cy: 460 });
        }
      } else {
        s += xf(trophy(0, 0, 0.75), { x: 540, y: 500 + bob(t, 8, 1.2), s: 1, cx: 0, cy: 0 });
      }
      // 子どもたち：最後は白黒に向かって走ってくる → 冒頭の「勝者」構図に戻る
      const kids = [[130, C.blue, 'messy'], [290, C.pink, 'side'], [790, C.green, 'messy'], [950, C.orange, 'side']];
      kids.forEach(([x, col, h], i) => {
        let kx = x, ky = 1190;
        if (t > t5 && t < t5 + 0.6) kx = x + (x < 540 ? -1 : 1) * tw(t, t5, t5 + 0.6, 260, 0);
        const show = winner || t > t5;
        if (show) s += kid({ x: kx, y: ky - Math.abs(Math.sin(t * 9 + i)) * 18, s: 0.58, shirt: col, hair: h, arms: CHEER, blink: blinking(t, i), expr: 'smile', flip: x > 540 });
      });
      s += cat(200, 1470, t);
      return s;
    },
  },
];
