document.addEventListener('DOMContentLoaded', function () {
    // --- Variables globales ---
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('main section, footer.section');
    const scrollTopButton = document.querySelector('.scroll-top');
    const skillItems = document.querySelectorAll('.skill-item');
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const carousel = document.querySelector('.carousel-items');

    // Modal
    const modal = document.getElementById('artworkModal');
    const closeModalButton = document.querySelector('.close-button');
    const artworkItems = document.querySelectorAll('.card[data-artwork-id]');

    // --- Datos de las obras ---
    // Este objeto simula una base de datos para las obras de arte.
    const artworkData = {
        obra1: { title: "Nombre Escultura 1", description: "Breve leyenda de la obra 1.", materials: "Bronce, acero inoxidable.", technique: "Fundición a la cera perdida.", history: "Esta obra fue inspirada por la dualidad del hombre y la naturaleza, buscando capturar la esencia de la forma humana.", price: "Consultar", images: ["https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+1+Obra+1", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+2+Obra+1", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+3+Obra+1"] },
        obra2: { title: "Nombre Escultura 2", description: "Breve leyenda de la obra 2.", materials: "Mármol carrara.", technique: "Tallado clásico.", history: "Una exploración de la forma pura, donde la luz y la sombra juegan un papel fundamental para definir la textura y el volumen.", price: "$ 1,500 USD", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra3: { title: "Nombre Escultura 3", description: "Breve leyenda de la obra 3.", materials: "Madera de roble.", technique: "Tallado y ensamblaje.", history: "Historia detallada de la inspiración, proceso y significado de la obra 3.", price: "Consultar", images: ["https://images.unsplash.com/photo-1578307767673-15a2acd2d45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"] },
        obra4: { title: "Nombre Escultura 4", description: "Breve leyenda de la obra 4.", materials: "Acero corten.", technique: "Soldadura y oxidación controlada.", history: "Historia detallada de la inspiración, proceso y significado de la obra 4.", price: "Consultar", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+2+Obra+4"] },
        obra6: { title: "Título Obra 1 (Galería)", description: "Breve introducción de esta escultura.", materials: "Materiales de la obra 6.", technique: "Técnica de la obra 6.", history: "Historia detallada de la inspiración, proceso y significado de la obra 6.", price: "Consultar", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra7: { title: "Título Obra 2 (Galería)", description: "Una pieza que explora el movimiento.", materials: "Materiales de la obra 7.", technique: "Técnica de la obra 7.", history: "Historia detallada de la inspiración, proceso y significado de la obra 7.", price: "Consultar", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"] },
        obra8: { title: "Título Obra 3 (Galería)", description: "Materiales innovadores y forma orgánica.", materials: "Materiales de la obra 8.", technique: "Técnica de la obra 8.", history: "Historia detallada de la inspiración, proceso y significado de la obra 8.", price: "Consultar", images: ["https://images.unsplash.com/photo-1578307767673-15a2acd2d45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"] },
        obra9: { title: "Título Obra 4 (Galería)", description: "Un viaje a través de la historia.", materials: "Materiales de la obra 9.", technique: "Técnica de la obra 9.", history: "Historia detallada de la inspiración, proceso y significado de la obra 9.", price: "Consultar", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra10: { title: "Título Obra 5 (Galería)", description: "Inspiración en la mitología.", materials: "Materiales de la obra 10.", technique: "Técnica de la obra 10.", history: "Historia detallada de la inspiración, proceso y significado de la obra 10.", price: "Consultar", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"] }
    };

    // --- MANEJADOR DEL MENÚ MÓVIL (HAMBURGUESA) ---
    const mobileMenuHandler = {
        init() {
            if (!hamburger || !mainNav) return;
            hamburger.addEventListener('click', () => {
                const isActive = mainNav.classList.toggle('is-active');
                hamburger.classList.toggle('is-active', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('is-active')) {
                        mainNav.classList.remove('is-active');
                        hamburger.classList.remove('is-active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    };

    // --- MANEJADOR DE NAVEGACIÓN MODERNA (OPTIMIZADO) ---
    const navigationHandler = {
        init() {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) this.updateIndicator(activeLink);

            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => this.updateIndicator(link));
                link.addEventListener('click', this.smoothScroll);
            });
            
            const navList = document.querySelector('.main-nav ul');
            if (navList) {
                navList.addEventListener('mouseleave', () => {
                    const currentActiveLink = document.querySelector('.nav-link.active');
                    if(currentActiveLink) this.updateIndicator(currentActiveLink);
                });
            }
            this.initScrollSpy();
        },
        updateIndicator(link) {
            if (!link || !navIndicator) return;
            const linkRect = link.getBoundingClientRect();
            const navRect = navIndicator.parentElement.getBoundingClientRect();
            navIndicator.style.width = `${linkRect.width}px`;
            navIndicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
        },
        smoothScroll(event) {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        },
        initScrollSpy() {
            const observerOptions = {
                rootMargin: `-${header.offsetHeight}px 0px -40% 0px`,
                threshold: 0
            };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (entry.isIntersecting && navLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        navLink.classList.add('active');
                        this.updateIndicator(navLink);
                    }
                });
            }, observerOptions);
            sections.forEach(section => observer.observe(section));
        }
    };

    // --- MANEJADOR DEL MODAL ---
    const modalHandler = {
        currentArtworkId: null,
        currentImageIndex: 0,
        init() {
            if (!modal) return;
            artworkItems.forEach(item => {
                item.addEventListener('click', () => this.open(item.dataset.artworkId));
                // Preload image on hover for faster modal opening
                item.addEventListener('mouseenter', () => {
                    const data = artworkData[item.dataset.artworkId];
                    if (data && data.images && data.images.length > 0) {
                        this.preloadImage(data.images[0]);
                    }
                });
            });
            closeModalButton.addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => { if (e.target === modal) this.close(); });
            modal.querySelector('#prevModalImage').addEventListener('click', () => this.showPrevImage());
            modal.querySelector('#nextModalImage').addEventListener('click', () => this.showNextImage());
            modal.querySelectorAll('.modal-tab-button').forEach(button => {
                button.addEventListener('click', () => this.switchTab(button));
            });
        },
        preloadImage(url) {
            const img = new Image();
            img.src = url;
        },
        open(artworkId) {
            const data = artworkData[artworkId];
            if (!data) return;
            this.currentArtworkId = artworkId;
            this.currentImageIndex = 0;
            modal.querySelector('#modalArtworkTitle').textContent = data.title;
            modal.querySelector('#modalArtworkDescription').textContent = data.description;

            // AÑADIR ESTA SECCIÓN PARA EL PRECIO
            const priceEl = modal.querySelector('#modalArtworkPrice');
            if (data.price) {
                priceEl.textContent = data.price;
                priceEl.style.display = 'inline-block';
            } else {
                priceEl.style.display = 'none';
            }

            modal.querySelector('#modalArtworkMaterials').textContent = data.materials;
            modal.querySelector('#modalArtworkTechnique').textContent = data.technique;
            modal.querySelector('#modalArtworkHistory').textContent = data.history;
            this.generateThumbnails(data.images);
            this.updateMainImage();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        },
        close() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        },
        updateMainImage() {
            const data = artworkData[this.currentArtworkId];
            if (!data || !data.images) return;
            modal.querySelector('#modalArtworkMainImage').src = data.images[this.currentImageIndex];
            const thumbnails = modal.querySelectorAll('.modal-thumbnail-gallery img');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentImageIndex);
            });
            const navButtons = modal.querySelectorAll('.modal-nav-button');
            navButtons.forEach(btn => btn.style.display = data.images.length > 1 ? 'block' : 'none');
        },
        generateThumbnails(images) {
            const gallery = modal.querySelector('.modal-thumbnail-gallery');
            gallery.innerHTML = '';
            if (!images || images.length <= 1) {
                gallery.style.display = 'none';
                return;
            }
            gallery.style.display = 'flex';
            images.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Vista ${index + 1}`;
                img.addEventListener('click', () => {
                    this.currentImageIndex = index;
                    this.updateMainImage();
                });
                gallery.appendChild(img);
            });
        },
        showNextImage() {
            const images = artworkData[this.currentArtworkId].images;
            this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
            this.updateMainImage();
        },
        showPrevImage() {
            const images = artworkData[this.currentArtworkId].images;
            this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
            this.updateMainImage();
        },
        switchTab(button) {
            const targetId = button.dataset.tab;
            modal.querySelectorAll('.modal-tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            modal.querySelectorAll('.modal-tab-content').forEach(content => {
                content.classList.toggle('active', content.id === targetId);
            });
        }
    };
    
    // --- MANEJADOR DEL CARRUSEL CON DRAG ---
    const carouselHandler = {
        isDown: false, startX: 0, scrollLeft: 0,
        init() {
            if (!carousel) return;
            carousel.addEventListener('mousedown', (e) => this.start(e));
            carousel.addEventListener('mouseleave', () => this.end());
            carousel.addEventListener('mouseup', () => this.end());
            carousel.addEventListener('mousemove', (e) => this.move(e));
        },
        start(e) {
            this.isDown = true;
            carousel.classList.add('active');
            this.startX = e.pageX - carousel.offsetLeft;
            this.scrollLeft = carousel.scrollLeft;
        },
        end() {
            this.isDown = false;
            carousel.classList.remove('active');
        },
        move(e) {
            if (!this.isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - this.startX) * 2;
            carousel.scrollLeft = this.scrollLeft - walk;
        }
    };

    // --- EFECTOS DE SCROLL (OPTIMIZADO) ---
    const scrollEffectsHandler = {
        init() {
            window.addEventListener('scroll', () => {
                const scrollY = window.pageYOffset;
                header.classList.toggle('scrolled', scrollY > 50);
                scrollTopButton.classList.toggle('visible', scrollY > 300);
            }, { passive: true });
            scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const level = entry.target.querySelector('.skill-level');
                        level.style.width = level.style.getPropertyValue('--skill-width');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            skillItems.forEach(item => skillObserver.observe(item));
        }
    };

    // AÑADIR TODO ESTE NUEVO OBJETO
    // --- MANEJADOR DE REVELADO EN SCROLL ---
    const revealOnScrollHandler = {
        init() {
            const revealElements = document.querySelectorAll('.reveal-on-scroll');
            if (revealElements.length === 0) return;

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -10% 0px' // Activa la animación un poco antes de que llegue al borde
            });

            revealElements.forEach(el => {
                revealObserver.observe(el);
            });
        }
    };

    // --- MANEJADOR DE EFECTOS PREMIUM ---
    const premiumEffectsHandler = {
        init() {
            this.initTiltEffect();
        },
        initTiltEffect() {
            const tiltElement = document.querySelector('[data-tilt-effect]');
            if (!tiltElement) return;

            const maxTilt = 10; // Max tilt in degrees

            tiltElement.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = tiltElement.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;

                const centerX = width / 2;
                const centerY = height / 2;

                const rotateX = ((y - centerY) / centerY) * -maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;

                tiltElement.style.transition = 'transform 0.1s ease-out';
                tiltElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            tiltElement.addEventListener('mouseleave', () => {
                tiltElement.style.transition = 'transform 0.5s ease-in-out';
                tiltElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        }
    };

    // --- INICIALIZACIÓN ---
    function init() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.addEventListener('transitionend', () => preloader.style.display = 'none', { once: true });
            window.getComputedStyle(preloader).opacity;
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
        mobileMenuHandler.init();
        navigationHandler.init();
        modalHandler.init();
        carouselHandler.init();
        scrollEffectsHandler.init();
        revealOnScrollHandler.init();
        premiumEffectsHandler.init();
    }

    window.addEventListener('load', init);
});