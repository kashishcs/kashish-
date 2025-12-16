/* script.js — overlay + galaxy effects + intensity control
   - Loads projects.json
   - Renders project cards (massive grid)
   - Opens project overlay in same page (hides rest)
   - Focus trap and accessibility
   - Nebula + stars canvas with intensity control
   - Tweakable animation intensity (hero + overlay)
*/

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Elements
  const projectsGrid = document.getElementById('projects-grid');
  const overlay = document.getElementById('project-overlay');
  const overlayBackdrop = document.getElementById('overlay-backdrop');
  const overlayPanel = document.querySelector('.overlay-panel');
  const overlayClose = document.getElementById('overlay-close');
  const overlayTitle = document.getElementById('overlay-title');
  const overlaySub = document.getElementById('overlay-sub');
  const overlayDesc = document.getElementById('overlay-desc');
  const overlayTech = document.getElementById('overlay-tech');
  const overlayLinks = document.getElementById('overlay-links');
  const overlayLogic = document.getElementById('overlay-logic');
  const overlayIntensity = document.getElementById('overlay-intensity');
  const globalIntensity = document.getElementById('intensity');

  // Accessibility helpers
  let lastFocused = null;
  function trapFocus(container) {
    const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handle(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape') {
        closeOverlay();
      }
    }
    container.addEventListener('keydown', handle);
    return () => container.removeEventListener('keydown', handle);
  }

  // Load projects.json and render
  fetch('projects.json')
    .then(res => res.json())
    .then(data => renderProjects(data.projects))
    .catch(() => {
      // fallback list (keeps content intact)
      const fallback = [
        {"id":"algorithm-visual-playground","title":"Algorithm Visual Playground","desc":"A visual tool that demonstrates how core algorithms work through step‑by‑step animations. Includes sorting, recursion, BFS/DFS, and pathfinding. Focuses on clarity and algorithmic thinking.","tech":"Python / JavaScript; Algorithms; Data Structures; Git; VS Code","github":"","demo":""},
        {"id":"plagiarism-checker","title":"Plagiarism Checker","desc":"A text‑comparison system that detects similarity between documents using Jaccard, Cosine Similarity, and sequence matching. Preprocesses text and calculates similarity scores.","tech":"Python; difflib; SQL (optional); Git; VS Code","github":"","demo":""},
        {"id":"quiz-app","title":"Quiz App","desc":"A multiple‑choice quiz application with scoring, results, and a question bank. Demonstrates OOP concepts and structured programming.","tech":"Python / Java; OOP; Git; VS Code","github":"","demo":""},
        {"id":"student-study-analyzer","title":"Student Study Analyzer","desc":"An analytics tool that tracks study sessions and identifies productivity patterns (hours, consistency, subject focus) to provide actionable insights.","tech":"Python; CSV/JSON; Git; VS Code","github":"","demo":""}
      ];
      renderProjects(fallback);
    });

  function renderProjects(list) {
    projectsGrid.innerHTML = '';
    // create a "massive" grid by repeating items if needed
    const targetCount = Math.max(9, list.length);
    for (let i = 0; i < targetCount; i++) {
      const p = list[i % list.length];
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-content">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="project-desc">${escapeHtml(p.desc)}</p>
          <p class="project-tech"><strong>Tech Used:</strong> ${escapeHtml(p.tech)}</p>
          <div class="project-links">
            <button class="btn-small open-project" data-id="${escapeHtml(p.id)}" data-title="${escapeHtml(p.title)}" data-desc="${escapeHtml(p.desc)}" data-tech="${escapeHtml(p.tech)}" data-github="${escapeHtml(p.github || '')}" data-demo="${escapeHtml(p.demo || '')}">Open Project</button>
            <a class="btn-small" href="${p.github || '#'}" ${p.github ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.github ? 'GitHub' : 'GitHub (to be added)'}</a>
            <a class="btn-small ghost" href="${p.demo || '#'}" ${p.demo ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.demo ? 'Live Demo' : 'Live Demo (to be added)'}</a>
          </div>
        </div>
      `;
      projectsGrid.appendChild(card);
    }

    // attach open handlers
    document.querySelectorAll('.open-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget;
        const meta = {
          id: el.dataset.id,
          title: el.dataset.title,
          desc: el.dataset.desc,
          tech: el.dataset.tech,
          github: el.dataset.github,
          demo: el.dataset.demo
        };
        openOverlay(meta);
      });
    });

    initReveal();
  }

  // Overlay open/close
  let removeTrap = null;
  function openOverlay(meta) {
    // fill overlay content (preserve original content)
    overlayTitle.textContent = meta.title;
    overlaySub.textContent = meta.id.replace(/-/g, ' ');
    overlayDesc.textContent = meta.desc;
    overlayTech.textContent = meta.tech;
    overlayLinks.innerHTML = '';
    if (meta.github) {
      overlayLinks.innerHTML += `<a class="btn-small" href="${meta.github}" target="_blank" rel="noopener">GitHub</a> `;
    } else {
      overlayLinks.innerHTML += `<span class="btn-small" aria-disabled="true">GitHub (to be added)</span> `;
    }
    if (meta.demo) {
      overlayLinks.innerHTML += `<a class="btn-small ghost" href="${meta.demo}" target="_blank" rel="noopener">Live Demo</a>`;
    } else {
      overlayLinks.innerHTML += `<span class="btn-small ghost" aria-disabled="true">Live Demo (to be added)</span>`;
    }

    // show overlay and hide main content from assistive tech
    overlay.setAttribute('aria-hidden', 'false');
    document.querySelectorAll('main, header, footer').forEach(el => el.setAttribute('aria-hidden', 'true'));
    lastFocused = document.activeElement;
    overlayClose.focus();

    // trap focus
    removeTrap = trapFocus(overlayPanel);

    // pause page scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('main, header, footer').forEach(el => el.removeAttribute('aria-hidden'));
    if (removeTrap) removeTrap();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  overlayClose.addEventListener('click', closeOverlay);
  overlayBackdrop.addEventListener('click', closeOverlay);

  // intensity controls: global and overlay-specific
  function applyIntensity(value) {
    // value 0..100
    // map to particle speed, nebula alpha, twinkle amplitude, overlay motion
    const speedFactor = 0.2 + (value / 100) * 1.6; // 0.2..1.8
    const nebulaAlpha = 0.04 + (value / 100) * 0.22; // 0.04..0.26
    const twinkleAmp = 0.02 + (value / 100) * 0.18; // 0.02..0.2
    // set CSS variables for subtle motion
    document.documentElement.style.setProperty('--nebula-alpha', nebulaAlpha.toFixed(3));
    document.documentElement.style.setProperty('--particle-speed', speedFactor.toFixed(3));
    document.documentElement.style.setProperty('--twinkle-amp', twinkleAmp.toFixed(3));
    // store for canvas usage
    window.__ANIM_INTENSITY = value;
  }

  // initial intensity
  applyIntensity(parseInt(globalIntensity.value, 10));

  globalIntensity.addEventListener('input', (e) => {
    applyIntensity(parseInt(e.target.value, 10));
  });

  overlayIntensity.addEventListener('input', (e) => {
    // overlay intensity overrides global for overlay canvas effects
    const v = parseInt(e.target.value, 10);
    applyIntensity(v);
    // sync global slider visually
    globalIntensity.value = v;
  });

  // Reveal on scroll for cards and sections
  function initReveal(){
    const items = document.querySelectorAll('.skill-card, .project-card, .contact-card, .about-text, .about-card');
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          o.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    items.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 700ms ease-out, transform 700ms ease-out';
      obs.observe(el);
    });
  }

  // Simple HTML escape
  function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Nebula + stars canvas (stronger, intensity-aware)
  const canvas = document.getElementById('nebula-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    let stars = [];
    let nebulas = [];
    let lastResize = 0;

    function rand(min, max){ return Math.random()*(max-min)+min; }

    function createScene(){
      stars = [];
      nebulas = [];
      const STAR_COUNT = Math.max(80, Math.floor((w*h)/9000));
      const NEBULA_COUNT = Math.max(3, Math.floor((w*h)/200000));
      for (let i=0;i<STAR_COUNT;i++){
        stars.push({
          x: rand(0,w),
          y: rand(0,h),
          r: rand(0.4,1.8),
          tw: rand(0.02,0.12),
          hue: rand(200,320),
          alphaBase: rand(0.4,1)
        });
      }
      for (let i=0;i<NEBULA_COUNT;i++){
        nebulas.push({
          x: rand(-w*0.2,w*1.2),
          y: rand(-h*0.2,h*1.2),
          r: rand(Math.min(w,h)*0.25, Math.min(w,h)*0.6),
          hue: rand(240,320),
          alpha: rand(0.06,0.18),
          vx: rand(-0.02,0.02),
          vy: rand(-0.01,0.01)
        });
      }
    }

    function draw() {
      const intensity = (window.__ANIM_INTENSITY || 50) / 100;
      const speedFactor = 0.2 + intensity * 1.6;
      const nebulaAlphaBase = 0.04 + intensity * 0.22;
      const twinkleAmp = 0.02 + intensity * 0.18;

      ctx.clearRect(0,0,w,h);

      // base gradient
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, 'rgba(6,10,20,1)');
      g.addColorStop(1, 'rgba(8,12,22,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

      // nebulas
      nebulas.forEach(n => {
        n.x += n.vx * speedFactor * 0.6;
        n.y += n.vy * speedFactor * 0.6;
        const rg = ctx.createRadialGradient(n.x, n.y, n.r*0.1, n.x, n.y, n.r);
        rg.addColorStop(0, `hsla(${n.hue},70%,70%,${(n.alpha * nebulaAlphaBase).toFixed(3)})`);
        rg.addColorStop(0.4, `hsla(${n.hue},60%,55%,${(n.alpha * nebulaAlphaBase * 0.6).toFixed(3)})`);
        rg.addColorStop(1, `rgba(8,12,22,0)`);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      });

      // stars twinkle
      stars.forEach(s => {
        const t = Date.now()*s.tw*speedFactor + s.x;
        const alpha = Math.max(0.15, s.alphaBase * (0.7 + twinkleAmp * Math.sin(t)));
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    function resize() {
      const now = Date.now();
      if (now - lastResize < 120) return;
      lastResize = now;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      createScene();
    }
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // initial reveal
  initReveal();
});
