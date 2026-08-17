import bichiku from "./bichiku.mjs";
import kaji from "./kaji.mjs";
import suigai from "./suigai.mjs";
import { jishin, teiden, bouhan, neage, okane } from "./others.mjs";

// 表示順 = トップのタイル順 = sitemapの順
export const CATS = {
  bichiku,
  kaji,
  suigai,
  jishin,
  teiden,
  bouhan,
  neage,
  okane,
};

export const CAT_IDS = Object.keys(CATS);

// 3本柱（今回まとめ切ったテーマ）
export const PILLARS = ["bichiku", "kaji", "suigai"];
export const OTHERS = CAT_IDS.filter((id) => !PILLARS.includes(id));
