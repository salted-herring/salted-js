(function($) {
	window.ajaxRouteInited = false;
	window.ajaxRouteCache = true;
	window.ajaxRouteCallbacks = [];
	window.ajaxRouteErrorHandlers = [];
	window.popstateTransition = {
		onStart: function() {},
		onEnd: function() {}
	};

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

			if (typeof(selector) == 'object') {
				selector = selector.toString();
			}

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
						window.popstateTransition.onStart();
						$.ajax({
							url: e.state.url,
							type: 'get',
							cache: true,
							contentType: false,
							processData: false
					    }).done(function(data) {
						   var html = $($.parseHTML(data));

						   if (e.state.container.indexOf(',') >= 0) {
							   var containers = e.state.container.split(',');
							   containers.forEach(function(selector) {
								   selector = $.trim(selector);
								   //$($.parseHTML(response)).filter("#success");
								   if (html.filter(selector).length > 0 || html.find(selector).length > 0) {
									   var htmlstr = html.filter(selector).length > 0 ? html.filter(selector).html() : html.find(selector);
									   $(selector).html(htmlstr);
								   } else {
									   trace(selector + ' not found');
								   }
							   });
						   } else {
							   data = html.filter(e.state.container).length > 0 ? html.filter(e.state.container).html() : ( html.find(e.state.container).length > 0 ? html.find(e.state.container).html() : data );
							   $(e.state.container).html(data);
						   }

						   if (window.ajaxRouteCallbacks[e.state.url] && typeof(window.ajaxRouteCallbacks[e.state.url]) == 'function') {
							   var cbf = window.ajaxRouteCallbacks[e.state.url];
							   cbf();
						   }
						}).fail(function(response) {
						   if (window.ajaxRouteErrorHandlers[response.status] && typeof(window.ajaxRouteErrorHandlers[response.status]) == 'function') {
							   window.ajaxRouteErrorHandlers[response.status]();
						   } else {
							   location.reload();
						   }
					   }).always(window.popstateTransition.onEnd);
					}
				}
			});
		}
		window.ajaxRouteInited = true;
	};
 })(jQuery);
