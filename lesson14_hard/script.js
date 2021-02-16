'use strict';

const DomElement = function(selector, options) {

    this.selector = selector;
    this.height = options.height;
    this.width = options.width;
    this.bg = options.bg;
    this.fontSize = options.fontSize;
    this.position = options.position;
    this.text = options.text;
    this.top = options.top;
    this.left = options.left;
    this.movingStep = options.movingStep || 10;

};

DomElement.prototype.create = function() {
    let el = document.createElement('div');

    if (/^\./.test(this.selector)) {
        el.className = this.selector.substring(1);
    } else if (/^#/.test(this.selector)) {
        el = document.createElement('p');
        el.id = this.selector.substring(1);
    }

    el.style.cssText = `height: ${this.height};
    width: ${this.width};
    top: ${this.top};
    left: ${this.left};
    position: ${this.position};
    background: ${this.bg};
    font-size: ${this.fontSize};`;
    el.textContent = this.text;
    this.el = el;

    document.body.append(el);
};

DomElement.prototype.moving = function(e) {
    const computedSyle = getComputedStyle(this.el);
    let axisY = 0,
        axisX = 0;
    switch (e.code) {
        case 'ArrowUp':
            axisY = -1;
            break;
        case 'ArrowDown':
            axisY = 1;
            break;
        case 'ArrowRight':
            axisX = 1;
            break;
        case 'ArrowLeft':
            axisX = -1;
            break;

        default:
            break;
    }
    if (axisY !== 0) {
        let top = +computedSyle.top.replace('px', '');
        top += axisY * this.movingStep;
        this.el.style.top = top > 0 ? top + 'px' : 0;
    }
    if (axisX !== 0) {
        let left = +computedSyle.left.replace('px', '');
        left += axisX * this.movingStep;
        this.el.style.left = left > 0 ? left + 'px' : 0;
    }
};

DomElement.prototype.letMove = function() {
    console.log(this.el);
    document.addEventListener('keydown', this.moving.bind(this));
};

const block1 = new DomElement('.block', {
    height: '100px',
    top: 0,
    left: 0,
    width: '100px',
    bg: '#f00',
    position: 'absolute'
});

block1.create();
block1.letMove();