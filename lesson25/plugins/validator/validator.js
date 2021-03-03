class Validator {
    constructor({ selector, pattern = {}, method }) {
        this.form = document.querySelector(selector);
        this.pattern = pattern;
        this.method = method;
        this.elementsForm = [...this.form.elements].filter(
            el => el.tagName.toLowerCase() !== 'button' &&
            el.type !== 'button'
        );
        this.error = new Set();
    }

    init() {
        this.applyStyle();
        this.setPattern();

        this.elementsForm.forEach(el => el.addEventListener('change', this.checkIt.bind(this)));

        this.form.addEventListener('submit', e => {
            this.elementsForm.forEach(el => this.checkIt({ target: el }));
            if (this.error.size) {
                e.preventDefault();
            }
        })
    }

    showError(elem) {
        elem.classList.remove('success');
        elem.classList.add('error');
        if (elem.nextElementSibling &&
            elem.nextElementSibling.classList.contains('validator-error')
        ) {
            return;
        }
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Ошибка в этом поле';
        errorDiv.classList.add('validator-error');
        elem.insertAdjacentElement('afterend', errorDiv);
    }

    showSuccess(elem) {
        elem.classList.remove('error');
        elem.classList.add('success');
        if (elem.nextElementSibling &&
            elem.nextElementSibling.classList.contains('validator-error')
        ) {
            elem.nextElementSibling.remove();
        }
    }

    isValid(el) {
        const validatorMethod = {
            notEmpty(el) {
                return el.value.trim() !== '';
            },
            pattern(el, pattern) {
                return pattern.test(el.value);
            }
        };

        if (this.method) {
            const method = this.method[el.id];

            if (method) {
                return method.every(item => validatorMethod[item[0]](el, this.pattern[item[1]]));
            }
        } else {
            console.warn('Необходимо передать id полей ввода и методы этих полей!');
        }


        return true;
    }

    checkIt(e) {
        const target = e.target;
        if (this.isValid(target)) {
            this.showSuccess(target);
            this.error.delete(target);
        } else {
            this.showError(target);
            this.error.add(target);
        }
    }

    applyStyle() {
        const style = document.createElement('style');
        style.textContent = `
        input.success {
            border: 2px solid green;
        }
        input.error {
            border: 2px solid red;
        }
        .validator-error {
            font-size: 12px;
            font-family: sans-serif;
            color: red;
        }
        `;
        document.head.append(style);
    }

    setPattern() {
        if (!this.pattern.phone) {
            this.pattern.phone = /^\+?[78]([-()]*\d){10}$/;
        }
        if (!this.pattern.email) {
            this.pattern.email = /^\w+@\w+\.\w{2,}$/;
        }
    }
}