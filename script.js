document.addEventListener('DOMContentLoaded', function () {
    // --- Variables globales ---
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('main section, footer.section');
    const scrollTopButton = document.querySelector('.scroll-top');
    
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const carousel = document.querySelector('.carousel-items');
    const modal = document.getElementById('artworkModal');
    const closeModalButton = document.querySelector('.close-button');

    let artworkData = {};
    const originalTitle = document.title;
    let lastFocusedElement;

    // --- MANEJADOR DEL MENÚ MÓVIL (HAMBURGUESA) ---
    const mobileMenuHandler = {
        init() {
            if (!hamburger || !mainNav) return;
            hamburger.addEventListener('click', () => {
                const isActive = mainNav.classList.toggle('is-active');
                hamburger.classList.toggle('is-active', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (mainNav.classList.contains('is-active')) {
                            mainNav.classList.remove('is-active');
                            hamburger.classList.remove('is-active');
                            document.body.style.overflow = '';
                        }
                    });
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
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        });
                        navLink.classList.add('active');
                        navLink.setAttribute('aria-current', 'page');
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
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'modalArtworkTitle');
            closeModalButton.addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.close();
            });
            document.addEventListener('keydown', (e) => {
                if (modal.classList.contains('show')) {
                    if (e.key === 'Escape') this.close();
                    if (e.key === 'ArrowLeft') this.showPrevImage();
                    if (e.key === 'ArrowRight') this.showNextImage();
                }
            });
            modal.querySelector('#prevModalImage').addEventListener('click', () => this.showPrevImage());
            modal.querySelector('#nextModalImage').addEventListener('click', () => this.showNextImage());
            modal.querySelectorAll('.modal-tab-button').forEach(button => {
                button.addEventListener('click', () => this.switchTab(button));
            });
        },
        initArtworkListeners() {
            const artworkItems = document.querySelectorAll('.card[data-artwork-id]');
            artworkItems.forEach(item => {
                if (item.dataset.listenerAttached) return;
                item.addEventListener('click', () => this.open(item.dataset.artworkId));
                item.addEventListener('mouseenter', () => {
                    const data = artworkData[item.dataset.artworkId];
                    if (data && data.images && data.images.length > 0) {
                        this.preloadImage(data.images[0]);
                    }
                });
                item.dataset.listenerAttached = true;
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

            lastFocusedElement = document.activeElement;
            window.location.hash = artworkId;

            modal.querySelector('#modalArtworkTitle').textContent = data.title;
            document.title = `${data.title} | Santiago Guarneri`;
            modal.querySelector('#modalArtworkDescription').textContent = data.description;
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
            this.updateSchema(data);

            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-is-open');
            closeModalButton.focus();
        },
        close() {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.title = originalTitle;
            history.pushState("", document.title, window.location.pathname + window.location.search);
            const schemaScript = document.getElementById('artwork-schema');
            schemaScript.textContent = '';
            setTimeout(() => {
                document.body.style.overflow = '';
                document.body.classList.remove('modal-is-open');
                if (lastFocusedElement) lastFocusedElement.focus();
            }, 500);
        },
        updateMainImage() {
            const data = artworkData[this.currentArtworkId];
            if (!data || !data.images) return;
            const mainImage = modal.querySelector('#modalArtworkMainImage');
            const imageArea = modal.querySelector('.modal-image-area');
            
            imageArea.classList.add('loading');
            mainImage.style.opacity = '0.5';

            mainImage.onload = () => {
                imageArea.classList.remove('loading');
                mainImage.style.opacity = '1';
            };

            mainImage.src = data.images[this.currentImageIndex];
            mainImage.alt = `${data.title} - Vista ${this.currentImageIndex + 1}`;
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
                img.loading = 'lazy';
                img.addEventListener('click', () => {
                    this.currentImageIndex = index;
                    this.updateMainImage();
                });
                gallery.appendChild(img);
            });
        },
        showNextImage() {
            const images = artworkData[this.currentArtworkId].images;
            if (images.length <= 1) return;
            this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
            this.updateMainImage();
        },
        showPrevImage() {
            const images = artworkData[this.currentArtworkId].images;
            if (images.length <= 1) return;
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
        },
        handleDeepLink() {
            const artworkId = window.location.hash.substring(1);
            if (artworkId && artworkData[artworkId]) {
                this.open(artworkId);
            }
        },
        updateSchema(data) {
            const schemaScript = document.getElementById('artwork-schema');
            const schema = {
                "@context": "https://schema.org",
                "@type": "VisualArtwork",
                "name": data.title,
                "artist": {
                    "@type": "Person",
                    "name": "Santiago Guarneri"
                },
                "description": data.description,
                "image": new URL(data.images[0], window.location.href).href,
                "material": data.materials,
                "artform": data.technique
            };
            schemaScript.textContent = JSON.stringify(schema);
        }
    };

    // --- MANEJADOR DE GALERÍA DINÁMICA (OPTIMIZADO) ---
    const dynamicGalleryHandler = {
        createArtworkCard(id, data, isCarousel = false) {
            const imageUrl = data.images.find(img => img.includes('portada')) || data.images[0];
            const card = document.createElement('div');
            card.className = 'card gallery-item reveal-on-scroll';
            if (isCarousel) {
                card.classList.add('carousel-item');
            }
            card.dataset.artworkId = id;

            card.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${data.title}" ${isCarousel ? 'loading="lazy"' : ''}>
                </div>
                <div class="card-content">
                    <h3>${data.title}</h3>
                </div>
            `;
            return card;
        },

        populate() {
            const galleryContainer = document.querySelector('.gallery-grid');
            const carouselContainer = document.querySelector('.carousel-items');

            if (!galleryContainer || !carouselContainer) return;

            galleryContainer.innerHTML = '';
            carouselContainer.innerHTML = '';
            
            const galleryFragment = document.createDocumentFragment();
            const carouselFragment = document.createDocumentFragment();

            const artworkIds = Object.keys(artworkData);

            // Populate Main Gallery
            artworkIds.forEach((id, index) => {
                const card = this.createArtworkCard(id, artworkData[id]);
                card.style.setProperty('--item-index', index + 1);
                galleryFragment.appendChild(card);
            });

            // Populate Carousel with featured artworks
            artworkIds.forEach(id => {
                const artwork = artworkData[id];
                if (artwork.featured) {
                    const card = this.createArtworkCard(id, artwork, true);
                    carouselFragment.appendChild(card);
                }
            });
            
            galleryContainer.appendChild(galleryFragment);
            carouselContainer.appendChild(carouselFragment);

            if (typeof modalHandler !== 'undefined') modalHandler.initArtworkListeners();
            if (typeof revealOnScrollHandler !== 'undefined') revealOnScrollHandler.init();
        }
    };
    
    // --- MANEJADOR DEL CARRUSEL CON DRAG (CON SOPORTE TÁCTIL) ---
    const carouselHandler = {
        isDown: false, startX: 0, scrollLeft: 0,
        init() {
            if (!carousel) return;
            // Eventos de Ratón
            carousel.addEventListener('mousedown', (e) => this.start(e));
            carousel.addEventListener('mouseleave', () => this.end());
            carousel.addEventListener('mouseup', () => this.end());
            carousel.addEventListener('mousemove', (e) => this.move(e));
            // Eventos Táctiles
            carousel.addEventListener('touchstart', (e) => this.start(e));
            carousel.addEventListener('touchend', () => this.end());
            carousel.addEventListener('touchmove', (e) => this.move(e));
        },
        start(e) {
            this.isDown = true;
            carousel.classList.add('active');
            const pageX = e.pageX || e.touches[0].pageX;
            this.startX = pageX - carousel.offsetLeft;
            this.scrollLeft = carousel.scrollLeft;
        },
        end() {
            this.isDown = false;
            carousel.classList.remove('active');
        },
        move(e) {
            if (!this.isDown) return;
            e.preventDefault();
            const pageX = e.pageX || e.touches[0].pageX;
            const x = pageX - carousel.offsetLeft;
            const walk = (x - this.startX) * 2; // El multiplicador 2 acelera el scroll
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
                        if (level) {
                            level.style.width = level.style.getPropertyValue('--skill-width');
                            observer.unobserve(entry.target);
                        }
                    }
                });
            }, { threshold: 0.5 });
            
        }
    };

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
                rootMargin: '0px 0px -10% 0px'
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

            const maxTilt = 10;

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
    async function init() {
        const preloader = document.querySelector('.preloader');
        
        try {
            const response = await fetch('artworks.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            artworkData = await response.json();
        } catch (error) {
            console.error("Could not load artwork data:", error);
            // Opcional: Mostrar un mensaje de error al usuario en la página
        }

        if (preloader) {
            preloader.addEventListener('transitionend', () => preloader.style.display = 'none', { once: true });
            window.getComputedStyle(preloader).opacity;
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
        
        // Inicializar todos los módulos que dependen de los datos o del DOM
        dynamicGalleryHandler.populate();
        mobileMenuHandler.init();
        navigationHandler.init();
        carouselHandler.init();
        scrollEffectsHandler.init();
        premiumEffectsHandler.init();
        modalHandler.init();
        modalHandler.handleDeepLink();
        initObfuscatedContact();
        initValidationTool();
    }

    init();

    // --- MANEJADOR PARA REVELAR CONTACTO ---
    const revealButton = document.getElementById('reveal-contact');
    const honeypot = document.getElementById('honeypot');
    const contactCard = document.querySelector('.contact-card');

    if (revealButton && honeypot && contactCard) {
        const flipBackButton = document.getElementById('flip-back');
        
        revealButton.addEventListener('click', () => {
            if (honeypot.value.trim() === '') {
                contactCard.classList.add('revealed');
            } else {
                contactCard.style.display = 'none';
            }
        });

        if (flipBackButton) {
            flipBackButton.addEventListener('click', () => {
                contactCard.classList.remove('revealed');
            });
        }
    }

    // --- MANEJADOR DE CONTACTO OFUSCADO (REFACTORIZADO) ---
    function initObfuscatedContact() {
        const contactMethods = {
            'email-link': {
                valueSelector: '.method-value',
                user: 'guartiago',
                domain: 'hotmail.com',
                constructHref: (user, domain) => `mailto:${user}@${domain}`,
                constructText: (user, domain) => `${user}@${domain}`
            },
            'phone-link': {
                valueSelector: '.method-value',
                country: '54',
                number: '3624686826',
                constructHref: (country, number) => `tel:+${country}${number}`,
                constructText: (country, number) => `(${country}) ${number.slice(0, 4)}-${number.slice(4)}`
            },
            'instagram-link': {
                valueSelector: '.method-value',
                user: 'santiagoguarnieri',
                constructHref: (user) => `https://www.instagram.com/${user}/`,
                constructText: (user) => `@${user}`
            }
        };

        for (const id in contactMethods) {
            const link = document.getElementById(id);
            if (link) {
                const config = contactMethods[id];
                const valueEl = link.querySelector(config.valueSelector);
                const href = config.constructHref(config.user || config.country, config.domain || config.number);
                const text = config.constructText(config.user || config.country, config.domain || config.number);
                
                if (valueEl) valueEl.textContent = text;
                link.href = href;
                if (id !== 'instagram-link') {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = href;
                    });
                }
            }
        }
    }

    // --- HERRAMIENTA DE VALIDACIÓN DE DATOS ---
    function initValidationTool() {
        const validateButton = document.getElementById('validate-button');
        if (validateButton) {
            validateButton.addEventListener('click', validateArtworks);
        }
    }

    async function validateArtworks() {
        console.log('Iniciando validación de artworks.json...');

        try {
            const response = await fetch('artworks.json');
            if (!response.ok) {
                console.error('Error: No se pudo cargar artworks.json. Estado:', response.status);
                return;
            }
            const artworks = await response.json();
            const artworkIds = Object.keys(artworks);

            const requiredFields = ['title', 'description', 'materials', 'technique', 'history', 'images'];
            let errorCount = 0;
            const errorLog = {};

            console.log(`Se encontraron ${artworkIds.length} obras. Validando campos requeridos: ${requiredFields.join(', ')}...`);

            artworkIds.forEach(id => {
                const artwork = artworks[id];
                const errors = [];

                requiredFields.forEach(field => {
                    if (!artwork.hasOwnProperty(field)) {
                        errors.push(`Falta el campo requerido: '${field}'.`);
                    } else if (typeof artwork[field] === 'string' && artwork[field].trim() === '') {
                        errors.push(`El campo '${field}' está vacío.`);
                    } else if (Array.isArray(artwork[field]) && artwork[field].length === 0) {
                        errors.push(`El arreglo de imágenes '${field}' está vacío.`);
                    }
                });
                
                // Validaciones específicas para campos con descripciones genéricas
                if (artwork.description && artwork.description.toLowerCase().includes('descripción de la obra')) {
                    errors.push(`El campo 'description' tiene contenido genérico.`);
                }
                if (artwork.materials && artwork.materials.toLowerCase().includes('materiales de la obra')) {
                    errors.push(`El campo 'materials' tiene contenido genérico.`);
                }
                if (artwork.technique && artwork.technique.toLowerCase().includes('técnica utilizada')) {
                    errors.push(`El campo 'technique' tiene contenido genérico.`);
                }
                if (artwork.history && artwork.history.toLowerCase().includes('historia de la obra')) {
                    errors.push(`El campo 'history' tiene contenido genérico.`);
                }

                if (errors.length > 0) {
                    errorCount += errors.length;
                    errorLog[id] = errors;
                }
            });

            if (errorCount === 0) {
                console.log('%c¡Validación completada! Todos las obras pasaron la prueba.', 'color: #4CAF50; font-weight: bold;');
            } else {
                console.warn(`%cValidación completada con ${errorCount} errores en ${Object.keys(errorLog).length} obras.`, 'color: #FFC107; font-weight: bold;');
                console.log('--- Reporte de Errores ---');
                for (const id in errorLog) {
                    console.groupCollapsed(`Obra: ${id}`);
                    errorLog[id].forEach(error => console.error(`- ${error}`));
                    console.groupEnd();
                }
                console.log('--- Fin del Reporte ---');
            }

        } catch (error) {
            console.error('Ocurrió un error inesperado durante la validación:', error);
        }
    }
});