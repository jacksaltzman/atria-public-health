/**
 * Atria Public Health - Main JavaScript
 * Handles animations, interactions, and UI functionality
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const statNumbers = document.querySelectorAll('.stat-number');
    const newsletterForm = document.getElementById('newsletter-form');

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================
    function handleScroll() {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    function toggleNav() {
        nav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    function closeNav() {
        nav.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close nav when clicking outside
    function handleClickOutside(e) {
        if (nav.classList.contains('active') &&
            !nav.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeNav();
        }
    }

    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                closeNav();
            }
        }
    }

    // ============================================
    // ANIMATED COUNTER
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const easeOutQuad = t => t * (2 - t);

        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentCount = Math.round(target * progress);

            if (target >= 1000) {
                element.textContent = currentCount.toLocaleString();
            } else {
                element.textContent = currentCount;
            }

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);
    }

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    function setupIntersectionObserver() {
        // Observer for stat counters
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });

        // Observer for scroll animations
        const animateElements = document.querySelectorAll('.value-card, .program-card, .partner-logo, .stat-card');

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            fadeObserver.observe(el);
        });
    }

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    function handleNewsletterSubmit(e) {
        e.preventDefault();

        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value;

        if (email && isValidEmail(email)) {
            // Show success message
            const formGroup = e.target.querySelector('.form-group');
            const originalContent = formGroup.innerHTML;

            formGroup.innerHTML = `
                <div style="text-align: center; padding: 1rem; color: white;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem;">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p style="font-size: 1.125rem; font-weight: 600;">Thank you for subscribing!</p>
                    <p style="font-size: 0.875rem; opacity: 0.8;">We'll keep you updated on our impact.</p>
                </div>
            `;

            // Reset form after 5 seconds
            setTimeout(() => {
                formGroup.innerHTML = originalContent;
                emailInput.value = '';
            }, 5000);
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    function handleParallax() {
        const hero = document.querySelector('.hero');
        if (hero && window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    function handleKeyboard(e) {
        // Close nav on Escape
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    }

    // ============================================
    // THROTTLE UTILITY
    // ============================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        // Event listeners
        window.addEventListener('scroll', throttle(handleScroll, 10));
        window.addEventListener('scroll', throttle(highlightActiveSection, 100));
        window.addEventListener('scroll', throttle(handleParallax, 10));

        if (navToggle) {
            navToggle.addEventListener('click', toggleNav);
        }

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyboard);

        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }

        // Setup observers
        setupIntersectionObserver();

        // Initial scroll check
        handleScroll();
        highlightActiveSection();

        console.log('Atria Public Health website initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
