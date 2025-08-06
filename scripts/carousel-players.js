class PlayersCarousel {
    constructor() {
        this.track = document.querySelector('.players-swiper');
        this.slides = document.querySelectorAll('.players__card');
        this.prevBtn = document.querySelector('.players-carousel__button.prev-button');
        this.nextBtn = document.querySelector('.players-carousel__button.next-button');
        this.originalSlidesCount = this.slides.length;
        this.currentSlide = 1; // Начинаем с 1, так как 0 - это клон последнего слайда
        this.totalSlides = this.originalSlidesCount;
        this.slideWidth = 100 / 3; // 3 слайда на десктопе
        this.autoPlayInterval = null;
        this.autoPlayDelay = 3000; // 4 секунды = 3 секунды + время на переход
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.createInfiniteLoop();
        this.updateSlideCounter();
        this.bindEvents();
        this.startAutoPlay();
        this.updateSlideWidth();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            this.updateSlideWidth();
        });
    }
    
    createInfiniteLoop() {
        // Создаем клоны всех слайдов для бесконечного цикла
        const slidesArray = Array.from(this.slides);
        
        // Добавляем клоны последних слайдов в начало (для плавного перехода назад)
        for (let i = slidesArray.length - 1; i >= 0; i--) {
            const clone = slidesArray[i].cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
        }
        
        // Добавляем клоны первых слайдов в конец (для плавного перехода вперед)
        for (let i = 0; i < slidesArray.length; i++) {
            const clone = slidesArray[i].cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        }
        
        // Обновляем слайды после добавления клонов
        this.slides = document.querySelectorAll('.players__card');
        
        // Устанавливаем начальную позицию (показываем первый настоящий слайд)
        // Позиция = количество клонов в начале (originalSlidesCount)
        this.goToSlide(this.originalSlidesCount, false);
    }
    
    updateSlideWidth() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.slideWidth = 100; // 1 слайд на мобилке
        } else {
            this.slideWidth = 100 / 3; // 3 слайда на десктопе
        }
        
        // Обновляем позицию при изменении размера
        this.goToSlide(this.currentSlide, false);
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Пауза автопрокрутки при наведении
        this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Пауза при фокусе на кнопках
        this.prevBtn.addEventListener('focus', () => this.pauseAutoPlay());
        this.nextBtn.addEventListener('focus', () => this.pauseAutoPlay());
        
        // Возобновление автопрокрутки при потере фокуса
        this.prevBtn.addEventListener('blur', () => this.startAutoPlay());
        this.nextBtn.addEventListener('blur', () => this.startAutoPlay());
        
        // Поддержка свайпов на мобилке
        this.initTouchEvents();
        
        // Обработка окончания анимации для бесконечного цикла
        this.track.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });
    }
    
    initTouchEvents() {
        let startX = 0;
        let endX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - endX;
            const threshold = 50; // Минимальное расстояние для свайпа
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });
    }
    
    goToSlide(index, animate = true) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Вычисляем позицию для слайда
        const translateX = -(index * this.slideWidth);
        
        if (animate) {
            if (window.innerWidth > 768) {
                this.track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                this.track.style.transition = 'transform 1s ease-in-out';
            }
            
        } else {
            this.track.style.transition = 'none';
        }
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        this.currentSlide = index;
        this.updateSlideCounter();
        
        if (!animate) {
            this.isTransitioning = false;
        }
    }
    
    handleTransitionEnd() {
        this.isTransitioning = false;
        
        // Если мы вышли за пределы оригинальных слайдов, перепрыгиваем к соответствующему оригинальному слайду
        if (this.currentSlide < this.originalSlidesCount) {
            // Мы на клоне в начале - перепрыгиваем к соответствующему слайду в конце
            const targetIndex = this.currentSlide + this.originalSlidesCount;
            this.goToSlide(targetIndex, false);
        } else if (this.currentSlide >= this.originalSlidesCount * 2) {
            // Мы на клоне в конце - перепрыгиваем к соответствующему слайду в начале
            const targetIndex = this.currentSlide - this.originalSlidesCount;
            this.goToSlide(targetIndex, false);
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        this.goToSlide(this.currentSlide - 1);
    }
    
    updateSlideCounter() {
        const currentSlideElement = document.querySelector('.players-carousel__controls .current-slide');
        const totalSlidesElement = document.querySelector('.players-carousel__controls .total-slides');
        
        // Вычисляем номер настоящего слайда (без учета клонов)
        let realSlideNumber = this.currentSlide - this.originalSlidesCount + 1;
        
        // Обрабатываем случаи, когда мы на клонах
        if (this.currentSlide < this.originalSlidesCount) {
            realSlideNumber = this.currentSlide + 1;
        } else if (this.currentSlide >= this.originalSlidesCount * 2) {
            realSlideNumber = this.currentSlide - this.originalSlidesCount * 2 + 1;
        }
        
        // Показываем номер текущего слайда (начиная с 1)
        currentSlideElement.textContent = realSlideNumber;
        
        // Показываем общее количество слайдов
        totalSlidesElement.textContent = this.totalSlides;
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Инициализация карусели после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new PlayersCarousel();
});

// Дополнительные функции для улучшения UX
document.addEventListener('visibilitychange', () => {
    const carousel = document.querySelector('.players-swiper')?.carousel;
    if (document.hidden) {
        // Пауза автопрокрутки когда вкладка неактивна
        if (carousel) carousel.pauseAutoPlay();
    } else {
        // Возобновление автопрокрутки когда вкладка активна
        if (carousel) carousel.startAutoPlay();
    }
}); 