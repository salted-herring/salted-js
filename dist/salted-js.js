/**
 * @file ajax_loader.js
 *
 * detachable ajax 'next page' loader
 * */
 /**
 * - elementSelector: the item's class or id. e.g. '.mission-tile', or '#btn-upload'. Don't include '$'
 * - linkSelector: the next button's class or id. e.g. '.button.next', or '#btn-next'. Don't include '$'
 * - destination: the item list container's class or id. e.g. '.item-list'. Don't include '$'
 * - preprocess: callback function that is used to process the items. This happens before items added to DOM
 * - callback: callback function after the items are added to DOM
 * */

var ajaxLoader = function(elementSelector, linkSelector, destination, preprocess, callback, loadingIndicator, completeIndicator) {
    var _self				=	this;
    this.ajaxing			=	false;
    this.elementSelector	=	elementSelector;
    this.linkSelector		=	linkSelector;
    this.destination		=	destination;
    this.preprocess			=	preprocess;
    this.callback			=	callback;
    this.loadingIndicator	=	loadingIndicator;
    this.completeIndicator	=	completeIndicator;
    this.ajax				=	null;

    if (_self.loadingIndicator) {
        _self.loadingIndicator = $(_self.loadingIndicator);
    }

    $(this.linkSelector).hide();

    this.load = function() {
        if (!_self.ajaxing) {
            _self.ajaxing = true;
            if ($(_self.linkSelector).length > 0) {
                if (_self.loadingIndicator) {
                    $(_self.destination).append(_self.loadingIndicator);
                }
                var url = $(_self.linkSelector).attr('href');

                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = '/'+ url;
                }
                _self.ajax = $.get(url, function(data) {
                    if (_self.loadingIndicator) {
                        _self.loadingIndicator.remove();
                    }
                    _self.ajaxing = false;
                    _self.ajax = null;

                    var tiles	=	$(data).find(_self.elementSelector),
                        btn		=	$(data).find(_self.linkSelector);

                    if (_self.preprocess) {
                        _self.preprocess(tiles);
                    }

                    $(_self.destination).append(tiles);

                    if (btn.length > 0) {
                        $(_self.linkSelector).replaceWith(btn.hide());
                    }else{
                        $(_self.linkSelector).remove();
                    }

                    if (_self.callback) {
                        _self.callback(tiles);
                    }

                    if ($(_self.linkSelector).length === 0) {
                        _self.destruct();
                    }
                });
            }
        }
    };

    this.abort = function() {
        if (_self.ajax) {
            _self.ajax.abort();
            _self.ajax = null;
            _self.ajaxing = false;
            if (_self.loadingIndicator) {
                _self.loadingIndicator.remove();
            }
        }
    };

    this.destruct = function() {
        if (_self.completeIndicator) {
            $(_self.destination).append(_self.completeIndicator);
        }
        delete this.load;
        delete this.ajaxing;
        delete this.abort;
        delete this.elementSelector;
        delete this.linkSelector;
        delete this.destination;
        delete this.preprocess;
        delete this.callback;
        delete this.ajax;
        delete this.loadingIndicator;
        delete this.completeIndicator;
        delete this.destruct;
    };

    return this;
};
;var _processing_ajaq = false;
var ajaq = function() {
	this.queue = [];
	var self = this;
	
	this.add = function(ajaxRequest, immediateEmit) {
		self.queue.push(ajaxRequest);
		if (immediateEmit) {
			self.emit();
		}
		return self;
	};
	
	this.emit = function() {
		if (self.queue.length > 0) {
			if (!_processing_ajaq) {
				_processing_ajaq = true;
				var request = self.queue[0];
				self.queue.shift();
				$.ajax(request).done(request.onDone ? request.onDone : null).fail(request.onFail ? request.onFail : null).then(function() { _processing_ajaq = false; self.emit();});
			}
		} else {
			_processing_ajaq = false;
		}
	};
	
	return this;
};

