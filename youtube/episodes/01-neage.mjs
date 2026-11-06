// 第1話（試作）：5さいでもわかる「なんで値上げするの？」
// narration：ElevenLabs に読ませる文。配列の1要素＝字幕1枚。
// draw()：その場面の絵（コードで描く）
import { C, text, arrow, bigUp, line, ellipse, rect } from '../lib/crayon.mjs';
import {
  sonae, onigiri, priceTag, riceBag, nori, coin, truck, factory, bolt, gasCan,
  wheat, oilBottle, shelf, loopArrow, question, sparkles,
} from '../lib/props.mjs';

export const meta = {
  id: '01-neage',
  title: '5歳でもわかる「なんで値上げするの？」',
  description: 'おにぎりが100円から150円になった理由を、クレヨンの絵でやさしく解説。値上げ対策にもなる「ローリングストック」も紹介。',
};

export const scenes = [
  {
    narration: [
      'さいきん、なんでもかんでも値上げしてるよね。',
      'きょうは、どうして値上げが起きるのか、5さいでもわかるように説明するよ。',
    ],
    draw: () =>
      text('5さいでもわかる', 960, 190, { size: 84, color: C.dark }) +
      text('なんで「ねあげ」するの？', 960, 330, { size: 120, color: C.red, font: 'Zen Maru Gothic', weight: 900 }) +
      sonae({ x: 620, y: 960, s: 1.25, expr: 'think', pose: 'none' }) +
      question(830, 560, 1.1) +
      onigiri(1260, 690, 1.5) + priceTag(1290, 900, '¥150', { color: C.yellow }) +
      bigUp(1520, 620, 1.1),
  },
  {
    narration: [
      'まえは100円だったおにぎり。',
      'いまは150円。おなじおにぎりなのに、なんで高くなったんだろう？',
    ],
    draw: () =>
      onigiri(520, 520, 1.9) + priceTag(540, 800, '100円') +
      text('まえ', 520, 220, { size: 80 }) +
      arrow(830, 540, 1080, 540, { w: 12, head: 50 }) +
      onigiri(1390, 520, 1.9) + priceTag(1410, 800, '150円', { color: C.yellow }) +
      text('いま', 1390, 220, { size: 80, color: C.red }) +
      bigUp(1680, 470, 0.8) +
      sonae({ x: 960, y: 880, s: 0.7, expr: 'wow', pose: 'none' }),
  },
  {
    narration: [
      'りゆう その1。おにぎりの「ざいりょう」が高くなったから。',
      'お米や、のりの値段が上がると、お店も高く売るしかないんだ。',
    ],
    draw: () =>
      text('りゆう① ざいりょうが高い', 960, 170, { size: 96, color: C.dark, font: 'Zen Maru Gothic', weight: 900 }) +
      riceBag(560, 560, 1.4) + bigUp(780, 470, 0.7) +
      nori(1060, 560, 1.2) + bigUp(1220, 470, 0.7) +
      sonae({ x: 1560, y: 1000, s: 1.1, expr: 'smile', pose: 'point', flip: true }),
  },
  {
    narration: [
      'りゆう その2は「円安」。',
      '日本は、小麦やあぶらを、外国からたくさん買っているよ。',
      '円の力が弱くなると、おなじものを買うのに、もっとたくさんの円が必要になるんだ。',
    ],
    draw: () => {
      let s = text('りゆう② 「えんやす」', 960, 160, { size: 96, color: C.dark, font: 'Zen Maru Gothic', weight: 900 });
      s += wheat(250, 520, 1.1) + oilBottle(410, 530, 1.1);
      // まえ：1ドル＝コイン3まい
      s += text('まえ', 640, 345, { size: 56 });
      s += coin(780, 330, 62, '$', C.green) + text('＝', 900, 350, { size: 72 });
      for (let i = 0; i < 3; i++) s += coin(1010 + i * 105, 330, 46, '¥');
      // いま：1ドル＝コイン5まい
      s += text('いま', 640, 600, { size: 56, color: C.red });
      s += coin(780, 585, 62, '$', C.green) + text('＝', 900, 605, { size: 72 });
      for (let i = 0; i < 5; i++) s += coin(1010 + i * 105, 585, 46, '¥');
      s += text('おなじ1ドルなのに、円がたくさんいる！', 900, 790, { size: 62, color: C.red });
      s += sonae({ x: 1720, y: 940, s: 0.8, expr: 'wow', pose: 'none' });
      return s;
    },
  },
  {
    narration: [
      'りゆう その3。工場をうごかす電気代や、トラックではこぶガソリン代も上がったよ。',
    ],
    draw: () =>
      text('りゆう③ でんき・はこぶお金', 960, 160, { size: 96, color: C.dark, font: 'Zen Maru Gothic', weight: 900 }) +
      factory(430, 620, 1.3) + bolt(720, 470, 1.0) +
      truck(1200, 640, 1.3) + gasCan(1590, 600, 1.1) +
      bigUp(860, 400, 0.6) + bigUp(1740, 400, 0.6),
  },
  {
    narration: [
      'ざいりょう、円安、電気とガソリン。',
      'ぜんぶが合わさって、おにぎりは150円になったんだ。',
    ],
    draw: () => {
      let s = '';
      const blocks = [['ざいりょう', C.green], ['えんやす', C.blue], ['でんき・ガソリン', C.yellow]];
      blocks.forEach(([label, col], i) => {
        const y = 760 - i * 170;
        s += rect(300, y, 560, 150, { fill: col });
        s += text(label, 580, y + 100, { size: 64, color: col === C.yellow ? C.ink : C.white, font: 'Zen Maru Gothic', weight: 700 });
      });
      s += text('＋', 230, 700, { size: 90 }) + text('＋', 230, 530, { size: 90 });
      s += arrow(920, 600, 1140, 600, { w: 12, head: 50 });
      s += onigiri(1430, 520, 2.0) + priceTag(1450, 820, '150円', { color: C.yellow, size: 72, w: 260 });
      s += text('こういうこと！', 960, 160, { size: 96, color: C.red, font: 'Zen Maru Gothic', weight: 900 });
      return s;
    },
  },
  {
    narration: [
      'だから、ふだん使うものを少し多めに買っておいて、使ったぶんだけ買いたす。',
      'これを「ローリングストック」っていうよ。',
      '値上げのまえに買えるし、地震のときの備えにもなるんだ。',
    ],
    draw: () =>
      text('ローリングストック', 960, 170, { size: 110, color: C.green, font: 'Zen Maru Gothic', weight: 900 }) +
      shelf(700, 610, 0.95) + loopArrow(700, 610, 350) +
      text('かう → つかう → かいたす', 1430, 380, { size: 58 }) +
      sonae({ x: 1530, y: 1010, s: 1.2, expr: 'wink', pose: 'point', flip: true }) +
      sparkles(1640, 600, 40),
  },
  {
    narration: [
      'くわしくは「備えナビ」にまとめているよ。',
      'チャンネル登録して、また見てね。ばいばーい！',
    ],
    draw: () =>
      text('くわしくは「備えナビ」で', 960, 220, { size: 96, color: C.dark, font: 'Zen Maru Gothic', weight: 900 }) +
      sonae({ x: 960, y: 1000, s: 1.45, expr: 'smile', pose: 'wave' }) +
      rect(1290, 470, 420, 120, { fill: C.red }) +
      text('チャンネル登録', 1500, 553, { size: 58, color: C.white, font: 'Zen Maru Gothic', weight: 700 }),
  },
];
