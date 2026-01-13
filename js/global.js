document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" });

        sections.forEach(section => navObserver.observe(section));
    }

    // Smart Sticky Header & Back To Top
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.main-header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Header Logic
        if (header) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        }

        // Back To Top Logic
        if (backToTopBtn) {
            if (currentScrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // Back To Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Custom Cursor Logic
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (animation handled in CSS)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .project-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
            cursorDot.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });

    // Image Skeleton Loader Logic
    const skeletonImages = document.querySelectorAll('.skeleton-img');

    skeletonImages.forEach(img => {
        // If image is already loaded (cached)
        if (img.complete) {
            img.classList.remove('skeleton');
            img.classList.add('loaded');
        } else {
            // Otherwise wait for load
            img.addEventListener('load', () => {
                img.classList.remove('skeleton');
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                // Remove skeleton even on error so it doesn't shimmer forever
                img.classList.remove('skeleton');
            });
        }
    });

    // 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.project-card, .service-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            // Center is (0,0), Top-Left is (-X, +Y), Bottom-Right is (+X, -Y)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Spotlight Effect: Set CSS variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Reset transformation
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.setProperty('--mouse-x', '-9999px'); // Hide spotlight
            card.style.setProperty('--mouse-y', '-9999px');
        });

        // Add transition for smooth reset (optional, can be done in CSS)
        card.style.transition = 'transform 0.1s ease-out';
    });
    // Note: We might need to handle the conflict with hover effects in CSS if they use transform.
    // The inline style set by JS will override simple CSS transforms, but transitions should be careful.
});

// Seamless Page Transitions 
// 1. Fade in on load
// Timeout ensures the transition triggers even if browser renders fast
setTimeout(() => {
    document.body.classList.add('loaded');
}, 50);

// 2. Intercept links for Fade Out
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = this.getAttribute('target');

        // Allow filtered project links (href="#") or new tab links
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
            return;
        }

        e.preventDefault();
        document.body.classList.remove('loaded');

        setTimeout(() => {
            window.location.href = href;
        }, 400); // Match CSS transition duration
    });
});

// 3. Fix for Back Button (bfcache)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        document.body.classList.add('loaded');
    }
});




