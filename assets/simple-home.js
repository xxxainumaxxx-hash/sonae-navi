const people=document.getElementById('people');
people?.addEventListener('change',()=>{const n=Number(people.value);for(const el of document.querySelectorAll('[data-per]'))el.textContent=Number(el.dataset.per)*n;});
