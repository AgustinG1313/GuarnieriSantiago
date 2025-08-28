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
    const modal = document.getElementById('artworkModal');
    const closeModalButton = document.querySelector('.close-button');

    // --- Base de Datos de Obras (se genera dinámicamente) ---
    const artworkData = {
        "busto_de_san_martin": {
            title: "Busto de San Martin",
            description: "Descripción de la obra Busto de San Martin.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Busto de San Martin.",
            price: "Consultar",
            images: ["Fotos/Busto de San Martin/portada.jpg", "Fotos/Busto de San Martin/2.jpg", "Fotos/Busto de San Martin/20250817_131510.jpg", "Fotos/Busto de San Martin/20250817_131528.jpg", "Fotos/Busto de San Martin/3.jpg", "Fotos/Busto de San Martin/4.jpg"]
        },
        "sin_nombre": {
            title: "sin nombre",
            description: "Descripción de la obra sin nombre.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra sin nombre.",
            price: "Consultar",
            images: ["Fotos/sin nombre/portada.jpg", "Fotos/sin nombre/20240608_211255.jpg"]
        },
        "napalpi": {
            title: "Napalpí",
            description: "Descripción de la obra Napalpí.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Napalpí.",
            price: "Consultar",
            images: ["Fotos/Napalpí/portada.jpg", "Fotos/Napalpí/20240513_200225.jpg", "Fotos/Napalpí/20240513_200243.jpg", "Fotos/Napalpí/20240513_204832.jpg", "Fotos/Napalpí/20240513_205153.jpg", "Fotos/Napalpí/20240608_202652.jpg"]
        },
        "mitad": {
            title: "Mitad",
            description: "Descripción de la obra Mitad.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Mitad.",
            price: "Consultar",
            images: ["Fotos/Mitad/portada.jpg", "Fotos/Mitad/20240608_185959.jpg", "Fotos/Mitad/20240608_190551.jpg", "Fotos/Mitad/20240608_192322.jpg"]
        },
        "davincci": {
            title: "Davincci",
            description: "Descripción de la obra Davincci.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Davincci.",
            price: "Consultar",
            images: ["Fotos/Davincci/portada.jpg", "Fotos/Davincci/20240511_224704.jpg", "Fotos/Davincci/20240511_224719.jpg", "Fotos/Davincci/20240511_224735.jpg"]
        },
        "escultura_de_san_martin": {
            title: "Escultura de San Martin",
            description: "Descripción de la obra Escultura de San Martin.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Escultura de San Martin.",
            price: "Consultar",
            images: ["Fotos/Escultura de San Martin/portada.jpg", "Fotos/Escultura de San Martin/20240805_212144.jpg", "Fotos/Escultura de San Martin/20240805_212419.jpg", "Fotos/Escultura de San Martin/20240805_212450.jpg", "Fotos/Escultura de San Martin/20240805_212528.jpg", "Fotos/Escultura de San Martin/20240805_212614.jpg", "Fotos/Escultura de San Martin/20240805_212634.jpg", "Fotos/Escultura de San Martin/20240805_212712.jpg"]
        },
        "fabriziano": {
            title: "Fabriziano",
            description: "Descripción de la obra Fabriziano.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Fabriziano.",
            price: "Consultar",
            images: ["Fotos/Fabriziano/portada.jpg", "Fotos/Fabriziano/20240626_123740.jpg", "Fotos/Fabriziano/20240626_123758.jpg", "Fotos/Fabriziano/20240626_125403.jpg", "Fotos/Fabriziano/20240626_125703.jpg"]
        },
        "freya": {
            title: "Freya",
            description: "Descripción de la obra Freya.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Freya.",
            price: "Consultar",
            images: ["Fotos/Freya/portada.jpg", "Fotos/Freya/20240913_222418.jpg", "Fotos/Freya/20240913_223002.jpg", "Fotos/Freya/20240913_223304.jpg", "Fotos/Freya/20240913_223855.jpg", "Fotos/Freya/20240913_224259.jpg"]
        },
        "instropeccion": {
            title: "Instropeccion",
            description: "Descripción de la obra Instropeccion.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Instropeccion.",
            price: "Consultar",
            images: ["Fotos/Instropeccion/portada.jpg", "Fotos/Instropeccion/11.jpg", "Fotos/Instropeccion/20240913_220530.jpg", "Fotos/Instropeccion/20240913_220639.jpg", "Fotos/Instropeccion/20240913_220840.jpg"]
        },
        "manos": {
            title: "Manos",
            description: "Descripción de la obra Manos.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Manos.",
            price: "Consultar",
            images: ["Fotos/Manos/portada.jpg", "Fotos/Manos/2.jpg", "Fotos/Manos/20250602_210045.jpg", "Fotos/Manos/20250602_211147.jpg", "Fotos/Manos/20250fffffffffffffff602_212213.jpg", "Fotos/Manos/3.jpg"]
        },
        "matero": {
            title: "matero",
            description: "Descripción de la obra matero.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra matero.",
            price: "Consultar",
            images: ["Fotos/matero/portada.jpg", "Fotos/matero/1.jpg", "Fotos/matero/20240511_225235.jpg", "Fotos/matero/20240511_225300.jpg", "Fotos/matero/20240511_225318.jpg", "Fotos/matero/20240513_212612.jpg"]
        },
        "plumitas": {
            title: "Plumitas",
            description: "Descripción de la obra Plumitas.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Plumitas.",
            price: "Consultar",
            images: ["Fotos/Plumitas/portada.jpg", "Fotos/Plumitas/20240513_194753.jpg", "Fotos/Plumitas/20240513_195012.jpg", "Fotos/Plumitas/20240513_195045.jpg", "Fotos/Plumitas/20240513_195422.jpg"]
        },
        "san_fernando_rey": {
            title: "San Fernando Rey",
            description: "Descripción de la obra San Fernando Rey.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra San Fernando Rey.",
            price: "Consultar",
            images: ["Fotos/San Fernando Rey/portada.jpg", "Fotos/San Fernando Rey/1.jpg", "Fotos/San Fernando Rey/20240826_195300.jpg", "Fotos/San Fernando Rey/20240826_195407.jpg", "Fotos/San Fernando Rey/20240826_195649.jpg", "Fotos/San Fernando Rey/20240826_200819.jpg", "Fotos/San Fernando Rey/20240826_202245.jpg", "Fotos/San Fernando Rey/20240826_202856.jpg", "Fotos/San Fernando Rey/20240826_203104.jpg"]
        },
        "sin_brazos": {
            title: "Sin Brazos",
            description: "Descripción de la obra Sin Brazos.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Sin Brazos.",
            price: "Consultar",
            images: ["Fotos/Sin Brazos/portada.jpg", "Fotos/Sin Brazos/20240513_220037.jpg", "Fotos/Sin Brazos/20240513_220047.jpg", "Fotos/Sin Brazos/20240513_220058.jpg"]
        },
        "sombrerito": {
            title: "Sombrerito",
            description: "Descripción de la obra Sombrerito.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Sombrerito.",
            price: "Consultar",
            images: ["Fotos/Sombrerito/portada.jpg", "Fotos/Sombrerito/20240511_214659.jpg", "Fotos/Sombrerito/20240511_214748.jpg", "Fotos/Sombrerito/20240511_220118.jpg", "Fotos/Sombrerito/20240511_220738.jpg", "Fotos/Sombrerito/20240513_220234.jpg"]
        },
        "tamborcito_de_tacuari": {
            title: "Tamborcito de Tacuari",
            description: "Descripción de la obra Tamborcito de Tacuari.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Tamborcito de Tacuari.",
            price: "Consultar",
            images: ["Fotos/Tamborcito de Tacuari/portada.jpg", "Fotos/Tamborcito de Tacuari/20241001_201930.jpg", "Fotos/Tamborcito de Tacuari/20241001_201952.jpg", "Fotos/Tamborcito de Tacuari/20241001_202430.jpg", "Fotos/Tamborcito de Tacuari/20241001_202458.jpg"]
        },
        "tiro_al_blanco": {
            title: "Tiro al Blanco",
            description: "Descripción de la obra Tiro al Blanco.",
            materials: "Materiales de la obra.",
            technique: "Técnica utilizada.",
            history: "Historia de la obra Tiro al Blanco.",
            price: "Consultar",
            images: ["Fotos/Tiro al Blanco/portada.jpg", "Fotos/Tiro al Blanco/20240913_225000.jpg"]
        }
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
            closeModalButton.addEventListener('click', () => this.close());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.close();
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

            modal.querySelector('#modalArtworkTitle').textContent = data.title;
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

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-is-open');
        },
        close() {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.style.overflow = '';
                document.body.classList.remove('modal-is-open');
            }, 50);
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

    // --- MANEJADOR DE GALERÍA DINÁMICA ---
    const dynamicGalleryHandler = {
        createArtworkCard(id, data) {
            const imageUrl = data.images.find(img => img.includes('portada')) || data.images[0];
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.artworkId = id;

            card.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${data.title}">
                </div>
                <div class="card-content">
                    <h3>${data.title}</h3>
                    <p>${data.description.substring(0, 80)}...</p>
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

            const artworkIds = Object.keys(artworkData);

            // Populate Main Gallery
            artworkIds.forEach((id, index) => {
                const card = this.createArtworkCard(id, artworkData[id]);
                card.classList.add('gallery-item', 'reveal-on-scroll');
                card.style.setProperty('--item-index', index + 1);
                galleryContainer.appendChild(card);
            });

            // Populate Carousel with the first 3 artworks
            artworkIds.slice(0, 3).forEach(id => {
                const card = this.createArtworkCard(id, artworkData[id]);
                card.classList.add('carousel-item');
                carouselContainer.appendChild(card);
            });

            if (typeof modalHandler !== 'undefined') modalHandler.initArtworkListeners();
            if (typeof revealOnScrollHandler !== 'undefined') revealOnScrollHandler.init();
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
                        if (level) {
                            level.style.width = level.style.getPropertyValue('--skill-width');
                            observer.unobserve(entry.target);
                        }
                    }
                });
            }, { threshold: 0.5 });
            skillItems.forEach(item => skillObserver.observe(item));
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
    function init() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.addEventListener('transitionend', () => preloader.style.display = 'none', { once: true });
            window.getComputedStyle(preloader).opacity;
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
        
        dynamicGalleryHandler.populate();
        mobileMenuHandler.init();
        navigationHandler.init();
        carouselHandler.init();
        scrollEffectsHandler.init();
        premiumEffectsHandler.init();
        modalHandler.init();
    }

    window.addEventListener('load', init);
});
