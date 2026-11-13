// ショート15：サンリオの小さな白い猫には、口がない（縦・ループ）
// 最後「世界中で愛される理由は、描かなかったところにある。」→ 最初「サンリオの小さな白い猫には、口がない。」
import { popS, xf, enter, blinking } from '../lib/anim.mjs';
import { bubble, rainCloud } from '../lib/cprops.mjs';
import { whiteCat, heart } from '../lib/cprops5.mjs';
import { worldMap } from '../lib/cprops3.mjs';
import { shots } from '../lib/shots.mjs';
import { RED, INK, P, vmid, cam, T, catCorner, fill, glow, ellipse, line, C } from './short-kit.mjs';
import { girl, girl2, PINK, YEL } from './short-sanrio.mjs';

export const meta = { id: 's15-sanrio-mouth', format: 'short', title: 'サンリオの白い猫には、口がない', telop: 'サンリオの白い猫には<br>口がない', theme: 'crayon' };

const hero = (tl, d, t) => cam(fill('#fde8ee') + glow(540, 950, 500, '#fff', 0.4) + whiteCat(540, 1130, 1.5, t), tl, d, { z0: 1.0, z1: 1.05 });

const LIST = [
  // 0 サンリオの小さな白い猫には、口がない。
  (tl, d, t) => cam(fill('#fde8ee') + glow(540, 950, 500, '#fff', 0.4) + whiteCat(540, 1130, 1.5, t) + xf(T('口がない？', 540, 640, 100, PINK, C.white), { s: popS(tl, 0.3), cx: 540, cy: 600 }), tl, d, { z0: 1.0, z1: 1.05 }),
  // 1 見る人がうれしいときは、うれしそうに。かなしいときは、そっと寄りそうように見える。
  [
    (tl, d, t) => cam(fill('#fff2c8') + glow(540, 900, 500, YEL, 0.35) + girl({ x: 330, y: 1500, s: 1.8, blink: blinking(t, 1), expr: 'smile', arms: P.cheer }) + whiteCat(800, 1250, 0.9, t) + heart(800, 760, 0.8), tl, d, { z0: 1.0, z1: 1.04 }),
    (tl, d, t) => cam(fill('#3a4a6a') + rainCloud(540, 640, t, 1.0) + girl2({ x: 330, y: 1500, s: 1.8, blink: blinking(t, 1), expr: 'worry' }) + whiteCat(780, 1250, 0.9, t), tl, d, { z0: 1.0, z1: 1.04 }),
  ],
  // 2 見る人の気持ちを、そのまま映せるようにした、と言われている。
  (tl, d) => cam(fill('#e2e6ee') + ellipse(540, 950, 300, 340, { fill: '#cfe0e8', w: 10 }) + line([[360, 760], [430, 690]], { w: 10, color: '#ffffff', passes: 1 }) + heart(540, 950, 1.3) + T('気持ちを映す', 540, 640, 90, INK, C.white), tl, d, { z0: 1.0, z1: 1.04 }),
  // 3 笑った顔に固定しないからこそ、どんな気持ちのときにも寄りそえる。
  (tl, d, t) => cam(fill('#fde8ee') + whiteCat(540, 1150, 1.0, t) + girl({ x: 200, y: 1450, s: 1.4, blink: blinking(t, 1), expr: 'smile' }) + girl2({ x: 880, y: 1450, s: 1.4, blink: blinking(t, 2), expr: 'worry' }), tl, d, { z0: 1.0, z1: 1.04 }),
  // 4 言葉がいらない顔だからこそ、どの国の人にも届いたのだ。
  (tl, d, t) => cam(fill('#fbf3e6') + whiteCat(540, 1260, 1.0, t) + ['Hello', 'Bonjour', 'Hola', '你好'].map((w, i) => enter(bubble(w, [260, 820, 260, 820][i], [620, 620, 900, 900][i], { size: 56 }), tl, 0.2 + i * 0.3, { cx: [260, 820, 260, 820][i], cy: [620, 620, 900, 900][i] })).join(''), tl, d, { z0: 1.0, z1: 1.04 }),
  // 5 あなたには、どんな顔に見える？
  (tl, d) => cam(fill(PINK) + glow(540, 860, 600, '#fff', 0.2) + T('あなたには', 540, 700, 100, C.white, INK) + T('どんな顔に見える？', 540, 850, 86, YEL, INK) + enter(bubble('コメントで教えて', 540, 1080, { size: 66 }), tl, 0.3, { cx: 540, cy: 1080 }), tl, d, { z0: 1.0, z1: 1.06 }),
  // 6 世界中で愛される理由は、描かなかったところにある。（→ 1行目へ）
  hero,
];

export const scenes = [{
  narration: [
    'サンリオの小さな白い猫には、口がない。',
    '見る人がうれしいときは、うれしそうに。かなしいときは、そっと寄りそうように見える。',
    '見る人の気持ちを、そのまま映せるようにした、と言われている。',
    '笑った顔に固定しないからこそ、どんな気持ちのときにも寄りそえる。',
    '言葉がいらない顔だからこそ、どの国の人にも届いたのだ。',
    'あなたには、どんな顔に見える？',
    '世界中で愛される理由は、描かなかったところにある。',
  ],
  draw: (t, c) => shots(t, c, LIST) + catCorner(t, '', c, 5),
}];
