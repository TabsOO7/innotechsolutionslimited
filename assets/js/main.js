'use strict';

/* ----------------------------------------------------------------
   1. NAV — glass blur on scroll
---------------------------------------------------------------- */
(function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const toggleScrolled = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', toggleScrolled, { passive: true });
  toggleScrolled();
})();

/* ----------------------------------------------------------------
   2. HAMBURGER — mobile nav toggle
---------------------------------------------------------------- */
(function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeNav() {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // FIXED outside click
  document.addEventListener('click', e => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;

    if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
      closeNav();
    }
  });
})();

/* ----------------------------------------------------------------
   3. SCROLL REVEAL
---------------------------------------------------------------- */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------------
   4. ACTIVE NAV LINKS
---------------------------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(s => observer.observe(s));
})();

/* ----------------------------------------------------------------
   5. SMOOTH SCROLL (FIXED SCOPE)
---------------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]')
    .forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        const navH = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')
        ) || 72;

        const top = target.getBoundingClientRect().top + window.scrollY - navH;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
})();