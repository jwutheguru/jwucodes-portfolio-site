require.config({
    paths: {
        baseUrl: 'js',
        'jquery': 'lib/jquery-2.1.3.min', // '//code.jquery.com/jquery-2.1.3.min',
        'jquery-ui': 'lib/jquery-ui-1.11.4.min',// '//code.jquery.com/ui/1.11.4/jquery-ui.min',
        // 'jquery': '//code.jquery.com/jquery-2.1.3.min',
        // 'jquery-ui': '//code.jquery.com/ui/1.11.4/jquery-ui.min',
        'skrollr': 'lib/skrollr.min',
        'nicescroll': 'lib/jquery.nicescroll.min',
        'tooltipster': 'lib/jquery.tooltipster.min',
        'disablescroll': 'lib/jquery.disablescroll.min',
        'jqueryUnveil': 'lib/jquery.unveil'
    },
    shim: {
        'tooltipster': {
            deps: ['jquery']
        },        
        'disablescroll': {
            deps: ['jquery']
        },
        'jqueryUnveil': {
            deps: ['jquery']
        }
    }
});

require(['debug', 'util', 'startup', 'portfolio', 'skillgraph', 'contactform'], function(debug, util, startup, portfolio, skillgraph, contactform) {
    'use strict';

    $(function () {

        // Make all buttons with an inner element that has the "animated-hover" class trigger it on hover
        var allButtonsWithSpanInside = $(document).find('button, a').has('span.animated-hover');

        allButtonsWithSpanInside.hover(function() {
            $(this).find('> span').addClass('hover');
        }, function() {
            $(this).find('> span').removeClass('hover');
        });

        // Same thing for resume-link ribbon
        var resumeLinkRibbon = $('#resume-link');
        var resumeLink = resumeLinkRibbon.find('> a');
        resumeLinkRibbon.hover(function(e) {
            $(this).find('> a').addClass('hover');
        }, function() {
            $(this).find('> a').removeClass('hover');
        });
        resumeLinkRibbon.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = resumeLink.attr('href');
        });
        resumeLink.on('click', function(e) {
            e.stopPropagation();
        });
    });

});
