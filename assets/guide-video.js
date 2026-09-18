document.querySelectorAll('.guide-video-poster').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.videoId;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0&autoplay=1`;
    iframe.title = button.getAttribute('aria-label');
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(iframe);
    iframe.focus();
  }, { once: true });
});
