/* script.js — Galaxy portal interactions
   - Renders projects grid
   - Opens a full-screen portal overlay for each project (same-page)
   - Portal includes media preview (gif/video) or fallback
   - Strong hero name animation triggers and subtle parallax
   - Galaxy canvas with nebula blobs and twinkling stars (optimized)
   - Accessible focus trap for portal
   - All original content preserved
*/

/* -------------------------
   Utility helpers
   ------------------------- */
function $(sel, ctx=document) { return ctx.querySelector(sel); }
function $all(sel, ctx=document) { return Array.from(ctx.querySelectorAll(sel)); }
function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* -------------------------
   DOM references
   ------------------------- */
const projectsGrid = $('#projects-grid');
const portalOverlay = $('#portal-overlay');
const portalBackdrop = $('#portal-backdrop');
const portalFrame = $('.portal-frame');
const portalClose = $('#portal-close');
const portalTitle = $('#portal-title');
const portalSub = $('#portal-sub');
const portalDesc = $('#portal-desc');
const portalTech = $('#portal-tech');
const portalLinks = $('#portal-links');
const portalLogic = $('#portal-logic');
const portalMedia = $('#portal-media');
const portalGithub = $('#portal-github');
const portalDemo = $('#portal-demo');

/* -------------------------
   Project data loader
   ------------------------- */
async function loadProjects() {
  try {
    const res = await fetch('projects.json', {cache: "no-store"});
    if (!res.ok) throw new Error('no json');
    const data = await res.json();
    return data.projects || [];
  } catch (e) {
    // fallback (keeps content intact)
    return [
      {
        id: "algorithm-visual-playground",
        title: "Algorithm Visual Playground",
        desc: "A visual tool that demonstrates how core algorithms work through step‑by‑step animations. Includes sorting, recursion, BFS/DFS, and pathfinding. Focuses on clarity and algorithmic thinking.",
        tech: "Python / JavaScript; Algorithms; Data Structures; Git; VS Code",
        github: "",
        demo: "",
        demo_gif: "",
        demo_video: ""
      },
      {
        id: "plagiarism-checker",
        title: "Plagiarism Checker",
        desc: "A text‑comparison system that detects similarity between documents using Jaccard, Cosine Similarity, and sequence matching. Preprocesses text and calculates similarity scores.",
        tech: "Python; difflib; SQL (optional); Git; VS Code",
        github: "",
        demo: "",
        demo_gif: "",
        demo_video: ""
      },
      {
        id: "quiz-app",
        title: "Quiz App",
        desc: "A multiple‑choice quiz application with scoring, results, and a question bank. Demonstrates OOP concepts and structured programming.",
        tech: "Python / Java; OOP; Git; VS Code",
        github: "",
        demo: "",
        demo_gif: "",
        demo_video: ""
      },
      {
        id: "student-study-analyzer",
        title: "Student Study Analyzer",
        desc: "An analytics tool that tracks study sessions and identifies productivity patterns (hours, consistency, subject focus).",
        tech: "Python; CSV/JSON; Git; VS Code",
        github: "",
        demo: "",
        demo_gif: "",
        demo_video: ""
      }
    ];
  }
}

/* -------------------------
   Render projects grid (massive, strict layout)
   ------------------------- */
