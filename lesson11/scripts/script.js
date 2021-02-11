'use strict';

// получить каждый элемент в отдельную переменную:
// Кнопку "Рассчитать" через id
const start = document.getElementById('start');

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

        appData.budget = +salaryAmount.value;

        appData.getExpenses();
        appData.getIncome();

        // appData.asking();
        appData.getExpensesMonth();
        // appData.getInfoDeposit();
        appData.getAddExpenses();
        appData.getAddIncome();
        appData.getBudget();

        appData.showResult();
    },
    // Метод отображения результатов
    showResult: function() {
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = appData.budgetDay;
        expensesMonthValue.value = appData.expensesMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionalIncomeValue.value = appData.addIncome.join(', ');
        targetMonthValue.value = appData.getTargetMonth();
        incomePeriodValue.value = appData.calcPeriod();

        /**
         * Добавить обработчик события внутри метода showResult,
         * который будет отслеживать период и сразу менять значение в поле “Накопления за период” 
         * (После нажатия кнопки рассчитать, если меняем ползунок в range, 
         * “Накопления за период” меняются динамически аналогично 4-ому пункту)
         */
        periodSelect.addEventListener('input', (event) => {
            incomePeriodValue.value = appData.calcPeriod();
        });
    },
    // Метод добавления полей обязательных расходов
    addExpensesBlock: function() {
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesPlus.before(cloneExpensesItem);
        expensesItems = document.querySelectorAll('.expenses-items');
        if (expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    },
    // Метод добавления полей обязательных расходов
    addIncomeBlock: function() {
        const cloneIncomeItems = incomeItems[0].cloneNode(true);
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
                appData.expenses[itemExpenses] = cashExpenses;
            }
        });
    },
    // Метод получения сведений о дополнительном заработке
    getIncome: function() {

        incomeItems.forEach(function(item) {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = +item.querySelector('.income-amount').value;

            if (incomeItems !== '' && cashIncome !== '') {
                appData.addIncome[itemIncome] = cashIncome;
            }
        });

        for (const key in appData.addIncome) {
            if (Object.hasOwnProperty.call(appData.addIncome, key)) {
                appData.incomeMonth += +appData.addIncome[key];

            }
        }
    },
    // Метод получения возможных расходов
    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach(function(item) {
            item = item.trim();
            if (item !== '') {
                appData.addExpenses.push(item.trim());
            }
        });
    },
    // Метод получения возможных доходов
    getAddIncome: function() {
        additionalIncomeItem.forEach(function(item) {
            let itemValue = item.value.trim();
            if (itemValue !== '') {
                appData.addIncome.push(itemValue);
            }
        });
    },
    // Метод getExpensesMonth возвращает сумму всех обязательных расходов за месяц
    getExpensesMonth: () => {
        let sum = 0;
        for (let expense in appData.expenses) {
            sum += appData.expenses[expense];
        }
        appData.expensesMonth = sum;
    },
    // Метод getBudget высчитывает накопления за месяц (Доходы минус расходы) и бюджет на день и записывает в соответствующие свойства
    getBudget: () => {
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    // Метод getTargetMonth подсчитывает за какой период будет достигнута цель, зная результат месячного накопления (accumulatedMonth) и возвращает результат
    getTargetMonth: () => Math.ceil(targetAmount.value / appData.budgetMonth),
    // getStatusIncome возвращает уровень дохода в зависимости от бюджета на день
    getStatusIncome: function() {
        if (appData.budgetDay >= 1200) {
            return 'У вас высокий уровень дохода';
        } else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) {
            return 'У вас средний уровень дохода';
        } else if (appData.budgetDay >= 0 && appData.budgetDay < 600) {
            return 'К сожалению у вас уровень дохода ниже среднего';
        } else {
            return 'Цель не будет достигнута';
        }
    },
    // Метод получения накоплений за период
    calcPeriod: function() {
        return appData.budgetMonth * periodSelect.value;
    },
    getInfoDeposit: function() {
        if (appData.deposit) {
            appData.percentDeposit = askUser(
                Number,
                'Какой годовой процент?',
                `Вы ввели некооректное значение. Укажите числом годовой процент.`,
                10
            );
            appData.moneyDeposit = askUser(
                Number,
                'Какая сумма заложена?',
                `Вы ввели некооректное значение. Укажите числом какая сумма заложена.`,
                10000
            );
        }
    },
    calcSavedMoney: function() {
        return appData.budgetMonth * appData.period;
    }
};

salaryAmount.addEventListener('input', (event) => {
    if (event.target.value !== '') {
        start.disabled = false;
        start.addEventListener('click', appData.start);
    } else {
        start.disabled = true;
        start.removeEventListener('click', appData.start);
    }
});

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);

periodSelect.addEventListener('input', (event) => {
    periodSelect.nextElementSibling.textContent = event.target.value;
});



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