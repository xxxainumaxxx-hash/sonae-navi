import { SITE, LINKS, V, AFF_TAG, amz } from "./config.mjs";
import { page, esc } from "./layout.mjs";
import { ICONS, CSS_DISASTER, CSS_HOME } from "./theme.mjs";
import {
  h2, p, facts, note, steps, checklist, CHK_JS,
  items, videos, tiles, shops, disclaimer,
} from "./blocks.mjs";
import { CATS, CAT_IDS, DISASTERS, DISASTER_IDS, LIFE_IDS } from "./content/index.mjs";

// ── data-driven なブロック指定を HTML に変換
function blocks(list) {
  return list
    .map(([kind, arg]) => {
      switch (kind) {
        case "p": return p(arg);
        case "facts": return facts(arg);
        case "note": return note(...arg);
        case "steps": return steps(arg);
        default: throw new Error("unknown block: " + kind);
      }
    })
    .join("\n");
}

// ============================================================
// カテゴリページ
// ============================================================
export function renderCategory(cat) {
  const hasGroups = Array.isArray(cat.groups);

  const itemsHTML = hasGroups
    ? cat.groups
        .map(
          (g) =>
            `<h3 class="h3" style="margin-top:32px">${esc(g.name)}</h3>
             <p class="h2-note" style="margin-bottom:0">${esc(g.note)}</p>
             ${items(g.items, 0)}`
        )
        .join("")
    : items(cat.items, cat.itemsPri ?? 3);

  const body = `
<div class="wrap">
  <section class="hero">
    ${ICONS[cat.icon].replace("<svg", '<svg class="hero-icon"')}
    <div class="hero-eyebrow">${esc(cat.catch)}</div>
    <h1>${esc(cat.name)}</h1>
    <p class="hero-lead">${cat.lead.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>
  </section>

  ${cat.facts ? `<div class="sect-lead">${facts(cat.facts)}</div>` : ""}

  ${(cat.sections || [])
    .map(
      (s) => `<section class="sect">
      ${h2(s.h2, s.icon)}
      ${blocks(s.blocks)}
    </section>`
    )
    .join("")}

  ${cat.calculator ? calculator() : ""}

  <section class="sect">
    ${h2(cat.checkTitle, "check", esc(cat.checkNote))}
    ${checklist(cat.id, cat.checks)}
  </section>

  <section class="sect">
    ${h2(cat.itemsTitle || "揃えるものリスト", "list",
        esc(cat.itemsNote || "上から優先順に並んでいます。"))}
    ${itemsHTML}
    ${hasGroups ? "" : ""}
  </section>

  <section class="sect">
    ${videos(cat.videoEyebrow || cat.name + "の動画", cat.videos)}
  </section>

  <section class="sect">
    ${h2("迷ったらこれを揃える", "list", "備えニキが実際に選んだものをまとめています。")}
    ${shops()}
  </section>

  <section class="sect">
    ${h2("あわせて備える", "book")}
    ${tiles(CATS, cat.related)}
  </section>

  ${disclaimer()}
</div>`;

  return page({
    path: `/${cat.id}/`,
    title: cat.seoTitle,
    bareTitle: true,
    description: cat.seoDesc,
    body,
    crumb: [{ href: "/", label: "備えナビ" }, { label: cat.name }],
    script: CHK_JS + (cat.calculator ? CALC_JS : ""),
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: cat.seoTitle,
      description: cat.seoDesc,
      author: { "@type": "Person", name: SITE.author },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: SITE.origin + `/${cat.id}/`,
    },
  });
}

