import { AFF_TAG } from './config.mjs';
import { esc } from './layout.mjs';
export const checkedAt = '2026-09-11';
export const featuredProducts = [
 {id:'backpacks',title:'防災リュック',lead:'初級から水・食料入り。内容やバッグの機能で選べる、1人用の3セットです。',image:'emergency-backpack-editorial-v1.png',note:'セットを土台に、常備薬・着替えなど自分に必要なものを追加してください。',items:[
 {tier:'初級',purpose:'基本をまとめてそろえる',brand:'LA・PITA',name:'SHELTERプレミアム',sub:'1人用／ブラック',asin:'B07RQ5GR94',price:14980,spec:'30L・セット約5kg',why:'保存水・非常食・ラジオライトなどを、まとめて備えたい人に。',caution:'私物を追加すると重くなります。背負える重量に調整してください。'},
 {tier:'中級',purpose:'バッグにもこだわる',brand:'LA・PITA',name:'ラピタプレミアム',sub:'1人用／ベージュ',asin:'B0FKM5YSQ6',price:19980,spec:'ターポリン生地のリュック',why:'水や食料などのセット内容に加え、バッグの素材や見た目も重視したい人に。',caution:'セット内容・重量は購入先で確認。これだけで長期備蓄が完了するわけではありません。'},
 {tier:'上級',purpose:'素材と装備にこだわる',brand:'防災ダイレクト',name:'地震対策30点避難セット',sub:'1人用・30点／ホワイト',asin:'B004QLKO46',price:23000,spec:'防炎・防水素材のリュック',why:'保存水・パン・簡易トイレに、多機能ラジオライト。バッグの素材と装備を重視したい人に。',caution:'購入先で「1人用」を選択。自分が背負える重さか、私物を入れる余裕も確認してください。'}]},
 {id:'solar-power',title:'ポタ電 ＆ ソーラー',lead:'小型・バランス・大容量。すべて純正ソーラーパネル付きのセットです。',image:'portable-power-editorial-v1.png',note:'使う機器の消費電力・起動時の電力を確認してください。ソーラー充電量は天候・日当たりで変わります。',items:[
 {tier:'初級',purpose:'スマホ・照明を中心に',brand:'Jackery',name:'240 New ＋ 40W Mini',sub:'電源1台＋ソーラーパネル1枚',asin:'B0D2HXKBF1',price:42415,spec:'256Wh ／ 定格300W',why:'スマホ充電や小型の照明など、必要な電気をコンパクトに備えたい人に。',caution:'電気ケトルやドライヤーなど高出力家電には不向き。40Wパネルは充電に時間がかかります。'},
 {tier:'中級',purpose:'容量と価格のバランス',brand:'Jackery',name:'1000 New ＋ 100W',sub:'電源1台＋ソーラーパネル1枚',asin:'B0D3HLP1NM',price:89668,spec:'1,070Wh ／ 定格1,500W',why:'スマホだけでなく、対応する家電にも使える容量を備えたい人に。',caution:'使用時間は機器によって異なります。家全体の電気をまかなうものではありません。'},
 {tier:'上級',purpose:'容量に余裕を持たせる',brand:'Jackery',name:'2000 New ＋ 200W',sub:'電源1台＋ソーラーパネル1枚',asin:'B0DBQCN7HZ',price:168948,spec:'2,042Wh ／ 定格2,200W',why:'使いたい機器が多い人や、より長い停電を見据えて容量を確保したい人に。',caution:'持ち運びの重さ・置き場所も確認。医療機器の非常電源としては個別確認が必要です。'}]}
];
export function renderFeaturedProducts(){return `<section class="wrap" id="essentials">
<div class="section-head"><div><span class="eyebrow">THE ESSENTIALS / 01</span><h2>まず備えたい、<br>この2つ。</h2></div><p>気になるカテゴリーを開いて、<br>初級・中級・上級の3商品を比較。</p></div>
${featuredProducts.map((group,i)=>`<details class="product-category" id="${group.id}">
<summary class="category-toggle">
<span class="category-thumb"><img src="/assets/${group.image}" width="1536" height="1024" loading="lazy" alt="${group.title}のカテゴリーイメージ"><small>※写真はイメージです</small></span>
<span class="category-label"><span class="eyebrow">0${i+1} / 絶対買うべきもの</span><strong>${group.title}</strong><small class="category-catch">${i===0?'防災の基本。まずはこのリュックで、ひと通り備える！':'電気が使えない、その時に。充電と明かりを、わが家に備える。'}</small><span class="category-action"><span class="when-closed">3商品を比較する</span><span class="when-open">閉じる</span><span class="toggle-icon" aria-hidden="true">＋</span></span></span>
</summary>
<div class="category-content"><p class="category-lead">${group.lead}</p><p class="selection-fine">表示価格は${checkedAt}確認時の税込価格です。最新の価格・在庫・販売者・セット内容はAmazonで確認してください。商品名からAmazonの商品ページへ進めます。</p>
<div class="product-options">${group.items.map(item=>`<article class="product-option ${item.tier==='中級'?'balanced':''}"><div class="tier"><span>${item.tier}</span><strong>${item.purpose}</strong></div><p class="product-brand">${item.brand}</p><h4><a href="https://www.amazon.co.jp/dp/${item.asin}?tag=${AFF_TAG}" target="_blank" rel="noopener sponsored noreferrer">${esc(item.name)} <span>↗</span></a></h4><p class="product-sub">${item.sub}</p><p class="product-price">¥${item.price.toLocaleString('ja-JP')}<small>確認時価格</small></p><p class="product-spec">${item.spec}</p><p class="product-why">${item.why}</p><p class="product-caution">${item.caution}</p></article>`).join('')}</div><p class="selection-fine">${group.note}</p><p class="category-image-note">カテゴリー画像はイメージです。掲載商品とは異なります。</p></div>
</details>`).join('')}<p class="essentials-ad-note">広告・Amazonアソシエイトリンクを含みます。</p></section>`;}
