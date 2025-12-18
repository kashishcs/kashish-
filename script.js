/* ===================================
   LIGHT GALAXY PASTEL PORTFOLIO
   Professional JavaScript Interactions
   =================================== */

// ===== MOBILE NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, i) => {
        if (navLinks.classList.contains('active')) {
            if (i === 0) span.style.transform = 'rotate(45deg) translateY(10px)';
            if (i === 1) span.style.opacity = '0';
            if (i === 2) span.style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// ===== HERO SECTION TYPEWRITER EFFECT =====
const typewriterText = "Computer Science Student | Software, Logic & Innovation";
const typewriterElement = document.querySelector('.typewriter');
let charIndex = 0;

function typeWriter() {
    if (charIndex < typewriterText.length) {
        typewriterElement.textContent += typewriterText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    } else {
        // Hide cursor after typing is complete
        setTimeout(() => {
            document.querySelector('.cursor').style.display = 'none';
        }, 2000);
    }
}

// Start typewriter effect after name animation
setTimeout(typeWriter, 1500);

// ===== SCROLL-TRIGGERED ANIMATIONS =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for multiple elements
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            
            // Special handling for tech stack icons
            if (entry.target.classList.contains('project-card')) {
                const techStack = entry.target.querySelector('.tech-stack');
                if (techStack) {
                    setTimeout(() => {
                        techStack.style.opacity = '1';
                    }, 500);
                }
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach((el, index) => {
    el.dataset.delay = index * 200;
    animateOnScroll.observe(el);
});

// Observe all slide-up elements (project cards)
document.querySelectorAll('.slide-up').forEach((el, index) => {
    el.dataset.delay = index * 200;
    animateOnScroll.observe(el);
});

// Observe about paragraphs with stagger
document.querySelectorAll('.about-paragraph').forEach((el, index) => {
    el.dataset.delay = index * 200;
    animateOnScroll.observe(el);
});

// Observe about illustration
const aboutIllustration = document.querySelector('.about-illustration');
if (aboutIllustration) {
    animateOnScroll.observe(aboutIllustration);
}

// Observe skill categories
document.querySelectorAll('.skill-category').forEach((el, index) => {
    el.dataset.delay = index * 150;
    animateOnScroll.observe(el);
});

// Observe contact elements
document.querySelectorAll('.contact-info, .footer-text').forEach((el, index) => {
    el.dataset.delay = index * 200;
    animateOnScroll.observe(el);
});

// ===== INTERACTIVE PROJECT DEMOS =====

// Demo 1: Algorithm Visual Playground - Sorting Animation
const demo1 = document.getElementById('demo1');
if (demo1) {
    const bars = demo1.querySelectorAll('.bar');
    
    setInterval(() => {
        bars.forEach(bar => {
            const randomHeight = Math.random() * 60 + 30;
            bar.style.height = randomHeight + '%';
        });
    }, 2000);
}

// Demo 2: Plagiarism Checker - Highlight Animation
const demo2 = document.getElementById('demo2');
if (demo2) {
    const highlights = demo2.querySelectorAll('.highlight');
    let highlightIndex = 0;
    
    setInterval(() => {
        highlights.forEach((h, i) => {
            if (i === highlightIndex) {
                h.style.background = 'rgba(255, 159, 128, 0.6)';
            } else {
                h.style.background = 'rgba(255, 159, 128, 0.3)';
            }
        });
        highlightIndex = (highlightIndex + 1) % highlights.length;
    }, 1500);
}

// Demo 3: Student Study Analyzer - Chart Animation
const demo3 = document.getElementById('demo3');
if (demo3) {
    const chartBars = demo3.querySelectorAll('.chart-bar');
    
    setInterval(() => {
        chartBars.forEach(bar => {
            const randomHeight = Math.random() * 50 + 40;
            bar.style.height = randomHeight + '%';
        });
    }, 2500);
}

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(108, 99, 255, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(108, 99, 255, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SKILL TAG TOOLTIP ENHANCEMENT =====
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ===== PROJECT CARD HOVER ENHANCEMENT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const demo = this.querySelector('.project-demo');
        if (demo) {
            demo.style.transform = 'scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const demo = this.querySelector('.project-demo');
        if (demo) {
            demo.style.transform = 'scale(1)';
        }
    });
});

// ===== DYNAMIC STAR GENERATION =====
function createStar() {
    const star = document.createElement('div');
    star.className = 'dynamic-star';
    star.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: ${['#6c63ff', '#33d9ff', '#ff9f80'][Math.floor(Math.random() * 3)]};
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: 0;
        animation: twinkle ${2 + Math.random() * 2}s infinite;
        pointer-events: none;
        z-index: 0;
    `;
    document.body.appendChild(star);
    
    // Remove after animation
    setTimeout(() => {
        star.remove();
    }, 5000);
}

// Generate stars periodically
setInterval(createStar, 3000);

// ===== PARALLAX EFFECT FOR HERO =====
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== CURSOR TRAIL EFFECT (SUBTLE) =====
let cursorTrail = [];
const maxTrailLength = 5;

document.addEventListener('mousemove', (e) => {
    // Only on desktop
    if (window.innerWidth > 768) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(108, 99, 255, 0.4), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            animation: trailFade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        cursorTrail.push(trail);
        
        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            oldTrail.remove();
        }
        
        setTimeout(() => {
            trail.remove();
        }, 800);
    }
});

// Add trail fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
const debouncedScroll = debounce(() => {
    // Any intensive scroll operations can go here
}, 100);

window.addEventListener('scroll', debouncedScroll);

console.log('🌌 Light Galaxy Portfolio Loaded Successfully! ✨');

