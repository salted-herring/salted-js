var gmap = function(api_key, map_id, locs) {
	var self			=	this,
		map				=	null,
		center_point	=	null;
	
	this.init = function() {
		if (locs && locs.length > 0) {
			center_point = locs[0];
			map = new google.maps.Map(document.getElementById(map_id), {
			  zoom: 18,
			  center: center_point
			});
			for (var i = 0; i < locs.length; i++) {
				var marker = new google.maps.Marker({
					position: locs[i],
					map: map
				});
			}
		}
	};
	
	if (!window.google) {
		$.when(
			$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + api_key ),
			$.Deferred(function( deferred ){
				$( deferred.resolve );
			})
		).done(self.init);
	} else {
		self.init();
	}
	
	return this;
};