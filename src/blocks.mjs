import { amz, LINKS, V } from "./config.mjs";
import { ICONS } from "./theme.mjs";
import { esc } from "./layout.mjs";

// ── 見出し
export const h2 = (text, icon, note) =>
  `<h2 class="h2">${icon ? ICONS[icon] : ""}${esc(text)}</h2>` +
  (note ? `<p class="h2-note">${note}</p>` : "");

// ── 本文（**強調** をマークアップに変換）
export const p = (text) =>
  `<p class="p">${text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;

// ── 数字で見る
export const facts = (list) =>
  `<div class="facts">${list
    .map(
      (f) =>
        `<div class="fact"><div class="fact-n">${esc(f.n)}${
          f.unit ? `<em>${esc(f.unit)}</em>` : ""
        }</div><div class="fact-l">${esc(f.label)}</div></div>`
    )
    .join("")}</div>`;

// ── 注意ボックス
export const note = (title, text, kind = "") =>
  `<div class="note${kind ? " " + kind : ""}"><span class="note-t">${esc(
    title
  )}</span>${text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</div>`;

// ── 手順
export const steps = (list) =>
  `<div class="steps">${list
    .map(
      (s) =>
        `<div class="step"><div class="step-t">${esc(
          s.t
        )}</div><div class="step-d">${s.d.replace(
          /\*\*(.+?)\*\*/g,
          "<strong>$1</strong>"
        )}</div></div>`
    )
    .join("")}</div>`;

// ── チェックリスト（結果表示つき）
export const checklist = (id, list) =>
  `<div class="chks" data-chk="${id}">
    ${list
      .map(
        (t, i) =>
          `<label class="chk"><input type="checkbox" data-chk-item="${id}"><span class="chk-t">${esc(
            t
          )}</span></label>`
      )
      .join("")}
    <div class="chk-res">
      <div class="chk-res-n" data-chk-n="${id}">0<em>%</em></div>
      <div class="chk-res-m" data-chk-m="${id}">チェックすると準備度が出ます</div>
      <div class="chk-bar"><i data-chk-bar="${id}"></i></div>
    </div>
  </div>`;

// チェックリスト用スクリプト（全ページ共通）
export const CHK_JS = `
document.querySelectorAll("[data-chk]").forEach(function(box){
  var id=box.getAttribute("data-chk");
  var boxes=box.querySelectorAll("[data-chk-item]");
  var n=box.querySelector("[data-chk-n]"),m=box.querySelector("[data-chk-m]"),bar=box.querySelector("[data-chk-bar]");
  function upd(){
    var done=0;boxes.forEach(function(b){if(b.checked)done++});
    var pct=Math.round(done/boxes.length*100);
    n.innerHTML=pct+"<em>%</em>";
    bar.style.width=pct+"%";
    m.textContent = pct===0?"チェックすると準備度が出ます"
      : pct<=25?"危険水準です。上から順に一つずつ埋めましょう"
      : pct<=50?"まだ穴が大きい状態。今週中に半分を目標に"
      : pct<75?"あと少し。残りは週末に片付けられます"
      : pct<100?"かなり good。最後の一つを埋めれば完成です"
      : "完璧です。あとは年1回の点検を忘れずに";
  }
  boxes.forEach(function(b){b.addEventListener("change",upd)});
});`;

// ── アイテムリスト（priCount 個までを「今すぐ」扱い）
export const items = (list, priCount = 3) =>
  `<div class="items">${list
    .map((it, i) => {
      const pri = i < priCount;
      return `<div class="item${pri ? " pri" : ""}">
      <div class="item-head">
        <span class="item-rank">${pri ? "今すぐ" : "次に"}</span>
        <span class="item-name">${esc(it.name)}</span>
      </div>
      <div class="item-qty">${esc(it.qty)}</div>
      <div class="item-why">${esc(it.why)}</div>
      <a class="item-btn" href="${amz(it.kw)}" target="_blank" rel="noopener sponsored noreferrer">Amazonで探す →</a>
    </div>`;
    })
    .join("")}</div>`;

// ── 動画カード
export const videos = (eyebrow, list) => {
  if (!list || !list.length) {
    return `<div class="yt"><div class="yt-eb">▌${esc(eyebrow)}</div>
      <p class="yt-t">このテーマの動画は近日公開。最新は備えニキのチャンネルで。</p>
      <a class="yt-btn" href="${LINKS.youtube}" target="_blank" rel="noopener noreferrer">▶ チャンネルを見る</a></div>`;
  }
  const [main, ...rest] = list;
  return `<div class="yt"><div class="yt-eb">▌${esc(eyebrow)}</div>
    <p class="yt-t">「${esc(main.title)}」</p>
    <a class="yt-btn" href="${main.url}" target="_blank" rel="noopener noreferrer">▶ 動画で詳しく見る（無料）</a>
    ${
      rest.length
        ? `<div class="yt-more">${rest
            .map(
              (v) =>
                `<a class="yt-row" href="${v.url}" target="_blank" rel="noopener noreferrer"><i>▶</i><span>${esc(
                  v.title
                )}</span></a>`
            )
            .join("")}</div>`
        : ""
    }</div>`;
};

// ── カテゴリタイル
export const tiles = (cats, ids) =>
  `<div class="tiles">${ids
    .map((id) => {
      const c = cats[id];
      return `<a class="tile${c.feat ? " feat" : ""}" href="/${id}/">
      ${ICONS[c.icon]}
      <div class="tile-n">${esc(c.name)}</div>
      <div class="tile-c">${esc(c.catch)}</div>
    </a>`;
    })
    .join("")}</div>`;

// ── ショップ導線（サイト内の備蓄リストが主役、楽天ROOMは備考）
export const shops = () =>
  `<a class="cta" href="/bichiku/" style="margin-top:20px">備蓄リストを全部見る →</a>
  <p class="cta-note">人数を入れると必要量が出ます。チェックした内容はこの端末に残ります</p>
  ${rakutenNote()}`;

// ── 楽天ROOMの備考（備蓄ページにも単体で置く）
export const rakutenNote = () =>
  `<p class="shop-note">楽天派の方へ：同じ備蓄品を
    <a href="${LINKS.rakutenRoom}" target="_blank" rel="noopener sponsored noreferrer">楽天ROOMのコレクション</a>
    にまとめています。ポイントを貯めたい方はこちらから。</p>`;

// ── 広告表記（ページ上部・ステマ規制対応）
export const prLabel = () =>
  `<p class="pr">本ページにはアフィリエイト広告（Amazonアソシエイト・楽天ROOM）を含みます。</p>`;

// ── 免責（ページ下部）
export const disclaimer = (extra = "") =>
  `<div class="disc">
    <div class="disc-t">ご利用にあたって</div>
    <ul class="disc-l">
      ${extra ? `<li>${extra}</li>` : ""}
      <li>本サイトの情報は一般的な防災の目安であり、<strong>個別の状況における安全を保証するものではありません</strong>。</li>
      <li><strong>避難するかどうか、いつ避難するかの判断は、必ず自治体の発表とハザードマップに従ってください。</strong>本サイトの記述を理由に避難を遅らせないでください。</li>
      <li>体調や怪我に関する記述は医療行為の指示ではありません。<strong>症状があるとき、判断に迷うときは、ためらわず119番または医療機関に相談してください。</strong>持病の薬については必ず主治医にご相談ください。</li>
      <li>掲載している数量・商品は目安です。住まい・家族構成・地域によって必要なものは変わります。<strong>最終的な判断と選択はご自身の責任でお願いします。</strong></li>
      <li>掲載内容は作成時点の情報に基づいており、正確性・最新性を保証するものではありません。本サイトの利用によって生じた損害について、運営者は責任を負いかねます。</li>
      <li>商品リンクはAmazonアソシエイト・楽天ROOMを利用しており、購入により運営者が収益を得る場合があります。商品の性能・効果を保証するものではありません。</li>
    </ul>
    <a class="disc-more" href="/disclaimer/">免責事項をすべて読む →</a>
  </div>`;

export { V, ICONS };
