import { SITE, LINKS, V, AFF_TAG, amz } from "./config.mjs";
import { page, esc } from "./layout.mjs";
import { ICONS, CSS_DISASTER, CSS_HOME, CSS_BICHIKU } from "./theme.mjs";
import { h2, note, videos, tiles, shops, prLabel, disclaimer } from "./blocks.mjs";
import { CATS, CAT_IDS, DISASTER_IDS, LIFE_IDS } from "./content/index.mjs";

const GUIDE_VIDEO_CSS = `
.guide-video{margin:32px 0 40px;padding:24px;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
.guide-video h2{margin:0 0 10px;font-size:clamp(20px,4.5vw,26px);line-height:1.5}
.guide-video p{margin:0 0 20px;color:var(--muted);font-size:14px;line-height:1.9}
.guide-video-frame{position:relative;aspect-ratio:16/9;background:#17191c;overflow:hidden;border-radius:5px}
.guide-video-frame iframe{display:block;width:100%;height:100%;border:0}
.guide-video-external{display:inline-block;margin-top:14px;font-size:13px;text-underline-offset:4px}
.guide-video-external:focus-visible{outline:2px solid currentColor;outline-offset:4px}
@media(max-width:480px){.guide-video{padding:16px}}
`;

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
function guideVideo(video) {
  return video ? `<section class="guide-video" aria-labelledby="guide-video-heading">
    <h2 id="guide-video-heading">${esc(video.heading)}</h2>
    <p>${esc(video.description)}</p>
    <div class="guide-video-frame">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${esc(video.id)}?playsinline=1&amp;rel=0"
        title="${esc(video.heading)}"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen></iframe>
    </div>
    <a class="guide-video-external" href="https://www.youtube.com/watch?v=${esc(video.id)}" target="_blank" rel="noopener noreferrer">YouTubeで見る ↗</a>
  </section>` : "";
}

