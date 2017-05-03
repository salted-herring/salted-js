(function($) {

    $.fn.maxHeight = function() {
        var tallest =   null,
            highest =   0;
        this.each(function(i, el)
        {
            if ($(this).outerHeight() > highest) {
                highest = $(this).outerHeight();
                tallest = $(this);
            }
        });

        return tallest;
    };

 })(jQuery);
