// ショート01：ゲームボーイは、なぜ勝った？（縦・約22秒・ループ）
// ルール：scripts/SHORTS_RULES.md
import { C, text, ellipse, poly, line } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, shake, blinking } from '../lib/anim.mjs';
import { kid } from '../lib/cfolk.mjs';
import { bwHandheld, colorHandheld, battery, sign, trophy, band } from '../lib/cprops.mjs';

export const meta = {
  id: 's01-gameboy',
  format: 'short',
  title: 'ゲームボーイは、なぜカラーに勝てたのか',
  telop: 'ゲームボーイは<br>なぜ勝った？',
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
const big = (str, x, y, size, color) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${C.white}" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke fill">${str}</text>`;

export const scenes = [
  {
    narration: [
      '白黒のゲームボーイが、カラーに圧勝した。', // 0 結論（最後のセリフからつながる）
      '1989年、任天堂が出した携帯ゲーム機。', // 1
      '1年後、セガのゲームギアが登場。', // 2
      'こっちは、きれいなカラー画面。', // 3
      'なのに、なぜ白黒が勝った？', // 4
      'ゲームギアは、電池が数時間でなくなる。', // 5
      'ゲームボーイは、電池4本で約30時間。', // 6
      '値段も、12,500円と19,800円。', // 7
      'しかも、テトリスが大ヒット。', // 8
      'あなたなら、どっちを買う？', // 9
      '子どもたちの答えは、はっきりしていた。', // 10 → 1行目へループ
    ],
    draw: (t, c) => {
      const A = (k) => c.at(k);
      let s = band(-20, 1960, '#f3ecdf');
      const winner = t < A(1) || t > A(10) + 0.6; // 冒頭と最後（ループのつなぎ目）は勝者の構図
      if (winner) {
        s += xf(bwHandheld(0, 0, 1.05, (t * 0.7) % 1, 0), { x: 540, y: 820 });
        s += xf(trophy(0, 0, 0.75), { x: 540, y: 500 + bob(t, 8, 1.2) });
      } else if (t < A(2)) {
        // ゲームボーイの紹介
        s += xf(bwHandheld(0, 0, 1.05, (t * 0.7) % 1, 0), { x: 540, y: 800, s: popS(t, A(1)), cx: 0, cy: 0 });
        s += enter(sign('1989年・任天堂', 540, 440, { size: 56, fill: C.white }), t, A(1) + 0.2, { cx: 540, cy: 440 });
      } else {
        const gx = tw(t, A(2), A(2) + 0.4, 540, 280);
        const ggDead = tw(t, A(5), A(5) + 1.4, 1, 0, (k) => k);
        // ゲームボーイ（左）とゲームギア（右）
        s += xf(bwHandheld(0, 0, 0.9, (t * 0.7) % 1, 0), { x: gx, y: 700 });
        s += xf(colorHandheld(0, 0, 0.66, ggDead < 0.05 ? 1 : 0), { x: 800 + shake(t, A(5) + 1.4, 0.4, 10), y: 700, s: popS(t, A(2) + 0.2), cx: 0, cy: 0 });
        s += enter(sign('ゲームボーイ', 280, 420, { size: 44, fill: C.white }), t, A(2) + 0.3, { cx: 280, cy: 420 });
        s += enter(sign('ゲームギア', 800, 520, { size: 44, fill: C.white }), t, A(2) + 0.3, { cx: 800, cy: 520 });
        if (t > A(3) && t < A(5)) {
          // カラー画面のキラキラ
          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2 + t * 2;
            s += xf(big('✦', 0, 0, 50, [C.yellow, C.pink, C.sky, C.green, C.orange][i]), { x: 800 + Math.cos(a) * 230, y: 690 + Math.sin(a) * 140, s: popS(t, A(3) + i * 0.1), cx: 0, cy: -18 });
          }
        }
        if (t > A(4) && t < A(5)) s += enter(big('？', 540, 380, 170, C.red), t, A(4), { cx: 540, cy: 320 });
        // 電池：ゲームギアは数時間でなくなる / ゲームボーイは約30時間
        if (t > A(5)) {
          s += battery(800, 950, 0.85, ggDead) + enter(big('数時間', 800, 900, 50, C.red), t, A(5) + 0.3, { cx: 800, cy: 880 });
        }
        if (t > A(6)) {
          s += battery(280, 950, 0.85, 1) + enter(big('約30時間', 280, 900, 50, C.green), t, A(6) + 0.2, { cx: 280, cy: 880 });
        }
        // 値段
        if (t > A(7) && t < A(10)) {
          s += enter(sign('12,500円', 280, 1080, { size: 50, fill: C.yellow, rot: -4 }), t, A(7) + 0.2, { cx: 280, cy: 1080 });
          s += enter(sign('19,800円', 800, 1080, { size: 50, fill: C.pink, rot: 4 }), t, A(7) + 0.6, { cx: 800, cy: 1080 });
        }
        // テトリス
        if (t > A(8) && t < A(9)) {
          for (let i = 0; i < 4; i++) {
            s += xf(`<rect x="-30" y="-30" width="60" height="60" fill="${[C.red, C.blue, C.green, C.yellow][i]}" stroke="${C.ink}" stroke-width="5"/>`,
              { x: 190 + i * 60, y: tw(t, A(8) + i * 0.15, A(8) + i * 0.15 + 0.5, 300, 610 + (i % 2) * 60, (k) => k), s: popS(t, A(8) + i * 0.15), cx: 0, cy: 0 });
          }
          s += enter(sign('テトリス大ヒット', 540, 300, { size: 48, fill: C.yellow }), t, A(8) + 0.3, { cx: 540, cy: 300 });
        }
        if (t > A(9) && t < A(10)) s += enter(big('どっち？', 540, 360, 110, C.red), t, A(9), { cx: 540, cy: 320 });
      }
      // 子どもたち：最後に白黒へ向かって走ってくる → 冒頭の「勝者」構図に戻る
      const kids = [[130, C.blue, 'messy'], [290, C.pink, 'side'], [790, C.green, 'messy'], [950, C.orange, 'side']];
      kids.forEach(([x, col, h], i) => {
        let kx = x;
        if (t > A(10) && t < A(10) + 0.6) kx = x + (x < 540 ? -1 : 1) * tw(t, A(10), A(10) + 0.6, 260, 0);
        if (winner || t > A(10)) s += kid({ x: kx, y: 1190 - Math.abs(Math.sin(t * 9 + i)) * 18, s: 0.58, shirt: col, hair: h, arms: CHEER, blink: blinking(t, i), expr: 'smile', flip: x > 540 });
      });
      s += cat(200, 1470, t);
      return s;
    },
  },
];
