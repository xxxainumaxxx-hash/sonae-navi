import bichiku from "./bichiku.mjs";
import kaji from "./kaji.mjs";
import suigai from "./suigai.mjs";
import jishin from "./jishin.mjs";
import teiden from "./teiden.mjs";
import { bouhan, neage, okane } from "./others.mjs";

// 災害ページ（4ブロック構成）。トップのカード順もこの順
export const DISASTERS = { kaji, jishin, suigai, teiden };

// 暮らしを守る（災害そのものではないが備えニキの主要テーマ）
export const LIFE = { bichiku, bouhan, neage, okane };

export const CATS = { ...DISASTERS, ...LIFE };
export const CAT_IDS = Object.keys(CATS);
export const DISASTER_IDS = Object.keys(DISASTERS);
export const LIFE_IDS = Object.keys(LIFE);

// 旧APIとの互換
export const PILLARS = ["bichiku", "kaji", "suigai"];
export const OTHERS = CAT_IDS.filter((id) => !PILLARS.includes(id));
