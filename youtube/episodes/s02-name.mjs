// ショート02：任天堂の名前の意味（縦・ループ）
import { C, text } from '../lib/crayon.mjs';
import { tw, popS, xf, enter, bob, blinking } from '../lib/anim.mjs';
import { kid } from '../lib/cfolk.mjs';
import { hanafuda, shop, sign, band, sneakyCat, townRow } from '../lib/cprops.mjs';

export const meta = { id: 's02-name', format: 'short', title: '任天堂の名前の意味', telop: '任天堂の名前<br>どういう意味？', theme: 'crayon' };

const big = (str, x, y, size, color) =>
  `<text x="${x}" y="${y}" font-family="Zen Maru Gothic" font-weight="900" font-size="${size}" text-anchor="middle" fill="${color}" stroke="${C.white}" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke fill" filter="url(#wobble)">${str}</text>`;
// 「運を天に任せる」の決めカット（冒頭と最後で同じ構図＝ループ）
const kanji = (t, answer = true) => big('任', 300, 700, 230, C.red) + big('天', 540, 700 + Math.sin(t * 3) * 8, 230, C.red) + big('堂', 780, 700, 230, C.red) +
  (answer ? sign('運を天に任せる', 540, 900, { size: 64, fill: C.yellow }) : big('？', 540, 960, 150, C.blue));

export const scenes = [{
  narration: [
    '「運を天に任せる」。',
    'これが、社名の由来と言われている。',
    '始まりは1889年、花札のお店。',
    '花札は、運で勝負が決まる遊び。',
    'だから、この名前がぴったりだった。',
    'あなたは、運まかせ派？実力派？',
    'この3文字に、隠れている言葉は…',
  ],
  draw: (t, c) => {
    let s = band(-20, 1960, '#f3ecdf');
    // 最後は「？」で終わり、2周目の頭で答えの札が出る（ループ）
    if (t > c.at(6)) s += xf(kanji(t, false), { s: popS(t, c.at(6)), cx: 540, cy: 700 });
    else if (t < c.at(1)) s += kanji(t);
    else if (t < c.at(2)) {
      s += kanji(t);
      s += enter(sign('…と言われている', 540, 1060, { size: 50, fill: C.white, rot: 3 }), t, c.at(1) + 1, { cx: 540, cy: 1060 });
    } else if (t < c.at(3)) {
      s += townRow(1150, 4, -100, 340) + band(1150, 200, '#d9c3a0');
      s += xf(shop(540, 1150, 0.9), { y: tw(t, c.at(2), c.at(2) + 0.5, -900, 0) });
      s += enter(sign('1889年・京都', 540, 450, { size: 64, fill: C.white }), t, c.at(2) + 0.2, { cx: 540, cy: 450 });
    } else if (t < c.at(5)) {
      [0, 1, 2].forEach((k, i) => { s += xf(hanafuda(0, 0, 1.3, -10 + i * 10, [1, 2, 0][i]), { x: 260 + i * 280, y: 720 + bob(t, 10, 0.8, i * 0.3), s: popS(t, c.at(3) + i * 0.2), cx: 0, cy: 0 }); });
      s += enter(sign('運で勝負！', 540, 470, { size: 70, fill: C.yellow }), t, c.at(3) + 0.6, { cx: 540, cy: 470 });
      if (t > c.at(4)) s += enter(big('ぴったり！', 540, 1080, 110, C.red), t, c.at(4), { cx: 540, cy: 1040 });
    } else {
      s += kid({ x: 300, y: 1150, s: 0.9, hair: 'messy', shirt: C.blue, arms: [160, 10, 160, 10], blink: blinking(t, 1) }) + sign('運まかせ', 300, 520, { size: 52, fill: C.yellow });
      s += kid({ x: 780, y: 1150, s: 0.9, hair: 'side', shirt: C.pink, arms: [12, 8, 30, -180], blink: blinking(t, 2), flip: true }) + sign('実力', 780, 520, { size: 52, fill: C.white });
      s += text('VS', 540, 800, { size: 120, color: C.red, font: 'Zen Maru Gothic', weight: 900 });
    }
    s += sneakyCat(200, 1470, t, hanafuda(0, 0, 0.25, 15 + Math.sin(t * 3) * 10, 2));
    return s;
  },
}];
