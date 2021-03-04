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

    // Замена картинок при ховере
    const changeImgOnHover = () => {
        const imgs = document.querySelectorAll('[data-img]');
        imgs.forEach(item => {
            item.dataset.src = item.src;
            item.addEventListener('mouseenter', e => e.target.src = e.target.dataset.img);
            item.addEventListener('mouseleave', e => e.target.src = e.target.dataset.src);
        });
    };
    changeImgOnHover();

    // Валидация форм
    const validationForms = () => {
        const digits = document.querySelectorAll('.calc-square, .calc-count, .calc-day'),
            userName = document.querySelectorAll('[name="user_name"]'),
            cyrillic = document.querySelectorAll('[name="user_message"'),
            email = document.querySelectorAll('[name="user_email"'),
            phone = document.querySelectorAll('[name="user_phone"]');

        const disableSymbols = (els, regExp) => {
            if (els instanceof HTMLInputElement) {
                els = [els];
            }
            els.forEach(el => {
                el.addEventListener('input', () => el.value = el.value.replace(regExp, ''));
                el.addEventListener('blur', () => {
                    el.value = el.value.replace(/^[ -]*|( |-)(?=\1)|[ -]*$/g, '');
                    if (el.name === 'user_name') {
                        el.value = el.value.replace(/(( |^)[а-яё])(?=[а-яё])/g, x => x.toUpperCase());
                    }
                });
                if (el.type === 'email') {
                    el.addEventListener('keypress', e => {
                        if (e.code === 'Space') {
                            e.preventDefault();
                        }
                    });
                }
            });
        };
        disableSymbols(digits, /\D/g);
        disableSymbols(userName, /[^А-Яа-яЁё ]/g);
        disableSymbols(cyrillic, /[^А-Яа-яЁё\d .,;:?!-]/g);
        disableSymbols(email, /[^a-z@~!\.\*\'-]/gi);
        disableSymbols(phone, /[^\d\+]/g);

    };
    validationForms();

    // Калькулятор
    const calc = (price = 100) => {
        const calcBlock = document.querySelector('.calc-block'),
            calcType = document.querySelector('.calc-type'),
            calcSquare = document.querySelector('.calc-square'),
            calcCount = document.querySelector('.calc-count'),
            calcDay = document.querySelector('.calc-day'),
            totalValue = document.getElementById('total');

        const sumChangeVisual = (sum, time = 2000) => {
            const timeout = 10,
                sumNow = +totalValue.textContent,
                delta = sum - sumNow,
                now = Date.now(),
                step = Math.round(1000 * timeout / sum),
                int = setInterval(() => {
                    const total = Math.round(sumNow + (delta * (Date.now() - now) / time));
                    if ((delta > 0 && total <= sum) || (delta < 0 && total >= sum)) {
                        totalValue.textContent = total;
                    } else {
                        totalValue.textContent = sum;
                        clearInterval(int);
                    }
                }, step);
        };

        const countSum = () => {

            let total = 0,
                countValue = 1,
                dayValue = 1;

            const typeValue = +calcType.options[calcType.selectedIndex].value,
                squareValue = +calcSquare.value;

            if (calcCount.value > 1) {
                countValue += (calcCount.value - 1) / 10;
            }
            if (calcDay.value < 5) {
                dayValue *= 2;
            } else if (calcDay.value && calcDay.value < 10) {
                dayValue *= 1.5;
            }


            if (typeValue && squareValue) {
                total = price * typeValue * squareValue * countValue * dayValue;
            }

            sumChangeVisual(total, 1000);
        };

        calcBlock.addEventListener('change', e => {
            const target = e.target;

            if (target.matches('select, input')) {

                countSum();
            }
        });
    };
    calc(100);

    // send-ajax-form
    const sendForm = selector => {
        const errorMessage = `Что то пошло не так...`,
            loadMessage = 'Загрузка....',
            successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

        const form = document.querySelector(selector);

        const statusMessage = document.createElement('div');
        statusMessage.textContent = successMessage;
        statusMessage.style.cssText = `font-size: 2rem; ${selector === '#form3' ? 'color: #ffffff;' : ''}`;

        const postData = (body, outputData, errorData) => {

            const request = new XMLHttpRequest();

            request.addEventListener('readystatechange', () => {

                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    outputData();
                } else {
                    errorData(request.status);
                }
            });

            request.open('POST', './server.php');
            request.setRequestHeader('Content-Type', 'application/json');

            request.send(JSON.stringify(body));
        };

        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form),
                body = {};
            formData.forEach((v, k) => body[k] = v);
            form.append(statusMessage);
            statusMessage.textContent = loadMessage;

            postData(body,
                () => {
                    form.reset();
                    statusMessage.textContent = successMessage;
                },
                error => {

                    statusMessage.textContent = errorMessage;
                    console.log(error);
                }
            );
        });

    };
    sendForm('#form1');
    sendForm('#form2');
    sendForm('#form3');
});