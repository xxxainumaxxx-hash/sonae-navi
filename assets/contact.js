const contactSection = document.getElementById('contact');
const contactToggle = document.querySelector('.contact-toggle');
if (contactSection && contactToggle) {
  const setContactOpen = (open, focus = false) => {
    contactSection.hidden = !open;
    contactToggle.setAttribute('aria-expanded', String(open));
    contactToggle.querySelector('span').textContent = open ? '−' : '＋';
    if (open && focus) {
      document.getElementById('contact-heading').focus({preventScroll:true});
      contactSection.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
    }
  };
  contactToggle.addEventListener('click', () => setContactOpen(contactSection.hidden, true));
  document.querySelectorAll('.plan-select').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const form = document.getElementById('contact-form');
    form.elements.category.value = link.dataset.category;
    const message = form.elements.message;
    const existing = message.value.replace(/^希望プラン：[^\n]*\n?/, '');
    message.value = '希望プラン：' + link.dataset.plan + '\n' + existing;
    setContactOpen(true, true);
  }));
  if (location.hash === '#contact') setContactOpen(true);
  window.addEventListener('hashchange', () => { if (location.hash === '#contact') setContactOpen(true, true); });
}
const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type=submit]');
  const status = document.getElementById('contact-status');
  if (button.disabled) return;
  button.disabled = true;
  status.dataset.error = 'false';
  status.textContent = '送信しています…';
  try {
    const response = await fetch('/api/contact', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify(Object.fromEntries(new FormData(form))),
      signal:AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '送信できませんでした。時間をおいてお試しください。');
    form.reset();
    status.textContent = 'お問い合わせを送信しました。ご返信までしばらくお待ちください。';
  } catch (error) {
    status.dataset.error = 'true';
    status.textContent = error.name === 'TimeoutError' ? '送信結果を確認できませんでした。入力内容は残っています。時間をおいてご確認ください。' : (error instanceof TypeError ? '通信できませんでした。接続をご確認ください。入力内容は残っています。' : error.message);
  } finally { button.disabled = false; }
});
