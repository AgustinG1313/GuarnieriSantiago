document.addEventListener('DOMContentLoaded', function () {
    // --- INICIALIZAR SMOOTH SCROLL (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Variables globales ---
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.querySelector('.nav-indicator');
    const sections = document.querySelectorAll('main section, footer.section');
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const carousel = document.querySelector('.carousel-items');
    const modal = document.getElementById('artworkModal');
    const closeModalButton = document.querySelector('.close-button');
    
    let artworkData = {};
    
    // --- UTILITY: Throttle ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // --- NUEVO CURSOR ELEGANTE (ESTO FALTABA) ---
    const customCursorHandler = {
        init() {
            // No ejecutar en móviles
            if (window.matchMedia("(max-width: 900px)").matches) return;

            const dot = document.querySelector("[data-cursor-dot]");
            const outline = document.querySelector("[data-cursor-outline]");
            
            if (!dot || !outline) return;

            window.addEventListener("mousemove", (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                // El punto se mueve instantáneo
                dot.style.left = `${posX}px`;
                dot.style.top = `${posY}px`;

                // El círculo con inercia suave
                outline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            });

            // Efecto Hover en elementos interactivos
            const interactables = document.querySelectorAll('a, button, .card, input, textarea, .carousel-items');
            
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        }
    };

    // --- MANEJADOR DE EFECTO PARALLAX ---
    const parallaxHandler = {
        init() {
            const wrappers = document.querySelectorAll('.gallery-grid .card .parallax-wrap');
            if (!wrappers.length) return;

            const updateParallax = () => {
                const windowHeight = window.innerHeight;
                wrappers.forEach(wrap => {
                    const container = wrap.closest('.card');
                    if (!container) return;
                    const rect = container.getBoundingClientRect();
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const distanceFromCenter = (rect.top + rect.height / 2) - (windowHeight / 2);
                        const translateY = distanceFromCenter * -0.1; 
                        wrap.style.transform = `translateY(${translateY}px)`;
                    }
                });
            };

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
            updateParallax();
        }
    };

    // --- MANEJADOR MASONRY ---
    const masonryHandler = {
        gallery: document.querySelector('.gallery-grid'),
        init() {
            if (!this.gallery) return;
            window.addEventListener('resize', throttle(() => this.resizeAllGridItems(), 200));
            let checkCount = 0;
            const checkInterval = setInterval(() => {
                this.resizeAllGridItems();
                checkCount++;
                if(checkCount > 10) clearInterval(checkInterval);
            }, 500);
        },

        resizeGridItem(item) {
            const grid = this.gallery;
            const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            const imageContainer = item.querySelector('.image-container');
            const content = item.querySelector('.card-content');
            const img = item.querySelector('img');

            if (!img || img.naturalHeight === 0) return;

            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const currentWidth = item.getBoundingClientRect().width;
            const projectedImageHeight = currentWidth * aspectRatio;
            const contentHeight = content.getBoundingClientRect().height;
            const totalHeight = projectedImageHeight + contentHeight;
            const spans = Math.ceil((totalHeight + rowGap) / (rowHeight + rowGap));
            
            item.style.gridRowEnd = `span ${spans}`;
            if(imageContainer) imageContainer.style.height = `${projectedImageHeight}px`;
        },

        resizeAllGridItems() {
            const allItems = document.querySelectorAll('.gallery-item');
            allItems.forEach(item => this.resizeGridItem(item));
        }
    };

    // --- MANEJADOR DE GALERÍA DINÁMICA ---
    const dynamicGalleryHandler = {
        createArtworkCard(id, data, isCarousel = false) {
            const imageUrl = data.images.find(img => img.includes('portada')) || data.images[0];
            const card = document.createElement('div');
            
            let classList = 'card gallery-item';
            if (isCarousel) classList += ' carousel-item';
            card.className = classList;
            card.dataset.artworkId = id;

            const altText = `Escultura de ${data.technique || 'arcilla'} titulada '${data.title}', obra de Santiago Guarnieri.`;

            card.innerHTML = `
                <div class="image-container">
                    <div class="parallax-wrap">
                        <img src="${imageUrl}" alt="${altText}" loading="${isCarousel ? 'lazy' : 'eager'}">
                    </div>
                </div>
                <div class="card-content">
                    <h3>${data.title}</h3>
                </div>
            `;

            const img = card.querySelector('img');
            if (!isCarousel) {
                img.onload = () => {
                    masonryHandler.resizeGridItem(card);
                    card.classList.add('reveal-on-scroll', 'is-visible');
                };
            }
            return card;
        },
        
        populate() {
            const galleryContainer = document.querySelector('.gallery-grid');
            const carouselContainer = document.querySelector('.carousel-items');
            if (!galleryContainer || !carouselContainer) return;

            galleryContainer.innerHTML = '';
            carouselContainer.innerHTML = '';
            
            const artworkIds = Object.keys(artworkData);

            artworkIds.forEach((id) => {
                const card = this.createArtworkCard(id, artworkData[id]);
                galleryContainer.appendChild(card);
            });

            artworkIds.forEach(id => {
                if (artworkData[id].featured) {
                    const card = this.createArtworkCard(id, artworkData[id], true);
                    carouselContainer.appendChild(card);
                }
            });
            
            modalHandler.initArtworkListeners();
            
            setTimeout(() => {
                masonryHandler.init();
                masonryHandler.resizeAllGridItems();
                parallaxHandler.init();
            }, 100);
        }
    };

    // --- MANEJADORES MENÚ Y NAV ---
    const mobileMenuHandler = {
        init() {
            if (!hamburger || !mainNav) return;
            hamburger.addEventListener('click', () => {
                const isActive = mainNav.classList.contains('is-active');
                isActive ? this.closeMenu() : this.openMenu();
            });
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('is-active')) this.closeMenu();
                });
            });
        },
        openMenu() {
            const scrollY = window.scrollY;
            mainNav.classList.add('is-active');
            hamburger.classList.add('is-active');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        },
        closeMenu() {
            const scrollY = parseInt(document.body.style.top || '0') * -1;
            mainNav.classList.remove('is-active');
            hamburger.classList.remove('is-active');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        }
    };

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
            const observerOptions = { rootMargin: `-${header.offsetHeight}px 0px -40% 0px`, threshold: 0 };
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

    const modalHandler = {
        currentArtworkId: null,
        currentImageIndex: 0,
        scrollPosition: 0,
        init() {
            if (!modal) return;
            closeModalButton.addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => { if (e.target === modal) this.close(); });
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
            window.addEventListener('hashchange', () => this.handleDeepLink());
        },
        initArtworkListeners() {
            const artworkItems = document.querySelectorAll('.card[data-artwork-id]');
            artworkItems.forEach(item => {
                item.addEventListener('click', () => this.open(item.dataset.artworkId));
            });
        },
        open(artworkId) {
            lenis.stop();
            const data = artworkData[artworkId];
            if (!data) return;
            this.currentArtworkId = artworkId;
            this.currentImageIndex = 0;
            this.scrollPosition = window.pageYOffset;
            
            modal.querySelector('#modalArtworkTitle').textContent = data.title;
            modal.querySelector('#modalArtworkDescription').textContent = data.description;
            modal.querySelector('#modalArtworkMaterials').textContent = data.materials;
            modal.querySelector('#modalArtworkTechnique').textContent = data.technique;
            modal.querySelector('#modalArtworkHistory').textContent = data.history;
            const priceEl = modal.querySelector('#modalArtworkPrice');
            priceEl.textContent = data.price || '';
            priceEl.style.display = data.price ? 'block' : 'none';
            
            this.generateThumbnails(data.images);
            this.updateMainImage();
            
            modal.classList.add('show');
            document.body.classList.add('modal-is-open');
        },
        close() {
            lenis.start();
            modal.classList.remove('show');
            document.body.classList.remove('modal-is-open');
            window.scrollTo(0, this.scrollPosition);
        },
        updateMainImage() {
            const data = artworkData[this.currentArtworkId];
            const mainImage = modal.querySelector('#modalArtworkMainImage');
            const imageArea = modal.querySelector('.modal-image-area');
            
            imageArea.classList.add('loading');
            mainImage.style.opacity = '0.5';
            mainImage.onload = () => {
                imageArea.classList.remove('loading');
                mainImage.style.opacity = '1';
            };
            mainImage.src = data.images[this.currentImageIndex];
            
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
            if (artworkId && artworkData[artworkId]) this.open(artworkId);
        }
    };

    const carouselHandler = {
        isDown: false, startX: 0, scrollLeft: 0,
        init() {
            if (!carousel) return;
            carousel.addEventListener('mousedown', (e) => {
                this.isDown = true;
                carousel.classList.add('active');
                this.startX = e.pageX - carousel.offsetLeft;
                this.scrollLeft = carousel.scrollLeft;
            });
            carousel.addEventListener('mouseleave', () => { this.isDown = false; carousel.classList.remove('active'); });
            carousel.addEventListener('mouseup', () => { this.isDown = false; carousel.classList.remove('active'); });
            carousel.addEventListener('mousemove', (e) => {
                if (!this.isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - this.startX) * 2;
                carousel.scrollLeft = this.scrollLeft - walk;
            });
        }
    };

    // --- SCHEMA SEO ---
    const schemaGenerator = {
        init() {
            setTimeout(() => {
                if (Object.keys(artworkData).length === 0) return;
                this.generateArtworkSchema();
            }, 1000);
        },

        generateArtworkSchema() {
            const artworkIds = Object.keys(artworkData);
            const schemaList = artworkIds.map(id => {
                const item = artworkData[id];
                const imageUrl = item.images[0];
                return {
                    "@context": "https://schema.org",
                    "@type": "VisualArtwork",
                    "name": item.title,
                    "image": `https://santiagoguarnieri.com/${imageUrl}`,
                    "description": item.description,
                    "artist": { "@type": "Person", "name": "Santiago Guarnieri" },
                    "artMedium": item.materials || "Arcilla / Bronce",
                    "artform": "Escultura",
                    "creator": { "@type": "Person", "name": "Santiago Guarnieri" },
                    "material": item.technique
                };
            });
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schemaList);
            document.head.appendChild(script);
        }
    };

    // --- MANEJADOR DE PARTÍCULAS (LENTO Y ELEGANTE) ---
    const particleSystemHandler = {
        init() {
            const canvas = document.getElementById('particle-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let particles = [];
            let width, height;

            // Configuración de interacción
            const mouse = { x: null, y: null, radius: 150 };

            const resize = () => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            };
            window.addEventListener('resize', resize);
            resize();

            window.addEventListener('mousemove', (e) => {
                mouse.x = e.x;
                mouse.y = e.y;
            });

            class Particle {
                constructor() {
                    this.reset();
                }
                
                reset() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    
                    // VELOCIDAD BASE (CRUCERO - LENTA):
                    this.vx = (Math.random() - 0.5) * 0.6; 
                    this.vy = (Math.random() - 0.5) * 0.6;
                    
                    this.originalVx = this.vx;
                    this.originalVy = this.vy;

                    this.size = Math.random() * 2 + 1; 
                    this.opacity = Math.random() * 0.5 + 0.1;
                    this.baseOpacity = this.opacity;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;

                    let isInteracting = false;
                    if (mouse.x != null) {
                        let dx = mouse.x - this.x;
                        let dy = mouse.y - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouse.radius) {
                            isInteracting = true;
                            const forceDirectionX = dx / distance;
                            const forceDirectionY = dy / distance;
                            const force = (mouse.radius - distance) / mouse.radius;
                            const pushStrength = 0.08; 
                            
                            this.vx -= forceDirectionX * force * pushStrength;
                            this.vy -= forceDirectionY * force * pushStrength;
                            this.opacity = Math.min(1, this.opacity + 0.05);
                        }
                    }

                    // RECUPERACIÓN SUAVE (ELASTICIDAD)
                    if (!isInteracting) {
                        this.vx += (this.originalVx - this.vx) * 0.05;
                        this.vy += (this.originalVy - this.vy) * 0.05;
                        if (this.opacity > this.baseOpacity) this.opacity -= 0.01;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(218, 165, 32, ${this.opacity})`;
                    ctx.fill();
                }
            }

            for (let i = 0; i < 150; i++) {
                particles.push(new Particle());
            }

            const animate = () => {
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(animate);
            };
            animate();
        }
    };

    // --- INIT PRINCIPAL ---
    async function init() {
        const preloader = document.querySelector('.preloader');
        try {
            const response = await fetch('artworks.json');
            if (response.ok) artworkData = await response.json();
        } catch (e) { console.error(e); }

        if (preloader) preloader.style.display = 'none';

        // Inicializar módulos
        dynamicGalleryHandler.populate();
        mobileMenuHandler.init();
        navigationHandler.init();
        carouselHandler.init();
        
        // AQUÍ ESTABA EL ERROR: Agregamos el cursor, quitamos spotlight
        customCursorHandler.init(); 
        
        schemaGenerator.init();
        particleSystemHandler.init();
        modalHandler.init();
        
        // Contacto
        const revealButton = document.getElementById('reveal-contact');
        const contactCard = document.querySelector('.contact-card');
        const flipBack = document.getElementById('flip-back');
        if(revealButton && contactCard) {
            revealButton.addEventListener('click', () => contactCard.classList.add('revealed'));
            if(flipBack) flipBack.addEventListener('click', () => contactCard.classList.remove('revealed'));
        }

        // Revelado de textos
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('p, h3, h4, .detail-card').forEach(el => {
            el.classList.add('text-reveal');
            textObserver.observe(el);
        });
    }

    init();
});