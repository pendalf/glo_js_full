window.addEventListener('DOMContentLoaded', () => {

    /**
     * Функция анимации
     *
     * https://learn.javascript.ru/js-animation
     *
     * duration – общая продолжительность анимации в миллисекундах.
     * timing – функция вычисления прогресса анимации. Получается момент времени от 0 до 1,
     * возвращает прогресс анимации, обычно тоже от 0 до 1.
     * draw – функция отрисовки анимации.
     *
     */
    const animate = function({ timing, draw, duration, element }) {

        const start = performance.now();

        requestAnimationFrame(function animate(time) {
            // timeFraction изменяется от 0 до 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            // вычисление текущего состояния анимации
            const progress = timing(timeFraction);

            draw(progress, element); // отрисовать её

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }

        });
    };

    /**
     * Дуга
     * Функции расчёта времени
     *
     * https://learn.javascript.ru/js-animation#duga
     *
     * @param {number} timeFraction от 0 до 1
     *
     */
    const circ = function(timeFraction) {
        return 1 - Math.sin(Math.acos(timeFraction));
    };

    /**
     * easeOut
     *
     * Принимает функцию расчёта времени и возрващает инвертированный преобразованный вариант
     *
     * https://learn.javascript.ru/js-animation#easeout
     *
     * @param {function} timing Функция расчёта времени
     *
     */
    const makeEaseOut = function(timing) {
        return function(timeFraction) {
            return timing(1 - timeFraction);
        };
    };
    /**
     * easeInOut
     *
     * Принимает функцию расчёта времени и возрващает преобразованный вариант
     *
     * https://learn.javascript.ru/js-animation#easeinout
     *
     * @param {function} timing Функция расчёта времени
     *
     */
    function makeEaseInOut(timing) {
        return function(timeFraction) {
            if (timeFraction < .5)
                return timing(2 * timeFraction) / 2;
            else
                return (2 - timing(2 * (1 - timeFraction))) / 2;
        };
    }

    const popupActions = function(progress, element) {
        element.style.opacity = progress;
        element.style.display = progress ? 'block' : 'none';
    };

    const scrollTo = (progress, element) => {
        window.scrollTo(0, (element.to - element.from) * progress + element.from);
    };

    // Timer
    function countTimer(deadline) {
        const timerHours = document.querySelector('#timer-hours'),
            timerMinutes = document.querySelector('#timer-minutes'),
            timerSeconds = document.querySelector('#timer-seconds'),
            timerInterval = setInterval(updateClock, 1000);

        function getTimeRemaining() {
            const dateStop = new Date(deadline).getTime(),
                dateNow = new Date().getTime(),
                timeRemainig = dateStop - dateNow >= 0 ? (dateStop - dateNow) / 1000 : 0,
                seconds = Math.floor(timeRemainig % 60),
                minutes = Math.floor(timeRemainig / 60) % 60,
                hours = Math.floor(timeRemainig / 60 / 60) % 24;
            return { seconds, minutes, hours, timeRemainig };
        }

        function twoGigits(val) {
            return (val < 10 ? '0' : '') + val;
        }

        function updateClock() {
            const timer = getTimeRemaining();

            timerHours.textContent = twoGigits(timer.hours);
            timerMinutes.textContent = twoGigits(timer.minutes);
            timerSeconds.textContent = twoGigits(timer.seconds);

            if (timer.timeRemainig === 0) {
                clearInterval(timerInterval);
            }
        }
        updateClock();
    }

    countTimer('22 feb 2021 10:50');

    // Меню
    const toggleMenu = () => {

        const menu = document.querySelector('menu');

        const actionMenu = () => {
            menu.classList.toggle('active-menu');
        };

        const menuScrollTo = function(el) {
            el = el.tagName === 'A' ? el : el.querySelector('a');
            const to = el.getAttribute('href') || false,
                toEl = to ? document.querySelector(to) : false;
            if (toEl) {
                this.preventDefault();
                const scroll = {
                    from: document.documentElement.scrollTop,
                    to: toEl.getBoundingClientRect().top - document.body.getBoundingClientRect().top
                };
                animate({
                    element: scroll,
                    duration: 1000,
                    timing: makeEaseInOut(circ),
                    draw: scrollTo
                });
            }
        };
        document.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('menu')) {
                if (target.closest('a')) {
                    actionMenu();
                }
            } else if (menu.classList.contains('active-menu')) {
                actionMenu();
            }
            if (target.closest('.menu')) {
                actionMenu();
            }
            if (target.closest('a') && target.closest('a').getAttribute('href').length > 1 && target.closest('a').getAttribute('href')[0] === '#') {
                menuScrollTo.bind(e)(target.closest('a'));
            }
        });
    };

    toggleMenu();

    // popup
    const togglePopup = function() {
        const popup = document.querySelector('.popup'),
            popupBtn = document.querySelectorAll('.popup-btn');

        const isMobile = () => window.innerWidth < 768;

        const fadeIn = () => {
            if (!isMobile()) {
                animate({
                    element: popup,
                    duration: 1000,
                    timing: circ,
                    draw: popupActions
                });
            } else {
                popup.style.display = 'block';
                popup.style.opacity = '';

            }
        };

        const fadeOut = () => {
            if (!isMobile()) {
                animate({
                    element: popup,
                    duration: 1000,
                    timing: makeEaseOut(circ),
                    draw: popupActions
                });
            } else {
                popup.style.display = 'none';
                popup.style.opacity = '';
            }
        };

        popupBtn.forEach(item => {
            item.addEventListener('click', fadeIn);
        });
        popup.addEventListener('click', event => {
            let target = event.target;
            if (target.classList.contains('popup-close')) {
                target = null;
            }
            target = target ? target.closest('.popup-content') : null;
            if (!target) {
                fadeOut();
            }
        });
    };
    togglePopup();

    // Табы
    const tabs = () => {
        const tabHeader = document.querySelector('.service-header'),
            tab = tabHeader.querySelectorAll('.service-header-tab'),
            tabContent = document.querySelectorAll('.service-tab');

        const toggleTabContent = index => {
            tabContent.forEach((element, i) => {
                if (i === index) {
                    tab[i].classList.add('active');
                    element.classList.remove('d-none');
                } else {
                    element.classList.add('d-none');
                    tab[i].classList.remove('active');
                }
            });
        };

        tabHeader.addEventListener('click', event => {
            let target = event.target;
            target = target.closest('.service-header-tab');
            if (target) {
                tab.forEach((item, i) => {
                    if (item === target) {
                        toggleTabContent(i);
                    }
                    return;
                });
            }

        });
    };
    tabs();

    // Слайдер
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
    slider();
});