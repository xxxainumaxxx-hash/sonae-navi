// ホンダのショート3本で共通に使う絵の道具
import { C } from '../lib/crayon.mjs';
import { kid } from '../lib/cfolk.mjs';
import { sideRider, bicycle, stepBike } from '../lib/cprops3.mjs';

export const soichiro = (o) => kid({ hair: 'side', hairColor: '#2a2420', shirt: '#e9e2cf', pants: '#9a9384', ...o });
export const fujisawa = (o) => kid({ hair: 'side', hairColor: '#4a4a4a', shirt: C.white, jacket: '#2f3440', tie: '#7a2a2a', pants: '#2f3440', ...o });
export const townsman = (o) => kid({ hair: 'messy', hairColor: '#2a2420', shirt: '#7a6a58', pants: '#4a4038', ...o });
export const TOWN = { shirt: '#7a6a58', pants: '#4a4038' };
// 乗っている人（横向き・座ってこぐ）：うしろの足 → 乗り物 → 体と手前の足
export const onBike = (x, y, s, o = {}, bo = {}) => { const r = sideRider(x, y, s, o); return r.back + bicycle(x, y, s, bo) + r.front; };
const STEP = { hip: [-100, -168], grip: [165, -252], foot: [-10, -78] };
export const onStep = (x, y, s, o = {}, bo = {}) => { const r = sideRider(x, y, s, { ...STEP, ...o }); return r.back + stepBike(x, y, s, bo) + r.front; };
