// Teaspoon includes some support files, but you can use anything from your own support path too.
// require support/sinon
// require support/your-support-file
//
// PhantomJS (Teaspoons default driver) doesn't have support for Function.prototype.bind, which has caused confusion.
// Use this polyfill to avoid the confusion.
//= require support/bind-poly
//
// Deferring execution
// If you're using CommonJS, RequireJS or some other asynchronous library you can defer execution. Call
// Teaspoon.execute() after everything has been loaded. Simple example of a timeout:
//
// Teaspoon.defer = true
// setTimeout(Teaspoon.execute, 1000)
//
// Matching files
// By default Teaspoon will look for files that match _test.{js,js.coffee,.coffee}. Add a filename_test.js file in your
// test path and it'll be included in the default suite automatically. If you want to customize suites, check out the
// configuration in config/initializers/teaspoon.rb
//
// Manifest
// If you'd rather require your test files manually (to control order for instance) you can disable the suite matcher in
// the configuration and use this file as a manifest.
//
// For more information: http://github.com/modeset/teaspoon
//
// You can require your own javascript files here. By default this will include everything in application, however you
// may get better load performance if you require the specific files that are being used in the test that tests them.
//= require application

module('google_maps_api');


// Silly test for testing
test("Truth is always true", function() {

   ok(true);
});

test("Testing function 'calculateRouteTotalDistance' exists", function(){

    ok(calculateRouteTotalDistance, 'This function exists');
});

test("Testing function 'calculateRemainingSteps' exists", function(){

    ok(calculateRemainingSteps, 'This function exists');
});

test("Testing function 'calculateRemainingSteps' should pass if 10 steps as total and 8 much as patchs  ", 
	function(){

    equal(calculateRemainingSteps(10, 8), 2,'The method works through 10 steps as total and 8 much as patchs');
});

test("Testing function 'calculateRemainingSteps' should not pass if 10 steps as total and 8 much as patchs  ", 
	function(){

    notEqual(calculateRemainingSteps(10, 8), 1,'The method works through 10 steps as total and 8 much as patchs');
});

test("Testing function 'calculateRemainingSteps' should pass if 10 steps as total and 2 much as patchs  ", 
	function(){

    equal(calculateRemainingSteps(10, 2), 0,'The method works through 10 steps as total and 2 much as patchs');
});

test("Testing function 'calculateRemainingSteps' should pass if 10 steps as total and 3 much as patchs  ", 
	function(){

    equal(calculateRemainingSteps(10, 3), 1,'The method works through 10 steps as total and 3 much as patchs');
});

test("Testing function 'calculateRemainingSteps' should pass with the second number being more", function(){

    equal(calculateRemainingSteps(10, 11), 10,'The method works through 10 steps as total and 11 much as patchs');
});


test("Testing function 'calculateRemainingSteps' should pass with a  negative number ", function(){

    equal(calculateRemainingSteps(-5, 2), -1,'The method works through -5 steps as total and 2 much as patchs');
});


test("Testing function 'calculateRemainingSteps' should not pass with a  negative number and return positive", 
	function(){

    notEqual(calculateRemainingSteps(-5, 2), 1,'The method works through -5 steps as total and 2 much as patchs');
});

test("Testing function 'calculateRemainingSteps' should pass with a two negative number ", function(){

    equal(calculateRemainingSteps(-5, -2), -1,'The method works through -5 steps as total and 2 much as patchs');
});



test("Testing function 'calculateStepsPerPatch' exists", function(){

    ok(calculateStepsPerPatch,'The method exists');
});


test("Testing function 'calculateStepsPerPatch' should pass with patch equals steps  ", function(){
    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 5);
    
    equal(instanceOfCalculateStepsPerPatch.quantityOfStepsPerPatch, 2,
        'The method receives 10 steps and 10 patch and returns 1');
});

test("Testing function 'calculateStepsPerPatch' should pass with patch equals steps  ", function(){
    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 5);
    
    equal(instanceOfCalculateStepsPerPatch.remainingSteps, 0,
        'The method receives 10 steps and 10 patch and returns 1');
});


test("Testing function 'calculateStepsPerPatch' should not pass with 2 steps per patch", function(){

    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 5);
    
    notEqual(instanceOfCalculateStepsPerPatch.quantityOfStepsPerPatch, 10,
        'The method not receives 10 steps and 5 patch and returns 2');
});

test("Testing function 'calculateStepsPerPatch' should not pass with 2 steps per patch", function(){

    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 5);

    notEqual(instanceOfCalculateStepsPerPatch.remainingSteps, 10,
        'The method not receives 10 steps and 5 patch and returns 2');
});

test("Testing function 'calculateStepsPerPatch' should pass with all steps in a patch", function(){

    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 1);

    equal(instanceOfCalculateStepsPerPatch.quantityOfStepsPerPatch, 10,
        'The method receives 10 steps and 1 patch and returns 10');
});

