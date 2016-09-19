var autoAddress = function(api_key, callback) {
	var self = this;
	this.inputField = null;
	this.init = function() {
		if (!window.google) {
			$.when(
				$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + api_key + "&libraries=places" ),
				$.Deferred(function( deferred ){
					$( deferred.resolve );
				})
			).done(function(){
				if (callback) callback();
			});
		}
		return self;
	};
	
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