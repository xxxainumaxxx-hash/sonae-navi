// 任天堂（本番）：台本 scripts/long-01-nintendo.md の全13場面＋章タイトル4枚
// 声 → チェック → 映像、の順で作る。いまは声とチェック用（映像の draw は場面ごとに足していく）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SHOTS, chapterCard } from './07-shots.mjs';
import { shots } from '../lib/shots.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const md = fs.readFileSync(path.join(HERE, '../scripts/long-01-nintendo.md'), 'utf8');
const body = md.split('## 台本')[1].split('## ショートの')[0];

export const meta = { id: '07-nintendo', title: '任天堂は、なぜ生き残れたのか', theme: 'crayon' };

// 台本の並びどおりに、章タイトル（声なし）と場面を並べる
export const scenes = [];
for (const block of body.split(/^(?=## 第|### 【)/m)) {
  const ch = block.match(/^## (第\d章)\s+(.+)$/m);
  if (ch) { scenes.push({ chapter: ch[1], title: ch[2].trim(), narration: [], silent: 2.4, draw: chapterCard(ch[1], ch[2].trim()) }); continue; }
  const sc = block.match(/^### 【(\d+)】(.+?)（/m);
  if (!sc) continue;
  const lines = block.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim());
  const no = String(scenes.length + 1).padStart(2, '0'); // 声ファイルの番号（章タイトル込みの通し番号）
  const sh = SHOTS[no];
  scenes.push({ key: sc[1], name: sc[2], narration: lines, draw: typeof sh === 'function' ? sh : (t, c) => shots(t, c, sh) });
}
