// exports.definition = {
	// config: {
		// //alloy model is backbone- babb in class, should know C# Python PHP JavaScript
		// adapter: {
			// type: "acs",
			// collection_name: "storeLocations"
		// }
	// },
	// extendModel: function(Model) {
		// _.extend(Model.prototype, {
			// // extended functions and properties go here
// 		
		// processACSPlaces : function(_name, _state, _website) {
			// Cloud.Places.create({
    			// name: 'Appcelerator HQ',
    			// state: 'California',
    			// website: 'http://www.appcelerator.com'
			// }, function (e) { //can rename e to crap from acs or anything its the callback saying everything worked
    			// if (e.success) {
//     			
        			// var place = e.places[0]; //make a new model var model = new model?
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
		// return Model;
	// },
	// extendCollection: function(Collection) {
		// _.extend(Collection.prototype, {
			// // extended functions and properties go here
		// });
// 
		// return Collection;
	// }
// };