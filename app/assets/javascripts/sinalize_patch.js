/* global heatmap */
/* global map */

// // Load the sinalize_patch_validation.js scripts
// (function() {
//   var validationScript = document.createElement('script');
//   validationScript.type = 'text/javascript';
//   validationScript.src = 'sinalize_patch_validation.js';

//   document.getElementsByTagName('head')[0].appendChild(validationScript);
// })();

/**
    Calculate the quantity of steps per patch and the remaining steps to add on the last patch
    param totalOfSteps - Quantity of steps in the route
    param quantityOfPatches - Quantity of patches to to fit the steps
    return An object with the quantity of steps per patch and the remaining steps
 */
function calculateStepsPerPatch(totalOfSteps, quantityOfPatches){

    quantityOfPatches = validateQuantityOfPatches(quantityOfPatches, totalOfSteps);

    var remainingSteps = calculateRemainingSteps(totalOfSteps, quantityOfPatches);

    var quantityOfStepsPerPatch = (totalOfSteps - remainingSteps) / quantityOfPatches;

    var stepsPerPatch = {
      quantityOfStepsPerPatch: quantityOfStepsPerPatch,
      remainingSteps: remainingSteps
    };

    return stepsPerPatch;
}

/**
    Calculate the remaining steps to fit on the last patch
    param totalOfSteps - Quantity of steps in the route
    param quantityOfPatches - Quantity of patches to to fit the steps
    return The remaining steps
 */
function calculateRemainingSteps(totalOfSteps, quantityOfPatches){

  quantityOfPatches = validateQuantityOfPatches(quantityOfPatches, totalOfSteps);

  var remainingSteps = totalOfSteps % quantityOfPatches;

  return remainingSteps;
}

/**
    Add the remaining steps to the last patch
    param patches - Array with the patches and it steps
    param routeAllSteps - Array with all the steps of a route
    param remainingSteps - Steps to fit on the last patch
    return The array with the patches with the remaining steps on the last patch
 */
function fitRemainingStepsOnLastPatch(patches, routeAllSteps, remainingSteps){
     
 var quantityOfPatches = patches.length;
 var totalOfSteps = routeAllSteps.length;

 // Last patch position in 'patches[]' array
 var lastPatch = quantityOfPatches - 1;

 // Adding the remaining steps to the last patch
 var t = 0;
 for(t = 0; t < remainingSteps; t++){
     var routeStepsIndex = totalOfSteps - (remainingSteps - t);
     patches[lastPatch].push(routeAllSteps[routeStepsIndex]);
 }

 return patches;
}

/**
    Initialize each position of an array as an array
    param array - Array to be initialized
    param sizeOfArray - Size of the array
 */
function initializeArrayPositionsAsAnArray(array, sizeOfArray){
  // Each position in 'patches[]' array is an array that will contain the steps for this patch
  var p = 0;
  for(p = 0; p < sizeOfArray; p++){
      array[p] = [];
  }
}

/**
    Separate the steps from 'routeAllSteps' array equally in 'quantityOfPatches' patches.
    And then add the remaining steps to the last patch.
    param routeAllSteps - Array of google.maps.DirectionsStep objects that contains all steps of the route
    param quantityOfPatches - Quantity of patches to distribute the steps into
    return An array that contains the patches with it respective steps
 */
function distributeStepsOnPatches(routeAllSteps, quantityOfPatches){

   var totalOfSteps = routeAllSteps.length;

   quantityOfPatches = validateQuantityOfPatches(quantityOfPatches, totalOfSteps);

   var stepsPerPatch = calculateStepsPerPatch(totalOfSteps, quantityOfPatches);
   
   var quantityOfStepsPerPatch = stepsPerPatch.quantityOfStepsPerPatch;
   var remainingSteps = stepsPerPatch.remainingSteps;

   var patches = [quantityOfPatches];
   initializeArrayPositionsAsAnArray(patches, quantityOfPatches);

   var patchIndex = 0;
   var reachPatchMaxElements = 0;
   var quantityOfStepsToFitOnPatches = totalOfSteps - remainingSteps;

   var i = 0;
   for(i = 0; i < quantityOfStepsToFitOnPatches; i++){

     var stepToPush = routeAllSteps[i];
     patches[patchIndex].push(stepToPush);
     reachPatchMaxElements++;

     if(reachPatchMaxElements === quantityOfStepsPerPatch){
         patchIndex++;
         reachPatchMaxElements = 0;
     }
   }

   var completedPatches = fitRemainingStepsOnLastPatch(patches, routeAllSteps, remainingSteps);

   return completedPatches;
}

