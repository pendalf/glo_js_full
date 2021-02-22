'use strict';

const dateNow = new Date(),
    hours = dateNow.getHours(),
    day = dateNow.toLocaleDateString('ru', { weekday: 'long' }),
    time = dateNow.toLocaleTimeString('en'),
    newYear = new Date(`${dateNow.getFullYear() + 1}`),
    daysToNewYear = Math.floor((newYear - dateNow) / 1000 / 60 / 60 / 24);

function getTimeOfDay(hours) {
    if (hours > 4 && hours < 11) {
        return 'Доброе утро';
    } else if (hours > 10 && hours < 17) {
        return 'Добрый день';
    } else if (hours > 16 && hours < 23) {
        return 'Добрый вечер';
    } else {
        return 'Доброй ночи';
    }
}

document.body.innerText = `${getTimeOfDay(hours)}
Сегодня: ${day[0].toUpperCase() + day.slice(1).toLowerCase()}
Текущее время: ${time}
До нового года осталось ${daysToNewYear} дней`;