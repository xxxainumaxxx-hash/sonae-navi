const dialog = document.querySelector('.case-dialog');
if (dialog) {
 document.querySelectorAll('.case-zoom').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  dialog.querySelector('img').src=link.href;
  dialog.querySelector('img').alt=link.querySelector('img').alt;
  dialog.showModal();
 }));
 dialog.querySelector('.case-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
const navLinks=[...document.querySelectorAll('.work-nav a')];
const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href')));
let queued=false;
function updateWorkNav(){queued=false;const edge=document.querySelector('.work-nav').getBoundingClientRect().height+24;let active=-1;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<=edge)active=i;});navLinks.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateWorkNav);}},{passive:true});
window.addEventListener('resize',updateWorkNav);updateWorkNav();