// ── 備蓄ページの人数計算機
function calculator() {
  return `
<section class="sect">
  ${h2("必要量を計算する", "check", "家族の人数と日数を入れてください。数字はその場で変わります。")}
  <div class="score-card">
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:22px">
      <label style="flex:1;min-width:130px">
        <span class="score-l" style="display:block;margin-bottom:7px">家族の人数</span>
        <input id="calc-p" type="number" min="1" max="12" value="4"
          style="width:100%;padding:13px 14px;font-size:17px;font-weight:700;border-radius:9px;
                 border:1px solid var(--line);background:var(--bg);color:var(--ink);font-family:inherit">
      </label>
      <label style="flex:1;min-width:130px">
        <span class="score-l" style="display:block;margin-bottom:7px">備える日数</span>
        <select id="calc-d"
          style="width:100%;padding:13px 14px;font-size:17px;font-weight:700;border-radius:9px;
                 border:1px solid var(--line);background:var(--bg);color:var(--ink);font-family:inherit">
          <option value="3">3日（最低限）</option>
          <option value="7" selected>7日（推奨）</option>
          <option value="14">14日（万全）</option>
        </select>
      </label>
    </div>
    <div class="facts" style="margin:0">
      <div class="fact"><div class="fact-n" id="calc-water">84<em>L</em></div><div class="fact-l">水（1人1日3L）</div></div>
      <div class="fact"><div class="fact-n" id="calc-meal">84<em>食</em></div><div class="fact-l">食料（1人1日3食）</div></div>
      <div class="fact"><div class="fact-n" id="calc-toilet">140<em>回</em></div><div class="fact-l">簡易トイレ（1人1日5回）</div></div>
      <div class="fact"><div class="fact-n" id="calc-gas">24<em>本</em></div><div class="fact-l">カセットボンベ（1人週6本）</div></div>
    </div>
  </div>
  ${note("2Lペットボトルに換算すると", "水84Lは<strong>2L×42本＝箱で約2ケース半</strong>です。想像より多いはずです。だからこそ一度に揃えず、買い物のたびに1箱ずつ足していくのが現実的です。")}
</section>`;
}

const CALC_JS = `
(function(){
  var pi=document.getElementById("calc-p"),di=document.getElementById("calc-d");
  if(!pi) return;
  function upd(){
    var pp=Math.max(1,Math.min(12,parseInt(pi.value)||1)),dd=parseInt(di.value);
    document.getElementById("calc-water").innerHTML=(pp*3*dd)+"<em>L</em>";
    document.getElementById("calc-meal").innerHTML=(pp*3*dd)+"<em>食</em>";
    document.getElementById("calc-toilet").innerHTML=(pp*5*dd)+"<em>回</em>";
    document.getElementById("calc-gas").innerHTML=Math.ceil(pp*6*dd/7)+"<em>本</em>";
  }
  pi.addEventListener("input",upd);di.addEventListener("change",upd);upd();
})();`;


