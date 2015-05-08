function index(e){
	var index = Alloy.createController("index").getView();
	index.open();
}

function nearbyLocations(e){
	var nearbyLocations = Alloy.createController("nearbyLocations").getView();
	nearbyLocations.open();
}

function storeLocations(e){
	var storeLocations = Alloy.createController("storeLocations").getView();
	storeLocations.open();
}