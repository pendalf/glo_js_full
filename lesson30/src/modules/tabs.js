const tabs = () => {
    const tabHeader = document.querySelector('.service-header'),
        tab = tabHeader.querySelectorAll('.service-header-tab'),
        tabContent = document.querySelectorAll('.service-tab');

    const toggleTabContent = index => {
        tabContent.forEach((element, i) => {
            if (i === index) {
                tab[i].classList.add('active');
                element.classList.remove('d-none');
            } else {
                element.classList.add('d-none');
                tab[i].classList.remove('active');
            }
        });
    };

    tabHeader.addEventListener('click', event => {
        let target = event.target;
        target = target.closest('.service-header-tab');
        if (target) {
            tab.forEach((item, i) => {
                if (item === target) {
                    toggleTabContent(i);
                }
                return;
            });
        }

    });
};

export default tabs;