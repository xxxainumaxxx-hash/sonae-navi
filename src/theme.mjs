// ============================================================
// デザインシステム：ネイビー×白／明朝見出し＋ゴシック本文
// ============================================================

export const CSS = `
/* ---------- トークン ---------- */
:root{
  --navy:#0E2A47; --navy-deep:#07182B; --navy-soft:#1E4368;
  --ink:#16212E; --muted:#5C6B7A; --faint:#8494A4;
  --bg:#FFFFFF; --surface:#F5F8FB; --surface-2:#EDF2F7;
  --line:#DCE4EC; --line-soft:#EAEFF4;
  --accent:#B0521C; --accent-bg:#FDF3EC;
  --danger:#A32820; --danger-bg:#FBEDEC;
  --safe:#1B6647; --safe-bg:#ECF5F1;
  --on-navy:#FFFFFF; --on-danger:#FFFFFF;
  --shadow:0 1px 2px rgba(14,42,71,.06),0 8px 24px rgba(14,42,71,.05);
  --mincho:"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP",serif;
  --gothic:"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",sans-serif;
  --wrap:640px;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --navy:#8FB8DE; --navy-deep:#050D18; --navy-soft:#A8C8E6;
    --ink:#E6EDF4; --muted:#9DAEBF; --faint:#7A8B9C;
    --bg:#0A1420; --surface:#111E2D; --surface-2:#16273A;
    --line:#22364C; --line-soft:#1A2B3E;
    --accent:#E8A472; --accent-bg:#2A1A10;
    --danger:#E8817A; --danger-bg:#2C1512;
    --safe:#6FC49B; --safe-bg:#0F2620;
    --on-navy:#07182B; --on-danger:#1A0B09;
    --shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px rgba(0,0,0,.3);
  }
}
:root[data-theme="dark"]{
  --navy:#8FB8DE; --navy-deep:#050D18; --navy-soft:#A8C8E6;
  --ink:#E6EDF4; --muted:#9DAEBF; --faint:#7A8B9C;
  --bg:#0A1420; --surface:#111E2D; --surface-2:#16273A;
  --line:#22364C; --line-soft:#1A2B3E;
  --accent:#E8A472; --accent-bg:#2A1A10;
  --danger:#E8817A; --danger-bg:#2C1512;
  --safe:#6FC49B; --safe-bg:#0F2620;
  --on-navy:#07182B; --on-danger:#1A0B09;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px rgba(0,0,0,.3);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{
  background:var(--bg); color:var(--ink);
  font-family:var(--gothic); font-size:16px; line-height:1.85;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
  font-feature-settings:"palt" 1;
}
img,svg{max-width:100%;display:block}
a{color:inherit}
button{font:inherit;cursor:pointer;border:none;background:none;color:inherit}

/* ---------- ヘッダー ---------- */
.hd{
  position:sticky;top:0;z-index:50;background:var(--bg);
  border-bottom:1px solid var(--line);
}
.hd-in{
  max-width:var(--wrap);margin:0 auto;padding:13px 20px;
  display:flex;align-items:center;gap:12px;
}
.hd-brand{display:flex;align-items:baseline;gap:9px;text-decoration:none;min-width:0}
.hd-mark{
  font-family:var(--mincho);font-size:19px;font-weight:600;
  color:var(--navy);letter-spacing:.08em;white-space:nowrap;
}
.hd-sub{font-size:11px;color:var(--faint);letter-spacing:.06em;white-space:nowrap}
.hd-nav{margin-left:auto;display:flex;gap:18px;flex-shrink:0}
.hd-nav a{
  font-size:13px;color:var(--muted);text-decoration:none;
  padding-bottom:2px;border-bottom:1px solid transparent;
}
.hd-nav a:hover{color:var(--navy);border-bottom-color:var(--navy)}
@media(max-width:520px){ .hd-sub{display:none} .hd-nav{gap:14px} .hd-nav a{font-size:12px} }

/* ---------- 共通レイアウト ---------- */
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 20px}
.sect{margin:52px 0}
.sect-lead{margin:40px 0}

/* ---------- パンくず ---------- */
.crumb{
  max-width:var(--wrap);margin:0 auto;padding:14px 20px 0;
  font-size:12px;color:var(--faint);
}
.crumb a{color:var(--muted);text-decoration:none}
.crumb a:hover{text-decoration:underline}
.crumb span{margin:0 6px;opacity:.5}

/* ---------- ヒーロー ---------- */
.hero{padding:44px 0 8px}
.hero-eyebrow{
  font-size:12px;letter-spacing:.18em;color:var(--accent);
  font-weight:700;margin-bottom:16px;
}
.hero h1{
  font-family:var(--mincho);font-weight:600;
  font-size:clamp(28px,7vw,40px);line-height:1.45;
  letter-spacing:.02em;color:var(--navy);margin-bottom:18px;
}
.hero-lead{font-size:15px;color:var(--muted);line-height:1.95;max-width:34em}
.hero-lead .lead-note{display:inline-block;margin-top:10px;font-size:13px;color:var(--faint);line-height:1.8}
.hero-icon{
  width:44px;height:44px;color:var(--navy);margin-bottom:18px;stroke-width:1.3;
}

/* ---------- 見出し ---------- */
.h2{
  font-family:var(--mincho);font-weight:600;font-size:23px;
  color:var(--navy);line-height:1.5;letter-spacing:.02em;
  padding-bottom:12px;margin-bottom:8px;
  border-bottom:1px solid var(--line);
  display:flex;align-items:center;gap:10px;
}
.h2 svg{width:21px;height:21px;stroke-width:1.5;flex-shrink:0}
.h2-note{font-size:13px;color:var(--faint);margin-bottom:22px;line-height:1.8}
.h3{
  font-family:var(--mincho);font-weight:600;font-size:18px;
  color:var(--navy);margin-bottom:6px;line-height:1.6;
}

/* ---------- 本文 ---------- */
.p{font-size:15px;line-height:1.95;color:var(--ink);margin-bottom:16px}
.p:last-child{margin-bottom:0}
.p strong{font-weight:700;color:var(--navy);
  background:linear-gradient(transparent 62%,var(--accent-bg) 62%)}

/* ---------- 数字で見るブロック ---------- */
.facts{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
  background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:24px 0}
.fact{background:var(--surface);padding:20px 18px;box-shadow:0 0 0 .5px var(--line)}
.fact-n{font-family:var(--mincho);font-size:34px;font-weight:600;
  color:var(--navy);line-height:1.15;letter-spacing:-.01em}
.fact-n em{font-style:normal;font-size:17px;margin-left:2px}
.fact-l{font-size:12.5px;color:var(--muted);line-height:1.7;margin-top:7px}
@media(max-width:359px){.facts{grid-template-columns:1fr}}

/* ---------- 注意ボックス ---------- */
.note{
  border-left:3px solid var(--accent);background:var(--accent-bg);
  border-radius:0 10px 10px 0;padding:16px 18px;margin:22px 0;
  font-size:14px;line-height:1.9;color:var(--ink);
}
.note-t{font-weight:700;color:var(--accent);font-size:13px;
  letter-spacing:.04em;margin-bottom:5px;display:block}
.note.danger{border-left-color:var(--danger);background:var(--danger-bg)}
.note.danger .note-t{color:var(--danger)}
.note.safe{border-left-color:var(--safe);background:var(--safe-bg)}
.note.safe .note-t{color:var(--safe)}

/* ---------- ステップ ---------- */
.steps{counter-reset:s;margin:22px 0}
.step{
  counter-increment:s;position:relative;padding:0 0 22px 46px;
  border-left:1px solid var(--line);margin-left:14px;
}
.step:last-child{border-left-color:transparent;padding-bottom:0}
.step::before{
  content:counter(s);position:absolute;left:-14px;top:0;
  width:28px;height:28px;border-radius:50%;
  background:var(--navy);color:var(--on-navy);
  font-size:13px;font-weight:700;display:grid;place-items:center;
}
.step-t{font-weight:700;font-size:15.5px;color:var(--ink);margin:2px 0 5px;line-height:1.6}
.step-d{font-size:14px;color:var(--muted);line-height:1.85}

/* ---------- チェックリスト ---------- */
.chks{margin:20px 0 0}
.chk{
  display:flex;gap:13px;align-items:flex-start;
  padding:15px 17px;margin-bottom:9px;
  background:var(--surface);border:1px solid var(--line);border-radius:11px;
  cursor:pointer;transition:border-color .15s,background .15s;
}
.chk:hover{border-color:var(--navy-soft)}
.chk input{
  appearance:none;-webkit-appearance:none;flex-shrink:0;
  width:21px;height:21px;margin-top:1px;border-radius:6px;
  border:1.5px solid var(--line);background:var(--bg);
  cursor:pointer;position:relative;transition:.15s;
}
.chk input:checked{background:var(--safe);border-color:var(--safe)}
.chk input:checked::after{
  content:"";position:absolute;left:6.5px;top:2.5px;
  width:5px;height:10px;border:solid #fff;border-width:0 2px 2px 0;
  transform:rotate(45deg);
}
.chk-t{font-size:14.5px;line-height:1.7;font-weight:500}
.chk input:checked ~ .chk-t{color:var(--muted)}
.chk-res{
  margin-top:14px;padding:20px;border-radius:12px;
  background:var(--surface-2);border:1px solid var(--line);text-align:center;
}
.chk-res-n{font-family:var(--mincho);font-size:42px;font-weight:600;
  color:var(--navy);line-height:1.1}
.chk-res-n em{font-style:normal;font-size:20px}
.chk-res-m{font-size:13.5px;color:var(--muted);margin-top:6px;line-height:1.7}
.chk-bar{height:5px;background:var(--line);border-radius:3px;margin-top:14px;overflow:hidden}
.chk-bar i{display:block;height:100%;width:0;background:var(--safe);
  border-radius:3px;transition:width .45s cubic-bezier(.4,0,.2,1)}

/* ---------- アイテムカード ---------- */
.items{margin:22px 0 0}
.item{
  border:1px solid var(--line);border-radius:13px;
  padding:19px 19px 17px;margin-bottom:11px;background:var(--bg);
}
.item.pri{border-color:var(--navy-soft);background:var(--surface)}
.item-head{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}
.item-rank{
  font-size:10.5px;font-weight:700;letter-spacing:.09em;
  padding:3px 9px;border-radius:20px;
  background:var(--surface-2);color:var(--muted);flex-shrink:0;
}
.item.pri .item-rank{background:var(--navy);color:var(--on-navy)}
.item-name{font-size:16.5px;font-weight:700;color:var(--ink);line-height:1.5}
.item-qty{
  font-size:13.5px;color:var(--accent);font-weight:700;
  margin-bottom:6px;line-height:1.7;
}
.item-qty::before{content:"目安 ";font-weight:500;color:var(--faint);font-size:12px}
.item-why{font-size:13.5px;color:var(--muted);line-height:1.85;margin-bottom:15px}
.item-btn{
  display:block;text-align:center;text-decoration:none;
  padding:12px;border-radius:9px;font-size:14px;font-weight:700;
  border:1px solid var(--navy);color:var(--navy);
  transition:background .15s,color .15s;
}
.item-btn:hover{background:var(--navy);color:var(--on-navy)}
.item.pri .item-btn{background:var(--navy);color:var(--on-navy)}
.item.pri .item-btn:hover{opacity:.85}

/* ---------- カテゴリタイル ---------- */
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:11px;margin-top:20px}
.tile{
  display:block;text-decoration:none;padding:20px 18px;
  border:1px solid var(--line);border-radius:13px;background:var(--bg);
  transition:border-color .15s,transform .15s,box-shadow .15s;
}
.tile:hover{border-color:var(--navy-soft);transform:translateY(-2px);box-shadow:var(--shadow)}
.tile svg{width:26px;height:26px;color:var(--navy);stroke-width:1.4;margin-bottom:12px}
.tile-n{font-family:var(--mincho);font-size:16.5px;font-weight:600;
  color:var(--navy);margin-bottom:5px;line-height:1.5}
.tile-c{font-size:12px;color:var(--muted);line-height:1.7}
.tile.feat{background:var(--surface);border-color:var(--navy-soft)}

/* ---------- CTA ---------- */
.cta{
  display:block;width:100%;text-align:center;text-decoration:none;
  background:var(--navy);color:var(--on-navy);
  padding:18px;border-radius:11px;font-size:16.5px;font-weight:700;
  letter-spacing:.02em;transition:opacity .15s;
}
.cta:hover{opacity:.87}
.cta-note{font-size:12px;color:var(--faint);text-align:center;margin-top:11px}
.cta-ghost{
  display:block;text-align:center;text-decoration:none;
  border:1px solid var(--line);color:var(--muted);
  padding:14px;border-radius:10px;font-size:14px;font-weight:600;
}
.cta-ghost:hover{border-color:var(--navy-soft);color:var(--navy)}

/* ---------- 動画 ---------- */
.yt{
  border:1px solid var(--line);border-radius:13px;
  padding:22px;background:var(--surface);margin:24px 0;
}
.yt-eb{font-size:11.5px;font-weight:700;letter-spacing:.13em;
  color:var(--danger);margin-bottom:11px}
.yt-t{font-family:var(--mincho);font-size:16px;font-weight:600;
  line-height:1.65;color:var(--ink);margin-bottom:16px}
.yt-btn{
  display:block;text-align:center;text-decoration:none;
  background:var(--danger);color:var(--on-danger);padding:13px;border-radius:9px;
  font-size:14.5px;font-weight:700;
}
.yt-btn:hover{opacity:.88}
.yt-more{margin-top:6px}
.yt-row{
  display:flex;gap:10px;align-items:flex-start;
  padding:12px 0;border-top:1px solid var(--line);
  text-decoration:none;color:var(--ink);font-size:13.5px;line-height:1.7;
}
.yt-row:hover{color:var(--danger)}
.yt-row i{color:var(--danger);font-style:normal;flex-shrink:0;font-size:11px;margin-top:4px}

/* ---------- ショップボタン ---------- */
.shops{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:20px}
.shop{
  display:block;text-align:center;text-decoration:none;
  border:1px solid var(--line);border-radius:12px;padding:18px 12px;
  background:var(--bg);transition:border-color .15s;
}
.shop:hover{border-color:var(--navy-soft)}
.shop-n{font-size:14px;font-weight:700;color:var(--navy);line-height:1.6}
.shop-d{font-size:11.5px;color:var(--faint);margin-top:3px}
@media(max-width:400px){.shops{grid-template-columns:1fr}}

/* ---------- 診断 ---------- */
.q-bar{height:4px;background:var(--line);border-radius:2px;margin-bottom:28px;overflow:hidden}
.q-bar i{display:block;height:100%;width:0;background:var(--navy);
  border-radius:2px;transition:width .35s cubic-bezier(.4,0,.2,1)}
.q-n{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--faint);margin-bottom:10px}
.q-q{font-family:var(--mincho);font-size:26px;font-weight:600;
  color:var(--navy);line-height:1.5;margin-bottom:7px}
.q-s{font-size:13.5px;color:var(--muted);margin-bottom:26px;min-height:20px;line-height:1.8}
.q-opt{
  display:block;width:100%;text-align:left;
  padding:17px 19px;margin-bottom:10px;border-radius:11px;
  border:1px solid var(--line);background:var(--bg);
  font-size:16px;font-weight:600;color:var(--ink);transition:.15s;
}
.q-opt:hover{border-color:var(--navy);background:var(--surface)}
.q-back{font-size:13.5px;color:var(--faint);margin-top:12px;text-decoration:none;display:inline-block}
.q-back:hover{color:var(--navy)}

.score-card{
  border:1px solid var(--line);border-radius:14px;
  padding:26px;background:var(--surface);margin-bottom:13px;
}
.score-l{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--faint);margin-bottom:12px}
.score-row{display:flex;align-items:baseline;gap:5px}
.score-n{font-family:var(--mincho);font-size:60px;font-weight:600;
  color:var(--navy);line-height:1}
.score-u{font-family:var(--mincho);font-size:24px;font-weight:600;color:var(--navy)}
.score-b{
  margin-left:auto;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;
  background:var(--danger-bg);color:var(--danger);align-self:center;
}
.score-g{height:8px;background:var(--line);border-radius:4px;margin-top:18px;overflow:hidden}
.score-g i{display:block;height:100%;width:0;border-radius:4px;
  background:linear-gradient(90deg,var(--danger),var(--accent));
  transition:width 1.1s cubic-bezier(.3,0,.2,1)}
.score-note{font-size:12.5px;color:var(--muted);margin-top:14px;line-height:1.8}
.type-n{font-family:var(--mincho);font-size:27px;font-weight:600;
  color:var(--navy);margin-bottom:9px;line-height:1.45}
.type-n em{font-style:normal;font-size:15px;color:var(--accent)}
.risk{display:flex;gap:10px;font-size:14px;line-height:1.8;margin-bottom:9px;color:var(--ink)}
.risk i{color:var(--danger);font-style:normal;flex-shrink:0;font-weight:700}

/* ---------- フッター ---------- */
.ft{background:var(--navy-deep);color:#C9D6E3;margin-top:72px;padding:44px 0 34px}
.ft-in{max-width:var(--wrap);margin:0 auto;padding:0 20px}
.ft-mark{font-family:var(--mincho);font-size:19px;color:#fff;
  letter-spacing:.08em;margin-bottom:8px}
.ft-d{font-size:13px;line-height:1.9;color:#8FA3B8;margin-bottom:24px;max-width:32em}
.ft-nav{display:flex;flex-wrap:wrap;gap:9px 22px;margin-bottom:26px}
.ft-nav a{font-size:13.5px;color:#C9D6E3;text-decoration:none}
.ft-nav a:hover{color:#fff;text-decoration:underline}
.ft-sns{display:flex;gap:11px;margin-bottom:26px}
.ft-sns a{
  font-size:13px;font-weight:700;text-decoration:none;color:#C9D6E3;
  border:1px solid #24405C;border-radius:8px;padding:9px 16px;
}
.ft-sns a:hover{border-color:#4A7098;color:#fff}
.ft-fine{font-size:11.5px;line-height:1.9;color:#6B8199;
  border-top:1px solid #1A3149;padding-top:20px}

.shop-note{font-size:12.5px;color:var(--muted);line-height:1.8;
  text-align:center;margin-top:18px;padding-top:16px;border-top:1px solid var(--line-soft)}
.shop-note a{color:var(--navy);font-weight:700;text-underline-offset:3px}
.shop-note a:hover{color:var(--accent)}
.pr{
  font-size:11.5px;color:var(--faint);line-height:1.7;
  max-width:var(--wrap);margin:0 auto;padding:10px 20px 0;
}
.disc{
  border:1px solid var(--line);border-radius:12px;
  background:var(--surface);padding:22px 24px;margin-top:44px;
}
.disc-t{font-family:var(--mincho);font-size:16px;font-weight:600;
  color:var(--navy);margin-bottom:12px}
.disc-l{list-style:none;margin:0;padding:0}
.disc-l li{
  font-size:12.5px;line-height:1.85;color:var(--muted);
  padding-left:16px;position:relative;margin-bottom:9px;
}
.disc-l li::before{content:"・";position:absolute;left:0;color:var(--faint)}
.disc-l strong{font-weight:700;color:var(--ink)}
.disc-more{
  display:inline-block;margin-top:8px;font-size:12.5px;font-weight:700;
  color:var(--navy);text-decoration:none;border-bottom:1px solid var(--navy);
}
.disc-more:hover{color:var(--accent);border-bottom-color:var(--accent)}

/* 免責事項ページ */
.legal h2{font-family:var(--mincho);font-size:20px;font-weight:600;color:var(--navy);
  margin:40px 0 12px;padding-bottom:10px;border-bottom:1px solid var(--line)}
.legal p{font-size:14.5px;line-height:1.95;color:var(--ink);margin-bottom:14px}
.legal ul{margin:0 0 16px;padding-left:20px}
.legal li{font-size:14.5px;line-height:1.9;color:var(--ink);margin-bottom:8px}
.legal strong{font-weight:700;color:var(--navy)}
.legal .lead{font-size:15px;color:var(--muted);line-height:1.95;margin-bottom:8px}
`;

