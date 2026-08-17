// ============================================================
// 備えナビ 全体設定
// ここだけ書き換えれば全ページに反映されます
// ============================================================

export const SITE = {
  name: "備えナビ",
  author: "備えニキ",
  origin: "https://sonae-navi.vercel.app",
  tagline: "災害と値上げから、家族を守る備えのすべて",
  description:
    "備えニキがまとめた生活防衛の総合ナビ。火事・水害・備蓄を軸に、家族構成に合わせて必要な備えが30秒でわかります。",
};

// Amazonアソシエイトタグ（検索リンク用）
export const AFF_TAG = "a0199c-22";

export const LINKS = {
  youtube: "https://www.youtube.com/@sonaeniki",
  instagram: "https://www.instagram.com/sonaeniki_bosai_bohan",
  amazonList: "https://amzn.asia/d/09QQw4zM",
  rakutenRoom: "https://room.rakuten.co.jp/room_5fa1f5d076/items",
};

// Amazon検索リンク生成
export const amz = (kw) =>
  `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=${AFF_TAG}`;

// ============================================================
// 動画データベース（新作はここに追加するだけ）
// ============================================================
export const V = {
  // ── ロング（主力）
  bichiku50:    { title: "【完全保存版】2026年最新 絶対に揃えるべき備蓄品ランキングTOP50", url: "https://youtu.be/jx67o5aDyjg" },
  hinanjo:      { title: "【閲覧注意】避難所の現実 持っていなくて後悔した物TOP20", url: "https://youtu.be/1tza3T-dtow" },
  saisho30:     { title: "【緊急】最初の30分で生死が決まる災害TOP4", url: "https://youtu.be/M1De87fEC0E" },
  hyakkin:      { title: "【保存版】100均だけで揃う！予算1万円で作る3日分の備蓄", url: "https://youtu.be/h2A1tn8KPQo" },
  bichikuKiken: { title: "【緊急】備蓄してる人ほど実は危険な事TOP20", url: "https://youtu.be/rbVdHj9tk7Y" },
  taenuki10:    { title: "日本の崩壊 耐え抜く備蓄TOP10", url: "https://youtu.be/fUFnD-8nFsY" },
  gouu20:       { title: "【緊急】台風前に買え！ホームセンターで揃える豪雨対策TOP20", url: "https://youtu.be/4xfQTBn-A9s" },
  teiden20:     { title: "【完全保存版】停電で一瞬にして終わる物TOP20", url: "https://youtu.be/ixPGF4XVsVM" },
  atsusa20:     { title: "【緊急】電気代高騰に備えろ！夏前の最強暑さ対策TOP20", url: "https://youtu.be/M5EvSHalv0c" },
  akisu7:       { title: "備蓄の前にまずこれをやれ！空き巣に狙われやすい家TOP7", url: "https://youtu.be/1zZJwtyxtLE" },
  neageTop20:   { title: "【2026年版】値上げが止まらない生活必需品TOP20", url: "https://www.youtube.com/watch?v=t73MUqhYeWU" },
  july:         { title: "【緊急】6月中に買え！7月から価格爆上げする物TOP20", url: "https://youtu.be/O1R9JPkpIcM" },
  june:         { title: "【緊急】5月中に買え 6月値上げ確定品TOP20", url: "https://youtu.be/n44xUqFPqu8" },
  natsumae20:   { title: "【緊急】夏前に消える!? ホームセンターで今すぐ買うべき物TOP20", url: "https://youtu.be/uhoddfExooA" },
  nafsaKieru:   { title: "【衝撃】ホルムズ海峡封鎖 ナフサショックで消える物TOP20", url: "https://youtu.be/0STOzGJT5Xs" },
  hokaiScenario:{ title: "ホルムズ海峡封鎖 日本崩壊シナリオ 地獄のカウントダウンTOP10", url: "https://youtu.be/ocTiABzffRU" },
  potechi:      { title: "【終わりの始まり？】白黒ポテチの謎 海峡封鎖とナフサショック", url: "https://youtu.be/9rfUG_kj1fk" },
  reitoTop20:   { title: "【緊急】夏の値上げ前に買え！今すぐ冷凍すべき物TOP20", url: "https://www.youtube.com/watch?v=6Xmhsc8yjRI" },
  koteihiTop20: { title: "【生活防衛】年間10万円浮く 固定費見直しTOP20", url: "https://www.youtube.com/watch?v=sAooCp5aDYo" },
  hisaigo:      { title: "【最高300万円】被災後貰えるお金と大事な手続きTOP10", url: "https://youtu.be/6T6mMUrprd4" },
  furusato10:   { title: "【実質2000円】ふるさと納税で揃える最強防災グッズTOP10", url: "https://youtu.be/9MknQKt-VDw" },
  setsuyaku7:   { title: "【実は逆】備蓄が節約になる7つの理由", url: "https://youtu.be/rHtnJ-6e6us" },
  denki7:       { title: "【補助金終了】知らないと年間2万円損 今すぐ見直す電気代7選", url: "https://www.youtube.com/watch?v=Hb5_qSlfsPs" },

  // ── ショート
  reitoTop5:    { title: "【緊急】夏の値上げ前に買え！今すぐ冷凍すべき物TOP5", url: "https://www.youtube.com/shorts/KqnIofjGxWE", short: true },
  neageTop5:    { title: "2026年も値上げ地獄TOP5", url: "https://www.youtube.com/shorts/XeC6rC8dzsc", short: true },
  reitoNG:      { title: "【まじでやめて】冷凍した瞬間に終わる物TOP10", url: "https://www.youtube.com/shorts/yZx_8mwXxPo", short: true },
  reitoIgai:    { title: "【保存版】冷凍できる意外な食材TOP3", url: "https://www.youtube.com/shorts/itQkanKY64k", short: true },
  koteihiTop5:  { title: "年間10万円浮く 固定費見直しTOP5", url: "https://www.youtube.com/shorts/pWWvdZupDXc", short: true },
  saiene:       { title: "【緊急】今すぐ見直せ電気代！再エネ賦課金の強制負担", url: "https://www.youtube.com/shorts/fKLQCxSOVGc", short: true },
  aircon:       { title: "【永遠のテーマ】エアコンつけっぱなしの方が得論", url: "https://www.youtube.com/shorts/pbbm7ezi9OM", short: true },
  furusato:     { title: "防災グッズはほぼタダ?! ふるさと納税でお得にゲットする方法", url: "https://www.youtube.com/shorts/K3O6UlSd0E0", short: true },
  necchusho:    { title: "夏本番 ステルス熱中症 急増中", url: "https://www.youtube.com/shorts/0rKC2U73n4M", short: true },
  mizuKoraseru: { title: "【一石三鳥】夏前に水を凍らせる理由とは", url: "https://www.youtube.com/shorts/KLwkYxOoDgw", short: true },
  taifuHC:      { title: "【緊急】ホームセンターで今すぐ買え！台風前に備えるべき物5選", url: "https://www.youtube.com/shorts/PVZ2vaA3T3M", short: true },
};
