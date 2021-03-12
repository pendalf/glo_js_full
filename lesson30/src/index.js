import countTimer from './modules/countTimer';
import toggleMenu from './modules/toggleMenu';
import togglePopup from './modules/togglePopup';
import tabs from './modules/tabs';
import slider from './modules/slider';
import calc from './modules/calc';
import sendForm from './modules/sendForm';
import validationForms from './modules/validationForms';
import changeImgOnHover from './modules/changeImgOnHover';
import SliderCarousel from './modules/SliderCarousel';

// Timer
countTimer('11 mar 2021 22:50');

// Меню
toggleMenu();

// popup
togglePopup();

// Табы
tabs();

// Слайдер
slider();

// Замена картинок при ховере
changeImgOnHover();

// Валидация форм
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

const sliderCarousel = new SliderCarousel({
    main: '.companies-wrapper',
    wrap: '.companies-hor',
    // prev: '.test-left',
    // next: '.test-right',
    infinity: true,
    slidesToShow: 4,

    responsive: [

        {
            breakpoint: 1024,
            slidesToShow: 3
        },
        {
            breakpoint: 768,
            slidesToShow: 2
        },
        {
            breakpoint: 576,
            slidesToShow: 1
        }
    ]

});
sliderCarousel.init();