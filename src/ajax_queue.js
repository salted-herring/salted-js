var _processing_ajaq = false;
var ajaq = function() {
	this.queue = [];
	var self = this;
	
	this.add = function(ajaxRequest) {
		self.queue.push(ajaxRequest);
		return self;
	};
	
	this.emit = function() {
		if (!_processing_ajaq) {
			if (self.queue.length > 0) {
				_processing_ajaq = true;
				var request = self.queue[0];
				self.queue.shift();
				$.ajax(request).done(request.onDone ? request.onDone : null).fail(request.onFail ? request.onFail : null).then(self.emit);
			} else {
				_processing_ajaq = false;
			}
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
};