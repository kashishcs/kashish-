/*
  scripts.js - Part 1 of 2
  Purpose: Comprehensive client-side JavaScript for Kashish's portfolio.
  This file is intentionally verbose and heavily commented to serve as a realistic,
  educational, and extensible codebase. It implements UI behavior, demos, accessibility,
  and utilities used across the portfolio.

  Notes:
  - This is Part 1 of a two-part scripts.js split. Part 2 will continue and complete
    the implementation (additional utilities, extended demos, analytics stubs, and
    final initialization).
  - After concatenation, you may optionally split into modules or move parts into
    separate files for maintainability.
  - The code is dependency-free (vanilla JS) and aims to be readable for reviewers.
*/

/* ==========================================================================
   Table of Contents (Part 1)
   1. Global configuration and constants
   2. Lightweight DOM utilities
   3. Event helpers (throttle, debounce)
   4. Accessibility helpers (aria announce, focus management)
   5. Navigation: mobile toggle, smooth scroll, active link highlighting
   6. Reveal-on-scroll system (staggered reveals)
   7. Scroll progress bar
   8. Tooltip system for skill pills
   9. Demo: Sorting visualization (core generator functions)
   10. Demo: Sorting visualization (animation runner and controls)
   11. Demo: Quiz app (UI logic)
   12. Demo: Quiz app (state & persistence helpers)
   13. Utilities for parsing CSV/JSON (start)
   ========================================================================== */

/* ==========================================================================
   1. Global configuration and constants
   ========================================================================== */

const KS = (function () {
  // Namespace object to avoid polluting global scope
  const ns = {};

  // Visual / timing constants used across the site
  ns.CONFIG = {
    NAV_BREAKPOINT: 880, // px - mobile nav breakpoint
    REVEAL_THRESHOLD: 0.18, // IntersectionObserver threshold for reveals
    REVEAL_STAGGER_DEFAULT: 0.12, // seconds
    SCROLL_THROTTLE_MS: 20,
    RESIZE_DEBOUNCE_MS: 120,
    DEMO_ANIMATION_FRAME_DELAY: 40, // ms between demo frames
    SKILL_BAR_ANIM_DURATION: 600, // ms
    PREFERS_REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  // Simple logger wrapper (can be toggled off for production)
  ns.LOG = {
    enabled: true,
    log: function (...args) { if (this.enabled) console.log('[KS]', ...args); },
    warn: function (...args) { if (this.enabled) console.warn('[KS]', ...args); },
    error: function (...args) { if (this.enabled) console.error('[KS]', ...args); },
  };

  return ns;
})();

/* ==========================================================================
   2. Lightweight DOM utilities
   ========================================================================== */

(function (ns) {
  // Query helpers
  ns.$ = (sel, ctx = document) => ctx.querySelector(sel);
  ns.$$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Create element with attributes and optional children
  ns.create = function (tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      const v = attrs[k];
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else if (k.startsWith('data-')) {
        el.setAttribute(k, v);
      } else if (k === 'text') {
        el.textContent = v;
      } else {
        el.setAttribute(k, v);
      }
    }
    if (!Array.isArray(children)) children = [children];
    children.forEach(child => {
      if (child == null) return;
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else el.appendChild(child);
    });
    return el;
  };

  // Safe attribute getter
  ns.getData = (el, key, fallback = null) => {
    if (!el) return fallback;
    return el.getAttribute('data-' + key) || fallback;
  };

  // Add multiple event listeners convenience
  ns.on = (el, events, handler) => {
    events.split(' ').forEach(e => el.addEventListener(e, handler));
  };

  // Toggle class helper
  ns.toggleClass = (el, cls, force) => {
    if (!el) return;
    if (typeof force === 'boolean') el.classList.toggle(cls, force);
    else el.classList.toggle(cls);
  };

  // Ensure element exists
  ns.assert = (el, message) => {
    if (!el) {
      ns.LOG.warn('Assertion failed:', message);
      return false;
    }
    return true;
  };

})(KS);

/* ==========================================================================
   3. Event helpers (throttle, debounce)
   ========================================================================== */

