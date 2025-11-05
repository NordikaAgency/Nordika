function initMenuResponsive() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
        
        document.querySelectorAll('.navbar-link, .navbar-btn').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    }
}

function initScrollEffects() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top') || document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });
    
    function scrollToTop() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const scrollStep = -window.scrollY / (500 / 15);
            const scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        }
    }
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });
    }
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

    const objetivos = Array.from(counters).map(counter => {
        const targetValue = counter.getAttribute('data-target') || counter.textContent.trim();
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
            const duracion = 2500;
            const intervalo = 20;
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

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animado) {
                    animarContadores();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });
        
        observer.observe(statsSection);
    } else {
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

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const notification = document.querySelector('.chatbot-notification');
    
    if (!chatbotToggle || !chatbotWindow || !chatbotClose) {
        console.warn('Chatbot: Elementos necesarios no encontrados');
        return;
    }
    
    let isOpen = false;
    
    const botResponses = {
        saludo: [
            "¡Hola! 👋 Soy el asistente virtual de Nordika. ¿En qué puedo ayudarte hoy?",
            "¡Hola! Bienvenido a Nordika. ¿Tienes alguna pregunta sobre nuestros destinos nórdicos?",
            "¡Hola! Estoy aquí para ayudarte a planificar tu viaje perfecto. ¿Qué te gustaría saber?"
        ],
        despedida: [
            "¡Hasta luego! Espero que encuentres el viaje perfecto. ¡Que tengas un excelente día!",
            "¡Adiós! Si tienes más preguntas, no dudes en escribirme. ¡Buen viaje!",
            "¡Hasta pronto! Estamos aquí para ayudarte cuando lo necesites."
        ],
        destinos: [
            "Ofrecemos viajes a Suecia, Noruega, Dinamarca, Finlandia e Islandia. También tenemos un tour completo de Escandinavia. ¿Te interesa algún destino en particular?",
            "Tenemos 5 increíbles destinos nórdicos: Suecia con sus ciudades modernas, Noruega con sus fiordos, Dinamarca con su cultura, Finlandia con sus lagos, e Islandia con sus paisajes volcánicos.",
            "Puedes explorar Suecia, Noruega, Dinamarca, Finlandia e Islandia. Cada uno tiene algo único que ofrecer. ¿Cuál te llama más la atención?"
        ],
        suecia: [
            "Suecia es un destino increíble. Ofrecemos viajes a Estocolmo, Gotemburgo, Malmö y Visby. ¿Te gustaría saber más sobre algún lugar específico de Suecia?",
            "Suecia tiene mucho que ofrecer: ciudades modernas como Estocolmo, paisajes naturales impresionantes y una rica cultura. ¿Qué te interesa más de Suecia?"
        ],
        estocolmo: [
            "Estocolmo, la capital de Suecia, es conocida como 'la Venecia del Norte'. Es una ciudad construida sobre 14 islas conectadas por puentes. Puedes visitar el Palacio Real, Gamla Stan (el casco antiguo), y el Museo Vasa. ¿Te interesa más información sobre nuestros viajes a Estocolmo?",
            "Estocolmo es una ciudad fascinante con arquitectura moderna y casco antiguo histórico. Ofrecemos tours que incluyen visitas al museo Vasa, el barrio Gamla Stan y los archipiélagos. ¿Qué te gustaría saber?"
        ],
        gotemburgo: [
            "Gotemburgo es la segunda ciudad más grande de Suecia, famosa por su puerto, su cultura gastronómica y su ambiente relajado. Es perfecta para explorar la costa oeste de Suecia. ¿Te gustaría más información?",
            "Gotemburgo ofrece una experiencia más relajada que Estocolmo, con excelente comida nórdica, canales hermosos y acceso a los archipiélagos. ¿Qué te interesa saber?"
        ],
        malmo: [
            "Malmö es una ciudad sueca moderna y multicultural, conectada con Copenhague por el puente de Öresund. Conoce la arquitectura contemporánea, el parque Pildammsparken y la playa de Ribersborg. ¿Te interesa?",
            "Malmö combina lo mejor de Suecia y Dinamarca. Es perfecta para una visita si estás en Copenhague. Tiene una escena cultural vibrante y excelente gastronomía. ¿Qué te gustaría saber?"
        ],
        visby: [
            "Visby es una ciudad medieval en la isla de Gotland, declarada Patrimonio de la Humanidad por la UNESCO. Sus murallas medievales, callejuelas empedradas y ruinas históricas la hacen única. ¿Te interesa este destino?",
            "Visby es como viajar en el tiempo. Esta ciudad medieval en Gotland ofrece historia, naturaleza y playas hermosas. Perfecta para una experiencia diferente en Suecia. ¿Quieres más información?"
        ],
        noruega: [
            "Noruega es famosa por sus fiordos espectaculares. Ofrecemos viajes a Oslo, Bergen, Tromsø, Geiranger y Trondheim. ¿Te interesa algún destino específico?",
            "Noruega es perfecta para ver la aurora boreal y disfrutar de la naturaleza. Las ciudades de Oslo y Bergen son maravillosas. ¿Qué te gustaría saber?"
        ],
        oslo: [
            "Oslo es la capital de Noruega y combina naturaleza y cultura urbana. Puedes visitar el Museo de Barcos Vikingos, el Parque de Vigeland, el Museo Munch, y disfrutar del fiordo de Oslo. ¿Te interesa conocer más sobre nuestros paquetes a Oslo?",
            "Oslo ofrece una experiencia única: museos de clase mundial, arquitectura moderna, y fácil acceso a la naturaleza noruega. Es perfecta para una primera visita a Noruega. ¿Qué te gustaría saber?"
        ],
        bergen: [
            "Bergen es conocida como 'la puerta de entrada a los fiordos'. Es una ciudad colorida con el barrio histórico de Bryggen (Patrimonio de la Humanidad), y es el punto de partida perfecto para explorar los fiordos noruegos. ¿Te interesa?",
            "Bergen es una ciudad encantadora con casas de madera de colores, excelente gastronomía de mariscos, y acceso directo a los fiordos más espectaculares de Noruega. ¿Quieres más información?"
        ],
        tromso: [
            "Tromsø es conocida como 'la capital del Ártico' y es uno de los mejores lugares del mundo para ver la aurora boreal. También puedes disfrutar de trineos tirados por perros, paseos en moto de nieve y la cultura sami. ¿Te interesa?",
            "Tromsø es el destino perfecto para ver la aurora boreal de septiembre a marzo. Esta ciudad universitaria ofrece actividades únicas como excursiones en trineo y observación de ballenas. ¿Qué te gustaría saber?"
        ],
        geiranger: [
            "Geiranger es famoso por su fiordo, declarado Patrimonio de la Humanidad. Es uno de los paisajes más espectaculares de Noruega, con cascadas impresionantes y montañas majestuosas. ¿Te interesa este destino?",
            "El Fiordo de Geiranger es una de las maravillas naturales de Noruega. Ofrecemos tours que incluyen cruceros por el fiordo y vistas panorámicas desde las montañas. ¿Quieres más información?"
        ],
        trondheim: [
            "Trondheim es una ciudad histórica con la magnífica Catedral de Nidaros, una arquitectura colorida a orillas del río, y una rica historia vikinga. Es perfecta para conocer la cultura noruega. ¿Te interesa?",
            "Trondheim combina historia medieval con una vida universitaria moderna. Es conocida por su música, su arquitectura de madera de colores y su ambiente acogedor. ¿Qué te gustaría saber?"
        ],
        dinamarca: [
            "Dinamarca es encantadora. Ofrecemos viajes a Copenhague, Aarhus, Odense y Legoland. ¿Te interesa algún lugar en particular?",
            "Dinamarca tiene una cultura rica y ciudades hermosas como Copenhague. ¿Qué te gustaría saber sobre nuestros viajes a Dinamarca?"
        ],
        copenhague: [
            "Copenhague es una de las ciudades más felices del mundo. Puedes visitar la Sirenita, el barrio Nyhavn con sus casas coloridas, el Palacio de Amalienborg, y disfrutar de la cocina nórdica. ¿Te interesa más información?",
            "Copenhague combina diseño moderno con historia real. Ofrecemos tours que incluyen Tivoli Gardens, el castillo de Kronborg (inspiración de Hamlet), y el distrito de Christiania. ¿Qué te gustaría saber?"
        ],
        aarhus: [
            "Aarhus es la segunda ciudad más grande de Dinamarca y la Capital Europea de la Cultura. Tiene museos increíbles como ARoS, un casco antiguo reconstruido, y una escena artística vibrante. ¿Te interesa?",
            "Aarhus ofrece una experiencia más relajada que Copenhague, con excelentes museos, arquitectura moderna y una vida cultural activa. Es perfecta para conocer la Dinamarca auténtica. ¿Quieres más información?"
        ],
        odense: [
            "Odense es la ciudad natal de Hans Christian Andersen, el famoso autor de cuentos de hadas. Puedes visitar su casa museo, el casco antiguo encantador, y disfrutar de la atmósfera de cuento de hadas. ¿Te interesa?",
            "Odense es una ciudad llena de historia y magia, perfecta para familias. Conoce la vida de Andersen, explora castillos cercanos y disfruta de la cultura danesa. ¿Qué te gustaría saber?"
        ],
        legoland: [
            "Legoland en Billund es el parque temático original de LEGO, perfecto para familias con niños. Tiene atracciones, shows, y construcciones increíbles hechas con millones de piezas LEGO. ¿Te interesa este destino?",
            "Legoland es una experiencia única para toda la familia. Ofrecemos paquetes que incluyen entradas al parque y alojamiento. Es una de las atracciones más populares de Dinamarca. ¿Quieres más información?"
        ],
        finlandia: [
            "Finlandia es la tierra de los mil lagos. Ofrecemos viajes a Helsinki, Rovaniemi (donde vive Papá Noel), Tampere, Turku y las islas Åland. ¿Qué te interesa?",
            "Finlandia es perfecta para ver la aurora boreal y disfrutar de la naturaleza. Rovaniemi es ideal para familias. ¿Te gustaría más información?"
        ],
        helsinki: [
            "Helsinki es la capital de Finlandia, conocida por su diseño nórdico, arquitectura moderna y cultura del sauna. Puedes visitar la Fortaleza de Suomenlinna, la Catedral, y el mercado del puerto. ¿Te interesa?",
            "Helsinki combina diseño finlandés, gastronomía nórdica y una ubicación única entre el mar y la naturaleza. Es perfecta para una primera visita a Finlandia. ¿Qué te gustaría saber?"
        ],
        rovaniemi: [
            "Rovaniemi es la capital oficial de Laponia y la casa de Papá Noel. Puedes visitar la Oficina de Papá Noel, cruzar el Círculo Polar Ártico, ver la aurora boreal, y disfrutar de trineos tirados por renos. ¿Te interesa?",
            "Rovaniemi es el destino perfecto para familias y amantes de la naturaleza ártica. Ofrecemos experiencias únicas como la aurora boreal, safaris en trineo y encuentros con renos. ¿Quieres más información?"
        ],
        tampere: [
            "Tampere es una ciudad industrial convertida en centro cultural moderno. Tiene museos interesantes, vida nocturna animada, y está rodeada de lagos. Es conocida como 'la Manchester de Finlandia'. ¿Te interesa?",
            "Tampere ofrece una experiencia diferente: arquitectura industrial, cultura alternativa, y acceso fácil a los lagos finlandeses. Es perfecta para conocer Finlandia fuera de Helsinki. ¿Qué te gustaría saber?"
        ],
        turku: [
            "Turku es la ciudad más antigua de Finlandia y antigua capital. Tiene un castillo medieval, una catedral histórica, y un río hermoso. Es perfecta para conocer la historia finlandesa. ¿Te interesa?",
            "Turku combina historia medieval con vida moderna. Puedes visitar el castillo, explorar el archipiélago, y disfrutar de la gastronomía finlandesa. ¿Quieres más información?"
        ],
        islandia: [
            "Islandia es única con sus paisajes volcánicos. Ofrecemos viajes a Reikiavik, el Círculo Dorado, la Laguna Azul y la Costa Sur. ¿Qué te interesa más?",
            "Islandia es increíble para ver géiseres, glaciares y la aurora boreal. ¿Te gustaría saber más sobre nuestros paquetes a Islandia?"
        ],
        reikiavik: [
            "Reikiavik es la capital más septentrional del mundo y la puerta de entrada a Islandia. Puedes visitar la iglesia Hallgrímskirkja, el museo Perlan, disfrutar de la vida nocturna única, y hacer excursiones a la naturaleza. ¿Te interesa?",
            "Reikiavik es una ciudad pequeña pero vibrante, perfecta como base para explorar Islandia. Ofrecemos tours que incluyen la ciudad y excursiones al Círculo Dorado y la Laguna Azul. ¿Qué te gustaría saber?"
        ],
        circuloDorado: [
            "El Círculo Dorado es la ruta más popular de Islandia. Incluye el Parque Nacional Thingvellir, el géiser Strokkur, y la cascada Gullfoss. Es una excursión de un día desde Reikiavik. ¿Te interesa?",
            "El Círculo Dorado es imprescindible en Islandia. Puedes ver la falla entre placas tectónicas en Thingvellir, géiseres activos y la poderosa cascada Gullfoss. Ofrecemos tours guiados. ¿Quieres más información?"
        ],
        lagunaAzul: [
            "La Laguna Azul (Blue Lagoon) es una de las atracciones más famosas de Islandia. Es un spa geotérmico con aguas turquesas ricas en minerales. Perfecta para relajarse después de un día de turismo. ¿Te interesa?",
            "La Laguna Azul es una experiencia única en Islandia. Ofrecemos paquetes que incluyen entrada y transporte desde Reikiavik. Es ideal para relajarse y disfrutar de las aguas geotérmicas. ¿Qué te gustaría saber?"
        ],
        costaSur: [
            "La Costa Sur de Islandia es espectacular, con cascadas como Seljalandsfoss y Skógafoss, playas de arena negra en Reynisfjara, y glaciares. Es una de las rutas más bellas de Islandia. ¿Te interesa?",
            "La Costa Sur ofrece paisajes increíbles: cascadas, glaciares, playas volcánicas y la aurora boreal en invierno. Ofrecemos tours de un día o varios días. ¿Quieres más información?"
        ],
        precio: [
            "Los precios varían según el destino y la temporada. Te recomiendo visitar nuestra página de reservas o contactarnos directamente para obtener un presupuesto personalizado.",
            "Para información sobre precios y paquetes, puedes revisar nuestra sección de reservas o contactarnos por WhatsApp o email. Estaremos encantados de ayudarte.",
            "Tenemos diferentes opciones de paquetes. Para obtener información detallada de precios, te sugiero que visites la página de reservas o nos contactes directamente."
        ],
        aurora: [
            "La aurora boreal es uno de los fenómenos más espectaculares de los países nórdicos. Se puede ver principalmente en Noruega, Finlandia e Islandia. La mejor temporada es de septiembre a marzo.",
            "¡La aurora boreal es increíble! Los mejores lugares para verla son el norte de Noruega (Tromsø), Finlandia (Rovaniemi) e Islandia. La temporada óptima es durante los meses de invierno.",
            "La aurora boreal es visible en los países nórdicos durante el invierno. Noruega, Finlandia e Islandia son destinos ideales para esta experiencia única."
        ],
        contacto: [
            "Puedes contactarnos por WhatsApp, email (nordikaagency@gmail.com), o a través de nuestras redes sociales. Estamos aquí para ayudarte.",
            "Estamos disponibles en WhatsApp, email y redes sociales (Facebook, Instagram, YouTube, LinkedIn). ¡Escríbenos cuando quieras!",
            "Puedes comunicarte con nosotros por WhatsApp, email o nuestras redes sociales. Estaremos encantados de ayudarte a planificar tu viaje."
        ],
        info: [
            "Nordika es una agencia de viajes especializada en países nórdicos. Ofrecemos experiencias únicas en Suecia, Noruega, Dinamarca, Finlandia e Islandia. ¿Qué te gustaría saber?",
            "Somos Nordika, especialistas en viajes nórdicos con más de 15 años de experiencia. ¿En qué puedo ayudarte hoy?",
            "Nordika ofrece viajes personalizados a los países nórdicos. Tenemos un 98% de satisfacción y más de 2500 viajeros felices. ¿Qué te interesa?"
        ],
        default: [
            "Gracias por tu mensaje. Puedo ayudarte con información sobre nuestros destinos (Suecia, Noruega, Dinamarca, Finlandia, Islandia), precios, la aurora boreal, o cómo contactarnos. ¿Qué te gustaría saber?",
            "Entiendo tu pregunta. Para ayudarte mejor, ¿podrías contarme si te interesa algún destino específico, precios, o información de contacto?",
            "Puedo ayudarte con información sobre nuestros destinos nórdicos, precios, la aurora boreal, o cómo contactarnos. ¿Qué te gustaría saber?"
        ]
    };
    
    function getBotResponse(message) {
        const msg = message.toLowerCase().trim();
        
        const msgNormalized = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (msg.match(/^(hola|hi|hey|buenos dias|buenas tardes|buenas noches|saludos|que tal|como estas|good morning|good afternoon)/i) || 
            msgNormalized.match(/^(hola|hi|hey|buenos dias|buenas tardes|buenas noches|saludos|que tal|como estas)/i)) {
            return botResponses.saludo[Math.floor(Math.random() * botResponses.saludo.length)];
        }
        
        if (msg.match(/(adios|chau|hasta luego|bye|nos vemos|gracias|muchas gracias|thank you|chao|hasta pronto)/i) ||
            msgNormalized.match(/(adios|chau|hasta luego|bye|nos vemos|gracias|muchas gracias|chao|hasta pronto)/i)) {
            return botResponses.despedida[Math.floor(Math.random() * botResponses.despedida.length)];
        }
        
        if (msg.match(/\b(estocolmo|stockholm)\b/i) || msgNormalized.match(/\b(estocolmo|stockholm)\b/i)) {
            return botResponses.estocolmo[Math.floor(Math.random() * botResponses.estocolmo.length)];
        }
        if (msg.match(/\b(gotemburgo|gothenburg|goteborg)\b/i) || msgNormalized.match(/\b(gotemburgo|gothenburg|goteborg)\b/i)) {
            return botResponses.gotemburgo[Math.floor(Math.random() * botResponses.gotemburgo.length)];
        }
        if (msg.match(/\b(malmo|malmö)\b/i) || msgNormalized.match(/\b(malmo|malmo)\b/i)) {
            return botResponses.malmo[Math.floor(Math.random() * botResponses.malmo.length)];
        }
        if (msg.match(/\b(visby)\b/i) || msgNormalized.match(/\b(visby)\b/i)) {
            return botResponses.visby[Math.floor(Math.random() * botResponses.visby.length)];
        }
        
        if (msg.match(/\b(oslo)\b/i) || msgNormalized.match(/\b(oslo)\b/i)) {
            return botResponses.oslo[Math.floor(Math.random() * botResponses.oslo.length)];
        }
        if (msg.match(/\b(bergen)\b/i) || msgNormalized.match(/\b(bergen)\b/i)) {
            return botResponses.bergen[Math.floor(Math.random() * botResponses.bergen.length)];
        }
        if (msg.match(/\b(tromso|tromsø)\b/i) || msgNormalized.match(/\b(tromso)\b/i)) {
            return botResponses.tromso[Math.floor(Math.random() * botResponses.tromso.length)];
        }
        if (msg.match(/\b(geiranger)\b/i) || msgNormalized.match(/\b(geiranger)\b/i)) {
            return botResponses.geiranger[Math.floor(Math.random() * botResponses.geiranger.length)];
        }
        if (msg.match(/\b(trondheim)\b/i) || msgNormalized.match(/\b(trondheim)\b/i)) {
            return botResponses.trondheim[Math.floor(Math.random() * botResponses.trondheim.length)];
        }
        
        if (msg.match(/\b(copenhague|copenhagen)\b/i) || msgNormalized.match(/\b(copenhague|copenhagen)\b/i)) {
            return botResponses.copenhague[Math.floor(Math.random() * botResponses.copenhague.length)];
        }
        if (msg.match(/\b(aarhus)\b/i) || msgNormalized.match(/\b(aarhus)\b/i)) {
            return botResponses.aarhus[Math.floor(Math.random() * botResponses.aarhus.length)];
        }
        if (msg.match(/\b(odense)\b/i) || msgNormalized.match(/\b(odense)\b/i)) {
            return botResponses.odense[Math.floor(Math.random() * botResponses.odense.length)];
        }
        if (msg.match(/\b(legoland)\b/i) || msgNormalized.match(/\b(legoland)\b/i)) {
            return botResponses.legoland[Math.floor(Math.random() * botResponses.legoland.length)];
        }
        
        if (msg.match(/\b(helsinki)\b/i) || msgNormalized.match(/\b(helsinki)\b/i)) {
            return botResponses.helsinki[Math.floor(Math.random() * botResponses.helsinki.length)];
        }
        if (msg.match(/\b(rovaniemi)\b/i) || msgNormalized.match(/\b(rovaniemi)\b/i)) {
            return botResponses.rovaniemi[Math.floor(Math.random() * botResponses.rovaniemi.length)];
        }
        if (msg.match(/\b(tampere)\b/i) || msgNormalized.match(/\b(tampere)\b/i)) {
            return botResponses.tampere[Math.floor(Math.random() * botResponses.tampere.length)];
        }
        if (msg.match(/\b(turku)\b/i) || msgNormalized.match(/\b(turku)\b/i)) {
            return botResponses.turku[Math.floor(Math.random() * botResponses.turku.length)];
        }
        
        if (msg.match(/\b(reikiavik|reykjavik)\b/i) || msgNormalized.match(/\b(reikiavik|reykjavik)\b/i)) {
            return botResponses.reikiavik[Math.floor(Math.random() * botResponses.reikiavik.length)];
        }
        if (msg.match(/\b(circulo dorado|golden circle|thingvellir|gullfoss|strokkur)\b/i) || 
            msgNormalized.match(/\b(circulo dorado|golden circle|thingvellir|gullfoss|strokkur)\b/i)) {
            return botResponses.circuloDorado[Math.floor(Math.random() * botResponses.circuloDorado.length)];
        }
        if (msg.match(/\b(laguna azul|blue lagoon)\b/i) || 
            msgNormalized.match(/\b(laguna azul|blue lagoon)\b/i)) {
            return botResponses.lagunaAzul[Math.floor(Math.random() * botResponses.lagunaAzul.length)];
        }
        if (msg.match(/\b(costa sur|south coast|seljalandsfoss|skogafoss|reynisfjara)\b/i) || 
            msgNormalized.match(/\b(costa sur|south coast|seljalandsfoss|skogafoss|reynisfjara)\b/i)) {
            return botResponses.costaSur[Math.floor(Math.random() * botResponses.costaSur.length)];
        }
        
        if (msg.match(/\b(suecia|sueco|suecos)\b/i) ||
            msgNormalized.match(/\b(suecia|sueco|suecos)\b/i)) {
            return botResponses.suecia[Math.floor(Math.random() * botResponses.suecia.length)];
        }
        
        if (msg.match(/\b(noruega|fiordos|fiordo|noruego|noruegos)\b/i) ||
            msgNormalized.match(/\b(noruega|fiordos|fiordo|noruego|noruegos)\b/i)) {
            return botResponses.noruega[Math.floor(Math.random() * botResponses.noruega.length)];
        }
        
        if (msg.match(/\b(dinamarca|danes|daneses)\b/i) ||
            msgNormalized.match(/\b(dinamarca|danes|daneses)\b/i)) {
            return botResponses.dinamarca[Math.floor(Math.random() * botResponses.dinamarca.length)];
        }
        
        if (msg.match(/\b(finlandia|finlandes|finlandeses)\b/i) ||
            msgNormalized.match(/\b(finlandia|finlandes|finlandeses)\b/i)) {
            return botResponses.finlandia[Math.floor(Math.random() * botResponses.finlandia.length)];
        }
        
        if (msg.match(/\b(islandia|islandes|islandeses)\b/i) ||
            msgNormalized.match(/\b(islandia|islandes|islandeses)\b/i)) {
            return botResponses.islandia[Math.floor(Math.random() * botResponses.islandia.length)];
        }
        
        if (msg.match(/\b(aurora|boreal|northern lights|luces del norte|luces boreales|aurora polar|northern light)\b/i) ||
            msgNormalized.match(/\b(aurora|boreal|northern lights|luces del norte|luces boreales|aurora polar|northern light)\b/i)) {
            return botResponses.aurora[Math.floor(Math.random() * botResponses.aurora.length)];
        }
        
        if (msg.match(/\b(precio|precios|cost|cuanto|cuánto|cuesta|tarifa|tarifas|pago|pagar|reservar|reserva|paquete|paquetes|oferta|ofertas|descuento|descuentos|barato|cara|caro)\b/i) ||
            msgNormalized.match(/\b(precio|precios|cost|cuanto|cuesta|tarifa|tarifas|pago|pagar|reservar|reserva|paquete|paquetes|oferta|ofertas|descuento|descuentos|barato|cara|caro)\b/i)) {
            return botResponses.precio[Math.floor(Math.random() * botResponses.precio.length)];
        }
        
        if (msg.match(/\b(contacto|contactar|email|whatsapp|telefono|comunicar|hablar|llamar|escribir|mensaje|mensajear|redes sociales|facebook|instagram)\b/i) ||
            msgNormalized.match(/\b(contacto|contactar|email|whatsapp|telefono|comunicar|hablar|llamar|escribir|mensaje|mensajear|redes sociales|facebook|instagram)\b/i)) {
            return botResponses.contacto[Math.floor(Math.random() * botResponses.contacto.length)];
        }
        
        if (msg.match(/\b(quienes son|que es nordika|nordika|informacion|información|agencia|sobre ustedes|sobre la empresa)\b/i) ||
            msgNormalized.match(/\b(quienes son|que es nordika|nordika|informacion|informacion|agencia|sobre ustedes|sobre la empresa)\b/i)) {
            return botResponses.info[Math.floor(Math.random() * botResponses.info.length)];
        }
        
        if (msg.match(/\b(destino|destinos|pais|paises|viaje|viajar|viajes|turismo|turista|nordico|nordicos|escandinavia|escandinavo)\b/i) ||
            msgNormalized.match(/\b(destino|destinos|pais|paises|viaje|viajar|viajes|turismo|turista|nordico|nordicos|escandinavia|escandinavo)\b/i)) {
            return botResponses.destinos[Math.floor(Math.random() * botResponses.destinos.length)];
        }
        
        return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
        
        const time = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            ${text}
            <span class="chatbot-message-time">${time}</span>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function openChat(e) {
        if (e) e.stopPropagation();
        chatbotWindow.classList.add('chatbot-open');
        chatbotWindow.classList.remove('chatbot-closed');
        chatbotToggle.style.display = 'none';
        isOpen = true;
        
        if (chatbotClose) {
            chatbotClose.style.display = 'flex';
            chatbotClose.style.visibility = 'visible';
            chatbotClose.style.opacity = '1';
            chatbotClose.style.pointerEvents = 'auto';
            chatbotClose.style.zIndex = '10002';
        }
        
        const header = chatbotWindow.querySelector('.chatbot-header');
        if (header) {
            header.style.visibility = 'visible';
            header.style.opacity = '1';
            header.style.display = 'flex';
        }
        
        if (notification) {
            notification.style.display = 'none';
        }
        
        if (chatbotMessages.children.length === 0) {
            setTimeout(() => {
                addMessage(getBotResponse('hola'));
            }, 300);
        }
        
        chatbotInput.focus();
    }
    
    function closeChat(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        chatbotWindow.classList.remove('chatbot-open');
        chatbotWindow.classList.add('chatbot-closed');
        
        chatbotToggle.style.display = 'flex';
        chatbotToggle.style.visibility = 'visible';
        chatbotToggle.style.opacity = '1';
        
        isOpen = false;
        
        if (chatbotInput) {
            chatbotInput.blur();
        }
    }
    
    window.closeChatbot = closeChat;
    
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        addMessage(message, true);
        chatbotInput.value = '';
        
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, false);
        }, 800);
    }
    
    chatbotToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        openChat(e);
    });
    
    chatbotClose.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        closeChat(e);
        return false;
    });
    
    chatbotClose.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
        closeChat(e);
        return false;
    });
    
    chatbotClose.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        closeChat(e);
        return false;
    });
    
    chatbotClose.style.pointerEvents = 'auto';
    chatbotClose.style.cursor = 'pointer';
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    if (chatbotWindow) {
        chatbotWindow.addEventListener('click', function(e) {
            if (e.target !== chatbotClose && !chatbotClose.contains(e.target)) {
                e.stopPropagation();
            }
        });
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
    initChatbot();
});
