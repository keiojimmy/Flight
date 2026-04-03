/* ═══════════════════════════════════════════════════════════
   KBB CORP — Main JS
   Language toggle · Nav scroll · Reveal animations · Form
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── State ── */
  const html = document.documentElement;
  let currentLang = localStorage.getItem('kbb-lang') || 'jp';
  let menuOpen = false;

  /* ═══════════════════ LANGUAGE TOGGLE ═══════════════════ */
  function setLang(lang) {
    currentLang = lang;
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang === 'jp' ? 'ja' : 'en');
    localStorage.setItem('kbb-lang', lang);
    updatePlaceholders();
  }

  function updatePlaceholders() {
    document.querySelectorAll('[placeholder-en], [placeholder-jp]').forEach(function (el) {
      const key = currentLang === 'jp' ? 'placeholder-jp' : 'placeholder-en';
      const val = el.getAttribute(key);
      if (val) el.setAttribute('placeholder', val);
    });
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(currentLang === 'en' ? 'jp' : 'en');
    });
  }

  /* Init language */
  setLang(currentLang);

  /* ═══════════════════ NAV SCROLL ═══════════════════ */
  const navHeader = document.getElementById('nav-header');

  function onScroll() {
    if (window.scrollY > 40) {
      navHeader && navHeader.classList.add('scrolled');
    } else {
      navHeader && navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ═══════════════════ MOBILE MENU ═══════════════════ */
  const menuBtn = document.getElementById('nav-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  function toggleMenu() {
    menuOpen = !menuOpen;
    menuBtn && menuBtn.classList.toggle('open', menuOpen);
    mobileNav && mobileNav.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    menuBtn && menuBtn.classList.remove('open');
    mobileNav && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);

  /* Close menu when mobile nav link is clicked */
  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ═══════════════════ SMOOTH SCROLL ═══════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const navH = navHeader ? navHeader.offsetHeight : 76;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ═══════════════════ REVEAL ON SCROLL ═══════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: show all */
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ═══════════════════ APPROACH STEP HOVER ═══════════════════ */
  /* Approach steps have a hover that changes padding — we manage
     this via CSS, but we add class toggling here for more control
     if needed in the future. */

  /* ═══════════════════ CONTACT FORM ═══════════════════ */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = contactForm.querySelector('.form-submit');
      const langEnText = currentLang === 'en' ? 'Sending…' : '送信中…';
      const originalHtml = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<span>' + langEnText + '</span>';

      /* Simulate async submission — replace with real fetch() in production */
      setTimeout(function () {
        btn.innerHTML = currentLang === 'en'
          ? '<span>Message sent. We\'ll be in touch.</span>'
          : '<span>送信完了。近日中にご連絡いたします。</span>';
        btn.style.background = '#2a5c3f';

        setTimeout(function () {
          btn.disabled = false;
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          contactForm.reset();
          updatePlaceholders();
        }, 4000);
      }, 1200);
    });
  }

  /* ═══════════════════ HERO BG TEXT PARALLAX ═══════════════════ */
  const heroBgText = document.querySelector('.hero-bg-text');
  if (heroBgText) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      const heroH = document.getElementById('hero').offsetHeight;
      if (scrollY < heroH) {
        heroBgText.style.transform = 'translateY(calc(-50% + ' + (scrollY * 0.15) + 'px))';
      }
    }, { passive: true });
  }

  /* ═══════════════════ NAV ACTIVE STATE ═══════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    const navH = navHeader ? navHeader.offsetHeight : 76;

    let currentId = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - navH - 80;
      if (scrollY >= top) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      link.style.color = (href === '#' + currentId) ? 'var(--ink)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
