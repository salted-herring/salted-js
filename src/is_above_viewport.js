(function($) {

	$.fn.isAboveViewport = function(el, offset) {
		offset = offset ? offset : 0;
		if ($(el).offset().top + $(el).outerHeight() <= $(window).scrollTop() + offset) {
			return true;
		}
		
		return false;
	}
	
})(jQuery);