
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
                      sinalizeMostDangerousPatch(directionsDisplay.directions.routes[0]);
                      getHighwaysFromRoute(directionsDisplay.directions);
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

var currentRoute;

function setCurrentRoute(routeToSet){
  currentRoute = routeToSet;
}

// Initialize the patches array as an array of arrays
function initializePatchesArray(patchesArray, quantityOfPatchs){
    
    // Each position in 'patches[]' array is an array that will contain the steps for this patch
    var p = 0;
    for(p = 0; p < quantityOfPatchs; p++){
        patchesArray[p] = new Array();
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
    Slice the route in 'quantityOfPatchs' patches.
    param routeToSlice - 'google.maps.DirectionsRoute' object that contains the route to slice
    param quantityOfPatchs - Quantity of patchs to slice the route
    return An array with the patches.
 */
function sliceRoute(routeToSlice, quantityOfPatchs){

    // Array with the route legs
    var routeLegs = routeToSlice.legs;

    // Quantity of legs on route
    var totalOfLegs = routeLegs.length;

    // Each position in this array is an array of 'google.maps.DirectionsStep' object
    var routeSteps = new Array(totalOfLegs);

    var i = 0;
    for(i = 0; i < totalOfLegs; i++){
      routeSteps[i] = routeLegs[i].steps;
    }

    // All steps from all legs
    var routeAllSteps = [];

    i = 0;
    for(i = 0; i < totalOfLegs; i++){
      routeAllSteps = routeAllSteps.concat(routeSteps[i]);
    }

    // Quantity of steps in the route
    totalOfSteps = routeAllSteps.length;

     var quantityOfStepsPerPatch = calculateStepsPerPatch(totalOfSteps, quantityOfPatchs);

     // Will be added at the last patch
     var remainingSteps = calculateRemainingSteps(totalOfSteps, quantityOfPatchs);

     var patches = new Array(quantityOfPatchs);

     initializePatchesArray(patches, quantityOfPatchs);

     var patchIndex = 0;
     var reachPatchMaxElements = 0;

     var quantityOfStepsToFitOnPatches = totalOfSteps - remainingSteps;

     i = 0;
     for(i = 0; i < quantityOfStepsToFitOnPatches; i++){

           patches[patchIndex].push(routeAllSteps[i]);
           reachPatchMaxElements++;

           if(reachPatchMaxElements == quantityOfStepsPerPatch){
               patchIndex++;
               reachPatchMaxElements = 0;
           }
           else{
               // Nothing to do
           }

     }

     // Last patch position in 'patches[]' array
     var lastPatch = quantityOfPatchs - 1;

     // Adding the remaining steps to the last patch
     var t = 0;
     for(t = 0; t < remainingSteps; t++){
         var routeStepsIndex = totalOfSteps - (remainingSteps - t);
         patches[lastPatch].push(routeAllSteps[routeStepsIndex]);
     }

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
  quantityOfPatches = 5;

  var routeSliced = sliceRoute(route, quantityOfPatches);
  /*
      Array with patch start and ending coordinates
      Use '.startLatitude' to access the start latitude of the patch as google.maps.LatLng object
      Use '.endLatitude' to access the end latitude of the patch as google.maps.LatLng object
      Example.: alert(routePatchesCoordinates[0].startLatitude);
   */
  var routePatchesCoordinates = getCoordinatesOfPatch(routeSliced);

  //Get quant of patch for declaration the array
  var quantityOfPatches = routeSliced.length;

  //Array with coordinates of the patch most dangerous
  var coordinatesOfPatchMostDangerous = new Array(quantityOfPatches);

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
  //Receives the all coordinates(latitude and longitude) of the portions more accidents
  coordinatesOfPatchMostDangerous[0] = identifyDangerousPatch(accidentsInPatch, routePatchesCoordinates, routeSliced);
  return accidentsInPatch;
}

//Patch which has seen more accidents
function identifyDangerousPatch(accidentsInPatch, routePatchesCoordinates, routeSliced){
  
  //Variable auxiliar for view what patch have more accidents
  var moreAccidentsPatch = 0;
  var positionMoreAccidentsPatch = 0;

  //scans the array looking for the portions more accidents
  for (var i = 0; i < accidentsInPatch.length; i++) {
    if (accidentsInPatch[i] > moreAccidentsPatch) {
      moreAccidentsPatch = accidentsInPatch[i];
      positionMoreAccidentsPatch = i;
    };
    
  };

  var quantityOfSteps = routeSliced[positionMoreAccidentsPatch].length;
  var coordinatesOfPatchMostDangerous = [];
  for (i = 0; i < quantityOfSteps; i++) {
    coordinatesOfPatchMostDangerous[i] = routeSliced[positionMoreAccidentsPatch][i].path;
  };
  //Returns the latitude and longitude of the portions more accidents
  return coordinatesOfPatchMostDangerous;
}


function sinalizeMostDangerousPatch(route){



}

/*
  Get the highways in the route
  param result - Variable that contains the route
*/
function getHighwaysFromRoute(result){

  var myroute = result.routes[0];
  var mylegs = myroute.legs[0];
  var length = mylegs.steps.length;
  var initialposition = 0;
  var endposition = 0;
  var brnumber = [];
  var j = 0; // Count for highways in the route


  setCurrentRoute(myroute);

  for (i = 0; i < length; i++){

    var instructions = mylegs.steps[i].instructions;
    if(instructions.indexOf("BR-") !== -1){

      initialposition = instructions.indexOf("BR-");
      endposition = initialposition + 6;
      var substring = instructions.substring(initialposition,endposition);

      if(substring.indexOf("0") === 3){
        brnumber[j] = substring.substring(4,6);
      }
      else{
        brnumber[j] = substring.substring(3,6);
      }
      j++;

    }
  }
  getCoordinatesFromRoute(brnumber,myroute);
}

/*
  Checks if the coordinate is larger or smaller coordinate
  param coordinatesLimit - Object with the limit coordinates
  param coordinate       - Variable with the coordinate to be checked
*/
function checkCoordinate(coordinatesLimit, coordinate){

      if(coordinate.lat() > coordinatesLimit.maiorLatitude){
        coordinatesLimit.maiorLatitude = coordinate.lat();
      }
      else if(coordinate.lat() < coordinatesLimit.menorLatitude){
        coordinatesLimit.menorLatitude = coordinate.lat();
      }
      if(coordinate.lng() > coordinatesLimit.maiorLongitude){
        coordinatesLimit.maiorLongitude = coordinate.lng();
      }
      else if(coordinate.lng() < coordinatesLimit.menorLongitude){
        coordinatesLimit.menorLongitude = coordinate.lng();
      }

      return coordinatesLimit;

}

/*
  Get the coordinates in the route
  param brnumber   - Array with the route highway's number
  param coordinate - Variable with the route
*/
function getCoordinatesFromRoute(brnumber,myroute){

  var coordinates = [];
  var j = 0; // Count for highways in the route
  var menorLatitude = 0;
  var menorLongitude = 0;
  var latitudeCoordinate=[]; // Get the latitudes from route
  var longitudeCoordinate=[]; // Get the longitudes from route
  var accidents=[];
  var coordinatesLimit;

  coordinatesLimit = {
        maiorLatitude: 0,
        menorLatitude: myroute.overview_path[0].lat(),
        maiorLongitude: 0,
        menorLongitude: myroute.overview_path[0].lng()
  };

  for(j=0 ; j < myroute.overview_path.length; j++){
      coordinates[j] = myroute.overview_path[j];
      coordinatesLimit = checkCoordinate(coordinatesLimit,coordinates[j]);
  }

   accidents = getTheUsableAccidents();
   getCoordinatesToMarkers(accidents, brnumber, coordinatesLimit, coordinates);

}

/*
  Removes the null coordinates of the coordinate arrays
*/
function getTheUsableAccidents() {

  var accidents = [];
  var i = 0;
  var j = 0;

  // Get the latitudes, longitudes and highways of accidents from database using the 'gon' gem
  var latitudeArray = gon.latitude;
  var longitudeArray = gon.longitude;
  var brArray = gon.br;

  for(j = 0; j < latitudeArray.length; j++){

    if(latitudeArray[j] !== null){  
      var accident = {
        latitude: latitudeArray[j],
        longitude: longitudeArray[j],
        br: brArray[j]
      };

      accidents[i] = accident;
      i++;
    }
  }
  return accidents;
  
}

function getCoordinatesToMarkers(accidents, brnumber,coordinatesLimit, coordinates){


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
    for(i = 0; i < accidents.length; i++){
      if (accidents[i].br === brnumber[x]){
          position[j] = i;
          j++;
      }
    }
  }


  for(p = 0; p < position.length; p++){
    lat = parseFloat(accidents[position[p]].latitude);
    lng = parseFloat(accidents[position[p]].longitude);

    if(lat <= coordinatesLimit.maiorLatitude && lat >= coordinatesLimit.menorLatitude){
      if(lng <= coordinatesLimit.maiorLongitude && lng >= coordinatesLimit.menorLongitude){
          latitude[i]  = lat;
          longitude[i] = lng;
          i++;
      }
    }
  }

   markAccidents(coordinates, latitude, longitude);
}

function markAccidents(coordinates, latitude, longitude){

      var s = 0;
      var p = 0;
      var i = 0; // Used to swap the vectors latitudesToMark and longitudesToMark
      var latitudesToMark = [];
      var longitudesToMark = [];
      var accidentsInPatch= [];

      while(s < coordinates.length){

            for(p = 0; p < latitude.length; p++){

                  latitudeLimit = latitude[p] - coordinates[s].lat();
                  longitudeLimit = longitude[p] - coordinates[s].lng();

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
            getHighwaysFromRoute(directionsDisplay.directions);
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