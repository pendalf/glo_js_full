'use strict';

const start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    depositCheck = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    budgetMonthValue = document.querySelector('.budget_month-value'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');

start.disabled = true;

class AppData {
    constructor() {
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.targetMonth = 0;
        this.periodRange = 1;

        this.eventsListeners();
        this.startApp();
    }

    check() {
        if (salaryAmount.value !== '') {
            start.disabled = false;
        }
    }

    startApp() {

        const localStorageBudget = localStorage.budget ? JSON.parse(localStorage.budget) : null;

        if (this.isNoExpired()) {
            {
                ({
                    income: this.income,
                    incomeMonth: this.incomeMonth,
                    addIncome: this.addIncome,
                    expenses: this.expenses,
                    addExpenses: this.addExpenses,
                    deposit: this.deposit,
                    percentDeposit: this.percentDeposit,
                    moneyDeposit: this.moneyDeposit,
                    budget: this.budget,
                    budgetDay: this.budgetDay,
                    budgetMonth: this.budgetMonth,
                    expensesMonth: this.expensesMonth,
                    targetMonth: this.targetMonth,
                    periodRange: this.periodRange
                } = localStorageBudget);
                this.showResult();
                this.disableApp();
                periodSelect.value = this.periodRange;
                periodSelect.dispatchEvent(new Event('input'));
            }
        } else {
            this.reset();
        }
    }

    start() {

        this.budget = +salaryAmount.value;

        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpInc();
        this.getInfoDeposit();
        this.getBudget();
        this.getTargetMonth();

        this.showResult();
        this.disableApp();

        this.setLocalstorage();
        this.setCookies();
    }

    // Метод возвращения программы в имходное состояние
    reset() {
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.targetMonth = '';
        this.periodRange = 1;

        document.querySelectorAll('.data input[type=text] ').forEach(item => item.value = '');
        depositCheck.checked = false;
        periodSelect.value = 1;
        periodSelect.dispatchEvent(new Event('input'));
        document.querySelectorAll('.data input[type=text] ').forEach(item => item.disabled = false);
        document.querySelectorAll('.expenses-items').forEach((item, i) => i > 0 ? item.remove() : false);
        document.querySelectorAll('.income-items').forEach((item, i) => i > 0 ? item.remove() : false);

        this.depositHandler();
        this.showResult();
        this.removeLocalStorage();
        this.removeCookies();

        start.style.display = '';
        start.disabled = true;
        cancel.style.display = 'none';

        expensesPlus.style.display = '';
        incomePlus.style.display = '';
    }

    // Метод блокировки полей ввода
    disableApp() {

        document.querySelectorAll('.data input[type=text] ').forEach(item => item.disabled = true);
        start.style.display = 'none';
        cancel.style.display = 'block';
    }

    // Метод отображения результатов
    showResult() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.targetMonth;
        incomePeriodValue.value = this.calcPeriod();

        /**
         * Добавить обработчик события внутри метода showResult,
         * который будет отслеживать период и сразу менять значение в поле “Накопления за период” 
         * (После нажатия кнопки рассчитать, если меняем ползунок в range, 
         * “Накопления за период” меняются динамически аналогично 4-ому пункту)
         */
        periodSelect.addEventListener('input', (e) => {
            this.periodRange = e.target.value;
            incomePeriodValue.value = this.calcPeriod();
        });
    }

    // Метод добавления полей обязательных доходов/расходов
    addExpIncBlock(e) {
        const startStr = e.target.className.split(' ').reduce((a, b) => b.indexOf('add') !== -1 ? b.split('_')[0] : '');
        const cloneItems = eval(`${startStr}Items`)[0].cloneNode(true);
        const plus = eval(`${startStr}Plus`);
        cloneItems.querySelectorAll('input').forEach(item => item.value = '');
        this.addInputListeners(cloneItems);
        plus.before(cloneItems);
        const items = document.querySelectorAll(`.${startStr}-items`);
        if (items.length === 3) {
            plus.style.display = 'none';
        }
    }

    // Метод получения расходов/доходов
    getExpInc() {
        const count = item => {

            const startStr = item.className.split('-')[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = +item.querySelector(`.${startStr}-amount`).value;

            if (itemTitle !== '' && itemAmount !== '') {
                this[startStr][itemTitle] = itemAmount;
            }
        };

        document.querySelectorAll('.expenses-items').forEach(count);
        document.querySelectorAll('.income-items').forEach(count);

        for (const key in this.income) {
            if (Object.hasOwnProperty.call(this.income, key)) {
                this.incomeMonth += +this.income[key];
            }
        }
    }

    // Метод получения возможных доходов/расходов
    getAddExpInc() {

        const addExpenses = additionalExpensesItem.value.split(',');
        const count = item => {

            const itemType = item.className ? 'Income' : 'Expenses';
            const itemValue = typeof item.value !== 'undefined' ? item.value.trim() : item.trim();
            if (itemValue !== '') {
                this[`add${itemType}`].push(itemValue);
            }
        };

        additionalIncomeItem.forEach(count);
        addExpenses.forEach(count);
    }

    // Метод getExpensesMonth возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth() {
        let sum = 0;
        for (let expense in this.expenses) {
            sum += this.expenses[expense];
        }
        this.expensesMonth = sum;
    }

    /** 
     * Метод getBudget высчитывает накопления за месяц (Доходы минус расходы)
     * и бюджет на день и записывает в соответствующие свойства
     */

    getBudget() {
        const monthDeposit = this.moneyDeposit * this.percentDeposit / 100;
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }

    /**
     * Метод getTargetMonth подсчитывает за какой период будет достигнута цель,
     * зная результат месячного накопления (accumulatedMonth) и возвращает результат
     */

    getTargetMonth() {
        this.targetMonth = Math.ceil(targetAmount.value / this.budgetMonth) || '';
    }

    // getStatusIncome возвращает уровень дохода в зависимости от бюджета на день
    getStatusIncome() {
        if (this.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay >= 0 && this.budgetDay < 600) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Цель не будет достигнута';
        }
    }

    // Метод получения накоплений за период
    calcPeriod() {
        return this.budgetMonth * this.periodRange;
    }

    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = +depositPercent.value;
            this.moneyDeposit = +depositAmount.value;
        }
    }

    calcSavedMoney() {
        return this.budgetMonth * this.period;
    }

    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === 'other') {
            depositPercent.value = '';
            depositPercent.style.display = 'inline-block';
        } else {
            depositPercent.value = valueSelect;
            depositPercent.style.display = '';
        }
    }

    eventsListeners() {
        const startApp = this.start.bind(this);
        const resetApp = this.reset.bind(this);

        salaryAmount.addEventListener('input', (event) => {
            if (event.target.value !== '') {
                if (start.disabled) {
                    start.addEventListener('click', startApp);
                }
                start.disabled = false;
            } else {
                start.disabled = true;
                start.removeEventListener('click', startApp);
            }
        });
        cancel.addEventListener('click', resetApp);

        expensesPlus.addEventListener('click', this.addExpIncBlock.bind(this));
        incomePlus.addEventListener('click', this.addExpIncBlock.bind(this));

        periodSelect.addEventListener('input', (event) => {
            periodSelect.nextElementSibling.textContent = event.target.value;
        });

        this.addInputListeners(document);

        depositCheck.addEventListener('change', this.depositHandler.bind(this));
    }

    addInputListeners(el) {
        el.querySelectorAll('[placeholder = "Наименование"]').forEach(item => {
            item.addEventListener('input', event => {
                if (!/[а-яА-Я\s\W]/.test(event.target.value.slice(-1))) {
                    event.target.value = event.target.value.slice(0, -1);
                }
            });
        });

        el.querySelectorAll('[placeholder = "Сумма"], [placeholder = "Процент"]').forEach(item => {
            item.addEventListener('input', event => {
                if (!/[\d]/.test(event.target.value.slice(-1))) {
                    event.target.value = event.target.value.slice(0, -1);
                }
            });
        });
    }

    depositHandler() {
        if (depositCheck.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else {
            depositBank.style.display = '';
            depositAmount.style.display = '';
            depositPercent.style.display = '';
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }

    setLocalstorage() {
        localStorage.budget = JSON.stringify(this);
    }

    removeLocalStorage() {
        localStorage.removeItem('budget');
    }

    // метод установки cookies для приложения
    setCookies() {
        const options = {
            'max-age': 3600 * 24
        };
        Object.keys(this).forEach(item => {
            this.setCookie(item, this[item], options);
        });
        this.setCookie('isLoad', true, options);
    }

    // Метод удаления cookie для приложения
    removeCookies() {
        Object.keys(this).forEach(item => {
            this.deleteCookie(item);
        });
        this.deleteCookie('isLoad');
    }

    // метод установки cookie
    setCookie(name, value, options = {}) {

        options = {
            path: '/',
            // при необходимости добавьте другие значения по умолчанию
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + JSON.stringify(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    // метод удаления cookie
    deleteCookie(name) {
        this.setCookie(name, "", {
            'max-age': -1
        });
    }

    // Метод получения cookie
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? JSON.parse(matches[1]) : undefined;
    }

    isNoExpired() {
        const localStorageBudget = localStorage.budget ? JSON.parse(localStorage.budget) : null;
        if (!localStorageBudget) {
            return false;
        }
        return Object.keys(localStorageBudget).reduce((a, b) => {
            const cookie = JSON.stringify(this.getCookie(b));
            const LCItem = JSON.stringify(localStorageBudget[b]);
            if (a !== false && LCItem === cookie) {
                return true;
            }
            return false;
        });
    }
}

const appData = new AppData();

console.log(appData);