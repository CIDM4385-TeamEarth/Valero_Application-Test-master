function index(e){
	var index = Alloy.createController("index").getView();
	index.open();
}

function nearbyLocations(e){
	var nearbyLocations = Alloy.createController("nearbyLocations").getView();
	nearbyLocations.open();
}

function tripPlanner(e){
	var tripPlanner = Alloy.createController("tripPlanner").getView();
	tripPlanner.open();
}

// A function to clear the cityPicker whenever a new state is selected
function clearCity(){
	// If the picker has a column...
	if(cityPicker.columns[0]){
		var column = cityPicker.columns[0]; // Set a variable for that column
		var length = column.rowCount; // Count the picker rows for that column
		// For every row of that column...
		for(var i = length-1; i >= 0; i--){
			var row = column.rows[i];
			column.removeRow(row); // Remove the current picker row...
		} // Until all picker rows are removed
	}
}

// A function to populate the cityPicker whenever a new state is selected
function populateCity(cityData){
	// Create an array to store city picker rows
	var cityList = [];
	// For every city in the cityData...
	for (var city in cityData){
		cityList[city] = Ti.UI.createPickerRow({title: cityData[city]}); // Create a picker row named after the city...
	} // Until all city picker rows are created
	cityPicker.add(cityList); // Add all city rows to the city picker
}

function populateState(){
	alert("The function has been activated!");
}

var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", 
			  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
			  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
			  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
			  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
			  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", 
			  "Wyoming"];

var stateList = [];

for(var state in states) {
	stateList[state] = Ti.UI.createPickerRow({title: states[state]});
}

var statePicker = $.statePicker;
statePicker.add(stateList);

var cityPicker = $.cityPicker;

var txCities = ["Amarillo", "Austin", "Dallas", "Houston"];
var caCities = ["Glendale","Los Angeles", "San Diego", "San Francisco", "San Jose"];
var flCities = ["Miami","Tampa", "Orlando"];


statePicker.selectionIndicator = true;

statePicker.addEventListener('change', function(e) {
	var value = e.row.title;
	
	switch(value) {
		case "Texas":
			clearCity();
			populateCity(txCities);
			_city = txCities[0];
			break;
		case "California":
			clearCity();
			populateCity(caCities);
			_city = caCities[0];
			break;
			
		case "Florida":
			clearCity();
			populateCity(flCities);
			_city = flCities[0];
			break;
			
		default:
			alert("There are no data available for that state!");
			clearCity();
			var noCity = Ti.UI.createPickerRow({title: "City"});
			cityPicker.add(noCity);
			_city = "";
			break;
	}
});

var _city = "";

cityPicker.addEventListener('change', function(e) {
	_city = e.row.title;
});

var MapModule = require('ti.map');
var win =  Ti.UI.createWindow({backgroundColor: 'white', title: "Store Locations"});

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

// var win = Ti.UI.createWindow({
    // backgroundColor : 'white',
// });
//  


var Cloud = require('ti.cloud');

function acs(){
	Cloud.Places.search({
		per_page: 100, 
		places: [{city: "Dallas"}]
	}, function (e) {
    	if (e.success) {
	    	// Cloud.Places.per_page (100);
	        //alert('Success:\n' +
	          //  'Count: ' + e.places.length); //Travis removed the error box that says how many locations are in ACS** only used in testing
	        //alert is used to display success and how many were created, debug to ensure all places have- Ez
	        var stores = [];      
	         // For every loop...
	        for (var i = 0; i < e.places.length; i++) {
	        	//Take the current place and it shows its properties
	            var place = e.places[i];
	            //debug- to confirm connection with acs- Nhat
	            /*alert('id: ' + place.id + '\n' +
	                  'name: ' + place.name + '\n' +
	                  'longitude: ' + place.longitude + '\n' +
	                  'latitude: ' + place.latitude + '\n' +
	                  'updated_at: ' + place.updated_at); */
	            
	            //for the store, create an annotation with the properties of the current place
	            if (place.city == _city ){
	            	
	            
	            stores[i] = MapModule.createAnnotation({
	            	latitude: place.latitude,
	            	longitude: place.longitude,
	            	title: place.name,
	            	subtitle: place.address + ', ' + place.city + ', ' + place.state
	            }); }
            
            //Debug- proper properties are displayed in the annotation-Nhat/Ez
            /* alert('latitude: ' + place.latitude + '\n' +
            	  'longitude: ' + place.longitude + '\n' +
            	  'title: ' + place.name + '\n' +
            	  'subtitle: ' + place.address + ', ' + place.city + ', ' + place.state
            	 ); */  
        }
        
        //function to get current user position
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
        		userLocation: true, // Have map contain user location
        		mapType: MapModule.NORMAL_TYPE,  // Use normal map
        		animate: true, // Allow animation
        		region: {latitude: latitude, longitude: longitude, latitudeDelta: 0.1, longitudeDelta: 0.1}, // Start map view on user location
        		height: Titanium.UI.FILL, // Map view to full height of the current device screen
        		width: Titanium.UI.FILL, // Map view to full width of the current device screen
        		annotations: stores // Add annotations from the store array 
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
    } else { // Else if place cannot be obtained alert error
        alert('Error:\n' +
            ((e.error && e.message) || JSON.stringify(e)));
    }
});
};


