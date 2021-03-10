const slider = () => {
    const slide = document.querySelectorAll('.portfolio-item'),
        dotsContainer = document.querySelector('.portfolio-dots'),
        slider = document.querySelector('.portfolio-content'),
        dot = [...Array(slide.length)].map(() => {
            const el = document.createElement('li');
            el.classList.add('dot');
            return el;
        });

    let currentSlide = 0,
        interval;

    const prevSlide = (elem, index, strClass) => {
        elem[index].classList.remove(strClass);
    };
    const nextSlide = (elem, index, strClass) => {
        elem[index].classList.add(strClass);
    };

    dotsContainer.append(...dot);
    nextSlide(dot, currentSlide, 'dot-active');

    const autoPlaySlide = () => {
        prevSlide(slide, currentSlide, 'portfolio-item-active');
        prevSlide(dot, currentSlide, 'dot-active');
        currentSlide++;
        if (currentSlide >= slide.length) {
            currentSlide = 0;
        }
        nextSlide(slide, currentSlide, 'portfolio-item-active');
        nextSlide(dot, currentSlide, 'dot-active');
    };

    const startSlide = (time = 3000) => {
        interval = setInterval(autoPlaySlide, time);
    };
    const stopSlide = () => {
        clearInterval(interval);
    };

    slider.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target;

        if (!target.matches('.portfolio-btn, .dot')) {
            return;
        }
        prevSlide(slide, currentSlide, 'portfolio-item-active');
        prevSlide(dot, currentSlide, 'dot-active');

        if (target.matches('#arrow-right')) {
            currentSlide++;
        } else if (target.matches('#arrow-left')) {
            currentSlide--;
        } else if (target.matches('.dot')) {
            dot.forEach((item, index) => {
                if (item === target) {
                    currentSlide = index;
                }
            });

        }
        if (currentSlide >= slide.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slide.length - 1;
        }
        nextSlide(slide, currentSlide, 'portfolio-item-active');
        nextSlide(dot, currentSlide, 'dot-active');
    });

    slider.addEventListener('mouseover', e => {
        if (e.target.matches('.portfolio-btn, .dot')) {
            stopSlide();
        }
    });
    slider.addEventListener('mouseout', e => {
        if (e.target.matches('.portfolio-btn, .dot')) {
            startSlide(1500);
        }
    });

    startSlide(1500);
};

export default slider;