(function (ns) {
  ns.throttle = function (fn, wait = 50) {
    let last = 0;
    let timeout = null;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) {
        if (timeout) { clearTimeout(timeout); timeout = null; }
        last = now;
        fn.apply(this, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          last = Date.now();
          timeout = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  };

  ns.debounce = function (fn, wait = 150) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

})(KS);

/* ==========================================================================
   4. Accessibility helpers (aria announce, focus management)
   ========================================================================== */

(function (ns) {
  // Live region announcer for screen readers
  ns.ariaAnnounce = (function () {
    let region = null;
    return function (text) {
      if (!region) {
        region = document.createElement('div');
        region.id = 'ks-aria-live';
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.style.position = 'absolute';
        region.style.left = '-9999px';
        region.style.width = '1px';
        region.style.height = '1px';
        region.style.overflow = 'hidden';
        document.body.appendChild(region);
      }
      region.textContent = text;
    };
  })();

  // Focus management: move focus to element and ensure it's visible
  ns.focusAndScroll = function (el) {
    if (!el) return;
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: false });
    // Remove tabindex after a short delay to keep DOM clean
    setTimeout(() => el.removeAttribute('tabindex'), 800);
  };

})(KS);

/* ==========================================================================
   5. Navigation: mobile toggle, smooth scroll, active link highlighting
   ========================================================================== */

(function (ns) {
  const cfg = ns.CONFIG;
  const log = ns.LOG;

  const navToggle = ns.$('#navToggle');
  const primaryNav = ns.$('#primaryNav');
  const navLinks = ns.$$('.nav-link');

  function updateNavVisibility() {
    if (!navToggle || !primaryNav) return;
    if (window.innerWidth <= cfg.NAV_BREAKPOINT) {
      navToggle.style.display = 'block';
    } else {
      navToggle.style.display = 'none';
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Initialize
  updateNavVisibility();
  window.addEventListener('resize', ns.debounce(updateNavVisibility, cfg.RESIZE_DEBOUNCE_MS));

  // Toggle handler
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      ns.LOG.log('Nav toggled:', open);
    });
  }

  // Smooth scroll for elements with data-scroll attribute
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scroll]');
    if (!btn) return;
    const targetSelector = btn.getAttribute('data-scroll');
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile nav if open
    if (primaryNav && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Active link highlighting using IntersectionObserver
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window && sections.length) {
    const observerOptions = { root: null, threshold: 0.32 };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector('.nav-link[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, observerOptions);
    sections.forEach(s => sectionObserver.observe(s));
  } else {
    // Fallback: highlight based on scroll position
    window.addEventListener('scroll', ns.throttle(() => {
      const scrollPos = window.scrollY + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const link = document.querySelector('.nav-link[href="#' + sec.id + '"]');
        if (!link) return;
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, 100));
  }

  // Close mobile nav on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav && primaryNav.classList.contains('open')) {
      primaryNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  ns.LOG.log('Navigation module initialized');

})(KS);

/* ==========================================================================
   6. Reveal-on-scroll system (staggered reveals)
   ========================================================================== */

(function (ns) {
  const cfg = ns.CONFIG;
  const revealEls = ns.$$('.reveal');

  if (cfg.PREFERS_REDUCED_MOTION) {
    // Respect reduced motion: reveal everything immediately without animation
    revealEls.forEach(el => el.classList.add('visible'));
    ns.LOG.log('Reduced motion: reveals applied immediately');
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.getAttribute('data-delay') || 0);
          if (delay) el.style.transitionDelay = `${delay}s`;
          el.classList.add('visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: cfg.REVEAL_THRESHOLD });

    revealEls.forEach(el => observer.observe(el));
    ns.LOG.log('Reveal-on-scroll observer initialized with', revealEls.length, 'elements');
  } else {
    // Fallback: reveal all with small stagger
    revealEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * cfg.REVEAL_STAGGER_DEFAULT * 1000);
    });
    ns.LOG.log('Reveal fallback applied');
  }
})(KS);

/* ==========================================================================
   7. Scroll progress bar
   ========================================================================== */

