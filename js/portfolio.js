define(['jquery', 'tooltipster', 'jqueryUnveil', 'portfolio-items', 'modal', 'util', 'debug'], function ($, tooltipster, jqueryUnveil, portfolioItems, modal, util, debug) {
    "use strict";

    $(function () {

        var container = $('#portfolio-content'),
            pager = $('#portfolio-pager'),
            pagerCurrentLabel = $('#portfolio-pager-current'),
            pagerMaxLabel = $('#portfolio-pager-max'),
            pagerPrev = $('#portfolio-pager-prev'),
            pagerNext = $('#portfolio-pager-next');

        var itemWidth = 270,
            itemHeight = 135;

        var items = [];

        var pageSize = 6,
            itemCount = 0,
            currentPage = 1,
            numPages = 1;

        var pageFlipFadeSpeed = 250;
        var simpleAnimation = false; // TODO: remove for production
        var noAnimation = false; // TODO: remove for production

        function init() {
            container.empty();
            createItemElements(portfolioItems);

            items = container.find('.portfolio-item');
            itemCount = items.length;

            setupPager();
            setupEvents();
            goToPage(1);
        }

        function createItemElements(portfolioItems) {
            /* Example
                <figure class="portfolio-item">
                  <img src="portfolio/workname/workimage.png" width="270" height="135" />
                  <figcaption>
                    <h2>Random Mouse Thang</h2>
                    <div class="portfolio-item-description">
                      <div class="work-showcase">
                        <img src="portfolio/workname/workimage.png" />
                      </div>
                      <div class="work-description">
                        <h2>Work Title</h2>
                        <p>Work Description</p>
                        <ul>
                          <li>Tags</li>
                        </ul>
                      </div>
                    </div>
                  </figcaption>
                </figure>
            */

            // reverse list
            var keys = Object.keys(portfolioItems);
            keys.sort(function compare(a, b) {
                return -1 * (parseInt(a) - parseInt(b));
            });

            for (var i = 0; i < keys.length; i++) {
                var id = keys[i];
                var item = portfolioItems[id];

                var html = 
                    '<figure class="portfolio-item" data-item-id="' + item.id + '" style="display: none;">' +
                        '<img src="' + item.posterImage + '" width="270" height="135" />' +
                        '<figcaption>' +
                            '<h2>' + item.header + '</h2>' +
                            '<div class="portfolio-item-description" data-item-id="' + item.id + '">' +
                                '<div class="work-showcase">' +
                                    '<img src="img/loading.gif" data-src="' + item.images[0] + '" />' +
                                '</div>' +
                                '<div class="work-description">' +
                                    '<h2>' + item.title + '</h2>' +
                                    '<p>' + item.description + '</p>' +
                                    '<ul>' +
                                        '<li>' + item.tags[0] + '</li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>' +
                        '</figcaption>' +
                    '</figure>';

                container.append($(html));
            }
        }

        function setupPager() {
            numPages = Math.ceil(itemCount / pageSize) || 1;
            pagerMaxLabel.text(numPages);

            pagerPrev.off('click').on('click', prevPage);
            pagerNext.off('click').on('click', nextPage);
        }

        function prevPage(e) {
            e.preventDefault();

            if (currentPage <= 1)
                return false;

            goToPage(currentPage - 1);
        }

        function nextPage(e) {
            e.preventDefault();

            if (currentPage >= numPages)
                return false;

            goToPage(currentPage + 1);
        }

        function goToPage(page) {
            var currentItems = getItemsOnPage(currentPage);
            var newPageItems = getItemsOnPage(page);
            currentPage = page;

            if (noAnimation) {
                $(currentItems).hide();
                $(newPageItems).show();
                pagerCurrentLabel.text(page);

                return;
            }

            if (simpleAnimation) {
                $(currentItems).fadeOut(250, function() { 
                    $(newPageItems).fadeIn(250, function() { 
                        pagerCurrentLabel.text(page);
                    }); 
                });

                return;
            }

            function fadeOutItems() {
                $(currentItems).each(function(index, elem) {
                    var delay = (index * pageFlipFadeSpeed) / 6;
                    $(this).stop(true).delay(delay).animate({
                        opacity: 0
                    }, pageFlipFadeSpeed);

                    setTimeout(function () {
                        pagerCurrentLabel.text(page);
                        $(currentItems).each(function() { $(this).hide(); });
                        fadeInItems();
                    }, 2 * pageFlipFadeSpeed);
                });

            }

            function fadeInItems() {
                $(newPageItems).each(function(index, elem) {
                    var delay = (index * pageFlipFadeSpeed) / 6;
                    $(this).stop(true).css('opacity', 0).show().delay(delay).animate({
                        opacity: 1
                    }, pageFlipFadeSpeed);
                });
            }

            fadeOutItems();
        }

        function getItemsOnPage(page) {
            var startIndex = (page - 1) * pageSize;
            var endIndex = page * pageSize;

            return items.slice(startIndex, endIndex);
        }

        function setupEvents() {
            // jQuery Unveil (lazy loading)
            $('.work-showcase img').unveil();

            items.off('click').on('click', function(e) {
                var portfolioItemDescription = $(this).find('.portfolio-item-description');
                var showCaseImages = portfolioItemDescription.find('.work-showcase img');
                showCaseImages.trigger('unveil');
                var itemContentHtml = portfolioItemDescription.html();
                modal.showModalWithContent(itemContentHtml);
            });
        }

        init();

    });

});
