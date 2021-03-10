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

export default validationForms;