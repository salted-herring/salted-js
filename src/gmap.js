/*
routing_options = {
    enabled,
    input_id,
    output_id
}
*/
window.usedGAPI = window.usedGAPI ? window.usedGAPI : [];
var gmap = function(api_key, map_id, locs, zoom_rate, routing_options) {
	var self			=	this,
		map				=	null,
		center_point	=	null,
        dir_service     =   null,
        dir_display     =   null,
        markers         =   [];

	this.init = function()
    {
		if (locs && locs.length > 0) {
			center_point = locs[0];
			map = new google.maps.Map(document.getElementById(map_id), {
			  zoom: zoom_rate ? zoom_rate : 18,
			  center: center_point
			});
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
