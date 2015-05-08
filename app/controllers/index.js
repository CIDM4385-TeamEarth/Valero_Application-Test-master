
function nearbyLocations(e){
	var nearbyLocations = Alloy.createController("nearbyLocations").getView();
	nearbyLocations.open();
}

function storeLocations(e){
	var storeLocations = Alloy.createController("storeLocations").getView();
	storeLocations.open();
}

function tripPlanner(e){
	var tripPlanner = Alloy.createController("tripPlanner").getView();
	tripPlanner.open();
}

$.index.open();