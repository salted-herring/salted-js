(function($) {
	window.ajaxRouteInited = false;
	window.ajaxRouteCache = true;
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
			state_data		=	{ container: container.selector };
			
		if (url) {
			$(this).unbind('click').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				onStart();
				document.title = title;
				$.get(url, data, function(response) {
					if (window.ajaxRouteCache) {
						state_data.content = response;
					} else {
						state_data.url = url;
					}
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
	
	window.initAjaxRoute = function(selector, cache) {
		if (window.history && history.pushState) {
			window.ajaxRouteCache = cache;
			var defaults = { container: selector };
			if (window.ajaxRouteCache) {
				defaults.content = $(selector).html();
			} else {
				defaults.url = location.pathname;
			}
			history.replaceState(defaults, document.title, window.location.pathname);
			
			window.addEventListener('popstate', function(e) {
				if (e.state && e.state.container){
					if (e.state.content) {
						$(e.state.container).html(e.state.content);
					}
					
					if (e.state.url) {
						$.get(e.state.url, function(data) {
							data = $(data);
							data = data.find(e.state.selector).length == 1 ? data.find(e.state.selector).html() : data;
							$(e.state.container).html(data);
						});
					}
				}
			});
		}
		window.ajaxRouteInited = true;
	};
 })(jQuery);