// function openMap(e){
	// Titanium.Geolocation.getCurrentPosition(function(e)
// {
    // if (e.error)
    // {
        // alert('Cannot get your current location');
        // return;
    // }
//  
    // var longitude = e.coords.longitude;
    // var latitude = e.coords.latitude;
    // var altitude = e.coords.altitude;
    // var heading = e.coords.heading;
    // var accuracy = e.coords.accuracy;
    // var speed = e.coords.speed;
    // var timestamp = e.coords.timestamp;
    // var altitudeAccuracy = e.coords.altitudeAccuracy;
// // added by Travis, sets the variable used to display Valero Energy
// var store1 = MapModule.createAnnotation({
    // latitude: 35.13314,
    // longitude: -101.897468,
    // title: 'Valero Energy',
    // subtitle: '7201 CANYON DR, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display CEFCO 2091
// var store2 = MapModule.createAnnotation({
    // latitude: 35.221803,
    // longitude: -101.848697,
    // title: 'CEFCO 2091',
    // subtitle: '1600 AMARILLO BLVD E, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display FAST 19 STOP
// var store3 = MapModule.createAnnotation({
    // latitude: 35.213965,
    // longitude: -101.86166,
    // title: 'FAST 19 STOP',
    // subtitle: '2305 W 3RD AVE, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display AMARILLO STOP CNT 307
// var store4 = MapModule.createAnnotation({
    // latitude: 35.1474,
    // longitude: -101.742488,
    // title: 'AMARILLO STOP CNT 307',
    // subtitle: '8500 LAKESIDE DR, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display TOOT 76 N TOTUM
// var store5= MapModule.createAnnotation({
    // latitude: 35.19611,
    // longitude: -101.89305,
    // title: 'TOOT 76 N TOTUM',
    // subtitle: '5041 PLAINS BLVD, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display TOO 56 N TOTUM
// var store6 = MapModule.createAnnotation({
    // latitude: 35.13218,
    // longitude: -101.9014,
    // title: 'TOOT 56 N TOTUM',
    // subtitle: '7149 S BELL ST, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display TOOT 63 N TOTUM
// var store7 = MapModule.createAnnotation({
    // latitude: 35.16203,
    // longitude: -101.90281,
    // title: 'TOOT 63 N TOTUM',
    // subtitle: '4420 S BELL ST, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display TOOT 61 N TOTUM
// var store8 = MapModule.createAnnotation({
    // latitude: 35.1505,
    // longitude: -101.8845,
    // title: 'TOOT 61 N TOTUM',
    // subtitle: '5300 CANYON DR, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// // added by Travis, sets the variable used to display TOOT 62 N TOTUM
// var store9 = MapModule.createAnnotation({
    // latitude: 35.87837,
    // longitude: -101.21088,
    // title: 'TOOT 62 N TOTUM',
    // subtitle: '3701 SW 6TH AVE, Amarillo,TX',
    // // attempt backgroundColor: "red",
    // //customView: Ti.UI.backgroundColor = "red" //Ti.UI.backgroundColor
// });
// /*var bridge = MapModule.createAnnotation({
    // latitude: 35.221803,
    // longitude: -101.848697,
    // pincolor: MapModule.ANNOTATION_AZURE,
 // // Even though we are creating a button, it does not respond to Button events or animates.
 // // Use the Map View's click event and monitor the clicksource property for 'leftPane'.
    // leftView: Ti.UI.createButton({title: 'Detail'}),
 // // For eventing, use the Map View's click event
 // // and monitor the clicksource property for 'rightPane'.
    // //rightButton: 'appicon.jpg',    
    // title: '1425 UNIVERSITY NE/',
    // subtitle: 'Valero Station, Amarillo,TX'
// });*/
// 
// //creates map - Nhat/Ez
// var map1 = MapModule.createView({
    // userLocation: true,
    // mapType: MapModule.NORMAL_TYPE,
    // animate: true,
    // region: {latitude: latitude, longitude: longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    // // latitude: 35.13314, longitude: -101.897468
    // height: Titanium.UI.FILL,
    // width: Titanium.UI.FILL,
	// annotations:[store1,store2,store3,store4,store5,store6,store7,store8,store9]
// });
// 
// win.add(map1);
// win.open();
// });
// }