// ============================================================
// 災害ページ（4ブロック構成）
//   ①脅威 → ②未然に防ぐ → ③起きたらどうする → ④備えるモノ
// ============================================================
export function renderDisaster(d) {
  const gearCount = d.gear.reduce((n, g) => n + g.items.length, 0);

  const acts = (list, warn) =>
    `<div class="acts${warn ? " warn" : ""}">${list
      .map(
        (a) => `<div class="act">
        <span class="act-i">${warn ? "!" : "\u2713"}</span>
        <div><div class="act-t">${esc(a.t)}</div><div class="act-d">${a.d}</div></div>
      </div>`
      )
      .join("")}</div>`;

  const gear = d.gear
    .map(
      (g) => `<div class="gearg">
      <div class="gearg-h">${esc(g.group)}<span>${g.items.length}点</span></div>
      <p class="gearg-n">${esc(g.note)}</p>
      ${g.items
        .map(
          (it) => `<div class="grow">
        <div class="grow-m">
          <div class="grow-n">${esc(it.name)}${it.pick ? '<span class="grow-p">まずこれ</span>' : ""}</div>
          <div class="grow-w">${esc(it.why)}</div>
        </div>
        <a class="grow-b" href="${amz(it.kw)}" target="_blank" rel="noopener sponsored noreferrer">Amazonで見る</a>
      </div>`
        )
        .join("")}
    </div>`
    )
    .join("");

  const body = `
<div class="wrap">
  <section class="hero" style="padding-bottom:0">
    ${ICONS[d.icon].replace("<svg", '<svg class="hero-icon"')}
    <div class="hero-eyebrow">${esc(d.catch)}</div>
    <h1>${esc(d.name)}</h1>
  </section>

  <div class="threat">
    <div class="threat-h">${esc(d.threat.headline)}</div>
    <div class="threat-b">${d.threat.body}</div>
  </div>
</div>

<nav class="stepnav"><div class="stepnav-in">
  <a href="#prevent"><em>STEP 1</em>防ぐ</a>
  <a href="#respond"><em>STEP 2</em>逃げる</a>
  <a href="#gear"><em>STEP 3</em>備える</a>
</div></nav>

<div class="wrap">
  <div class="steph" id="prevent">
    <span class="steph-n">1</span>
    <div><div class="steph-t">未然に防ぐ</div>
    <div class="steph-s">平時にやっておくこと。ここが一番、効果が大きい</div></div>
  </div>
  ${acts(d.prevent, false)}

  <div class="steph warn" id="respond">
    <span class="steph-n">2</span>
    <div><div class="steph-t">起きたらどうする</div>
    <div class="steph-s">その瞬間に迷わないために。先に読んでおく</div></div>
  </div>
  ${acts(d.respond, true)}

  <div class="steph buy" id="gear">
    <span class="steph-n">3</span>
    <div><div class="steph-t">備えるモノ</div>
    <div class="steph-s">${esc(d.name.replace("に備える", ""))}に関係する備えを${gearCount}点、目的別にまとめました</div></div>
  </div>
  ${gear}

  <section class="sect">
    ${videos(d.videoEyebrow || d.name + "の動画", d.videos)}
  </section>

  <section class="sect">
    ${h2("関連する備え", "book", "続けて読むと、備えの穴が埋まります。")}
    ${tiles(CATS, d.related)}
  </section>

  ${disclaimer()}
</div>`;

  return page({
    path: `/${d.id}/`,
    title: d.seoTitle,
    bareTitle: true,
    description: d.seoDesc,
    body,
    extraCSS: CSS_DISASTER,
    crumb: [{ href: "/", label: "備えナビ" }, { label: d.name }],
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: d.seoTitle,
      description: d.seoDesc,
      author: { "@type": "Person", name: SITE.author },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: SITE.origin + `/${d.id}/`,
    },
  });
}

