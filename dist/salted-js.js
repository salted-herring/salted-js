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
				
				_self.ajax = $.get('/'+$(_self.linkSelector).attr('href'), function(data) {
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
};;/**
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
	
 })(jQuery);;/**
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
	
})(jQuery);;var simplayer			=	function(title,content,buttons,zindex,maxWidth) {
	this.tray			=	$('<div />').attr('id','simplayer-tray');
	this.title			=	$('<h2 />').addClass('simplayer-title').html(title);
	this.content			=	$('<div />').addClass('simplayer-content').html(content);
	this.buttons			=	$('<div />').addClass('clearfix simplayer-buttons');
	
	var _self			=	this,
		_tray			=	this.tray,
		_wrapper		=	null,
		_thisButtons 	=	this.buttons,
		_maxWidth		=	maxWidth;
	
	
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
	
	this.wrapper			=	$('<div />').attr('id', 'simplayer-wrapper').append(this.title, this.content, this.buttons);
	
	if (_maxWidth) {
		this.wrapper.css('max-width', _maxWidth);
	}
	
	_wrapper = this.wrapper;
	
	zindex = zindex ? zindex : 99998;
	this.tray.css('z-index', zindex);
	this.wrapper.css('z-index', zindex+1);
	
	this.show 			=	function() {
		$('body').css('overflow','hidden').append(_tray, _wrapper);
		
		_wrapper.css('max-height', '90%');
		var wrapperHeight	=	_wrapper.outerHeight(),
			wrapperPadding	=	_wrapper.css('padding-top').replace(/px/gi, '').toFloat() + _wrapper.css('padding-bottom').replace(/px/gi, '').toFloat(),
			margins			=	_wrapper.find('.simplayer-title').margin('vertical') + _wrapper.find('.simplayer-buttons').margin('vertical'),
			nonCntHeight	=	_wrapper.find('.simplayer-title').outerHeight() + _wrapper.find('.simplayer-buttons').outerHeight();
		
		_wrapper.find('.simplayer-content').css('max-height', wrapperHeight - nonCntHeight - margins - wrapperPadding).css('overflow-y','auto');
		TweenMax.to(_wrapper, 0, {opacity: 0, scale: 0, onComplete:function() {
			TweenMax.to(_wrapper, 0.25, {opacity: 1, scale: 1, ease: Back.easeOut.config(1.7)});
		}});
	};
	
	
	this.close			=	function() {
		TweenMax.to(_wrapper, 0.25, {opacity: 0, scale: 0, ease: Back.easeIn.config(1.7), onComplete:function() {
			_wrapper.remove();
			_tray.remove();
			$('body').removeAttr('style');
			
			delete _self.tray;
			delete _self.title;
			delete _self.content;
			delete _self.buttons;
			delete _self.wrapper;
		}});
	};
	
	this.btnEvent		=	function(idx, event) {
		var buttons = this.buttons.find('.simplayer-button');
		if (idx < buttons.length) {
			buttons.eq(idx).unbind('click').click(event);
		}
	};
};

function HijackAlert() {
	window.alert = function(msg, title) {
		if (!title) { title = 'Message'; }
		var msgbox = new simplayer(title, msg);
		msgbox.show();
	};
}



;/*
 * Prototypes
 * */
String.prototype.kmark = function kmark() {
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

String.prototype.toDollar = function toDollar(digits) {
	var n = this.toFloat();
	digits = digits === null ? 2 : digits;
	return '$' + n.toFixed(digits).kmark();
};

Number.prototype.toDollar = function toDollar(digits) {
	var n = this;
	digits = digits === null ? 2 : digits;
	return '$' + n.toFixed(digits).kmark();
};

String.prototype.toFloat = function toFloat() {
	var n = jQuery.trim(this);
	n = n.replace(/\$/gi,'').replace(/,/gi,'');
	if (n.length === 0) { return 0; }
	return isNaN(parseFloat(n))?0:parseFloat(n);
};

Number.prototype.toFloat = function toFloat() {
	return this;
};


/*
 * anonymous functions
 * */
var QueryString = function () {
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

window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
} ();


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