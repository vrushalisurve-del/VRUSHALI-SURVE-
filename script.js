/* ==========================================================================
   VRUSHALI A. SURVE — ACADEMIC PORTFOLIO — SCRIPT
   Vanilla JS only. Organised by feature; each block is self-contained.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 400);
  });

  /* ---------- 2. Theme toggle (dark / light) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('vas-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

  function setThemeIcon(){
    if(!themeBtn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }
  setThemeIcon();
  themeBtn && themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('vas-theme', next);
    setThemeIcon();
  });

  /* ---------- 3. Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle && navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- 4. Sticky nav: hide on scroll down, show on scroll up + progress bar ---------- */
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('progress');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // hide/show header
    if (y > lastY && y > 140) header.classList.add('nav-hidden');
    else header.classList.remove('nav-hidden');
    lastY = y;

    // scroll progress
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = docH > 0 ? `${(y / docH) * 100}%` : '0%';

    // back to top visibility
    backTop.classList.toggle('show', y > 600);
  }, { passive: true });

  /* ---------- 5. Active menu highlighting ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navA = document.querySelectorAll('#navLinks a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- 6. Back-to-top FAB ---------- */
  const backTop = document.getElementById('backTop');
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 7. Typing animation (hero role words) ---------- */
  const roles = ['Mathematics Faculty', 'Ph.D. Researcher', 'Inventory Modelling Specialist', 'Academic Writer'];
  const typeEl = document.getElementById('typedRole');
  if (typeEl) {
    let ri = 0, ci = 0, deleting = false;
    const speed = 55, pause = 1400;
    function tick(){
      const word = roles[ri];
      ci += deleting ? -1 : 1;
      typeEl.textContent = word.slice(0, ci);
      let delay = deleting ? speed / 2 : speed;
      if (!deleting && ci === word.length){ deleting = true; delay = pause; }
      else if (deleting && ci === 0){ deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- 8. Scroll-triggered reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 9. Animated counters ---------- */
  const counters = document.querySelectorAll('.stat strong[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const run = () => {
        cur += step;
        if (cur >= target){ el.textContent = target + suffix; return; }
        el.textContent = cur + suffix;
        requestAnimationFrame(run);
      };
      run();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 10. Skill bar fill on scroll ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.level;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(f => skillObserver.observe(f));

  /* ---------- 11. Lightbox gallery ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery figure[data-full]').forEach(fig => {
    fig.addEventListener('click', () => {
      lightboxImg.src = fig.dataset.full;
      lightboxImg.alt = fig.querySelector('figcaption')?.textContent || '';
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightboxClose')?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox && lightbox.classList.remove('open'); });

  /* ---------- 12. Ripple effect on buttons ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const span = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      span.className = 'rpl';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(span);
      setTimeout(() => span.remove(), 650);
    });
  });

  /* ---------- 13. Lazy loading images ---------- */
  document.querySelectorAll('img.lazy').forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  });

  /* ---------- 14. Contact form (client-side placeholder — no backend wired up) ---------- */
  const form = document.getElementById('contactForm');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Thanks for reaching out — this form is a template and isn\'t connected to an inbox yet. Please email directly for now.';
  });

  /* ---------- 15. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
