(function(window, document, undefined) {
  var GoogleMapView = {};
  
  // zoom level for Google Map
  var DEFAULT_ZOOM = 14;
  var STATUS_OK = 200;

  /* Renders a map for the given entry into the provided $map element. */
  GoogleMapView.render = function($map, entryData) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event) {
      if (request.status === STATUS_OK) {
      	// create mapContent and extract lattitude and longitude 
      	var mapContent = JSON.parse(request.responseText); 
      	var lat = mapContent.results[0].geometry.location.lat;
      	var lng = mapContent.results[0].geometry.location.lng;
      	var center = {
      		lat: lat,
      		lng: lng
      	};
      	// upload map with co-ordinates, and add marker using co-ordinates 
        var mapOptions = {center, zoom:DEFAULT_ZOOM}; 
		var Latlng = new google.maps.LatLng(lat, lng);
	    var map = new google.maps.Map($map[0], mapOptions);
	    var marker = new google.maps.Marker({
			position: Latlng,
			map: map,
			title: 'Destination'
		});
      } else { 
      	var errorDiv = document.getElementsByClassName('error'); 
		errorDiv[0].innerHTML = "Error: " + error;  
      }
    });
    request.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + entryData.address);
    request.send();
  };

  window.GoogleMapView = GoogleMapView;
})(this, this.document);