(function (ns) {
  const cfg = ns.CONFIG;
  const progress = ns.$('#scrollProgress');

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
  }

  window.addEventListener('scroll', ns.throttle(updateProgress, cfg.SCROLL_THROTTLE_MS));
  updateProgress();

  ns.LOG.log('Scroll progress initialized');
})(KS);

/* ==========================================================================
   8. Tooltip system for skill pills
   ========================================================================== */

(function (ns) {
  const pills = ns.$$('.pill');

  pills.forEach(p => {
    p.addEventListener('mouseenter', (e) => {
      const text = p.dataset.tooltip || p.textContent.trim();
      if (!text) return;
      const tip = document.createElement('div');
      tip.className = 'pill-tooltip';
      tip.textContent = text;
      // Inline styles for demo; production should move to CSS
      Object.assign(tip.style, {
        position: 'fixed',
        background: 'rgba(255,255,255,0.98)',
        color: '#6b7280',
        padding: '6px 10px',
        borderRadius: '8px',
        border: '1px solid rgba(15,23,42,0.06)',
        boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        fontSize: '12px',
        zIndex: 120,
        whiteSpace: 'nowrap',
        opacity: '0',
        transition: 'opacity .12s ease, transform .12s ease',
        transform: 'translateY(-6px)'
      });
      document.body.appendChild(tip);
      // Position
      const rect = p.getBoundingClientRect();
      tip.style.left = Math.max(8, (rect.left + rect.width / 2) - (tip.offsetWidth / 2)) + 'px';
      tip.style.top = Math.max(8, rect.top - tip.offsetHeight - 8) + 'px';
      // Fade in
      requestAnimationFrame(() => {
        tip.style.opacity = '1';
        tip.style.transform = 'translateY(0)';
      });
      p._tooltip = tip;
    });

    p.addEventListener('mouseleave', () => {
      if (p._tooltip) {
        p._tooltip.remove();
        p._tooltip = null;
      }
    });

    // For keyboard accessibility: show tooltip on focus
    p.addEventListener('focus', (e) => {
      const ev = new Event('mouseenter');
      p.dispatchEvent(ev);
    });
    p.addEventListener('blur', (e) => {
      const ev = new Event('mouseleave');
      p.dispatchEvent(ev);
    });
  });

  ns.LOG.log('Skill pill tooltips initialized for', pills.length, 'pills');

})(KS);

/* ==========================================================================
   9. Demo: Sorting visualization (core generator functions)
   ========================================================================== */

/*
  This section defines generator functions that yield intermediate steps for
  sorting algorithms. These are pure functions that accept an array and yield
  snapshots (arrays) and optional highlight indices. The animation runner
  consumes these generators to animate the sorting process.
*/

(function (ns) {
  // Bubble sort step generator
  ns.bubbleSteps = function* (inputArray) {
    const arr = inputArray.slice();
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          // yield a snapshot and highlight the swapped indices
          yield { arr: arr.slice(), highlight: [j, j + 1] };
        }
      }
      if (!swapped) break;
    }
    // final state
    return { arr, highlight: [] };
  };

  // Insertion sort step generator
  ns.insertionSteps = function* (inputArray) {
    const arr = inputArray.slice();
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0 && arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        yield { arr: arr.slice(), highlight: [j - 1, j] };
        j--;
      }
    }
    return { arr, highlight: [] };
  };

  // Selection sort step generator (additional algorithm)
  ns.selectionSteps = function* (inputArray) {
    const arr = inputArray.slice();
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
        // optional: yield comparison highlight
        yield { arr: arr.slice(), highlight: [minIdx, j] };
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        yield { arr: arr.slice(), highlight: [i, minIdx] };
      }
    }
    return { arr, highlight: [] };
  };

  // Merge sort step generator (yields after merges)
  ns.mergeSortSteps = function* (inputArray) {
    // We'll implement a simple iterative merge that yields after each merge
    const arr = inputArray.slice();
    const n = arr.length;
    let width = 1;
    while (width < n) {
      for (let i = 0; i < n; i += 2 * width) {
        const left = arr.slice(i, Math.min(i + width, n));
        const right = arr.slice(Math.min(i + width, n), Math.min(i + 2 * width, n));
        // merge left and right into arr starting at i
        let li = 0, ri = 0, k = i;
        while (li < left.length && ri < right.length) {
          if (left[li] <= right[ri]) arr[k++] = left[li++];
          else arr[k++] = right[ri++];
        }
        while (li < left.length) arr[k++] = left[li++];
        while (ri < right.length) arr[k++] = right[ri++];
        // yield after each merge
        yield { arr: arr.slice(), highlight: [i, Math.min(i + 2 * width - 1, n - 1)] };
      }
      width *= 2;
    }
    return { arr, highlight: [] };
  };

  ns.LOG.log('Sorting step generators registered: bubble, insertion, selection, merge');

})(KS);

