// サンリオのショート3本で共通に使う絵の道具
import { C, rect } from '../lib/crayon.mjs';
import { kid } from '../lib/cfolk.mjs';
export const PINK = '#e86a7a', NAVY = '#24345c', YEL = '#f2c230', MINT = '#a8d8c8', SKY = '#cfe6f5';
export const tsuji = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: '#5a5a5a', tie: '#3a4a6b', pants: '#4a4a4a', ...o });
export const tsuji2 = (o) => kid({ hair: 'side', hairColor: '#2a2420', glasses: true, shirt: C.white, jacket: NAVY, tie: PINK, pants: NAVY, ...o });
export const girl = (o) => kid({ hair: 'bob', hairColor: '#3a2d25', shirt: '#f2a6b4', pants: '#6a7aa8', ...o });
export const girl2 = (o) => kid({ hair: 'bob', hairColor: '#5a3a25', shirt: MINT, pants: '#8a6a9a', ...o });
// 店の棚（縦画面）：棚板の上の面は y=900 と 1150
export const shelves = () => rect(-300, 0, 1700, 2000, { fill: '#fbeee0', color: null }) + rect(60, 900, 960, 30, { fill: '#a07a50' }) + rect(60, 1150, 960, 30, { fill: '#a07a50' });
