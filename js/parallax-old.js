define(['debug', 'jquery', 'smoothscroll', 'nicescroll', 'skrollr'], function(debug, $, smoothscroll, nicescroll, skrollr) {
    "use strict";
    
    $('a').smoothScroll();
    
    $("html").niceScroll({
        scrollspeed: 40,
        mousescrollstep: 60,
        spacebarenabled: false,
        bouncescroll: true,
        
        cursorcolor: '#fff',
        cursoropacitymin: 0,
        cursoropacitymax: 1,
        cursorwidth: '5px',
        cursorborder: '0px solid #fff',
        cursorfixedheight: 50,
        background: 'rgba(255, 255, 255, 0.25)',
        railalign: 'right',
        
    });
//    
//    var s = skrollr.init({
//        smoothScrolling: false,
//    });

//    var requestAnimationFrame = window.requestAnimationFrame || 
//                                window.mozRequestAnimationFrame || 
//                                window.webkitRequestAnimationFrame ||
//                                window.msRequestAnimationFrame;
//
//    var transforms = ["transform", 
//                      "msTransform", 
//                      "webkitTransform", 
//                      "mozTransform", 
//                      "oTransform"];
//
//    var stars_bg1 = document.getElementById('stars-bg1'),
//        stars_bg2 = document.getElementById('stars-bg2'),
//        stars_bg3 = document.getElementById('stars-bg3'),
//        clouds_bg1 = document.getElementById('clouds-bg1'),
//        clouds_bg2 = document.getElementById('clouds-bg2'),
//        clouds_bg3 = document.getElementById('clouds-bg3'),
//        earth_bg = document.getElementById('earth-bg'),
//        ocean_bg = document.getElementById('ocean-bg');
//
//    function backgroundParallax() {
//        var offset = window.pageYOffset;
//
//        stars_bg1.style.transform = "translateY({0}px)".format(-1 * offset / 20);
//        stars_bg2.style.transform = "translateY({0}px)".format(-1 * offset / 40);
//        stars_bg3.style.transform = "translateY({0}px)".format(-1 * offset / 60);
//
//        var earthBgOnScreen = $(earth_bg).isOnScreen();
//        if (earthBgOnScreen) {
//            var earthBgOffset = -1 * (offset - $(earth_bg).offset().top) / 4;
//            if (earthBgOffset < -280) earthBgOffset = -280;
//            if (earthBgOffset > 250) earthBgOffset = 250;
//            earthBgOffset = "translateY(" + earthBgOffset + "px)";
//            earth_bg.style.transform = earthBgOffset;
//        }
//
//        //debug.output("earth_bg on screen: " + earthBgOnScreen, "earth_bg in viewport");
//        //debug.output('earth_bg top position: ' + earth_bg.css('top'), 'earth_bg parallax');
//    }
//
//    //earth_bg.css('transform', "translateY(" + -1 * (window.pageYOffset - earth_bg.offset().top) / 4 + ")");
//    //debug.output('earth_bg top position: ' + earth_bg.css('top'), 'earth_bg parallax');
//
//    window.addEventListener('scroll', function (e) {
//        window.requestAnimationFrame(backgroundParallax);
//    });
});