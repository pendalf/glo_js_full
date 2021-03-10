const countTimer = deadline => {
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
};

export default countTimer;