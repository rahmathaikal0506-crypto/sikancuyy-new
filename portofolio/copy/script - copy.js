document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Ambil Elemen-elemen DOM yang Dibutuhkan ---
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const floatingDarkModeToggle = document.getElementById('darkModeToggle'); // Tombol dark mode mengambang

    // Elemen Modal Galeri
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const closeModalSpan = document.getElementsByClassName("close")[0];


    // --- 2. Dark Mode Toggle Fungsionalitas ---

    // Fungsi untuk memperbarui ikon tombol dark mode (khusus tombol mengambang)
    const syncFloatingDarkModeToggleIcon = () => {
        if (floatingDarkModeToggle) {
            if (body.classList.contains('dark-mode')) {
                floatingDarkModeToggle.innerHTML = '☀️'; // Sun emoji
            } else {
                floatingDarkModeToggle.innerHTML = '🌙'; // Moon emoji
            }
        }
    };

    // Inisialisasi status tema saat dimuat
    const initializeTheme = () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            body.className = currentTheme; // Terapkan tema yang tersimpan
        } else {
            // Deteksi preferensi sistem jika tidak ada tema tersimpan
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        }
        syncFloatingDarkModeToggleIcon(); // Pastikan ikon tombol mengambang sesuai tema
    };

    // Panggil inisialisasi tema saat DOM siap
    initializeTheme();

    // Event listener untuk tombol dark mode mengambang
    if (floatingDarkModeToggle) {
        floatingDarkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            syncFloatingDarkModeToggleIcon(); // Sinkronkan ikon setelah perubahan tema
        });
    }

    // --- 3. Navbar Efek Scroll dan Link Aktif ---

    const handleScrollEffects = () => {
        // Efek bayangan navbar saat scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Tentukan link navigasi yang aktif berdasarkan posisi scroll
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        const navbarHeight = navbar.clientHeight; // Dapatkan tinggi navbar yang sebenarnya

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight; // Sesuaikan dengan tinggi navbar
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Hapus 'active' dari semua link dan tambahkan ke link yang sesuai
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    window.addEventListener('resize', handleScrollEffects); // Perbarui saat resize
    handleScrollEffects(); // Panggil saat pemuatan awal untuk mengatur link aktif


    // --- 4. Smooth Scroll untuk Link Navigasi ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah perilaku default link
            const targetId = this.getAttribute('href').substring(1); // Ambil ID section
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Hitung offset dengan mempertimbangkan tinggi navbar yang fixed
                const offsetTop = targetSection.offsetTop - navbar.clientHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Tambahkan hash ke URL setelah scroll selesai (opsional)
                // history.pushState(null, '', `#${targetId}`);

                // Tutup menu mobile setelah mengklik link
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }

                // Perbarui kelas aktif segera setelah klik (untuk feedback visual)
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- 5. Hamburger Menu (Mobile Navigation) ---
    if (hamburger && navMenu) { // Pastikan elemen ada sebelum menambahkan listener
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Mencegah scroll body saat menu mobile aktif
            body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
        });

        // Tutup menu nav saat salah satu link diklik (untuk mobile)
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

    // --- 6. Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.section-title, .about-content p, .timeline-item, .education-item, .contact-intro, .contact-info, .signature, .gallery-item');

    const appearOptions = {
        threshold: 0.3, // Persentase elemen yang terlihat untuk memicu animasi
        rootMargin: "0px 0px -100px 0px" // Sesuaikan untuk memicu lebih awal/akhir
    };

    const appearOnScrollObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // Memicu transisi CSS opacity/transform

                // Tambahkan kelas animasi spesifik jika ada
                if (entry.target.classList.contains('animate-slide-in-right')) {
                    entry.target.classList.add('slide-in-right');
                } else if (entry.target.classList.contains('animate-slide-in-left')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('animate-fade-in-up')) {
                    // Jika menggunakan keyframes, pastikan properti awal diatur di CSS
                    // dan keyframes akan berjalan otomatis saat kelas ditambahkan.
                    // Jika 'opacity: 1' diset di JS, itu akan menimpa animasi CSS.
                    // Sebaiknya biarkan CSS mengatur opacity awal dan akhir.
                }

                observer.unobserve(entry.target); // Berhenti mengamati setelah animasi dipicu
            }
        });
    }, appearOptions);

    animatedElements.forEach(el => {
        appearOnScrollObserver.observe(el);
    });

    // --- 7. Modal Image Gallery Fungsionalitas ---

    // Saat item galeri diklik
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "flex"; // Tampilkan modal sebagai flexbox untuk centering
            modalImg.src = this.getAttribute('data-src'); // Atur sumber gambar modal
            captionText.innerHTML = this.getAttribute('data-caption'); // Atur teks keterangan
            body.classList.add('no-scroll'); // Mencegah scroll body saat modal terbuka
        });
    });

    // Saat tombol tutup diklik
    if (closeModalSpan) {
        closeModalSpan.addEventListener('click', () => {
            modal.style.display = "none";
            body.classList.remove('no-scroll'); // Aktifkan kembali scroll body
        });
    }


    // Saat area di luar gambar modal diklik (untuk menutup modal)
    modal.addEventListener('click', function(event) {
        // Pastikan klik terjadi pada latar belakang modal, bukan pada gambar atau caption
        if (event.target === modal) {
            modal.style.display = "none";
            body.classList.remove('no-scroll'); // Aktifkan kembali scroll body
        }
    });

    // Menutup modal dengan tombol Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
            body.classList.remove('no-scroll'); // Aktifkan kembali scroll body
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk memeriksa apakah elemen ada di viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 && // Tambahkan offset 100px
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Fungsi untuk menangani animasi scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(
            '.section-title, .about-content p, .contact-intro, .contact-info, .signature, .social-card, .skill-card, .gallery-item, .timeline-item, .education-item'
        );

        elements.forEach((element, index) => {
            if (isInViewport(element)) {
                // Tambahkan kelas animasi saat elemen terlihat
                element.classList.add('fade-in-up');
                
                // Jika ini adalah kartu grid, tambahkan delay berdasarkan indeks untuk efek stagger
                if (element.classList.contains('social-card') || 
                    element.classList.contains('skill-card') || 
                    element.classList.contains('gallery-item')) {
                    element.style.transitionDelay = `${(index % 3) * 0.15}s`;
                }
            }
        });
    };

    // Jalankan saat halaman dimuat dan saat di-scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});