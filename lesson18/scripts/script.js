window.addEventListener('DOMContentLoaded', () => {

    // Timer
    function countTimer(deadline) {
        const timerHours = document.querySelector('#timer-hours'),
            timerMinutes = document.querySelector('#timer-minutes'),
            timerSeconds = document.querySelector('#timer-seconds');

        function getTimeRemaining() {
            const dateStop = new Date(deadline).getTime(),
                dateNow = new Date().getTime(),
                timeRemainig = (dateStop - dateNow) / 1000,
                seconds = Math.floor(timeRemainig % 60),
                minutes = Math.floor(timeRemainig / 60) % 60,
                hours = Math.floor(timeRemainig / 60 / 60) % 24;
            return { seconds, minutes, hours, timeRemainig };
        }

        function updateClock() {
            const timer = getTimeRemaining();

            timerHours.textContent = timer.hours;
            timerMinutes.textContent = timer.minutes;
            timerSeconds.textContent = timer.seconds;

            if (timer.timeRemainig > 1) {
                setTimeout(updateClock, 1000);
            }
        }
        updateClock();
    }

    countTimer('22 feb 2021 10:25:30');

});