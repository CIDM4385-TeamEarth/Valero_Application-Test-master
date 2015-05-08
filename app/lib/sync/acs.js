// /*
 // * VIA BABB----Sync adapters are required such that the models can connect to a
 // * persistence strategy of your choosing.
 // */
// function S4() {
	// return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
// }
// 
// function guid() {
	// return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
// }
// 
// 
// 
// function InitAdapter(config) {
	// Cloud = require("ti.cloud");
	// Cloud.debug = !0;
	// config.Cloud = Cloud;
// }
// 
// function Sync(method, model, options) {
	// var object_name = model.config.adapter.collection_name;
// 
	// //determine which sync method to call based on the
	// //collection type in the model
	// if (object_name === "storeLocations") {
		// processACSPlaces(model, method, options);
// 
	// }
// }
// 
// /**separate handler for when the object being processed
 // * is an ACS Photo
 // */
// function processACSPlaces(model, method, options) { //rename processACSPlaces
	// switch (method) {
	// case "create":
		// // include attributes into the params for ACS
		// Cloud.Places.create({
    // name: 'Appcelerator HQ',
    // state: 'California',
    // website: 'http://www.appcelerator.com'
// }, function (e) {  //e returns acs crap can rename it to acs crap
    // if (e.success) {
        // var place = e.places[0];
        // alert('Success:\n' +
            // 'id: ' + place.id + '\n' +
            // 'name: ' + place.name + '\n' +
            // 'updated_at: ' + place.updated_at);
    // } else {
        // alert('Error:\n' +
            // ((e.error && e.message) || JSON.stringify(e)));
    // }
// });
// 
	// case "update":
	// case "delete":
		// // Not currently implemented, let the user know
		// alert("Not Implemented Yet");
		// break;
	// }
// }