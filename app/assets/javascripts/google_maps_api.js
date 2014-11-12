
// Loads the map on the screen
google.maps.event.addDomListener(window, 'load', function(){

    setUpMarkersArray();
    initialize();

});

var map;

// Gives to the map the option to drag it and change the route
  var rendererOptions = {
    // Draggable is turned on when the option below is set as 'true'
    draggable: false
  };


// Global variables
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();

var handler = Gmaps.build('Google');
handler.buildMap({internal: {id: 'directions'}}, function(){
  directionsDisplay.setMap(handler.getMap());
  initialize();
});

// Compute the total distance from the origin to the destination
function computeTotalDistance(directionsResult){

  var enableButton = $('#sinalizeAccidents').removeAttr('disabled');

  $(document).ready(function(){
    $("#sinalizeAccidents").popover('show');
    $("#sinalizeAccidents").popover('hide');
  });

  var total = 0;
  var myRoute = directionsResult.routes[0];

  total = calculateRouteTotalDistance(myRoute);

  total = total / 1000;
  $("#total").html(total + " km");
}

function calculateRouteTotalDistance(route){

  var totalDistance = 0;

  for (i = 0; i < route.legs.length; i++){
    totalDistance += route.legs[i].distance.value;
  }

  return totalDistance;
}

// Configurations used to personalize the map
function setMapOptions(){

      var brasilia = new google.maps.LatLng(-15.453695287170715, -409.5702874999999);
      var mapOptions = {

            // Initial level of zoom in the center
            zoom: 5,

            // Center the map in Brasilia
            center: brasilia,

            // Removes the default features of the map
            disableDefaultUI: true,

            // Chooses which elements are wanted in the map
            panControl: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: true,
            overviewMapControl: false,

            // Sets the menu to choose the map type (Roadmap or Satellite) on  the right bottom of the map
            mapTypeControlOptions:{
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },

            // Determine the style of the zoom controller
            zoomControlOptions:{
              style: google.maps.ZoomControlStyle.SMALL
            }

      };

      return mapOptions;
}

function initialize(){

      var mapOptions = setMapOptions();

      var directionsPanelDiv = document.getElementById("directionsPanel");
      var mapDiv = document.getElementById("directions");

      map = new google.maps.Map(mapDiv, mapOptions);

      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelDiv);

      // When the directions change, calculate the new distance
      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
            computeTotalDistance(directionsDisplay.directions);
      });

      calculateRoute();
}

function calculateRoute(){

      var origin = $("#origin").val();
      var destination = $("#destination").val();
      var request = {
          origin:      origin,
          destination: destination,
          travelMode:  google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(response, status){

            var statusOK = google.maps.DirectionsStatus.OK;
            switch(status){

                  case statusOK:
                      var text = "<span class='label label-success'> Distância total: <span id='total'></span></span>";
                      $("#distance").html(text);
                      directionsDisplay.setDirections(response);
                      getInfoAboutRoute(directionsDisplay.directions);
                      break;

                  case 'ZERO_RESULTS':
                  case 'INVALID_REQUEST':
                      alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
                              + destination + "'. \n Digite novamente.");
                      break;

                  case 'UNKNOWN_ERROR':
                  case 'REQUEST_DENIED':
                  case 'OVER_QUERY_LIMIT':
                      alert('Erro inesperado');
                      break;

                  case 'NOT_FOUND':
                      if(origin  != ""){
                        alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
                               + destination  + "'. \n Digite novamente.");
                      }
                      else{
                        // Nothing to do
                      }
                      break;

                  default:
                      directionsDisplay.setDirections(response);
                      initialize();
                      break;
            }

      });

}

function getCurrentRoute(){
  // Get the first route created by Google maps
  var currentRoute = directionsDisplay.directions.routes[0];
  return currentRoute;
}

// Initialize the patches array as an array of arrays
function initializePatchesArray(patchesArray, quantityOfPatchs){
    // Each position in 'patches[]' array is an array that will contain the steps for this patch
    var p = 0;
    for(p = 0; p < quantityOfPatchs; p++){
        patchesArray[p] = [];
    }
}

