import { SITE, LINKS } from "./config.mjs";
import { CSS } from "./theme.mjs";

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ヘッダーに出す主要導線
const NAV = [
  { href: "/bichiku/", label: "備蓄" },
  { href: "/kaji/", label: "火事" },
  { href: "/suigai/", label: "水害" },
  { href: "/shindan/", label: "診断" },
];

const FOOT_NAV = [
  { href: "/", label: "トップ" },
  { href: "/shindan/", label: "30秒診断" },
  { href: "/bichiku/", label: "備蓄する" },
  { href: "/kaji/", label: "火事に備える" },
  { href: "/suigai/", label: "水害に備える" },
  { href: "/jishin/", label: "地震に備える" },
  { href: "/teiden/", label: "停電に備える" },
  { href: "/bouhan/", label: "防犯に備える" },
  { href: "/neage/", label: "値上げに備える" },
  { href: "/okane/", label: "お金を備える" },
];

/**
 * ページ全体のHTMLシェル。
 * SEOのため title / description / canonical / OGP / 構造化データを個別に持たせる。
 */
export function page({
  path,            // "/kaji/" のような絶対パス
  title,           // <title>（サイト名は自動で付与）
  description,
  body,            // 本文HTML
  crumb = [],      // [{href,label}] パンくず（最終要素は現在地としてリンクなし）
  script = "",     // ページ固有のJS
  schema = null,   // JSON-LD（オブジェクト）
  bareTitle = false,
}) {
  const url = SITE.origin + path;
  const fullTitle = bareTitle ? title : `${title}｜${SITE.name}`;

  const crumbHTML = crumb.length
    ? `<nav class="crumb">${crumb
        .map((c, i) =>
          i === crumb.length - 1
            ? `<span aria-current="page" style="margin:0;color:var(--faint)">${esc(c.label)}</span>`
            : `<a href="${c.href}">${esc(c.label)}</a><span>›</span>`
        )
        .join("")}</nav>`
    : "";

  const crumbSchema = crumb.length > 1 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumb.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: SITE.origin + (c.href || path),
    })),
  } : null;

  const ld = [schema, crumbSchema].filter(Boolean)
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0E2A47" media="(prefers-color-scheme:light)">
<meta name="theme-color" content="#0A1420" media="(prefers-color-scheme:dark)">
<meta property="og:type" content="${path === "/" ? "website" : "article"}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${ld}
<style>${CSS}</style>
</head>
<body>
<header class="hd">
  <div class="hd-in">
    <a class="hd-brand" href="/">
      <span class="hd-mark">備えナビ</span>
      <span class="hd-sub">by 備えニキ</span>
    </a>
    <nav class="hd-nav">
      ${NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join("")}
    </nav>
  </div>
</header>
${crumbHTML}
<main>
${body}
</main>
<footer class="ft">
  <div class="ft-in">
    <div class="ft-mark">備えナビ</div>
    <p class="ft-d">${esc(SITE.description)}</p>
    <nav class="ft-nav">
      ${FOOT_NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join("")}
    </nav>
    <div class="ft-sns">
      <a href="${LINKS.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>
      <a href="${LINKS.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
    </div>
    <p class="ft-fine">
      本サイトの情報は一般的な防災の目安であり、個別の状況を保証するものではありません。
      避難の判断は必ず自治体の発表とハザードマップに従ってください。<br>
      当サイトはAmazonアソシエイト・楽天ROOMのアフィリエイトプログラムを利用しています。<br>
      © ${new Date().getFullYear()} 備えニキ
    </p>
  </div>
</footer>
${script ? `<script>${script}</script>` : ""}
</body>
</html>`;
}
