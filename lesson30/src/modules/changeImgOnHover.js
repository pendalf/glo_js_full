const changeImgOnHover = () => {
    const imgs = document.querySelectorAll('[data-img]');
    imgs.forEach(item => {
        item.dataset.src = item.src;
        item.addEventListener('mouseenter', e => e.target.src = e.target.dataset.img);
        item.addEventListener('mouseleave', e => e.target.src = e.target.dataset.src);
    });
};

export default changeImgOnHover;