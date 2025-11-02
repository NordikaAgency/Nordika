function initMenuResponsive() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.navbar-link, .navbar-btn').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
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

    // Almacenar los valores objetivo de cada contador
    const objetivos = Array.from(counters).map(counter => {
        // Obtener el valor objetivo del atributo data-target o del texto
        const targetValue = counter.getAttribute('data-target') || counter.textContent.trim();
        // Inicializar el contador en 0
        counter.textContent = '0';
        counter.setAttribute('data-target', targetValue);
        return parseInt(targetValue) || 0;
    });

    let animado = false;

    function animarContadores() {
        if (animado) return;
        animado = true;
        
        counters.forEach((counter, index) => {
            const objetivo = objetivos[index];
            if (!objetivo) return;
            
            let actual = 0;
            const duracion = 2500; // 2.5 segundos
            const intervalo = 20; // Más suave con intervalos más cortos
            const pasos = duracion / intervalo;
            const incremento = objetivo / pasos;
            
            const timer = setInterval(() => {
                actual += incremento;
                if (actual >= objetivo) {
                    counter.textContent = objetivo;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(actual);
                }
            }, intervalo);
        });
    }

    // Usar Intersection Observer API para mejor detección de visibilidad
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animado) {
                    animarContadores();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3, // Activar cuando el 30% de la sección sea visible
            rootMargin: '0px'
        });
        
        observer.observe(statsSection);
    } else {
        // Fallback para navegadores antiguos
        function verificarVisibilidad() {
            const rect = statsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && !animado) {
                animarContadores();
                window.removeEventListener('scroll', verificarVisibilidad);
            }
        }
        
        window.addEventListener('scroll', verificarVisibilidad);
        window.addEventListener('load', verificarVisibilidad);
        verificarVisibilidad();
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
