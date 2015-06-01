/**
 *  Contact form
 */

define(['jquery'], function ($) {
    "use strict";

    $(function () {

        var form = document.getElementById('contact-form'),
            name = document.getElementById('contact-form-name'),
            nameMarker = document.querySelector('#contact-form-name ~ span.marker'),
            email = document.getElementById('contact-form-email'),
            emailMarker = document.querySelector('#contact-form-email ~ span.marker'),
            message = document.getElementById('contact-form-message'),
            messageMarker = document.querySelector('#contact-form-message ~ span.marker'),
            reset = document.getElementById('contact-form-reset'),
            submit = document.getElementById('contact-form-submit'),
            overlay = document.querySelector('#contact-form .overlay'),
            overlayIcon = document.querySelector('#contact-form .overlay > .content > i.fa'),
            overlayHeader = document.querySelector('#contact-form .overlay > .content > h2'),
            overlayMessage = document.querySelector('#contact-form .overlay > .content > p'),
            formRetry = document.getElementById('form-retry');

        reset.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            form.reset();
        });

        submit.addEventListener('click', function(e) {
            e.stopPropagation();

            var valid = true;

            if (!name.checkValidity()) {
                valid = false;
                $(name).siblings('span').addClass('invalid');
            }
            if (!email.checkValidity()) {
                valid = false;
                $(email).siblings('span').addClass('invalid');
            }
            if (!message.checkValidity()) {
                valid = false;
                $(message).siblings('span').addClass('invalid');
            }

            if (!valid)
                return false;
        });

        name.addEventListener('change', function(e) {
            if (!this.checkValidity())
                $(nameMarker).addClass('invalid');
            else
                $(nameMarker).removeClass('invalid');
        });

        email.addEventListener('change', function(e) {
            if (!this.checkValidity())
                $(emailMarker).addClass('invalid');
            else
                $(emailMarker).removeClass('invalid');
        });

        message.addEventListener('change', function(e) {
            if (!this.checkValidity())
                $(messageMarker).addClass('invalid');
            else
                $(messageMarker).removeClass('invalid');
        });

        $(form).submit(function(e) {
            e.preventDefault();
            var formData = $(form).serialize();

            // Add some metadata
            formData += "&usertime=" + encodeURIComponent((new Date()).toString());
            formData += "&useragent=" + encodeURIComponent(navigator.userAgent);
            disableInputs();
            showWaitingOverlay();

            $.ajax({
                type: "POST",
                url: $(form).attr('action'),
                data: formData
            })
            .done(function(res) {
                showSuccessOverlay();
            })
            .fail(function(res) {
                var text = res.status + ' ' + res.statusText;
                showErrorOverlay(text);
            });
        });

        function disableInputs() {
            $(form).find(':input').each(function(index, element) {
                //$(this).val('');
                $(this).attr('disabled', 'disabled');
                $(this).attr('readonly', 'readonly');

                if (!$(this).is('button'))
                    $(this).css('color', '#ddd');
            });
        }

        function enableInputs() {
            $(form).find(':input').each(function(index, element) {
                //$(this).val('');
                $(this).removeAttr('disabled');
                $(this).removeAttr('readonly');

                if (!$(this).is('button'))
                    $(this).css('color', '');
            });
        }

        function showWaitingOverlay() {
            var headerText = 'Preparing Launch';
            var text = 'Greasemonkeys hard at work.';
            showOverlay('waiting', headerText, text);

            $(formRetry).hide();
        }

        function showSuccessOverlay() {
            var headerText = 'Lift off!';
            var text = 'Your message has been sent. Thanks for reaching out!';
            showOverlay('success', headerText, text);

            $(formRetry).find('label').text('Send another?');
            $(formRetry).show().off('click').on('click', function(e) {
                e.preventDefault();

                $(message).val('');
                hideOverlay();
                enableInputs();
            });
        }

        function showErrorOverlay(errorMessage) {
            var headerText = 'Uh oh, I was unable to send your message :(';
            var text = 'Someone used the wrong unit of measure. The greasemonkeys handed me this: "' + errorMessage + '".';
            showOverlay('error', headerText, text);

            $(formRetry).find('label').text('Try again?');
            $(formRetry).show().off('click').on('click', function(e) {
                e.preventDefault();
                hideOverlay();
                enableInputs();
            });
        }

        function showOverlay(state, headerText, text) {
            var iconClass;
            if (state == 'waiting')
                iconClass = 'fa fa-fw waiting fa-spinner fa-pulse';
            else if (state == 'success')
                iconClass = 'fa fa-fw successful fa-check-circle';
            else if (state == 'error')
                iconClass = 'fa fa-fw error fa-times-circle';
            else
                iconClass = 'fa fa-fw waiting fa-spinner fa-pulse';

            $(overlayIcon).removeClass().addClass(iconClass);
            $(overlayHeader).text(headerText);
            $(overlayMessage).text(text);

            $(overlay).fadeIn(500);
        }

        function hideOverlay() {
            $(overlay).fadeOut(500);
        }

        // disableInputs();
        // showErrorOverlay('503 Service Not Available');

        // if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0)
        // {
        //     var _interval = window.setInterval(function ()
        //     {
        //         var autofills = $('input:-webkit-autofill');
        //         if (autofills.length > 0)
        //         {
        //             window.clearInterval(_interval); // stop polling
        //             autofills.each(function()
        //             {
        //                 var clone = $(this).clone(true, true);
        //                 $(this).after(clone).remove();
        //             });
        //         }
        //     }, 20);
        // }

    });

});
