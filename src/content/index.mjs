import kaji from "./kaji.mjs";
import jishin from "./jishin.mjs";
import suigai from "./suigai.mjs";
import dosha from "./dosha.mjs";
import taifu from "./taifu.mjs";
import tsunami from "./tsunami.mjs";
import teiden from "./teiden.mjs";
import necchusho from "./necchusho.mjs";
import ooyuki from "./ooyuki.mjs";
import kaminari from "./kaminari.mjs";
import bichiku from "./bichiku.mjs";
import bouhan from "./bouhan.mjs";
import neage from "./neage.mjs";
import okane from "./okane.mjs";

// 災害ページ（4ブロック構成）。この順がトップのカード順・sitemapの順
export const DISASTERS = {
  kaji, jishin, suigai, dosha, taifu,
  tsunami, teiden, necchusho, ooyuki, kaminari,
};

// 暮らしを守る（災害そのものではないが備えニキの主要テーマ）
export const LIFE = { bichiku, bouhan, neage, okane };

export const CATS = { ...DISASTERS, ...LIFE };
export const CAT_IDS = Object.keys(CATS);
export const DISASTER_IDS = Object.keys(DISASTERS);
export const LIFE_IDS = Object.keys(LIFE);