// ============================================================
// 線画アイコン（stroke=currentColor）
// ============================================================
const ic = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const ICONS = {
  kaji: ic(`<path d="M12 3c.6 3 2.2 4 3.6 5.5A7.5 7.5 0 0 1 18 14a6 6 0 0 1-12 0c0-2 .8-3.4 1.8-4.4.3 1 .9 1.7 1.7 2 .2-3.2 1.2-6 2.5-8.6Z"/><path d="M12 20a3 3 0 0 1-3-3c0-1.4 1.2-2.4 1.8-3.6.5 1 1.2 1.4 2 1.8.8.5 2.2 1 2.2 2.5a3 3 0 0 1-3 2.3Z"/>`),
  suigai: ic(`<path d="M12 2.5s5.5 6 5.5 9.8A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.7C6.5 8.5 12 2.5 12 2.5Z"/><path d="M2 20.2c1.7 0 1.7 1.3 3.3 1.3s1.7-1.3 3.4-1.3 1.7 1.3 3.3 1.3 1.7-1.3 3.4-1.3 1.7 1.3 3.3 1.3 1.7-1.3 3.3-1.3"/>`),
  bichiku: ic(`<path d="M3 8.2 12 3.5l9 4.7v7.6L12 20.5 3 15.8Z"/><path d="M3 8.2 12 13l9-4.8M12 13v7.5"/><path d="M7.5 5.8 16.5 10.6"/>`),
  jishin: ic(`<path d="M4 21V9.2l5.5-3.4V21M9.5 21V3.6L15 6.2V21M15 21v-8.4l5 2.2V21M2.5 21h19"/><path d="M7 12h.01M7 16h.01M12 10h.01M12 14h.01M12 18h.01"/>`),
  teiden: ic(`<path d="M13.2 2.5 4.5 13.4h6.1l-1.3 8.1 8.9-11.2h-6.3Z"/>`),
  bouhan: ic(`<path d="M12 2.7 4.5 5.9v6c0 4.6 3.2 8.4 7.5 9.4 4.3-1 7.5-4.8 7.5-9.4v-6Z"/><path d="M9.3 11.9l1.9 2 3.5-3.8"/>`),
  neage: ic(`<path d="M3 17.5 9 11l4 3.4 7.5-8"/><path d="M15.5 6.4H21v5.3"/><path d="M3 21h18"/>`),
  okane: ic(`<circle cx="12" cy="12" r="8.6"/><path d="M12 6.6v10.8M14.9 9.1c-.6-.8-1.7-1.2-2.9-1.2-1.8 0-2.9.9-2.9 2.2 0 3 5.9 1.6 5.9 4.6 0 1.4-1.2 2.3-3 2.3-1.3 0-2.4-.5-3-1.3"/>`),
  check: ic(`<path d="M9 11.5l2.3 2.3L15.5 9"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/>`),
  list: ic(`<path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"/><path d="M3.6 6.5h.01M3.6 12h.01M3.6 17.5h.01"/>`),
  play: ic(`<circle cx="12" cy="12" r="9"/><path d="M10.2 8.6l5.2 3.4-5.2 3.4Z"/>`),
  alert: ic(`<path d="M12 3.7 2.6 20h18.8Z"/><path d="M12 10v4M12 17h.01"/>`),
  dosha: ic(`<path d="M2.5 20.5h19"/><path d="M3 20.5 11 7l4.2 7"/><path d="M13.2 20.5 18 12l3.5 8.5"/><circle cx="8.4" cy="16.6" r="1.5"/><circle cx="13.6" cy="18.4" r="1.1"/><circle cx="17.6" cy="16.2" r="1.3"/>`),
  taifu: ic(`<path d="M12 12c0-2.6 2.2-4.7 5-4.7 2.2 0 3.8 1.4 3.8 3.2 0 1.4-1.1 2.4-2.6 2.4"/><path d="M12 12c2.6 0 4.7 2.2 4.7 5 0 2.2-1.4 3.8-3.2 3.8-1.4 0-2.4-1.1-2.4-2.6"/><path d="M12 12c0 2.6-2.2 4.7-5 4.7-2.2 0-3.8-1.4-3.8-3.2 0-1.4 1.1-2.4 2.6-2.4"/><path d="M12 12c-2.6 0-4.7-2.2-4.7-5 0-2.2 1.4-3.8 3.2-3.8 1.4 0 2.4 1.1 2.4 2.6"/><circle cx="12" cy="12" r="1"/>`),
  tsunami: ic(`<path d="M2.6 17.5c1.6 0 1.6 1.3 3.2 1.3s1.6-1.3 3.2-1.3 1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3 1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3"/><path d="M3 14.2c0-5.4 4-9.4 8.6-9.4 3.6 0 6.2 2.3 6.2 5.2 0 2.2-1.6 3.8-3.6 3.8-1.5 0-2.6-1-2.6-2.3"/><path d="M21 6.6c-1.4.5-2.3 1.5-2.7 2.8"/>`),
  necchusho: ic(`<path d="M9.5 13.6V5.3a2.1 2.1 0 0 1 4.2 0v8.3a3.9 3.9 0 1 1-4.2 0Z"/><circle cx="11.6" cy="17.2" r="1.6"/><path d="M17.8 5.2h3.4M17.8 8.6h2.4M17.8 12h3"/>`),
  ooyuki: ic(`<path d="M12 2.8v18.4M4.1 7.4l15.8 9.2M19.9 7.4 4.1 16.6"/><path d="M12 6.6 9.9 4.9M12 6.6l2.1-1.7M12 17.4l-2.1 1.7M12 17.4l2.1 1.7"/><path d="M6.9 9.2 6.5 6.6M6.9 9.2 4.4 9.7M17.1 14.8l.4 2.6M17.1 14.8l2.5-.5"/>`),
  kaminari: ic(`<path d="M6.8 15.6a3.9 3.9 0 0 1 .5-7.8h.4a5.2 5.2 0 0 1 10 1.4 3.4 3.4 0 0 1-.5 6.4"/><path d="M13.4 11.6 9.8 16.8h3.1l-1.1 4.6 4-5.6h-3.2Z"/>`),
  mizu: ic(`<path d="M12 3.2s5.6 6.2 5.6 10a5.6 5.6 0 0 1-11.2 0c0-3.8 5.6-10 5.6-10Z"/><path d="M9.4 13.4a2.7 2.7 0 0 0 2.6 3"/>`),
  shokuryo: ic(`<path d="M3.4 11.4h17.2a8.6 8.6 0 0 1-8.6 7.4 8.6 8.6 0 0 1-8.6-7.4Z"/><path d="M2.4 21.2h19.2"/><path d="M8.6 8.2c0-1.2 1-1.6 1-2.6s-.7-1.4-.7-1.4M12 8.2c0-1.2 1-1.6 1-2.6s-.7-1.4-.7-1.4M15.4 8.2c0-1.2 1-1.6 1-2.6s-.7-1.4-.7-1.4"/>`),
  toire: ic(`<path d="M5.4 3.4v7.2c0 3.4 2.2 6.2 5 6.7v3.3"/><path d="M4 10.6h9.4"/><path d="M10.4 20.6h5.6"/><path d="M16.6 3.4c1.7 0 3 1.3 3 3v6.4c0 1.5-1.2 2.7-2.7 2.7h-.6l.5 5.1"/>`),
  eisei: ic(`<path d="M8.6 8.2h5.2a2.4 2.4 0 0 1 2.4 2.4v8.6a2.4 2.4 0 0 1-2.4 2.4H8.6a2.4 2.4 0 0 1-2.4-2.4v-8.6a2.4 2.4 0 0 1 2.4-2.4Z"/><path d="M9.6 8.2V5.4a1.8 1.8 0 0 1 1.8-1.8h1.2"/><path d="M14.4 3.6h3.4M15.6 5.9h2.8M14.8 1.6h2.6"/><path d="M6.2 13h10"/>`),
  iyaku: ic(`<rect x="2.8" y="8.6" width="12.4" height="7.4" rx="3.7" transform="rotate(-45 2.8 8.6)"/><path d="M8.9 8.9 14 14"/><path d="M17.4 14.2v5.4M14.7 16.9h5.4"/>`),
  mochidashi: ic(`<path d="M5.4 8.6h13.2a1.6 1.6 0 0 1 1.6 1.7l-.7 9.2a1.6 1.6 0 0 1-1.6 1.5H6.1a1.6 1.6 0 0 1-1.6-1.5l-.7-9.2a1.6 1.6 0 0 1 1.6-1.7Z"/><path d="M8.8 8.6V6.2a3.2 3.2 0 0 1 6.4 0v2.4"/><path d="M4.4 13.4h15.2"/>`),
  book: ic(`<path d="M4 4.5h6a3 3 0 0 1 3 3V20a2.4 2.4 0 0 0-2.4-2.4H4Z"/><path d="M20 4.5h-6a3 3 0 0 0-3 3V20a2.4 2.4 0 0 1 2.4-2.4H20Z"/>`),
};

