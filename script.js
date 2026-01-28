(() => {
  const nav = document.querySelector('#nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = Array.from(document.querySelectorAll('.nav__link'));
  const year = document.querySelector('#year');

  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // close after click
    links.forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;
      if (!nav.contains(target) && !toggle.contains(target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section highlight
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const isActive = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', isActive);
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
  );

  sections.forEach((s) => obs.observe(s));
})();