var ajaxRequest = function(url, method, data, onDone, onFail) {
	this.url = url;
	this.method = method;
	if (data) {
		this.data = data;
	}
	
	if (onDone && typeof(onDone) === 'function') {
		this.onDone = onDone;
	}
	
	if (onFail && typeof(onFail) === 'function') {
		this.onFail = onFail;
	}
	
	return this;
};;(function($) {
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

            history.replaceState(defaults, document.title, window.location.pathname + window.location.search);

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
;/**
 * - callbacks: null | {
        onstart: function | null,
        sucess: function | null,
        fail: function | null,
        done: function | null
     }
 * */
(function($) {
    $.fn.ajaxSubmit         =   function(cbf)
    {
        var self            =   $(this),
            endpoint        =   $(this).attr('action'),
            method          =   $(this).attr('method'),
            lockdown        =   false,
            callbacks       =   $.extend({
                                    validator: function() { return true; },
                                    onstart: function() {},
                                    success: function(response) {},
                                    fail: function(response) {},
                                    done: function(response) {}
                                }, cbf);

        $(this).submit(function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            if (!callbacks.validator()) {
                return false;
            }

            if (lockdown) {
                return false;
            }

            lockdown            =   true;

            var formData        =   new FormData($(this)[0]);

            callbacks.onstart();

            $.ajax({
                url         :   endpoint,
                type        :   method,
                data        :   formData,
                cache       :   false,
                contentType :   false,
                processData :   false
            }).done(callbacks.success).fail(callbacks.fail).always(function(response)
            {
                lockdown = false;
                callbacks.done(response);
            });
        });
    };
 })(jQuery);
;window.usedGAPI = window.usedGAPI ? window.usedGAPI : [];
var autoAddress = function(api_key, callback) {
	var self = this;
	this.inputField = null;
	this.init = function() {
		if (!window.google) {
			if (!window.usedGAPI[api_key]) {
				window.usedGAPI[api_key] = true;
				$.when(
					$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + api_key + "&libraries=places" ),
					$.Deferred(function( deferred ){
						$( deferred.resolve );
					})
				).done(function(){
					if (callback) callback();
				});
			} else {
				if (callback) {
					var watching = setInterval(function(){
						if (window.google) {
							clearInterval(watching);
							watching = null;
							callback();
						}
					}, 50);
				}
			}
		}
		return self;
	};

    this.activate = callback;

	/*this.fillInAddress = function() {
		// Get the place details from the autocomplete object.
		var place = self.inputField.getPlace();
		for (var component in componentForm) {
		  document.getElementById(component).value = '';
		  document.getElementById(component).disabled = false;
		}

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (var i = 0; i < place.address_components.length; i++) {
		  var addressType = place.address_components[i].types[0];
		  if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			document.getElementById(addressType).value = val;
		  }
		}
	};*/

	this.gplacised = function(dom_id) {
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		var inputField = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(document.getElementById(dom_id)),
			{types: ['geocode']});
		return inputField;
		// When the user selects an address from the dropdown, populate the address
		// fields in the form.
		//self.inputField.addListener('place_changed', self.fillInAddress);
	};

	return this.init();
};
;if (typeof(Handlebars) != 'undefined') {
    var BulificationTemplate    =   Handlebars.compile('<div class="message is-{{#if Colour}}{{Colour}}{{else}}dark{{/if}} bulification"><div class="message-header"><p>{{Title}}</p><button class="delete" aria-label="delete"></button></div><div class="message-body">{{{Content}}}<div class="has-text-centered actions"><a class="button is-info">OK</a></div></div></div>'),
        Bulification            =   function(title, content, colour)
        {
            this.html           =   $(BulificationTemplate({Title: title, Content: content, Colour: colour}));

            this.show           =   function()
                                    {
                                        $('body').addClass('blurred');
                                        me.html.appendTo($('body'));
                                    };

            this.close          =   function(e)
                                    {
                                        if (e) {
                                            e.preventDefault();
                                            me.html.remove();
                                            $('body').removeClass('blurred');
                                        }
                                    };

            var me              =   this;

            this.html.find('button.delete').click(this.close);
            this.html.find('a.button').click(this.close);

            return this;
        };
}

