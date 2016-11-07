var simplayer					=	function(title,content,buttons,zindex,maxWidth,touchClose) {
	this.tray					=	$('<div />').attr('id','simplayer-tray');
	this.title					=	$('<h2 />').addClass('simplayer-title').html(title);
	this.content					=	$('<div />').addClass('simplayer-content').html(content);
	this.buttons					=	$('<div />').addClass('clearfix simplayer-buttons');
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
	var _self					=	this,
		_tray					=	this.tray,
		_wrapper				=	null,
		_thisButtons 			=	this.buttons,
		_maxWidth				=	maxWidth,
		_touchClose				=	touchClose === false ? false : true,
		_duration				=	0.25,
		_tween					=	{opacity: 0, scale: 0, onComplete:function() {
										TweenMax.to(_wrapper, _duration, {opacity: 1, scale: 1, ease: Back.easeOut.config(1.7)});
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
	
	if (_maxWidth) {
		this.wrapper.css('max-width', _maxWidth);
	}
	
	_wrapper = this.wrapper;
	
	zindex = zindex ? zindex : 99998;
	this.tray.css('z-index', zindex);
	this.wrapper.css('z-index', zindex+1);
	
	this.show 			=	function(effect) {
		$('body').css('overflow','hidden').append(_tray, _wrapper);
		_wrapper.css('max-height', '90%');
		var wrapperHeight		=	_wrapper.outerHeight(),
			wrapperPadding		=	_wrapper.css('padding-top').replace(/px/gi, '').toFloat() + _wrapper.css('padding-bottom').replace(/px/gi, '').toFloat(),
			margins				=	_wrapper.find('.simplayer-title').margin('vertical') + _wrapper.find('.simplayer-buttons').margin('vertical'),
			nonCntHeight		=	_wrapper.find('.simplayer-title').outerHeight() + _wrapper.find('.simplayer-buttons').outerHeight();
		
		_wrapper.find('.simplayer-content').css('max-height', wrapperHeight - nonCntHeight - margins - wrapperPadding).css('overflow-y','auto');
		
		if (effect) {
			_duration			=	effect.duration;
			_tween				=	clone(effect.from);
			_tween.onComplete	=	function() {
										TweenMax.to(_wrapper, _duration, clone(effect.to));
									};
			_rtween				=	clone(effect.from);
			_rtween.onComplete	=	_self.afterClose;
		}
		
		if (_touchClose) {
			_tray.unbind('mousedown').mousedown(function() { _self.close(); });
		}
		
		TweenMax.to(_wrapper, 0, _tween);
		TweenMax.to(_tray, 0, {opacity: 0, onComplete: function() {
			TweenMax.to(_tray, _duration, {opacity: 1});
		}});
	};
	
	
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
	
	
};
function HijackAlert(tweenObjects) {
	window.alert = function(msg, title) {
		if (!title) { title = 'Message'; }
		var msgbox = new simplayer(title, msg);
		msgbox.show(tweenObjects);
	};
}