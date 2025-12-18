// ================================
// WAIT FOR DOM TO LOAD
// ================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // NAVIGATION FUNCTIONALITY
    // ================================
    
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinkElements.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Add scrolled class to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ================================
    // ACTIVE NAVIGATION LINK
    // ================================
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
    
    // ================================
    // SMOOTH SCROLLING
    // ================================
    
    navLinkElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ================================
    // HERO CTA BUTTON
    // ================================
    
    const heroCTA = document.getElementById('heroCTA');
    
    if (heroCTA) {
        heroCTA.addEventListener('click', function() {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                window.scrollTo({
                    top: projectsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // ================================
    // TYPEWRITER EFFECT FOR HERO
    // ================================
    
    const heroTagline = document.getElementById('heroTagline');
    const fullText = 'Computer Science Student | Software, Logic & Innovation';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < fullText.length) {
            heroTagline.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        } else {
            // Show CTA button after typing is complete
            setTimeout(() => {
                heroCTA.classList.add('show');
            }, 300);
        }
    }
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1200);
    
    // ================================
    // INTERSECTION OBSERVER FOR FADE-IN
    // ================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    // ================================
    // PARALLAX EFFECT FOR GALAXY
    // ================================
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const stars1 = document.querySelector('.stars');
        const stars2 = document.querySelector('.stars2');
        const stars3 = document.querySelector('.stars3');
        
        if (stars1) stars1.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (stars2) stars2.style.transform = `translateY(${scrolled * 0.2}px)`;
        if (stars3) stars3.style.transform = `translateY(${scrolled * 0.1}px)`;
    });
    
    // ================================
    // CARD GLOW EFFECT
    // ================================
    
    const cards = document.querySelectorAll('.about-card, .skill-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(123, 183, 255, 0.15) 0%, transparent 50%)`;
            }
        });
    });
    
    // ================================
    // CURSOR TRAIL EFFECT (OPTIONAL)
    // ================================
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Create cursor trail elements
    const trailCount = 5;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(123, 183, 255, ${0.5 - i * 0.1}) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(trail);
        trails.push(trail);
    }
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trails.forEach((trail, index) => {
            trail.style.display = 'block';
            setTimeout(() => {
                trail.style.left = (mouseX - 4) + 'px';
                trail.style.top = (mouseY - 4) + 'px';
            }, index * 30);
        });
    });
    
    // ================================
    // SCROLL TO TOP BUTTON
    // ================================
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7bb7ff 0%, #c7b8ff 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 10px 30px rgba(123, 183, 255, 0.3);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 40px rgba(123, 183, 255, 0.5)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(123, 183, 255, 0.3)';
    });
    
    // ================================
    // PROJECT CARD TILT EFFECT
    // ================================
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // ================================
    // SKILL TAGS ANIMATION ON HOVER
    // ================================
    
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ================================
    // TECH BADGES PULSE EFFECT
    // ================================
    
    const techBadges = document.querySelectorAll('.tech-badge');
    
    techBadges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.animation = 'pulse 2s ease-in-out infinite';
        }, index * 100);
    });
    
    // Add pulse animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ================================
    // PREVENT SCROLL DURING LOADING
    // ================================
    
    window.addEventListener('load', function() {
        document.body.style.overflow = 'visible';
    });
    
    // ================================
    // PERFORMANCE OPTIMIZATION
    // ================================
    
    // Debounce scroll events
    let scrollTimeout;
    let ticking = false;
    
    function optimizedScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', optimizedScroll);
    
    // ================================
    // CONSOLE MESSAGE
    // ================================
    
    console.log('%c👋 Welcome to my portfolio!', 'color: #7bb7ff; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with passion and attention to detail', 'color: #c7b8ff; font-size: 14px;');
    console.log('%c- Kashish', 'color: #ffd6c9; font-size: 12px; font-style: italic;');
    
    // ================================
    // EASTER EGG: KONAMI CODE
    // ================================
    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #7bb7ff 0%, #c7b8ff 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInUp 0.5s ease;
            box-shadow: 0 20px 60px rgba(123, 183, 255, 0.5);
        `;
        message.textContent = '🎉 You found the easter egg! 🎉';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
    
    // ================================
    // INITIALIZE
    // ================================
    
    console.log('✅ All scripts loaded successfully');
    
});

// ================================
// ADDITIONAL ANIMATIONS
// ================================

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(fadeOutStyle);



