import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "./src/config.mjs";
import { renderHome, renderShindan, renderCategory } from "./src/render.mjs";
import { CATS, CAT_IDS } from "./src/content/index.mjs";

const OUT = "public";

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const write = (path, content) => {
  const dir = join(OUT, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), content);
};

// ── ページ生成
write(".", renderHome());
write("shindan", renderShindan());
for (const id of CAT_IDS) write(id, renderCategory(CATS[id]));

// ── sitemap.xml
const urls = [
  { loc: "/", pri: "1.0" },
  { loc: "/shindan/", pri: "0.9" },
  ...CAT_IDS.map((id) => ({
    loc: `/${id}/`,
    pri: ["bichiku", "kaji", "suigai"].includes(id) ? "0.9" : "0.7",
  })),
];
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE.origin}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.pri}</priority></url>`
  )
  .join("\n")}
</urlset>
`
);

// ── robots.txt
writeFileSync(
  join(OUT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`
);

// ── favicon（明朝の「備」を白抜き、ネイビー地）
writeFileSync(
  join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="13" fill="#0E2A47"/>
<text x="32" y="45" font-size="40" text-anchor="middle" fill="#fff"
  font-family="Hiragino Mincho ProN, Yu Mincho, serif">備</text>
</svg>
`
);

console.log(`✓ built ${urls.length} pages → ${OUT}/`);
for (const u of urls) console.log(`  ${u.loc}`);
