/** функция filterByType
 * Принимает значение type и массив values
 * возвращяет отфильтрованный массив values по значению type
 */
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

    /** функция hideAllResponseBlocks
     * производит манипуляции с видимостью DOM элементов
     * Скрываются блоки с ответным сообщением
     */
    hideAllResponseBlocks = () => {

        /**
         * получаются все элементы div.dialog__response-block на странице
         * и коллеция NodeList преобразовываеся в Array
         */
        const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));

        /**
         * производится перебор массива с эллементами div.dialog__response-block
         * и применяется к ним css-свойство display: none
         */
        responseBlocksArray.forEach(block => block.style.display = 'none');
    },

    /** функция showResponseBlock
     * производит запуск функции скрывающей блоки с ответным сообщением
     * и отображение блока с заданным типом и текстом
     * принимает селектор, текст сообщения и селектор для сообщения
     */
    showResponseBlock = (blockSelector, msgText, spanSelector) => {
        // вызов функции скрывающей все блоки с ответом
        hideAllResponseBlocks();
        // для DOM элемента с селектором blockSelector устанавливается css-свойство display: block
        document.querySelector(blockSelector).style.display = 'block';
        /**
         * если передан селектор для сообщения,
         * то для DOM элемента соответствующему селектору устанавливается
         * для свойства textContent текстовое сообщение msgText
         */
        if (spanSelector) {
            document.querySelector(spanSelector).textContent = msgText;
        }
    },

    /** функция showError
     * производит вызов функции showResponseBlock,
     * которая отображает блок с ответом ошибки
     * принимает сообщения для отображения в блоке
     */
    showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

    /** функция showResults
     * производит вызов функции showResponseBlock,
     * которая отображает блок с ответом если ошибок нет
     * принимает сообщения для отображения в блоке
     */
    showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

    /** функция showNoResults
     * производит вызов функции showResponseBlock,
     * которая отображает блок с ответом если нет результатоы
     */
    showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

    /** функция tryFilterByType
     * производит поиск типа данных указанных в поле "Данные"
     */
    tryFilterByType = (type, values) => {
        try { // производится попытка исполнения в блоке try
            /**
             * производится вывзов функции выполняющей строки кода
             * в строке кода вызов функции фильтрации данных по типу,
             * которая возвращает массив требуемых данных
             * после массив преобразовывается в строку с разделителем ","
             */
            const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
            // устанавливается сообщение в зависимости от длинны полученной строки
            const alertMsg = (valuesArray.length) ?
                // если строка не пустая, присваивается результат работы функции filterByType
                `Данные с типом ${type}: ${valuesArray}` :
                // если строка пустая, то выводится сообщение, что данные указанного типа не найдены
                `Отсутствуют данные типа ${type}`;
            // вывзо функции для отображения блока с результатов
            showResults(alertMsg);
        } catch (e) { // если блок try вызвал ошибку
            // вызов функции отображающей блок с сообщением обо ошибке
            showError(`Ошибка: ${e}`);
        }
    };
// получение кнопки "фильтровать"
const filterButton = document.querySelector('#filter-btn');

/**
 * навешивание события click на кнопку "фильтровать"
 */
filterButton.addEventListener('click', e => {
    // получение селекта с выборомтипа данных
    const typeInput = document.querySelector('#type');
    // получения инпута в который вводятся данные наличие типа которых нужно определить
    const dataInput = document.querySelector('#data');

    if (dataInput.value === '') { //если данные не введены
        // отображается ошибка валидации поля для ввода данных
        dataInput.setCustomValidity('Поле не должно быть пустым!');
        // вызывается функция отображения блока с отсутствием результатов
        showNoResults();
    } else { //если данные введены
        // убирается ошибка валидации поля для ввода данных
        dataInput.setCustomValidity('');
        // отлючается событие браузера по умолчанию для кнопки "фильтровать"
        e.preventDefault();
        // вызов функции поиска типа данных
        tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
    }
});