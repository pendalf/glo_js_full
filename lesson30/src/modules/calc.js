const calc = (price = 100) => {
    const calcBlock = document.querySelector('.calc-block'),
        calcType = document.querySelector('.calc-type'),
        calcSquare = document.querySelector('.calc-square'),
        calcCount = document.querySelector('.calc-count'),
        calcDay = document.querySelector('.calc-day'),
        totalValue = document.getElementById('total');

    const sumChangeVisual = (sum, time = 2000) => {
        const timeout = 10,
            sumNow = +totalValue.textContent,
            delta = sum - sumNow,
            now = Date.now(),
            step = Math.round(1000 * timeout / sum),
            int = setInterval(() => {
                const total = Math.round(sumNow + (delta * (Date.now() - now) / time));
                if ((delta > 0 && total <= sum) || (delta < 0 && total >= sum)) {
                    totalValue.textContent = Math.round(total);
                } else {
                    totalValue.textContent = Math.round(sum);
                    clearInterval(int);
                }
            }, step);
    };

    const countSum = () => {

        let total = 0,
            countValue = 1,
            dayValue = 1;

        const typeValue = +calcType.options[calcType.selectedIndex].value,
            squareValue = +calcSquare.value;

        if (calcCount.value > 1) {
            countValue += (calcCount.value - 1) / 10;
        }
        if (calcDay.value < 5) {
            dayValue *= 2;
        } else if (calcDay.value && calcDay.value < 10) {
            dayValue *= 1.5;
        }


        if (typeValue && squareValue) {
            total = price * typeValue * squareValue * countValue * dayValue;
        }

        sumChangeVisual(total, 1000);
    };

    calcBlock.addEventListener('change', e => {
        const target = e.target;

        if (target.matches('select, input')) {

            countSum();
        }
    });
};

export default calc;