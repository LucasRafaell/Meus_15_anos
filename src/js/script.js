// Contagem Regressiva
const countdown = () => {
    const eventDate = new Date("2025-05-17T20:00:00").getTime(); // Defina a data do evento aqui
    const now = new Date().getTime();
    const difference = eventDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    if (difference < 0) {
        clearInterval(interval);
        document.getElementById("timer").innerText = "O evento começou!";
    }
};

// Ajuste fino para manter proporções em telas muito pequenas
function adjustTimerProportions() {
    const timer = document.getElementById('timer');
    if (window.innerWidth < 400) {
        timer.style.transform = 'scale(0.9)';
    } else if (window.innerWidth < 500) {
        timer.style.transform = 'scale(0.95)';
    } else {
        timer.style.transform = 'scale(1)';
    }
}

// Executar ao carregar e redimensionar
window.addEventListener('load', adjustTimerProportions);
window.addEventListener('resize', adjustTimerProportions);

const interval = setInterval(countdown, 1000);

// Carrossel de Fotos - Código Aprimorado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do carrossel
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const totalItems = items.length;
    let autoScrollInterval;

    // Inicialização do carrossel
    function initCarousel() {
        createDots();
        createThumbnails();
        startAutoScroll();
        setupEventListeners();
        enforceImageTransparency();
        setupModal();
        adjustImageSizes();
    }

    // Criar indicadores de pontos
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToItem(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Criar miniaturas
    function createThumbnails() {
        const thumbnailsContainer = document.querySelector('.carousel-thumbnails');
        if (!thumbnailsContainer) return;
        
        thumbnailsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const imgSrc = item.querySelector('img').src;
            const thumbnail = document.createElement('img');
            thumbnail.src = imgSrc;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.dataset.index = index;
            
            thumbnail.addEventListener('click', () => {
                goToItem(index);
            });
            
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Configurar modal
    function setupModal() {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeModal = document.querySelector('.close-modal');

        items.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const caption = this.querySelector('.image-caption');
                modal.style.display = "block";
                modalImg.src = img.src;
                modalCaption.textContent = caption ? caption.textContent : '';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = "none";
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // Ajustar tamanho das imagens proporcionalmente
    function adjustImageSizes() {
        const carouselHeight = document.querySelector('.carousel-container').offsetHeight;
        const carouselWidth = document.querySelector('.carousel-container').offsetWidth;
        
        items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;
            
            // Esperar a imagem carregar se ainda não tiver dimensões
            if (img.naturalWidth === 0) {
                img.addEventListener('load', adjustImageSizes);
                return;
            }
            
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const containerRatio = carouselWidth / carouselHeight;
            
            if (imgRatio > containerRatio) {
                // Imagem mais larga que o container
                img.style.width = '90%';
                img.style.height = 'auto';
            } else {
                // Imagem mais alta que o container
                img.style.width = 'auto';
                img.style.height = '80%';
            }
            
            // Centralizar verticalmente se necessário
            img.style.alignSelf = 'center';
        });
    }

    // Atualizar a posição do carrossel
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        updateThumbnails();
        resetAutoScroll();
    }

    // Atualizar os pontos ativos
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Atualizar miniaturas ativas
    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.carousel-thumbnails img');
        if (!thumbnails) return;
        
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
    }

    // Navegar para um item específico
    function goToItem(index) {
        currentIndex = (index + totalItems) % totalItems;
        updateCarousel();
    }

    // Próximo item
    function nextItem() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    // Item anterior
    function prevItem() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    // Configurar auto-scroll
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextItem, 5000);
    }

    // Reiniciar auto-scroll
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }

    // Configurar eventos de toque
    function setupTouchEvents() {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    // Manipular gesto de deslize
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextItem();
        if (touchEndX > touchStartX + 50) prevItem();
    }

    // Garantir transparência das imagens
    function enforceImageTransparency() {
        document.querySelectorAll('.carousel-item img').forEach(img => {
            img.style.backgroundColor = 'transparent';
            
            // Tratamento especial para JPG/JPEG
            if (/\.(jpg|jpeg)$/i.test(img.src)) {
                img.style.mixBlendMode = 'multiply';
                img.style.filter = 'brightness(1.05) drop-shadow(0 4px 12px rgba(30, 58, 138, 0.25))';
            }
        });
    }

    // Configurar listeners de eventos
    function setupEventListeners() {
        // Controles de navegação
        nextBtn.addEventListener('click', nextItem);
        prevBtn.addEventListener('click', prevItem);
        
        // Eventos de toque
        setupTouchEvents();
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('imageModal');
            if (modal && modal.style.display === "block") {
                if (e.key === 'Escape') {
                    modal.style.display = "none";
                } else if (e.key === 'ArrowRight') {
                    nextItem();
                } else if (e.key === 'ArrowLeft') {
                    prevItem();
                }
            } else {
                if (e.key === 'ArrowRight') nextItem();
                if (e.key === 'ArrowLeft') prevItem();
            }
        });
        
        // Pausar ao interagir
        carousel.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
        carousel.addEventListener('mouseleave', startAutoScroll);
        
        // Garantir transparência quando as imagens carregam
        document.querySelectorAll('.carousel-item img').forEach(img => {
            if (img.complete) {
                enforceImageTransparency();
                adjustImageSizes();
            } else {
                img.addEventListener('load', enforceImageTransparency);
                img.addEventListener('load', adjustImageSizes);
            }
        });
    }

    // Inicializar o carrossel aprimorado
    initCarousel();

    // Ajustar imagens ao redimensionar
    window.addEventListener('resize', adjustImageSizes);
});

// Atualizar ano no rodapé
document.getElementById('current-year').textContent = new Date().getFullYear();