// ============================================================
// 災害ページ（4ブロック構成）用の追加スタイル
// ============================================================
export const CSS_DISASTER = `
/* ── ① 脅威フック（オレンジ枠） */
.threat{
  border:1px solid var(--accent);border-left-width:4px;
  background:var(--accent-bg);border-radius:0 12px 12px 0;
  padding:22px 24px;margin:30px 0 8px;
}
.threat-h{
  font-family:var(--mincho);font-weight:600;font-size:19px;
  color:var(--accent);line-height:1.6;margin-bottom:12px;
}
.threat-b{font-size:14.5px;line-height:1.95;color:var(--ink)}
.threat-b strong{font-weight:700;color:var(--accent)}

/* ── STEP切り替えナビ */
.stepnav{
  position:sticky;top:53px;z-index:40;background:var(--bg);
  border-bottom:1px solid var(--line);margin:26px 0 0;padding:0 20px;
}
.stepnav-in{display:flex;gap:0;max-width:var(--wrap);margin:0 auto}
.stepnav a{
  flex:1;text-align:center;text-decoration:none;padding:14px 4px 12px;
  font-size:13.5px;font-weight:700;color:var(--muted);
  border-bottom:2px solid transparent;transition:.15s;
}
.stepnav a:hover{color:var(--navy);border-bottom-color:var(--navy)}
.stepnav a em{font-style:normal;display:block;font-size:10.5px;
  font-weight:600;color:var(--faint);letter-spacing:.1em;margin-bottom:2px}

/* ── STEP見出し */
.steph{display:flex;align-items:flex-start;gap:14px;margin:56px 0 6px;scroll-margin-top:110px}
.steph-n{
  flex-shrink:0;width:38px;height:38px;border-radius:10px;
  display:grid;place-items:center;font-size:12px;font-weight:700;
  letter-spacing:.04em;background:var(--navy);color:var(--on-navy);
}
.steph.warn .steph-n{background:var(--danger)}
.steph.buy .steph-n{background:var(--accent)}
.steph-t{font-family:var(--mincho);font-weight:600;font-size:23px;
  color:var(--navy);line-height:1.45}
.steph.warn .steph-t{color:var(--danger)}
.steph.buy .steph-t{color:var(--accent)}
.steph-s{font-size:12.5px;color:var(--faint);margin-top:3px;line-height:1.7}

/* ── 行動リスト（防ぐ＝紺チェック／逃げる＝赤!） */
.acts{margin:22px 0 0}
.act{
  display:flex;gap:14px;align-items:flex-start;
  border:1px solid var(--line);border-radius:12px;
  padding:18px 19px;margin-bottom:10px;background:var(--bg);
}
.act-i{
  flex-shrink:0;width:26px;height:26px;border-radius:50%;margin-top:1px;
  display:grid;place-items:center;font-size:14px;font-weight:700;
  border:1.5px solid var(--navy);color:var(--navy);background:var(--bg);
}
.acts.warn .act{background:var(--danger-bg);border-color:var(--danger)}
.acts.warn .act-i{border-color:var(--danger);color:#fff;background:var(--danger)}
.act-t{font-weight:700;font-size:15.5px;line-height:1.6;color:var(--ink);margin-bottom:6px}
.acts.warn .act-t{color:var(--danger)}
.act-d{font-size:13.5px;line-height:1.9;color:var(--muted)}
.act-d strong{font-weight:700;color:var(--ink)}
.acts.warn .act-d strong{color:var(--danger)}

/* ── 備蓄ページへの受け渡し */
.tobichiku{
  background:var(--navy);border-radius:14px;padding:24px;margin:36px 0 0;
}
.tobichiku-t{font-family:var(--mincho);font-size:18px;font-weight:600;
  color:var(--on-navy);line-height:1.55;margin-bottom:10px}
.tobichiku-d{font-size:13.5px;line-height:1.85;color:var(--on-navy);opacity:.78;margin-bottom:18px}
.tobichiku-b{
  display:block;text-align:center;text-decoration:none;
  background:var(--bg);color:var(--navy);font-size:15px;font-weight:700;
  padding:14px;border-radius:9px;
}
.tobichiku-b:hover{opacity:.88}

/* ── 備えるモノ：カテゴリ網羅 */
.gearg{margin-top:34px}
.gearg-h{
  font-family:var(--mincho);font-weight:600;font-size:18px;color:var(--navy);
  padding-bottom:9px;border-bottom:1px solid var(--line);
  display:flex;align-items:baseline;gap:10px;
}
.gearg-h span{font-size:11.5px;font-weight:600;color:var(--faint);
  font-family:var(--gothic);letter-spacing:.04em;margin-left:auto;flex-shrink:0}
.gearg-n{font-size:12.5px;color:var(--faint);line-height:1.75;margin:9px 0 4px}
.grow{
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:16px 0;border-bottom:1px solid var(--line-soft);
}
.grow-m{flex:1;min-width:200px}
.grow-n{font-size:15.5px;font-weight:700;color:var(--ink);line-height:1.55;
  display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.grow-p{font-size:10.5px;font-weight:700;letter-spacing:.06em;
  padding:2px 8px;border-radius:20px;background:var(--navy);color:var(--on-navy)}
.grow-w{font-size:13px;color:var(--muted);line-height:1.8;margin-top:4px}
.grow-b{
  flex-shrink:0;text-decoration:none;white-space:nowrap;
  border:1px solid var(--navy);color:var(--navy);
  padding:10px 20px;border-radius:8px;font-size:13.5px;font-weight:700;
  transition:.15s;
}
.grow-b:hover{background:var(--accent);border-color:var(--accent);color:#fff}
@media(max-width:479px){
  .grow-b{width:100%;text-align:center}
}
`;

