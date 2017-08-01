(function($) {
	$.fn.fixy = function(prTopOffset) {
        var me              =   $(this),
            myYOffset       =   me.offset().top,
            parent          =   $(this).parent(),
            parentYOffset   =   parent.offset().top,
            uncles          =   parent.siblings(),
            tallest_uncle   =   uncles.maxHeight(),
            topOffset       =   function()
                                {
                                    if (isNaN(prTopOffset)) {
                                        return $(prTopOffset).outerHeight();
                                    }

                                    return prTopOffset;
                                },
            updatePos       =   function(e)
                                {
                                    var offset = $(window).scrollTop() - myYOffset + topOffset();
                                    if (offset >= 0) {
                                        if (offset + me.outerHeight() + (myYOffset - parentYOffset) > tallest_uncle.outerHeight())
                                        {
                                            offset = tallest_uncle.outerHeight() - (myYOffset - parentYOffset) - me.outerHeight();
                                        }
                                    } else {
                                        offset = 0;
                                    }

                                    me.css({
                                        '-webkit-transform': 'translateY(' + offset + 'px)',
                                        'transform': 'translateY(' + offset + 'px)'
                                    });
                                };

        $(this).addClass('fixy');
        // console.log('relative offset: ' + (myYOffset - parentYOffset));
        $(window).scroll(updatePos).resize(function(e)
        {
            me.removeAttr('style');
            myYOffset       =   me.offset().top;
            parentYOffset   =   parent.offset().top;
            updatePos();
        });

        return this;
    };
})(jQuery);
