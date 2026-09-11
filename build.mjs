import {mkdirSync,writeFileSync,readFileSync,rmSync,readdirSync} from 'node:fs';
import {SITE} from './src/config.mjs';
import {CAT_IDS} from './src/content/index.mjs';
rmSync('public',{recursive:true,force:true});
// Build the one HP design, then publish its routes at the site root.
// The preview alias remains available for local design review.
await import('./design-preview.mjs');
const pages=[];
function copyPages(dir,relative=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const source=dir+'/'+entry.name;
    const next=relative+entry.name;
    if(entry.isDirectory()){copyPages(source,next+'/');continue;}
    if(entry.name!=='index.html')continue;
    const output='public/'+next;
    mkdirSync(output.slice(0,output.lastIndexOf('/')),{recursive:true});
    let html=readFileSync(source,'utf8').replaceAll('/design-preview/','/').replace(/<meta name="robots" content="noindex(?:,nofollow)?">/g,'').replace('HPデザインプレビュー','公式ホームページ');
    writeFileSync(output,html);
    if(relative!=='navi/')pages.push('/'+relative);
  }
}
copyPages('public/design-preview');
// Old article bookmarks lead to the corresponding article in the new HP.
for(const id of [...CAT_IDS,'shindan','disclaimer']){
  mkdirSync('public/'+id,{recursive:true});
  writeFileSync('public/'+id+'/index.html',`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/navi/${id}/"><title>備えニキ</title></head><body><a href="/navi/${id}/">記事へ進む</a></body></html>`);
}
const today=new Date().toISOString().slice(0,10);
writeFileSync('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(path=>`<url><loc>${SITE.origin}${path}</loc><lastmod>${today}</lastmod></url>`).join('')}</urlset>`);
writeFileSync('public/robots.txt',`User-agent: *\nDisallow: /design-preview/\nSitemap: ${SITE.origin}/sitemap.xml\n`);
writeFileSync('public/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#242629"/><text x="32" y="46" font-size="42" text-anchor="middle" fill="white">備</text></svg>');
console.log(`Built 備えニキHP: ${pages.length} pages`);
