/* =========================
   script.js
   Interactivity: nav toggle, smooth scroll, reveal on scroll, cursor particles,
   tooltips, scroll progress, keyboard accessibility, reduced-motion support.
   ========================= */

/* ====== UTILITIES ====== */

/**
 * Helper: safe query selector
 * @param {string} sel
 * @returns {Element|null}
 */
const $ = (sel) => document.querySelector(sel);

/**
 * Helper: throttle function
 * @param {Function} fn
 * @param {number} wait
 */
function throttle(fn, wait = 50) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ====== NAV TOGGLE ====== */
const navToggle = $('#navToggle');
const primaryNav = $('#primaryNav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close nav when a link is clicked (mobile)
  primaryNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        primaryNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ====== SMOOTH SCROLL FOR ELEMENTS WITH data-scroll ====== */
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const targetSelector = btn.getAttribute('data-scroll');
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // focus target for accessibility
      setTimeout(() => target.setAttribute('tabindex', '-1'), 600);
      setTimeout(() => target.focus(), 700);
    }
  });
});

/* ====== ACTIVE LINK HIGHLIGHT BASED ON INTERSECTION ====== */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { root: null, threshold: 0.32 });

sections.forEach(s => sectionObserver.observe(s));

/* ====== REVEAL ON SCROLL WITH STAGGER SUPPORT ====== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      if (delay) el.style.transitionDelay = `${delay}s`;
      el.classList.add('visible');
      // If it's a project card, reveal nested tech icons after a short delay
      if (el.classList.contains('project-card')) {
        setTimeout(() => el.classList.add('visible'), (delay + 0.15) * 1000);
      }
      obs.unobserve(el);
    }
  });
}, { threshold: 0.18 });

revealEls.forEach(el => revealObserver.observe(el));

/* ====== SCROLL PROGRESS BAR ====== */
const progress = $('#scrollProgress');
function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight ? (scrollTop / docHeight) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
}
window.addEventListener('scroll', throttle(updateProgress, 20));
updateProgress();

/* ====== CURSOR-REACTIVE PARTICLE FOR HERO & PROJECTS ====== */
const particle = document.createElement('div');
particle.className = 'cursor-particle';
document.body.appendChild(particle);

const heroSection = $('#hero');
const projectsSection = $('#projects');

function moveParticle(e) {
  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;
  particle.style.opacity = '0.85';
  particle.style.transform = 'translate(-50%,-50%) scale(1)';
}
function hideParticle() {
  particle.style.opacity = '0';
  particle.style.transform = 'translate(-50%,-50%) scale(.6)';
}

[heroSection, projectsSection].forEach(sec => {
  if (!sec) return;
  sec.addEventListener('mousemove', moveParticle);
  sec.addEventListener('mouseleave', hideParticle);
});

/* ====== TOOLTIP FOR SKILL PILLS ====== */
document.querySelectorAll('.skill-pill[data-tooltip], .skill-pill').forEach(p => {
  // store tooltip text in dataset if not present
  if (!p.dataset.tooltip && p.textContent) {
    p.dataset.tooltip = p.textContent.trim();
  }

  p.addEventListener('mouseenter', (e) => {
    const tipText = p.dataset.tooltip;
    if (!tipText) return;
    const tip = document.createElement('div');
    tip.className = 'pill-tooltip';
    tip.textContent = tipText;
    document.body.appendChild(tip);

    // position tooltip centered above the pill
    const rect = p.getBoundingClientRect();
    const left = rect.left + rect.width / 2 - tip.offsetWidth / 2;
    const top = rect.top - tip.offsetHeight - 10;
    tip.style.left = `${Math.max(8, left)}px`;
    tip.style.top = `${Math.max(8, top)}px`;
    p._tooltip = tip;
  });

  p.addEventListener('mouseleave', () => {
    if (p._tooltip) {
      p._tooltip.remove();
      p._tooltip = null;
    }
  });
});

/* ====== FOOTER APPEAR ON VIEW ====== */
const footer = $('#siteFooter');
if (footer) {
  const fObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) footer.classList.add('visible');
    });
  }, { threshold: 0.2 });
  fObs.observe(footer);
}

/* ====== KEYBOARD ACCESSIBILITY: ESC TO CLOSE MOBILE NAV ====== */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (primaryNav && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

/* ====== REDUCED MOTION SUPPORT ====== */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  // disable animations by removing transition/animation styles where appropriate
  document.querySelectorAll('.reveal, .hero-name, .hero-tagline, .hero-desc, .hero-actions').forEach(el => {
    el.style.transition = 'none';
    el.style.animation = 'none';
    el.classList.add('visible');
  });
  if (progress) progress.style.transition = 'none';
}

/* ====== OPTIONAL: Keyboard navigation for main sections (1-4) ====== */
window.addEventListener('keydown', (e) => {
  if (e.altKey && !e.shiftKey) {
    // Alt+1 -> About, Alt+2 -> Skills, Alt+3 -> Projects, Alt+4 -> Contact
    if (e.key === '1') { $('#about')?.scrollIntoView({ behavior: 'smooth' }); }
    if (e.key === '2') { $('#skills')?.scrollIntoView({ behavior: 'smooth' }); }
    if (e.key === '3') { $('#projects')?.scrollIntoView({ behavior: 'smooth' }); }
    if (e.key === '4') { $('#contact')?.scrollIntoView({ behavior: 'smooth' }); }
  }
});

/* ====== CLEANUP ON RESIZE ====== */
window.addEventListener('resize', throttle(() => {
  if (window.innerWidth > 768) {
    primaryNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
}, 200));

/* ====== SMALL UTILITY: Add data-delay from inline attributes to style for progressive reveal ====== */
document.querySelectorAll('[data-delay]').forEach(el => {
  const d = el.getAttribute('data-delay');
  if (d) el.style.transitionDelay = `${d}s`;
});

/* =========================
   END OF SCRIPT
   ========================= */