// ============================================================
// トップページ
// ============================================================
export function renderHome() {
  // 決定した10災害。未着手のものは「準備中」として並べ、全体像を先に見せる
  const PLANNED = [
    { id: "kaji" }, { id: "jishin" }, { id: "suigai" },
    { name: "土砂災害に備える", short: "土砂災害", icon: "dosha", soon: true },
    { name: "台風・暴風に備える", short: "台風・暴風", icon: "taifu", soon: true },
    { name: "津波に備える", short: "津波", icon: "tsunami", soon: true },
    { id: "teiden" },
    { name: "熱中症に備える", short: "熱中症", icon: "necchusho", soon: true },
    { name: "大雪・寒波に備える", short: "大雪・寒波", icon: "ooyuki", soon: true },
    { name: "雷に備える", short: "雷", icon: "kaminari", soon: true },
  ];

  const dcards = PLANNED.map((x) => {
    if (x.soon) {
      return `<div class="dcard soon">${ICONS[x.icon]}
        <div class="dcard-n">${esc(x.short)}</div>
        <div class="dcard-c">準備中</div></div>`;
    }
    const c = CATS[x.id];
    return `<a class="dcard" href="/${c.id}/">${ICONS[c.icon]}
      <div class="dcard-n">${esc(c.short || c.name)}</div>
      <div class="dcard-c">${esc(c.catch)}</div></a>`;
  }).join("");

  const lcards = LIFE_IDS.map((id) => {
    const c = CATS[id];
    return `<a class="dcard" href="/${id}/">${ICONS[c.icon]}
      <div class="dcard-n">${esc(c.short || c.name.replace("に備える","").replace("を備える",""))}</div>
      <div class="dcard-c">${esc(c.catch)}</div></a>`;
  }).join("");

  const body = `
<section class="thero">
  <div class="thero-in">
    <div class="thero-eb">備えニキの防災まとめ</div>
    <h1>災害から家族を守る、<br>備えのすべて</h1>
    <p class="thero-l">
      チャンネルで扱ってきた防災の知識を、災害ごとに一つずつまとめました。
      どのページも「防ぐ・逃げる・備える」の順に読めば、
      何をすればいいかが最後まで分かるようになっています。
    </p>
    <div class="tsteps">
      <div class="tstep"><div class="tstep-n">STEP 1</div>
        <div class="tstep-t">防ぐ</div><div class="tstep-d">平時にできる対策</div></div>
      <div class="tstep"><div class="tstep-n">STEP 2</div>
        <div class="tstep-t">逃げる</div><div class="tstep-d">起きた瞬間の行動</div></div>
      <div class="tstep"><div class="tstep-n">STEP 3</div>
        <div class="tstep-t">備える</div><div class="tstep-d">揃えておくモノ</div></div>
    </div>
  </div>
</section>

<div class="wrap">
  <div class="thead">
    <div class="thead-t">災害から選ぶ</div>
    <p class="thead-d">気になる災害から読んでください。それぞれに「防ぐ・逃げる・備える」がまとまっています。</p>
  </div>
  <div class="dcards">${dcards}</div>

  <div class="thead">
    <div class="thead-t">暮らしを守る</div>
    <p class="thead-d">災害の種類を問わず効く備えと、日々の生活防衛。備蓄はすべての災害の土台です。</p>
  </div>
  <div class="dcards">${lcards}</div>

  <div class="thead">
    <div class="thead-t">30秒でわかる、あなたの家に必要な量</div>
    <p class="thead-d">家族の人数と住まいから、必要な備蓄の量と優先順位を計算します。登録不要です。</p>
  </div>
  <div style="margin-top:20px"><a class="cta" href="/shindan/">生存準備度を診断する →</a>
  <p class="cta-note">登録不要・個人情報の入力なし</p></div>

  <div class="thead">
    <div class="thead-t">迷ったらこれを揃える</div>
    <p class="thead-d">備えニキが実際に選んだものをまとめています。</p>
  </div>
  ${shops()}

  <section class="sect">
    ${videos("今見るべき1本", [V.bichiku50, V.saisho30, V.hinanjo, V.hyakkin])}
  </section>

  ${disclaimer()}
</div>`;

  return page({
    path: "/",
    title: `${SITE.name}｜${SITE.tagline}`,
    bareTitle: true,
    description: SITE.description,
    body,
    extraCSS: CSS_HOME,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.origin,
      description: SITE.description,
      author: { "@type": "Person", name: SITE.author },
    },
  });
}

// ============================================================
// 診断ページ
// ============================================================
export function renderShindan() {
  const body = `
<div class="wrap">
  <section class="hero" id="shindan-root" style="padding-top:36px">
    <div class="hero-eyebrow">30秒でわかる</div>
    <h1>あなたの家の<br>生存準備度診断</h1>
    <p class="hero-lead">
      6つの質問に答えると、家族構成と住まいに合わせた
      <strong>必要な備蓄の量</strong>と、優先して買うべきものが出ます。
      登録も個人情報の入力もありません。
    </p>
    <div style="margin-top:28px">
      <button class="cta" id="start">診断を始める →</button>
    </div>
  </section>
  <div id="app"></div>
  ${disclaimer()}
</div>`;

  return page({
    path: "/shindan/",
    title: "30秒 生存準備度診断",
    description:
      "6つの質問に答えるだけ。家族の人数と住まいから、あなたの家に必要な備蓄の量と優先順位を計算します。登録不要・個人情報の入力なし。",
    body,
    crumb: [{ href: "/", label: "備えナビ" }, { label: "30秒診断" }],
    script: SHINDAN_JS,
  });
}

