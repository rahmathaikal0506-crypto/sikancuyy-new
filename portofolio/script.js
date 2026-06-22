document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Ambil Elemen-elemen DOM ---
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const floatingDarkModeToggle = document.getElementById('darkModeToggle');

    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const closeModalSpan = document.getElementsByClassName("close")[0];

    // --- 2. Dark Mode ---
    const syncFloatingDarkModeToggleIcon = () => {
        if (floatingDarkModeToggle) {
            floatingDarkModeToggle.innerHTML = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        }
    };

    const initializeTheme = () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.className = currentTheme;
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        }
        syncFloatingDarkModeToggleIcon();
    };

    initializeTheme();

    if (floatingDarkModeToggle) {
        floatingDarkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
            syncFloatingDarkModeToggleIcon();
        });
    }

    // --- 3. Scroll Effect dan Link Aktif ---
    const handleScrollEffects = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        const navbarHeight = navbar.clientHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    window.addEventListener('resize', handleScrollEffects);
    handleScrollEffects();

    // --- 4. Restart Animasi Section ---
    function restartAnimations(section) {
        const animatedChildren = section.querySelectorAll(
            '.fade-in, .fade-in-up, .slide-in-right, .slide-in-left'
        );

        animatedChildren.forEach(el => {
            el.classList.remove('fade-in', 'fade-in-up', 'slide-in-right', 'slide-in-left');
            void el.offsetWidth;
            if (el.classList.contains('animate-slide-in-right')) {
                el.classList.add('slide-in-right');
            } else if (el.classList.contains('animate-slide-in-left')) {
                el.classList.add('slide-in-left');
            } else if (el.classList.contains('animate-fade-in-up')) {
                el.classList.add('fade-in-up');
            } else {
                el.classList.add('fade-in');
            }
        });
    }

    // --- 5. Smooth Scroll + Trigger Ulang Animasi ---
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbar.clientHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('no-scroll');
                }

                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                setTimeout(() => {
                    restartAnimations(targetSection);
                }, 600); // Durasi scroll
            }
        });
    });

    // --- 6. Hamburger Mobile Menu ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- 7. Intersection Observer Animations ---
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item'
    );

    const appearOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('animate-slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('animate-slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('animate-fade-in-up')) {
                    entry.target.classList.add('fade-in-up');
                }
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animatedElements.forEach(el => {
        appearOnScrollObserver.observe(el);
    });

    // --- 8. Modal Galeri Gambar ---
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            modal.style.display = "flex";
            modalImg.src = this.getAttribute('data-src');
            captionText.innerHTML = this.getAttribute('data-caption');
            body.classList.add('no-scroll');
        });
    });

    if (closeModalSpan) {
        closeModalSpan.addEventListener('click', () => {
            modal.style.display = "none";
            body.classList.remove('no-scroll');
        });
    }

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            body.classList.remove('no-scroll');
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
            body.classList.remove('no-scroll');
        }
    });
});

// --- 9. Scroll Animasi Delay (Stagger) ---
document.addEventListener('DOMContentLoaded', () => {
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.section-title, .about-content p, .contact-intro, .contact-info, .signature, .social-card, .skill-card, .gallery-item, .timeline-item, .education-item'
        );

        elements.forEach((element, index) => {
            if (isInViewport(element)) {
                element.classList.add('fade-in-up');
                if (
                    element.classList.contains('social-card') ||
                    element.classList.contains('skill-card') ||
                    element.classList.contains('gallery-item')
                ) {
                    element.style.transitionDelay = `${(index % 3) * 0.15}s`;
                }
            }
        });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});
document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Tambahkan elemen yang akan dianimasikan
    document.querySelectorAll(
      ".section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature"
    ).forEach((el) => observer.observe(el));
  });