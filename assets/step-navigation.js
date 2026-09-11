(() => {
  // Shared reading-position behavior for every fixed section menu.
  document.querySelectorAll('.stepnav, .bnav').forEach(nav => {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const headings = links.map(link => document.getElementById(link.hash.slice(1)));
    const scroller = nav.querySelector('.bnav-in');
    let scheduled = false;
    let previous = -1;
    function update() {
      scheduled = false;
      const height = nav.getBoundingClientRect().height;
      if (nav.classList.contains('stepnav')) {
        document.documentElement.style.setProperty('--step-nav-height', `${height}px`);
      }
      const offset = parseFloat(getComputedStyle(nav).top) || 0;
      let active = 0;
      headings.forEach((heading, index) => {
        if (heading && heading.getBoundingClientRect().top <= offset + height + 24) active = index;
      });
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (scroller && previous !== active) {
        const item = links[active].getBoundingClientRect();
        const frame = scroller.getBoundingClientRect();
        if (item.left < frame.left || item.right > frame.right) {
          scroller.scrollTo({left:scroller.scrollLeft + item.left - frame.left - (frame.width - item.width)/2, behavior:'auto'});
        }
      }
      previous = active;
    }
    function schedule() {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    observer.observe(nav);
    const calc = document.querySelector('.calc');
    if (calc) observer.observe(calc);
    update();
  });
})();
