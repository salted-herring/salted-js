/**
 * @file get_gutters.js
 *
 * Handle get element margin | padding 
 * */
 
/**
 * - dimension: 'horizontal' || 'vertical'
 * */
(function($) {

	$.fn.margin = function(dimension) {
		var n	=	0,
			el	=	$(this);
		if (dimension == 'horizontal') {
			n = el.css('margin-left').replace(/px/gi,'').toFloat() + el.css('margin-right').replace(/px/gi,'').toFloat();
		}else{
			n = el.css('margin-top').replace(/px/gi,'').toFloat() + el.css('margin-bottom').replace(/px/gi,'').toFloat();
		}
		
		return n;
	};
	
	$.fn.padding = function(dimension) {
		var n	=	0,
			el	=	$(this);
		if (dimension == 'horizontal') {
			n = el.css('padding-left').replace(/px/gi,'').toFloat() + el.css('padding-right').replace(/px/gi,'').toFloat();
		}else{
			n = el.css('padding-top').replace(/px/gi,'').toFloat() + el.css('padding-bottom').replace(/px/gi,'').toFloat();
		}
		
		return n;
	};
	
	$.fn.gutter = function(dimension) {
		var el	=	$(this);
		return el.margin(dimension) + el.padding(diemension);
	};
	
 })(jQuery);