// ============================================================
// トップページ用の追加スタイル
// ============================================================
export const CSS_HOME = `
/* ── ヒーロー（紺帯）＋ 防ぐ・逃げる・備える */
.thero{background:var(--navy-deep);color:#fff;padding:52px 0 44px;margin-bottom:8px}
.thero-in{max-width:var(--wrap);margin:0 auto;padding:0 20px}
.thero-eb{font-size:12px;letter-spacing:.18em;color:#E8A472;font-weight:700;margin-bottom:16px}
.thero h1{
  font-family:var(--mincho);font-weight:600;color:#fff;
  font-size:clamp(27px,6.6vw,38px);line-height:1.5;letter-spacing:.02em;margin-bottom:16px;
}
.thero-l{font-size:14.5px;line-height:1.95;color:#B9CBDC;max-width:33em;margin-bottom:32px}
.tsteps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tstep{
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);
  border-radius:12px;padding:18px 14px;text-align:center;
}
.tstep-n{font-size:10.5px;font-weight:700;letter-spacing:.14em;color:#8FB8DE;margin-bottom:7px}
.tstep-t{font-family:var(--mincho);font-size:19px;font-weight:600;color:#fff;line-height:1.4}
.tstep-d{font-size:11.5px;color:#9FB4C8;line-height:1.65;margin-top:6px}
@media(max-width:479px){ .tstep-d{display:none} .tstep{padding:15px 8px} .tstep-t{font-size:17px} }

/* ── 災害カード（ホバーで浮く＋上部にオレンジのライン） */
.dcards{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-top:20px}
@media(min-width:600px){ .dcards{grid-template-columns:repeat(4,1fr)} }
.dcard{
  position:relative;display:block;text-decoration:none;overflow:hidden;
  border:1px solid var(--line);border-radius:13px;background:var(--bg);
  padding:22px 16px 18px;text-align:center;
  transition:transform .18s,box-shadow .18s,border-color .18s;
}
.dcard::before{
  content:"";position:absolute;top:0;left:0;right:0;height:3px;
  background:var(--accent);transform:scaleX(0);transform-origin:center;
  transition:transform .22s cubic-bezier(.4,0,.2,1);
}
.dcard:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--navy-soft)}
.dcard:hover::before{transform:scaleX(1)}
.dcard svg{width:30px;height:30px;color:var(--navy);stroke-width:1.35;margin:0 auto 13px}
.dcard-n{font-family:var(--mincho);font-size:16px;font-weight:600;color:var(--navy);line-height:1.45}
.dcard-c{font-size:11.5px;color:var(--faint);line-height:1.6;margin-top:5px}
.dcard.soon{opacity:.5;pointer-events:none}
.dcard.soon .dcard-c{color:var(--accent)}

/* ── セクション見出し（トップ） */
.thead{margin:56px 0 0}
.thead-t{font-family:var(--mincho);font-weight:600;font-size:22px;color:var(--navy);
  line-height:1.5;padding-bottom:11px;border-bottom:1px solid var(--line)}
.thead-d{font-size:13px;color:var(--faint);line-height:1.8;margin-top:11px}
`;

