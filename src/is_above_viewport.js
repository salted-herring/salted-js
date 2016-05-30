/**
 * @file is_above_viewport.js
 *
 * test an element is above the viewport
 * */
 
/**
 * - el: The element that you want to test
 * - offset: the offset the element is away from the top edge of the screen
 * */
(function($) {

	$.fn.isAboveViewport = function(el, offset) {
		offset = offset ? offset : 0;
		if ($(el).offset().top + $(el).outerHeight() <= $(window).scrollTop() + offset) {
			return true;
		}
		
		return false;
	};
	
})(jQuery);