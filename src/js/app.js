import "../css/app.css";

import $ from 'jquery';
import 'magnific-popup';
import 'slick-carousel';
import AOS from 'aos';

window.jQuery = $;

AOS.init();

$('.slider').slick();


// Hamburger and mobile nav
var $hamburger = $(".hamburger");
    $hamburger.on("click", function(e) {
        $hamburger.toggleClass("is-active");
        $('.mobile-nav').toggleClass('open');
    });


// Image galleries
$('a.btn-gallery').on('click', function(event) {
    event.preventDefault();
    
    var gallery = $(this).attr('href');

    $(gallery).magnificPopup({
        delegate: 'a',
        type:'image',
        gallery: {
            enabled: true,
            tCounter:"%curr% von %total%"
        },
        image: {
            tError: '<a href="%url%">Foto #%curr%</a> konnte nicht geladen werden.',
            titleSrc: function(item) {
                return item.el.attr('title');
            }
        }
    }).magnificPopup('open');
});