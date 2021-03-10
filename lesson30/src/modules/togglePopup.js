import { circ, makeEaseOut, animate } from './animate';

const popupActions = function(progress, element) {
    element.style.opacity = progress;
    element.style.display = progress ? 'block' : 'none';
};

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

export default togglePopup;