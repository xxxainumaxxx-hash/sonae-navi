// ヤマハは、壊れたオルガン1台から始まった：台本 scripts/long-06-yamaha.md（声とチェック用。絵はあとで足す）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const md = fs.readFileSync(path.join(HERE, '../scripts/long-06-yamaha.md'), 'utf8');
const body = md.split('## 台本')[1].split('## ショートの')[0];

export const meta = { id: '10-yamaha', title: 'ヤマハは、壊れたオルガン1台から始まった', theme: 'crayon' };

export const scenes = [];
for (const block of body.split(/^(?=## 第|### 【)/m)) {
  const ch = block.match(/^## (第\d章)\s+(.+)$/m);
  if (ch) { scenes.push({ chapter: ch[1], title: ch[2].trim(), narration: [], silent: 2.4, draw: () => '' }); continue; }
  const sc = block.match(/^### 【(\d+)】(.+?)（/m);
  if (!sc) continue;
  const lines = block.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim());
  scenes.push({ key: sc[1], name: sc[2], narration: lines, draw: () => '' });
}