function renderProjects(list) {
  projectsGrid.innerHTML = '';
  // ensure a fuller grid: repeat items to reach at least 9 cards
  const target = Math.max(9, list.length);
  for (let i = 0; i < target; i++) {
    const p = list[i % list.length];
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-content">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
        <p class="project-tech"><strong>Tech Used:</strong> ${escapeHtml(p.tech)}</p>
        <div class="project-links">
          <button class="btn-small open-portal" 
            data-id="${escapeHtml(p.id)}"
            data-title="${escapeHtml(p.title)}"
            data-desc="${escapeHtml(p.desc)}"
            data-tech="${escapeHtml(p.tech)}"
            data-github="${escapeHtml(p.github || '')}"
            data-demo="${escapeHtml(p.demo || '')}"
            data-demo_gif="${escapeHtml(p.demo_gif || '')}"
            data-demo_video="${escapeHtml(p.demo_video || '')}"
          >Open Portal</button>
          <a class="btn-small" href="${p.github || '#'}" ${p.github ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.github ? 'GitHub' : 'GitHub (to be added)'}</a>
          <a class="btn-small ghost" href="${p.demo || '#'}" ${p.demo ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.demo ? 'Live Demo' : 'Live Demo (to be added)'}</a>
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  }

  // attach handlers
  $all('.open-portal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget;
      const meta = {
        id: el.dataset.id,
        title: el.dataset.title,
        desc: el.dataset.desc,
        tech: el.dataset.tech,
        github: el.dataset.github,
        demo: el.dataset.demo,
        demo_gif: el.dataset.demo_gif,
        demo_video: el.dataset.demo_video
      };
      openPortal(meta);
    });
  });
}

/* -------------------------
   Portal open/close & focus trap
   ------------------------- */
let lastFocused = null;
let removeTrap = null;

function trapFocus(container) {
  const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function handler(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    } else if (e.key === 'Escape') {
      closePortal();
    }
  }
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}