function BulmaAlert()
{
    if (!(typeof Handlebars)) {
        console.warn('To use Bulification, install http://handlebarsjs.com/ first!');
    }

    window.alert        =   function(msg, title)
    {
        if (!title) { title = 'Message'; }
        var msgbox = new Bulification(title, msg);
        msgbox.show();
    };
}
;(function($) {
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
;/**
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
	
 })(jQuery);;(function($) {

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
;/*
routing_options = {
    enabled,
    input_id,
    output_id
}
*/
window.usedGAPI = window.usedGAPI ? window.usedGAPI : [];
var gmap = function(api_key, map_id, locs, zoom_rate, routing_options, disableUI, disableScroll) {
	var self			=	this,
		map				=	null,
		center_point	=	null,
        dir_service     =   null,
        dir_display     =   null,
        markers         =   [];

	this.init = function()
    {
		if (locs && locs.length > 0) {
            if (locs.length > 1) {
                var bound = new google.maps.LatLngBounds();

                for (i = 0; i < locs.length; i++) {
                    bound.extend( new google.maps.LatLng(locs[i].lat, locs[i].lng) );
                }

                center_point = bound.getCenter();

            } else {
                center_point = locs[0];
            }
            
			map = new google.maps.Map(document.getElementById(map_id), {
			  zoom: zoom_rate ? zoom_rate : 18,
			  center: center_point,
              disableDefaultUI: (disableUI === undefined || disableUI === null) ? false : disableUI
			});

            if (disableUI) {
                var noPoi = [
                    {
                        featureType: "poi",
                        stylers: [
                          { visibility: "off" }
                        ]
                    }
                ];

                map.setOptions({styles: noPoi});
            }

            if (disableUI) {
                map.setOptions({scrollwheel: false});
            }


			for (var i = 0; i < locs.length; i++) {
				var marker = new google.maps.Marker({
					position: locs[i],
					map: map
				});

                markers.push(marker);
			}

            if (routing_options && routing_options.enabled) {
                dir_service = new google.maps.DirectionsService();
                dir_display = new google.maps.DirectionsRenderer();
                dir_display.setMap(map);
                if (routing_options.output_id) {
                    dir_display.setPanel(document.getElementById(routing_options.output_id));
                }

                var autoComplete = new google.maps.places.Autocomplete(
        			/** @type {!HTMLInputElement} */(document.getElementById(routing_options.input_id)),
        			{types: ['geocode']});
                autoComplete.addListener('place_changed', function()
                {
                    var place = autoComplete.getPlace();
                    $('#' + routing_options.input_id).data('lat', place.geometry.location.lat());
                    $('#' + routing_options.input_id).data('lng', place.geometry.location.lng());
                });
            }
		}
	};

	this.update = function(lat, lng)
	{
        self.clearMarkers();
        lat = typeof(lat) == 'string' ? lat.toFloat() : lat;
        lng = typeof(lng) == 'string' ? lng.toFloat() : lng;
		var marker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			map: map
		});
        markers.push(marker);
        map.setCenter({lat: lat, lng: lng});
	};

    this.clearMarkers = function()
    {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }

        markers = [];
    };

    this.route = function(origin, destination, travel_mode)
    {
        var request = {
            origin:         origin,
            destination:    destination,
            travelMode:     travel_mode ? travel_mode : 'DRIVING'
        };

        dir_service.route(request, function(response, status) {
            if (status == 'OK') {
                dir_display.setDirections(response);
            }
        });
    };

	if (!window.google) {
		if (!window.usedGAPI[api_key]) {
            window.usedGAPI[api_key] = true;
			$.when(
				$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + api_key + "&libraries=places"),
				$.Deferred(function( deferred ){
					$( deferred.resolve );
				})
			).done(self.init);
		} else {
			var watching = setInterval(function(){
				if (window.google) {
					clearInterval(watching);
					watching = null;
					self.init();
				}
			}, 50);
		}
	} else {
		self.init();
	}
	return this;
};

(function($)
{
	$.fn.gmap = function(cbf)
    {
        var self        =   $(this),
            callback    =   cbf,
            lat         =   self.data('lat').toFloat(),
            lng         =   self.data('lng').toFloat(),
            zoom        =   Math.round(self.data('zoom').toFloat()),
            api         =   self.data('api'),
            input       =   self.data('input'),
            output      =   self.data('output'),
            map         =   new gmap(api, self.attr('id'), [{lat: lat, lng: lng}], zoom, {enabled: (input !== undefined ? true : false), input_id: input, output_id: output});

        return map;
    };
 })(jQuery);
