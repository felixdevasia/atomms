var LoginOverlay = (function($j) {
    var init = function(overrideOptions) {
    	jQuery.noConflict();
        var options = {
            formID: '#login-form',
            submitButtonID: '#login-submit',
            modalID: '#login-modal',
            messaging: true,
            targetOrigin: 'https://login.verizonwireless.com',
            reloadParentOnClose: false,
            removeCookiesOnClose: false,
            cookieDomain: '.verizonwireless.com',
            cookiePath: '/',
        };
        $j.extend(options, overrideOptions);

        $j(options.formID).submit(function() {
            $j(options.submitButtonID).prop('disabled', true);
            $j(options.modalID).modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        });

        $j(options.modalID).on('hide.bs.modal', function (e) {
            $j(options.submitButtonID).prop('disabled', false);
            if (options.removeCookiesOnClose) {
                $j(options.modalID + ' iframe')[0].contentWindow.postMessage('removeCookies', options.targetOrigin);
            }
            if (options.reloadParentOnClose) {
                location.reload(true);
            }
        })

        if (options.messaging) {
            initMessaging(options);
        }
    };

    var initMessaging = function(overrideOptions) {
        var options = {
            modalID: '#login-modal',
            closeButtonID: '#login-modal-close',
            targetOrigin: 'https://login.verizonwireless.com',
            cookieDomain: '.verizonwireless.com',
            cookiePath: '/',
        };
        $j.extend(options, overrideOptions);

        $j(window).on('message', function(e) {
            var event = e.originalEvent;
            var message = event.data;
            if (event.origin != options.targetOrigin) {
                // foresee has a lot of event messages going back n forth so this causes a lot of overhead.  Only uncomment in local machine
                //if (console.log) {
                    //console.log("invalid origin: " + event.origin + ", expected: " + options.targetOrigin + ", message: " + message);
                //}
                return;
            }

            if (message == 'removeCookies') {
                $j.removeCookie(options.authCookieName, { path: options.cookiePath, domain: options.cookieDomain });
                // we might remove more cookies in the future...
            } else if (message == 'closeOverlay') {
                $j(options.modalID).modal('hide');
            } else {
                if (console.log) {
                    console.log("message not supported: " + message);
                }
            }
        });

        if (options.closeButtonID) {
            $j(options.closeButtonID).click(function(e) {
                e.preventDefault();
                window.parent.postMessage('closeOverlay', options.targetOrigin);
            });
        }
    }

    return {
        init: init,
        initMessaging: initMessaging
    };

})(jQuery);