/* ==========================================================================
   10. Demo: Sorting visualization (animation runner and controls)
   ========================================================================== */

(function (ns) {
  // This module wires the canvas demo controls to the generator functions above.
  // It handles resizing, drawing, and stepping through generator outputs.

  const canvas = ns.$('.demo-canvas');
  if (!canvas) {
    ns.LOG.warn('Sorting demo canvas not found; skipping demo initialization');
    return;
  }

  const ctx = canvas.getContext('2d');
  let arr = [];
  const N = 28; // number of bars in demo
  let animFrame = null;
  let currentGenerator = null;
  let isAnimating = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, rect.width);
    canvas.height = 120;
    draw(arr);
  }

  function randomArray() {
    const a = [];
    for (let i = 0; i < N; i++) a.push(10 + Math.round(Math.random() * 90));
    return a;
  }

  function draw(a = [], highlight = []) {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const barW = w / a.length;
    a.forEach((v, i) => {
      const x = i * barW;
      const barH = (v / 100) * (h - 10);
      ctx.fillStyle = highlight.includes(i) ? '#ffdfe8' : '#cfe8ff';
      roundRect(ctx, x + 2, h - barH - 6, barW - 4, barH, 4);
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }

  // Animation runner consumes a generator and animates its yielded steps
  function runGenerator(gen) {
    if (!gen || typeof gen.next !== 'function') return;
    if (animFrame) cancelAnimationFrame(animFrame);
    isAnimating = true;

    function step() {
      const next = gen.next();
      if (!next.done) {
        draw(next.value.arr, next.value.highlight || []);
        animFrame = requestAnimationFrame(() => setTimeout(step, ns.CONFIG.DEMO_ANIMATION_FRAME_DELAY));
      } else {
        draw(next.value.arr, []);
        isAnimating = false;
      }
    }
    step();
  }

  // Wire up demo buttons
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-demo');
      if (action === 'shuffle') {
        arr = randomArray();
        draw(arr);
      } else if (action === 'bubble') {
        if (isAnimating) return;
        currentGenerator = ns.bubbleSteps(arr);
        runGenerator(currentGenerator);
      } else if (action === 'insertion') {
        if (isAnimating) return;
        currentGenerator = ns.insertionSteps(arr);
        runGenerator(currentGenerator);
      } else if (action === 'selection') {
        if (isAnimating) return;
        currentGenerator = ns.selectionSteps(arr);
        runGenerator(currentGenerator);
      } else if (action === 'merge') {
        if (isAnimating) return;
        currentGenerator = ns.mergeSortSteps(arr);
        runGenerator(currentGenerator);
      }
    });
  });

  // Initialize demo
  arr = randomArray();
  resizeCanvas();
  window.addEventListener('resize', ns.throttle(resizeCanvas, ns.CONFIG.RESIZE_DEBOUNCE_MS));

  ns.LOG.log('Sorting demo initialized');

})(KS);

/* ==========================================================================
   11. Demo: Quiz app (UI logic)
   ========================================================================== */

