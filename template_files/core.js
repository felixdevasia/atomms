function areCookiesEnabled() {
    return navigator.cookieEnabled;
}

jQuery.fn.preventDoubleSubmission = function() {
    $j(this).submit(function(e) {
        var $form = $j(this);
        if ($form.data('submitted') === true) {
            //Previously submitted - don't submit again
            e.preventDefault();
        } else {
            disableBut($form.find(":submit"));
            $form.data('submitted', true);
        }
    });
};

function disableBut(button) {
    button.addClass('disabledBtn');
    button.prop('disabled',true);
}