test("Testing function 'calculateStepsPerPatch' should pass with all steps in a patch", function(){

    var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 1);

    equal(instanceOfCalculateStepsPerPatch.remainingSteps, 0,
        'The method receives 10 steps and 1 patch and returns 10');
});

test("Testing function 'calculateStepsPerPatch' should pass with 3 steps per patch with 10 steps and 3 patchs", 
    function(){

        var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 3);

        equal(instanceOfCalculateStepsPerPatch.quantityOfStepsPerPatch, 3,
            'The method receives 10 steps and 3 patch and returns 3');
});

test("Testing function 'calculateStepsPerPatch' should pass with 3 steps per patch with 10 steps and 3 patchs", 
    function(){

        var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(10, 3);
        
        equal(instanceOfCalculateStepsPerPatch.remainingSteps, 1,
            'The method receives 10 steps and 3 patch and returns 3');
});

test("Testing function 'calculateStepsPerPatch' should pass with 8 steps per patch with 25 steps and 3 patchs", 
	function(){

        var instanceOfCalculateStepsPerPatch = calculateStepsPerPatch(25, 3);

    	equal(instanceOfCalculateStepsPerPatch.quantityOfStepsPerPatch, 8,
            'The method receives 25 steps and 3 patch and returns 8');
});

test("Testing function 'calculateRoute' exists", function(){

    ok(calculateRoute,'The method exists');
});

test("Testing function 'getHighwaysFromRoute' exists", function(){

    ok(getHighwaysFromRoute,'The method exists');
});

test("Testing function 'computeTotalDistance' exists", function(){

    ok(computeTotalDistance,'The method exists');
});


test("Testing function 'calculateRouteTotalDistance' exists", function(){

    ok(calculateRouteTotalDistance,'The method exists');
});


test("Testing function 'setMapOptions' exists", function(){

    ok(setMapOptions,'The method exists');
});


test("Testing function 'initialize' exists", function(){

    ok(initialize,'The method exists');
});



test("Testing function 'calculateRoute' exists", function(){

    ok(sliceRoute,'The method exists');
});


test("Testing function 'calculatePatchDistance' exists", function(){

    ok(calculatePatchDistance,'The method exists');
});


test("Testing function 'getCoordinatesOfPatch' exists", function(){

    ok(getCoordinatesOfPatch,'The method exists');
});

test("Testing function 'countTheAccidentsByPatch' exists", function(){

    ok(countTheAccidentsByPatch,'The method exists');
});


test("Testing function 'identifyDangerousPatch' exists", function(){

    ok(identifyDangerousPatch,'The method exists');
});


test("Testing function 'sinalizeMostDangerousPatch' exists", function(){

    ok(sinalizeMostDangerousPatch,'The method exists');
});


test("Testing function 'getCoordinatesToMarkers' exists", function(){

    ok(getCoordinatesToMarkers,'The method exists');
});


test("Testing function 'countTheAccidentsByPatch' exists", function(){

    ok(countTheAccidentsByPatch,'The method exists');
});

test("Testing function 'identifyDangerousPatch' exists", function(){

    ok(identifyDangerousPatch,'The method exists');
});


test("Testing function 'sinalizeMostDangerousPatch' exists", function(){

    ok(sinalizeMostDangerousPatch,'The method exists');
});


test("Testing function 'getCoordinatesToMarkers' exists", function(){

    ok(getCoordinatesToMarkers,'The method exists');
});


test("Testing function 'markAccidents' exists", function(){

    ok(markAccidents,'The method exists');
});


test("Testing function 'setUpMarkersArray' exists", function(){

    ok(setUpMarkersArray,'The method exists');
});


test("Testing function 'saveMarkerOnMap' exists", function(){

    ok(saveMarkerOnMap,'The method exists');
});


test("Testing function 'deleteMarkersOnMap' exists", function(){

    ok(deleteMarkersOnMap,'The method exists');
});

test("Testing function 'removeMarkerFromMap' exists", function(){

    ok(removeMarkerFromMap,'The method exists');
});

test("Testing function 'removeAllMarkersFromMap' exists", function(){

    ok(removeAllMarkersFromMap,'The method exists');
});

test("Testing function 'markAccident' exists", function(){

    ok(markAccident,'The method exists');
});

test("Testing function 'validateQuantityOfPatches' exists", function(){

    ok(validateQuantityOfPatches,'The method exists');
});


test("Testing function 'validateQuantityOfPatches' should pass with 7 with 7 quantity Of Patches and 9 patchs", 
    function(){

    equal(validateQuantityOfPatches(7, 9), 7,'The method receives 7 quantity Of Patches and 9 patch and returns 7');
});

test("Testing function 'validateQuantityOfPatches' should not pass with 19 with 7 quantity Of Patches and 9 patchs", 
    function(){

    notEqual(validateQuantityOfPatches(19, 9), 7,'The method receives 7 quantity Of Patches and 9 patch and returns 19');
});

test("Testing function 'validateQuantityOfPatches' should pass with 9 with 0 quantity Of Patches and 9 patchs", 
    function(){

    equal(validateQuantityOfPatches(0, 9), 0,'The method receives 0 quantity Of Patches and 9 patch and returns 9');
});