export function renderDisaster(d) {
  const gearCount = d.gear.reduce((n, g) => n + g.items.length, 0);

  // STEP名はページごとに差し替え可能（防犯・お金・値上げは「逃げる」が実態に合わない）
  const S = d.steps || {};
  const s1 = S.s1 || { nav: "防ぐ", t: "未然に防ぐ", sub: "平時にやっておくこと。ここが一番、効果が大きい" };
  const s2 = S.s2 || { nav: "逃げる", t: "起きたらどうする", sub: "その瞬間に迷わないために。先に読んでおく" };
  const s3 = S.s3 || { nav: "備える", t: "備えるモノ", sub: null };

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
          <div class="grow-n"><a class="stock-product-link" href="${amz(it.kw)}" target="_blank" rel="noopener sponsored noreferrer">${esc(it.name)} <span aria-hidden="true">↗</span></a>${it.pick ? '<span class="grow-p">まずこれ</span>' : ""}</div>
          <div class="grow-w">${esc(it.why)}</div>
        </div>
      </div>`
        )
        .join("")}
    </div>`
    )
    .join("");

  const body = `
${prLabel()}
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
  <a href="#prevent"><em>STEP 1</em>${esc(s1.nav)}</a>
  <a href="#respond"><em>STEP 2</em>${esc(s2.nav)}</a>
  <a href="#gear"><em>STEP 3</em>${esc(s3.nav)}</a>
</div></nav>

<div class="wrap">
  ${guideVideo(d.video)}
  <div class="steph" id="prevent">
    <span class="steph-n">1</span>
    <div><div class="steph-t">${esc(s1.t)}</div>
    <div class="steph-s">${esc(s1.sub)}</div></div>
  </div>
  ${acts(d.prevent, false)}

  <div class="steph warn" id="respond">
    <span class="steph-n">2</span>
    <div><div class="steph-t">${esc(s2.t)}</div>
    <div class="steph-s">${esc(s2.sub)}</div></div>
  </div>
  ${acts(d.respond, true)}

  <div class="steph buy" id="gear">
    <span class="steph-n">3</span>
    <div><div class="steph-t">${esc(s3.t)}</div>
    <div class="steph-s">${esc(s3.sub || d.name.replace("に備える","").replace("を備える","") + "に関係する備えを" + gearCount + "点、目的別にまとめました")}</div></div>
  </div>
  ${gear}

  ${d.noBichikuLink ? "" : `<div class="tobichiku">
    <div class="tobichiku-t">水・食料・トイレは、備蓄ページで必要量を計算できます</div>
    <p class="tobichiku-d">
      どの災害でも共通して要る基本の備えは、10分野にまとめてあります。
      家族の人数を入れると、最低ラインと理想ラインの数量が出ます。
    </p>
    <a class="tobichiku-b" href="/bichiku/">備蓄リストを見る →</a>
  </div>`}

<section class="sect">
    ${h2("関連する備え", "book", "続けて読むと、備えの穴が埋まります。")}
    ${tiles(CATS, d.related)}
  </section>

  
</div>`;

  return page({
    path: `/${d.id}/`,
    title: d.seoTitle,
    bareTitle: true,
    description: d.seoDesc,
    body,
    extraCSS: CSS_DISASTER + (d.video ? GUIDE_VIDEO_CSS : ""),
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
// 備蓄ページ（専用テンプレート）
//   人数入力で数量が動く／10カテゴリの備蓄ガイド
// ============================================================
export function renderBichiku(b) {

  const nav = b.groups
    .map((g, i) => `<a href="#${g.id}"><i>${i + 1}</i>${esc(g.name)}</a>`)
    .join("");

  const amt = (g, kind) => {
    const ideal = kind === "ideal";
    if (g.rate) {
      const days = ideal ? 14 : 7;
      return `<div class="amt-v" data-rate="${g.rate.per}" data-days="${days}"
        >${4 * g.rate.per * days}<em>${esc(g.rate.unit)}</em></div>`;
    }
    return `<div class="amt-v" style="font-size:19px">${esc(ideal ? g.minText.ideal : g.minText.min)}</div>`;
  };

  const cats = b.groups
    .map(
      (g, i) => `
<section class="bcat" id="${g.id}">
  <div class="bcat-h">
    <span class="bcat-ic">${ICONS[g.icon]}</span>
    <div><div class="bcat-no">${String(i + 1).padStart(2, "0")}</div>
    <div class="bcat-n">${esc(g.name)}</div></div>
  </div>

  <div class="amts">
    <div class="amt"><div class="amt-l">最低ライン（7日）</div>${amt(g, "min")}
      <div class="amt-n">${esc(g.minNote)}</div></div>
    <div class="amt ideal"><div class="amt-l">理想ライン（14日）</div>${amt(g, "ideal")}
      <div class="amt-n">${esc(g.idealNote)}</div></div>
  </div>

  <div class="ng"><span class="ng-i">!</span>
    <div><div class="ng-t">よくある失敗</div>
    <div class="ng-d">${esc(g.ng)}</div></div></div>

  <p class="bcat-lead">${g.lead}</p>

  <div class="bchk-h">そろえるもの</div>
  ${g.items
    .map(
      (it) => `<div class="grow">
    <div class="grow-m">
      <div class="grow-n"><a class="stock-product-link" href="${amz(it.kw)}" target="_blank" rel="noopener sponsored noreferrer">${esc(it.name)} <span aria-hidden="true">↗</span></a>${it.pick ? '<span class="grow-p">まずこれ</span>' : ""}</div>
      <div class="grow-w">${esc(it.why)}</div>
    </div>
  </div>`
    )
    .join("")}
</section>`
    )
    .join("");

  const body = `
${prLabel()}
<div class="wrap">
  <section class="hero" style="padding-bottom:24px">
    ${ICONS[b.icon].replace("<svg", '<svg class="hero-icon"')}
    <div class="hero-eyebrow">${esc(b.catch)}</div>
    <h1>${esc(b.name)}</h1>
    <p class="hero-lead">${b.lead}</p>
  </section>
</div>

<div class="calc"><div class="calc-in">
  <span class="calc-l">家族の人数</span>
  <span class="calc-btns">
    <button class="calc-b" id="cm" aria-label="減らす">−</button>
    <span class="calc-n"><span id="cn">4</span><em>人</em></span>
    <button class="calc-b" id="cp" aria-label="増やす">＋</button>
  </span>
  <span class="calc-hint">人数を変えると、下の必要量が全部書き換わります</span>
</div></div>

<nav class="bnav"><div class="bnav-in">${nav}</div></nav>

<div class="wrap">
  ${guideVideo(b.video)}
  ${cats}

<section class="sect">
    ${h2("あわせて備える", "book", "災害ごとの「防ぐ・逃げる」はこちらにまとめています。")}
    ${tiles(CATS, b.related)}
  </section>

  
</div>`;

  return page({
    path: "/bichiku/",
    title: b.seoTitle,
    bareTitle: true,
    description: b.seoDesc,
    body,
    extraCSS: CSS_DISASTER + CSS_BICHIKU + (b.video ? GUIDE_VIDEO_CSS : ""),
    crumb: [{ href: "/", label: "備えナビ" }, { label: b.name }],
    script: BICHIKU_JS,
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: b.seoTitle,
      description: b.seoDesc,
      author: { "@type": "Person", name: SITE.author },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: SITE.origin + "/bichiku/",
    },
  });
}

const BICHIKU_JS = `
(function(){
  var KEY="sonaenavi-bichiku";
  var store={};
  try{ store=JSON.parse(localStorage.getItem(KEY)||"{}") }catch(e){ store={} }

  // ── 人数 → 数量
  var people = store.__people || 4;
  var cn=document.getElementById("cn");
  function amounts(){
    cn.textContent=people;
    document.querySelectorAll("[data-rate]").forEach(function(el){
      var per=+el.getAttribute("data-rate"), days=+el.getAttribute("data-days");
      var unit=el.querySelector("em").textContent;
      el.innerHTML=(people*per*days)+"<em>"+unit+"</em>";
    });
  }
  function setPeople(n){
    people=Math.max(1,Math.min(12,n));
    store.__people=people; save(); amounts();
  }
  document.getElementById("cm").addEventListener("click",function(){setPeople(people-1)});
  document.getElementById("cp").addEventListener("click",function(){setPeople(people+1)});

  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(store)) }catch(e){} }
  amounts();
})();`;


// ============================================================
// 免責事項ページ
// ============================================================
export function renderDisclaimer() {
  const body = `
<div class="wrap legal">
  <section class="hero">
    <div class="hero-eyebrow">ご利用にあたって</div>
    <h1>免責事項</h1>
    <p class="lead">
      備えナビは、防災の知識をまとめた情報サイトです。
      掲載している内容は一般的な目安であり、読んでくださる方それぞれの状況における
      安全を保証するものではありません。以下をお読みいただいたうえでご利用ください。
    </p>
  </section>

  <h2>情報の正確性について</h2>
  <p>掲載内容は作成時点で確認できた一般的な防災の考え方に基づいています。<strong>正確性・完全性・最新性を保証するものではありません。</strong>制度や推奨される対応は変わることがあります。重要な判断をされる際は、必ず公的機関の最新情報をご確認ください。</p>

  <h2>避難の判断について</h2>
  <p><strong>避難するかどうか、いつ避難するかの判断は、必ずお住まいの自治体の発表とハザードマップに従ってください。</strong></p>
  <p>本サイトに書かれた基準や数値は、平時に備えを整えるための目安です。<strong>実際の災害時に、本サイトの記述を理由として避難を遅らせたり、自治体の指示と異なる行動をとったりしないでください。</strong>現場の状況は地域ごとに大きく異なります。</p>

  <h2>健康と応急処置について</h2>
  <p>体調・怪我・応急処置に関する記述は、一般的な知識の紹介であり、<strong>医療行為の指示ではありません。</strong></p>
  <ul>
    <li>症状があるとき、判断に迷うときは、<strong>ためらわず119番通報または医療機関へご相談ください。</strong></li>
    <li>持病の薬、常備薬の備蓄については、<strong>必ず主治医・かかりつけ薬局にご相談ください。</strong>自己判断で量を調整しないでください。</li>
    <li>救急車を呼ぶかどうか迷う場合は、<strong>#7119</strong>（救急安心センター／地域により異なります）に相談できます。</li>
  </ul>

  <h2>備蓄の数量と商品について</h2>
  <p>掲載している数量は一般的な目安です。<strong>住まいの形態、家族構成、年齢、持病、地域の特性によって、本当に必要なものは変わります。</strong>計算機の数値もあくまで出発点としてお使いください。</p>
  <p>紹介している商品は、備えの参考として挙げているものです。<strong>特定の商品の性能・効果・安全性を保証するものではありません。</strong>購入の判断、使用方法の確認、保管や点検はご自身の責任でお願いします。使用にあたっては各製品の取扱説明書に従ってください。</p>

  <h2>広告について</h2>
  <p>本サイトは<strong>Amazonアソシエイト・プログラムおよびA8.net</strong>を利用しています。サイト内の商品リンクを経由して商品が購入された場合、運営者が紹介料を受け取ることがあります。</p>
  <p>紹介料の有無によって掲載内容を変えることはありませんが、この関係があることを前提としてお読みください。<strong>商品の価格・在庫・仕様は各販売サイトの表示が最新です。</strong></p>

  <h2>責任の範囲</h2>
  <p><strong>本サイトの情報を利用したことによって生じたいかなる損害についても、運営者は責任を負いかねます。</strong>最終的な判断と行動は、ご自身の責任でお願いいたします。</p>
  <p>また、リンク先の外部サイトの内容についても責任を負いません。</p>

  <h2>主な参照元</h2>
  <p>本サイトの数値と行動基準は、以下の公的機関が公表している資料を参照しています。内容は各機関の最新の発表をご確認ください。</p>
  <ul>
    <li><strong>内閣府 防災情報のページ</strong> — 避難情報に関するガイドライン（警戒レベル1〜5）、大規模地震時の電気火災の発生抑制に関する検討会</li>
    <li><strong>総務省消防庁</strong> — 消防白書（火災による死者の状況）、住宅用火災警報器に関する資料</li>
    <li><strong>国土交通省</strong> — 地下空間における浸水対策ガイドライン、冠水した道路の走行に関する注意喚起、ハザードマップポータルサイト</li>
    <li><strong>気象庁</strong> — 雷から身を守るには、急な大雨や雷・竜巻から身を守るために</li>
    <li><strong>環境省</strong> — 熱中症環境保健マニュアル、熱中症予防情報サイト</li>
    <li><strong>農林水産省</strong> — 災害時に備えた食品ストックガイド</li>
  </ul>
  <p>ただし、<strong>本サイトの記述はこれらの資料の要約や公式見解ではなく、運営者による解釈と再構成を含みます。</strong>正確な内容は必ず一次資料をご確認ください。</p>

  <h2>お問い合わせ</h2>
  <p>内容の誤りにお気づきの場合は、Instagram「備えニキ」のDMからお知らせいただけると助かります。確認のうえ修正します。</p>

  
</div>`;

  return page({
    path: "/disclaimer/",
    title: "免責事項",
    description:
      "備えナビの免責事項。掲載情報は一般的な目安であり、避難の判断は自治体の発表に従ってください。健康・応急処置に関する記述は医療行為の指示ではありません。",
    body,
    crumb: [{ href: "/", label: "備えナビ" }, { label: "免責事項" }],
  });
}

// ============================================================
// トップページ
// ============================================================
export function renderHome() {
  const dcards = DISASTER_IDS.map((id) => {
    const c = CATS[id];
    return `<a class="dcard" href="/${id}/">${ICONS[c.icon]}
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
${prLabel()}
<section class="thero">
  <div class="thero-in">
    <div class="thero-eb">備えニキの防災まとめ</div>
    <h1>災害から大切な命を守る、<br>備えのすべて</h1>
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
    <div class="thead-t">迷ったらこれを揃える</div>
    <p class="thead-d">備えニキが実際に選んだものをまとめています。</p>
  </div>
  ${shops()}

  <div class="thead">
    <div class="thead-t">30秒でわかる<br>あなたの家に必要な量</div>
    <p class="thead-d">家族の人数と住まいから、必要な備蓄の量と優先順位を計算します。登録不要です。</p>
  </div>
  <div style="margin-top:20px"><a class="cta" href="/shindan/">生存準備度を診断する →</a>
  <p class="cta-note">登録不要・個人情報の入力なし</p></div>


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
${prLabel()}
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
  it.push({n:(a.budget>=3?"ポータブル電源":"大容量モバイルバッテリー"),q:"1台",w:"情報源であるスマホを死なせない",k:(a.budget>=3?"ポータブル電源 500Wh":"モバイルバッテリー 20,000mAh")});
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
       +'<a class="item-name stock-product-link" href="'+amz(x.k)+'" target="_blank" rel="noopener sponsored noreferrer">'+esc(x.n)+' <span aria-hidden="true">↗</span></a></div>'
       +'<div class="item-qty">'+esc(x.q)+'</div>'
       +'<div class="item-why">'+esc(x.w)+'</div>'
       +'</div>'}).join("")
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
