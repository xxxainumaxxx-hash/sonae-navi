const people=document.getElementById('people');
function updateQuantities(){
 const n=Number(people.value);
 for(const el of document.querySelectorAll('[data-per]')) el.textContent=Number(el.dataset.per)*n;
 for(const card of document.querySelectorAll('[data-product]')){
  const el=card.querySelector('[data-pack]'),daily=Number(el.dataset.daily),pack=Number(el.dataset.pack),days=Number(card.dataset.days);
  const count=Math.ceil(daily*days*n/pack),initial=Math.ceil(daily*3*n/pack),extra=count-initial;
  el.textContent=days===3?`ゼロからそろえるなら ${count}箱`:(extra>0?`3日分を上の商品でそろえたら ＋${extra}箱`:'3日分の購入量で足ります。追加は不要です。');
  card.classList.toggle('enough',days===7&&extra===0);
 }
}
people?.addEventListener('change',updateQuantities);
if(people)updateQuantities();
