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
        localeDefaultList = new Map(),
        localeCityList = new Map(),
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
        let output = `<div class="dropdown-lists__col">`;
        list.forEach((v, k) => {
            const { name, type, count } = v;
            output += `<div class="dropdown-lists__${type === 'country' ? 'total-' : ''}line" data-key="${k}">
                            <div class="dropdown-lists__${type}">${name}</div>
                            <div class="dropdown-lists__count">${count}</div>
                        </div>`;
        });
        output += `</div>`;
        return output;
    };

    const generateKey = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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

    const reset = () => {
        hide(dropdownLists);
        button.classList.add('disabled');
        button.href = '#';
        input.value = '';
        hide(closeButton);
        show(label);
    };

    const handlers = () => {
        inputCities.addEventListener('click', e => {
            const target = e.target;
            if (target.id === 'select-cities') {
                hide(dropdownLists);
                show(dropdownDefault);
            }
            if (target.closest('.dropdown-lists__total-line')) {
                const key = target.closest('.dropdown-lists__total-line').dataset.key,
                    cityes = getCityes(key);

                hide(dropdownLists);
                show(dropdownSelect);
                dropdownSelect.innerHTML = renderList(cityes);
                input.value = localeList.get(key).name;
                show(closeButton);
                hide(label);
                // input.dispatchEvent(new Event('input'));
            }
            if (target === closeButton) {
                reset();
            }
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
            if (target.classList.contains('disabled')) {
                e.preventDefault();
            }
        });

        input.addEventListener('input', e => {
            const target = e.target;
            if (target.value === '') {
                reset();
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

    console.log(localeList);
    dropdownDefault.innerHTML = renderList(getDefaultList());
};

export default dropdownList;