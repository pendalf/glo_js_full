/**
 * Функция анимации
 *
 * https://learn.javascript.ru/js-animation
 *
 * duration – общая продолжительность анимации в миллисекундах.
 * timing – функция вычисления прогресса анимации. Получается момент времени от 0 до 1,
 * возвращает прогресс анимации, обычно тоже от 0 до 1.
 * draw – функция отрисовки анимации.
 *
 */
const animate = function({ timing, draw, duration, element }) {

    const start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        if (timeFraction < 0) timeFraction = 0;

        // вычисление текущего состояния анимации
        const progress = timing(timeFraction);

        draw(progress, element); // отрисовать её

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
};

/**
 * Дуга
 * Функции расчёта времени
 *
 * https://learn.javascript.ru/js-animation#duga
 *
 * @param {number} timeFraction от 0 до 1
 *
 */
const circ = function(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
};

/**
 * easeOut
 *
 * Принимает функцию расчёта времени и возрващает инвертированный преобразованный вариант
 *
 * https://learn.javascript.ru/js-animation#easeout
 *
 * @param {function} timing Функция расчёта времени
 *
 */
const makeEaseOut = function(timing) {
    return function(timeFraction) {
        return timing(1 - timeFraction);
    };
};
/**
 * easeInOut
 *
 * Принимает функцию расчёта времени и возрващает преобразованный вариант
 *
 * https://learn.javascript.ru/js-animation#easeinout
 *
 * @param {function} timing Функция расчёта времени
 *
 */
function makeEaseInOut(timing) {
    return function(timeFraction) {
        if (timeFraction < .5)
            return timing(2 * timeFraction) / 2;
        else
            return (2 - timing(2 * (1 - timeFraction))) / 2;
    };
}

export { makeEaseInOut, makeEaseOut, circ, animate };