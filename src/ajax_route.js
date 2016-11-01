(function($) {
	window.ajaxRouteInited = false;
	$.fn.ajaxRoute = function(content_scheme, data_object, cbf) {
		if (!window.ajaxRouteInited) {
			console.error('AjaxRoute is not initialised!\nPlease initAjaxRoute("#element-id"); first!');
			return false;
		}
		
        var self            =   $(this),
			url				=	$(this).attr('href'),
			title			=	$(this).data('title') ? $(this).data('title') : null,
			container		=	content_scheme.container ? $(content_scheme.container) : $('html'),
			content_method	=	content_scheme.method ? content_scheme.method : 'replace',
			data			=	data_object,
			onStart			=	cbf.onStart ? cbf.onStart : function() {},
			onEnd			=	cbf.onEnd ? cbf.onEnd : function() {},
			state_data		=	{
									container: container.selector,
									content: ''
								};
		if (url) {
			$(this).unbind('click').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				onStart();
				document.title = title;
				$.get(url, data, function(response) {
					state_data.content = response;
					if (window.history && history.pushState) {
						history.pushState(state_data, title, url);
					}
					if (content_method == 'replace') {
						container.html(response);
					} else {
						container.append(respsonse);
					}
					onEnd();
				});
            });			
		}
	};
	
	window.initAjaxRoute = function(selector) {
		if (window.history && history.pushState) {
			var defaults = { container: selector, content: $(selector).html()};
			trace(defaults);
			history.replaceState(defaults, document.title, window.location.pathname);
			window.addEventListener('popstate', function(e) {
				if (e.state && e.state.container && e.state.content) {
					$(e.state.container).html(e.state.content);
				}
			});
		}
		window.ajaxRouteInited = true;
	};
 })(jQuery);