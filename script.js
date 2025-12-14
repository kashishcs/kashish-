/**
 * ============================================
 * KASHISH PORTFOLIO - MAIN JAVASCRIPT
 * ============================================
 * 
 * A comprehensive, production-ready JavaScript application
 * for an advanced portfolio website.
 * 
 * @author Kashish
 * @version 2.0.0
 * @license MIT
 * 
 * Features:
 * - Advanced cursor system with trails
 * - Multi-layer canvas animations
 * - Smooth scroll and reveal animations
 * - Interactive navigation with progress tracking
 * - Form validation and submission
 * - Modal and notification systems
 * - Theme switching (light/dark mode)
 * - Performance monitoring and optimization
 * - Accessibility features (WCAG 2.1 AA compliant)
 * - Responsive behavior handlers
 * - Local storage management
 * - Advanced particle systems
 * - Intersection Observer implementations
 * - Custom event system
 * - Error boundary and logging
 * - Memory leak prevention
 * 
 * ============================================
 */

(function(window, document, undefined) {
    'use strict';

    /* ============================================
       CONSTANTS AND CONFIGURATION
       ============================================ */

    const CONFIG = {
        // General Settings
        APP_NAME: 'Kashish Portfolio',
        VERSION: '2.0.0',
        DEBUG_MODE: true,
        
        // Performance Settings
        LOADING_DURATION: 2500,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 150,
        THROTTLE_DELAY: 100,
        RAF_THROTTLE: 16.67, // ~60fps
        
        // Scroll Settings
        SCROLL_THRESHOLD: 100,
        SCROLL_OFFSET: 80,
        SMOOTH_SCROLL_DURATION: 800,
        REVEAL_THRESHOLD: 0.15,
        REVEAL_MARGIN: '-100px',
        
        // Cursor Settings
        CURSOR_TRAIL_LIMIT: 20,
        CURSOR_TRAIL_DECAY: 800,
        CURSOR_SMOOTH_FACTOR: 0.15,
        CURSOR_DOT_SMOOTH: 0.7,
        
        // Canvas Settings
        PARTICLE_COUNT: 50,
        PARTICLE_CONNECTION_DISTANCE: 150,
        PARTICLE_MAX_SPEED: 0.5,
        WAVE_AMPLITUDE: 30,
        WAVE_FREQUENCY: 0.01,
        WAVE_SPEED: 0.01,
        CANVAS_RESIZE_DEBOUNCE: 200,
        
        // Form Settings
        FORM_SUBMIT_DELAY: 2000,
        VALIDATION_DEBOUNCE: 300,
        
        // Notification Settings
        NOTIFICATION_DURATION: 5000,
        NOTIFICATION_SLIDE_DURATION: 300,
        MAX_NOTIFICATIONS: 5,
        
        // Modal Settings
        MODAL_ANIMATION_DURATION: 300,
        MODAL_BACKDROP_OPACITY: 0.8,
        
        // Theme Settings
        THEME_TRANSITION_DURATION: 300,
        DEFAULT_THEME: 'light',
        
        // Stats Counter Settings
        COUNTER_DURATION: 2000,
        COUNTER_EASING: 'easeOutQuad',
        
        // Breakpoints
        BREAKPOINTS: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        },
        
        // Z-Index Scale
        Z_INDEX: {
            base: 1,
            dropdown: 100,
            sticky: 200,
            fixed: 300,
            modalBackdrop: 400,
            modal: 500,
            popover: 600,
            tooltip: 700,
            notification: 800,
            cursor: 9999,
            max: 10000
        },
        
        // Easing Functions
        EASING: {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
            easeInElastic: t => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
            easeOutElastic: t => 0.04 * t / (--t) * Math.sin(25 * t),
            easeInOutElastic: t => (t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
            easeInBounce: t => 1 - CONFIG.EASING.easeOutBounce(1 - t),
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) return n1 * t * t;
                if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
                if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        },
        
        // Colors
        COLORS: {
            primary: '#a89cc0',
            primaryDark: '#8b7fa8',
            primaryLight: '#c9b6e6',
            secondary: '#9aa3d6',
            accent: '#7f6fa8',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        },
        
        // Local Storage Keys
        STORAGE_KEYS: {
            theme: 'portfolio_theme',
            visitCount: 'portfolio_visit_count',
            preferences: 'portfolio_preferences',
            formData: 'portfolio_form_data'
        }
    };

    /* ============================================
       STATE MANAGEMENT
       ============================================ */

    const STATE = {
        // Application State
        isInitialized: false,
        isLoading: true,
        isDarkMode: false,
        isMenuOpen: false,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        
        // Scroll State
        lastScrollY: 0,
        scrollDirection: 'down',
        scrollSpeed: 0,
        isScrolling: false,
        
        // Cursor State
        cursor: {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            isHovering: false,
            isClicking: false
        },
        
        // Cursor Trails
        cursorTrails: [],
        
        // Canvas State
        canvasContexts: {
            particles: null,
            waves: null,
            nebula: null
        },
        
        // Animation Frames
        animationFrames: {
            cursor: null,
            particles: null,
            waves: null,
            nebula: null,
            scroll: null
        },
        
        // Observers
        observers: {
            intersection: [],
            mutation: [],
            resize: null,
            performance: null
        },
        
        // Particles
        particles: [],
        floatingParticles: [],
        
        // Form State
        form: {
            isSubmitting: false,
            isValid: false,
            errors: {},
            data: {}
        },
        
        // Modal State
        modals: {
            active: null,
            stack: []
        },
        
        // Notification State
        notifications: [],
        
        // Performance Metrics
        performance: {
            fps: 0,
            frameCount: 0,
            lastFrameTime: 0,
            loadTime: 0,
            interactionTime: 0
        },
        
        // Event Listeners
        eventListeners: [],
        
        // Timers
        timers: {
            debounce: {},
            throttle: {},
            animation: {}
        },
        
        // Feature Detection
        features: {
            intersectionObserver: false,
            mutationObserver: false,
            resizeObserver: false,
            localStorage: false,
            canvas: false,
            webGL: false,
            touch: false,
            pointer: false
        }
    };

    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */

    const Utils = {
        /**
         * Logging utility with levels
         */
        log: {
            info: (...args) => {
                if (CONFIG.DEBUG_MODE) {
                    console.log('%c[INFO]', 'color: #3b82f6; font-weight: bold;', ...args);
                }
            },
            
            warn: (...args) => {
                if (CONFIG.DEBUG_MODE) {
                    console.warn('%c[WARN]', 'color: #f59e0b; font-weight: bold;', ...args);
                }
            },
            
            error: (...args) => {
                if (CONFIG.DEBUG_MODE) {
                    console.error('%c[ERROR]', 'color: #ef4444; font-weight: bold;', ...args);
                }
            },
            
            success: (...args) => {
                if (CONFIG.DEBUG_MODE) {
                    console.log('%c[SUCCESS]', 'color: #10b981; font-weight: bold;', ...args);
                }
            },
            
            debug: (...args) => {
                if (CONFIG.DEBUG_MODE) {
                    console.debug('%c[DEBUG]', 'color: #a89cc0; font-weight: bold;', ...args);
                }
            }
        },

        /**
         * Debounce function - delays execution until after delay has elapsed
         * @param {Function} func - Function to debounce
         * @param {Number} wait - Delay in milliseconds
         * @param {Boolean} immediate - Execute immediately
         * @return {Function} Debounced function
         */
        debounce(func, wait = CONFIG.DEBOUNCE_DELAY, immediate = false) {
            let timeout;
            
            return function executedFunction(...args) {
                const context = this;
                
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                
                const callNow = immediate && !timeout;
                
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                
                if (callNow) func.apply(context, args);
            };
        },

        /**
         * Throttle function - limits execution to once per interval
         * @param {Function} func - Function to throttle
         * @param {Number} limit - Time limit in milliseconds
         * @return {Function} Throttled function
         */
        throttle(func, limit = CONFIG.THROTTLE_DELAY) {
            let inThrottle;
            let lastResult;
            
            return function(...args) {
                if (!inThrottle) {
                    lastResult = func.apply(this, args);
                    inThrottle = true;
                    
                    setTimeout(() => {
                        inThrottle = false;
                    }, limit);
                }
                
                return lastResult;
            };
        },

        /**
         * RequestAnimationFrame throttle
         * @param {Function} func - Function to throttle
         * @return {Function} Throttled function
         */
        rafThrottle(func) {
            let rafId = null;
            
            return function(...args) {
                if (rafId === null) {
                    rafId = requestAnimationFrame(() => {
                        func.apply(this, args);
                        rafId = null;
                    });
                }
            };
        },

        /**
         * Get element safely
         * @param {String} selector - CSS selector
         * @param {Element} context - Context element
         * @return {Element|null} Found element or null
         */
        $(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (e) {
                Utils.log.error('Invalid selector:', selector, e);
                return null;
            }
        },

        /**
         * Get multiple elements safely
         * @param {String} selector - CSS selector
         * @param {Element} context - Context element
         * @return {Array} Array of elements
         */
        $$(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (e) {
                Utils.log.error('Invalid selector:', selector, e);
                return [];
            }
        },

        /**
         * Add class to element
         * @param {Element} element - Target element
         * @param {String|Array} className - Class name(s) to add
         */
        addClass(element, className) {
            if (!element) return;
            
            if (Array.isArray(className)) {
                element.classList.add(...className);
            } else {
                element.classList.add(className);
            }
        },

        /**
         * Remove class from element
         * @param {Element} element - Target element
         * @param {String|Array} className - Class name(s) to remove
         */
        removeClass(element, className) {
            if (!element) return;
            
            if (Array.isArray(className)) {
                element.classList.remove(...className);
            } else {
                element.classList.remove(className);
            }
        },

        /**
         * Toggle class on element
         * @param {Element} element - Target element
         * @param {String} className - Class name to toggle
         * @param {Boolean} force - Force add or remove
         * @return {Boolean} Whether class is present after toggle
         */
        toggleClass(element, className, force) {
            if (!element) return false;
            return element.classList.toggle(className, force);
        },

        /**
         * Check if element has class
         * @param {Element} element - Target element
         * @param {String} className - Class name to check
         * @return {Boolean} Whether element has class
         */
        hasClass(element, className) {
            return element ? element.classList.contains(className) : false;
        },

        /**
         * Get computed style value
         * @param {Element} element - Target element
         * @param {String} property - CSS property
         * @return {String} Computed value
         */
        getStyle(element, property) {
            if (!element) return '';
            return window.getComputedStyle(element).getPropertyValue(property);
        },

        /**
         * Set CSS properties
         * @param {Element} element - Target element
         * @param {Object} styles - Style properties
         */
        setStyles(element, styles) {
            if (!element || !styles) return;
            
            Object.entries(styles).forEach(([property, value]) => {
                element.style[property] = value;
            });
        },

        /**
         * Get scroll position
         * @return {Object} Scroll position {x, y}
         */
        getScrollPosition() {
            return {
                x: window.pageXOffset || document.documentElement.scrollLeft,
                y: window.pageYOffset || document.documentElement.scrollTop
            };
        },

        /**
         * Get element offset from top of page
         * @param {Element} element - Target element
         * @return {Object} Offset {top, left}
         */
        getOffset(element) {
            if (!element) return { top: 0, left: 0 };
            
            const rect = element.getBoundingClientRect();
            const scrollPos = Utils.getScrollPosition();
            
            return {
                top: rect.top + scrollPos.y,
                left: rect.left + scrollPos.x
            };
        },

        /**
         * Smooth scroll to element
         * @param {Element|String} target - Target element or selector
         * @param {Number} offset - Offset from top
         * @param {Number} duration - Animation duration
         * @param {String} easing - Easing function name
         */
        scrollTo(target, offset = CONFIG.SCROLL_OFFSET, duration = CONFIG.SMOOTH_SCROLL_DURATION, easing = 'easeInOutQuad') {
            const element = typeof target === 'string' ? Utils.$(target) : target;
            
            if (!element) {
                Utils.log.warn('Scroll target not found:', target);
                return;
            }
            
            const startPosition = Utils.getScrollPosition().y;
            const targetPosition = Utils.getOffset(element).top - offset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();
            
            const easingFunc = CONFIG.EASING[easing] || CONFIG.EASING.easeInOutQuad;
            
            function animation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easingFunc(progress);
                
                window.scrollTo(0, startPosition + (distance * easeProgress));
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        },

        /**
         * Check if element is in viewport
         * @param {Element} element - Target element
         * @param {Number} offset - Offset threshold
         * @return {Boolean} Whether element is visible
         */
        isInViewport(element, offset = 0) {
            if (!element) return false;
            
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top >= -offset &&
                rect.left >= -offset &&
                rect.bottom <= windowHeight + offset &&
                rect.right <= windowWidth + offset
            );
        },

        /**
         * Get viewport dimensions
         * @return {Object} Viewport {width, height}
         */
        getViewport() {
            return {
                width: window.innerWidth || document.documentElement.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight
            };
        },

        /**
         * Check if mobile device
         * @return {Boolean} Whether device is mobile
         */
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        /**
         * Check if touch device
         * @return {Boolean} Whether device supports touch
         */
        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        /**
         * Get device type
         * @return {String} Device type (mobile, tablet, desktop)
         */
        getDeviceType() {
            const width = Utils.getViewport().width;
            
            if (width < CONFIG.BREAKPOINTS.md) return 'mobile';
            if (width < CONFIG.BREAKPOINTS.lg) return 'tablet';
            return 'desktop';
        },

        /**
         * Random number between min and max
         * @param {Number} min - Minimum value
         * @param {Number} max - Maximum value
         * @return {Number} Random number
         */
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Random integer between min and max
         * @param {Number} min - Minimum value
         * @param {Number} max - Maximum value
         * @return {Number} Random integer
         */
        randomInt(min, max) {
            return Math.floor(Utils.random(min, max + 1));
        },

        /**
         * Clamp number between min and max
         * @param {Number} value - Value to clamp
         * @param {Number} min - Minimum value
         * @param {Number} max - Maximum value
         * @return {Number} Clamped value
         */
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        /**
         * Linear interpolation
         * @param {Number} start - Start value
         * @param {Number} end - End value
         * @param {Number} amount - Amount to interpolate (0-1)
         * @return {Number} Interpolated value
         */
        lerp(start, end, amount) {
            return start + (end - start) * amount;
        },

        /**
         * Map value from one range to another
         * @param {Number} value - Value to map
         * @param {Number} inMin - Input minimum
         * @param {Number} inMax - Input maximum
         * @param {Number} outMin - Output minimum
         * @param {Number} outMax - Output maximum
         * @return {Number} Mapped value
         */
        map(value, inMin, inMax, outMin, outMax) {
            return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        },

        /**
         * Calculate distance between two points
         * @param {Number} x1 - Point 1 X
         * @param {Number} y1 - Point 1 Y
         * @param {Number} x2 - Point 2 X
         * @param {Number} y2 - Point 2 Y
         * @return {Number} Distance
         */
        distance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        },

        /**
         * Format number with commas
         * @param {Number} num - Number to format
         * @return {String} Formatted number
         */
        formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        /**
         * Format currency
         * @param {Number} amount - Amount to format
         * @param {String} currency - Currency code
         * @return {String} Formatted currency
         */
        formatCurrency(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },

        /**
         * Format date
         * @param {Date|String|Number} date - Date to format
         * @param {Object} options - Formatting options
         * @return {String} Formatted date
         */
        formatDate(date, options = {}) {
            const defaultOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            
            return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
                .format(new Date(date));
        },

        /**
         * Validate email address
         * @param {String} email - Email to validate
         * @return {Boolean} Whether email is valid
         */
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        },

        /**
         * Validate URL
         * @param {String} url - URL to validate
         * @return {Boolean} Whether URL is valid
         */
        validateURL(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        /**
         * Sanitize HTML string
         * @param {String} html - HTML string to sanitize
         * @return {String} Sanitized string
         */
        sanitizeHTML(html) {
            const temp = document.createElement('div');
            temp.textContent = html;
            return temp.innerHTML;
        },

        /**
         * Parse query string
         * @param {String} queryString - Query string
         * @return {Object} Parsed parameters
         */
        parseQueryString(queryString = window.location.search) {
            const params = new URLSearchParams(queryString);
            const result = {};
            
            for (const [key, value] of params) {
                result[key] = value;
            }
            
            return result;
        },

        /**
         * Create element with attributes
         * @param {String} tag - HTML tag
         * @param {Object} attributes - Element attributes
         * @param {Array|String} children - Child elements or text
         * @return {Element} Created element
         */
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            // Set attributes
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else if (key === 'textContent') {
                    element.textContent = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Utils.setStyles(element, value);
                } else if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // Add children
            const childArray = Array.isArray(children) ? children : [children];
            childArray.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            });
            
            return element;
        },

        /**
         * Deep clone object
         * @param {Object} obj - Object to clone
         * @return {Object} Cloned object
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
            if (obj instanceof Object) {
                const clonedObj = {};
                Object.keys(obj).forEach(key => {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                });
                return clonedObj;
            }
        },

        /**
         * Deep merge objects
         * @param {Object} target - Target object
         * @param {...Object} sources - Source objects
         * @return {Object} Merged object
         */
        deepMerge(target, ...sources) {
            if (!sources.length) return target;
            const source = sources.shift();
            
            if (Utils.isObject(target) && Utils.isObject(source)) {
                Object.keys(source).forEach(key => {
                    if (Utils.isObject(source[key])) {
                        if (!target[key]) Object.assign(target, { [key]: {} });
                        Utils.deepMerge(target[key], source[key]);
                    } else {
                        Object.assign(target, { [key]: source[key] });
                    }
                });
            }
            
            return Utils.deepMerge(target, ...sources);
        },

        /**
         * Check if value is object
         * @param {*} value - Value to check
         * @return {Boolean} Whether value is object
         */
        isObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },

        /**
         * Check if value is empty
         * @param {*} value - Value to check
         * @return {Boolean} Whether value is empty
         */
        isEmpty(value) {
            if (value == null) return true;
            if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
            if (value instanceof Map || value instanceof Set) return value.size === 0;
            if (Utils.isObject(value)) return Object.keys(value).length === 0;
            return false;
        },

        /**
         * Retry function with exponential backoff
         * @param {Function} fn - Function to retry
         * @param {Number} maxAttempts - Maximum attempts
         * @param {Number} delay - Initial delay
         * @return {Promise} Promise that resolves with function result
         */
        async retry(fn, maxAttempts = 3, delay = 1000) {
            let lastError;
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await fn();
                } catch (error) {
                    lastError = error;
                    Utils.log.warn(`Attempt ${attempt} failed:`, error);
                    
                    if (attempt < maxAttempts) {
                        await Utils.sleep(delay * Math.pow(2, attempt - 1));
                    }
                }
            }
            
            throw lastError;
        },

        /**
         * Sleep/delay function
         * @param {Number} ms - Milliseconds to sleep
         * @return {Promise} Promise that resolves after delay
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Wait for condition to be true
         * @param {Function} condition - Condition function
         * @param {Number} timeout - Timeout in milliseconds
         * @param {Number} interval - Check interval
         * @return {Promise} Promise that resolves when condition is true
         */
        waitFor(condition, timeout = 5000, interval = 100) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                
                const check = () => {
                    if (condition()) {
                        resolve();
                    } else if (Date.now() - startTime >= timeout) {
                        reject(new Error('Timeout waiting for condition'));
                    } else {
                        setTimeout(check, interval);
                    }
                };
                
                check();
            });
        },

        /**
         * Local Storage wrapper with error handling
         */
        storage: {
            /**
             * Set item in localStorage
             * @param {String} key - Storage key
             * @param {*} value - Value to store
             * @return {Boolean} Success status
             */
            set(key, value) {
                try {
                    const serialized = JSON.stringify(value);
                    localStorage.setItem(key, serialized);
                    return true;
                } catch (error) {
                    Utils.log.error('LocalStorage set error:', error);
                    return false;
                }
            },
            
            /**
             * Get item from localStorage
             * @param {String} key - Storage key
             * @param {*} defaultValue - Default value if key not found
             * @return {*} Stored value or default
             */
            get(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    Utils.log.error('LocalStorage get error:', error);
                    return defaultValue;
                }
            },
            
            /**
             * Remove item from localStorage
             * @param {String} key - Storage key
             * @return {Boolean} Success status
             */
            remove(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    Utils.log.error('LocalStorage remove error:', error);
                    return false;
                }
            },
            
            /**
             * Clear all localStorage
             * @return {Boolean} Success status
             */
            clear() {
                try {
                    localStorage.clear();
                    return true;
                } catch (error) {
                    Utils.log.error('LocalStorage clear error:', error);
                    return false;
                }
            },
            
            /**
             * Get all keys from localStorage
             * @return {Array} Array of keys
             */
            keys() {
                try {
                    return Object.keys(localStorage);
                } catch (error) {
                    Utils.log.error('LocalStorage keys error:', error);
                    return [];
                }
            }
        },

        /**
         * Cookie utilities
         */
        cookie: {
            /**
             * Set cookie
             * @param {String} name - Cookie name
             * @param {String} value - Cookie value
             * @param {Number} days - Expiration days
             * @param {String} path - Cookie path
             */
            set(name, value, days = 365, path = '/') {
                const expires = new Date();
                expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
                document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
            },
            
            /**
             * Get cookie
             * @param {String} name - Cookie name
             * @return {String|null} Cookie value or null
             */
            get(name) {
                const nameEQ = name + '=';
                const ca = document.cookie.split(';');
                
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                }
                
                return null;
            },
            
            /**
             * Delete cookie
             * @param {String} name - Cookie name
             * @param {String} path - Cookie path
             */
            delete(name, path = '/') {
                Utils.cookie.set(name, '', -1, path);
            }
        }
    };

    /* ============================================
       EVENT EMITTER
       Custom event system for decoupled communication
       ============================================ */

    class EventEmitter {
        constructor() {
            this.events = {};
        }
        
        /**
         * Subscribe to event
         * @param {String} event - Event name
         * @param {Function} callback - Callback function
         * @return {Function} Unsubscribe function
         */
        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            
            this.events[event].push(callback);
            
            // Return unsubscribe function
            return () => this.off(event, callback);
        }
        
        /**
         * Subscribe to event once
         * @param {String} event - Event name
         * @param {Function} callback - Callback function
         */
        once(event, callback) {
            const onceCallback = (...args) => {
                callback(...args);
                this.off(event, onceCallback);
            };
            
            this.on(event, onceCallback);
        }
        
        /**
         * Unsubscribe from event
         * @param {String} event - Event name
         * @param {Function} callback - Callback function
         */
        off(event, callback) {
            if (!this.events[event]) return;
            
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        
        /**
         * Emit event
         * @param {String} event - Event name
         * @param {*} data - Event data
         */
        emit(event, data) {
            if (!this.events[event]) return;
            
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    Utils.log.error(`Error in event "${event}" handler:`, error);
                }
            });
        }
        
        /**
         * Remove all event listeners
         */
        clear() {
            this.events = {};
        }
    }

    // Create global event bus
    const EventBus = new EventEmitter();

    /* ============================================
       FEATURE DETECTION
       Detect browser capabilities
       ============================================ */

    const FeatureDetection = {
        /**
         * Initialize feature detection
         */
        init() {
            STATE.features = {
                intersectionObserver: 'IntersectionObserver' in window,
                mutationObserver: 'MutationObserver' in window,
                resizeObserver: 'ResizeObserver' in window,
                localStorage: this.hasLocalStorage(),
                canvas: this.hasCanvas(),
                webGL: this.hasWebGL(),
                touch: Utils.isTouchDevice(),
                pointer: 'PointerEvent' in window,
                serviceWorker: 'serviceWorker' in navigator,
                webWorker: 'Worker' in window,
                fetch: 'fetch' in window,
                promises: 'Promise' in window,
                history: 'pushState' in history,
                geolocation: 'geolocation' in navigator,
                notification: 'Notification' in window,
                crypto: 'crypto' in window,
                vibrate: 'vibrate' in navigator
            };
            
            Utils.log.info('Feature Detection:', STATE.features);
            EventBus.emit('features:detected', STATE.features);
        },
        
        /**
         * Check localStorage support
         * @return {Boolean} Support status
         */
        hasLocalStorage() {
            try {
                const test = '__test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch {
                return false;
            }
        },
        
        /**
         * Check canvas support
         * @return {Boolean} Support status
         */
        hasCanvas() {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        },
        
        /**
         * Check WebGL support
         * @return {Boolean} Support status
         */
        hasWebGL() {
            try {
                const canvas = document.createElement('canvas');
                return !!(
                    canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl')
                );
            } catch {
                return false;
            }
        }
    };

    /* ============================================
       LOADING SCREEN
       Advanced loading animation with progress
       ============================================ */

    const LoadingScreen = {
        // DOM elements
        screen: null,
        progress: null,
        percentage: null,
        text: null,
        particlesContainer: null,
        
        // Animation state
        currentProgress: 0,
        targetProgress: 100,
        startTime: null,
        
        // Loading messages
        messages: [
            'Initializing Experience',
            'Loading Assets',
            'Preparing Interface',
            'Setting Up Animations',
            'Optimizing Performance',
            'Almost Ready',
            'Welcome!'
        ],
        
        /**
         * Initialize loading screen
         */
        init() {
            Utils.log.info('Initializing loading screen');
            
            this.screen = Utils.$('#loadingScreen');
            this.progress = Utils.$('#loadingProgress');
            this.percentage = Utils.$('#loadingPercentage');
            this.text = Utils.$('#loadingText');
            this.particlesContainer = Utils.$('#loadingParticles');
            
            if (!this.screen) {
                Utils.log.warn('Loading screen not found');
                return;
            }
            
            this.createParticles();
            this.start();
        },
        
        /**
         * Create animated particles
         */
        createParticles() {
            if (!this.particlesContainer) return;
            
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = Utils.createElement('div', {
                    className: 'loading-particle',
                    style: {
                        left: `${Utils.random(0, 100)}%`,
                        animationDelay: `${Utils.random(0, 4)}s`,
                        animationDuration: `${Utils.random(3, 6)}s`
                    }
                });
                
                this.particlesContainer.appendChild(particle);
            }
        },
        
        /**
         * Start loading animation
         */
        start() {
            this.startTime = performance.now();
            this.animate();
        },
        
        /**
         * Animate loading progress
         */
        animate() {
            if (!this.screen) return;
            
            const elapsed = performance.now() - this.startTime;
            const progress = Math.min((elapsed / CONFIG.LOADING_DURATION) * 100, 100);
            
            // Smooth progress with lerp
            this.currentProgress = Utils.lerp(this.currentProgress, progress, 0.1);
            
            // Update progress bar
            if (this.progress) {
                this.progress.style.width = `${this.currentProgress}%`;
            }
            
            // Update percentage
            if (this.percentage) {
                this.percentage.textContent = `${Math.floor(this.currentProgress)}%`;
            }
            
            // Update message
            if (this.text) {
                const messageIndex = Math.floor((this.currentProgress / 100) * this.messages.length);
                const message = this.messages[Math.min(messageIndex, this.messages.length - 1)];
                this.text.textContent = message;
            }
            
            // Continue animation or complete
            if (this.currentProgress < 99) {
                requestAnimationFrame(() => this.animate());
            } else {
                setTimeout(() => this.complete(), 500);
            }
        },
        
        /**
         * Complete loading
         */
        complete() {
            Utils.log.success('Loading complete');
            
            if (this.screen) {
                Utils.addClass(this.screen, 'loaded');
                STATE.isLoading = false;
                
                // Enable scrolling
                document.body.style.overflow = 'auto';
                
                // Emit event
                EventBus.emit('loading:complete');
                
                // Initialize components after loading
                setTimeout(() => {
                    CanvasAnimations.init();
                    ScrollReveal.init();
                }, 300);
            }
        }
    };

    /* ============================================
       CUSTOM CURSOR
       Advanced cursor system with trails
       ============================================ */

    const CustomCursor = {
        // DOM elements
        dot: null,
        outline: null,
        trailContainer: null,
        
        // Cursor position
        position: { x: 0, y: 0 },
        dotPosition: { x: 0, y: 0 },
        outlinePosition: { x: 0, y: 0 },
        
        // State
        isActive: false,
        isHovering: false,
        
        /**
         * Initialize cursor
         */
        init() {
            // Only enable on desktop with hover support
            if (Utils.isMobile() || !window.matchMedia('(hover: hover)').matches) {
                Utils.log.info('Custom cursor disabled on this device');
                return;
            }
            
            Utils.log.info('Initializing custom cursor');
            
            this.dot = Utils.$('#cursorDot');
            this.outline = Utils.$('#cursorOutline');
            this.trailContainer = Utils.$('#cursorTrail');
            
            if (!this.dot || !this.outline) {
                Utils.log.warn('Cursor elements not found');
                return;
            }
            
            this.isActive = true;
            this.bindEvents();
            this.animate();
        },
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            // Track mouse movement
            document.addEventListener('mousemove', (e) => {
                this.position.x = e.clientX;
                this.position.y = e.clientY;
                
                // Create trail
                if (Utils.random(0, 1) > 0.5) {
                    this.createTrail(e.clientX, e.clientY);
                }
            });
            
            // Hover effects
            const hoverElements = Utils.$$('a, button, .project-card, .cta-btn, input, textarea, [role="button"]');
            
            hoverElements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.setHoverState(true);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.setHoverState(false);
                });
            });
            
            // Click effect
            document.addEventListener('mousedown', () => {
                Utils.addClass(this.dot, 'click');
            });
            
            document.addEventListener('mouseup', () => {
                Utils.removeClass(this.dot, 'click');
            });
        },
        
        /**
         * Set hover state
         * @param {Boolean} state - Hover state
         */
        setHoverState(state) {
            this.isHovering = state;
            
            if (state) {
                Utils.addClass(this.dot, 'hover');
                Utils.addClass(this.outline, 'hover');
            } else {
                Utils.removeClass(this.dot, 'hover');
                Utils.removeClass(this.outline, 'hover');
            }
        },
        
        /**
         * Create cursor trail particle
         * @param {Number} x - X position
         * @param {Number} y - Y position
         */
        createTrail(x, y) {
            if (!this.trailContainer) return;
            
            // Limit trail particles
            if (STATE.cursorTrails.length >= CONFIG.CURSOR_TRAIL_LIMIT) {
                return;
            }
            
            const trail = Utils.createElement('div', {
                className: 'cursor-trail',
                style: {
                    left: `${x}px`,
                    top: `${y}px`
                }
            });
            
            this.trailContainer.appendChild(trail);
            STATE.cursorTrails.push(trail);
            
            // Remove after animation
            setTimeout(() => {
                trail.remove();
                STATE.cursorTrails = STATE.cursorTrails.filter(t => t !== trail);
            }, CONFIG.CURSOR_TRAIL_DECAY);
        },
        
        /**
         * Animate cursor
         */
        animate() {
            if (!this.isActive) return;
            
            // Smooth follow with different speeds
            this.dotPosition.x = Utils.lerp(
                this.dotPosition.x,
                this.position.x,
                CONFIG.CURSOR_DOT_SMOOTH
            );
            this.dotPosition.y = Utils.lerp(
                this.dotPosition.y,
                this.position.y,
                CONFIG.CURSOR_DOT_SMOOTH
            );
            
            this.outlinePosition.x = Utils.lerp(
                this.outlinePosition.x,
                this.position.x,
                CONFIG.CURSOR_SMOOTH_FACTOR
            );
            this.outlinePosition.y = Utils.lerp(
                this.outlinePosition.y,
                this.position.y,
                CONFIG.CURSOR_SMOOTH_FACTOR
            );
            
            // Update positions
            if (this.dot) {
                this.dot.style.left = `${this.dotPosition.x}px`;
                this.dot.style.top = `${this.dotPosition.y}px`;
            }
            
            if (this.outline) {
                this.outline.style.left = `${this.outlinePosition.x}px`;
                this.outline.style.top = `${this.outlinePosition.y}px`;
            }
            
            STATE.animationFrames.cursor = requestAnimationFrame(() => this.animate());
        },
        
        /**
         * Destroy cursor
         */
        destroy() {
            this.isActive = false;
            
            if (STATE.animationFrames.cursor) {
                cancelAnimationFrame(STATE.animationFrames.cursor);
            }
        }
    };

    /* ============================================
       NAVIGATION
       Smart navigation with scroll behavior
       ============================================ */

    const Navigation = {
        // DOM elements
        nav: null,
        toggle: null,
        links: null,
        navLinks: [],
        progress: null,
        
        // State
        isScrollingDown: false,
        lastScrollY: 0,
        
        /**
         * Initialize navigation
         */
        init() {
            Utils.log.info('Initializing navigation');
            
            this.nav = Utils.$('#mainNav');
            this.toggle = Utils.$('#navToggle');
            this.links = Utils.$('#navLinks');
            this.navLinks = Utils.$$('.nav-link');
            this.progress = Utils.$('#navProgress');
            
            if (!this.nav) {
                Utils.log.warn('Navigation not found');
                return;
            }
            
            this.bindEvents();
            this.updateProgress();
            this.updateActiveLink();
        },
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            // Scroll behavior
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, CONFIG.THROTTLE_DELAY));
            
            // Mobile menu toggle
            if (this.toggle) {
                this.toggle.addEventListener('click', () => {
                    this.toggleMenu();
                });
            }
            
            // Smooth scroll for navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const target = Utils.$(targetId);
                    
                    if (target) {
                        Utils.scrollTo(target, CONFIG.SCROLL_OFFSET);
                        
                        // Close mobile menu
                        if (STATE.isMenuOpen) {
                            this.toggleMenu();
                        }
                        
                        // Update active link
                        this.setActiveLink(link);
                    }
                });
            });
            
            // Update active link on scroll
            window.addEventListener('scroll', Utils.throttle(() => {
                this.updateActiveLink();
            }, 200));
            
            // Close menu on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && STATE.isMenuOpen) {
                    this.toggleMenu();
                }
            });
            
            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (STATE.isMenuOpen && 
                    !this.nav.contains(e.target) && 
                    !this.toggle.contains(e.target)) {
                    this.toggleMenu();
                }
            });
        },
        
        /**
         * Handle scroll behavior
         */
        handleScroll() {
            const currentScrollY = Utils.getScrollPosition().y;
            
            // Add scrolled class
            if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
                Utils.addClass(this.nav, 'scrolled');
            } else {
                Utils.removeClass(this.nav, 'scrolled');
            }
            
            // Hide/show navigation on scroll
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                // Scrolling down
                Utils.addClass(this.nav, 'hidden');
                this.isScrollingDown = true;
            } else {
                // Scrolling up
                Utils.removeClass(this.nav, 'hidden');
                this.isScrollingDown = false;
            }
            
            this.lastScrollY = currentScrollY;
            
            // Update progress bar
            this.updateProgress();
            
            // Emit scroll event
            EventBus.emit('scroll', {
                y: currentScrollY,
                direction: this.isScrollingDown ? 'down' : 'up'
            });
        },
        
        /**
         * Update progress bar
         */
        updateProgress() {
            if (!this.progress) return;
            
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (Utils.getScrollPosition().y / windowHeight) * 100;
            
            this.progress.style.width = `${Utils.clamp(scrolled, 0, 100)}%`;
        },
        
        /**
         * Toggle mobile menu
         */
        toggleMenu() {
            STATE.isMenuOpen = !STATE.isMenuOpen;
            
            Utils.toggleClass(this.toggle, 'active');
            Utils.toggleClass(this.links, 'active');
            
            // Update ARIA
            this.toggle.setAttribute('aria-expanded', STATE.isMenuOpen);
            
            // Prevent body scroll when menu is open
            if (STATE.isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
            
            // Emit event
            EventBus.emit('menu:toggle', STATE.isMenuOpen);
        },
        
        /**
         * Set active navigation link
         * @param {Element} activeLink - Link to set as active
         */
        setActiveLink(activeLink) {
            this.navLinks.forEach(link => {
                Utils.removeClass(link, 'active');
            });
            
            Utils.addClass(activeLink, 'active');
        },
        
        /**
         * Update active link based on scroll position
         */
        updateActiveLink() {
            const sections = Utils.$$('section[id]');
            const scrollPosition = Utils.getScrollPosition().y + 100;
            
            let activeSection = null;
            
            sections.forEach(section => {
                const sectionTop = Utils.getOffset(section).top;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSection = section;
                }
            });
            
            if (activeSection) {
                const sectionId = activeSection.getAttribute('id');
                const activeLink = Utils.$(`.nav-link[href="#${sectionId}"]`);
                
                if (activeLink && !Utils.hasClass(activeLink, 'active')) {
                    this.setActiveLink(activeLink);
                }
            }
        }
    };

    /* ============================================
       CANVAS ANIMATIONS
       Multi-layer canvas animation system
       ============================================ */

    const CanvasAnimations = {
        /**
         * Initialize all canvas animations
         */
        init() {
            if (!STATE.features.canvas) {
                Utils.log.warn('Canvas not supported');
                return;
            }
            
            Utils.log.info('Initializing canvas animations');
            
            this.initParticles();
            this.initWaves();
            this.initNebula();
            this.initFloatingParticles();
        },
        
        /**
         * Initialize particle system
         */
        initParticles() {
            const canvas = Utils.$('#particleCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            STATE.canvasContexts.particles = ctx;
            
            // Set canvas size
            this.resizeCanvas(canvas);
            
            // Create particles
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                STATE.particles.push(new Particle(canvas));
            }
            
            // Start animation
            this.animateParticles(canvas, ctx);
            
            // Handle resize
            window.addEventListener('resize', Utils.debounce(() => {
                this.resizeCanvas(canvas);
            }, CONFIG.CANVAS_RESIZE_DEBOUNCE));
        },
        
        /**
         * Animate particles
         * @param {HTMLCanvasElement} canvas - Canvas element
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         */
        animateParticles(canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            STATE.particles.forEach(particle => {
                particle.update(canvas);
                particle.draw(ctx);
            });
            
            // Draw connections
            this.drawConnections(ctx, STATE.particles);
            
            STATE.animationFrames.particles = requestAnimationFrame(() => {
                this.animateParticles(canvas, ctx);
            });
        },
        
        /**
         * Draw connections between particles
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         * @param {Array} particles - Particle array
         */
        drawConnections(ctx, particles) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < CONFIG.PARTICLE_CONNECTION_DISTANCE) {
                        const opacity = 0.2 * (1 - distance / CONFIG.PARTICLE_CONNECTION_DISTANCE);
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 156, 192, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        },
        
        /**
         * Initialize wave animation
         */
        initWaves() {
            const canvas = Utils.$('#waveCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            STATE.canvasContexts.waves = ctx;
            
            this.resizeCanvas(canvas);
            
            let time = 0;
            
            const animateWaves = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw multiple wave layers
                for (let layer = 0; layer < 3; layer++) {
                    ctx.beginPath();
                    ctx.moveTo(0, canvas.height / 2);
                    
                    for (let x = 0; x < canvas.width; x++) {
                        const y = canvas.height / 2 + 
                            Math.sin(x * CONFIG.WAVE_FREQUENCY + time + layer * 2) * 
                            CONFIG.WAVE_AMPLITUDE * (layer + 1);
                        ctx.lineTo(x, y);
                    }
                    
                    const opacity = 0.1 - layer * 0.03;
                    ctx.strokeStyle = `rgba(154, 163, 214, ${opacity})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
                
                time += CONFIG.WAVE_SPEED;
                
                STATE.animationFrames.waves = requestAnimationFrame(animateWaves);
            };
            
            animateWaves();
            
            window.addEventListener('resize', Utils.debounce(() => {
                this.resizeCanvas(canvas);
            }, CONFIG.CANVAS_RESIZE_DEBOUNCE));
        },
        
        /**
         * Initialize nebula effect
         */
        initNebula() {
            const canvas = Utils.$('#nebulaCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            STATE.canvasContexts.nebula = ctx;
            
            this.resizeCanvas(canvas);
            this.drawNebula(canvas, ctx);
            
            window.addEventListener('resize', Utils.debounce(() => {
                this.resizeCanvas(canvas);
                this.drawNebula(canvas, ctx);
            }, CONFIG.CANVAS_RESIZE_DEBOUNCE));
        },
        
        /**
         * Draw nebula gradient
         * @param {HTMLCanvasElement} canvas - Canvas element
         * @param {CanvasRenderingContext2D} ctx - Canvas context
         */
        drawNebula(canvas, ctx) {
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width / 2
            );
            
            gradient.addColorStop(0, 'rgba(168, 156, 192, 0.2)');
            gradient.addColorStop(0.5, 'rgba(154, 163, 214, 0.1)');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        
        /**
         * Initialize floating particles
         */
        initFloatingParticles() {
            const container = Utils.$('#floatingParticles');
            if (!container) return;
            
            for (let i = 0; i < 20; i++) {
                const particle = Utils.createElement('div', {
                    className: 'floating-particle',
                    style: {
                        left: `${Utils.random(0, 100)}%`,
                        animationDelay: `${Utils.random(0, 8)}s`,
                        animationDuration: `${Utils.random(6, 12)}s`
                    }
                });
                
                container.appendChild(particle);
            }
        },
        
        /**
         * Resize canvas to window size
         * @param {HTMLCanvasElement} canvas - Canvas element
         */
        resizeCanvas(canvas) {
            const viewport = Utils.getViewport();
            canvas.width = viewport.width;
            canvas.height = viewport.height;
        }
    };

    /**
     * Particle class for canvas animation
     */
    class Particle {
        constructor(canvas) {
            this.reset(canvas);
        }
        
        reset(canvas) {
            this.x = Utils.random(0, canvas.width);
            this.y = Utils.random(0, canvas.height);
            this.vx = Utils.random(-CONFIG.PARTICLE_MAX_SPEED, CONFIG.PARTICLE_MAX_SPEED);
            this.vy = Utils.random(-CONFIG.PARTICLE_MAX_SPEED, CONFIG.PARTICLE_MAX_SPEED);
            this.radius = Utils.random(1, 3);
            this.opacity = Utils.random(0.1, 0.5);
        }
        
        update(canvas) {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Keep within bounds
            this.x = Utils.clamp(this.x, 0, canvas.width);
            this.y = Utils.clamp(this.y, 0, canvas.height);
        }
        
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 156, 192, ${this.opacity})`;
            ctx.fill();
        }
    }

    /* ============================================
       SCROLL REVEAL
       Intersection Observer based reveal animations
       ============================================ */

    const ScrollReveal = {
        // Configuration
        options: {
            root: null,
            threshold: CONFIG.REVEAL_THRESHOLD,
            rootMargin: CONFIG.REVEAL_MARGIN
        },
        
        /**
         * Initialize scroll reveal
         */
        init() {
            Utils.log.info('Initializing scroll reveal');
            
            const elements = Utils.$$('.reveal');
            
            if (!elements.length) {
                Utils.log.warn('No reveal elements found');
                return;
            }
            
            if (STATE.features.intersectionObserver) {
                this.initObserver(elements);
            } else {
                this.initFallback(elements);
            }
        },
        
        /**
         * Initialize with Intersection Observer
         * @param {Array} elements - Elements to observe
         */
        initObserver(elements) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Utils.addClass(entry.target, 'revealed');
                        observer.unobserve(entry.target);
                        
                        // Emit event
                        EventBus.emit('reveal:shown', entry.target);
                    }
                });
            }, this.options);
            
            elements.forEach(element => {
                observer.observe(element);
            });
            
            STATE.observers.intersection.push(observer);
        },
        
        /**
         * Initialize fallback for older browsers
         * @param {Array} elements - Elements to reveal
         */
        initFallback(elements) {
            const checkVisibility = () => {
                elements.forEach(element => {
                    if (!Utils.hasClass(element, 'revealed') && Utils.isInViewport(element, 100)) {
                        Utils.addClass(element, 'revealed');
                        EventBus.emit('reveal:shown', element);
                    }
                });
            };
            
            window.addEventListener('scroll', Utils.throttle(checkVisibility, 200));
            checkVisibility();
        }
    };

    /* ============================================
       STATISTICS COUNTER
       Animated number counting
       ============================================ */

    const StatsCounter = {
        /**
         * Initialize statistics counters
         */
        init() {
            Utils.log.info('Initializing stats counter');
            
            const stats = Utils.$$('.stat-number');
            
            if (!stats.length) return;
            
            if (STATE.features.intersectionObserver) {
                this.observe(stats);
            } else {
                this.fallback(stats);
            }
        },
        
        /**
         * Observe stats with Intersection Observer
         * @param {Array} stats - Stat elements
         */
        observe(stats) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.counted) {
                        this.animateCounter(entry.target);
                        entry.target.dataset.counted = 'true';
                    }
                });
            }, {
                threshold: 0.5
            });
            
            stats.forEach(stat => {
                observer.observe(stat);
            });
            
            STATE.observers.intersection.push(observer);
        },
        
        /**
         * Fallback without Intersection Observer
         * @param {Array} stats - Stat elements
         */
        fallback(stats) {
            stats.forEach(stat => {
                if (Utils.isInViewport(stat, 100) && !stat.dataset.counted) {
                    this.animateCounter(stat);
                    stat.dataset.counted = 'true';
                }
            });
        },
        
        /**
         * Animate counter
         * @param {Element} element - Counter element
         */
        animateCounter(element) {
            const target = parseInt(element.dataset.target) || 0;
            const duration = CONFIG.COUNTER_DURATION;
            const start = 0;
            const startTime = performance.now();
            
            const easingFunc = CONFIG.EASING[CONFIG.COUNTER_EASING];
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easingFunc(progress);
                const current = Math.floor(start + (target - start) * easeProgress);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target;
                    EventBus.emit('counter:complete', { element, value: target });
                }
            };
            
            requestAnimationFrame(animate);
        }
    };
    /* ============================================
       FORM HANDLING
       Advanced form validation and submission
       ============================================ */

    const FormHandler = {
        // Form elements
        form: null,
        submitButton: null,
        
        // Validation rules
        validationRules: {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters and spaces only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: false,
                minLength: 3,
                maxLength: 100
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        },
        
        /**
         * Initialize form handler
         */
        init() {
            Utils.log.info('Initializing form handler');
            
            this.form = Utils.$('#contactForm');
            
            if (!this.form) {
                Utils.log.warn('Contact form not found');
                return;
            }
            
            this.submitButton = this.form.querySelector('.form-submit');
            
            this.bindEvents();
            this.loadSavedData();
        },
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            // Form submission
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
            
            // Real-time validation
            const inputs = Utils.$$('input, textarea', this.form);
            
            inputs.forEach(input => {
                // Validate on blur
                input.addEventListener('blur', Utils.debounce(() => {
                    this.validateField(input);
                }, CONFIG.VALIDATION_DEBOUNCE));
                
                // Clear error on input
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
                
                // Auto-save form data
                input.addEventListener('input', Utils.debounce(() => {
                    this.saveFormData();
                }, 1000));
            });
            
            // Character counter for textarea
            const textarea = Utils.$('textarea', this.form);
            if (textarea) {
                this.addCharacterCounter(textarea);
            }
        },
        
        /**
         * Validate single field
         * @param {Element} field - Field to validate
         * @return {Boolean} Validation result
         */
        validateField(field) {
            const name = field.name;
            const value = field.value.trim();
            const rules = this.validationRules[name];
            
            if (!rules) return true;
            
            let isValid = true;
            let errorMessage = '';
            
            // Required validation
            if (rules.required && !value) {
                isValid = false;
                errorMessage = `${this.formatFieldName(name)} is required`;
            }
            
            // Min length validation
            if (isValid && rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = `${this.formatFieldName(name)} must be at least ${rules.minLength} characters`;
            }
            
            // Max length validation
            if (isValid && rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = `${this.formatFieldName(name)} must not exceed ${rules.maxLength} characters`;
            }
            
            // Pattern validation
            if (isValid && rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.message || `${this.formatFieldName(name)} format is invalid`;
            }
            
            // Show/hide error
            if (!isValid) {
                this.showFieldError(field, errorMessage);
            } else {
                this.clearFieldError(field);
            }
            
            return isValid;
        },
        
        /**
         * Validate entire form
         * @return {Boolean} Validation result
         */
        validateForm() {
            const inputs = Utils.$$('input[required], textarea[required]', this.form);
            let isValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        /**
         * Show field error
         * @param {Element} field - Field element
         * @param {String} message - Error message
         */
        showFieldError(field, message) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            // Remove existing error
            this.clearFieldError(field);
            
            // Create error element
            const error = Utils.createElement('div', {
                className: 'field-error',
                style: {
                    color: 'var(--accent-red)',
                    fontSize: 'var(--text-sm)',
                    marginTop: 'var(--space-2)'
                },
                textContent: message
            });
            
            formGroup.appendChild(error);
            field.style.borderColor = 'var(--accent-red)';
            field.setAttribute('aria-invalid', 'true');
            
            // Emit event
            EventBus.emit('form:error', { field, message });
        },
        
        /**
         * Clear field error
         * @param {Element} field - Field element
         */
        clearFieldError(field) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;
            
            const error = formGroup.querySelector('.field-error');
            if (error) {
                error.remove();
            }
            
            field.style.borderColor = '';
            field.removeAttribute('aria-invalid');
        },
        
        /**
         * Format field name for display
         * @param {String} name - Field name
         * @return {String} Formatted name
         */
        formatFieldName(name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        },
        
        /**
         * Add character counter to textarea
         * @param {Element} textarea - Textarea element
         */
        addCharacterCounter(textarea) {
            const maxLength = this.validationRules.message.maxLength;
            const formGroup = textarea.closest('.form-group');
            
            const counter = Utils.createElement('div', {
                className: 'character-counter',
                style: {
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)',
                    marginTop: 'var(--space-2)'
                },
                textContent: `0 / ${maxLength}`
            });
            
            formGroup.appendChild(counter);
            
            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = `${length} / ${maxLength}`;
                
                if (length > maxLength) {
                    counter.style.color = 'var(--accent-red)';
                } else if (length > maxLength * 0.9) {
                    counter.style.color = 'var(--accent-yellow)';
                } else {
                    counter.style.color = 'var(--text-tertiary)';
                }
            });
        },
        
        /**
         * Handle form submission
         */
        async handleSubmit() {
            Utils.log.info('Form submission started');
            
            // Validate form
            if (!this.validateForm()) {
                Notifications.show('error', 'Validation Error', 'Please fill in all required fields correctly.');
                return;
            }
            
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Disable submit button
            this.setSubmitState(true);
            
            try {
                // Submit form
                await this.submitForm(data);
                
                // Success
                Notifications.show('success', 'Message Sent!', 'Thank you for reaching out. I\'ll get back to you soon.');
                
                // Reset form
                this.form.reset();
                Utils.storage.remove(CONFIG.STORAGE_KEYS.formData);
                
                // Emit event
                EventBus.emit('form:success', data);
                
            } catch (error) {
                Utils.log.error('Form submission error:', error);
                Notifications.show('error', 'Submission Failed', 'Sorry, there was an error sending your message. Please try again.');
                
                // Emit event
                EventBus.emit('form:error', error);
            } finally {
                this.setSubmitState(false);
            }
        },
        
        /**
         * Submit form data
         * @param {Object} data - Form data
         * @return {Promise} Submission promise
         */
        async submitForm(data) {
            // Simulate API call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate random success/failure for demo
                    if (Math.random() > 0.1) {
                        Utils.log.success('Form submitted:', data);
                        resolve({ success: true, data });
                    } else {
                        reject(new Error('Network error'));
                    }
                }, CONFIG.FORM_SUBMIT_DELAY);
            });
        },
        
        /**
         * Set submit button state
         * @param {Boolean} isSubmitting - Submitting state
         */
        setSubmitState(isSubmitting) {
            if (!this.submitButton) return;
            
            if (isSubmitting) {
                this.submitButton.disabled = true;
                this.submitButton.dataset.originalText = this.submitButton.textContent;
                this.submitButton.textContent = 'Sending...';
                Utils.addClass(this.submitButton, 'loading');
            } else {
                this.submitButton.disabled = false;
                this.submitButton.textContent = this.submitButton.dataset.originalText || 'Send Message';
                Utils.removeClass(this.submitButton, 'loading');
            }
        },
        
        /**
         * Save form data to localStorage
         */
        saveFormData() {
            if (!STATE.features.localStorage) return;
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            Utils.storage.set(CONFIG.STORAGE_KEYS.formData, data);
        },
        
        /**
         * Load saved form data
         */
        loadSavedData() {
            if (!STATE.features.localStorage) return;
            
            const savedData = Utils.storage.get(CONFIG.STORAGE_KEYS.formData);
            
            if (!savedData) return;
            
            Object.entries(savedData).forEach(([name, value]) => {
                const field = this.form.querySelector(`[name="${name}"]`);
                if (field) {
                    field.value = value;
                }
            });
            
            Utils.log.info('Form data restored from localStorage');
        }
    };

    /* ============================================
       NOTIFICATIONS
       Toast notification system
       ============================================ */

    const Notifications = {
        // Container element
        container: null,
        
        // Notification queue
        queue: [],
        
        // Icons for different types
        icons: {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke-width="2"/>
            </svg>`,
            
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke-width="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke-width="2"/>
            </svg>`,
            
            warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke-width="2"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke-width="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2"/>
            </svg>`,
            
            info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <line x1="12" y1="16" x2="12" y2="12" stroke-width="2"/>
                <line x1="12" y1="8" x2="12.01" y2="8" stroke-width="2"/>
            </svg>`
        },
        
        /**
         * Initialize notification system
         */
        init() {
            Utils.log.info('Initializing notification system');
            
            this.container = Utils.$('#notificationContainer');
            
            if (!this.container) {
                this.container = Utils.createElement('div', {
                    id: 'notificationContainer',
                    className: 'notification-container'
                });
                document.body.appendChild(this.container);
            }
        },
        
        /**
         * Show notification
         * @param {String} type - Notification type (success, error, warning, info)
         * @param {String} title - Notification title
         * @param {String} message - Notification message
         * @param {Number} duration - Duration in milliseconds (0 for persistent)
         * @return {Object} Notification object
         */
        show(type = 'info', title = '', message = '', duration = CONFIG.NOTIFICATION_DURATION) {
            // Ensure container exists
            if (!this.container) this.init();
            
            // Limit number of notifications
            if (STATE.notifications.length >= CONFIG.MAX_NOTIFICATIONS) {
                this.remove(STATE.notifications[0]);
            }
            
            // Create notification element
            const notification = Utils.createElement('div', {
                className: `notification ${type}`,
                innerHTML: `
                    <div class="notification-icon">${this.icons[type]}</div>
                    <div class="notification-content">
                        <div class="notification-title">${Utils.sanitizeHTML(title)}</div>
                        <div class="notification-message">${Utils.sanitizeHTML(message)}</div>
                    </div>
                    <button class="notification-close" aria-label="Close notification">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18" stroke-width="2"/>
                            <line x1="6" y1="6" x2="18" y2="18" stroke-width="2"/>
                        </svg>
                    </button>
                `
            });
            
            // Add to container
            this.container.appendChild(notification);
            
            // Add to state
            const notificationObj = {
                element: notification,
                type,
                title,
                message,
                timestamp: Date.now()
            };
            
            STATE.notifications.push(notificationObj);
            
            // Bind close button
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.remove(notificationObj);
            });
            
            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    this.remove(notificationObj);
                }, duration);
            }
            
            // Emit event
            EventBus.emit('notification:show', notificationObj);
            
            Utils.log.info(`Notification shown: ${type} - ${title}`);
            
            return notificationObj;
        },
        
        /**
         * Remove notification
         * @param {Object} notification - Notification object
         */
        remove(notification) {
            if (!notification || !notification.element) return;
            
            // Animate out
            notification.element.style.animation = `slideOutRight ${CONFIG.NOTIFICATION_SLIDE_DURATION}ms ease-out`;
            
            setTimeout(() => {
                // Remove from DOM
                if (notification.element.parentNode) {
                    notification.element.remove();
                }
                
                // Remove from state
                STATE.notifications = STATE.notifications.filter(n => n !== notification);
                
                // Emit event
                EventBus.emit('notification:remove', notification);
            }, CONFIG.NOTIFICATION_SLIDE_DURATION);
        },
        
        /**
         * Remove all notifications
         */
        removeAll() {
            STATE.notifications.forEach(notification => {
                this.remove(notification);
            });
        },
        
        /**
         * Shorthand methods
         */
        success(title, message, duration) {
            return this.show('success', title, message, duration);
        },
        
        error(title, message, duration) {
            return this.show('error', title, message, duration);
        },
        
        warning(title, message, duration) {
            return this.show('warning', title, message, duration);
        },
        
        info(title, message, duration) {
            return this.show('info', title, message, duration);
        }
    };

    /* ============================================
       MODAL SYSTEM
       Advanced modal management
       ============================================ */

    const ModalSystem = {
        // Active modals
        activeModals: [],
        
        /**
         * Initialize modal system
         */
        init() {
            Utils.log.info('Initializing modal system');
            
            const modals = Utils.$$('.modal');
            const triggers = Utils.$$('[data-modal-target]');
            
            this.bindEvents(modals, triggers);
        },
        
        /**
         * Bind event listeners
         * @param {Array} modals - Modal elements
         * @param {Array} triggers - Trigger elements
         */
        bindEvents(modals, triggers) {
            // Open modal triggers
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modalId = trigger.dataset.modalTarget;
                    this.open(modalId);
                });
            });
            
            // Close buttons
            const closeButtons = Utils.$$('[data-close-modal]');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.closeTop();
                });
            });
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.activeModals.length > 0) {
                    this.closeTop();
                }
            });
            
            // Close on backdrop click
            modals.forEach(modal => {
                const backdrop = modal.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.addEventListener('click', () => {
                        this.close(modal.id);
                    });
                }
            });
        },
        
        /**
         * Open modal
         * @param {String} modalId - Modal ID
         */
        open(modalId) {
            const modal = Utils.$(`#${modalId}`);
            
            if (!modal) {
                Utils.log.warn(`Modal not found: ${modalId}`);
                return;
            }
            
            // Add to active modals
            this.activeModals.push(modal);
            
            // Show modal
            Utils.addClass(modal, 'active');
            document.body.style.overflow = 'hidden';
            
            // Set focus to modal
            modal.setAttribute('tabindex', '-1');
            modal.focus();
            
            // Trap focus
            this.trapFocus(modal);
            
            // Emit event
            EventBus.emit('modal:open', { id: modalId, modal });
            
            Utils.log.info(`Modal opened: ${modalId}`);
        },
        
        /**
         * Close modal
         * @param {String} modalId - Modal ID
         */
        close(modalId) {
            const modal = Utils.$(`#${modalId}`);
            
            if (!modal) return;
            
            // Remove from active modals
            this.activeModals = this.activeModals.filter(m => m !== modal);
            
            // Hide modal
            Utils.removeClass(modal, 'active');
            
            // Restore scrolling if no modals are open
            if (this.activeModals.length === 0) {
                document.body.style.overflow = 'auto';
            }
            
            // Emit event
            EventBus.emit('modal:close', { id: modalId, modal });
            
            Utils.log.info(`Modal closed: ${modalId}`);
        },
        
        /**
         * Close top modal
         */
        closeTop() {
            if (this.activeModals.length === 0) return;
            
            const topModal = this.activeModals[this.activeModals.length - 1];
            this.close(topModal.id);
        },
        
        /**
         * Close all modals
         */
        closeAll() {
            [...this.activeModals].forEach(modal => {
                this.close(modal.id);
            });
        },
        
        /**
         * Trap focus within modal
         * @param {Element} modal - Modal element
         */
        trapFocus(modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            const handleTabKey = (e) => {
                if (e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };
            
            modal.addEventListener('keydown', handleTabKey);
        }
    };

    /* ============================================
       THEME TOGGLE
       Light/Dark mode switching
       ============================================ */

    const ThemeToggle = {
        // Elements
        button: null,
        icon: null,
        
        // Icons
        icons: {
            sun: `<circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,
            
            moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`
        },
        
        /**
         * Initialize theme toggle
         */
        init() {
            Utils.log.info('Initializing theme toggle');
            
            this.button = Utils.$('#themeToggle');
            this.icon = Utils.$('#themeIcon');
            
            if (!this.button) {
                Utils.log.warn('Theme toggle button not found');
                return;
            }
            
            // Load saved theme
            const savedTheme = Utils.storage.get(CONFIG.STORAGE_KEYS.theme, CONFIG.DEFAULT_THEME);
            this.setTheme(savedTheme, false);
            
            this.bindEvents();
        },
        
        /**
         * Bind event listeners
         */
        bindEvents() {
            this.button.addEventListener('click', () => {
                this.toggle();
            });
            
            // Listen for system theme changes
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                
                mediaQuery.addEventListener('change', (e) => {
                    Utils.log.info('System theme changed:', e.matches ? 'dark' : 'light');
                    EventBus.emit('theme:system-change', e.matches ? 'dark' : 'light');
                });
            }
        },
        
        /**
         * Toggle theme
         */
        toggle() {
            const currentTheme = STATE.isDarkMode ? 'light' : 'dark';
            this.setTheme(currentTheme);
        },
        
        /**
         * Set theme
         * @param {String} theme - Theme name (light or dark)
         * @param {Boolean} animate - Whether to animate transition
         */
        setTheme(theme, animate = true) {
            STATE.isDarkMode = theme === 'dark';
            
            // Add transition class
            if (animate) {
                Utils.addClass(document.documentElement, 'theme-transition');
            }
            
            // Set theme
            document.documentElement.setAttribute('data-theme', theme);
            
            // Update icon
            this.updateIcon(theme);
            
            // Save preference
            Utils.storage.set(CONFIG.STORAGE_KEYS.theme, theme);
            
            // Remove transition class
            if (animate) {
                setTimeout(() => {
                    Utils.removeClass(document.documentElement, 'theme-transition');
                }, CONFIG.THEME_TRANSITION_DURATION);
            }
            
            // Emit event
            EventBus.emit('theme:change', theme);
            
            Utils.log.info(`Theme changed to: ${theme}`);
        },
        
        /**
         * Update theme icon
         * @param {String} theme - Current theme
         */
        updateIcon(theme) {
            if (!this.icon) return;
            
            const iconSVG = theme === 'dark' ? this.icons.moon : this.icons.sun;
            this.icon.innerHTML = iconSVG;
        }
    };

    /* ============================================
       PERFORMANCE MONITOR
       Track and log performance metrics
       ============================================ */

    const PerformanceMonitor = {
        // Metrics
        metrics: {
            fps: [],
            memory: [],
            loadTime: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            domContentLoaded: 0,
            windowLoad: 0
        },
        
        // FPS counter
        fpsInterval: null,
        lastFrameTime: 0,
        frameCount: 0,
        
        /**
         * Initialize performance monitoring
         */
        init() {
            if (!CONFIG.DEBUG_MODE) return;
            
            Utils.log.info('Initializing performance monitor');
            
            this.trackPageLoad();
            this.trackFPS();
            this.trackMemory();
            
            // Log metrics on page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.logMetrics();
                }, 1000);
            });
        },
        
        /**
         * Track page load metrics
         */
        trackPageLoad() {
            if (!('performance' in window)) return;
            
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                
                this.metrics.loadTime = perfData.loadEventEnd - perfData.navigationStart;
                this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                this.metrics.windowLoad = perfData.loadEventEnd - perfData.navigationStart;
                
                // Paint timing
                if (performance.getEntriesByType) {
                    const paintEntries = performance.getEntriesByType('paint');
                    
                    paintEntries.forEach(entry => {
                        if (entry.name === 'first-paint') {
                            this.metrics.firstPaint = entry.startTime;
                        } else if (entry.name === 'first-contentful-paint') {
                            this.metrics.firstContentfulPaint = entry.startTime;
                        }
                    });
                }
            });
        },
        
        /**
         * Track FPS
         */
        trackFPS() {
            let lastTime = performance.now();
            let frames = 0;
            
            const measureFPS = (currentTime) => {
                frames++;
                
                if (currentTime >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                    this.metrics.fps.push(fps);
                    
                    // Keep only last 10 measurements
                    if (this.metrics.fps.length > 10) {
                        this.metrics.fps.shift();
                    }
                    
                    frames = 0;
                    lastTime = currentTime;
                    
                    STATE.performance.fps = fps;
                }
                
                requestAnimationFrame(measureFPS);
            };
            
            requestAnimationFrame(measureFPS);
        },
        
        /**
         * Track memory usage
         */
        trackMemory() {
            if (!('memory' in performance)) return;
            
            setInterval(() => {
                const memory = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize / 1048576,
                    totalJSHeapSize: performance.memory.totalJSHeapSize / 1048576,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / 1048576
                };
                
                this.metrics.memory.push(memory);
                
                // Keep only last 10 measurements
                if (this.metrics.memory.length > 10) {
                    this.metrics.memory.shift();
                }
            }, 5000);
        },
        
        /**
         * Get average FPS
         * @return {Number} Average FPS
         */
        getAverageFPS() {
            if (this.metrics.fps.length === 0) return 0;
            
            const sum = this.metrics.fps.reduce((a, b) => a + b, 0);
            return Math.round(sum / this.metrics.fps.length);
        },
        
        /**
         * Get current memory usage
         * @return {Object} Memory usage
         */
        getCurrentMemory() {
            if (this.metrics.memory.length === 0) return null;
            return this.metrics.memory[this.metrics.memory.length - 1];
        },
        
        /**
         * Log performance metrics
         */
        logMetrics() {
            console.group('⚡ Performance Metrics');
            
            console.log(`%cPage Load Time: ${this.metrics.loadTime}ms`, 'color: #10b981; font-weight: bold;');
            console.log(`First Paint: ${Math.round(this.metrics.firstPaint)}ms`);
            console.log(`First Contentful Paint: ${Math.round(this.metrics.firstContentfulPaint)}ms`);
            console.log(`DOM Content Loaded: ${this.metrics.domContentLoaded}ms`);
            
            if (this.metrics.fps.length > 0) {
                console.log(`%cAverage FPS: ${this.getAverageFPS()}`, 'color: #3b82f6; font-weight: bold;');
            }
            
            const memory = this.getCurrentMemory();
            if (memory) {
                console.log(`%cMemory Usage: ${memory.usedJSHeapSize.toFixed(2)} MB`, 'color: #f59e0b; font-weight: bold;');
            }
            
            console.groupEnd();
        },
        
        /**
         * Mark custom performance event
         * @param {String} name - Event name
         */
        mark(name) {
            if ('performance' in window && performance.mark) {
                performance.mark(name);
            }
        },
        
        /**
         * Measure between two marks
         * @param {String} name - Measure name
         * @param {String} startMark - Start mark name
         * @param {String} endMark - End mark name
         */
        measure(name, startMark, endMark) {
            if ('performance' in window && performance.measure) {
                try {
                    performance.measure(name, startMark, endMark);
                    
                    const measure = performance.getEntriesByName(name)[0];
                    Utils.log.info(`${name}: ${measure.duration.toFixed(2)}ms`);
                } catch (e) {
                    Utils.log.error('Performance measure error:', e);
                }
            }
        }
    };

    /* ============================================
       ACCESSIBILITY
       Accessibility features and enhancements
       ============================================ */

    const Accessibility = {
        /**
         * Initialize accessibility features
         */
        init() {
            Utils.log.info('Initializing accessibility features');
            
            this.setupKeyboardNavigation();
            this.setupFocusIndicators();
            this.setupSkipLink();
            this.setupARIA();
            this.announcePageLoad();
        },
        
        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            // Add keyboard support to custom interactive elements
            const interactiveElements = Utils.$$('[role="button"]:not(button)');
            
            interactiveElements.forEach(element => {
                // Make focusable
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
                
                // Add keyboard event listeners
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
            });
            
            Utils.log.info('Keyboard navigation configured');
        },
        
        /**
         * Setup focus indicators
         */
        setupFocusIndicators() {
            // Track keyboard usage
            let isKeyboardUser = false;
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    isKeyboardUser = true;
                    Utils.addClass(document.body, 'keyboard-nav');
                }
            });
            
            document.addEventListener('mousedown', () => {
                isKeyboardUser = false;
                Utils.removeClass(document.body, 'keyboard-nav');
            });
            
            Utils.log.info('Focus indicators configured');
        },
        
        /**
         * Setup skip to content link
         */
        setupSkipLink() {
            const skipLink = Utils.$('.skip-link');
            
            if (!skipLink) return;
            
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                const mainContent = Utils.$('#main-content');
                
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            Utils.log.info('Skip link configured');
        },
        
        /**
         * Setup ARIA attributes
         */
        setupARIA() {
            // Add aria-current to active nav links
            EventBus.on('nav:update', (activeLink) => {
                Utils.$$('.nav-link').forEach(link => {
                    link.removeAttribute('aria-current');
                });
                activeLink.setAttribute('aria-current', 'page');
            });
            
            // Add live region for notifications
            const notificationContainer = Utils.$('#notificationContainer');
            if (notificationContainer) {
                notificationContainer.setAttribute('role', 'status');
                notificationContainer.setAttribute('aria-live', 'polite');
                notificationContainer.setAttribute('aria-atomic', 'true');
            }
            
            Utils.log.info('ARIA attributes configured');
        },
        
        /**
         * Announce page load to screen readers
         */
        announcePageLoad() {
            const announcer = Utils.createElement('div', {
                className: 'sr-only',
                role: 'status',
                'aria-live': 'polite',
                textContent: 'Page loaded successfully'
            });
            
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                announcer.remove();
            }, 1000);
        },
        
        /**
         * Announce dynamic content change
         * @param {String} message - Message to announce
         */
        announce(message) {
            const announcer = Utils.createElement('div', {
                className: 'sr-only',
                role: 'status',
                'aria-live': 'polite',
                textContent: message
            });
            
            document.body.appendChild(announcer);
            
            setTimeout(() => {
                announcer.remove();
            }, 1000);
        }
    };

    /* ============================================
       ERROR HANDLING
       Global error boundary and logging
       ============================================ */

    const ErrorHandler = {
        // Error log
        errors: [],
        
        /**
         * Initialize error handler
         */
        init() {
            Utils.log.info('Initializing error handler');
            
            // Global error handler
            window.addEventListener('error', (event) => {
                this.handleError(event.error, 'Global Error');
            });
            
            // Unhandled promise rejection
            window.addEventListener('unhandledrejection', (event) => {
                this.handleError(event.reason, 'Unhandled Promise Rejection');
            });
        },
        
        /**
         * Handle error
         * @param {Error} error - Error object
         * @param {String} context - Error context
         */
        handleError(error, context = 'Error') {
            const errorObj = {
                message: error?.message || 'Unknown error',
                stack: error?.stack || '',
                context: context,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            this.errors.push(errorObj);
            
            // Log error
            Utils.log.error(`${context}:`, error);
            
            // Emit event
            EventBus.emit('error', errorObj);
            
            // Show user-friendly message in production
            if (!CONFIG.DEBUG_MODE) {
                Notifications.show(
                    'error',
                    'Something went wrong',
                    'An unexpected error occurred. Please try again.'
                );
            }
        },
        
        /**
         * Get error log
         * @return {Array} Error log
         */
        getErrors() {
            return this.errors;
        },
        
        /**
         * Clear error log
         */
        clearErrors() {
            this.errors = [];
        }
    };

    /* ============================================
       ANALYTICS
       Custom analytics and tracking (placeholder)
       ============================================ */

    const Analytics = {
        /**
         * Initialize analytics
         */
        init() {
            Utils.log.info('Initializing analytics');
            
            this.trackPageView();
            this.trackEvents();
            this.trackPerformance();
        },
        
        /**
         * Track page view
         */
        trackPageView() {
            const pageData = {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer,
                timestamp: new Date().toISOString()
            };
            
            this.track('pageview', pageData);
        },
        
        /**
         * Track custom events
         */
        trackEvents() {
            // Track navigation
            EventBus.on('scroll', (data) => {
                // Track scroll depth
            });
            
            // Track form submissions
            EventBus.on('form:success', (data) => {
                this.track('form_submission', { form: 'contact' });
            });
            
            // Track modal opens
            EventBus.on('modal:open', (data) => {
                this.track('modal_open', { modalId: data.id });
            });
            
            // Track theme changes
            EventBus.on('theme:change', (theme) => {
                this.track('theme_change', { theme });
            });
        },
        
        /**
         * Track performance metrics
         */
        trackPerformance() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    
                    this.track('performance', {
                        loadTime: perfData.loadEventEnd - perfData.navigationStart,
                        domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart
                    });
                }, 1000);
            });
        },
        
        /**
         * Track custom event
         * @param {String} eventName - Event name
         * @param {Object} data - Event data
         */
        track(eventName, data = {}) {
            // In production, send to analytics service
            Utils.log.debug('Analytics:', eventName, data);
            
            // Example: Send to Google Analytics
            // if (window.gtag) {
            //     gtag('event', eventName, data);
            // }
        }
    };

    /* ============================================
       VISIT COUNTER
       Track and display visit count
       ============================================ */

    const VisitCounter = {
        /**
         * Initialize visit counter
         */
        init() {
            if (!STATE.features.localStorage) return;
            
            const visitCount = this.getVisitCount();
            this.incrementVisitCount();
            
            Utils.log.info(`Visit count: ${visitCount}`);
            
            // Display welcome message for first visit
            if (visitCount === 1) {
                setTimeout(() => {
                    Notifications.show(
                        'info',
                        'Welcome!',
                        'Thanks for visiting my portfolio. Feel free to explore!',
                        8000
                    );
                }, 3000);
            }
        },
        
        /**
         * Get visit count
         * @return {Number} Visit count
         */
        getVisitCount() {
            return Utils.storage.get(CONFIG.STORAGE_KEYS.visitCount, 0);
        },
        
        /**
         * Increment visit count
         */
        incrementVisitCount() {
            const count = this.getVisitCount();
            Utils.storage.set(CONFIG.STORAGE_KEYS.visitCount, count + 1);
        }
    };

    /* ============================================
       LAZY LOADING
       Lazy load images and content
       ============================================ */

    const LazyLoader = {
        /**
         * Initialize lazy loading
         */
        init() {
            Utils.log.info('Initializing lazy loader');
            
            const images = Utils.$$('img[data-src]');
            
            if (!images.length) return;
            
            if (STATE.features.intersectionObserver) {
                this.observeImages(images);
            } else {
                this.loadAllImages(images);
            }
        },
        
        /**
         * Observe images with Intersection Observer
         * @param {Array} images - Image elements
         */
        observeImages(images) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => observer.observe(img));
            
            STATE.observers.intersection.push(observer);
        },
        
        /**
         * Load single image
         * @param {Element} img - Image element
         */
        loadImage(img) {
            const src = img.dataset.src;
            
            if (!src) return;
            
            img.src = src;
            img.removeAttribute('data-src');
            
            img.addEventListener('load', () => {
                Utils.addClass(img, 'loaded');
            });
        },
        
        /**
         * Load all images (fallback)
         * @param {Array} images - Image elements
         */
        loadAllImages(images) {
            images.forEach(img => this.loadImage(img));
        }
    };

    /* ============================================
       APPLICATION INITIALIZATION
       Main app controller
       ============================================ */

    const App = {
        /**
         * Initialize application
         */
        async init() {
            try {
                Utils.log.info(`${CONFIG.APP_NAME} v${CONFIG.VERSION} - Initializing`);
                
                // Mark performance
                PerformanceMonitor.mark('app-init-start');
                
                // Feature detection
                FeatureDetection.init();
                
                // Core initialization
                ErrorHandler.init();
                PerformanceMonitor.init();
                
                // UI components
                LoadingScreen.init();
                CustomCursor.init();
                Navigation.init();
                ThemeToggle.init();
                
                // Content components
                FormHandler.init();
                Notifications.init();
                ModalSystem.init();
                StatsCounter.init();
                
                // Accessibility
                Accessibility.init();
                
                // Additional features
                Analytics.init();
                VisitCounter.init();
                LazyLoader.init();
                
                // Mark end
                PerformanceMonitor.mark('app-init-end');
                PerformanceMonitor.measure('app-init', 'app-init-start', 'app-init-end');
                
                // Set initialized state
                STATE.isInitialized = true;
                
                // Emit ready event
                EventBus.emit('app:ready');
                
                // Success message
                Utils.log.success(`${CONFIG.APP_NAME} initialized successfully!`);
                
                this.logInfo();
                
            } catch (error) {
                Utils.log.error('Application initialization failed:', error);
                ErrorHandler.handleError(error, 'App Initialization');
            }
        },
        
        /**
         * Log application info
         */
        logInfo() {
            if (!CONFIG.DEBUG_MODE) return;
            
            console.log(
                `%c
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║         🎨 KASHISH PORTFOLIO 🎨          ║
    ║                                           ║
    ║          Built with ❤️ and ☕            ║
    ║                                           ║
    ║         Version: ${CONFIG.VERSION}              ║
    ║         Author: Kashish                   ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
                `,
                'color: #a89cc0; font-family: monospace; font-size: 12px;'
            );
            
            console.log('%cFeatures:', 'color: #9aa3d6; font-size: 14px; font-weight: bold;');
            console.table(STATE.features);
        },
        
        /**
         * Destroy application
         */
        destroy() {
            Utils.log.info('Destroying application');
            
            // Cancel animation frames
            Object.values(STATE.animationFrames).forEach(frame => {
                if (frame) cancelAnimationFrame(frame);
            });
            
            // Disconnect observers
            STATE.observers.intersection.forEach(observer => {
                if (observer) observer.disconnect();
            });
            
            STATE.observers.mutation.forEach(observer => {
                if (observer) observer.disconnect();
            });
            
            // Clear event bus
            EventBus.clear();
            
            // Clear timers
            Object.values(STATE.timers.debounce).forEach(timer => clearTimeout(timer));
            Object.values(STATE.timers.throttle).forEach(timer => clearTimeout(timer));
            Object.values(STATE.timers.animation).forEach(timer => clearTimeout(timer));
            
            STATE.isInitialized = false;
            
            Utils.log.info('Application destroyed');
        }
    };

    /* ============================================
       EXPOSE PUBLIC API
       ============================================ */

    window.Portfolio = {
        // Application
        init: () => App.init(),
        destroy: () => App.destroy(),
        
        // State
        getState: () => Utils.deepClone(STATE),
        
        // Utilities
        utils: Utils,
        
        // Event system
        on: (event, callback) => EventBus.on(event, callback),
        off: (event, callback) => EventBus.off(event, callback),
        emit: (event, data) => EventBus.emit(event, data),
        
        // Components
        notifications: Notifications,
        modal: ModalSystem,
        theme: ThemeToggle,
        
        // Performance
        performance: PerformanceMonitor,
        
        // Analytics
        track: (event, data) => Analytics.track(event, data)
    };

    /* ============================================
       AUTO-INITIALIZATION
       Start application when DOM is ready
       ============================================ */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            App.init();
        });
    } else {
        // DOM already loaded
        App.init();
    }

    /* ============================================
       CLEANUP ON PAGE UNLOAD
       ============================================ */

    window.addEventListener('beforeunload', () => {
        App.destroy();
    });

})(window, document);

/**
 * ============================================
 * END OF SCRIPT
 * ============================================
 */
