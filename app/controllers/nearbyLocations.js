function index(e) {
	var index = Alloy.createController("index").getView();
	index.open();
}

function storeLocations(e) {
	var storeLocations = Alloy.createController("storeLocations").getView();
	storeLocations.open();
}

function tripPlanner(e) {
	var tripPlanner = Alloy.createController("tripPlanner").getView();
	tripPlanner.open();
}

//Kristi, Jake, Keith, Jasen
function populateMiles() {
	alert("The function has been activated!");
}

var miles = [ "Stores within 1 mile", "Stores within 5 miles", "Stores within 10 miles", "Stores within 20 miles"];

var mileList = [];

for (var mile in miles) {
	mileList[mile] = Ti.UI.createPickerRow({
		title : miles[mile]
	});
}

var milePicker = $.milePicker;
milePicker.add(mileList);

var oneMile = [];
var fiveMiles = [];
var tenMiles = [];
var twentyMiles = [];

//Kristi, Jake, Keith, Jasen
milePicker.selectionIndicator = true;

milePicker.addEventListener('change', function(e) {
	var value = e.row.title;

	switch(value) {
	case "Stores within 1 mile":
		acs(2);
		break;

	case "Stores within 5 miles":
		acs(6);
		break;

	case "Stores within 10 miles":
		acs(11);
		break;

	case "Stores within 20 miles":
		acs(21);
		break;

	default:
		alert("Looks like you aren't near a Velero Store.");
		break;
	}
});


				
function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;

	return dist;
}  

var MapModule = require('ti.map');
var win = Ti.UI.createWindow({
	backgroundColor : 'white',
	title : "Nearby Locations"
});

//believe this enables the app to find the location of the device
Titanium.Geolocation.purpose = "Purpose";
Titanium.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

//
//  Sets the distance filter
//Dictates how often an event fires based on the distance the device moves
//  this value is in meters - Ez/Nhat
//
// Titanium.Geolocation.distanceFilter = 1;
Titanium.Geolocation.frequency = 1;
Titanium.Geolocation.Android.manualMode = true;

var gpsProvider = Titanium.Geolocation.Android.createLocationProvider({
	name : Titanium.Geolocation.PROVIDER_GPS,
	minUpdateTime : 0,
	minUpdateDistance : 0
});

Titanium.Geolocation.Android.addLocationProvider(gpsProvider);

gpsProvider.minUpdateDistance = 0;
gpsProvider.minUpdateTime = 0;

var Cloud = require('ti.cloud');

function acs(x) {
Titanium.Geolocation.getCurrentPosition(function(e){
			if (e.error)
    		{
        		alert('Cannot get your current location');
        		return;
    		}
     		// If user position is obtain take its properties and store in seperate variables
    		var longitude = e.coords.longitude;
    		var latitude = e.coords.latitude;
    		var altitude = e.coords.altitude;
    		var heading = e.coords.heading;
    		var accuracy = e.coords.accuracy;
    		var speed = e.coords.speed;
    		var timestamp = e.coords.timestamp;
    		var altitudeAccuracy = e.coords.altitudeAccuracy;
        //	alert("User Lat is" + latitude);
        	//alert("User Lon is" + longitude);
	Cloud.Places.search({
		per_page : 100,
		places : [{
			city : "Dallas"
		}]
	}, function(e) {
		if (e.success) {

			var stores = [];
			// For every loop...
			for (var i = 0; i < e.places.length; i++) {
				//Take the current place and it shows its properties
				
				

				var place = e.places[i];
				var lt = place.latitude;
				//alert("Store lat is" + lt);
				var ln = place.longitude;
				//alert("Store lon is" + ln);
				
			var dis = distance(latitude,longitude,lt,ln);
			if (dis < x){

				//alert("The distance is: " + dis);
					stores[i] = MapModule.createAnnotation({
						latitude : place.latitude,
						longitude : place.longitude,
						title : place.name,
						subtitle : place.address + ', ' + place.city + ', ' + place.state
					
					});
				}
				}
			
Titanium.Geolocation.getCurrentPosition(function(e){
			if (e.error)
    		{
        		alert('Cannot get your current location');
        		return;
    		}
     		// If user position is obtain take its properties and store in seperate variables
    		var longitude = e.coords.longitude;
    		var latitude = e.coords.latitude;
    		var altitude = e.coords.altitude;
    		var heading = e.coords.heading;
    		var accuracy = e.coords.accuracy;
    		var speed = e.coords.speed;
    		var timestamp = e.coords.timestamp;
    		var altitudeAccuracy = e.coords.altitudeAccuracy;
        	
			// Create map view
			var map = MapModule.createView({
				userLocation : true, // Have map contain user location
				mapType : MapModule.NORMAL_TYPE, // Use normal map
				animate : true, // Allow animation
				region : {
					latitude : latitude,
					longitude : longitude,
					latitudeDelta : 0.1,
					longitudeDelta : 0.1
				}, // Start map view on user location
				height : Titanium.UI.FILL, // Map view to full height of the current device screen
				width : Titanium.UI.FILL, // Map view to full width of the current device screen
				annotations : stores // Add annotations from the store array
			});
			
			// Open window and add the map view

			// var red = Ti.UI.createView({
			// backgroundColor: "red"
			// });
			//
			// function red() {
			// var storeLocations = alloy.createController().getView();
			// red.open();
			// }
			//
			// red.addEventListener("click", function(e) {
			// var storeLocations = alloy.createController().getView();
			// red.open();
			// });

			// $.window.add(map);
			// $.window.open();
			win.add(map);
			win.open();
});
		} else {// Else if place cannot be obtained alert error
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
	});
};

