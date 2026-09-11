import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {CATS,CAT_IDS} from './content/index.mjs';
import {renderDisaster,renderBichiku,renderShindan,renderDisclaimer} from './render.mjs';
const BASE='/design-preview/';
const NAVI=BASE+'navi/';
const style=`
${readFileSync('assets/legal-disclosure.css','utf8')}

.stepnav a[aria-current="location"],.bnav a[aria-current="location"]{background:#25282c;color:#fff;border-bottom-color:#25282c}.stepnav a[aria-current="location"] em,.bnav a[aria-current="location"] i{color:#fff}.steph{scroll-margin-top:calc(var(--step-nav-height,76px) + 16px)}

.calc,.stepnav{top:0}.bnav{top:var(--calc-height,60px)}.bcat{scroll-margin-top:calc(var(--calc-height,60px) + var(--category-nav-height,45px) + 16px)}

.hp-footer .foot-top a.brand{font-size:25px;text-decoration:none}.hp-footer .foot-top a.brand:hover{opacity:.75}@media(max-width:760px){.hp-footer .foot-top a.brand{font-size:20px}}

.stock-product-link{color:var(--ink);text-decoration:underline;text-decoration-color:#b6bbc0;text-underline-offset:4px;line-height:1.8}.stock-product-link:hover{text-decoration-color:currentColor}.stock-product-link:focus-visible{outline:2px solid #596e80;outline-offset:4px}.stock-product-link span{font-size:12px}.grow-m{width:100%}

:root[data-theme="light"]{--navy:#25282c;--navy-deep:#202124;--navy-soft:#4b5157;--ink:#202124;--muted:#61666c;--faint:#6d737a;--bg:#fafafa;--surface:#f0f1f2;--surface-2:#e9ebed;--line:#d8dce0;--line-soft:#e4e6e8;--accent:#545d66;--accent-bg:#edf0f2;--mincho:var(--gothic);--wrap:820px;--shadow:none}
.hero h1{font-weight:800}.cta,.tile{border-radius:4px}
.hp-header{background:#fff;border-bottom:1px solid #dedfe1}.hp-header .nav{max-width:1280px;margin:auto;padding:23px 40px;display:flex;align-items:center;justify-content:space-between;gap:25px}.hp-header a{text-decoration:none;color:#202124}.hp-header .brand,.hp-footer .brand{font-size:25px;font-weight:900;letter-spacing:.09em;line-height:1.4}.hp-header .brand small,.hp-footer .brand small{font-size:9px;letter-spacing:.16em;display:block;color:#70747a;margin-top:4px}.hp-header .links{display:flex;gap:28px;font-size:12px;align-items:center}.hp-header .contact{padding:10px 18px;background:#242629;color:white;border:1px solid #242629;white-space:nowrap}
.hp-footer{background:#e9ebed;color:#555b61;border-top:1px solid #d9dde0;padding:45px 40px}.hp-footer .footer-in{max-width:1120px;margin:auto}.hp-footer .foot-top{display:flex;justify-content:space-between;align-items:center;gap:25px;margin-bottom:30px}.hp-footer .foot-top a{font-size:12px;color:inherit}.hp-footer p{font-size:10px;line-height:1.9;max-width:850px}.hp-footer small{font-size:9px;display:block;margin-top:25px;letter-spacing:.1em}
@media(max-width:760px){.hp-header .nav{padding:18px 22px}.hp-header .brand{font-size:22px;white-space:nowrap}.hp-header .links{gap:16px;font-size:11px}.hp-header .links a:nth-child(-n+3){display:none}.hp-header .contact{padding:9px 11px}.hp-footer{padding:35px 24px}.hp-footer .foot-top{align-items:start}.hp-footer .brand{font-size:20px}}
`;
function integrate(html,header,footer){
  // Keep article links and dynamically rendered diagnosis results inside this HP.
  for(const id of [...CAT_IDS,'shindan','disclaimer']) html=html.replaceAll('/'+id+'/',NAVI+id+'/');
  html=html.replaceAll('href="/"','href="'+BASE+'"');
  html=html.replace('<html lang="ja">','<html lang="ja" data-theme="light">')
    .replace('</head>',`<meta name="robots" content="noindex,nofollow"><style>${style}</style></head>`)
    .replace(/<header class="hd">[\s\S]*?<\/header>/,header)
    .replace(/<nav class="crumb">[\s\S]*?<\/nav>/,'')
    .replace(/<footer class="ft">[\s\S]*?<\/footer>/,html.includes('<h1>免責事項</h1>') ? footer.replace(/<details class="legal-disclosure">[\s\S]*?<\/details>/,'') : footer)
    .replace('</body>',`<script src="/assets/step-navigation.js" defer></script><script>(function(){
      var calc=document.querySelector('.calc'),nav=document.querySelector('.bnav');
      if(!calc)return;
      function sync(){document.documentElement.style.setProperty('--calc-height',calc.getBoundingClientRect().height+'px');if(nav)document.documentElement.style.setProperty('--category-nav-height',nav.getBoundingClientRect().height+'px');}
      sync();var observer=new ResizeObserver(sync);observer.observe(calc);if(nav)observer.observe(nav);
    })();</script></body>`)
    .replace('</title>','｜備えニキHP</title>');
  return html;
}
export function buildIntegratedNavi(homeHTML){
  // Reuse the actual HP shell; articles have no independent site navigation.
  const header=homeHTML.match(/<header>[\s\S]*?<\/header>/)[0].replace('<header>','<header class="hp-header">').replaceAll('href="#','href="'+BASE+'#');
  const footer=homeHTML.match(/<footer>[\s\S]*?<\/footer>/)[0].replace('<footer>','<footer class="hp-footer">');
  const write=(id,html)=>{const dir='public'+NAVI+id;mkdirSync(dir,{recursive:true});writeFileSync(dir+'/index.html',integrate(html,header,footer));};
  // Retire the separate guide homepage while retaining old preview bookmarks.
  mkdirSync('public'+NAVI,{recursive:true});
  writeFileSync('public'+NAVI+'index.html',`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${BASE}#navi"><title>備えニキ</title></head><body><a href="${BASE}#navi">備えニキの防災ガイドへ</a></body></html>`);
  for(const id of CAT_IDS) write(id,CATS[id].isBichiku?renderBichiku(CATS[id]):renderDisaster(CATS[id]));
  write('shindan',renderShindan());write('disclaimer',renderDisclaimer());
}
