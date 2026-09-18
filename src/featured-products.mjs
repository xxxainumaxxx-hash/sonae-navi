import { AFF_TAG, amz } from './config.mjs';
import { esc } from './layout.mjs';
export const checkedAt = '2026-09-11';
export const featuredProducts = [
 {id:'backpacks',title:'防災リュック',reasonTitle:'自分で集めると、だいたい何かが抜ける',reasonBody:'ホイッスル、簡易トイレ、給水袋、軍手、ラジオ。ひとつずつ買い足していくと、「あとで買おう」と思ったものがそのまま空欄で残ります。<strong>セットなら、必要な道具を一つずつ探す手間を減らせます。</strong>',reasonNote:`まだ買わない人へ：<a class="inline-buy" href="${amz('保存水 2L 長期保存 5年 箱')}" target="_blank" rel="noopener sponsored noreferrer">水<span aria-hidden="true">↗</span></a>・<a class="inline-buy" href="${amz('簡易トイレ 100回分 凝固剤')}" target="_blank" rel="noopener sponsored noreferrer">簡易トイレ<span aria-hidden="true">↗</span></a>・<a class="inline-buy" href="${amz('ヘッドライト LED 防災')}" target="_blank" rel="noopener sponsored noreferrer">ヘッドライト<span aria-hidden="true">↗</span></a>の3つからでも、十分に意味があります。`,reasonDetail:'足りない分は、あとから足せます。常備薬や着替えなど、自分に必要なものと、水・食料の量を確認して追加しましょう。逆に、セットに入っているものを重複して買わずに済むので、結果として無駄が減ります。',lead:'水・食料入りの1人用3セット。中身・デザイン・バッグの素材から、自分に合うものを選べます。',image:'emergency-backpack-editorial-v1.png',note:'セットを土台に、常備薬・着替えなど自分に必要なものを追加してください。',items:[
 {tier:'基本',purpose:'基本をまとめてそろえる',brand:'LA・PITA',name:'SHELTERプレミアム',sub:'1人用／ブラック',asin:'B07RQ5GR94',price:14980,spec:'30L・セット約5kg',why:'保存水・非常食・ラジオライトなどを、まとめて備えたい人に。',caution:'私物を追加すると重くなります。背負える重量に調整してください。'},
 {tier:'充実',emphasis:true,purpose:'衛生用品までまとめて備える',brand:'あかまる防災',name:'あかまる防災かばん',sub:'1人用／38品目・44アイテム',href:'https://px.a8.net/svt/ejp?a8mat=4BCE3O+A8JD0A+5HQC+5YRHE',pixel:'https://www13.a8.net/0.gif?a8mat=4BCE3O+A8JD0A+5HQC+5YRHE',linkText:'防災士が厳選した防災セットあかまる防災',seller:'公式サイト',checkedAt:'2026-09-18',price:19800,spec:'防災士・消防士監修／24.4L',why:'水・食料に加え、簡易トイレや救急・衛生用品もまとめて選びたい人に。中身と置きやすいデザインの両方を重視するなら。',caution:'届いたら中身を確認して自分で詰めるセットです。常備薬などを足し、背負える重さに調整してください。'},
 {tier:'素材',purpose:'素材と装備にこだわる',brand:'防災ダイレクト',name:'地震対策30点避難セット',sub:'1人用・30点／ホワイト',asin:'B004QLKO46',price:23000,spec:'防炎・防水素材のリュック',why:'保存水・パン・簡易トイレに、多機能ラジオライト。バッグの素材と装備を重視したい人に。',caution:'購入先で「1人用」を選択。自分が背負える重さか、私物を入れる余裕も確認してください。'}]},
 {id:'solar-power',title:'ポタ電 ＆ ソーラー',reasonTitle:'停電すると、家の中のほぼ全部が止まる',reasonBody:'停電で止まるのは、スマホの充電だけではありません。<strong>照明も、冷蔵庫も、エアコンも、電子レンジも、Wi-Fiも止まります</strong>。マンションなら給水ポンプが動かず、水も出なくなります。夏は熱中症、冬は低体温症のリスクが、家の中にいながら上がっていきます。<br><strong>モバイルバッテリーだけだと、4人家族なら2日目には空になります。</strong>',reasonNote:`まだ早いと思う人へ：まずは<a class="inline-buy" href="${amz('モバイルバッテリー 20000mAh 大容量')}" target="_blank" rel="noopener sponsored noreferrer">20,000mAhのモバイルバッテリー<span aria-hidden="true">↗</span></a>を家族の人数分。それでも1日は持ちます。無理に急ぐ買い物ではありません。`,reasonDetail:`スマホ1台をフル充電するのに必要な電力は、およそ15〜20Wh。<a class="inline-buy" href="${amz('モバイルバッテリー 20000mAh 大容量')}" target="_blank" rel="noopener sponsored noreferrer">20,000mAhのモバイルバッテリー<span aria-hidden="true">↗</span></a>は約74Whなので、<strong>フル充電3〜4回分</strong>です。ポータブル電源なら、256Whでおよそ10回以上、1,070Whで50回以上が目安です（機種と端末によって変わります）。停電が3日続いたとき、充電する手段が家にあるかどうかという話です。`,lead:'小型・バランス・大容量。すべて純正ソーラーパネル付きのセットです。',image:'portable-power-editorial-v1.png',note:'使う機器の消費電力・起動時の電力を確認してください。ソーラー充電量は天候・日当たりで変わります。',items:[
 {tier:'初級',purpose:'スマホ・照明を中心に',brand:'Jackery',name:'240 New ＋ 40W Mini',sub:'電源1台＋ソーラーパネル1枚',asin:'B0D2HXKBF1',price:42415,spec:'256Wh ／ 定格300W',why:'スマホ充電や小型の照明など、必要な電気をコンパクトに備えたい人に。',caution:'電気ケトルやドライヤーなど高出力家電には不向き。40Wパネルは充電に時間がかかります。'},
 {tier:'中級',purpose:'容量と価格のバランス',brand:'Jackery',name:'1000 New ＋ 100W',sub:'電源1台＋ソーラーパネル1枚',asin:'B0D3HLP1NM',price:89668,spec:'1,070Wh ／ 定格1,500W',why:'スマホだけでなく、対応する家電にも使える容量を備えたい人に。',caution:'使用時間は機器によって異なります。家全体の電気をまかなうものではありません。'},
 {tier:'上級',purpose:'容量に余裕を持たせる',brand:'Jackery',name:'2000 New ＋ 200W',sub:'電源1台＋ソーラーパネル1枚',asin:'B0DBQCN7HZ',price:168948,spec:'2,042Wh ／ 定格2,200W',why:'使いたい機器が多い人や、より長い停電を見据えて容量を確保したい人に。',caution:'持ち運びの重さ・置き場所も確認。医療機器の非常電源としては個別確認が必要です。'}]}
];
export function renderFeaturedProducts(){return `<section class="wrap" id="essentials">
<div class="section-head"><div><span class="eyebrow">THE ESSENTIALS / 01</span><h2>まず備えたい、<br>この2つ。</h2></div><p>なぜ必要かを読んでから、<br>特徴の異なる3商品を比較。</p></div>
${featuredProducts.map((group,i)=>`<div class="essential-block">
<div class="essential-head">
<span class="essential-thumb"><img src="/assets/${group.image}" width="1536" height="1024" loading="lazy" alt="${group.title}のカテゴリーイメージ"><small>※写真はイメージです</small></span>
<span class="essential-title"><span class="eyebrow">0${i+1} / まず備える</span><strong>${group.title}</strong></span>
</div>
<div class="reason">
<p class="reason-t">${group.reasonTitle}</p>
<p class="reason-b">${group.reasonBody}</p>
<p class="reason-n">${group.reasonNote}</p>
</div>
<details class="product-category" id="${group.id}">
<summary class="category-toggle"><span class="when-closed">3商品を比較する</span><span class="when-open">閉じる</span><span class="toggle-icon" aria-hidden="true">＋</span></summary>
<div class="category-content">
<p class="reason-detail">${group.reasonDetail}</p>
<p class="category-lead">${group.lead}</p>
<p class="selection-fine">表示価格は各商品の記載日に確認した税込価格です。最新の価格・在庫・送料・セット内容は、それぞれの購入先で確認してください。</p>
<div class="product-options">${group.items.map(item=>`<article class="product-option ${item.emphasis||item.tier==='中級'?'balanced':''}"><div class="tier"><span>${item.tier}</span><strong>${item.purpose}</strong></div><p class="product-brand">${item.brand}${item.href?' <span class="product-pr">PR</span>':''}</p><h4>${item.href?esc(item.name):`<a href="https://www.amazon.co.jp/dp/${item.asin}?tag=${AFF_TAG}" target="_blank" rel="noopener sponsored noreferrer">${esc(item.name)} <span>↗</span></a>`}</h4><p class="product-sub">${item.sub}</p><p class="product-price">¥${item.price.toLocaleString('ja-JP')}<small>${item.checkedAt||checkedAt}確認</small></p><p class="product-spec">${item.spec}</p><p class="product-why">${item.why}</p><p class="product-caution">${item.caution}</p>${group.id==='backpacks'?`<div class="product-purchase"><a class="product-buy" href="${item.href||`https://www.amazon.co.jp/dp/${item.asin}?tag=${AFF_TAG}`}" target="_blank" rel="nofollow noopener sponsored noreferrer">${item.linkText||'セット内容・価格を見る'}</a><small>${item.seller||'Amazon'}で内容・価格を確認 ↗</small></div>`:''}${item.pixel?`<img class="affiliate-pixel" border="0" width="1" height="1" src="${item.pixel}" alt="">`:''}</article>`).join('')}</div>
<p class="selection-fine">${group.note}</p>
<p class="category-image-note">カテゴリー画像はイメージです。掲載商品とは異なります。</p>
</div>
</details>
</div>`).join('')}<p class="essentials-ad-note">広告（Amazonアソシエイト・A8.net）を含みます。リンク経由の購入により運営者が紹介料を受け取る場合があります。</p></section>`;}
