/**
 *  Utility Module
 *
 *  Exports
 *      *[object jQuery].isOnScreen()       -- Checks if any part of element is on screen
 *      *[object jQuery].isOnPage()         -- Checks if any part of element is on page
 *      *[object String].format(args)       -- Replaces "{n}" with argument, where n is index of argument
 */

define(['jquery', 'disablescroll'], function ($, disablescroll) {
    "use strict";

    var $window = $(window);
    var $document = $(document);
    var mousedownButtons = [];
    var niceScrollInstance;
    var preventScroll = false;

    var colorPalette = {
        layout_light_green: '#0ADAC2',
        layout_teal: '#007E9A',
        layout_orange: '#FA8303',
        layout_pink: '#FF5959'
    };    

    $.fn.isOnScreen = function() {
        var viewport = {};
        viewport.top = $window.scrollTop();
        viewport.bottom = viewport.top + $window.height();

        var bounds = {};
        bounds.top = this.offset().top;
        bounds.bottom = bounds.top + this.outerHeight();

        return bounds.top <= viewport.bottom && bounds.bottom >= viewport.top;
    };

    $.fn.isOnPage = function() {
        var bounds = {};
        bounds.top = this.offset().top;
        bounds.left = this.offset().left;
        bounds.bottom = bounds.top + this.outerHeight();
        bounds.right = bounds.left + this.outerWidth();

        return (
            bounds.top >= 0 && bounds.left >= 0 &&
            bounds.bottom <= $document.height() &&
            bounds.right <= $document.width()
        );
    };

    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== undefined ? args[number] : match;
        });
    };

    // requestAnimationFrame Shim
    var requestAnimationFrame = window.requestAnimationFrame || 
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msrequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    var isMobile = (function isMobile() {
        return ((/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera));
    })();

    // Disable / Enable scrolling
    function setNiceScrollInstance(ns) {
        niceScrollInstance = ns;
    }

    // Prevent scroll when a page scroll animation is happening
    $(document).on('touchmove mousewheel', function(e) { // Note: removed 'scroll' from event list (handled instead with pointer-event: none on ns.rail)
        if (preventScroll) {
            if (niceScrollInstance) niceScrollInstance.cancelScroll();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // prevent scroll on capture phase if user presses arrow keys or page up/down key
    window.addEventListener('keydown', function (e) { 
        if (preventScroll) {
            if(e.which==33 || e.which==34 || e.which==37 || e.which==38 || e.which==39 || e.which==40) {
                e.preventDefault();
                e.stopPropagation();
                if (niceScrollInstance) {
                    niceScrollInstance.locked = true;
                    niceScrollInstance.cancelScroll();
                }
                return false;
            }
        }
    }, true);

    function disableScroll() {
        $window.disablescroll({
            handleScrollbar: false
        });
        preventScroll = true;
    }

    function enableScroll() {
        $window.disablescroll('undo');
        preventScroll = false;
    }

    return {
        colorPalette: colorPalette,
        isMobile: isMobile,
        setNiceScrollInstance: setNiceScrollInstance,
        disableScroll: disableScroll,
        enableScroll: enableScroll
    };

    // window.addEventListener('mousedown',
    //     function(e) {
    //         mousedownButtons[e.button] = true;
    //     }, true);
    //
    // window.addEventListener('mouseup',
    //     function(e) {
    //         mousedownButtons[e.button] = false;
    //     }, true);
    //
    // function mousedown(button) {
    //     if (!button || button.toLowerCase() === 'left')
    //         button = 0;
    //     else if (button.toLowerCase() === 'middle')
    //         button = 1;
    //     else if (button.toLowerCase() === 'right')
    //         button = 2;
    //
    //     return mousedownButtons[button] === true ? true : false;
    // }
    //
    // return {
    //     mousedown: mousedown
    // }
});
