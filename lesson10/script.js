'use strict';

const booksContainer = document.querySelector('.books');
const booksCollection = document.querySelectorAll('.book');
const book2Els = booksCollection[0].querySelectorAll('li');
const book5Els = booksCollection[5].querySelectorAll('li');



// Восстановить порядок книг.
booksContainer.prepend(booksCollection[1]);
booksContainer.append(booksCollection[2]);
booksCollection[3].before(booksCollection[4]);

// Заменить картинку заднего фона на другую из папки image
document.body.style.backgroundImage = 'url(./image/you-dont-know-js.jpg)';

// Исправить заголовок в книге 3( Получится - "Книга 3. this и Прототипы Объектов")
booksCollection[4].querySelector('h2 a').textContent = 'Книга 3. this и Прототипы Объектов';

// Удалить рекламу со страницы
document.querySelector('.adv').remove();

// Восстановить порядок глав во второй и пятой книге (внимательно инспектируйте индексы элементов, поможет dev tools)
book2Els[3].after(book2Els[6]);
book2Els[6].after(book2Els[8]);
book2Els[9].after(book2Els[2]);

book5Els[1].after(book5Els[9]);
book5Els[4].after(book5Els[2]);
book5Els[7].after(book5Els[5]);

// в шестой книге добавить главу “Глава 8: За пределами ES6” и поставить её в правильное место
booksCollection[2].querySelectorAll('li')[8].insertAdjacentHTML('afterend', '<li>Глава 8: За пределами ES6</li>');