function calculateStepsPerPatch(totalOfSteps, quantityOfPatchs){

    var remainingSteps = calculateRemainingSteps(totalOfSteps, quantityOfPatchs);

    var quantityOfStepsPerPatch = (totalOfSteps - remainingSteps) / quantityOfPatchs;

    return quantityOfStepsPerPatch;
}

function calculateRemainingSteps(totalOfSteps, quantityOfPatchs){

  var remainingSteps = totalOfSteps % quantityOfPatchs;

  return remainingSteps;

}

/*
    Concatenate all positions from 'routeSteps' array into a single array
    param routeSteps - Array that contains in each position the steps from each leg
    param totalOfLegs - Quantity of legs in the route
    return An array that contains all the steps from the route
 */
function joinAllSteps(routeSteps, totalOfLegs){
    
    var routeAllSteps = [];

    var i = 0;
    for(i = 0; i < totalOfLegs; i++){
      routeAllSteps = routeAllSteps.concat(routeSteps[i]);
    }

    return routeAllSteps;
}

/*
    Get all steps from all legs in a route and then concatenate these steps into a single array
    param routeLegs - Array of google.maps.DirectionsLeg objects that contains all legs in a route
    return An array with all steps from a route
 */
function getStepsFromLegs(routeLegs){
    
    // Quantity of legs on route
    var totalOfLegs = routeLegs.length;

    var routeSteps = [totalOfLegs];

    var i = 0;
    for(i = 0; i < totalOfLegs; i++){
      routeSteps[i] = routeLegs[i].steps;
    }

    // Put all steps from all legs into a single array
    var routeAllSteps = joinAllSteps(routeSteps, totalOfLegs);

    return routeAllSteps;

}

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

/*
    Separate the steps from 'routeAllSteps' array equally in 'quantityOfPatches' patches.
    And then add the remaining steps to the last patch.
    param routeAllSteps - Array of google.maps.DirectionsStep objects that contains all steps of the route
    param quantityOfPatches - Quantity of patches to distribute the steps into
    return An array that contains the patches with it respective steps
 */
function distributeStepsOnPatches(routeAllSteps, quantityOfPatches){

     var totalOfSteps = routeAllSteps.length;
     var quantityOfStepsPerPatch = calculateStepsPerPatch(totalOfSteps, quantityOfPatches);
     
     var patches = [quantityOfPatches];
     initializePatchesArray(patches, quantityOfPatches);

     // Will be added at the last patch
     var remainingSteps = calculateRemainingSteps(totalOfSteps, quantityOfPatches);

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
           else{
               // Nothing to do
           }
     }

     var completedPatches = fitRemainingStepsOnLastPatch(patches, routeAllSteps, remainingSteps);

     return completedPatches;
}

/*
    Slice the route in 'quantityOfPatches' patches.
    param routeToSlice - 'google.maps.DirectionsRoute' object that contains the route to slice
    param quantityOfPatches - Quantity of patchs to slice the route
    return An array with the patches.
 */
function sliceRoute(routeToSlice, quantityOfPatches){

    // Array with the route legs
    var routeLegs = routeToSlice.legs;

    // All steps in route
    var routeAllSteps  = getStepsFromLegs(routeLegs);
    
    // Separate the steps on patches
    var patches = distributeStepsOnPatches(routeAllSteps, quantityOfPatches);

     return patches;
}

/*
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

/*
    Get the start and ending coordinates of patchesArray.
    param patchesArray - Array with the patches
    return An array that contains the start and ending coordinates from all patches in google.maps.LatLng object
 */
