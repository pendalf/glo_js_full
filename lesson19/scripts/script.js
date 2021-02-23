window.addEventListener('DOMContentLoaded', () => {

    // Timer
    function countTimer(deadline) {
        const timerHours = document.querySelector('#timer-hours'),
            timerMinutes = document.querySelector('#timer-minutes'),
            timerSeconds = document.querySelector('#timer-seconds'),
            timerInterval = setInterval(updateClock, 1000);

        function getTimeRemaining() {
            const dateStop = new Date(deadline).getTime(),
                dateNow = new Date().getTime(),
                timeRemainig = dateStop - dateNow >= 0 ? (dateStop - dateNow) / 1000 : 0,
                seconds = Math.floor(timeRemainig % 60),
                minutes = Math.floor(timeRemainig / 60) % 60,
                hours = Math.floor(timeRemainig / 60 / 60) % 24;
            return { seconds, minutes, hours, timeRemainig };
        }

        function twoGigits(val) {
            return (val < 10 ? '0' : '') + val;
        }

        function updateClock() {
            const timer = getTimeRemaining();

            timerHours.textContent = twoGigits(timer.hours);
            timerMinutes.textContent = twoGigits(timer.minutes);
            timerSeconds.textContent = twoGigits(timer.seconds);

            if (timer.timeRemainig === 0) {
                clearInterval(timerInterval);
            }
        }
        updateClock();
    }

    countTimer('22 feb 2021 10:50');

    // Меню
    const toggleMenu = () => {

        const btnMenu = document.querySelector('.menu'),
            menu = document.querySelector('menu'),
            closeBtn = document.querySelector('.close-btn'),
            menuItems = menu.querySelectorAll('li');

        const actionMenu = () => {
            // if (!menu.style.transform || menu.style.transform === `translate(-100%)`) {
            //     menu.style.transform = `translate(0)`;
            // } else {
            //     menu.style.transform = `translate(-100%)`;
            // }
            menu.classList.toggle('active-menu');
        };

        btnMenu.addEventListener('click', actionMenu);
        closeBtn.addEventListener('click', actionMenu);
        menuItems.forEach(item => item.addEventListener('click', actionMenu));
    };

    toggleMenu();

    // popup
    const togglePopup = () => {
        const popup = document.querySelector('.popup'),
            popupBtn = document.querySelectorAll('.popup-btn'),
            closePopup = document.querySelector('.popup-close');

        popupBtn.forEach(item => {
            item.addEventListener('click', () => {
                popup.style.display = 'block';
            });
        });
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    };
    togglePopup();

});