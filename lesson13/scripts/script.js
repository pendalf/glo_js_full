'use strict';

// получить каждый элемент в отдельную переменную:
// Кнопку "Рассчитать" через id
const start = document.getElementById('start');
start.disabled = true;

const cancel = document.getElementById('cancel');

// Кнопки “+” (плюс) через Tag, каждую в своей переменной.
const btnPlus = document.getElementsByTagName('button');
const incomePlus = btnPlus[0];
const expensesPlus = btnPlus[1];

// Чекбокс по id через querySelector
const depositCheck = document.querySelector('#deposit-check');

// Поля для ввода возможных доходов (additional_income-item) при помощи querySelectorAll
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');

// Каждый элемент в правой части программы через класс(не через querySelector), которые имеют в имени класса "-value", начиная с class="budget_day-value" и заканчивая class="target_month-value">
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];

// Оставшиеся поля через querySelector каждый в отдельную переменную:
const budgetMonthValue = document.querySelector('.budget_month-value');

// поля ввода (input) с левой стороны и не забудьте про range.
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const expensesTitle = document.querySelector('.expenses-title');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');


let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const addInputListeners = el => {
    el.querySelectorAll('[placeholder = "Наименование"]').forEach(item => {
        item.addEventListener('input', event => {
            if (!/[а-яА-Я\s\W]/.test(event.target.value.slice(-1))) {
                event.target.value = event.target.value.slice(0, -1);
            }
        });
    });

    el.querySelectorAll('[placeholder = "Сумма"]').forEach(item => {
        item.addEventListener('input', event => {
            if (!/[\d]/.test(event.target.value.slice(-1))) {
                event.target.value = event.target.value.slice(0, -1);
            }
        });
    });
};

// Функция для получения фразы с первой заглавной буквы
const capitalizeFirstLetter = function(string) {
    if (!string) {
        return string;
    }
    return string[0].toUpperCase() + string.slice(1);
};

