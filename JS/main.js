function initMenuResponsive() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.navbar-link, .navbar-btn').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
            });
        });
    }
}

function initScrollEffects() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });
}



function initReadingProgressBar() {
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection || counters.length === 0) return;

    let hasAnimated = false;

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 1500; // ms
        const startTime = performance.now();
        const startVal = 0;

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const value = Math.floor(startVal + (target - startVal) * eased);
            counter.textContent = value;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    }

    function start() {
        if (hasAnimated) return;
        hasAnimated = true;
        counters.forEach(animateCounter);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    start();
                    obs.disconnect();
                }
            });
        }, { root: null, threshold: 0.25 });
        observer.observe(statsSection);
    } else {
        // Fallback: comprobar en load y en scroll
        function check() {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) start();
        }
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('load', check);
        // Comprobación inmediata por si ya está visible al iniciar
        check();
    }
}

function initCarousel() {
    let indiceSlide = 0;
    let autoPlayInterval;
    
    function moverSlide(direccion) {
        const slides = document.querySelectorAll('.slide');
        const indicadores = document.querySelectorAll('.indicador');
        
        if (slides.length === 0) return;
        
        slides[indiceSlide].classList.remove('activo');
        indicadores[indiceSlide].classList.remove('activo');
        
        indiceSlide = (indiceSlide + direccion + slides.length) % slides.length;
        
        slides[indiceSlide].classList.add('activo');
        indicadores[indiceSlide].classList.add('activo');
        
        reiniciarAutoPlay();
    }

    function irASlide(indice) {
        const slides = document.querySelectorAll('.slide');
        const indicadores = document.querySelectorAll('.indicador');
        
        if (slides.length === 0) return;
        
        slides[indiceSlide].classList.remove('activo');
        indicadores[indiceSlide].classList.remove('activo');
        
        indiceSlide = indice;
        
        slides[indiceSlide].classList.add('activo');
        indicadores[indiceSlide].classList.add('activo');
        
        reiniciarAutoPlay();
    }

    function iniciarAutoPlay() {
        autoPlayInterval = setInterval(() => {
            moverSlide(1);
        }, 5000);
    }

    function detenerAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function reiniciarAutoPlay() {
        detenerAutoPlay();
        iniciarAutoPlay();
    }

    const flechaIzq = document.querySelector('.flecha-izquierda');
    const flechaDer = document.querySelector('.flecha-derecha');
    
    if (flechaIzq) flechaIzq.addEventListener('click', () => moverSlide(-1));
    if (flechaDer) flechaDer.addEventListener('click', () => moverSlide(1));
    
    const indicadores = document.querySelectorAll('.indicador');
    indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => irASlide(index));
    });

    if (document.querySelector('.carrusel')) {
        iniciarAutoPlay();

        const carrusel = document.querySelector('.carrusel');
        if (carrusel) {
            carrusel.addEventListener('mouseenter', detenerAutoPlay);
            carrusel.addEventListener('mouseleave', iniciarAutoPlay);
        }
    }
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('¡Gracias! Te has suscrito con: ' + email);
            this.reset();
        });
    }
}

function initReservaForm() {
    const formReserva = document.getElementById('formReserva');
    if (formReserva) {
        formReserva.addEventListener('submit', function(e) {
            e.preventDefault();
            
            this.style.display = 'none';
            const mensajeExito = document.getElementById('mensajeExito');
            if (mensajeExito) {
                mensajeExito.style.display = 'block';
            }
        });

        const fechaInput = formReserva.querySelector('input[name="fecha"]');
        if (fechaInput) {
            fechaInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMenuResponsive();
    initScrollEffects();
    initReadingProgressBar();
    initAnimatedCounters();
    initCarousel();
    initNewsletterForm();
    initReservaForm();
});