(function (ns) {
  const quizRoot = ns.$('.quiz-demo');
  if (!quizRoot) {
    ns.LOG.warn('Quiz demo root not found; skipping quiz initialization');
    return;
  }

  // Elements
  const opts = Array.from(quizRoot.querySelectorAll('.quiz-opt'));
  const feedback = quizRoot.querySelector('.quiz-feedback');
  const nextBtn = quizRoot.querySelector('.quiz-next');
  const resetBtn = quizRoot.querySelector('.quiz-reset');

  // Simple question model for demo (expandable)
  const questions = [
    {
      id: 'q1',
      prompt: 'What is the time complexity of binary search on a sorted array?',
      choices: ['O(log n)', 'O(n)', 'O(n log n)'],
      answer: 'O(log n)',
      explanation: 'Binary search halves the search space each step, so it runs in logarithmic time.'
    },
    {
      id: 'q2',
      prompt: 'Which data structure is best for FIFO ordering?',
      choices: ['Stack', 'Queue', 'Priority Queue'],
      answer: 'Queue',
      explanation: 'A queue follows first-in-first-out ordering.'
    }
  ];

  // State
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;
    // Update UI
    const questionEl = quizRoot.querySelector('.quiz-question');
    questionEl.textContent = q.prompt;
    const optionEls = quizRoot.querySelectorAll('.quiz-opt');
    optionEls.forEach((optEl, i) => {
      optEl.textContent = q.choices[i];
      optEl.setAttribute('data-answer', q.choices[i]);
      optEl.disabled = false;
      optEl.style.opacity = '1';
    });
    feedback.textContent = 'Select an answer to see feedback.';
    feedback.style.color = '#6b7280';
    answered = false;
    ns.ariaAnnounce('New question loaded');
  }

  // Initialize first question
  renderQuestion(currentIndex);

  // Option click handler
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      if (answered) return;
      const val = opt.getAttribute('data-answer');
      const q = questions[currentIndex];
      answered = true;
      if (val === q.answer) {
        feedback.textContent = 'Correct — ' + q.explanation;
        feedback.style.color = '#0f172a';
        score += 1;
        ns.ariaAnnounce('Correct answer selected.');
      } else {
        feedback.textContent = 'Not quite — ' + q.explanation;
        feedback.style.color = '#6b7280';
        ns.ariaAnnounce('Incorrect answer selected.');
      }
      // Visual highlight
      opts.forEach(o => o.style.opacity = (o === opt ? '1' : '0.7'));
    });
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % questions.length;
    renderQuestion(currentIndex);
  });

  resetBtn.addEventListener('click', () => {
    currentIndex = 0;
    score = 0;
    renderQuestion(currentIndex);
  });

  ns.LOG.log('Quiz demo initialized with', questions.length, 'questions');

})(KS);

/* ==========================================================================
   12. Demo: Quiz app (state & persistence helpers)
   ========================================================================== */

(function (ns) {
  // Simple persistence for demo: store quiz progress in localStorage
  const STORAGE_KEY = 'ks_quiz_progress_v1';

  ns.quizPersistence = {
    save: function (state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        ns.LOG.log('Quiz state saved');
      } catch (err) {
        ns.LOG.warn('Failed to save quiz state', err);
      }
    },
    load: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err) {
        ns.LOG.warn('Failed to load quiz state', err);
        return null;
      }
    },
    clear: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        ns.LOG.log('Quiz state cleared');
      } catch (err) {
        ns.LOG.warn('Failed to clear quiz state', err);
      }
    }
  };

  // Example usage (not wired to UI in Part 1; Part 2 may wire it)
  // ns.quizPersistence.save({ lastQuestion: 0, score: 0 });

})(KS);

/* ==========================================================================
   13. Utilities for parsing CSV/JSON (start)
   ========================================================================== */

