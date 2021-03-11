const dropdownList = () => {
    const inputCities = document.querySelector('.input-cities'),
        dropdownLists = document.querySelector('.dropdown-lists__list'),
        dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
        dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
        dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
        input = document.getElementById('select-cities'),
        button = document.querySelector('.button'),
        closeButton = document.querySelector('.close-button');

    // dropdownDefault.style.display = 'none';

    const hide = el => {
        el.style.display = 'none';
    };
    const show = el => {
        el.style.display = 'block';
    };
    const toggle = el => {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    };

    const handlers = () => {
        inputCities.addEventListener('click', e => {
            const target = e.target;
            if (target.id === 'select-cities') {
                show(dropdownDefault);
            }
            if (target.closest('.dropdown-lists__total-line') && target.closest('.dropdown-lists__list--default')) {
                hide(dropdownDefault);
                show(dropdownSelect);
            }
            if (target === closeButton) {
                input.value = '';
            }
        });

        input.addEventListener('input', e => {
            const target = e.target;
            if (target.value === '') {
                hide(closeButton);
            } else {
                show(closeButton);
            }
        });
    };


    hide(dropdownDefault);
    button.classList.add('disabled');
    handlers();
};

export default dropdownList;