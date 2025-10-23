// KUKA Consult - JavaScript Professionnel
document.addEventListener('DOMContentLoaded', function() {

    // Éléments du DOM
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const header = document.querySelector('.header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const themeToggleBtn = document.getElementById('themeToggle');

    // Menu mobile simple et efficace
    function initMobileMenu() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                const isActive = this.classList.contains('active');

                this.classList.toggle('active');
                navMenu.classList.toggle('active');

                // Accessibilité
                this.setAttribute('aria-expanded', !isActive);
            });

            // Fermer le menu sur clic de lien
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Fermer si clic extérieur
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Page active dans la navigation
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.classList.remove('active');

            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Validation formulaire simple
    function initFormValidation() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // Validation simple
            let isValid = true;

            if (!name.value.trim()) {
                showFieldError(name, 'Le nom est obligatoire');
                isValid = false;
            } else {
                clearFieldError(name);
            }

            if (!email.value.trim() || !isValidEmail(email.value)) {
                showFieldError(email, 'Email valide obligatoire');
                isValid = false;
            } else {
                clearFieldError(email);
            }

            if (!message.value.trim()) {
                showFieldError(message, 'Le message est obligatoire');
                isValid = false;
            } else {
                clearFieldError(message);
            }

            if (isValid) {
                submitForm();
            }
        });

        // Validation temps réel
        const fields = [
            document.getElementById('name'),
            document.getElementById('email'),
            document.getElementById('message')
        ].filter(Boolean);

        fields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.value.trim()) {
                    clearFieldError(this);
                }
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(field, message) {
        clearFieldError(field);

        field.style.borderColor = '#dc2626';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #dc2626; font-size: 14px; margin-top: 4px;';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.style.borderColor = '';

        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function submitForm() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';

        // Simulation envoi (2 secondes)
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            showSuccessMessage();
            contactForm.reset();
        }, 2000);
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            background: #f0f9ff;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            padding: 16px;
            border-radius: 6px;
            margin-top: 16px;
            text-align: center;
        `;
        successDiv.innerHTML = '✅ Message envoyé avec succès !';

        contactForm.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Header avec ombre subtile au scroll
    function initHeaderEffect() {
        if (!header) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Masquer le header et le bouton thème en scroll descendant, les afficher en scroll montant
    function initHideHeaderOnScroll() {
        const headerEl = header || document.querySelector('.header');
        const themeBtn = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
        if (!headerEl) return;
        let lastY = window.scrollY;
        let ticking = false;
        const threshold = 20;
        const handle = () => {
            const y = window.scrollY;
            if (y <= 10) {
                headerEl.classList.remove('header--hidden');
                if (themeBtn) themeBtn.classList.remove('theme-toggle--hidden');
                lastY = y;
                ticking = false;
                return;
            }
            if (y - lastY > threshold) {
                headerEl.classList.add('header--hidden');
                if (themeBtn) themeBtn.classList.add('theme-toggle--hidden');
            } else if (lastY - y > threshold) {
                headerEl.classList.remove('header--hidden');
                if (themeBtn) themeBtn.classList.remove('theme-toggle--hidden');
            }
            lastY = y;
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(handle);
            }
        }, { passive: true });
    }

    // Animation fade-in simple pour les cartes
    function initScrollAnimations() {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Gestion redimensionnement
    function initResizeHandler() {
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Bouton haut de page
    function initScrollTop() {
        if (!scrollTopBtn) return;
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        toggleVisibility();
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mode sombre / clair avec persistance + icônes soleil/lune
    function initThemeToggle() {
        const root = document.documentElement;
        const btn = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
        if (!btn) return;

        const sunIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="5"></circle>
              <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="1" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="23" />
                <line x1="1" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
              </g>
            </svg>`;
        const moonIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>`;

        const applyIcon = (isDark) => {
            btn.innerHTML = isDark ? moonIcon : sunIcon;
            btn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
            btn.setAttribute('title', isDark ? 'Mode sombre' : 'Mode clair');
        };

        const saved = localStorage.getItem('theme');
        const initialDark = saved === 'dark';
        if (initialDark) root.classList.add('theme-dark');
        applyIcon(initialDark);

        btn.addEventListener('click', () => {
            const isDark = root.classList.toggle('theme-dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyIcon(isDark);
        });
    }

    // Slider témoignages (autoplay, loop, swipe/drag, dots par page)
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        if (!slider) return;
        const track = slider.querySelector('.slider-track');
        const slides = Array.from(slider.querySelectorAll('.slide'));
        const prevBtn = slider.querySelector('.slider-btn[data-dir="prev"]');
        const nextBtn = slider.querySelector('.slider-btn[data-dir="next"]');
        const dotsContainer = slider.querySelector('.slider-dots');

        let index = 0;
        let slidesPerView = 1;
        let autoplayTimer = null;
        let isHover = false;

        const computeSPV = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
        const pagesCount = () => Math.max(1, Math.ceil(slides.length / slidesPerView));
        const maxIndex = () => Math.max(0, slides.length - slidesPerView);

        const updateProgress = () => {
            const progressFill = slider.querySelector('.slider-progress-fill');
            if (!progressFill) return;
            
            const totalPages = pagesCount();
            const currentPage = Math.floor(index / slidesPerView);
            const progressPercent = totalPages > 1 ? ((currentPage + 1) / totalPages) * 100 : 100;
            
            progressFill.style.width = `${progressPercent}%`;
        };

        const update = (animate = false) => {
            slidesPerView = computeSPV();
            const width = slider.clientWidth;
            const slideWidth = width / slidesPerView;

            // loop
            if (index > maxIndex()) index = 0;
            if (index < 0) index = maxIndex();

            track.style.transition = animate ? 'transform 0.5s ease' : 'none';
            track.style.transform = `translateX(-${index * slideWidth}px)`;
            updateProgress();
        };

        const goPages = (delta) => {
            index += delta * slidesPerView;
            update(true);
            restartAutoplay();
        };

        // wheel (desktop)
        slider.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) + Math.abs(e.deltaY) < 5) return;
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) goPages(1);
            else goPages(-1);
        }, { passive: false });

        // swipe / drag
        let isDragging = false, startX = 0, baseX = 0, currentX = 0;
        const getTranslateX = (el) => {
            const transform = getComputedStyle(el).transform;
            if (transform && transform !== 'none') {
                const m = new DOMMatrixReadOnly(transform);
                return m.m41;
            }
            return 0;
        };
        track.style.cursor = 'grab';
        track.addEventListener('pointerdown', (e) => {
            isDragging = true;
            startX = e.clientX;
            baseX = getTranslateX(track);
            track.style.transition = 'none';
            try { track.setPointerCapture(e.pointerId); } catch {}
            track.style.cursor = 'grabbing';
            stopAutoplay();
        });
        track.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            const dx = currentX - startX;
            track.style.transform = `translateX(${baseX + dx}px)`;
        });
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.cursor = 'grab';
            const dx = (currentX || startX) - startX;
            const threshold = slider.clientWidth * 0.15;
            if (dx > threshold) goPages(-1);
            else if (dx < -threshold) goPages(1);
            else update(true);
            restartAutoplay();
        };
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('mouseleave', endDrag);

        // Fallback pour navigateurs sans PointerEvent (touch events)
        if (!window.PointerEvent) {
            track.addEventListener('touchstart', (e) => {
                const t = e.touches[0];
                isDragging = true;
                startX = t.clientX;
                baseX = getTranslateX(track);
                track.style.transition = 'none';
                stopAutoplay();
            }, { passive: true });
            track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const t = e.touches[0];
                currentX = t.clientX;
                const dx = currentX - startX;
                if (Math.abs(dx) > 6) e.preventDefault();
                track.style.transform = `translateX(${baseX + dx}px)`;
            }, { passive: false });
            const endTouch = () => endDrag();
            track.addEventListener('touchend', endTouch, { passive: true });
            track.addEventListener('touchcancel', endTouch, { passive: true });
        }

        // controls
        prevBtn && prevBtn.addEventListener('click', () => goPages(-1));
        nextBtn && nextBtn.addEventListener('click', () => goPages(1));

        // autoplay
        const startAutoplay = () => { if (autoplayTimer) return; autoplayTimer = setInterval(() => goPages(1), 4000); };
        const stopAutoplay = () => { if (!autoplayTimer) return; clearInterval(autoplayTimer); autoplayTimer = null; };
        const restartAutoplay = () => { stopAutoplay(); if (!isHover) startAutoplay(); };
        slider.addEventListener('mouseenter', () => { isHover = true; stopAutoplay(); });
        slider.addEventListener('mouseleave', () => { isHover = false; startAutoplay(); });

        window.addEventListener('resize', () => update());
        update(true);
        startAutoplay();
    }

    // Initialisation
    function init() {
        initMobileMenu();
        setActiveNavigation();
        initFormValidation();
        initHeaderEffect();
        initScrollAnimations();
        initResizeHandler();
        initScrollTop();
        initThemeToggle();
        initTestimonialSlider();

        console.log('✅ KUKA Consult - Version professionnelle initialisée');
    }

    window.addEventListener('DOMContentLoaded', () => {
        try {
            if (typeof initHeaderEffect === 'function') {
                initHeaderEffect();
            }
            initHideHeaderOnScroll();
        } catch (e) {
            console.error('Header init error:', e);
        }
    });
    init();
});