/**
    Slice the route in patches.
    param routeToSlice - 'google.maps.DirectionsRoute' object that contains the route to slice
    return An array with the patches.
 */
function sliceRoute(routeToSlice){

    // Set the quantity of patchs as you want
    var quantityOfPatches = 10;

    // Array with the route legs
    var routeLegs = routeToSlice.legs[0];

    // All steps in route
    var routeAllSteps  = routeLegs.steps;
    
    // Separate the steps on patches
    var patches = distributeStepsOnPatches(routeAllSteps, quantityOfPatches);

    return patches;
}


/**
    Calculate the distance covered by a patch
    param patch - Array that contains the steps of the patch
    return The distance covered by this patch in kilometers
 */
function calculatePatchDistance(patch){

    var patchSize = patch.length;

    var patchDistance = 0;

    var i = 0;
    for(i = 0; i < patchSize; i++){
        // Distance in meters
        patchDistance = patchDistance + patch[i].distance.value;
    }

    // Converting the distance in meters to kilometers
    patchDistance = patchDistance/1000;

    return patchDistance;
}

/**
    Get the start and end coordinates of patchesArray.
    param patchesArray - Array with the patches
    return An array that contains the start and ending coordinates from all patches
 */
function getCoordinatesOfPatch(patchesArray){

    var quantityOfPatches = patchesArray.length;

    var patchesSize = [quantityOfPatches];

    var i = 0;
    for(i = 0; i < quantityOfPatches; i++){
          patchesSize[i] = patchesArray[i].length;
    }

    var patchesCoordinates = [quantityOfPatches];

    i = 0;
    for(i = 0; i < quantityOfPatches; i++){

      var firstStepOnPatchIndex = 0;
      var lastStepOnPatchIndex = patchesSize[i] - 1;

      var coordinates = {

          startLatitude: patchesArray[i][firstStepOnPatchIndex].start_location.lat(),
          startLongitude: patchesArray[i][firstStepOnPatchIndex].start_location.lng(),
          endLatitude:  patchesArray[i][lastStepOnPatchIndex].end_location.lat(),
          endLongitude: patchesArray[i][lastStepOnPatchIndex].end_location.lng(),
          // Distance covered by this patch
          distance: calculatePatchDistance(patchesArray[i])
      };

      patchesCoordinates[i] = coordinates;
    }

    return patchesCoordinates;
}

/**
 * Get the maximum and minimum latitudes and longitudes of the path
 * param path - Path to calculate the critical points. Array with the coordinates (google.maps.LatLng objects) of the path
 * return an object with the critical latitudes and longitudes
 *    Properties:  maxLatitude: The maximum latitude found
                        minLatitude: The minimum latitude found
                        maxLongitude: The maximum longitude found
                        minLongitude: The minimum longitude found
 */
function foundPathCriticalPoints(path){

  var maxLatitude = getRouteMaxLatitude(path);
  var minLatitude = getRouteMinLatitude(path);
  var maxLongitude = getRouteMaxLongitude(path);
  var minLongitude = getRouteMinLongitude(path);

  var routeCriticalPoints = {
    maxLatitude: maxLatitude,
    minLatitude: minLatitude,
    maxLongitude: maxLongitude,
    minLongitude: minLongitude
  };

  return routeCriticalPoints;
}

/**
 * Get the maximum longitude that appears in the route.
 * param routePath -  The path of the route. Array with all coordinates of the route. google.maps.LatLng objects.
 * return the greatest longitude that appears in the route
 */
function getRouteMaxLongitude(routePath){
  const MIN_LONGITUDE_VALUE = -180;

  var maxLongitude= MIN_LONGITUDE_VALUE;
  var i = 0;
  for(i = 0; i < routePath.length; i++){
    var longitude = routePath[i].lng();
    if(longitude > maxLongitude){
      maxLongitude = longitude;
    }
  }

  return maxLongitude;
}

/**
 * Get the minimum longitude that appears in the route.
 * param routePath -  The path of the route. Array with all coordinates of the route. google.maps.LatLng objects.
 * return the lowest longitude that appears in the route
 */
