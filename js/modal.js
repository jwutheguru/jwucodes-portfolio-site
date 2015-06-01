define(['jquery', 'util', 'debug'], function ($, util, debug) {
    "use strict";

    var modalOverlay = $('#modal-overlay'),
        modalContainer = $('#modal-container'),
        modalContent = $('#modal-content'),
        modalHeader = $('#modal-header'),
        modalClose = $('#modal-close');

    var modalOpen = false;

    function showModalWithContent(html) {
        util.disableScroll();

        modalContent.show();
        modalContent.empty();
        modalContent.html(html);

        modalOverlay.addClass('modal-open');
        modalContainer.addClass('modal-open');

        modalOpen = true;
    }

    function hideModal() {
        util.enableScroll();

        modalOverlay.removeClass('modal-open');
        modalContainer.removeClass('modal-open');
        modalContent.fadeOut(250, function(e) { $(this).empty(); });
        // setTimeout(function() { modalContent.empty(); }, 250);

        modalOpen = false;
    }

    $(document).keyup(function(e) {
        if (e.keyCode === 27 && modalOpen) {
            hideModal();
        }
    });

    modalClose.off('click').on('click', function(e) {
        hideModal();
    });

    return {
        showModalWithContent: showModalWithContent,
        hideModal: hideModal
    };

});
