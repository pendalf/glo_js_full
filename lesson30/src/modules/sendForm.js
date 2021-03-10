const sendForm = (selector, validatorOptions = null) => {
    const errorMessage = `Что то пошло не так...`,
        successMessage = 'Спасибо! Мы скоро с вами свяжемся!';

    let validator;

    const form = document.querySelector(selector);

    if (validatorOptions) {
        validator = new Validator(Object.assign({ selector }, validatorOptions));
        validator.init();
    }

    const statusMessage = document.createElement('div');
    statusMessage.style.cssText = `font-size: 2rem; ${selector === '#form3' ? 'color: #ffffff;' : ''}`;

    const postData = body => fetch('./server.php', {
        method: 'POST',
        headerd: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const getLoader = () => {
        let loader = '<div class="sk-circle-bounce">';
        [...Array(12)].forEach((e, i) => loader += `<div class="sk-child sk-circle-${i + 1}"></div>`);
        loader += '</div>';
        return loader;
    };

    const messageClean = (form = null, pending = 3000) => {
        setTimeout(() => {
            statusMessage.textContent = '';
            if (form && form.id === 'form3') {
                document.querySelector('.popup .popup-close').dispatchEvent(new Event('click', { bubbles: true }));
            }

        }, pending);
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (validator && validator.error.size) {
            return;
        }
        const formData = new FormData(form),
            body = {};
        formData.forEach((v, k) => body[k] = v);
        form.append(statusMessage);
        statusMessage.innerHTML = getLoader();

        postData(body)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Status network is not 200');
                }
                form.reset();
                statusMessage.textContent = successMessage;
                messageClean(form);
            })
            .catch(error => {

                statusMessage.textContent = errorMessage;
                messageClean();
                console.error(error);
            });
    });

};

export default sendForm;