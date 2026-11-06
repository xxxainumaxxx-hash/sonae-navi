// SVG/HTML を 1920x1080 の PNG にする（Playwright）
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

export async function openShooter(root, workDir, { w = 1920, h = 1080, css = '' } = {}) {
  const { chromium } = require('playwright');
  const fontCss = ['@fontsource/yomogi/japanese-400.css', '@fontsource/yomogi/latin-400.css',
    '@fontsource/zen-maru-gothic/japanese-700.css', '@fontsource/zen-maru-gothic/latin-700.css',
    '@fontsource/zen-maru-gothic/japanese-900.css', '@fontsource/zen-maru-gothic/latin-900.css',
    '@fontsource/dela-gothic-one/japanese-400.css', '@fontsource/dela-gothic-one/latin-400.css']
    .map((p) => `<link rel="stylesheet" href="${pathToFileURL(path.join(root, 'node_modules', p))}">`).join('');
  fs.mkdirSync(workDir, { recursive: true });
  const shell = path.join(workDir, '_shell.html');
  fs.writeFileSync(shell, `<!doctype html><meta charset="utf-8">${fontCss}
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:transparent}
.sub{position:absolute;left:0;right:0;bottom:46px;text-align:center}
.sub span{font-family:'Zen Maru Gothic';font-weight:700;font-size:54px;line-height:1.35;color:#fff;
 -webkit-text-stroke:14px #2b2622;paint-order:stroke fill;display:inline-block;max-width:1640px}${css}</style>
<body><div id="root"></div>`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(pathToFileURL(shell).href);
  async function shot(html, file, transparent = false) {
    await page.evaluate((h) => { document.getElementById('root').innerHTML = h; }, html);
    await page.evaluate(async () => {
      const txt = document.body.innerText + [...document.querySelectorAll('text')].map((t) => t.textContent).join('');
      await Promise.all(['400 10px Yomogi', "700 10px 'Zen Maru Gothic'", "900 10px 'Zen Maru Gothic'", "400 10px 'Dela Gothic One'"]
        .map((f) => document.fonts.load(f, txt || 'あ')));
      await document.fonts.ready;
    });
    await page.screenshot({ path: file, omitBackground: transparent });
  }
  return { shot, close: () => browser.close() };
}

export const svgDoc = (inner, w = 1920, h = 1080) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
