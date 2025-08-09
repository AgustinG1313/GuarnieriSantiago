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

    // --- Datos de las obras (sin cambios) ---
    // Este objeto simula una base de datos para las obras de arte.
    const artworkData = {
        obra1: { title: "Nombre Escultura 1", description: "Breve leyenda de la obra 1.", materials: "Bronce, acero inoxidable.", technique: "Fundición a la cera perdida.", history: "Esta obra fue inspirada por la dualidad del hombre y la naturaleza, buscando capturar la esencia de la forma humana.", images: ["https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+1+Obra+1", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+2+Obra+1", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+3+Obra+1"] },
        obra2: { title: "Nombre Escultura 2", description: "Breve leyenda de la obra 2.", materials: "Mármol carrara.", technique: "Tallado clásico.", history: "Una exploración de la forma pura, donde la luz y la sombra juegan un papel fundamental para definir la textura y el volumen.", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra3: { title: "Nombre Escultura 3", description: "Breve leyenda de la obra 3.", materials: "Madera de roble.", technique: "Tallado y ensamblaje.", history: "Historia detallada de la inspiración, proceso y significado de la obra 3.", images: ["https://images.unsplash.com/photo-1578307767673-15a2acd2d45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"] },
        obra4: { title: "Nombre Escultura 4", description: "Breve leyenda de la obra 4.", materials: "Acero corten.", technique: "Soldadura y oxidación controlada.", history: "Historia detallada de la inspiración, proceso y significado de la obra 4.", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80", "https://placehold.co/800x600/1a1a1a/DAA520?text=Vista+2+Obra+4"] },
        obra6: { title: "Título Obra 1 (Galería)", description: "Breve introducción de esta escultura.", materials: "Materiales de la obra 6.", technique: "Técnica de la obra 6.", history: "Historia detallada de la inspiración, proceso y significado de la obra 6.", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra7: { title: "Título Obra 2 (Galería)", description: "Una pieza que explora el movimiento.", materials: "Materiales de la obra 7.", technique: "Técnica de la obra 7.", history: "Historia detallada de la inspiración, proceso y significado de la obra 7.", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"] },
        obra8: { title: "Título Obra 3 (Galería)", description: "Materiales innovadores y forma orgánica.", materials: "Materiales de la obra 8.", technique: "Técnica de la obra 8.", history: "Historia detallada de la inspiración, proceso y significado de la obra 8.", images: ["https://images.unsplash.com/photo-1578307767673-15a2acd2d45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"] },
        obra9: { title: "Título Obra 4 (Galería)", description: "Un viaje a través de la historia.", materials: "Materiales de la obra 9.", technique: "Técnica de la obra 9.", history: "Historia detallada de la inspiración, proceso y significado de la obra 9.", images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80"] },
        obra10: { title: "Título Obra 5 (Galería)", description: "Inspiración en la mitología.", materials: "Materiales de la obra 10.", technique: "Técnica de la obra 10.", history: "Historia detallada de la inspiración, proceso y significado de la obra 10.", images: ["https://images.unsplash.com/photo-1598214880891-90f7e3e1f3eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80"] }
    };

    // --- MANEJADOR DEL MENÚ MÓVIL (HAMBURGUESA) ---
    const mobileMenuHandler = {
        init() {
            if (!hamburger || !mainNav) return;

            hamburger.addEventListener('click', () => {
                // Alterna la clase 'is-active' para mostrar/ocultar el menú
                mainNav.classList.toggle('is-active');
                hamburger.classList.toggle('is-active');
                // Bloquea el scroll del body cuando el menú está abierto
                document.body.style.overflow = mainNav.classList.contains('is-active') ? 'hidden' : '';
            });

            // Cierra el menú al hacer clic en un enlace (para navegación en la misma página)
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

    // --- MANEJADOR DE NAVEGACIÓN MODERNA ---
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

            window.addEventListener('scroll', this.scrollSpy.bind(this), { passive: true });
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
        scrollSpy() {
            let currentSectionId = '';
            const headerHeight = header.offsetHeight + 50;
            
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - headerHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            const activeLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
            if (activeLink && !activeLink.classList.contains('active')) {
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
                this.updateIndicator(activeLink);
            }
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
            });

            closeModalButton.addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => { if (e.target === modal) this.close(); });
            
            modal.querySelector('#prevModalImage').addEventListener('click', () => this.showPrevImage());
            modal.querySelector('#nextModalImage').addEventListener('click', () => this.showNextImage());

            modal.querySelectorAll('.modal-tab-button').forEach(button => {
                button.addEventListener('click', () => this.switchTab(button));
            });
        },
        open(artworkId) {
            const data = artworkData[artworkId];
            if (!data) return;

            this.currentArtworkId = artworkId;
            this.currentImageIndex = 0;

            modal.querySelector('#modalArtworkTitle').textContent = data.title;
            modal.querySelector('#modalArtworkDescription').textContent = data.description;
            modal.querySelector('#modalArtworkMaterials').textContent = data.materials;
            modal.querySelector('#modalArtworkTechnique').textContent = data.technique;
            modal.querySelector('#modalArtworkHistory').textContent = data.history;

            this.generateThumbnails(data.images);
            this.updateMainImage();

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        },
        close() {
            const modalContent = modal.querySelector('.modal-content');
            modal.classList.add('hiding');
            
            // Usar 'animationend' para un cierre más robusto que setTimeout
            modalContent.addEventListener('animationend', () => {
                modal.classList.remove('show', 'hiding');
                document.body.style.overflow = '';
            }, { once: true });
        },
        updateMainImage() {
            const data = artworkData[this.currentArtworkId];
            if (!data || !data.images) return;
            modal.querySelector('#modalArtworkMainImage').src = data.images[this.currentImageIndex];
            
            const thumbnails = modal.querySelectorAll('.modal-thumbnail-gallery img');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentImageIndex);
            });

            // Ocultar botones de navegación si hay solo una imagen
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
        isDown: false,
        startX: 0,
        scrollLeft: 0,
        
        init() {
            if (!carousel) return;
            
            carousel.addEventListener('mousedown', (e) => {
                this.isDown = true;
                carousel.classList.add('active');
                this.startX = e.pageX - carousel.offsetLeft;
                this.scrollLeft = carousel.scrollLeft;
            });
            carousel.addEventListener('mouseleave', () => {
                this.isDown = false;
                carousel.classList.remove('active');
            });
            carousel.addEventListener('mouseup', () => {
                this.isDown = false;
                carousel.classList.remove('active');
            });
            carousel.addEventListener('mousemove', (e) => {
                if (!this.isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - this.startX) * 2; // El multiplicador aumenta la velocidad del scroll
                carousel.scrollLeft = this.scrollLeft - walk;
            });
        }
    };

    // --- EFECTOS DE SCROLL (Header, botón, animaciones) ---
    const scrollEffectsHandler = {
        init() {
            this.animateSkills();
            window.addEventListener('scroll', () => {
                const scrollY = window.pageYOffset;
                header.classList.toggle('scrolled', scrollY > 50);
                scrollTopButton.classList.toggle('visible', scrollY > 300);
                this.animateSkills();
            }, { passive: true });
            scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        },
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (rect.top <= window.innerHeight && rect.bottom >= 0);
        },
        animateSkills() {
            skillItems.forEach(item => {
                if (this.isInViewport(item) && !item.classList.contains('animated')) {
                    const level = item.querySelector('.skill-level');
                    level.style.width = level.style.getPropertyValue('--skill-width');
                    item.classList.add('animated'); // Evita que la animación se repita
                }
            });
        }
    };

    // --- INICIALIZACIÓN ---
    function init() {
        // Mejora del preloader: se oculta completamente después de la transición
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
            }, { once: true });
            
            // Forzar un reflow para asegurar que la transición se aplique
            window.getComputedStyle(preloader).opacity; 
            
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
        
        // Inicializar todos los manejadores
        mobileMenuHandler.init();
        navigationHandler.init();
        modalHandler.init();
        carouselHandler.init();
        scrollEffectsHandler.init();
    }

    // Usar 'load' para asegurar que todas las imágenes y recursos estén cargados
    // antes de ocultar el preloader y ejecutar las animaciones.
    window.addEventListener('load', init);
});
