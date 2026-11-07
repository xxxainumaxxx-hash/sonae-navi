// 概要欄の目次（チャプター）を作る：node chapters.mjs 05-nintendo-10min scripts/long-01-nintendo.md
// 声（voice/<id>/01.mp3…）があればその長さ、無ければ文字数から計算（animate.mjs と同じ計算）
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const [id, mdPath] = process.argv.slice(2);
const md = fs.readFileSync(path.join(ROOT, mdPath), 'utf8');
const body = md.split('## 台本')[1].split('## ショートの')[0];
const heads = [...body.matchAll(/^### 【\d+】(.+?)（/gm)].map((m) => m[1]);
const blocks = body.split(/^### 【\d+】.*$/m).slice(1).map((b) => b.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim()));
const LEAD = 0.35, TAIL = 0.6, CPS = 7.5;
let t = 0;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
blocks.forEach((lines, i) => {
  console.log(`${fmt(t)} ${heads[i]}`);
  const v = path.join(ROOT, 'voice', id, `${String(i + 1).padStart(2, '0')}.mp3`);
  const speech = fs.existsSync(v)
    ? parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v]).toString())
    : lines.join('').length / CPS;
  t += LEAD + speech + TAIL;
});
console.error(`（合計 ${fmt(t)}${fs.existsSync(path.join(ROOT, 'voice', id, '01.mp3')) ? '' : '・声なしの推定'}）`);
