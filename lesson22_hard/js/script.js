'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
        this.todoItems = new Map();
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
                    <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
        `);
        this.todoItems.set(todo.key, li);
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    emptyAlert() {
        alert('Пустое дело добавить нельзя!');
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.input.value = '';
            this.render();
        } else {
            this.emptyAlert();
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

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
    animate({ timing, draw, duration, element }) {

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
    }

    /**
     * Дуга
     * Функции расчёта времени
     *
     * https://learn.javascript.ru/js-animation#duga
     *
     * @param {number} timeFraction от 0 до 1
     *
     */
    circ(timeFraction) {
        return 1 - Math.sin(Math.acos(timeFraction));
    }

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
    makeEaseOut(timing) {
        return function(timeFraction) {
            return timing(1 - timeFraction);
        };
    }

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
    makeEaseInOut(timing) {
        return function(timeFraction) {
            if (timeFraction < .5)
                return timing(2 * timeFraction) / 2;
            else
                return (2 - timing(2 * (1 - timeFraction))) / 2;
        };
    }

    fade(progress, element) {
        element.style.opacity = progress;
        element.style.display = progress ? 'block' : 'none';
    }

    fadeIn(element, duration = 1000, callback = false) {
        this.animate({
            element,
            duration,
            timing: this.circ,
            draw: this.fade
        });
        if (callback) {
            setTimeout(() => {
                callback();
            }, duration);
        }
    }

    fadeOut(element, duration = 1000, callback = false) {
        this.animate({
            element,
            duration,
            timing: this.makeEaseOut(this.circ),
            draw: this.fade
        });
        if (callback) {
            setTimeout(() => {
                callback();
            }, duration);
        }
    }

    deleteItem(el) {
        this.todoData.delete(el.key);
        this.todoItems.delete(el.key);
        this.fadeOut(el, 200, () => this.render());
    }
    completedItem(el) {
        const key = el.key,
            todo = this.todoData.get(key);
        if (todo) {
            todo.completed = !todo.completed;
            this.todoData.set(key, todo);
            this.fadeOut(el, 200, () => {
                this.render();
                this.fadeIn(this.todoItems.get(key), 200);
            });
        }
    }
    editItem(el) {
        const textTodo = el.querySelector('.text-todo');
        textTodo.contentEditable = true;
        textTodo.style.cssText = 'outline: none';
        textTodo.focus();
    }
    onCompleteEdit(e) {
        const key = e.target.closest('li').key,
            todo = this.todoData.get(key);
        if (e.key === 'Enter' || (e.type === 'blur' && !e.relatedTarget && e.target.tagName === 'LI')) {
            e.preventDefault();
            if (e.target.textContent.trim()) {
                todo.value = e.target.textContent;
                this.todoData.set(key, todo);
                this.render();
            } else {
                this.emptyAlert();
            }
        }
        if (e.key === 'Escape') {
            e.target.textContent = todo.value;
            e.target.contentEditable = false;
        }
    }
    handler() {
        this.todoContainer.addEventListener('click', e => {
            if (e.target.closest('.todo-remove')) {
                this.deleteItem(e.target.closest('li'));
            }
            if (e.target.closest('.todo-complete')) {
                this.completedItem(e.target.closest('li'));
            }
            if (e.target.closest('.todo-edit')) {
                this.editItem(e.target.closest('li'));
            }
        });
        this.todoContainer.addEventListener('keydown', this.onCompleteEdit.bind(this));
        this.todoContainer.addEventListener('blur', this.onCompleteEdit.bind(this), true);
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();