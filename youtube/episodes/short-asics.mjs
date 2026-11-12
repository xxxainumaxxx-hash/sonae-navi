// アシックスのショート3本で共通に使う絵の道具
import { C } from '../lib/crayon.mjs';
import { kid } from '../lib/cfolk.mjs';
export const NAVY = '#24345c', BLUE = '#2f4a7a', YEL = '#f2c230';
export const onitsuka = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', jacket: '#6b6b4a', pants: '#4a4a38', ...o });   // 戦後すぐ
export const onitsuka2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: C.white, jacket: NAVY, tie: '#c8423a', pants: NAVY, ...o }); // 社長
export const phil = (o) => kid({ hair: 'messy', hairColor: '#c9a04a', shirt: C.white, jacket: '#8a6a40', tie: '#3a6ea5', pants: '#5a4a3a', ...o });
export const player = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: C.white, pants: BLUE, ...o });