function getRouteMinLongitude(routePath){
  const MAX_LONGITUDE_VALUE = 180;

  var minLongitude= MAX_LONGITUDE_VALUE;
  var i = 0;
  for(i = 0; i < routePath.length; i++){
    var longitude = routePath[i].lng();
    if(longitude < minLongitude){
      minLongitude = longitude;
    }
  }

  return minLongitude;
}

/**
 * Get the maximum latitude that appears in the route.
 * param routePath -  The path of the route. Array with all coordinates of the route. google.maps.LatLng objects.
 * return the greatest latitude that appears in the route
 */
function getRouteMaxLatitude(routePath){
  const MIN_LATITUDE_VALUE = -90;

  var maxLatitude = MIN_LATITUDE_VALUE;
  var i = 0;
  for(i = 0; i < routePath.length; i++){
    var latitude = routePath[i].lat();
    if(latitude > maxLatitude){
      maxLatitude = latitude;
    }
  }

  return maxLatitude;
}

/**
 * Get the minimum latitude that appears in the route.
 * param routePath -  The path of the route. Array with all coordinates of the route. google.maps.LatLng objects.
 * return the lowest latitude that appears in the route
 */
function getRouteMinLatitude(routePath){
  const MAX_LATITUDE_VALUE = 90;

  var minLatitude = MAX_LATITUDE_VALUE;
  var i = 0;
  for(i = 0; i < routePath.length; i++){
    var latitude = routePath[i].lat();
    if(latitude < minLatitude){
      minLatitude = latitude;
    }
  }

  return minLatitude;
}


/**
 * Take out the coordinates which are out of the critical points of the path
 * param latitudes - Array with the latitudes to be filtered
 * param longitudes - Array with the longitudes to be filtered
 * param path - Array with the coordinates (google.maps.LatLng objects) of the the path
 * return an object with the arrays of filtered latitudes and longitudes
 *    Properties: latitudes: Array with the filtered latitudes
 *                     longitudes: Array with the filtered longitudes
 */
function filterCoordinatesOutOfPathCriticalPoints(latitudes, longitudes, path){
  
  var criticalPoints = foundPathCriticalPoints(path);
  var maxLatitude = criticalPoints.maxLatitude;
  var minLatitude = criticalPoints.minLatitude;
  var maxLongitude = criticalPoints.maxLongitude;
  var minLongitude = criticalPoints.minLongitude;

  var quantityOfCoordinates = latitudes.length;

  var latitudesFiltered = [];
  var longitudesFiltered = [];

  var i = 0;
  for(i = 0; i < quantityOfCoordinates; i++){
    var latitudeIsOk = (latitudes[i] <= maxLatitude) && (latitudes[i] >= minLatitude);
    var longitudeIsOk = (longitudes[i] <= maxLongitude) && (longitudes[i] >= minLongitude);
    var coordinatesIsInRange = latitudeIsOk && longitudeIsOk;

    if(coordinatesIsInRange){
      latitudesFiltered.push(latitudes[i]);
      longitudesFiltered.push(longitudes[i]);
    }
  }

  var coordinatesFiltered = {
    latitudes: latitudesFiltered,
    longitudes: longitudesFiltered
  };

  return coordinatesFiltered;
}

/**
 * Calculate the quantity of steps of each patch in the patches array
 * param patches - Array with the route patches 
 * return an array with the respective quantity of steps of a patch in it's positions 
 */
function getQuantityOfStepsInPatches(patches){

  var quantityOfPatches = patches.length;

  var quantityOfStepsInPatches = [quantityOfPatches];

  var i = 0;
  for(i = 0; i < quantityOfPatches; i++){
    var stepsInPatch = patches[i].length;
    quantityOfStepsInPatches[i] = stepsInPatch;
  }

  return quantityOfStepsInPatches;
}

/**
 * Get the cordinates from each step of each patch 
 * param patches - Array with the route patches 
 * return an array with all the coordinates (like google.maps.LatLng objects)
 *    from each patch in it's respective position
 */
