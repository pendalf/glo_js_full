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
        if (
            target.closest('a') &&
            target.closest('a').getAttribute('href').length > 1 &&
            target.closest('a').getAttribute('href')[0] === '#'
        ) {
            menuScrollTo.bind(e)(target.closest('a'));
        }
    });
};

export default toggleMenu;