const SHINDAN_JS = `
var AFF=${JSON.stringify(AFF_TAG)};
var amz=function(k){return "https://www.amazon.co.jp/s?k="+encodeURIComponent(k)+"&tag="+AFF};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};

var Q=[
 {id:"family",q:"家族は何人ですか",sub:"同居している人数（自分を含む）",
  opts:[{v:1,l:"1人"},{v:2,l:"2人"},{v:3,l:"3人"},{v:4,l:"4人"},{v:5,l:"5人以上"}]},
 {id:"home",q:"住まいはどれですか",sub:"災害時にとる行動が大きく変わります",
  opts:[{v:"mansion",l:"マンション（4階以上）"},{v:"house",l:"戸建て"},{v:"apart",l:"アパート・低層階"}]},
 {id:"kids",q:"小さなお子さんはいますか",sub:"",
  opts:[{v:"baby",l:"乳幼児がいる"},{v:"kid",l:"小学生以上"},{v:"none",l:"いない"}]},
 {id:"pet",q:"ペットはいますか",sub:"",
  opts:[{v:"yes",l:"犬・猫がいる"},{v:"no",l:"いない"}]},
 {id:"budget",q:"備えにかけられる予算は",sub:"無理のない範囲で構いません",
  opts:[{v:1,l:"〜1万円"},{v:3,l:"1〜3万円"},{v:5,l:"3〜5万円"},{v:99,l:"5万円以上"}]},
 {id:"stock",q:"今の備蓄はどのくらいですか",sub:"正直に答えるほど診断が正確になります",
  opts:[{v:"zero",l:"ほぼゼロ"},{v:"water",l:"水くらいはある"},{v:"some",l:"ある程度そろえている"}]}
];

var TYPES={
 mansion:{n:"垂直孤立型",
  d:"エレベーターが止まると、高層階は「陸の孤島」になります。水を上に運ぶ手段があるかどうかが、そのまま生活の質になります。",
  r:["エレベーター停止で、水を階段で上げるしかなくなる","断水と同時にトイレが使用不能になる","給水所からの往復は現実的に一日数回が限界"]},
 house:{n:"自宅籠城型",
  d:"在宅避難が基本になります。収納スペースはあるのに、備蓄量が追いついていない家がほとんどです。",
  r:["停電で冷蔵庫の中身が2日で全滅する","家族人数分の水は、想像の2倍以上必要になる","断水時のトイレ問題は戸建てでも変わらない"]},
 apart:{n:"即時避難型",
  d:"建物の被害で在宅避難ができない可能性があります。持ち出せる形の備えを最優先にしてください。",
  r:["建物が損傷して自宅に戻れなくなる可能性がある","持ち出し袋がないと避難所生活で苦しくなる","収納が少なく、備蓄が薄くなりがち"]}
};

function build(a){
  var pe=a.family, dy=(a.home==="apart")?3:7;
  var sc=(a.stock==="zero")?12:(a.stock==="water")?26:44;
  if(a.kids==="baby")sc-=6;
  if(a.pet==="yes")sc-=4;
  if(a.home==="mansion")sc-=4;
  sc=Math.max(8,sc);
  var it=[];
  it.push({n:"長期保存水",q:(pe*3*dy)+"L（"+pe+"人×3L×"+dy+"日）",w:"命に直結する。給水車は当てにできない",k:"保存水 2L 長期保存 5年 箱"});
  it.push({n:"簡易トイレ",q:(pe*5*dy)+"回分",w:"断水後3時間で必要になる。最も後悔される備え",k:"簡易トイレ 100回分 凝固剤"});
  it.push({n:"長期保存食",q:(pe*3*dy)+"食分",w:"火を使わずに食べられるものを中心に",k:"非常食 セット 長期保存"});
  if(a.kids==="baby")it.push({n:"液体ミルク・紙おむつ",q:dy+"日分",w:"支援物資では後回しにされる。親しか守れない",k:"液体ミルク 常温 防災"});
  if(a.pet==="yes")it.push({n:"ペットフード・ペットシーツ",q:dy+"日分",w:"避難所にペット用の備えは基本的にない",k:"ペット 防災 セット"});
  it.push({n:(a.budget>=3?"ポータブル電源":"大容量モバイルバッテリー"),q:"1台",w:"情報源であるスマホを死なせない",k:(a.budget>=3?"ポータブル電源 500Wh":"モバイルバッテリー 20000mAh")});
  it.push({n:"カセットコンロ＋ボンベ",q:"ボンベ"+Math.max(6,Math.ceil(pe*6*dy/7))+"本",w:"温かい食事と湯が確保できる",k:"カセットコンロ ボンベ セット"});
  if(a.home==="mansion")it.push({n:"ウォータータンク＋キャリーカート",q:"各1",w:"給水を階段で運ぶための唯一の手段",k:"ウォータータンク キャリーカート 防災"});
  if(a.home==="apart")it.push({n:"防災リュックセット",q:pe+"人分",w:"3分で家を出られる状態をつくる",k:"防災リュック セット"});
  it.push({n:"LEDランタン",q:"2個以上",w:"スマホのライトは3時間で終わる",k:"LEDランタン 電池式 防災"});
  var nc=(a.budget<=1)?3:(a.budget<=3)?5:(a.budget<=5)?7:it.length;
  return {sc:sc,it:it,nc:nc,t:TYPES[a.home],pe:pe,dy:dy};
}

var app=document.getElementById("app"),root=document.getElementById("shindan-root"),ans={};
document.getElementById("start").addEventListener("click",function(){ans={};root.style.display="none";q(0)});

function q(i){
  var d=Q[i];
  app.innerHTML='<section class="sect" style="margin-top:34px">'
   +'<div class="q-bar"><i id="pf"></i></div>'
   +'<div class="q-n">Q'+(i+1)+' / '+Q.length+'</div>'
   +'<div class="q-q">'+esc(d.q)+'</div>'
   +'<p class="q-s">'+esc(d.sub)+'</p>'
   +d.opts.map(function(o,j){return '<button class="q-opt" data-i="'+i+'" data-j="'+j+'">'+esc(o.l)+'</button>'}).join("")
   +(i>0?'<a class="q-back" href="#" data-back="'+(i-1)+'">← 前の質問に戻る</a>'
        :'<a class="q-back" href="/">← トップに戻る</a>')
   +'</section>';
  requestAnimationFrame(function(){document.getElementById("pf").style.width=((i+1)/Q.length*100)+"%"});
  window.scrollTo(0,0);
}

app.addEventListener("click",function(e){
  var b=e.target.closest("[data-j]");
  if(b){var i=+b.dataset.i,j=+b.dataset.j;ans[Q[i].id]=Q[i].opts[j].v;
        return i<Q.length-1?q(i+1):scan();}
  var k=e.target.closest("[data-back]");
  if(k){e.preventDefault();q(+k.dataset.back);}
  var r=e.target.closest("[data-retry]");
  if(r){e.preventDefault();ans={};q(0);}
});

function scan(){
  app.innerHTML='<section class="sect" style="margin-top:80px;text-align:center">'
   +'<div class="q-n" style="letter-spacing:.2em">診 断 中</div>'
   +'<div class="q-bar" style="margin-top:20px"><i id="sb"></i></div>'
   +'<p class="q-s" style="margin-top:20px">住まい・家族構成・現在の備蓄からリスクを計算しています</p></section>';
  requestAnimationFrame(function(){
    var b=document.getElementById("sb");b.style.transition="width 1.5s linear";b.style.width="100%"});
  window.scrollTo(0,0);
  setTimeout(result,1650);
}

function result(){
  var r=build(ans);
  var jd=(r.sc<20)?"危険水準":(r.sc<35)?"要警戒":"あと一歩";
  var mod=(ans.kids==="baby"?' <em>× 乳幼児</em>':'')+(ans.pet==="yes"?' <em>× ペット</em>':'');
  app.innerHTML='<section class="sect" style="margin-top:34px">'
   +'<div class="score-card"><div class="score-l">あなたの生存準備度</div>'
   +'<div class="score-row"><span class="score-n" id="sn">0</span><span class="score-u">%</span>'
   +'<span class="score-b">'+jd+'</span></div>'
   +'<div class="score-g"><i id="gf"></i></div>'
   +'<p class="score-note">大規模災害での在宅・避難生活'+r.dy+'日間を想定した充足率です</p></div>'
   +'<div class="score-card"><div class="score-l">あなたのタイプ</div>'
   +'<div class="type-n">'+esc(r.t.n)+mod+'</div>'
   +'<p class="score-note" style="margin:0 0 16px">'+esc(r.t.d)+'</p>'
   +r.t.r.map(function(x){return '<div class="risk"><i>⚠</i><span>'+esc(x)+'</span></div>'}).join("")
   +'</div></section>'
   +'<section class="sect"><h2 class="h2">あなたの家に必要な備蓄</h2>'
   +'<p class="h2-note">'+r.pe+'人・'+r.dy+'日分で計算しています。上から優先順です。</p>'
   +'<div class="items">'+r.it.map(function(x,i){var pr=i<r.nc;
      return '<div class="item'+(pr?' pri':'')+'">'
       +'<div class="item-head"><span class="item-rank">'+(pr?'今すぐ':'次に')+'</span>'
       +'<span class="item-name">'+esc(x.n)+'</span></div>'
       +'<div class="item-qty">'+esc(x.q)+'</div>'
       +'<div class="item-why">'+esc(x.w)+'</div>'
       +'<a class="item-btn" href="'+amz(x.k)+'" target="_blank" rel="noopener sponsored noreferrer">Amazonで探す →</a></div>'}).join("")
   +'</div></section>'
   +'<section class="sect"><h2 class="h2">次に読むページ</h2>'
   +'<p class="h2-note">診断で出た量の根拠と、災害別の備えはこちらにまとめています。</p>'
   +'<div class="tiles">'
   +'<a class="tile feat" href="/bichiku/"><div class="tile-n">備蓄する</div><div class="tile-c">全災害に効く唯一の備え</div></a>'
   +'<a class="tile" href="/kaji/"><div class="tile-n">火事に備える</div><div class="tile-c">最初の2分が家を救う</div></a>'
   +'<a class="tile" href="/suigai/"><div class="tile-n">水害に備える</div><div class="tile-c">唯一、事前に予測できる災害</div></a>'
   +'<a class="tile" href="/teiden/"><div class="tile-n">停電に備える</div><div class="tile-c">夏は熱中症、冬は低体温症</div></a>'
   +'</div>'
   +'<a class="cta-ghost" style="margin-top:16px" href="#" data-retry="1">もう一度診断する</a>'
   +'</section>';
  window.scrollTo(0,0);
  setTimeout(function(){
    document.getElementById("gf").style.width=r.sc+"%";
    var el=document.getElementById("sn"),n=0;
    (function step(){n=Math.min(r.sc,n+1);el.textContent=n;if(n<r.sc)requestAnimationFrame(step)})();
  },260);
}`;

export { CATS, CAT_IDS };