;/**
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
	
})(jQuery);;var simplayer					=	function(title,content,buttons,zindex,maxWidth,touchClose) {
    this.tray					=	$('<div />').attr('id','simplayer-tray');
    this.title					=	$('<h2 />').addClass('simplayer-title');
    this.content				=	$('<div />').addClass('simplayer-content');
    this.buttons				=	$('<div />').addClass('clearfix simplayer-buttons');
    this.afterClose				=	function() {
                                        _wrapper.remove();
                                        _tray.remove();
                                        $('body').removeAttr('style');

                                        delete _self.tray;
                                        delete _self.title;
                                        delete _self.content;
                                        delete _self.buttons;
                                        delete _self.wrapper;
                                    };

    if (title) {
        this.title.html(title);
    }

    if (content) {
        this.content.html(content);
    }

    var _self					=	this,
        _tray					=	this.tray,
        _wrapper				=	null,
        _thisButtons 			=	this.buttons,
        _maxWidth				=	maxWidth,
        _touchClose				=	touchClose === false ? false : true,
        _duration				=	0.25,
        _tween					=	{opacity: 0, scale: 0, onComplete:function() {
                                        TweenMax.to(_wrapper.css('visibility', 'visible'), _duration, {opacity: 1, scale: 1, ease: Back.easeOut.config(1.7)});
                                    }},
        _rtween					=	{opacity: 0, scale: 0, ease: Back.easeIn.config(1.7), onComplete: _self.afterClose};


    if (buttons && typeof(buttons) == 'object' && buttons.length > 0) {
        buttons.forEach(function(btn) {
            var sbtn = $('<button />').addClass('simplayer-button button').html(btn.Label);
            if (btn.Event && typeof(btn.Event) == 'function') {
                sbtn.click(btn.Event);
            }
            _thisButtons.append(sbtn);
        });
    }else{
        var sbtn = $('<button />').addClass('simplayer-button button').html('OK');
        sbtn.click(function(e) {
            _self.close();
        });
        _thisButtons.append(sbtn);
    }

    this.wrapper				=	$('<div />').attr('id', 'simplayer-wrapper').append(this.title, this.content, this.buttons);

    if (buttons === false) {
        this.buttons.hide();
    }

    if (_maxWidth) {
        this.wrapper.css('max-width', _maxWidth);
    }

    _wrapper = this.wrapper;

    zindex = zindex ? zindex : 99998;
    this.tray.css('z-index', zindex);
    this.wrapper.css('z-index', zindex+1);

    this.show 			=	function(effect) {
        $('body').css('overflow','hidden').append(_tray, _wrapper);
        _wrapper.css({
            'max-height': '90%',
            'visibility': 'hidden'
        });
        var wrapperHeight		=	_wrapper.outerHeight(),
            wrapperPadding		=	_wrapper.css('padding-top').replace(/px/gi, '').toFloat() + _wrapper.css('padding-bottom').replace(/px/gi, '').toFloat(),
            margins				=	_wrapper.find('.simplayer-title').margin('vertical') + _wrapper.find('.simplayer-buttons').margin('vertical'),
            nonCntHeight		=	_wrapper.find('.simplayer-title').outerHeight() + _wrapper.find('.simplayer-buttons').outerHeight();

        _wrapper.find('.simplayer-content').css('max-height', wrapperHeight - nonCntHeight - margins - wrapperPadding).css('overflow-y','auto');

        if (effect) {
            _duration			=	effect.duration;
            _tween				=	clone(effect.from);
            _tween.onComplete	=	function() {
                                        TweenMax.to(_wrapper.css('visibility', 'visible'), _duration, clone(effect.to));
                                    };
            _rtween				=	clone(effect.from);
            _rtween.onComplete	=	_self.afterClose;
        }

        if (_touchClose) {
            _tray.unbind('mousedown').mousedown(function() { _self.close(); });
        }

        setTimeout(function(){
            //_wrapper.css('visibility', '');
            TweenMax.to(_wrapper, 0, _tween);
        }, 100);

        TweenMax.to(_tray, 0, {opacity: 0, onComplete: function() {
            TweenMax.to(_tray, _duration, {delay: 0.1, opacity: 1});
        }});
    };

    this.update					=	function(title, content, callback) {
        _self.title.html(title);
        _self.content.html(content);
        if (callback) {
            callback();
        }
    };

    this.addClass				=	function(classname) {
        this.wrapper.addClass(classname);
    };

    // this.updateScrollableHeight	=	function() {
    // 	var wrapperHeight		=	_wrapper.outerHeight(),
    // 		wrapperPadding		=	_wrapper.css('padding-top').replace(/px/gi, '').toFloat() + _wrapper.css('padding-bottom').replace(/px/gi, '').toFloat(),
    // 		margins				=	_wrapper.find('.simplayer-title').margin('vertical') + _wrapper.find('.simplayer-buttons').margin('vertical'),
    // 		nonCntHeight		=	_wrapper.find('.simplayer-title').outerHeight() + _wrapper.find('.simplayer-buttons').outerHeight();
    // 	_wrapper.find('.simplayer-content').css('max-height', wrapperHeight - nonCntHeight - margins - wrapperPadding);
    // };

    this.close					=	function() {
        TweenMax.to(_tray, _duration, {opacity: 0});
        TweenMax.to(_wrapper, _duration, _rtween);
    };

    this.btnEvent				=	function(idx, event) {
        var buttons = this.buttons.find('.simplayer-button');
        if (idx < buttons.length) {
            buttons.eq(idx).unbind('click').click(event);
        }
    };

    return this;
};

function HijackAlert(tweenObjects) {
    window.alert = function(msg, title) {
        if (!title) { title = 'Message'; }
        var msgbox = new simplayer(title, msg);
        msgbox.show(tweenObjects);
    };
}
;/*
 * Prototypes
 * */
