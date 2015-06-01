define(['jquery', 'tooltipster', 'util', 'debug'], function ($, tooltipster, util, debug) {
    "use strict";    

    $(function () {

        var isMobile = util.isMobile;

        var skillBlocks = $('.skill-block');

        var webSkill = $('#web-skill'), //document.getElementById('web-skill'),
            htmlCssSkill = $('#htmlcss-skill'), //document.getElementById('htmlcss-skill'),
            jsSkill = $('#js-skill'), //document.getElementById('js-skill'),
            graphicSkill = $('#graphic-skill'), //document.getElementById('graphic-skill'),
            uiSkill = $('#ui-skill'), //document.getElementById('ui-skill'),
            psSkill = $('#ps-skill'), //document.getElementById('ps-skill'),
            creativeSkill = $('#creative-skill'); //document.getElementById('creative-skill');

        var skillGraphOptions = {
            lineWidth: 12,
            lineCap: 'butt',
            rotate: -105,
            strokeStyle: util.colorPalette.layout_orange,
            counterClockwise: false,
            duration: 1000
        };

        var expGraphOptions = {
            sizeOffset: 25,
            lineWidth: 5,
            lineCap: 'butt',
            rotate: -105,//-75,
            strokeStyle: util.colorPalette.layout_pink,
            // counterClockwise: true,
            duration: 1000        
        };

        var renderedGraphs = { 
            // Used to store created graph canvas. The key is the .skill-block id. Values are { skillGraph: [obj], expGraph: [obj] }
        };

        var stopWebSkillAnim = false, 
            stopHtmlCssSkillAnim = false, 
            stopJsSkillAnim = false, 
            stopGraphicSkillAnim = false, 
            stopUiSkillAnim = false, 
            stopPsSkillAnim = false, 
            stopCreativeSkillAnim = false;

        function degToRadian(deg) {
            return deg * Math.PI / 180;
        }

        function createGraph(elem, options, type) {
            var canvas = document.createElement('canvas');

            canvas.width = canvas.height = 
                elem.width() + options.lineWidth + (options.sizeOffset ? options.sizeOffset : 0);

            var context = canvas.getContext('2d');
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = (canvas.width - options.lineWidth) / 2;

            var endPercent;
            if (type === 'skill') {
                endPercent = parseFloat(elem.attr('data-skill-level') / 10);
                $(canvas).addClass('skill-canvas');
            }
            else if (type === 'exp') {
                endPercent = parseFloat(elem.attr('data-years-exp') / 5);
                $(canvas).addClass('exp-canvas');
            }

            var fullTrackDeg = 360; //(type === 'exp') ? 180: 360;
            var endDegree = endPercent * fullTrackDeg;

            elem.append(canvas);

            // Begin Drawing
            function animate(progressPerc) {
                if (progressPerc <= 0 || isNaN(progressPerc)) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    return;
                }

                context.globalCompositeOperation = 'destination-over';
                context.lineWidth = options.lineWidth;
                context.strokeStyle = options.strokeStyle;

                var endAngle;
                if (!options.counterClockwise)
                    endAngle = degToRadian(options.rotate + progressPerc * endDegree);
                else {
                    endAngle = degToRadian(options.rotate + progressPerc * -1 * endDegree);
                }

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.arc(
                    centerX, 
                    centerY, 
                    radius, 
                    degToRadian(options.rotate), 
                    endAngle, 
                    options.counterClockwise
                );
                context.stroke();
            }

            function drawGaps() {
                // context.closePath();
                context.globalCompositeOperation = 'source-atop'; //'destination-out';
                context.lineWidth = options.lineWidth + 2; // slightly wider to ensure clean erase
                context.strokeStyle = 'white';

                var gapSections = [
                    { start: 0.0, end: 0.02 },
                    { start: 0.2, end: 0.22 },
                    { start: 0.4, end: 0.42 },
                    { start: 0.6, end: 0.62 },
                    { start: 0.8, end: 0.82 }
                ];

                for (var i = 0; i < gapSections.length; i++) {
                    if (endPercent < gapSections[i].start) // prevent unnecessary draws
                        break;

                    context.beginPath();
                    context.arc(
                        centerX, 
                        centerY, 
                        radius, 
                        degToRadian(options.rotate + gapSections[i].start * fullTrackDeg),
                        degToRadian(options.rotate + gapSections[i].end * fullTrackDeg),  
                        options.counterClockwise
                    );
                    context.stroke();
                }
            }

            return { // create canvas and return the animate function back for jQuery animation
                animate: animate,
                drawGaps: drawGaps
            };
        }

        function renderGraphs(elem, skillGraphOptions, expGraphOptions) {
            var expGraph = createGraph(elem, expGraphOptions, 'exp');
            var skillGraph = createGraph(elem, skillGraphOptions, 'skill');

            renderedGraphs[elem.attr('id')] = {
                skillGraph: skillGraph,
                expGraph: expGraph
            };

            elem.hover(
                function(e) { // on mobile, don't rely on hover events for animation, let tooltipster's event handle it
                    if (!isMobile && !shouldCancelAnimation(elem))
                        animateOpenGraph(elem, skillGraph, expGraph);
                },
                function(e) {
                    if (!isMobile && !shouldCancelAnimation(elem))
                        animateCloseGraph(elem, skillGraph, expGraph);
                }
            );
        }

        function shouldCancelAnimation(elem) {
            var elemId = elem.attr('id');

            return ((elemId === 'web-skill' && stopWebSkillAnim) ||
                (elemId === 'htmlcss-skill' && stopHtmlCssSkillAnim) ||
                (elemId === 'js-skill' && stopJsSkillAnim) ||
                (elemId === 'graphic-skill' && stopGraphicSkillAnim) ||
                (elemId === 'ui-skill' && stopUiSkillAnim) ||
                (elemId === 'ps-skill' && stopPsSkillAnim) ||
                (elemId === 'creative-skill' && stopCreativeSkillAnim)); 
        }

        function animateOpenGraph(elem, skillGraph, expGraph) {
            elem
                .stop(true)
                .animate(
                    { 'min-width': 1.0 },  // min-width is a fake prop for skillGraph anim
                    {
                        queue: false,
                        duration: skillGraphOptions.duration,
                        easing: 'easeOutBack',
                        step: function(value) { skillGraph.animate(value); }
                    })
                .delay(0.33 * skillGraphOptions.duration)
                .animate(
                    { 'min-height': 1.0 }, // min-height is a fake prop for expGraph anim
                    {
                        duration: expGraphOptions.duration,
                        easing: 'easeOutBack',
                        step: function(expGraphAnimationProgress) { expGraph.animate(expGraphAnimationProgress); },
                        complete: function() { expGraph.drawGaps(); }
                    });
        }

        function animateCloseGraph(elem, skillGraph, expGraph) {
            elem
                .stop(true)
                .animate(
                    { 'min-height': 0.0 }, // min-height is a fake prop for expGraph anim
                    {
                        queue: false,
                        duration: 0.67 * expGraphOptions.duration,
                        // easing: 'easeInBack',
                        step: function(expGraphAnimationProgress) { expGraph.animate(expGraphAnimationProgress); }
                    })
                .delay(0.33 * expGraphOptions.duration)
                .animate(
                    { 'min-width': 0.0 }, // min-width is a fake prop for skillGraph anim
                    {
                        duration: 0.67 * skillGraphOptions.duration,
                        // easing: 'easeInBack',
                        step: function(value) { skillGraph.animate(value); }
                    });
        }

        var tooltipsterOptions = {
            content: '', // override this in createContentTooltips() function
            // contentAsHTML: true,
            minWidth: 300,
            maxWidth: 425,
            position: 'bottom',
            interactive: true,
            interactiveTolerance: 250,
            animation: 'fade',
            speed: 250,
            delay: 500,
            touchDevices: true,

            // autoClose: false,
        };

        function createContentTooltips(elem, options) {        
            var elemId = elem.attr('id');
            var skillGraph = renderedGraphs[elemId].skillGraph;
            var expGraph = renderedGraphs[elemId].expGraph;

            options.content = elem.find('.skill-content');

            if (isMobile) { // on mobile, don't let skill block's hover event animate, let this do it
                options.functionBefore = function(origin, continueTooltip) {
                    continueTooltip();
                    animateOpenGraph(elem, skillGraph, expGraph);
                };
            }

            // section specific tooltip options
            if (elemId === 'web-skill') {
                options.offsetX = 0;
                options.offsetY = 15;
                options.position = 'bottom';

                options.functionReady = function(origin, tooltip) {
                    stopWebSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopWebSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'htmlcss-skill') {
                options.offsetX = 15;
                options.offsetY = 0;
                options.position = 'left';

                options.functionReady = function(origin, tooltip) {
                    stopHtmlCssSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopHtmlCssSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'js-skill') {
                options.offsetX = 15;
                options.offsetY = 0;
                options.position = 'left';

                options.functionReady = function(origin, tooltip) {
                    stopJsSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopJsSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'graphic-skill') {
                options.offsetX = 15;
                options.offsetY = 0;
                options.position = 'right';

                options.functionReady = function(origin, tooltip) {
                    stopGraphicSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopGraphicSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'ui-skill') {
                options.offsetX = 0;
                options.offsetY = 15;
                options.position = 'top';

                options.functionReady = function(origin, tooltip) {
                    stopUiSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopUiSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'ps-skill') {
                options.offsetX = 15;
                options.offsetY = 0;
                options.position = 'right';

                options.functionReady = function(origin, tooltip) {
                    stopPsSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopPsSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else if (elemId === 'creative-skill') {
                options.offsetX = 15;
                options.offsetY = 0;
                options.position = 'left';

                options.functionReady = function(origin, tooltip) {
                    stopCreativeSkillAnim = true;
                };
                options.functionAfter = function(origin) {
                    stopCreativeSkillAnim = false;
                    animateCloseGraph(elem, skillGraph, expGraph);
                };
            }
            else
                return;

            elem.tooltipster(options);
        }

        skillBlocks.each(function(index, elem) {
            renderGraphs($(elem), skillGraphOptions, expGraphOptions);
            createContentTooltips($(elem), tooltipsterOptions);
        });

    });

});
