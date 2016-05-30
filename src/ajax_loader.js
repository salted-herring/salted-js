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
};