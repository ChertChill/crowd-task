class StepsCarousel {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        
        this.track = document.querySelector('.steps-swiper');
        this.slides = document.querySelectorAll('.steps__card');
        this.prevBtn = document.querySelector('.steps-carousel__button.prev-button');
        this.nextBtn = document.querySelector('.steps-carousel__button.next-button');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.slideWidth = 100; // 1 слайд на мобилке
        this.isTransitioning = false;

        // Для свайпов
        this.startX = 0;
        this.endX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.createDots();

        if (window.innerWidth < 768) {
            this.bindEvents();
            this.updateSlideWidth();
            this.updateButtonStates();
        }
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            const currentIsMobile = window.innerWidth < 768;

            if (currentIsMobile !== this.isMobile) {
                if (currentIsMobile) {
                    this.bindEvents();
                    this.updateSlideWidth();
                    this.updateButtonStates();
                } else {
                    this.destroy();
                    this.goToSlide(0, false);
                }

                this.isMobile = currentIsMobile;
            }

            this.updateSlideWidth();
        });
    }
    
    destroy() {
        // Удаляем все обработчики событий
        this.prevBtn.removeEventListener('click', this.prevSlide);
        this.nextBtn.removeEventListener('click', this.nextSlide);

        // Удаляем все обработчики событий для свайпов
        this.track.removeEventListener('touchstart', this.handleTouchStart);
        this.track.removeEventListener('touchmove', this.handleTouchMove);
        this.track.removeEventListener('touchend', this.handleTouchEnd);
        
        // Сбрасываем стили кнопок
        this.prevBtn.disabled = false;
        this.prevBtn.classList.remove('disabled');
        
        this.nextBtn.disabled = false;
        this.nextBtn.classList.remove('disabled');
        
        // Сбрасываем позицию карусели
        this.track.style.transform = 'translateX(0%)';
        this.track.style.transition = 'none';
    }
    
    createDots() {
        const dotsContainer = document.querySelector('.steps-carousel__controls .carousel-dots');
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    updateSlideWidth() {
        // Всегда 1 слайд на мобилке
        this.slideWidth = 100;
        
        // Обновляем позицию при изменении размера
        this.goToSlide(this.currentSlide, false);
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Поддержка свайпов на мобилке
        this.initTouchEvents();
    }
    
    initTouchEvents() {
        this.handleTouchStart = (e) => {
            this.startX = e.touches[0].clientX;
            this.isDragging = true;
        };

        this.handleTouchMove = (e) => {
            if (!this.isDragging) return;
            this.endX = e.touches[0].clientX;
        };

        this.handleTouchEnd = () => {
            if (!this.isDragging) return;

            const diff = this.startX - this.endX;
            const threshold = 50; // Минимальное расстояние для свайпа

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.isDragging = false;
        };

        this.track.addEventListener('touchstart', this.handleTouchStart);
        this.track.addEventListener('touchmove', this.handleTouchMove);
        this.track.addEventListener('touchend', this.handleTouchEnd);
    }
    
    goToSlide(index, animate = true) {
        if (this.isTransitioning) return;
        
        // Проверяем границы
        if (index < 0 || index >= this.totalSlides) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Вычисляем позицию для слайда
        const translateX = -(index * this.slideWidth);
        
        if (animate) {
            this.track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            this.track.style.transition = 'none';
        }
        
        this.track.style.transform = `translateX(${translateX}%)`;
        
        this.currentSlide = index;
        this.updateDots();
        this.updateButtonStates();
        
        if (!animate) {
            this.isTransitioning = false;
        } else {
            // Сбрасываем флаг после завершения анимации
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.steps-carousel__controls .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateButtonStates() {
        // Отключаем кнопку "назад" на первом слайде
        this.prevBtn.disabled = this.currentSlide === 0;

        this.currentSlide === 0 
            ? this.prevBtn.classList.add('disabled')
            : this.prevBtn.classList.remove('disabled');
        
        // Отключаем кнопку "вперед" на последнем слайде
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        this.currentSlide === this.totalSlides - 1 
            ? this.nextBtn.classList.add('disabled')
            : this.nextBtn.classList.remove('disabled');
    }
}

// Инициализация карусели после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new StepsCarousel();
}); 