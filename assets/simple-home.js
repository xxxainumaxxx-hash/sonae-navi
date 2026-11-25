const people=document.getElementById('people');
function updateQuantities(){
 const n=Number(people.value);
 for(const el of document.querySelectorAll('[data-per]')) el.textContent=Number(el.dataset.per)*n;
 for(const card of document.querySelectorAll('[data-product]')){
  const el=card.querySelector('[data-pack]'),daily=Number(el.dataset.daily),pack=Number(el.dataset.pack),days=Number(card.dataset.days);
  const count=Math.ceil(daily*days*n/pack),initial=Math.ceil(daily*3*n/pack),extra=count-initial;
  el.textContent=days===3?`${count}箱`:(extra>0?`＋${extra}箱`:'追加不要');
  card.classList.toggle('enough',days===7&&extra===0);
 }
}
people?.addEventListener('change',updateQuantities);
if(people)updateQuantities();