String.prototype.kmark = function() {
    if (this.length === 0) { return this; }
    var x = this.split('.'),
        x1 = x[0],
        x2 = x.length > 1 ? '.' + x[1] : '',
        rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

Number.prototype.kmark = function()
{
    var s = this.toString();
    return s.kmark();
};

String.prototype.toDollar = function toDollar(digits) {
    var n = this.toFloat();
    n = Math.round(n*100) / 100;
    digits = (digits === null || digits === undefined) ? 2 : digits;
    return '$' + n.toFixed(digits).kmark();
};

Number.prototype.toDollar = function toDollar(digits) {
    var n = this;
    digits = (digits === null || digits === undefined) ? 2 : digits;
    return '$' + n.toFixed(digits).kmark();
};

String.prototype.toFloat = function toFloat() {
    var n = this.trim();
    n = n.replace(/\$/gi,'').replace(/,/gi,'');
    if (n.length === 0) { return 0; }
    return isNaN(parseFloat(n))?0:parseFloat(n);
};

Number.prototype.toFloat = function toFloat() {
    return this.valueOf();
};

String.prototype.DoubleDigit = function() {
    var n = this.toFloat();

    return n < 10 ? ('0' + this) : this;
};

Number.prototype.DoubleDigit = function() {
    var s = this.toString();

    return this < 10 ? ('0' + s) : s;
};

Date.prototype.now = function() {
    return this.getFullYear() + '-' + (this.getMonth() + 1).DoubleDigit() + '-' + this.getDate().DoubleDigit() + ' ' +  this.getHours().DoubleDigit() + ':' + this.getMinutes().DoubleDigit() + ':' + this.getSeconds().DoubleDigit();
};

Array.prototype.shuffle = function() {
    var array = this;
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

Array.prototype.removeByValue = function()
{
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// if (typeof module === 'undefined') {
    /*
     * anonymous functions
     * */
var QueryString = function ()
{
    if (window.location.search.length === 0) { return undefined; }
     var query_string = {};
     var query = window.location.search.substring(1);
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
              query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
              var arr = [ query_string[pair[0]], pair[1] ];
              query_string[pair[0]] = arr;
        } else {
              query_string[pair[0]].push(pair[1]);
        }
      }
    return query_string;
} (); //usage: e.g. URL: http://wildeyes.local?hello=123, run QueryString.hello will output '123'

$(window).resize(function(e)
{
    window.isMobile = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    } ();
}).resize();

// }


/*
 * functions
 * */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(mod) {
    var rand = Math.ceil(Math.random() * 10);
    return rand == mod ? rand % mod : rand;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function trace(el,line) {
    if (console) {
        if (line) {
            console.log(line + ': ' + el);
        }else{
            console.log(el);
        }
    }
}

function isAboveViewport(el, offset) {
    offset = offset ? offset : 0;
    if ($(el).offset().top + $(el).outerHeight() <= $(window).scrollTop() + offset) {
        return true;
    }

    return false;
}

function getOrientation(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {

    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
    var length = view.byteLength, offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) == 0x0112)
            return callback(view.getUint16(offset + (i * 12) + 8, little));
      }
      else if ((marker & 0xFF00) != 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}

function clone(obj) {
    if (null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}


if (typeof module !== 'undefined' && module.exports !== null) {
    module.exports.String = String;
    module.exports.Number = Number;
    module.exports.Date = Date;
    module.exports.Array = Array;
    module.exports.Object = Object;
}
