(function(win, $) {
    $(document).ready(function() {
        $('div.collapse > .first').click(function() {
            var parent = $(this).parent();
            if(parent.hasClass('opened')) {
                parent.removeClass('opened');
            } else {
                parent.addClass('opened');
            }
        });    
    });
})(window, $);