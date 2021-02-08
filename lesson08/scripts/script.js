'use strict';

// Спрашиваем у пользователя “Ваш месячный доход?” и результат сохраняем в переменную money
let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

// Функция опроса ползователя для получения числа
const moneyPromt = (repeat = false, incorrect = 'Вы ввели некооректное значение. Укажите Ваш месячный доход числом.', correct = 'Ваш месячный доход?', defValue = 210000) => {
    const promtText = repeat ? incorrect : correct;
    let money = prompt(promtText, defValue);
    if (!isNumber(money)) {
        money = moneyPromt(true, incorrect, correct, defValue);
    }
    return +money;
};
let money;

// Функция start из практического занятия
let start = function() {

    do {
        money = moneyPromt();
    } while (!isNumber(money));
};

start();

let appData = {
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    mission: 2000000,
    period: 12,
    budget: money,
    budgetDay: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    // Метод asking производит опрос пользователя 
    asking: function() {
        // Запрос у пользователя о возможных обязательных статьях расхода
        const addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'ипотека, питание');

        // Получение массива возможных обязательных статей расхода
        appData.addExpenses = addExpenses ? addExpenses.toLowerCase().split(',').map((elem) => elem.trim()) : false;

        // Опрос пользователя на предмет наличия депозита
        appData.deposit = confirm('Есть ли у Вас депозит в банке?');

        // Опрос пользователя по размерам обязательных статей расхода
        for (let i = 0; i < 2; i++) {
            let expenses = prompt('Введите обязательную статью расходов');
            appData.expenses[expenses] = moneyPromt(false, `Вы ввели некооректное значение. Укажите числом во сколько расходы по статье "${expenses}" обойдутся.`, 'Во сколько это обойдется.', '');
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