function openPortal(meta) {
  // populate portal
  portalTitle.textContent = meta.title;
  portalSub.textContent = meta.id.replace(/-/g,' ');
  portalDesc.textContent = meta.desc;
  portalTech.textContent = meta.tech;
  portalLinks.innerHTML = '';
  portalGithub.href = meta.github || '#';
  portalDemo.href = meta.demo || '#';
  portalGithub.setAttribute('aria-disabled', meta.github ? 'false' : 'true');
  portalDemo.setAttribute('aria-disabled', meta.demo ? 'false' : 'true');

  // set logic placeholder
  portalLogic.textContent = 'Explain the problem solved, approach, and core logic here.';

  // set media
  setPortalMedia(meta);

  // show portal
  portalOverlay.setAttribute('aria-hidden','false');
  document.querySelectorAll('main, header, footer').forEach(el => el.setAttribute('aria-hidden','true'));
  lastFocused = document.activeElement;
  portalClose.focus();
  removeTrap = trapFocus(portalFrame);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closePortal() {
  // cleanup media
  const vid = portalMedia.querySelector('video');
  if (vid) { try { vid.pause(); vid.currentTime = 0; } catch(e){} vid.remove(); }
  const img = portalMedia.querySelector('img');
  if (img) img.remove();
  $all('.media-play, .media-controls').forEach(n => n.remove());
  portalMedia.querySelector('.portal-media-fallback').style.display = 'flex';

  portalOverlay.setAttribute('aria-hidden','true');
  document.querySelectorAll('main, header, footer').forEach(el => el.removeAttribute('aria-hidden'));
  if (removeTrap) removeTrap();
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

/* -------------------------
   Portal media handling (gif/video/fallback)
   ------------------------- */
function setPortalMedia(meta) {
  const fallback = portalMedia.querySelector('.portal-media-fallback');
  // clear previous
  $all('#portal-media img, #portal-media video, #portal-media .media-play, #portal-media .media-controls').forEach(n => n.remove());
  fallback.style.display = 'none';

  const gif = meta.demo_gif || '';
  const video = meta.demo_video || '';

  if (video) {
    const vid = document.createElement('video');
    vid.className = 'portal-video';
    vid.src = video;
    vid.preload = 'metadata';
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.controls = false;
    portalMedia.appendChild(vid);

    const play = document.createElement('button');
    play.className = 'media-play';
    play.innerHTML = '▶';
    portalMedia.appendChild(play);

    const controls = document.createElement('div');
    controls.className = 'media-controls';
    const playToggle = document.createElement('button');
    playToggle.className = 'btn-small';
    playToggle.textContent = 'Play';
    controls.appendChild(playToggle);
    portalMedia.appendChild(controls);

    play.addEventListener('click', () => {
      if (vid.paused) { vid.play().catch(()=>{}); playToggle.textContent = 'Pause'; play.style.opacity = '0.6'; }
      else { vid.pause(); playToggle.textContent = 'Play'; play.style.opacity = '1'; }
    });
    playToggle.addEventListener('click', () => {
      if (vid.paused) { vid.play().catch(()=>{}); playToggle.textContent = 'Pause'; play.style.opacity = '0.6'; }
      else { vid.pause(); playToggle.textContent = 'Play'; play.style.opacity = '1'; }
    });
    vid.addEventListener('click', () => {
      if (vid.paused) { vid.play().catch(()=>{}); playToggle.textContent = 'Pause'; play.style.opacity = '0.6'; }
      else { vid.pause(); playToggle.textContent = 'Play'; play.style.opacity = '1'; }
    });

  } else if (gif) {
    const img = document.createElement('img');
    img.className = 'portal-gif';
    img.alt = meta.title + ' preview';
    img.loading = 'lazy';
    img.src = gif;
    portalMedia.appendChild(img);
  } else {
    fallback.style.display = 'flex';
  }
}

/* -------------------------
   Event bindings
   ------------------------- */
document.addEventListener('click', (e) => {
  if (e.target === portalBackdrop) closePortal();
});
portalClose.addEventListener('click', closePortal);

/* -------------------------
   Reveal on scroll
   ------------------------- */
function initReveal(){
  const items = document.querySelectorAll('.skill-card, .project-card, .contact-card, .about-text, .about-card, .hero-left');
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

/* -------------------------
   Galaxy canvas (nebula + stars)
   ------------------------- */
function initGalaxyCanvas() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;

  let stars = [];
  let nebulas = [];
  let lastResize = 0;

  function rand(min,max){ return Math.random()*(max-min)+min; }

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

  function draw(){
    ctx.clearRect(0,0,w,h);

    // base gradient
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(6,10,20,1)');
    g.addColorStop(1, 'rgba(8,12,22,1)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // nebulas
    nebulas.forEach(n => {
      n.x += n.vx * 0.6;
      n.y += n.vy * 0.6;
      const rg = ctx.createRadialGradient(n.x, n.y, n.r*0.1, n.x, n.y, n.r);
      rg.addColorStop(0, `hsla(${n.hue},70%,70%,${(n.alpha).toFixed(3)})`);
      rg.addColorStop(0.4, `hsla(${n.hue},60%,55%,${(n.alpha*0.6).toFixed(3)})`);
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
      const t = Date.now()*s.tw + s.x;
      const alpha = Math.max(0.15, s.alphaBase * (0.7 + 0.2*Math.sin(t)));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  function resize(){
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

/* -------------------------
   Hero subtle parallax
   ------------------------- */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const heroName = $('#hero-name');
  const heroRight = document.querySelector('.hero-right');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tx = (x - 0.5) * 18;
    const ty = (y - 0.5) * 12;
    heroName.style.transform = `translate(${tx/8}px, ${ty/8}px)`;
    if (heroRight) heroRight.style.transform = `translate(${tx/6}px, ${ty/6}px) rotate(${tx/40}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroName.style.transform = '';
    if (heroRight) heroRight.style.transform = '';
  });
}

/* -------------------------
   Init sequence
   ------------------------- */
async function init() {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // load and render projects
  const projects = await loadProjects();
  renderProjects(projects);

  // init reveals
  initReveal();

  // init galaxy canvas
  initGalaxyCanvas();

  // hero parallax
  initHeroParallax();

  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? '' : 'flex';
    });
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 900 && navList) navList.style.display = '';
      }
    });
  });
}

/* -------------------------
   Start
   ------------------------- */
document.addEventListener('DOMContentLoaded', init);
