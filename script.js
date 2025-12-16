/* script.js - Galaxy theme interactions
   - Smooth scroll
   - Typewriter subtitle
   - Nebula + stars canvas with twinkle + occasional shooting star
   - Parallax hero visual
   - Load projects from projects.json
   - Reveal animations
*/

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? '' : 'flex';
    });
  }

  // Smooth scroll for internal links
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

  // Typewriter subtitle
  const typeEl = document.getElementById('typewriter');
  const phrases = [
    'Building logic, visuals, and digital stories with a cosmic touch.',
    'Algorithms, systems, and small tools that solve real problems.',
    'Learning by building — projects, code, and curiosity.'
  ];
  let tIndex = 0, charIndex = 0, deleting = false;
  function typeTick(){
    if (!typeEl) return;
    const current = phrases[tIndex];
    if (!deleting) {
      typeEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeTick, 1200);
        return;
      }
    } else {
      typeEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        tIndex = (tIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeTick, deleting ? 40 : 28);
  }
  typeTick();

  // Nebula + stars canvas
  const canvas = document.getElementById('nebula-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    const stars = [];
    const nebulas = [];
    const SHOOT_INTERVAL = 6000 + Math.random()*8000;

    function rand(min, max){ return Math.random()*(max-min)+min; }

    function createScene(){
      stars.length = 0;
      nebulas.length = 0;
      const STAR_COUNT = Math.max(80, Math.floor((w*h)/9000));
      const NEBULA_COUNT = Math.max(3, Math.floor((w*h)/200000));
      for (let i=0;i<STAR_COUNT;i++){
        stars.push({
          x: rand(0,w),
          y: rand(0,h),
          r: rand(0.4,1.8),
          tw: rand(0.02,0.12),
          hue: rand(200,320),
          alpha: rand(0.4,1)
        });
      }
      for (let i=0;i<NEBULA_COUNT;i++){
        nebulas.push({
          x: rand(-w*0.2,w*1.2),
          y: rand(-h*0.2,h*1.2),
          r: rand(Math.min(w,h)*0.25, Math.min(w,h)*0.6),
          hue: rand(250,320),
          alpha: rand(0.06,0.18),
          vx: rand(-0.02,0.02),
          vy: rand(-0.01,0.01)
        });
      }
    }

    function draw(){
      ctx.clearRect(0,0,w,h);

      // subtle dark gradient base
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, 'rgba(5,8,18,1)');
      g.addColorStop(1, 'rgba(8,12,22,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

      // draw nebulas (soft blobs)
      nebulas.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        const rg = ctx.createRadialGradient(n.x, n.y, n.r*0.1, n.x, n.y, n.r);
        rg.addColorStop(0, `hsla(${n.hue},70%,70%,${n.alpha})`);
        rg.addColorStop(0.4, `hsla(${n.hue},60%,55%,${n.alpha*0.6})`);
        rg.addColorStop(1, `rgba(8,12,22,0)`);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      });

      // draw stars with twinkle
      stars.forEach(s => {
        s.alpha = 0.6 + Math.sin(Date.now()*s.tw + s.x)*0.4;
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    // shooting star effect occasionally
    function shootStar(){
      const sx = rand(0,w*0.6);
      const sy = rand(0,h*0.4);
      const len = rand(120,260);
      const angle = rand(0.2,0.6);
      const vx = Math.cos(angle)*6;
      const vy = Math.sin(angle)*6;
      let x = sx, y = sy;
      const trail = [];
      const frames = 40;
      let frame = 0;
      function step(){
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i=0;i<trail.length;i++){
          const t = trail[i];
          ctx.strokeStyle = `rgba(255,255,255,${0.12*(i/trail.length)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t.x, t.y);
          ctx.lineTo(t.x - vx*2, t.y - vy*2);
          ctx.stroke();
        }
        ctx.restore();
        x += vx; y += vy;
        trail.unshift({x,y});
        if (trail.length>20) trail.pop();
        frame++;
        if (frame < frames) requestAnimationFrame(step);
      }
      step();
    }

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      createScene();
    }
    window.addEventListener('resize', () => { resize(); });
    resize();
    draw();
    // random shooting stars
    setInterval(() => { if (Math.random() < 0.6) shootStar(); }, SHOOT_INTERVAL);

  }

  // Parallax for hero visual
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  const heroText = document.querySelector('.hero-text');
  if (hero && heroVisual && heroText){
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tx = (x - 0.5) * 18;
      const ty = (y - 0.5) * 18;
      heroVisual.style.transform = `translate(${tx}px, ${ty}px) rotate(${tx/8}deg)`;
      heroText.style.transform = `translate(${tx/12}px, ${ty/12}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'translate(0,0) rotate(0deg)';
      heroText.style.transform = 'translate(0,0)';
    });
  }

  // Load projects from JSON and render
  fetch('projects.json')
    .then(res => res.json())
    .then(data => renderProjects(data.projects))
    .catch(() => {
      const fallback = [
        {
          "title":"Algorithm Visual Playground",
          "desc":"A visual tool that demonstrates how core algorithms work through step‑by‑step animations. Includes sorting, recursion, BFS/DFS, and pathfinding. Focuses on clarity and algorithmic thinking.",
          "tech":"Python / JavaScript; Algorithms; Data Structures; Git; VS Code",
          "github":"",
          "demo":""
        },
        {
          "title":"Plagiarism Checker",
          "desc":"A text‑comparison system that detects similarity between documents using Jaccard, Cosine Similarity, and sequence matching. Preprocesses text and calculates similarity scores.",
          "tech":"Python; difflib; SQL (optional); Git; VS Code",
          "github":"",
          "demo":""
        },
        {
          "title":"Quiz App",
          "desc":"A multiple‑choice quiz application with scoring, results, and a question bank. Demonstrates OOP concepts and structured programming.",
          "tech":"Python / Java; OOP; Git; VS Code",
          "github":"",
          "demo":""
        },
        {
          "title":"Student Study Analyzer",
          "desc":"An analytics tool that tracks study sessions and identifies productivity patterns (hours, consistency, subject focus) to provide actionable insights.",
          "tech":"Python; CSV/JSON; Git; VS Code",
          "github":"",
          "demo":""
        }
      ];
      renderProjects(fallback);
    });

  function renderProjects(list){
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-content">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="project-desc">${escapeHtml(p.desc)}</p>
          <p class="project-tech"><strong>Tech Used:</strong> ${escapeHtml(p.tech)}</p>
          <div class="project-links">
            <a class="btn-small" href="${p.github || '#'}" ${p.github ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.github ? 'GitHub' : 'GitHub (to be added)'}</a>
            <a class="btn-small ghost" href="${p.demo || '#'}" ${p.demo ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}>${p.demo ? 'Live Demo' : 'Live Demo (to be added)'}</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    initReveal();
    document.querySelector('.hero-text')?.classList.add('visible');
    document.querySelector('.hero-visual')?.classList.add('visible');
  }

  // Simple HTML escape
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // Reveal on scroll
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

  initReveal();
});
