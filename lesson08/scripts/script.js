'use strict';

let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// Функция опроса ползователя.
const askUser = (type, correct, incorrect, defValue = '', repeat = false) => {
    const promtText = repeat ? incorrect : correct;
    let text = prompt(promtText, defValue);

    switch (type) {
        case Number:
            text = !isNumber(text) ? askUser(type, correct, incorrect, defValue, true) : +text;

            break;
        case String:
            text = isNumber(text) || text === null ? askUser(type, correct, incorrect, defValue, true) : text;

            break;

        default:
            break;
    }

    return text;
};

// Функция для 
const capitalizeFirstLetter = function(string) {
    if (!string) {
        return string;
    }
    return string[0].toUpperCase() + string.slice(1);
};


let money;



// Функция start из практического занятия
let start = function() {

    do {
        money = askUser(
            Number,
            'Ваш месячный доход?',
            'Вы ввели некооректное значение. Укажите Ваш месячный доход числом.',
            210000
        );
    } while (!isNumber(money));
};

start();

let appData = {
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    mission: 2000000,
    period: 12,
    budget: money,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    // Метод asking производит опрос пользователя 
    asking: function() {
        if (confirm('Есть ли у Вас дополнительный источник заработка?')) {
            let itemIncome = askUser(
                String,
                'Какой у Вас дополнительный заработок?',
                'Вы ввели число. Укажите наименование Вашего дополнительного заработка текстом.',
                'Таксую'
            );
            let cashIncome = askUser(
                Number,
                'Сколько в месяц Вы зарабатываете на этом?',
                'Вы ввели некооректное значение. Укажите числом сколько в месяц Вы зарабатываете на этом.',
                10000
            );

            appData.addIncome[itemIncome] = +cashIncome;
        }
        // Запрос у пользователя о возможных обязательных статьях расхода
        const addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'ипотека, питание');

        // Получение массива возможных обязательных статей расхода
        appData.addExpenses = addExpenses ? addExpenses.toLowerCase().split(',').map((elem) => elem.trim()) : false;

        // Опрос пользователя на предмет наличия депозита
        appData.deposit = confirm('Есть ли у Вас депозит в банке?');

        // Опрос пользователя по размерам обязательных статей расхода
        for (let i = 0; i < 2; i++) {
            let expenses = askUser(
                String,
                'Введите обязательную статью расходов',
                'Вы ввели число. Укажите наименование обязательной статьи расходов.',
                'Ипотека'
            );
            appData.expenses[expenses] = askUser(
                Number,
                'Во сколько это обойдется.',
                `Вы ввели некооректное значение. Укажите числом во сколько расходы по статье "${expenses}" обойдутся.`,
                1000
            );
        }
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
        appData.budgetMonth = appData.budget - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
    },
    // Метод getTargetMonth подсчитывает за какой период будет достигнута цель, зная результат месячного накопления (accumulatedMonth) и возвращает результат
    getTargetMonth: () => Math.ceil(appData.mission / appData.budgetMonth),
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

appData.asking();
appData.getExpensesMonth();
appData.getBudget();

console.log('Бюджет на месяц:' + appData.expensesMonth);
console.log(`Цель будет достигнута за ${appData.getTargetMonth()} месяцев.`);
console.log(appData.getStatusIncome());

console.log('Наша программа включает в себя данные:');
for (const key in appData) {
    if (Object.hasOwnProperty.call(appData, key)) {
        console.log(`${key}: ${appData[key]}`);

    }
}

console.log(appData.addExpenses.map((item) => capitalizeFirstLetter(item)).join(', '));