test("Testing function 'validateQuantityOfPatches' should not pass with 9 with 1 quantity Of Patches and 9 patchs", 
    function(){

    notEqual(validateQuantityOfPatches(1, 9), 9,'The method receives 1 quantity Of Patches and 9 patch and returns 1');
});

test("Testing function 'validateQuantityOfPatches' should pass with 0 with 0 quantity Of Patches and 0 patchs", 
    function(){

    equal(validateQuantityOfPatches(0, 0), 0,'The method receives 0 quantity Of Patches and 0 patch and returns 0');
});

test("Testing function 'validateQuantityOfPatches' should  pass with 5 with -10 quantity Of Patches and 5 patchs", 
    function(){

    equal(validateQuantityOfPatches(-10, 5), -10,
        'The method receives -10 quantity Of Patches and 5 patch and returns 5');
});

test("Testing function 'validateQuantityOfPatches' should not pass with 5 with -10 quantity Of Patches and 10 patchs", 
    function(){

    notEqual(validateQuantityOfPatches(-10, 10), 5,
        'The method receives -10 quantity Of Patches and 10 patch and not returns 5');
});

test("Testing function 'validateQuantityOfPatches' should  pass with 5 with -10 quantity Of Patches and 5 patchs", 
    function(){

    equal(validateQuantityOfPatches(-10, 5), -10,
        'The method receives -10 quantity Of Patches and 5 patch and returns 5');
});

test("Testing function 'validateQuantityOfPatches' should not pass with 10 with -10 quantity Of Patches and 5 patchs", 
    function(){

    notEqual(validateQuantityOfPatches(-10, 5), 10,
        'The method receives -10 quantity Of Patches and 5 patch and returns 10');
});

test("Testing function 'validateQuantityOfPatches' should  pass with 10 with 10 quantity Of Patches and 5 patchs", 
    function(){

    equal(validateQuantityOfPatches(10, 5), 10,
        'The method receives 10 quantity Of Patches and 5 patch and returns 10');
});

test("Testing function 'validateQuantityOfPatches' should not pass with 0 with 10 quantity Of Patches and 5 patchs", 
    function(){

    notEqual(validateQuantityOfPatches(10, 5), 0,
        'The method receives 10 quantity Of Patches and 5 patch and returns 0');
});

test("Testing function 'validateQuantityOfPatches' should  pass with 10 with 10 quantity Of Patches and 0 patchs", 
    function(){

    equal(validateQuantityOfPatches(10, 0), 10,
        'The method receives 10 quantity Of Patches and 0 patch and returns 10');
});


test("Testing function 'filterRepeatedCoordinates' should returns the clear latitudes arry with clear array latitudes", 
    function(){

    var latitudes = [
        37.782551,
        37.782745,
        37.782842,
        37.782919,
        37.782992,
        37.783100,
        37.783206,
        37.783273,
        37.783316,
        37.783357,
        37.783371,
        37.783368,
        37.783383,
        37.783508,
        37.783842,
        37.784147,
        37.784206,
        37.784386,
        37.784701,
        37.784965
    ];


    var longitudes = [
        122.445368,
        122.444586,
        122.443688,
        122.442815,
        122.442112,
        122.441461,
        122.440829,
        122.440324,
        122.440023,
        122.439794,
        122.439687,
        122.439666,
        122.439594,
        122.439525,
        122.439591,
        122.439668,
        122.439686,
        122.439790,
        122.439902,
        122.439938
    ];

    var coordinatesToTest = {
        latitude: latitudes,
        longitude: longitudes
    };

   equal(coordinatesToTest.latitude, coordinatesToTest.latitude,
        'The method receives clean latitudes and returns clean latitudes');
});

test("Testing function 'filterRepeatedCoordinates' should returns the clear longitudes arry with clear array longitudes", 
    function(){

    var latitudes = [
        37.782551,
        37.782745,
        37.782842,
        37.782919,
        37.782992,
        37.783100,
        37.783206,
        37.783273,
        37.783316,
        37.783357,
        37.783371,
        37.783368,
        37.783383,
        37.783508,
        37.783842,
        37.784147,
        37.784206,
        37.784386,
        37.784701,
        37.784965
    ];


    var longitudes = [
        122.445368,
        122.444586,
        122.443688,
        122.442815,
        122.442112,
        122.441461,
        122.440829,
        122.440324,
        122.440023,
        122.439794,
        122.439687,
        122.439666,
        122.439594,
        122.439525,
        122.439591,
        122.439668,
        122.439686,
        122.439790,
        122.439902,
        122.439938
    ];

    var coordinatesToTest = {
        latitude: latitudes,
        longitude: longitudes
    };

   equal(coordinatesToTest.longitude, coordinatesToTest.longitude,
        'The method receives clean longitudes and returns clean longitudes');
});

test("Testing function 'filterRepeatedCoordinates' exists", function(){

    ok(filterRepeatedCoordinates,'The method exists');
});
