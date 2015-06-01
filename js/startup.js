define(['debug', 'util', 'jquery', 'jquery-ui', 'nicescroll', 'skrollr', 'tooltipster', 'stargenerator'], function(debug, util, $, jQueryUI, nicescroll, skrollr, tooltipster, stargenerator) {
    "use strict";

    $(function () {

        // remove the initial overflow:hidden on body attribute from loading screen
        $('body').css('overflow', '');

        var preventScroll = false;
        var ns;

        // Scroll animation when clicking an in-page anchor
        $('a[href^="#"]').on('click', function(event) {
            var target = $($(this).attr('href'));
            if(target.length) {
                event.preventDefault();

                util.disableScroll();
                preventScroll = true;

                if (ns) ns.rail.css('pointer-events', 'none');

                var topOffset = target.offset().top - 150;
                if (topOffset < 0) topOffset = 0;
                $('html, body').animate({
                    scrollTop: topOffset
                }, 2500, 'easeInOutExpo', function() {
                    util.enableScroll();
                    preventScroll = false;
                    if (ns) ns.rail.css('pointer-events', '');
                });
            }
        });

        // Tooltips
        $('.tooltipster').tooltipster({
            position: 'top',
            animation: 'fade',
            speed: 250,
            delay: 100,
            touchDevices: false,
        });

        // Create the star field backgrounds
        stargenerator.generateStars();

        /* ----------------------------------------------------
            If mobile device, do not initiate any parallax or smoothscroll libraries
        ----------------------------------------------------- */
        if (util.isMobile)
            return;

        var s = skrollr.init({
            smoothScrolling: false, // using niceScroll's smoothing instead
            forceHeight: false,
            skrollrBody: 'site',
            mobileCheck: function() {
                return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
            },
            mobileDeceleration: 0.004
        });

        $("html").niceScroll({
            scrollspeed: 40,
            mousescrollstep: 60,
            spacebarenabled: false,
            bouncescroll: false,

            autohidemode: true,
            cursorwidth: '10px',
            cursorcolor: 'rgba(255, 255, 255, 1)',
            cursorfixedheight: false,
            cursorborder: '0',
            background: 'rgba(255, 255, 255, 0.25)',
            cursoropacitymin: 0.2,
            cursoropacitymax: 0.8,
            hidecursordelay: 400,
            railalign: 'right',

            zindex: 'auto'
        });

        ns = $("html").getNiceScroll()[0];
        util.setNiceScrollInstance(ns);

    });

});
