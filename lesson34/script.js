const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    radius = 50,
    blue = '#0784c1',
    black = '#000000',
    red = '#ec324d',
    yellow = '#fab032',
    green = '#1b8a3a',


    circles = [{
        color: blue,
        x: 2 * radius - radius / 2,
        y: 2 * radius,
        start: 0,
        end: 360
    }, {
        color: black,
        x: 4 * radius,
        y: 2 * radius,
        start: 0,
        end: 360
    }, {
        color: red,
        x: 6 * radius + radius / 2,
        y: 2 * radius,
        start: 0,
        end: 360
    }, {
        color: yellow,
        x: 3 * radius - radius / 4,
        y: 3 * radius,
        start: 0,
        end: 360
    }, {
        color: blue,
        x: 2 * radius - radius / 2,
        y: 2 * radius,
        start: 45,
        end: 95
    }, {
        color: black,
        x: 4 * radius,
        y: 2 * radius,
        start: 150,
        end: 25
    }, {
        color: green,
        x: 5 * radius + radius / 4,
        y: 3 * radius,
        start: 0,
        end: 360
    }, {
        color: black,
        x: 4 * radius,
        y: 2 * radius,
        start: 45,
        end: -10
    }, {
        color: red,
        x: 6 * radius + radius / 2,
        y: 2 * radius,
        start: 125,
        end: 45
    }];

const angle = (degrees = 360) => (Math.PI / 180) * degrees;

const drawArc = (ctx, arc) => {
    const { x, y, color, start, end } = arc;
    ctx.lineWidth = 10
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, angle(start), angle(end), true);
    ctx.stroke();
};

circles.forEach(i => drawArc(ctx, i));


const canvas2 = document.getElementById('canvas2'),
    ctx2 = canvas2.getContext('2d'),
    color = document.getElementById('color'),
    brush = document.getElementById('brush');

color.addEventListener('input', e => ctx2.strokeStyle = e.target.value)
brush.addEventListener('input', e => ctx2.lineWidth = e.target.value)

canvas2.addEventListener('mousemove', (e) => {
    const x = e.offsetX,
        y = e.offsetY,
        mx = e.movementX,
        my = e.movementY;

    if (e.buttons > 0) {

        ctx2.beginPath();
        ctx2.moveTo(x, y);
        ctx2.lineTo(x - mx, y - my);
        ctx2.stroke();
        ctx2.closePath();
    }

})