$(function () {

    $('.header__btn').on('click', function () {
        $('.rightsite-menu').removeClass('rightsite-menu--close');
    });
    $('.rightsite-menu__close').on('click', function () {
        $('.rightsite-menu').addClass('rightsite-menu--close');
    });

    $('.top__slider').slick({
        dots: true,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 2000
    });

    $('.article-slider__box').slick({
        prevArrow: '<button type="button" class="article-slider__arrow article-slider__arrowleft"><img src="images/arrow-slide-left.svg" alt=""></button>',
        nextArrow: '<button type="button" class="article-slider__arrow article-slider__arrowright"><img src="images/arrow-slide-right.svg" alt=""></button>'
    });
    
    $('.contact-slider').slick({
        slidesToShow: 10,
        slidesToScroll: 10,
        dots: true,
        arrows: false
    });
    
    var mixer = mixitup('.gallery__inner', {
        load: {
            filter: '.category-living'
        }
    });
})