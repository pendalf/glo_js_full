'use strict';

// Спрашиваем у пользователя “Ваш месячный доход?” и результат сохраняем в переменную money
let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const moneyPromt = (repeat = false, incorrect = 'Вы ввели некооректное значение. Укажите Ваш месячный доход числом.', correct = 'Ваш месячный доход?', defValue = 210000) => {
    const promtText = repeat ? incorrect : correct;
    let money = prompt(promtText, defValue);
    if (!isNumber(money)) {
        money = moneyPromt(true, incorrect, correct, defValue);
    }
    return +money;
};
let money;
const income = 'зарплата';

// Функция start из практического занятия
let start = function() {

    do {
        money = moneyPromt();
    } while (!isNumber(money));
};

start();

// Спросить у пользователя “Перечислите возможные расходы за рассчитываемый период через запятую” сохранить в переменную addExpenses (пример: "Квартплата, проездной, кредит")
const addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'ипотека, питание');

// Спросить у пользователя “Есть ли у вас депозит в банке?” и сохранить данные в переменной deposit (булево значение true/false)
const deposit = confirm('Есть ли у Вас депозит в банке?');
const mission = 2000000;
const period = 12;

/*
Спросить у пользователя по 2 раза каждый вопрос и записать ответы в разные переменные 
    “Введите обязательную статью расходов?” (например expenses1, expenses2)
    “Во сколько это обойдется?” (например amount1, amount2)
в итоге 4 вопроса и 4 разные переменных
*/
// const expenses1 = prompt('Введите обязательную статью расходов', 'Ипотека');
// const amount1 = moneyPromt(false, 'Вы ввели некооректное значение. Укажите числом во сколько расходы по статье "' + expenses1 + '" обойдутся.', 'Во сколько это обойдется.', 20000);
// const expenses2 = prompt('Введите обязательную статью расходов', 'Питание');
// const amount2 = moneyPromt(false, 'Вы ввели некооректное значение. Укажите числом во сколько расходы по статье "' + expenses2 + '" обойдутся.', 'Во сколько это обойдется.', 10000);

// вывод сообщений в консоль

// Вывести в консоль тип данных значений переменных money, income, deposit;
const showTypeOf = data => {
    console.log(typeof(data));
};
showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

// Привести строку addExpenses к нижнему регистру и разбить строку на массив, вывести массив в консоль
const addExpensesArr = addExpenses ? addExpenses.toLowerCase().split(',').map((elem) => elem.trim()) : false;
console.log(addExpensesArr);

// Объявить функцию getExpensesMonth. Функция возвращает сумму всех обязательных расходов за месяц
const getExpensesMonth = () => {
    let sum = 0;
    let expenses1, expenses2;
    for (let i = 0; i < 2; i++) {
        if (i === 0) {
            expenses1 = prompt('Введите обязательную статью расходов', 'Ипотека');
        } else if (i === 1) {
            expenses2 = prompt('Введите обязательную статью расходов', 'Питание');
        }

        sum += moneyPromt(false, 'Вы ввели некооректное значение. Укажите числом во сколько расходы по этой статье обойдутся.', 'Во сколько это обойдется.', '');

    }
    return sum;
};
const expensesMonth = getExpensesMonth();
console.log('Бюджет на месяц:' + expensesMonth);

// Объявить функцию getAccumulatedMonth. Функция возвращает Накопления за месяц (Доходы минус расходы)
const getAccumulatedMonth = () => money - expensesMonth;

// Объявить переменную accumulatedMonth и присвоить ей результат вызова функции getAccumulatedMonth 
const accumulatedMonth = getAccumulatedMonth();

// Объявить функцию getTargetMonth. Подсчитывает за какой период будет достигнута цель, зная результат месячного накопления (accumulatedMonth) и возвращает результат
const getTargetMonth = () => Math.ceil(mission / accumulatedMonth);

// Зная budgetMonth, посчитать за сколько месяцев будет достигнута цель mission, вывести в консоль, округляя в большую сторону (методы объекта Math в помощь)
console.log(`Цель будет достигнута за ${getTargetMonth()} месяцев.`);

// Объявить переменную budgetDay и присвоить дневной бюджет (доход за месяц / 30)
// Поправить budgetDay учитывая бюджет на месяц, а не месячный доход. Вывести в консоль  округлив в меньшую сторону
const budgetDay = Math.floor(accumulatedMonth / 30);
console.log(`Бюджет на день: ${budgetDay}`);

/*
Написать конструкцию условий (расчеты приведены в рублях)	

    Если budgetDay больше 1200, то “У вас высокий уровень дохода”
    Если budgetDay больше 600 и меньше 1200, то сообщение “У вас средний уровень дохода”
    Если budgetDay меньше 600 и больше 0 то в консоль вывести сообщение “К сожалению у вас уровень дохода ниже среднего”
    Если отрицательное значение то вывести “Что то пошло не так”
    Учесть варианты 0, 600 и 1200 (к какому уровню не важно)
*/
const getStatusIncome = function() {
    if (budgetDay >= 1200) {
        return 'У вас высокий уровень дохода';
    } else if (budgetDay >= 600 && budgetDay < 1200) {
        return 'У вас средний уровень дохода';
    } else if (budgetDay >= 0 && budgetDay < 600) {
        return 'К сожалению у вас уровень дохода ниже среднего';
    } else {
        return 'Цель не будет достигнута';
    }
};

console.log(getStatusIncome());