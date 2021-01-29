// Переменные
const money = 210000;
const income = 'зарплата';
const addExpenses = 'Интернет, Такси, Коммуналка, Ипотека';
const deposit = false;
const mission = 2000000;
const period = 12;

// вывод сообщений в консоль

// Вывести в консоль тип данных значений переменных money, income, deposit;
console.log(typeof money);
console.log(typeof income);
console.log(typeof deposit);

// Вывести в консоль длину строки addExpenses
console.log(addExpenses.length);

// Вывести в консоль “Период равен (period) месяцев” и “Цель заработать (mission) рублей/долларов/гривен/юани”
console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

// Привести строку addExpenses к нижнему регистру и разбить строку на массив, вывести массив в консоль
const addExpensesArr = addExpenses.toLowerCase().split(', ');
console.log(addExpensesArr);

// Объявить переменную budgetDay и присвоить дневной бюджет (доход за месяц / 30)
const budgetDay = money / 30;
console.log(budgetDay);