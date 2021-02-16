'use strict';

const DomElement = function(selector, options) {

    this.selector = selector;
    this.height = options.height;
    this.width = options.width;
    this.bg = options.bg;
    this.fontSize = options.fontSize;
    this.text = options.text || 'null';

};

DomElement.prototype.create = function() {
    const el = document.createElement('div');
    if (/^\./.test(this.selector)) {
        el.className = this.selector.substring(1);
    } else if (/^#/.test(this.selector)) {
        el.id = this.selector.substring(1);
    }
    el.style.cssText = `height: ${this.height};
    width: ${this.width};
    background: ${this.bg};
    font-size: ${this.fontSize};`;
    el.textContent = this.text;

    document.body.append(el);
};

const block1 = new DomElement('.block', {
    height: '50px',
    width: '50px',
    bg: '#f00',
    fontSize: '12px',
    text: '.block'
});

block1.create();

const block2 = new DomElement('#best', {
    // height: '50px',
    // width: '50px',
    // bg: '#00f',
    // fontSize: '12px',
    // text: '#block'
});

block2.create();