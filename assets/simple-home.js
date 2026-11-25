const people=document.getElementById('people');
const days=document.getElementById('days');
function updateQuantities(){
 const n=Number(people.value),duration=Number(days.value);
 for(const card of document.querySelectorAll('[data-product]')){
  const el=card.querySelector('[data-pack]');
  const daily=Number(el.dataset.daily),pack=Number(el.dataset.pack);
  card.querySelector('[data-per]').textContent=daily*duration*n;
  el.textContent=`${Math.ceil(daily*duration*n/pack)}箱`;
  card.dataset.days=String(duration);
 }
}
people?.addEventListener('change',updateQuantities);
days?.addEventListener('change',updateQuantities);
if(people&&days)updateQuantities();
