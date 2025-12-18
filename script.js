/**
 * script.js
 * Interactive behaviors for Kashish portfolio
 * - Hero typewriter + parallax stars + cursor-following stars
 * - Navigation: smooth scroll, mobile toggle, scroll spy
 * - Scroll-triggered animations (fade-in, slide-up)
 * - Project modals with mini-demos (algorithm canvas, plagiarism demo, chart demo)
 * - Skills card flip interactions and radial/progress animations
 *
 * Modular, commented, and production-ready.
 */

(() => {
  'use strict';

  /* =========================
     Utilities
     ========================= */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* =========================
     DOM Elements
     ========================= */
  const body = document.body;
  const navToggle = $('#nav-toggle');
  const mobileMenu = $('#mobile-menu');
  const navLinks = $$('.nav-link');
  const mobileLinks = $$('.mobile-nav-link');
  const scrollProgress = $('#scroll-progress');
  const typewriterEl = $('.typewriter');
  const heroName = $('#hero-name');
  const parallax = $('#parallax');
  const starsCanvas = $('#stars-layer');
  const nebulaCanvas = $('#nebula-layer');
  const floatingShapes = $('#floating-shapes');
  const skillCards = $$('.skill-card');
  const animatedEls = $$('[data-animate]');
  const projectModalButtons = $$('.btn-modal');
  const modals = $$('#modals dialog');
  const modalCloseButtons = $$('.modal-close');
  const contactForm = $('#contact-form');
  const ariaAnnouncer = $('#aria-announcer');

  /* =========================
     Feature: Smooth scroll & scroll spy
     ========================= */
  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 72; // header offset
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Attach nav link behavior
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      smoothScrollTo(href);
      // close mobile menu if open
      if (mobileMenu.classList.contains('open')) toggleMobileMenu(false);
    });
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      smoothScrollTo(href);
      toggleMobileMenu(false);
    });
  });

  // Scroll spy: highlight nav link for current section
  const sections = ['#hero', '#about', '#projects', '#skills', '#contact'].map(s => document.querySelector(s));
  function onScrollSpy() {
    const offset = window.scrollY + 120;
    let current = sections[0];
    for (const sec of sections) {
      if (sec && sec.offsetTop <= offset) current = sec;
    }
    const id = current && current.id ? `#${current.id}` : '#hero';
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* =========================
     Mobile menu toggle (morph hamburger to X)
     ========================= */
  function toggleMobileMenu(force) {
    const isOpen = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    // animate hamburger -> X
    const bars = $$('.bar', navToggle);
    if (isOpen) {
      bars[0].style.transform = 'translateY(8px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  }
  on(navToggle, 'click', () => toggleMobileMenu());

  /* Close mobile menu on outside click */
  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  /* =========================
     Scroll progress indicator
     ========================= */
  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / (docHeight || 1)) * 100;
    scrollProgress.style.width = `${clamp(scrolled, 0, 100)}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* =========================
     Typewriter for hero tagline
     ========================= */
  function typewriter(el, text, speed = 40) {
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    cursor.style.borderRight = '2px solid rgba(15,23,42,0.12)';
    cursor.style.marginLeft = '6px';
    el.appendChild(cursor);

    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(step, speed + Math.random() * 30);
      } else {
        // blink cursor a few times then remove
        let blink = 0;
        const blinkInterval = setInterval(() => {
          cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
          blink++;
          if (blink > 6) {
            clearInterval(blinkInterval);
            cursor.remove();
          }
        }, 300);
      }
    }
    step();
  }

  // Initialize typewriter after small delay to match hero timing
  document.addEventListener('DOMContentLoaded', () => {
    const text = typewriterEl && typewriterEl.dataset && typewriterEl.dataset.text ? typewriterEl.dataset.text : 'Computer Science Student | Software, Logic & Innovation';
    setTimeout(() => {
      typewriter(typewriterEl, text, 36);
    }, 1200);
  });

  /* =========================
     Scroll-triggered animations (fade-in, slide-up)
     ========================= */
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
  const inViewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);
  animatedEls.forEach(el => inViewObserver.observe(el));

  /* =========================
     Tiny cursor-following stars
     ========================= */
  (function cursorStars() {
    const starCount = 12;
    const stars = [];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = 0;
    container.style.top = 0;
    container.style.right = 0;
    container.style.bottom = 0;
    container.style.pointerEvents = 'none';
    container.style.zIndex = 999;
    document.body.appendChild(container);

    for (let i = 0; i < starCount; i++) {
      const s = document.createElement('div');
      s.className = 'cursor-star';
      s.style.position = 'absolute';
      s.style.width = `${4 + Math.random() * 6}px`;
      s.style.height = s.style.width;
      s.style.borderRadius = '50%';
      s.style.background = ['#6c63ff', '#33d9ff', '#ff9f80'][i % 3];
      s.style.opacity = '0';
      s.style.transform = 'translate(-50%,-50%) scale(0.6)';
      s.style.transition = 'transform 300ms ease, opacity 300ms ease';
      container.appendChild(s);
      stars.push(s);
    }

    let lastMove = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMove < 16) return;
      lastMove = now;
      stars.forEach((s, idx) => {
        const offsetX = (idx - starCount / 2) * 6;
        const offsetY = Math.sin((now / 300) + idx) * 8;
        s.style.left = `${e.clientX + offsetX}px`;
        s.style.top = `${e.clientY + offsetY}px`;
        s.style.opacity = `${0.6 - (idx / starCount) * 0.4}`;
        s.style.transform = `translate(-50%,-50%) scale(${0.8 + (idx % 3) * 0.08})`;
        setTimeout(() => { s.style.opacity = '0'; }, 600);
      });
    });
  })();

  /* =========================
     Parallax stars & nebula (Canvas)
     ========================= */
  function setupCanvas(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);
    return { canvas, ctx, resize };
  }

  const starsLayer = setupCanvas(starsCanvas);
  const nebulaLayer = setupCanvas(nebulaCanvas);

  function drawStars() {
    if (!starsLayer) return;
    const { canvas, ctx } = starsLayer;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const count = Math.floor((w * h) / 60000);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.6;
      const alpha = 0.08 + Math.random() * 0.18;
      ctx.beginPath();
      ctx.fillStyle = `rgba(108,99,255,${alpha})`;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawNebula() {
    if (!nebulaLayer) return;
    const { canvas, ctx } = nebulaLayer;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    // layered soft gradients
    const g1 = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.2, h * 0.2, Math.max(w, h) * 0.8);
    g1.addColorStop(0, 'rgba(108,99,255,0.06)');
    g1.addColorStop(1, 'rgba(108,99,255,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.8, h * 0.6, 0, w * 0.8, h * 0.6, Math.max(w, h) * 0.9);
    g2.addColorStop(0, 'rgba(51,217,255,0.04)');
    g2.addColorStop(1, 'rgba(51,217,255,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  }

  // initial draw and periodic refresh for // Continuation of script.js (Part 2)
// Completing canvas drawing loop, project demos, modal management,
// skills interactions, contact form handling, accessibility helpers,
// and final initialization bootstrap.

// =========================
// Canvas draw loop & animation frame
// =========================
let lastStarDraw = 0;
function animateLayers(now) {
  // throttle heavy redraws to ~30fps for performance
  if (!lastStarDraw || now - lastStarDraw > 33) {
    drawStars();
    drawNebula();
    lastStarDraw = now;
  }
  // subtle parallax movement based on scroll
  const scrollY = window.scrollY || window.pageYOffset;
  if (floatingShapes) {
    const t = scrollY * 0.02;
    floatingShapes.style.transform = `translate3d(${t}px, ${-t * 0.6}px, 0)`;
  }
  requestAnimationFrame(animateLayers);
}
requestAnimationFrame(animateLayers);

// =========================
// Project modal management
// =========================
function openModal(id) {
  const dlg = document.getElementById(id);
  if (!dlg) return;
  try {
    // Use showModal if available for accessibility
    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
    dlg.setAttribute('aria-hidden', 'false');
    ariaAnnouncer.textContent = `${dlg.querySelector('h3')?.textContent || 'Project'} opened`;
    // trap focus inside modal
    trapFocus(dlg);
  } catch (err) {
    console.warn('Modal open failed', err);
  }
}

function closeModal(dlg) {
  if (!dlg) return;
  try {
    if (typeof dlg.close === 'function') {
      dlg.close();
    } else {
      dlg.removeAttribute('open');
    }
    dlg.setAttribute('aria-hidden', 'true');
    ariaAnnouncer.textContent = `${dlg.querySelector('h3')?.textContent || 'Project'} closed`;
    releaseFocus();
  } catch (err) {
    console.warn('Modal close failed', err);
  }
}

// Attach modal openers
projectModalButtons.forEach(btn => {
  const target = btn.dataset.open;
  btn.addEventListener('click', () => openModal(target));
});

// Attach modal close buttons
modalCloseButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const dlg = e.target.closest('dialog');
    closeModal(dlg);
  });
});

// Close modal on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openDialogs = $$('#modals dialog[open]');
    openDialogs.forEach(d => closeModal(d));
    toggleMobileMenu(false);
  }
});

// Close modal when clicking outside content
document.addEventListener('click', (e) => {
  const openDialogs = $$('#modals dialog[open]');
  openDialogs.forEach(d => {
    const rect = d.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      closeModal(d);
    }
  });
});

// =========================
// Focus trap utilities for modals
// =========================
let lastFocusedElement = null;
function trapFocus(container) {
  lastFocusedElement = document.activeElement;
  const focusable = Array.from(container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled'));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  function handleKey(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  container.__trapHandler = handleKey;
  container.addEventListener('keydown', handleKey);
}

function releaseFocus() {
  const openDialogs = $$('#modals dialog[open]');
  openDialogs.forEach(d => {
    if (d.__trapHandler) {
      d.removeEventListener('keydown', d.__trapHandler);
      delete d.__trapHandler;
    }
  });
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

// =========================
// Mini Demos: Algorithm Canvas (demo-algo)
// =========================
(function setupAlgoDemo() {
  const canvas = $('#demo-algo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let array = [];
  let animating = false;
  let steps = [];
  let stepIndex = 0;

  function resetArray() {
    array = Array.from({ length: 20 }, () => Math.floor(10 + Math.random() * (height - 20)));
    steps = [];
    stepIndex = 0;
    drawArray();
  }

  function drawArray(highlights = {}) {
    ctx.clearRect(0, 0, width, height);
    const w = width / array.length;
    array.forEach((v, i) => {
      const x = i * w + 4;
      const h = v;
      ctx.fillStyle = highlights[i] ? 'rgba(108,99,255,0.9)' : 'rgba(108,99,255,0.6)';
      ctx.fillRect(x, height - h, w - 8, h);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '10px Inter, system-ui';
      ctx.fillText(String(v), x + 4, height - h - 6);
    });
  }

  // Simple instrumented bubble sort to produce steps
  function generateBubbleSteps(arr) {
    const a = arr.slice();
    const s = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        s.push({ type: 'compare', i, j });
        if (a[j] > a[j + 1]) {
          s.push({ type: 'swap', i: j, j: j + 1 });
          const tmp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = tmp;
        }
      }
      s.push({ type: 'sorted', index: a.length - i - 1 });
    }
    return s;
  }

  function playSteps() {
    if (animating || !steps.length) return;
    animating = true;
    function next() {
      if (stepIndex >= steps.length) {
        animating = false;
        drawArray();
        return;
      }
      const st = steps[stepIndex++];
      if (st.type === 'compare') {
        drawArray({ [st.i]: true, [st.j]: true });
      } else if (st.type === 'swap') {
        const tmp = array[st.i];
        array[st.i] = array[st.j];
        array[st.j] = tmp;
        drawArray({ [st.i]: true, [st.j]: true });
      } else if (st.type === 'sorted') {
        drawArray({ [st.index]: true });
      }
      setTimeout(next, 120);
    }
    next();
  }

  // Step-by-step control
  function stepOnce() {
    if (!steps.length || stepIndex >= steps.length) return;
    const st = steps[stepIndex++];
    if (st.type === 'compare') {
      drawArray({ [st.i]: true, [st.j]: true });
    } else if (st.type === 'swap') {
      const tmp = array[st.i];
      array[st.i] = array[st.j];
      array[st.j] = tmp;
      drawArray({ [st.i]: true, [st.j]: true });
    } else if (st.type === 'sorted') {
      drawArray({ [st.index]: true });
    }
  }

  // Controls
  const controls = document.querySelectorAll('#demo-algo .demo-controls button');
  controls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.demoAction;
      if (action === 'start') {
        steps = generateBubbleSteps(array);
        stepIndex = 0;
        playSteps();
      } else if (action === 'step') {
        if (!steps.length) steps = generateBubbleSteps(array);
        stepOnce();
      } else if (action === 'reset') {
        resetArray();
      }
    });
  });

  // Initialize
  resetArray();
})();

// =========================
// Mini Demo: Plagiarism Checker (simple client-side comparator)
// =========================
(function setupPlagDemo() {
  const input = $('#demo-plag-input');
  const result = $('#demo-plag-result');
  const compareBtn = document.querySelector('#demo-plag .demo-controls button[data-demo-action="compare"]');
  if (!input || !result || !compareBtn) return;

  function normalizeText(t) {
    return t
      .replace(/\/\/.*$/gm, '') // remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function jaccard(a, b) {
    const sa = new Set(a.split(' '));
    const sb = new Set(b.split(' '));
    const inter = new Set([...sa].filter(x => sb.has(x)));
    const union = new Set([...sa, ...sb]);
    return inter.size / (union.size || 1);
  }

  compareBtn.addEventListener('click', () => {
    const text = input.value || '';
    // naive split into two parts by delimiter (if user pasted two snippets separated by newline)
    const parts = text.split('\n\n').map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      result.textContent = 'Please paste two snippets separated by a blank line (\\n\\n).';
      return;
    }
    const a = normalizeText(parts[0]);
    const b = normalizeText(parts[1]);
    const score = jaccard(a, b);
    const percent = Math.round(score * 100);
    result.innerHTML = `<strong>Similarity:</strong> ${percent}% — ${score >= 0.6 ? 'High' : score >= 0.3 ? 'Moderate' : 'Low'}`;
  });
})();

// =========================
// Mini Demo: Chart (Result Analyzer) using lightweight drawing
// (Note: Chart.js is referenced in case of production; here we implement a simple demo)
// =========================
(function setupChartDemo() {
  const canvas = $('#demo-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // sample series
  const seriesA = [65, 72, 78, 75, 80, 85, 90, 88, 92, 95];
  const seriesB = [55, 60, 62, 68, 70, 72, 74, 76, 78, 80];
  let showA = true;
  let showB = true;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    // grid
    ctx.strokeStyle = 'rgba(15,23,42,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // draw series
    function drawSeries(data, color) {
      ctx.beginPath();
      const step = width / (data.length - 1);
      data.forEach((v, i) => {
        const x = i * step;
        const y = height - (v / 100) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      // points
      data.forEach((v, i) => {
        const x = i * step;
        const y = height - (v / 100) * height;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    if (showA) drawSeries(seriesA, 'rgba(108,99,255,0.95)');
    if (showB) drawSeries(seriesB, 'rgba(51,217,255,0.95)');
  }

  // Controls
  const toggleBtn = document.querySelector('#demo-chart .demo-controls button[data-demo-action="toggle-series"]');
  const exportBtn = document.querySelector('#demo-chart .demo-controls button[data-demo-action="export"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      // toggle series visibility
      if (showA && showB) { showB = false; }
      else if (showA && !showB) { showA = false; showB = true; }
      else { showA = true; showB = true; }
      draw();
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      // export CSV of sample data
      const rows = [['index', 'seriesA', 'seriesB']];
      for (let i = 0; i < seriesA.length; i++) {
        rows.push([i + 1, seriesA[i], seriesB[i]]);
      }
      const csv = rows.map(r => r.join(',')).join('\n');
      // create blob and trigger download (accessible)
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'result-analyzer-sample.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  draw();
})();

// =========================
// Skills card interactions (flip on focus/hover + keyboard accessible)
// =========================
skillCards.forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('hover'));
  card.addEventListener('mouseleave', () => card.classList.remove('hover'));
  card.addEventListener('focus', () => card.classList.add('hover'));
  card.addEventListener('blur', () => card.classList.remove('hover'));
  // allow Enter/Space to flip on keyboard
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('hover');
    }
  });
});

// Animate radial visuals based on data attributes
(function animateRadials() {
  const radials = $$('.radial');
  radials.forEach(r => {
    const val = parseInt(r.dataset.value || '60', 10);
    // create conic gradient dynamically
    r.style.background = `conic-gradient(var(--accent-1) 0% ${val}%, rgba(0,0,0,0.06) ${val}% 100%)`;
    r.textContent = `${val}%`;
  });
})();

// =========================
// Contact form handling (client-side validation + simulated send)
// =========================
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const status = $('#form-status');

    // Basic validation
    if (!name || !email || !message) {
      status.textContent = 'Please complete all fields before sending.';
      status.style.color = 'var(--accent-3)';
      return;
    }
    // Simulate sending with progressive UI
    status.textContent = 'Sending...';
    status.style.color = 'var(--muted-text)';
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // Simulated network delay
    setTimeout(() => {
      // In production, this would POST to an API endpoint with CSRF protection
      status.textContent = 'Message sent — thank you! I will respond within a few days.';
      status.style.color = 'var(--accent-2)';
      submitBtn.disabled = false;
      contactForm.reset();
      ariaAnnouncer.textContent = 'Contact form submitted';
    }, 900);
  });
}

// =========================
// Accessibility helpers & small polish
// =========================
function announce(text) {
  if (!ariaAnnouncer) return;
  ariaAnnouncer.textContent = text;
  setTimeout(() => { ariaAnnouncer.textContent = ''; }, 2000);
}

// Keyboard shortcuts (for power users / reviewers)
document.addEventListener('keydown', (e) => {
  // "g" then "p" to go to projects quickly (example)
  if (e.key === 'g' && e.ctrlKey) {
    e.preventDefault();
    smoothScrollTo('#projects');
    announce('Jumped to projects');
  }
});

// =========================
// Initial view animations & hydration
// =========================
function init() {
  // reveal header after load
  document.getElementById('site-header')?.classList.add('loaded');

  // ensure animated elements in view on load
  animatedEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('in-view');
  });

  // small entrance for hero CTA
  const cta = $('#cta-projects');
  if (cta) {
    cta.style.transform = 'translateY(8px) scale(0.98)';
    cta.style.opacity = '0';
    setTimeout(() => {
      cta.style.transition = 'transform 600ms var(--ease), opacity 600ms var(--ease)';
      cta.style.transform = '';
      cta.style.opacity = '';
    }, 2200);
  }

  // initial star/nebula draw
  drawStars();
  drawNebula();

  // announce readiness for screen readers
  announce('Portfolio loaded. Navigation: About, Projects, Skills, Contact.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =========================
// Graceful degradation & feature detection
// =========================
(function featureDetect() {
  // Dialog polyfill hint: if dialog not supported, ensure modals still accessible
  if (typeof HTMLDialogElement === 'undefined') {
    $$('#modals dialog').forEach(d => {
      d.style.position = 'fixed';
      d.style.left = '50%';
      d.style.top = '50%';
      d.style.transform = 'translate(-50%,-50%)';
      d.style.zIndex = 2000;
      d.style.display = 'none';
      // show/hide via open attribute
      const observer = new MutationObserver(() => {
        if (d.hasAttribute('open')) d.style.display = 'block';
        else d.style.display = 'none';
      });
      observer.observe(d, { attributes: true });
    });
  }
})();

// End of script.js (Part 2)