// ============================================================
// 備蓄ページ専用スタイル
// ============================================================
export const CSS_BICHIKU = `
/* ── 人数入力（追従） */
.calc{
  position:sticky;top:53px;z-index:41;background:var(--bg);
  border-bottom:1px solid var(--line);padding:12px 20px;
}
.calc-in{max-width:var(--wrap);margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.calc-l{font-size:12.5px;font-weight:700;color:var(--muted);white-space:nowrap}
.calc-btns{display:flex;gap:6px;align-items:center}
.calc-b{
  width:34px;height:34px;border-radius:9px;border:1px solid var(--line);
  background:var(--bg);color:var(--navy);font-size:18px;font-weight:700;
  display:grid;place-items:center;line-height:1;
}
.calc-b:hover{border-color:var(--navy);background:var(--surface)}
.calc-n{
  font-family:var(--mincho);font-size:24px;font-weight:600;color:var(--navy);
  min-width:2.2em;text-align:center;line-height:1;
}
.calc-n em{font-style:normal;font-size:13px;font-family:var(--gothic);margin-left:2px}
.calc-hint{font-size:11.5px;color:var(--faint);margin-left:auto;line-height:1.5}
@media(max-width:520px){ .calc-hint{width:100%;margin:2px 0 0;text-align:left} }

/* ── カテゴリ追従ナビ（横スクロール） */
.bnav{
  position:sticky;top:113px;z-index:40;background:var(--bg);
  border-bottom:1px solid var(--line);
}
.bnav-in{
  max-width:var(--wrap);margin:0 auto;display:flex;gap:2px;
  overflow-x:auto;scrollbar-width:none;padding:0 14px;
}
.bnav-in::-webkit-scrollbar{display:none}
.bnav a{
  flex-shrink:0;text-decoration:none;padding:11px 12px 9px;
  font-size:13px;font-weight:700;color:var(--muted);white-space:nowrap;
  border-bottom:2px solid transparent;
}
.bnav a:hover{color:var(--navy);border-bottom-color:var(--navy)}
.bnav a i{font-style:normal;color:var(--faint);font-size:11px;margin-right:5px}

/* ── カテゴリ本体 */
.bcat{margin:52px 0 0;scroll-margin-top:170px}
.bcat-h{display:flex;align-items:flex-start;gap:13px;margin-bottom:6px}
.bcat-ic{
  flex-shrink:0;width:42px;height:42px;border-radius:11px;
  background:var(--surface);border:1px solid var(--line);
  display:grid;place-items:center;color:var(--navy);
}
.bcat-ic svg{width:23px;height:23px;stroke-width:1.4}
.bcat-no{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--faint);margin-bottom:2px}
.bcat-n{font-family:var(--mincho);font-size:25px;font-weight:600;color:var(--navy);line-height:1.3}

/* ── 最低／理想 */
.amts{display:grid;grid-template-columns:1fr 1fr;gap:1px;
  background:var(--surface);border:1px solid var(--line);
  border-radius:12px;overflow:hidden;margin:18px 0}
.amt{background:var(--surface);padding:16px 16px 14px;box-shadow:0 0 0 .5px var(--line)}
.amt-l{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--faint);margin-bottom:7px}
.amt.ideal .amt-l{color:var(--safe)}
.amt-v{font-family:var(--mincho);font-size:26px;font-weight:600;color:var(--navy);line-height:1.2}
.amt.ideal .amt-v{color:var(--safe)}
.amt-v em{font-style:normal;font-size:15px;margin-left:1px}
.amt-n{font-size:11.5px;color:var(--muted);line-height:1.65;margin-top:6px}
@media(max-width:379px){.amts{grid-template-columns:1fr}}

/* ── よくある失敗 */
.ng{
  display:flex;gap:11px;align-items:flex-start;
  background:var(--danger-bg);border:1px solid var(--danger);
  border-radius:11px;padding:14px 16px;margin:16px 0;
}
.ng-i{
  flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--danger);
  color:#fff;font-size:13px;font-weight:700;display:grid;place-items:center;margin-top:1px;
}
.ng-t{font-size:10.5px;font-weight:700;letter-spacing:.1em;color:var(--danger);margin-bottom:3px}
.ng-d{font-size:13.5px;line-height:1.8;color:var(--ink);font-weight:500}

/* ── 解説 */
.bcat-lead{font-size:14.5px;line-height:1.95;color:var(--ink);margin:16px 0 4px}
.bcat-lead strong{font-weight:700;color:var(--navy);
  background:linear-gradient(transparent 62%,var(--accent-bg) 62%)}

/* ── チェック */
.bchk-h{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--faint);margin:26px 0 10px}
.bchk{
  display:flex;gap:12px;align-items:flex-start;
  padding:13px 15px;margin-bottom:7px;cursor:pointer;
  background:var(--bg);border:1px solid var(--line);border-radius:10px;
  transition:border-color .15s,background .15s;
}
.bchk:hover{border-color:var(--navy-soft)}
.bchk input{
  appearance:none;-webkit-appearance:none;flex-shrink:0;
  width:20px;height:20px;margin-top:1px;border-radius:6px;
  border:1.5px solid var(--line);background:var(--bg);position:relative;cursor:pointer;transition:.15s;
}
.bchk input:checked{background:var(--safe);border-color:var(--safe)}
.bchk input:checked::after{
  content:"";position:absolute;left:6px;top:2.4px;width:5px;height:10px;
  border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg);
}
.bchk-t{font-size:14px;line-height:1.7;font-weight:500}
.bchk:has(input:checked){background:var(--safe-bg);border-color:var(--safe)}
.bchk:has(input:checked) .bchk-t{color:var(--muted);text-decoration:line-through;text-decoration-color:var(--faint)}

/* ── 進捗 */
.prog{
  background:var(--surface);border:1px solid var(--line);
  border-radius:13px;padding:20px 22px;margin:30px 0 0;
}
.prog-row{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.prog-n{font-family:var(--mincho);font-size:38px;font-weight:600;color:var(--navy);line-height:1}
.prog-u{font-family:var(--mincho);font-size:18px;font-weight:600;color:var(--navy)}
.prog-c{font-size:12.5px;color:var(--muted);margin-left:auto}
.prog-bar{height:7px;background:var(--line);border-radius:4px;overflow:hidden}
.prog-bar i{display:block;height:100%;width:0;background:var(--safe);border-radius:4px;
  transition:width .4s cubic-bezier(.4,0,.2,1)}
.prog-m{font-size:12.5px;color:var(--muted);line-height:1.75;margin-top:11px}
.prog-reset{font-size:11.5px;color:var(--faint);text-decoration:underline;margin-top:12px;display:inline-block}
.prog-reset:hover{color:var(--danger)}
`;
