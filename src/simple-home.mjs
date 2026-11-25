import {AFF_TAG, SITE} from './config.mjs';
import {esc} from './layout.mjs';
export function simpleHome(previous){
 const products={
 water:{name:'水',title:'水想い 長期保存水',spec:'2L × 9本／1箱18L',detail:'6年保存。飲用・調理用に。',asin:'B0FFH5LQ9F',unit:'L',daily:3,pack:18},
 food:{name:'主食',title:'尾西食品 コンパクト非常食セット',spec:'パン・おにぎり・ごはん／計9袋',detail:'主食のセット。ごはん・おにぎりは水で戻します。',asin:'B0CCDFSMWZ',unit:'食分',daily:3,pack:9},
 toilet:{name:'トイレ',title:'アイリスオーヤマ BTS10-50',spec:'50回分／凝固剤・汚物袋・防臭袋付き',detail:'水を使わない非常用トイレ。',asin:'B0DWFQF9HY',unit:'回分〜',daily:5,pack:50}
 };
 const href=asin=>`https://www.amazon.co.jp/dp/${asin}?tag=${AFF_TAG}`;
 const basic=(key,days)=>{const p=products[key],count=Math.ceil(p.daily*days/p.pack),extra=count-Math.ceil(p.daily*3/p.pack);return `<article class="purchase-row ${key}" data-product="${key}" data-days="${days}"><div class="row-info"><div class="row-title"><strong>${p.name}</strong><span>目安 <b data-per="${p.daily*days}">${p.daily*days}</b>${p.unit}</span></div><span class="row-product">${key==='water'?'水想い 保存水 2L×9本':key==='food'?'尾西食品 主食9袋セット':'アイリス 防臭袋付き・50回分'}</span><span class="pack-count" data-pack="${p.pack}" data-daily="${p.daily}">${days===3?`${count}箱`:(extra>0?`＋${extra}箱`:'追加不要')}</span></div><a class="buy-cta" href="${href(p.asin)}" target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label="${p.name}：${p.title}を買う">買う</a></article>`};
 const equipment=[
 ['ヘッドライト','GENTOS VA-05D','単4電池式。予備電池も用意。','B0B8YJMHHX'],
 ['モバイルバッテリー','エレコム EC-C37BK／10,000mAh','端末に合う充電ケーブルも用意。定期的に充電確認。','B0DJ8LS3T7'],
 ['ヘルメット','TOYO No.170／白','頭のサイズに合うか確認。あごひもを締めて使用。','B001QU387K'],
 ['からだ拭き','アイリス KRD-20／大判20枚','断水時の清拭用。歯ブラシなどの口腔ケア用品も別に用意。','B0CVMTRYSH'],
 ['カセットコンロ','イワタニ 達人スリムIII CB-SS-50','対応ボンベは別に備える。換気し、説明書に従って使用。','B07VTN2VGC'],
 ['携帯ラジオ','パナソニック RF-P55-S','AM・FM対応。予備電池も用意。','B01M28D5Q2'],
 ['給水袋','キャプテンスタッグ UE-2024／5L','給水所での受け取り用。満水では約5kg。','B07HPFVJLT'],
 ['防寒シート','SOL エマージェンシーブランケット','1人用。衣類や毛布と組み合わせて保温。','B001MVZRSQ'],
 ['ランタン','パナソニック BF-BL40K-W','乾電池式LEDランタン。予備の単1電池も用意。','B09W21CF3W'],
 ['避難リュック','LA・PITA SHELTERプレミアム','1人用。水・食料の重複と、背負える重さを確認。','B07RQ5GR94'],
 ['ポータブル電源','Jackery 240 New／256Wh','本体のみ。スマホ・小型照明向け。高出力家電用ではありません。','B0D2HXKBF1']
 ];
 const priorityNames=['避難リュック','ポータブル電源'];
 equipment.sort((a,b)=>(priorityNames.includes(b[0])?1:0)-(priorityNames.includes(a[0])?1:0));
 const card=([name,title,desc,asin])=>`${name==='避難リュック'?'<p class="priority-ribbon">避難時はこれだけでも持ち出そう！</p>':name==='ポータブル電源'?'<p class="priority-ribbon">スマホも電気も使えない！<br>停電3日間 想像できる？</p>':''}<article class="purchase-row equipment-row ${priorityNames.includes(name)?'priority-row':''}"><div class="row-info"><div class="row-title"><strong>${name}</strong></div></div><a class="buy-cta" href="${href(asin)}" target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label="${name}：${title}を買う">買う</a></article>`;
 const productDetails=`<details class="sources product-details"><summary>選んだ商品・付属品を確認 <span>＋</span></summary>${Object.values(products).map(p=>`<p><strong>${p.name}：${p.title}</strong><br>${p.spec}。${p.detail}</p>`).join('')}<p><strong>おかず：ホテイ やきとり6種・18缶セット</strong><br>6種類各3缶。家族の人数や好みに合わせて数量を調整。アレルギー・賞味期限は購入先で確認。</p>${equipment.map(([name,title,desc])=>`<p><strong>${name}：${title}</strong><br>${desc}</p>`).join('')}</details>`;
 const lower=previous.slice(previous.indexOf('<section class="wrap" id="navi">'),previous.indexOf('</main>'));
 const drama=previous.match(/<section[^>]*aria-label="新作ドラマのお知らせ"[\s\S]*?<\/section>/)?.[0]||`<p><a href="https://youtu.be/4JNNnjcmUw0" target="_blank" rel="noopener noreferrer">ドラマ「２階の備えニキ」を見る ↗</a></p>`;
 const oldStyle=previous.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
 return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>まず3日分。水・食料・トイレ｜備えニキ</title><meta name="description" content="まず3日分の水・食料・トイレから。人数に合う必要量を確認し、そのまま購入先へ。次の備えと上級者向けも順番に。"><link rel="canonical" href="${SITE.origin}/"><style>${oldStyle}</style><link rel="stylesheet" href="/assets/simple-home.css"></head><body class="simple-home"><header class="simple-header"><a href="/" class="simple-brand">備えニキ<span>暮らしの備えを、シンプルに。</span></a><a href="#more">動画・読みもの ↓</a></header><main><div class="shopping"><section class="start" id="essentials"><div class="intro"><div class="safety-heading"><span>防災の第一歩</span><h1>まずこれだけは備えよう！</h1></div><p class="gov-message"><strong class="gov-authority">防災庁も呼びかけ</strong><strong class="gov-recommendation">水・食料は最低3日分、できれば1週間分。</strong></p></div><div class="buy-tools"><label for="people">人数 <select id="people">${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1}人</option>`).join('')}</select></label><span>広告｜購入先はAmazon</span></div><div class="buy-grid essentials" aria-live="polite">${basic('water',3)}${basic('food',3)}${card(['おかず（缶詰18缶）','ホテイ やきとり6種・18缶セット','','B08D3FTNNB'])}${basic('toilet',3)}</div></section><section class="shopping-step" id="advanced"><div class="buy-grid secondary">${equipment.map(card).join('')}</div></section>${productDetails}<details class="sources"><summary>必要量の根拠・買う前の確認 <span>＋</span></summary><p>水は飲用・調理用に1人1日約3L、食料は1日3食で計算。食品の個数ではなく食事の回数です。トイレは1人1日5〜6回を目安にし、体調などに合わせて余裕を持たせてください。生活用水は別に必要です。</p><p>常備薬・乳児用品・生理用品・ペット用品は、必要な家庭では最初から備えてください。</p><p>3日分は備えを始める目安です。建物や周囲が危険なときは避難を優先してください。商品の価格・在庫・配送日・保存期間・付属品は購入先で確認できます。</p><a href="https://www.bousai.go.jp/kyoiku/hokenkyousai/check.html" target="_blank" rel="noopener noreferrer">防災庁：最低3日分・できれば1週間分の備蓄 ↗</a><a href="https://www.maff.go.jp/j/zyukyu/foodstock/imadoki/imadoki02_10.html" target="_blank" rel="noopener noreferrer">農林水産省：水の備え ↗</a><a href="https://www.bousai.go.jp/taisaku/hinanjo/pdf/r4_09.pdf" target="_blank" rel="noopener noreferrer">内閣府・消防庁：携帯トイレの備蓄 ↗</a></details></div><section class="more-heading" id="more"><span class="step">もっと知りたい方へ</span><h2>動画・読みもの・備えの知識</h2><p>ドラマ、note、防災ガイド、運営者についてはこちら。</p></section><div class="more-content">${drama}${lower}</div></main><footer><p>備えニキ｜暮らしの備え</p><p>当サイトはAmazonアソシエイト・プログラムに参加しています。</p><a href="/navi/disclaimer/">ご利用にあたって・免責事項</a><small>© ${new Date().getFullYear()} SONAE NIKI</small></footer><script src="/assets/simple-home.js" defer></script><script src="/assets/contact.js" defer></script><script src="/assets/guide-video.js" defer></script></body></html>`;
}