(function (ns) {
  // Very small CSV parser for demo purposes. Expects a header row.
  ns.parseCSV = function (text) {
    if (!text) return [];
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const header = lines.shift().split(',').map(h => h.trim());
    const rows = lines.map(line => {
      const cols = line.split(',').map(c => c.trim());
      const obj = {};
      header.forEach((h, i) => obj[h] = cols[i] || '');
      return obj;
    });
    return rows;
  };

  // Safe JSON parse
  ns.safeJSON = function (text) {
    try {
      return JSON.parse(text);
    } catch (err) {
      ns.LOG.warn('JSON parse failed', err);
      return null;
    }
  };

  ns.LOG.log('CSV/JSON utilities registered');

})(KS);


  // Validate that CSV has required columns for study analyzer demo
  ns.validateStudyCSV = function (rows) {
    // rows: array of objects produced by parseCSV
    if (!Array.isArray(rows) || rows.length === 0) return { ok: false, reason: 'empty' };
    const keys = Object.keys(rows[0]).map(k => k.toLowerCase());
    const required = ['subject', 'minutes', 'date'];
    const missing = required.filter(r => !keys.includes(r));
    if (missing.length) return { ok: false, reason: 'missing_columns', missing };
    return { ok: true };
  };

  // Convert CSV rows to normalized session objects
  ns.normalizeSessionsFromCSV = function (rows) {
    // rows: [{subject: 'Math', minutes: '45', date: '2025-01-01'}, ...]
    return rows.map(r => {
      const subject = (r.subject || r.Subject || '').trim();
      const minutesRaw = (r.minutes || r.Minutes || r.minutes || '').toString().trim();
      const minutes = parseInt(minutesRaw, 10) || 0;
      const dateRaw = (r.date || r.Date || '').trim();
      const date = dateRaw ? new Date(dateRaw) : null;
      return { subject, minutes, date };
    }).filter(s => s.subject && s.minutes > 0);
  };

  // Simple CSV to sessions pipeline
  ns.sessionsFromCSVText = function (text) {
    const rows = ns.parseCSV(text);
    const validation = ns.validateStudyCSV(rows);
    if (!validation.ok) return { ok: false, error: validation };
    const sessions = ns.normalizeSessionsFromCSV(rows);
    return { ok: true, sessions };
  };

  // Utility: pretty format minutes to hours/minutes
  ns.formatMinutes = function (m) {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  ns.LOG.log('Extended CSV/JSON utilities loaded');

})(KS);

/* ==========================================================================
   15. Study Analyzer demo wiring and chart rendering
   ========================================================================== */

(function (ns) {
  const fileInput = document.getElementById('studyCsv');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const chartPlaceholder = document.querySelector('.chart-placeholder');

  if (!fileInput || !analyzeBtn || !chartPlaceholder) {
    ns.LOG.warn('Study Analyzer elements not found; skipping study analyzer wiring');
    return;
  }

  // Render a simple bar chart using DOM elements (no external libs)
  function renderBarChart(container, dataMap) {
    // dataMap: { subject: minutes, ... }
    container.innerHTML = ''; // clear
    const total = Object.values(dataMap).reduce((a, b) => a + b, 0) || 1;
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '8px';
    Object.keys(dataMap).forEach(subject => {
      const minutes = dataMap[subject];
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '12px';

      const label = document.createElement('div');
      label.textContent = subject;
      label.style.width = '110px';
      label.style.color = '#6b7280';
      label.style.fontSize = '0.9rem';

      const barWrap = document.createElement('div');
      barWrap.style.flex = '1';
      barWrap.style.background = 'linear-gradient(90deg, rgba(15,23,42,0.04), rgba(15,23,42,0.02))';
      barWrap.style.borderRadius = '999px';
      barWrap.style.height = '12px';
      barWrap.style.overflow = 'hidden';
      barWrap.style.position = 'relative';

      const bar = document.createElement('div');
      const pct = Math.round((minutes / total) * 100);
      bar.style.width = pct + '%';
      bar.style.height = '100%';
      bar.style.background = 'linear-gradient(90deg,#cfe8ff,#eafaf6)';
      bar.style.transition = 'width 600ms ease';
      barWrap.appendChild(bar);

      const meta = document.createElement('div');
      meta.textContent = ns.formatMinutes(minutes);
      meta.style.width = '80px';
      meta.style.color = '#6b7280';
      meta.style.fontSize = '0.9rem';
      meta.style.textAlign = 'right';

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(meta);
      wrapper.appendChild(row);
    });
    container.appendChild(wrapper);
  }

  // Parse uploaded file and render chart
  analyzeBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert('Please choose a CSV or JSON file (demo).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      let sessions = null;
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = ns.safeJSON(text);
        if (!parsed) {
          alert('Invalid JSON file.');
          return;
        }
        // Expect array of {subject, minutes, date}
        sessions = parsed.map(s => ({
          subject: s.subject || s.sub || s.subjectName || '',
          minutes: parseInt(s.minutes || s.mins || s.duration || 0, 10) || 0,
          date: s.date ? new Date(s.date) : null
        })).filter(s => s.subject && s.minutes > 0);
      } else {
        const result = ns.sessionsFromCSVText(text);
        if (!result.ok) {
          alert('CSV parse error: ensure header includes subject,minutes,date');
          return;
        }
        sessions = result.sessions;
      }
      if (!sessions || sessions.length === 0) {
        alert('No valid sessions found in file.');
        return;
      }
      // Aggregate
      const agg = sessions.reduce((acc, s) => {
        acc[s.subject] = (acc[s.subject] || 0) + s.minutes;
        return acc;
      }, {});
      renderBarChart(chartPlaceholder, agg);
    };
    reader.readAsText(file);
  });

  ns.LOG.log('Study Analyzer wiring complete');

})(KS);

