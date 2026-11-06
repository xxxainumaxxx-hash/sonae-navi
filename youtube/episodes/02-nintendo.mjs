// 試作第2話：任天堂は、なぜ生き残れたのか（カートゥーン調）
import { K, defs, frame, seed, stage, rays, floor, curtains, title, tag, label, cross, burst, g, box } from '../lib/toon.mjs';
import { person, narrator } from '../lib/toonfolk.mjs';
import { card, shop, taxi, riceBox, extendHand, calculator, handheld, tvConsole, bulb, gear, chartDown } from '../lib/toonprops.mjs';

export const meta = {
  id: '02-nintendo',
  title: '任天堂は、なぜ生き残れたのか',
  description: 'カード屋さんから始まった任天堂。失敗続きの時代に会社を救ったのは、社員が遊びで作ったおもちゃだった。',
};

// 社長（一般的な年配男性。実在人物の似顔絵にはしない）
const boss = (o) => person({ hair: 'bald', hairColor: '#cfcac4', mustache: true, shirt: K.white, jacket: '#3b3b44', tie: K.darkRed, pants: '#2c2c33', ...o });
// 若い社員
const worker = (o) => person({ hair: 'side', shirt: K.sky, jacket: null, pants: K.navy, glasses: true, ...o });

export function renderFrame(sc, boil, i) {
  seed(500 + i * 31);
  return defs(boil) + frame(sc.draw());
}

export const scenes = [
  {
    narration: ['任天堂は、もともとゲームの会社じゃなかった。', 'じゃあ、なんで世界中で遊ばれる会社になれたのか？'],
    draw: () =>
      stage('#2a1414', '#c0612f', { x: 55, y: 35 }) + curtains('#6e1c1a') + rays(1100, 300, '#ffd9a0', 14, 0.07) +
      floor(860, '#3a2418') +
      card(1180, 520, 1.25, -12, 0) + card(1420, 500, 1.25, 10, 1) + handheld(1320, 800, 0.9) +
      narrator({ x: 520, y: 1000, s: 1.35, expr: 'talk', pose: 'point', look: [1, -0.3] }) +
      title('任天堂は', 960, 170, { size: 120 }) + title('なぜ生き残れた？', 1000, 320, { size: 120, color: K.yellow }),
  },
  {
    narration: ['始まりは1889年の京都。', '花札という、絵の描かれたカードを作る、小さなお店だった。'],
    draw: () =>
      stage('#3b2a4d', '#f2a65a', { x: 50, y: 30 }) + floor(820, '#8a6a4a') +
      shop(960, 830, 1.25) +
      card(380, 420, 1.0, -15, 1) + card(1560, 400, 1.0, 12, 0) +
      tag('1889年・京都', 960, 140, { size: 72, fill: K.cream }) +
      narrator({ x: 1640, y: 1010, s: 0.95, expr: 'smile', pose: 'idle', look: [-1, 0] }),
  },
  {
    narration: ['でも1960年代、カードの売れゆきが落ちていく。', 'あせった会社は、タクシーやインスタントのごはんなど、いろんな商売に手を出すけど、うまくいかなかった。'],
    draw: () =>
      stage('#1f2433', '#5b6b8c', { x: 50, y: 40 }) + floor(860, '#2b3040') +
      chartDown(420, 330, 0.9) +
      taxi(980, 640, 1.0) + cross(980, 560, 1.0) +
      riceBox(1500, 640, 0.95) + cross(1500, 600, 1.0) +
      boss({ x: 300, y: 1020, s: 1.05, expr: 'worry', pose: 'shrug', sweat: true, look: [1, 0] }),
  },
  {
    narration: ['そんなとき、工場で機械を直していた若い社員が、ひまつぶしに作った「のびる手」のおもちゃ。', 'これを社長が見つけて商品にしたら、大ヒットした。'],
    draw: () =>
      stage('#1d3a3a', '#7fc0b0', { x: 40, y: 40 }) + floor(860, '#2d4a48') +
      gear(1650, 220, 110) + gear(1820, 340, 80, '#7d7a77') +
      worker({ x: 420, y: 1000, s: 1.1, expr: 'smile', pose: 'hold', look: [1, 0] }) +
      extendHand(470, 860, 1.1, 6) +
      boss({ x: 1500, y: 1010, s: 1.05, expr: 'wow', pose: 'idle', look: [-1, 0], flip: true }) +
      bulb(1500, 400, 0.9) + burst(1500, 600, 230, 280, 12, K.white, 9) +
      tag('大ヒット！', 960, 160, { size: 80, fill: K.yellow, rot: -4 }),
  },
  {
    narration: ['その社員の考え方が「枯れた技術の水平思考」。', '最新の技術じゃなく、安くなったありふれた技術を、新しい遊びに使うこと。'],
    draw: () =>
      stage('#222b1d', '#9cbf6a', { x: 50, y: 35 }) + rays(960, 520, '#ffffff', 16, 0.05) +
      title('枯れた技術の', 960, 210, { size: 110, color: K.white }) + title('水平思考', 960, 360, { size: 130, color: K.yellow }) +
      calculator(520, 720, 0.95) + bulb(800, 720, 0.7, false) +
      `<path d="M960,700 L1180,700" stroke="${K.ink}" stroke-width="30" stroke-linecap="round"/>
       <path d="M960,700 L1180,700" stroke="${K.white}" stroke-width="16" stroke-linecap="round"/>
       <path d="M1170,650 L1240,700 L1170,750Z" fill="${K.white}" stroke="${K.ink}" stroke-width="7" stroke-linejoin="round"/>` +
      handheld(1500, 720, 0.85) +
      label('ふつうの部品', 660, 960, { size: 50, color: K.white }) + label('新しい遊び', 1500, 960, { size: 50, color: K.yellow }),
  },
  {
    narration: ['たとえば、電卓の部品を使った携帯ゲーム機が大ヒット。', 'この流れが、のちの家庭用ゲーム機につながっていく。'],
    draw: () =>
      stage('#14213d', '#4f7fd0', { x: 50, y: 45 }) + floor(880, '#1b2a4a') +
      calculator(300, 560, 0.8) +
      `<path d="M440,560 L560,560" stroke="${K.white}" stroke-width="14" stroke-linecap="round"/><path d="M550,525 L600,560 L550,595Z" fill="${K.white}"/>` +
      handheld(820, 560, 0.75) +
      `<path d="M1020,560 L1140,560" stroke="${K.white}" stroke-width="14" stroke-linecap="round"/><path d="M1130,525 L1180,560 L1130,595Z" fill="${K.white}"/>` +
      tvConsole(1500, 720, 0.95) +
      tag('電卓', 300, 330, { size: 52 }) + tag('携帯ゲーム機', 820, 380, { size: 52 }) + tag('家庭用ゲーム機', 1460, 230, { size: 52, fill: K.yellow }),
  },
  {
    narration: ['任天堂が強いのは、すごい性能よりも「おもしろい遊び方」で勝負してきたから。', 'あなたが最初に遊んだゲーム、何だった？'],
    draw: () =>
      stage('#2a1414', '#e08a3a', { x: 50, y: 40 }) + rays(960, 420, '#ffe2a8', 18, 0.09) + floor(870, '#3a2418') +
      card(330, 360, 0.9, -18, 0) + extendHand(170, 640, 0.6, 4) + handheld(1600, 360, 0.6) + card(1640, 640, 0.8, 14, 1) +
      narrator({ x: 960, y: 1020, s: 1.4, expr: 'talk', pose: 'cheer' }) +
      title('性能より「遊び方」', 960, 190, { size: 110, color: K.yellow }),
  },
];
