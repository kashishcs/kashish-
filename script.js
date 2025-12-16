// scripts/main.js

/**
 * Main application entry point
 * Initializes all systems and coordinates module interactions
 */

import { AnimationController } from './animations.js';
import { ObserverController } from './observers.js';
import { InteractionController } from './interactions.js';

class Application {
    constructor() {
        this.isInitialized = false;
        this.controllers = {
            animation: null,
            observer: null,
            interaction: null
        };
    }

    /**
     * Initialize the application
     * Sets up all controllers and starts observation
     */
    async init() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            // Wait for DOM and GSAP to be ready
            await this.waitForDependencies();
            
            // Initialize controllers in sequence
            this.controllers.animation = new AnimationController();
            this.controllers.observer = new ObserverController();
            this.controllers.interaction = new InteractionController();
            
            // Start animation system
            this.controllers.animation.init();
            
            // Start observer system
            this.controllers.observer.init();
            
            // Start interaction system
            this.controllers.interaction.init();
            
            // Setup global event listeners
            this.setupGlobalListeners();
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Application initialization failed:', error);
        }
    }

    /**
     * Wait for required dependencies to load
     */
    waitForDependencies() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    resolve();
                } else {
                    // Wait a bit more for GSAP scripts
                    setTimeout(resolve, 100);
                }
            } else {
                window.addEventListener('load', () => {
                    setTimeout(resolve, 100);
                });
            }
        });
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle scroll end
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.handleScrollEnd();
            }, 150);
        }, { passive: true });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (this.controllers.animation) {
            this.controllers.animation.handleResize();
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Handle scroll end
     */
    handleScrollEnd() {
        // Custom scroll end logic can be added here
    }

    /**
     * Pause application (e.g., when tab is hidden)
     */
    pause() {
        if (this.controllers.animation) {
            this.controllers.animation.pause();
        }
    }

    /**
     * Resume application
     */
    resume() {
        if (this.controllers.animation) {
            this.controllers.animation.resume();
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        Object.values(this.controllers).forEach(controller => {
            if (controller && typeof controller.destroy === 'function') {
                controller.destroy();
            }
        });
        
        this.isInitialized = false;
    }
}

// Create and initialize application instance
const app = new Application();

// Start application when script loads
app.init();

// Export for potential external access
window.__app = app;// scripts/animations.js

/**
 * Animation Controller
 * Manages all GSAP animations and timelines
 */

export class AnimationController {
    constructor() {
        this.timelines = new Map();
        this.isInitialized = false;
        this.isPaused = false;
    }

    /**
     * Initialize animation system
     */
    init() {
        if (this.isInitialized) return;

        // Register GSAP plugins
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        } else {
            console.error('GSAP or ScrollTrigger not loaded');
            return;
        }

        // Set GSAP defaults
        gsap.defaults({
            ease: 'power2.out',
            duration: 0.8
        });

        // Configure ScrollTrigger
        ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 150
        });

        // Initialize all animations
        this.initBackgroundAnimations();
        this.initHeroAnimations();
        this.initScrollAnimations();

        this.isInitialized = true;
    }

    /**
     * Initialize background galaxy animations
     */
    initBackgroundAnimations() {
        const tl = gsap.timeline();

        // Fade in galaxy layers with stagger
        tl.to('.galaxy-layer', {
            opacity: 1,
            duration: 2,
            stagger: 0.3,
            ease: 'power1.inOut'
        }, 0);

        // Fade in star layers
        tl.to('.stars-layer', {
            opacity: 1,
            duration: 2.5,
            stagger: 0.4,
            ease: 'power1.inOut'
        }, 0.5);

        // Fade in nebula glows
        tl.to('.nebula-glow', {
            opacity: 1,
            duration: 3,
            stagger: 0.5,
            ease: 'power1.inOut'
        }, 1);

        this.timelines.set('background', tl);
    }

    /**
     * Initialize hero section animations
     */
    initHeroAnimations() {
        const tl = gsap.timeline({
            delay: 0.5
        });

        // Animate hero label
        tl.to('.hero-label-text', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Animate hero heading
        tl.to('.hero-heading-word', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.4');

        // Animate hero subtitle
        tl.to('.hero-subtitle-text', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

        // Animate hero description
        tl.to('.hero-description-text', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');

        // Animate hero actions
        tl.to('.hero-actions', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5');

        // Animate scroll indicator
        tl.to('.hero-scroll-indicator', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.3');

        this.timelines.set('hero', tl);
    }

    /**
     * Initialize scroll-triggered animations
     */
    initScrollAnimations() {
        // Section headers
        gsap.utils.toArray('.section-label').forEach(label => {
            gsap.from(label, {
                scrollTrigger: {
                    trigger: label,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: false,
                    once: true
                },
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        gsap.utils.toArray('.section-heading').forEach(heading => {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: false,
                    once: true
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // About subsections
        gsap.utils.toArray('.about-section .subsection').forEach((subsection, index) => {
            gsap.from(subsection, {
                scrollTrigger: {
                    trigger: subsection,
                    start: 'top 75%',
                    end: 'top 45%',
                    scrub: false,
                    once: true
                },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.1
            });
        });

        // Skills intro
        gsap.from('.skills-intro', {
            scrollTrigger: {
                trigger: '.skills-intro',
                start: 'top 75%',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Skill categories
        gsap.utils.toArray('.skill-category').forEach((category, index) => {
            gsap.from(category, {
                scrollTrigger: {
                    trigger: category,
                    start: 'top 80%',
                    once: true
                },
                opacity: 0,
                y: 40,
                duration: 0.9,
                ease: 'power3.out',
                delay: index * 0.15
            });
        });

        // Projects intro
        gsap.from('.projects-intro', {
            scrollTrigger: {
                trigger: '.projects-intro',
                start: 'top 75%',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Project items
        gsap.utils.toArray('.project-item').forEach((project, index) => {
            gsap.from(project, {
                scrollTrigger: {
                    trigger: project,
                    start: 'top 75%',
                    once: true
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.1
            });
        });

        // Contact elements
        gsap.from('.contact-intro', {
            scrollTrigger: {
                trigger: '.contact-intro',
                start: 'top 75%',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('.contact-methods', {
            scrollTrigger: {
                trigger: '.contact-methods',
                start: 'top 75%',
                once: true
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out'
        });

        // Footer
        gsap.from('.footer-content', {
            scrollTrigger: {
                trigger: '.footer-content',
                start: 'top 85%',
                once: true
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Parallax effect for galaxy layers
        gsap.to('.galaxy-layer-1', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: '20%',
            ease: 'none'
        });

        gsap.to('.galaxy-layer-2', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: '30%',
            ease: 'none'
        });

        gsap.to('.galaxy-layer-3', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: '40%',
            ease: 'none'
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        ScrollTrigger.refresh();
    }

    /**
     * Pause all animations
     */
    pause() {
        if (this.isPaused) return;
        
        gsap.globalTimeline.pause();
        this.isPaused = true;
    }

    /**
     * Resume all animations
     */
    resume() {
        if (!this.isPaused) return;
        
        gsap.globalTimeline.resume();
        this.isPaused = false;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.timelines.forEach(timeline => timeline.kill());
        this.timelines.clear();
        this.isInitialized = false;
    }
}// scripts/observers.js

/**
 * Observer Controller
 * Manages Intersection Observer for scroll-based triggers
 */

export class ObserverController {
    constructor() {
        this.observers = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize all observers
     */
    init() {
        if (this.isInitialized) return;

        this.initNavigationObserver();
        this.initSectionObserver();
        
        this.isInitialized = true;
    }

    /**
     * Initialize navigation visibility observer
     */
    initNavigationObserver() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavigation = () => {
            const currentScrollY = window.scrollY;
            const nav = document.getElementById('main-navigation');
            
            if (!nav) return;

            // Add scrolled class after 100px
            if (currentScrollY > 100) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }

            // Hide/show based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                // Scrolling down
                nav.classList.add('nav-hidden');
            } else {
                // Scrolling up
                nav.classList.remove('nav-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    /**
     * Initialize section observer for navigation highlighting
     */
    initSectionObserver() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId, navLinks);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });

        this.observers.set('section', observer);
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(sectionId, navLinks) {
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('nav-link-active');
            } else {
                link.classList.remove('nav-link-active');
            }
        });
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
    }
}// scripts/interactions.js

/**
 * Interaction Controller
 * Manages user interactions and UI behavior
 */

export class InteractionController {
    constructor() {
        this.isInitialized = false;
        this.mobileMenuOpen = false;
    }

    /**
     * Initialize all interactions
     */
    init() {
        if (this.isInitialized) return;

        this.initSmoothScroll();
        this.initMobileMenu();
        this.initButtonInteractions();
        
        this.isInitialized = true;
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if href is just "#"
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (this.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }

                    // Calculate offset for fixed navigation
                    const navHeight = document.getElementById('main-navigation')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize mobile menu toggle
     */
    initMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            if (this.mobileMenuOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && 
                !toggle.contains(e.target) && 
                !menu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');

        if (!toggle || !menu) return;

        menu.classList.add('nav-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        this.mobileMenuOpen = true;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');

        if (!toggle || !menu) return;

        menu.classList.remove('nav-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        this.mobileMenuOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Initialize button interactions
     */
    initButtonInteractions() {
        // Add ripple effect to buttons on click (optional enhancement)
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        this.isInitialized = false;
    }
}