function getPathOfPatches(patches){

  var quantityOfPatches = patches.length;

  var quantityOfStepsInPatches = getQuantityOfStepsInPatches(patches);

  var maxQuantityOfStepsInPatch;

  var allStepsPaths = [quantityOfPatches];
  initializeArrayPositionsAsAnArray(allStepsPaths, quantityOfPatches);

  var x = 0;
  var t = 0;
  var j = 0;
  var i = 0;
  for(i = 0; i < quantityOfPatches; i++){

    maxQuantityOfStepsInPatch  = quantityOfStepsInPatches[i];

    for(j = 0; j < maxQuantityOfStepsInPatch; j++){

      var currentStepPath = patches[i][j].path;
      var currentStepPathSize = currentStepPath.length;

      for(x = 0; x < currentStepPathSize; x++){
       
       allStepsPaths[t].push(currentStepPath[x]);

      }

    }
    
    t++;
  }

  return allStepsPaths;
}

/**
 * Count the accidents occurred in each patch
 * param latitude - Array with the latitudes of the accidents
 * param longitude - Array with the longitudes of the accidents
 * param route - Receives the current route
 */
function countTheAccidentsByPatch(latitude, longitude,route){

  var routeSliced = sliceRoute(route);

  var patchesPaths = getPathOfPatches(routeSliced);

  var quantityOfPatches = patchesPaths.length;

  var accidentsInPatch = [quantityOfPatches];

  var i = 0;
  for(i = 0; i < quantityOfPatches; i++){

    var currentPatch = patchesPaths[i];
    var coordinatesOnCurrentPatch = filterCoordinatesOutOfPathCriticalPoints(latitude, longitude, currentPatch);

    accidentsInPatch[i] = coordinatesOnCurrentPatch.latitudes.length;
  }
  identifyDangerousPatch(accidentsInPatch, routeSliced);
}

/**
 * Identify the patch which have more accidents
 * param accidentsInPatch - Array with the accidents in the patches
 * param routeSliced - Array with the patches of a route
 */
function identifyDangerousPatch(accidentsInPatch, routeSliced){

  // Auxiliary variable to see which patch has more accidents
  var moreAccidentsPatch = 0;
  var positionMoreAccidentsPatch = 0;
  var quantityPatchsMoreDangerous = 0;

  // Scans the array looking for the portions more accidents
  for (var i = 0; i < accidentsInPatch.length; i++) {
    if (accidentsInPatch[i] > moreAccidentsPatch) {
      moreAccidentsPatch = accidentsInPatch[i];
      positionMoreAccidentsPatch = i;
      quantityPatchsMoreDangerous++;
    }
  }

  var existsAccidents = (quantityPatchsMoreDangerous>0);

  var quantityOfSteps = routeSliced[positionMoreAccidentsPatch].length;
  var coordinatesOfMostDangerousPatch = [];
  var quantityCoordinatesByStep;
  var k = 0;
  var j = 0;

  for (i = 0; i < quantityOfSteps; i++) {
    quantityCoordinatesByStep  = routeSliced[positionMoreAccidentsPatch][i].path.length;
    for(k = 0; k < quantityCoordinatesByStep; k++){
      coordinatesOfMostDangerousPatch[j] = routeSliced[positionMoreAccidentsPatch][i].path[k];
      j++;
    }
  }

  $(document).ready(function(){

      $("#sinalizeAccidentsInPatch").click(function(){
        if (existsAccidents) {
          sinalizeMostDangerousPatch(coordinatesOfMostDangerousPatch);
        } 
        else{
          window.alert("Não é possível exibir um trecho mais perigoso nessa rota, pois não há acidentes registrados em nossa base.");
        }    
      });

      $("#unsinalizeAccidentsInPatch").click(function(){
        unsinalizeMostDangerousPatch();
      });
  });
}

/**
 * Sinalize the most dangerous patch in a route using heatmap
 * param coordinatesToSinalize - Array with the coordinates of the patch to sinalize
 */
function sinalizeMostDangerousPatch(coordinatesToSinalize){

      unsinalizeMostDangerousPatch();
      
      // Contains the data from the array
      var pointArray = new google.maps.MVCArray(coordinatesToSinalize);

      heatmap = new google.maps.visualization.HeatmapLayer({

        // The data passed here will be appering in the heatmap layer
        data: pointArray,

        // Opacity of the map layer
        opacity: 0.8,

        // Radius of each heatmap pointArray
        radius: 11

      });

      // Sets the heapmap layer on the map
      heatmap.setMap(map);

}

/**
 * Disable the current heatmap if it is set
 */
function unsinalizeMostDangerousPatch(){
  var thereIsHeatmap = heatmap != null && heatmap != undefined;
  if(thereIsHeatmap){
    heatmap.setMap(null);                                                                                                       
  }
}
