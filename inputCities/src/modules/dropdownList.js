const dropdownList = countries => {
    const inputCities = document.querySelector('.input-cities'),
        label = document.querySelector('.label'),
        dropdownLists = document.querySelectorAll('.dropdown-lists__list'),
        dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
        dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
        dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
        input = document.getElementById('select-cities'),
        button = document.querySelector('.button'),
        closeButton = document.querySelector('.close-button'),
        localeList = new Map(),
        lang = 'RU';


    // dropdownDefault.style.display = 'none';

    const hide = els => {
        if (els instanceof HTMLElement) els = [els];
        els.forEach(el => {
            el.style.display = 'none';
        });
    };
    const show = els => {
        if (els instanceof HTMLElement) els = [els];
        els.forEach(el => {
            el.style.display = 'block';
        });

    };
    const toggle = els => {
        if (els instanceof HTMLElement) els = [els];
        els.forEach(el => {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        });
    };

    const renderList = list => {
        let output = `<div class="dropdown-lists__col">`,
            i = 0,
            country = false;
        list.forEach((v, k) => {
            const { name, type, count } = v;
            if (type === 'country') {
                country = true;
                output += `${i > 0 ? '</div>' : ''}<div class="dropdown-lists__countryBlock">`;
            }
            output += `<div class="dropdown-lists__${type === 'country' ? 'total-' : ''}line" data-key="${k}">
                            <div class="dropdown-lists__${type}">${name}</div>
                            <div class="dropdown-lists__count">${count}</div>
                        </div>`;
            i++;
        });
        if (!list.size) {
            output += `<div class="dropdown-lists__line">Ничего не найдено</div>`;
        }
        if (country) {
            output += `</div>`;
        }
        output += `</div>`;
        return output;
    };

    const generateKey = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // получение плоского списка стран и городов
    const getFlatList = () => {
        countries[lang].forEach(v => {
            localeList.set(generateKey(), {
                type: 'country',
                name: v.country,
                count: v.count,
            });
            if (v.cities && v.cities.length) {
                v.cities.forEach(v => {
                    localeList.set(generateKey(), {
                        type: 'city',
                        name: v.name,
                        count: v.count,
                        link: v.link
                    });
                });
            }
        });
    };

    // получение дефолтного списка стран и городов
    const getDefaultList = () => {
        const list = new Map();
        let i = 1;
        localeList.forEach((v, k) => {
            if (v.type === 'country') {
                list.set(k, v);
                i = 1;
            } else if (i < 4) {
                list.set(k, v);
                i++;
            }
        });
        return list;
    };

    // получение списка городов выбранной страны
    const getCityes = key => {
        const list = new Map();
        let find = false;
        localeList.forEach((v, k) => {
            if (v.type === 'country' && k !== key) {
                find = false;
            }
            if (find) {
                list.set(k, v);
            }
            if (k === key && !find) {
                find = true;
                list.set(k, v);
            }
        });
        return list;
    };

    // поиск по городам и странам
    const search = phrase => {
        const list = new Map(),
            regexp = new RegExp(phrase, 'gi');
        localeList.forEach((v, k) => {
            if (regexp.test(v.name)) {
                list.set(k, v);
            }
        });
        return list;
    };

    // сброс
    const reset = () => {
        hide(dropdownLists);
        button.classList.add('disabled');
        button.href = '#';
        input.value = '';
        hide(closeButton);
        show(label);
    };

    // слушатели
    const handlers = () => {
        inputCities.addEventListener('click', e => {
            const target = e.target;
            // если кликнули по инпуту
            if (target.id === 'select-cities') {
                hide(dropdownLists);
                show(dropdownDefault);
            }
            // если кликнули по стране
            if (target.closest('.dropdown-lists__total-line')) {
                const key = target.closest('.dropdown-lists__total-line').dataset.key,
                    cityes = getCityes(key);

                hide(dropdownLists);
                show(dropdownSelect);
                dropdownSelect.innerHTML = renderList(cityes);
                input.value = localeList.get(key).name;
                show(closeButton);
                hide(label);
            }
            // если клискнули по копке закрыть
            if (target === closeButton) {
                reset();
            }
            // если кликнули по городу
            if (target.closest('.dropdown-lists__line')) {
                const key = target.closest('.dropdown-lists__line').dataset.key,
                    city = localeList.get(key);
                input.value = localeList.get(key).name;
                // input.dispatchEvent(new Event('input'));
                button.classList.remove('disabled');
                button.href = city.link;
                show(closeButton);
                hide(label);
            }
            // если кликнуле по кнопке перейти
            if (target.classList.contains('disabled')) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', e => {
            const target = e.target;
            if (target.value === '') {
                reset();
                show(dropdownDefault);
            } else {
                const list = search(target.value);
                show(closeButton);
                hide(label);
                hide(dropdownLists);
                show(dropdownAutocomplete);
                dropdownAutocomplete.innerHTML = renderList(list);
            }
        });
    };


    reset();
    handlers();
    getFlatList();

    dropdownDefault.innerHTML = renderList(getDefaultList());
};

export default dropdownList;