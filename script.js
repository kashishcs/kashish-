// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KASHISH - COMPUTER SCIENCE PORTFOLIO
// Advanced JavaScript with GSAP Animations & Interactive Effects
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    particles: {
        count: 80,
        maxSpeed: 0.5,
        minSpeed: 0.1,
        maxSize: 3,
        minSize: 1,
        connectionDistance: 150,
        mouseInfluence: 100
    },
    cursor: {
        dotLag: 0.15,
        outlineLag: 0.3,
        magneticStrength: 0.3,
        magneticLightStrength: 0.15
    },
    scroll: {
        hideNavThreshold: 100,
        smoothScrollDuration: 1.2
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GSAP SETUP & REGISTRATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure GSAP defaults for smooth animations
gsap.defaults({
    ease: 'power3.out',
    duration: 0.8
});

// Configure ScrollTrigger for optimized performance
ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 150
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOM CURSOR SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class CustomCursor {
    constructor() {
        this.dot = document.querySelector('[data-cursor-dot]');
        this.outline = document.querySelector('[data-cursor-outline]');
        
        if (!this.dot || !this.outline) return;
        
        this.mouse = { x: 0, y: 0 };
        this.dotPos = { x: 0, y: 0 };
        this.outlinePos = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.dot.classList.add('hidden');
            this.outline.classList.add('hidden');
        });
        
        document.addEventListener('mouseenter', () => {
            this.dot.classList.remove('hidden');
            this.outline.classList.remove('hidden');
        });
        
        // Handle hover states
        this.setupHoverStates();
        
        // Start animation loop
        this.animate();
    }
    
    setupHoverStates() {
        const hoverElements = document.querySelectorAll('a, button, [data-magnetic], [data-magnetic-light]');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.outline.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.outline.classList.remove('hover');
            });
            
            el.addEventListener('mousedown', () => {
                this.dot.classList.add('active');
                this.outline.classList.add('active');
            });
            
            el.addEventListener('mouseup', () => {
                this.dot.classList.remove('active');
                this.outline.classList.remove('active');
            });
        });
    }
    
    animate() {
        // Smooth lag effect using lerp (linear interpolation)
        this.dotPos.x += (this.mouse.x - this.dotPos.x) * CONFIG.cursor.dotLag;
        this.dotPos.y += (this.mouse.y - this.dotPos.y) * CONFIG.cursor.dotLag;
        
        this.outlinePos.x += (this.mouse.x - this.outlinePos.x) * CONFIG.cursor.outlineLag;
        this.outlinePos.y += (this.mouse.y - this.outlinePos.y) * CONFIG.cursor.outlineLag;
        
        // Apply transforms
        this.dot.style.transform = `translate(${this.dotPos.x - 4}px, ${this.dotPos.y - 4}px)`;
        this.outline.style.transform = `translate(${this.outlinePos.x - 16}px, ${this.outlinePos.y - 16}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAGNETIC BUTTON EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class MagneticEffect {
    constructor() {
        this.magneticElements = document.querySelectorAll('[data-magnetic]');
        this.lightMagneticElements = document.querySelectorAll('[data-magnetic-light]');
        this.init();
    }
    
    init() {
        this.magneticElements.forEach(el => this.applyMagneticEffect(el, CONFIG.cursor.magneticStrength));
        this.lightMagneticElements.forEach(el => this.applyMagneticEffect(el, CONFIG.cursor.magneticLightStrength));
    }
    
    applyMagneticEffect(element, strength) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(element, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLE SYSTEM (CANVAS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    createParticles() {
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particles.maxSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particles.maxSpeed,
                size: Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < CONFIG.particles.mouseInfluence) {
                    const force = (CONFIG.particles.mouseInfluence - distance) / CONFIG.particles.mouseInfluence;
                    particle.vx -= (dx / distance) * force * 0.2;
                    particle.vy -= (dy / distance) * force * 0.2;
                }
            }
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Speed limit
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > CONFIG.particles.maxSpeed) {
                particle.vx = (particle.vx / speed) * CONFIG.particles.maxSpeed;
                particle.vy = (particle.vy / speed) * CONFIG.particles.maxSpeed;
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(74, 124, 199, 0.6)';
            this.ctx.fill();
            
            // Add glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, 'rgba(74, 124, 199, 0.3)');
            gradient.addColorStop(1, 'rgba(74, 124, 199, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < CONFIG.particles.connectionDistance) {
                    const opacity = (1 - distance / CONFIG.particles.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(74, 124, 199, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE LOADER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');
        if (!this.loader) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
                
                // Trigger hero animations after loader
                this.triggerHeroAnimations();
            }, 1000);
        });
    }
    
    triggerHeroAnimations() {
        // Hero animations are handled by CSS, but we can add GSAP enhancements
        const heroTimeline = gsap.timeline();
        
        heroTimeline
            .from('.hero-badge', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'expo.out'
            })
            .from('.hero-stats .stat-item', {
                opacity: 0,
                y: 20,
                stagger: 0.15,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, '-=0.5');
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVIGATION SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.progressBar = document.querySelector('.nav-progress-bar');
        
        this.lastScrollTop = 0;
        this.scrollThreshold = CONFIG.scroll.hideNavThreshold;
        
        this.init();
    }
    
    init() {
        this.setupScrollBehavior();
        this.setupActiveSection();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupProgressBar();
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > this.scrollThreshold) {
            if (scrollTop > this.lastScrollTop) {
                this.navbar.classList.add('hidden');
            } else {
                this.navbar.classList.remove('hidden');
            }
        }
        
        this.lastScrollTop = scrollTop;
    }
    
    setupActiveSection() {
        const sections = document.querySelectorAll('.section, .hero');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveLink(id);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setActiveLink(id) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupMobileMenu() {
        if (!this.menuToggle || !this.navMenu) return;
        
        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    gsap.to(window, {
                        duration: CONFIG.scroll.smoothScrollDuration,
                        scrollTo: {
                            y: target,
                            offsetY: 100
                        },
                        ease: 'expo.inOut'
                    });
                }
            });
        });
    }
    
    setupProgressBar() {
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            this.progressBar.style.width = `${scrolled}%`;
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED COUNTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class AnimatedCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }
    
    init() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => this.animateCounter(counter, target),
                once: true
            });
        });
    }
    
    animateCounter(element, target) {
        gsap.to(element, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            onUpdate: function() {
                element.innerHTML = Math.ceil(element.innerHTML);
            }
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL-TRIGGERED ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.animateSectionHeaders();
        this.animateAboutSection();
        this.animateSkillsSection();
        this.animateProjectsSection();
        this.animateContactSection();
        this.animateFooter();
        this.setupParallax();
    }
    
    animateSectionHeaders() {
        document.querySelectorAll('.section-header').forEach(header => {
            const number = header.querySelector('.section-number');
            const words = header.querySelectorAll('.title-word');
            const line = header.querySelector('.section-line');
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none none'
                }
            });
            
            tl.from(number, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                ease: 'expo.out'
            })
            .from(words, {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 0.8,
                ease: 'expo.out'
            }, '-=0.4')
            .from(line, {
                opacity: 0,
                scaleX: 0,
                duration: 0.8,
                ease: 'expo.out'
            }, '-=0.6');
        });
    }
    
    animateAboutSection() {
        // Animate paragraph lines
        document.querySelectorAll('.paragraph-line').forEach((line, index) => {
            gsap.from(line, {
                opacity: 0,
                y: '100%',
                duration: 0.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
        
        // Animate value items
        gsap.from('.value-item', {
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.values-grid',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate code window
        gsap.from('.visual-card', {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.visual-card',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    animateSkillsSection() {
        // Animate skill categories
        gsap.from('.skill-category', {
            opacity: 0,
            y: 60,
            stagger: 0.12,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animate skill list items with stagger
        document.querySelectorAll('.skill-category').forEach(category => {
            gsap.from(category.querySelectorAll('.skill-item'), {
                opacity: 0,
                x: -20,
                stagger: 0.08,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: category,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });
        });
        
        // Animate orbital visualization
        gsap.from('.orbit-ring', {
            opacity: 0,
            scale: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
                trigger: '.visual-orbit',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.orbit-node', {
            opacity: 0,
            scale: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: '.visual-orbit',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    animateProjectsSection() {
        // Animate project cards
        gsap.from('.project-card', {
            opacity: 0,
            y: 80,
            stagger: 0.2,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Advanced hover animation for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                gsap.to(this.querySelector('.project-visual-bg'), {
                    scale: 1.15,
                    rotate: 3,
                    duration: 0.6,
                    ease: 'expo.out'
                });
                
                gsap.to(this.querySelectorAll('.tech-tag'), {
                    y: -3,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: 'back.out(2)'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(this.querySelector('.project-visual-bg'), {
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'expo.out'
                });
                
                gsap.to(this.querySelectorAll('.tech-tag'), {
                    y: 0,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: 'back.out(2)'
                });
            });
        });
    }
    
    animateContactSection() {
        gsap.from('.contact-description', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact-description',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.contact-method', {
            opacity: 0,
            x: -50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.contact-methods',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    animateFooter() {
        gsap.from('.footer-brand', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.footer-column', {
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.footer-links',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.footer-bottom', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: '.footer-bottom',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    }
    
    setupParallax() {
        // Parallax effect for floating elements
        document.querySelectorAll('[data-parallax-speed]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed'));
            
            gsap.to(el, {
                y: () => window.innerHeight * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
        
        // Parallax for hero background layers
        gsap.to('.hero-bg-layer.layer-1', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 2
            }
        });
        
        gsap.to('.hero-bg-layer.layer-2', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D TILT EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TiltEffect {
    constructor() {
        this.tiltElements = document.querySelectorAll('[data-tilt]');
        this.strongTiltElements = document.querySelectorAll('[data-tilt-strong]');
        this.init();
    }
    
    init() {
        this.tiltElements.forEach(el => this.applyTilt(el, 10));
        this.strongTiltElements.forEach(el => this.applyTilt(el, 20));
    }
    
    applyTilt(element, maxTilt) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * maxTilt;
            const rotateY = ((centerX - x) / centerX) * maxTilt;
            
            gsap.to(element, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    new CustomCursor();
    new MagneticEffect();
    new ParticleSystem();
    new PageLoader();
    new Navigation();
    new AnimatedCounter();
    new ScrollAnimations();
    new TiltEffect();
    
    // Refresh ScrollTrigger after all elements are loaded
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFORMANCE MONITORING (DEV MODE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (process.env.NODE_ENV === 'development') {
    let fps = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        const currentTime = performance.now();
        fps = Math.round(1000 / (currentTime - lastTime));
        lastTime = currentTime;
        
        if (fps < 30) {
            console.warn(`Low FPS detected: ${fps}`);
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
}