let appData = {
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    // Функция start из практического занятия
    start: function() {

        this.budget = +salaryAmount.value;

        this.getExpenses();
        this.getIncome();

        // appData.asking();
        this.getExpensesMonth();
        // appData.getInfoDeposit();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget();

        this.showResult();

        document.querySelectorAll('.data input[type=text] ').forEach(item => item.disabled = true);
        start.style.display = 'none';
        cancel.style.display = 'block';
    },
    // Метод возвращения программы в имходное состояние
    reset: function() {
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

        document.querySelectorAll('.data input[type=text] ').forEach(item => item.value = '');
        depositCheck.checked = false;
        periodSelect.value = 1;
        periodSelect.dispatchEvent(new Event('input'));
        document.querySelectorAll('.data input[type=text] ').forEach(item => item.disabled = false);
        document.querySelectorAll('.expenses-items').forEach((item, i) => i > 0 ? item.remove() : false);
        document.querySelectorAll('.income-items').forEach((item, i) => i > 0 ? item.remove() : false);

        this.showResult();
        start.style.display = 'block';
        cancel.style.display = 'none';
    },
    // Метод отображения результатов
    showResult: function() {
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        incomePeriodValue.value = this.calcPeriod();

        /**
         * Добавить обработчик события внутри метода showResult,
         * который будет отслеживать период и сразу менять значение в поле “Накопления за период” 
         * (После нажатия кнопки рассчитать, если меняем ползунок в range, 
         * “Накопления за период” меняются динамически аналогично 4-ому пункту)
         */
        periodSelect.addEventListener('input', () => {
            incomePeriodValue.value = this.calcPeriod();
        });
    },
    // Метод добавления полей обязательных расходов
    addExpensesBlock: function() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        cloneExpensesItem.querySelectorAll('input').forEach(item => item.value = '');
        addInputListeners(cloneExpensesItem);
        expensesPlus.before(cloneExpensesItem);
        expensesItems = document.querySelectorAll('.expenses-items');
        if (expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    },
    // Метод добавления полей обязательных расходов
    addIncomeBlock: function() {
        const cloneIncomeItems = incomeItems[0].cloneNode(true);
        cloneIncomeItems.querySelectorAll('input').forEach(item => item.value = '');
        addInputListeners(cloneIncomeItems);
        incomePlus.before(cloneIncomeItems);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3) {
            incomePlus.style.display = 'none';
        }
    },
    // Метод получения всех расходов
    getExpenses: function() {
        expensesItems.forEach(function(item) {
            const itemExpenses = item.querySelector('.expenses-title').value;
            const cashExpenses = +item.querySelector('.expenses-amount').value;

            if (itemExpenses !== '' && cashExpenses !== '') {
                this.expenses[itemExpenses] = cashExpenses;
            }
        }.bind(this));
    },
    // Метод получения сведений о дополнительном заработке
    getIncome: function() {

        incomeItems.forEach(function(item) {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = +item.querySelector('.income-amount').value;

            if (incomeItems !== '' && cashIncome !== '') {
                this.addIncome[itemIncome] = cashIncome;
            }
        }.bind(this));

        for (const key in this.addIncome) {
            if (Object.hasOwnProperty.call(this.addIncome, key)) {
                this.incomeMonth += +this.addIncome[key];

            }
        }
    },
    // Метод получения возможных расходов
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach(function(item) {
            item = item.trim();
            if (item !== '') {
                this.addExpenses.push(item.trim());
            }
        }.bind(this));
    },
    // Метод получения возможных доходов
    getAddIncome: function() {
        additionalIncomeItem.forEach(function(item) {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                this.addIncome.push(itemValue);
            }
        }.bind(this));
    },
    // Метод getExpensesMonth возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth: function() {
        let sum = 0;
        for (let expense in this.expenses) {
            sum += this.expenses[expense];
        }
        this.expensesMonth = sum;
    },
    // Метод getBudget высчитывает накопления за месяц (Доходы минус расходы) и бюджет на день и записывает в соответствующие свойства
    getBudget: function() {
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    },
    // Метод getTargetMonth подсчитывает за какой период будет достигнута цель, зная результат месячного накопления (accumulatedMonth) и возвращает результат
    getTargetMonth: function() {
        return Math.ceil(targetAmount.value / this.budgetMonth) || '';
    },
    // getStatusIncome возвращает уровень дохода в зависимости от бюджета на день
    getStatusIncome: function() {
        if (this.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
            return 'У вас средний уровень дохода';
        } else if (this.budgetDay >= 0 && this.budgetDay < 600) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Цель не будет достигнута';
        }
    },
    // Метод получения накоплений за период
    calcPeriod: function() {
        return this.budgetMonth * periodSelect.value;
    },
    getInfoDeposit: function() {
        if (this.deposit) {
            this.percentDeposit = askUser(
                Number,
                'Какой годовой процент?',
                `Вы ввели некооректное значение. Укажите числом годовой процент.`,
                10
            );
            this.moneyDeposit = askUser(
                Number,
                'Какая сумма заложена?',
                `Вы ввели некооректное значение. Укажите числом какая сумма заложена.`,
                10000
            );
        }
    },
    calcSavedMoney: function() {
        return this.budgetMonth * this.period;
    }
};

const startApp = appData.start.bind(appData);
const resetApp = appData.reset.bind(appData);

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

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', (event) => {
    periodSelect.nextElementSibling.textContent = event.target.value;
});

addInputListeners(document);




// console.log('Бюджет на месяц:' + appData.expensesMonth);
// console.log(`Цель будет достигнута за ${appData.getTargetMonth()} месяцев.`);
// console.log(appData.getStatusIncome());

// console.log('Наша программа включает в себя данные:');
// for (const key in appData) {
//     if (Object.hasOwnProperty.call(appData, key)) {
//         console.log(`${key}: ${appData[key]}`);

//     }
// }

// console.log(appData.addExpenses.map((item) => capitalizeFirstLetter(item)).join(', '));