/* ==========================================================================
   16. Contact form enhancements: validation, UX, and accessibility
   ========================================================================== */

(function (ns) {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) {
    ns.LOG.warn('Contact form not found; skipping contact enhancements');
    return;
  }

  // Simple email regex for demo validation
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateContactForm() {
    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const message = (document.getElementById('message') || {}).value || '';
    const errors = [];
    if (!name.trim()) errors.push('Please enter your name.');
    if (!email.trim() || !EMAIL_RE.test(email.trim())) errors.push('Please enter a valid email address.');
    if (!message.trim() || message.trim().length < 10) errors.push('Please enter a message (at least 10 characters).');
    return { ok: errors.length === 0, errors };
  }

  // Inline feedback element
  let feedbackEl = document.getElementById('contactFeedback');
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.id = 'contactFeedback';
    feedbackEl.setAttribute('role', 'status');
    feedbackEl.style.marginTop = '0.6rem';
    feedbackEl.style.color = '#6b7280';
    contactForm.appendChild(feedbackEl);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = validateContactForm();
    if (!result.ok) {
      feedbackEl.textContent = result.errors.join(' ');
      feedbackEl.style.color = '#b91c1c'; // red-ish
      ns.ariaAnnounce(result.errors.join(' '));
      return;
    }
    // Demo success behavior
    feedbackEl.textContent = 'Thanks! This is a demo form. Replace with a backend to send messages.';
    feedbackEl.style.color = '#0f172a';
    ns.ariaAnnounce('Contact form submitted. Demo only.');
    contactForm.reset();
  });

  // Basic client-side accessibility: focus first invalid field on validation failure
  contactForm.addEventListener('invalid', (e) => {
    e.preventDefault();
    const field = e.target;
    ns.focusAndScroll(field);
  }, true);

  ns.LOG.log('Contact form enhancements applied');

})(KS);

/* ==========================================================================
   17. Accessibility improvements: focus outlines, skip links, and live regions
   ========================================================================== */

(function (ns) {
  // Ensure skip link is visible when focused
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.style.position = 'absolute';
    skip.style.left = '-9999px';
    skip.style.top = 'auto';
    skip.style.width = '1px';
    skip.style.height = '1px';
    skip.style.overflow = 'hidden';
    skip.addEventListener('focus', () => {
      skip.style.left = '12px';
      skip.style.top = '12px';
      skip.style.width = 'auto';
      skip.style.height = 'auto';
      skip.style.background = '#fff';
      skip.style.padding = '8px 12px';
      skip.style.borderRadius = '6px';
      skip.style.boxShadow = '0 8px 24px rgba(15,23,42,0.08)';
      skip.style.zIndex = '9999';
    });
    skip.addEventListener('blur', () => {
      skip.style.left = '-9999px';
      skip.style.top = 'auto';
      skip.style.width = '1px';
      skip.style.height = '1px';
      skip.style.padding = '0';
      skip.style.boxShadow = 'none';
    });
  }

  // Ensure focus outlines are visible for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('show-focus-outlines');
    }
  });

  // Add a small live region for general announcements (if not already present)
  if (!document.getElementById('ks-global-live')) {
    const lr = document.createElement('div');
    lr.id = 'ks-global-live';
    lr.setAttribute('aria-live', 'polite');
    lr.setAttribute('aria-atomic', 'true');
    lr.style.position = 'absolute';
    lr.style.left = '-9999px';
    document.body.appendChild(lr);
  }

  ns.LOG.log('Accessibility helpers initialized');

})(KS);