function getCoordinatesOfPatch(patchesArray){

    var quantityOfPatches = patchesArray.length;

    var patchesSize = new Array(quantityOfPatches);

    var i = 0;
    for(i = 0; i < quantityOfPatches; i++){
          patchesSize[i] = patchesArray[i].length;
    }

    var patchesCoordinates = new Array(quantityOfPatches);

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

function countTheAccidentsByPatch(latitude, longitude){

  var route = directionsDisplay.directions.routes[0];

  // Set the quantity of patchs as you want
  var quantityOfPatches = 5;

  var routeSliced = sliceRoute(route, quantityOfPatches);

  var routePatchesCoordinates = getCoordinatesOfPatch(routeSliced);

  var accidentsInPatch = [];
  var j = 0;

  for(i=0;i<routePatchesCoordinates.length;i++){
    accidentsInPatch[i] = 0;
  }

  for(i=0;i<routePatchesCoordinates.length;i++){
    if(routePatchesCoordinates[i].startLatitude > routePatchesCoordinates[i].endLatitude){
      j = 0;
      while(j < latitude.length){
        if(latitude[j] < routePatchesCoordinates[i].startLatitude && latitude[j] > routePatchesCoordinates[i].endLatitude){
          accidentsInPatch[i] = accidentsInPatch[i] + 1;
        }
        j++;
      }
    }

    else if(routePatchesCoordinates[i].startLatitude < routePatchesCoordinates[i].endLatitude){
      j=0;
      while(j < latitude.length){
        if(latitude[j] > routePatchesCoordinates[i].startLatitude && latitude[j] < routePatchesCoordinates[i].endLatitude){
          accidentsInPatch[i] = accidentsInPatch[i] + 1;
        }
        j++;
      }
    }

  }

  return accidentsInPatch;
}

function getInfoAboutRoute(result){

  var myroute = result.routes[0];
  var mylegs = myroute.legs[0];
  var length = mylegs.steps.length;
  var initialposition = 0;
  var endposition = 0;
  var brnumber = [];
  var coordinates = [];
  var j = 0; // Count for highways in the route
  var maiorLatitude = 0;
  var menorLatitude = 0;
  var maiorLongitude = 0;
  var menorLongitude = 0;
  var latitudeCoordinate=[]; // Get the latitudes from route
  var longitudeCoordinate=[]; // Get the longitudes from route

  for (i = 0; i < length; i++){

    var instructions = mylegs.steps[i].instructions;
    if(instructions.indexOf("BR-") != -1){

      initialposition = instructions.indexOf("BR-");
      endposition = initialposition + 6;
      var substring = instructions.substring(initialposition,endposition);

      if(substring.indexOf("0") == 3){
        brnumber[j] = substring.substring(4,6);
      }
      else{
        brnumber[j] = substring.substring(3,6);
      }
      j++;

    }
  }

  for(j=0 ; j < myroute.overview_path.length; j++){
      coordinates[j] = myroute.overview_path[j];
      menorLatitude = coordinates[0].lat();
      menorLongitude = coordinates[0].lng();
      if(coordinates[j].lat() > maiorLatitude){
        maiorLatitude = coordinates[j].lat();
      }
      if(coordinates[j].lat() < menorLatitude){
        menorLatitude = coordinates[j].lat();
      }
      if(coordinates[j].lng() > maiorLongitude){
        maiorLongitude = coordinates[j].lng();
      }
      if(coordinates[j].lng() < menorLongitude){
        menorLongitude = coordinates[j].lng();
      }
      latitudeCoordinate[j] = coordinates[j].lat();
      longitudeCoordinate[j] = coordinates[j].lng();
  }

   getCoordinatesToMarkers(brnumber, maiorLatitude, menorLatitude, maiorLongitude, menorLongitude, longitudeCoordinate, latitudeCoordinate);

}

function getCoordinatesToMarkers(brnumber,maiorLatitude, menorLatitude, maiorLongitude, menorLongitude, longitudeCoordinate, latitudeCoordinate){

  // Get the latitudes, longitudes and highways of accidents from database using the 'gon' gem
  var latitudeArray = gon.latitude;
  var longitudeArray = gon.longitude;
  var brArray = gon.br;

  var j = 0; // Position in brs Array
  var i = 0; // Position in coordinates(latitude,longitude) Array
  var s = 0; // Position in latitude Array (latitudeCoordinate)

  var position = [];
  var lat; // Latitude to marker
  var lng; // Longitude to marker
  var latitude = [];
  var longitude = [];
  var latitudeLimit;
  var longitudeLimit;
  var clicked = false;



  for(x = 0; x < brnumber.length; x++){
    for(i = 0; i < brArray.length; i++){
      if (brArray[i] == brnumber[x]){
          position[j] = i;
          j++;
      }
    }
  }


  for(p = 0; p < position.length; p++){
    lat = parseFloat(latitudeArray[position[p]]);
    lng = parseFloat(longitudeArray[position[p]]);

    if(lat <= maiorLatitude && lat >= menorLatitude){
      if(lng <= maiorLongitude && lng >= menorLongitude){
          latitude[i]  = lat;
          longitude[i] = lng;
          i++;
      }
    }
  }

   markAccidents(latitudeCoordinate, longitudeCoordinate, latitude, longitude);
}

function markAccidents(latitudeCoordinate, longitudeCoordinate, latitude, longitude){

      var s = 0;
      var p = 0;
      var i = 0; // Used to swap the vectors latitudesToMark and longitudesToMark
      var latitudesToMark = [];
      var longitudesToMark = [];
      var accidentsInPatch= [];

      while(s < latitudeCoordinate.length){

            for(p = 0; p < latitude.length; p++){

                  latitudeLimit = latitude[p] - latitudeCoordinate[s];
                  longitudeLimit = longitude[p] - longitudeCoordinate[s];

                  if(latitudeLimit > -0.5 && latitudeLimit < 0.5 && longitudeLimit > -0.5 && longitudeLimit < 0.5){
                       latitudesToMark[i] = latitude[p];
                       longitudesToMark[i] = longitude[p];
                       i++;
                  }
            }

            s++;
      }
      accidentsInPatch = countTheAccidentsByPatch(latitudesToMark, longitudesToMark);
      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
            removeAllMarkersFromMap();
            deleteMarkersOnMap();
            getInfoAboutRoute(directionsDisplay.directions);
      });

      $(document).ready(function(){
          $("#sinalizeAccidents").click(function(){
                // Sweeps the arrays marking on the map the accident given by it coordinates
                while(i >= 0){

                    markAccident(latitudesToMark[i], longitudesToMark[i]);

                    i = i - 1;
                }
          });
      });

}

