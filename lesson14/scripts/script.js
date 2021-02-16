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
    periodSelect = document.querySelector('.period-select');

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItems = document.querySelectorAll('.income-items');

start.disabled = true;

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

const AppData = function() {
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
}

AppData.prototype.check = function() {
    if (salaryAmount.value !== '') {
        start.disabled = false;
    }
};

AppData.prototype.start = function() {

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
};

// Метод возвращения программы в имходное состояние
AppData.prototype.reset = function() {
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
    start.disabled = true;
    cancel.style.display = 'none';
};
// Метод отображения результатов
AppData.prototype.showResult = function() {
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
};
// Метод добавления полей обязательных расходов
AppData.prototype.addExpensesBlock = function() {
    const cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelectorAll('input').forEach(item => item.value = '');
    addInputListeners(cloneExpensesItem);
    expensesPlus.before(cloneExpensesItem);
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
        expensesPlus.style.display = 'none';
    }
};
// Метод добавления полей обязательных расходов
AppData.prototype.addIncomeBlock = function() {
    const cloneIncomeItems = incomeItems[0].cloneNode(true);
    cloneIncomeItems.querySelectorAll('input').forEach(item => item.value = '');
    addInputListeners(cloneIncomeItems);
    incomePlus.before(cloneIncomeItems);
    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length === 3) {
        incomePlus.style.display = 'none';
    }
};
// Метод получения всех расходов
AppData.prototype.getExpenses = function() {
    expensesItems.forEach(function(item) {
        const itemExpenses = item.querySelector('.expenses-title').value;
        const cashExpenses = +item.querySelector('.expenses-amount').value;

        if (itemExpenses !== '' && cashExpenses !== '') {
            this.expenses[itemExpenses] = cashExpenses;
        }
    }.bind(this));
};
// Метод получения сведений о дополнительном заработке
AppData.prototype.getIncome = function() {

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
};
// Метод получения возможных расходов
AppData.prototype.getAddExpenses = function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
        item = item.trim();
        if (item !== '') {
            this.addExpenses.push(item.trim());
        }
    }.bind(this));
};
// Метод получения возможных доходов
AppData.prototype.getAddIncome = function() {
    additionalIncomeItem.forEach(function(item) {
        let itemValue = item.value.trim();
        if (itemValue !== '') {
            this.addIncome.push(itemValue);
        }
    }.bind(this));
};
// Метод getExpensesMonth возвращает сумму всех обязательных расходов за месяц
AppData.prototype.getExpensesMonth = function() {
    let sum = 0;
    for (let expense in this.expenses) {
        sum += this.expenses[expense];
    }
    this.expensesMonth = sum;
};
// Метод getBudget высчитывает накопления за месяц (Доходы минус расходы) и бюджет на день и записывает в соответствующие свойства
AppData.prototype.getBudget = function() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};
// Метод getTargetMonth подсчитывает за какой период будет достигнута цель, зная результат месячного накопления (accumulatedMonth) и возвращает результат
AppData.prototype.getTargetMonth = function() {
    return Math.ceil(targetAmount.value / this.budgetMonth) || '';
};
// getStatusIncome возвращает уровень дохода в зависимости от бюджета на день
AppData.prototype.getStatusIncome = function() {
    if (this.budgetDay >= 1200) {
        return 'У вас высокий уровень дохода';
    } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
        return 'У вас средний уровень дохода';
    } else if (this.budgetDay >= 0 && this.budgetDay < 600) {
        return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
        return 'Цель не будет достигнута';
    }
};
// Метод получения накоплений за период
AppData.prototype.calcPeriod = function() {
    return this.budgetMonth * periodSelect.value;
};
AppData.prototype.getInfoDeposit = function() {
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
};
AppData.prototype.calcSavedMoney = function() {
    return this.budgetMonth * this.period;
};

const appData = new AppData();

console.log(appData);



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