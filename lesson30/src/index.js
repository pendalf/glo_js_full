import countTimer from './modules/countTimer';
import toggleMenu from './modules/toggleMenu';
import togglePopup from './modules/togglePopup';
import tabs from './modules/tabs';
import slider from './modules/slider';
import calc from './modules/calc';
import sendForm from './modules/sendForm';


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
countTimer('22 feb 2021 10:50');

// Меню
toggleMenu();

// popup
togglePopup();

// Табы
tabs();

// Слайдер
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
calc(100);

// send-ajax-form
sendForm('#form1', {
    pattern: {
        phone: /^\+?\d{11,}$/,
        userName: /^[А-Яа-яЁё ]{2,}$/
    },
    method: {
        'form1-name': [
            ['notEmpty'],
            ['pattern', 'userName']
        ],
        'form1-phone': [
            ['notEmpty'],
            ['pattern', 'phone']
        ],
        'form1-email': [
            ['notEmpty'],
            ['pattern', 'email']
        ]
    }
});
sendForm('#form2', {
    pattern: {
        phone: /^\+?\d{11,}$/,
        userName: /^[А-Яа-яЁё ]{2,}$/
    },
    method: {
        'form2-name': [
            ['notEmpty'],
            ['pattern', 'userName']
        ],
        'form2-phone': [
            ['notEmpty'],
            ['pattern', 'phone']
        ],
        'form2-email': [
            ['notEmpty'],
            ['pattern', 'email']
        ],
        'form2-message': [
            ['notEmpty'],
            ['pattern', 'userName']
        ]
    }
});
sendForm('#form3', {
    pattern: {
        phone: /^\+?\d{11,}$/,
        userName: /^[А-Яа-яЁё ]{2,}$/
    },
    method: {
        'form3-name': [
            ['notEmpty'],
            ['pattern', 'userName']
        ],
        'form3-phone': [
            ['notEmpty'],
            ['pattern', 'phone']
        ],
        'form3-email': [
            ['notEmpty'],
            ['pattern', 'email']
        ]
    }
});