// Array that contains all markers that is visible on map
var markersOnMap;
var quantityOfMarkersOnMap;

function setUpMarkersArray(){
  markersOnMap = new Array();
  quantityOfMarkersOnMap = new Number();
}

/*
    Save a marker on markersOnMap array
    param marker - Marker that will be saved on markersOnMap array
 */
function saveMarkerOnMap(markerToSave){
  quantityOfMarkersOnMap = markersOnMap.push(markerToSave);
}

// Delete all markers on markersOnMap array
function deleteMarkersOnMap(){

  markersOnMapLength = markersOnMap.length;

  // If the array is not already empty, get it emp  ty.
  if(markersOnMapLength > 0){

    var i = 0;
    for(i = 0; i < markersOnMapLength; i++){
      markersOnMap.pop();
      quantityOfMarkersOnMap = quantityOfMarkersOnMap - 1;
    }

    /*// If the array got empty, the quantity of markers should be 0
    if(quantityOfMarkersOnMap == 0){
      return true;
    }
    else{
      return false;
    }*/

  }
  else{
    // return false;
    // Nothing to do
  }

}

/*
   Set the marker invisible on map
   param markerToRemove - Marker that will be removed from map
 */
function removeMarkerFromMap(markerToRemove){
  /* To remove from map */
  markerToRemove.setMap(null);

  // To set invisible
  // markerToRemove.setVisible(false);
}

// Remove all markers on 'markersOnMap' array from map
function removeAllMarkersFromMap(){

  markersOnMapLength = markersOnMap.length;

  if(markersOnMapLength > 0){

    var i = 0;
    for(i = 0; i < markersOnMapLength; i++){
      markerToBeRemoved = markersOnMap[i];
      removeMarkerFromMap(markerToBeRemoved);
    }

  }
  else{
    // Nothing to do
  }
}

/*
    Create a marker on the map
    param latitude - Latitude of the point to be marked
    param longitude - Longitude of the point to be marked
 */
function markAccident(latitude, longitude){

     var marker;
     // var iconSize = new google.maps.Size();

     // iconSize.width = 10;
     // iconSize.height = 10;

      marker = new google.maps.Marker({
            position:  new google.maps.LatLng(latitude, longitude),
            // // Used to change marker layout
            // icon:{
            //   url: "/assets/ic_warning_amber_24dp.png",
            //   size: iconSize
            // },
            visible: true,
            map: map
      });

      saveMarkerOnMap(marker);
}