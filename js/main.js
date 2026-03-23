document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('header--scrolled');
        }
    });

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Handle Dropdown on Mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('dropdown--open');
                
                const menu = parent.querySelector('.dropdown-menu');
                if (parent.classList.contains('dropdown--open')) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                    menu.style.position = 'static';
                } else {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(1rem)';
                    menu.style.position = 'absolute';
                }
            }
        });
    });

    // Mouse Parallax for Hero and Feature Search
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        // Hero Cards
        const heroCards = document.querySelectorAll('.hero .glass-card');
        heroCards.forEach((card, index) => {
            const speed = (index + 1) * 0.5;
            card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });

        // Feature Search Floating Elements
        const floatingElements = document.querySelectorAll('.feature-search .floating-icon, .feature-search .floating-card');
        floatingElements.forEach((el, index) => {
            const speed = (index + 1) * 0.8;
            el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });

        // Course detail interactivity has been simplified.
    });

    // Header Scroll Effect - Handled above in DOMContentLoaded

    // Intersection Observer for Reveal Animations
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // Modal Logic
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const modalClose = document.getElementById('modal-close');
    const modalTabs = document.querySelectorAll('.modal__tab');
    const modalForms = document.querySelectorAll('.modal__form');

    const openModal = (tab = 'login') => {
        if (!authModal) return;
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchTab(tab);
    };

    const closeModal = () => {
        if (!authModal) return;
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const switchTab = (tabId) => {
        modalTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        modalForms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabId}-form`);
        });
    };

    const loginBtnMobile = document.getElementById('login-btn-mobile');
    const signupBtnMobile = document.getElementById('signup-btn-mobile');

    if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal('signup'));
    
    const closeMobileMenu = () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    };

    if (loginBtnMobile) loginBtnMobile.addEventListener('click', () => {
        closeMobileMenu();
        openModal('login');
    });
    if (signupBtnMobile) signupBtnMobile.addEventListener('click', () => {
        closeMobileMenu();
        openModal('signup');
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);

    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Course Filtering Logic
    const filterBtns = document.querySelectorAll('.courses__filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active state of buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards with animation
            courseCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Trigger reflow for animation
                    void card.offsetWidth;
                    card.classList.add('fade-in');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('fade-in');
                }
            });
        });
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats');
    const counters = document.querySelectorAll('.stat-card__number');
    const animationDuration = 2000; // 2 seconds

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const step = target / (animationDuration / 16); // 60fps
            let count = 0;

            const updateCount = () => {
                count += step;
                if (count < target) {
                    counter.innerText = Math.ceil(count).toLocaleString() + (target > 1000 ? '+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString() + (target > 1000 ? '+' : '');
                }
            };

            updateCount();
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    // Testimonials Carousel
    const slides = document.querySelectorAll('.testimonials__slide');
    const nextBtns = document.querySelectorAll('.testimonials__btn--next');
    const prevBtns = document.querySelectorAll('.testimonials__btn--prev');
    let currentSlide = 0;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => showSlide(currentSlide + 1));
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => showSlide(currentSlide - 1));
    });

    // Optional: Auto-rotation
    let autoRotate = setInterval(() => showSlide(currentSlide + 1), 6000);

    // Reset timer on manual click
    const resetTimer = () => {
        clearInterval(autoRotate);
        autoRotate = setInterval(() => showSlide(currentSlide + 1), 6000);
    };

    [...nextBtns, ...prevBtns].forEach(btn => btn.addEventListener('click', resetTimer));

    // Courses Carousel (Courses Page)
    const courseTrack = document.getElementById('course-track');
    const coursePrev = document.getElementById('course-prev');
    const courseNext = document.getElementById('course-next');

    if (courseTrack && coursePrev && courseNext) {
        let scrollAmount = 0;
        let isMoving = false;
        const gap = 30;
        const cardWidth = courseTrack.querySelector('.course-card').offsetWidth + gap;
        const maxScroll = courseTrack.scrollWidth - courseTrack.parentElement.offsetWidth;

        const moveCarousel = (direction) => {
            if (isMoving) return;
            isMoving = true;

            if (direction === 'next') {
                scrollAmount += cardWidth;
                if (scrollAmount > maxScroll) scrollAmount = 0; // Infinite feel
            } else {
                scrollAmount -= cardWidth;
                if (scrollAmount < 0) scrollAmount = maxScroll;
            }
            
            courseTrack.style.transform = `translateX(-${scrollAmount}px)`;
            
            setTimeout(() => {
                isMoving = false;
            }, 500);
        };

        courseNext.addEventListener('click', () => moveCarousel('next'));
        coursePrev.addEventListener('click', () => moveCarousel('prev'));

        // Auto-play
        let autoPlayInterval = setInterval(() => moveCarousel('next'), 5000);

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => moveCarousel('next'), 5000);
        };

        [courseNext, coursePrev].forEach(btn => btn.addEventListener('click', resetAutoPlay));

        // Responsive adjustment
        window.addEventListener('resize', () => {
            scrollAmount = 0;
            courseTrack.style.transform = `translateX(0)`;
        });
    }

    // Courses Page Filter Accordion
    const filterHeaders = document.querySelectorAll('.filter-group__header');

    filterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const parent = header.parentElement;
            parent.classList.toggle('active');
        });
    });

    // Pagination Interaction
    const paginationBtn = document.querySelectorAll('.pagination__btn:not(.pagination__btn--prev):not(.pagination__btn--next)');
    paginationBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            paginationBtn.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Accordion Toggle Logic
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item?.querySelector('.accordion__body');
            const isActive = item?.classList.contains('active');

            // Close all other items (optional, but usually preferred)
            /*
            document.querySelectorAll('.accordion__item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.accordion__body');
                    if (otherBody) (otherBody as HTMLElement).style.display = 'none';
                }
            });
            */

            if (isActive) {
                item?.classList.remove('active');
                if (body) body.style.display = 'none';
            } else {
                item?.classList.add('active');
                if (body) body.style.display = 'block';
            }
        });
    });
});