/* ==========================================================================
   18. Analytics stub and performance instrumentation
   ========================================================================== */

(function (ns) {
  // Lightweight analytics stub for demo: collects page timing and user interactions
  ns.analytics = (function () {
    const events = [];
    const enabled = false; // set to true to enable logging of events (demo only)

    function track(name, payload = {}) {
      const ev = { name, payload, ts: Date.now() };
      events.push(ev);
      if (enabled) console.log('[KS Analytics]', ev);
    }

    // Collect basic performance metrics
    function collectPerformance() {
      if (!('performance' in window)) return;
      const timing = performance.timing || {};
      const nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
      const metrics = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadEvent: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType ? (performance.getEntriesByType('paint').find(p => p.name === 'first-paint') || {}).startTime : null,
        navigationType: nav ? nav.type : null
      };
      track('performance', metrics);
    }

    // Expose a flush method (demo)
    function flush() {
      // In production, send to analytics endpoint
      if (enabled) console.log('Flushing analytics events', events);
      // Clear events
      events.length = 0;
    }

    // Auto-collect on load
    window.addEventListener('load', () => {
      setTimeout(collectPerformance, 1000);
    });

    return { track, flush, events };
  })();

  ns.LOG.log('Analytics stub initialized (disabled by default)');

})(KS);

/* ==========================================================================
   19. Debug utilities and feature toggles
   ========================================================================== */

(function (ns) {
  // Toggle features for development and testing
  ns.FEATURES = {
    showDebugOverlay: false,
    enableVerboseLogging: false
  };

  // Debug overlay (optional)
  function createDebugOverlay() {
    if (!ns.FEATURES.showDebugOverlay) return;
    const overlay = document.createElement('div');
    overlay.id = 'ks-debug-overlay';
    overlay.style.position = 'fixed';
    overlay.style.right = '12px';
    overlay.style.bottom = '12px';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.color = '#fff';
    overlay.style.padding = '8px 12px';
    overlay.style.borderRadius = '8px';
    overlay.style.zIndex = '99999';
    overlay.style.fontSize = '12px';
    overlay.textContent = 'KS Debug';
    document.body.appendChild(overlay);
    // Update overlay with some runtime info
    setInterval(() => {
      overlay.textContent = `KS Debug — ${new Date().toLocaleTimeString()}`;
    }, 1000);
  }

  // Toggle logging
  if (ns.FEATURES.enableVerboseLogging) ns.LOG.enabled = true;
  else ns.LOG.enabled = false;

  createDebugOverlay();

  ns.LOG.log('Debug utilities configured', ns.FEATURES);

})(KS);

/* ==========================================================================
   20. Final initialization and readiness checks
   ========================================================================== */

(function (ns) {
  // Final readiness: ensure critical elements exist and announce readiness
  function ready() {
    ns.LOG.log('KS ready: performing final checks');

    // Check critical elements
    const critical = ['#hero', '#about', '#skills', '#projects', '#contact', '#siteFooter'];
    const missing = critical.filter(sel => !document.querySelector(sel));
    if (missing.length) {
      ns.LOG.warn('Missing critical selectors:', missing);
    } else {
      ns.LOG.log('All critical selectors present');
    }

    // Announce to screen readers that the page is ready
    ns.ariaAnnounce('Portfolio content loaded');

    // Optionally, run any queued analytics
    if (ns.analytics) ns.analytics.track('page_ready', { ts: Date.now() });

    // Expose a small API on window for debugging (demo only)
    window.KS = ns;
  }

  // Run ready after DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

  ns.LOG.log('Final initialization scheduled');

})(KS);


