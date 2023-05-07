$(function(){
    $('.slider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        fade: true
    });

    $('.menu__btn').on('click', function(){
        $('.menu__list').toggleClass('menu__list--active');
    });

});