define(['jquery', 'util', 'debug'], function ($, util, debug) {
    "use strict";

    var stars_bg1 = document.getElementById('stars-bg1'),
        stars_bg2 = document.getElementById('stars-bg2'),
        stars_bg3 = document.getElementById('stars-bg3');

    var minSize = 2,
        maxSize = 6,
        minGlowSize = 0,
        maxGlowSize = 6,
        minOpacity = 0.6,
        maxOpacity = 1;

    var screenWidth = (window.screen && window.screen.width) ? window.screen.width : 5000;
    if (util.isMobile)
        screenWidth = 2560;

    function generateStars() {
        stars_bg1.innerHTML = '';
        stars_bg2.innerHTML = '';
        stars_bg3.innerHTML = '';

        var numStars;
        if (util.isMobile)
            numStars = 40;
        else {
            // numStars is 40 - 135 (from screenWidth 1024 to 5000);
            numStars = ~~(40 + ((screenWidth - 1024) / (5000 - 1024)) * (135 - 40));
            if (numStars < 40) numStars = 40;
        }

        //debug.output(numStars);
        generateStarField(stars_bg1, numStars);
        generateStarField(stars_bg2, numStars);
        generateStarField(stars_bg3, numStars);
    }

    function generateStarField(container, numStars) {
        for (var i = 0; i < numStars; i++) {
            var starDiv = document.createElement('div');

            //var posX = ~~(0 + Math.random() * (container.clientWidth + 1));
            var posX = ~~(0 + Math.random() * (screenWidth + 1));
            var poxY = ~~(0 + Math.random() * (container.clientHeight + 1));
            var size = ~~(minSize + Math.random() * (maxSize - minSize + 1));
            var glowSize = ~~(minGlowSize + Math.random() * (maxGlowSize - minGlowSize + 1));
            var opacity = ((minOpacity * 100 + Math.random() * ((maxOpacity - minOpacity) * 100 + 1)) / 100).toFixed(2);

            starDiv.className = 'star';
            starDiv.style.top = poxY + 'px';
            starDiv.style.left = posX + 'px';
            starDiv.style.width = size + 'px';
            starDiv.style.height = size + 'px';
            starDiv.style.boxShadow = '0 0 ' + glowSize + 'px 0 #fff';
            starDiv.style.opacity = opacity;

            container.appendChild(starDiv);
        }
    }

    document.onmouseenter = function(e) {
        if (util.isMobile)
            return;

        //debug.output('onmouseenter');
        var newScreenWidth = window.screen.width;
        if (newScreenWidth > screenWidth) {
            //debug.output('new screen size bigger: ' + newScreenWidth);
            screenWidth = newScreenWidth;
            generateStars();
        }
    };

    return {
        generateStars: generateStars
    };
});
