// サムネイルを書き出す：node thumbnail.mjs 05-nintendo-10min → out/<id>/thumbnail.png（1280x720）
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { defs, paper, setTheme } from './lib/crayon.mjs';
import { openShooter, svgDoc } from './lib/shot.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
const ep = await import(pathToFileURL(path.join(ROOT, 'episodes', `${id}.mjs`)));
setTheme(ep.meta.theme || 'crayon');
const OUT = path.join(ROOT, 'out', id);
const { shot, close } = await openShooter(ROOT, path.join(OUT, '_thumb'));
const big = path.join(OUT, 'thumbnail_1920.png');
await shot(svgDoc(defs(0) + paper() + ep.thumbnail()), big);
await close();
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', big, '-vf', 'scale=1280:720', path.join(OUT, 'thumbnail.png')]);
console.log(path.join(OUT, 'thumbnail.png'));
