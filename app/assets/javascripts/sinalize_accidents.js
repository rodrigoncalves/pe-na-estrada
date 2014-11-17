/* global DirectionsDisplay */
/* global countTheAccidentsByPatch */
/* global map */

/*
  Get the current route from API Gmaps
  return - The current route 
 */
function getCurrentRoute(){
  // Get the first route created by Google maps
  var currentRoute = directionsDisplay.directions.routes[0];
  return currentRoute;
}

/*
  Get the highways in the route
  param result - Variable that contains the route
*/
function getHighwaysFromRoute(){

  var myroute = getCurrentRoute();
  var mylegs = myroute.legs[0];
  var length = mylegs.steps.length;
  var initialposition = 0;
  var endposition = 0;
  var highwaysInRoute = [];
  var highwayNumber;
  var j = 0; // Count for highways in the route
  var i = 0;

  for (i = 0; i < length; i++){

    var instructions = mylegs.steps[i].instructions;
    if(instructions.indexOf("BR-") !== -1){

      initialposition = instructions.indexOf("BR-");
      endposition = initialposition + 6;
      var highwaysString = instructions.substring(initialposition,endposition);

      highwayNumber = defineHighwaysNumber(highwaysString,highwaysInRoute); 

      alreadyExists = checkIfHighwaysExist(highwayNumber, highwaysInRoute); 

      if(alreadyExists == false){ 
        highwaysInRoute[j] = highwayNumber; 
        j++; 
      } 


    }
  }
  getCoordinatesFromRoute(highwaysInRoute,myroute);
}

/* 
  This function define the number of the highway 
  param highwaysString - String on the format(BR-000) used to extracts the number 
  param highwaysInRoute - Array that contains the highways in route 
  return - Number of the highway 
 */ 
function defineHighwaysNumber(highwaysString,highwaysInRoute){ 

  var highwayNumber; 

  if(highwaysString.indexOf("0") === 3){ 
    highwayNumber = highwaysString.substring(4,6); 
  } 
  else{ 
    highwayNumber = highwaysString.substring(3,6); 
  } 

  return highwayNumber; 
} 

/* 
  This function checks if the highway is in the array of the highways 
  param highwaysString - String that contains the number of the highway 
  param highwaysInRoute - Array that contains the highways in route 
  return - Return if the highway number already exists 
 */ 
function checkIfHighwaysExist(highwayNumber, highwaysInRoute){ 

  var exists = false; 
  var i = 0; 

  for(i = 0 ; i < highwaysInRoute.length ; i++){ 
    if(highwaysInRoute[i] === highwayNumber){ 
      exists = true; 
    } 
  } 

  return exists; 
} 

/*
  Checks if the coordinate is larger or smaller coordinate
  param coordinatesLimit - Object with the limit coordinates
  param coordinate       - Variable with the coordinate to be checked
  return - Object with the limit coordinates 
*/
function checkCoordinate(coordinatesLimit, coordinate){

  if(coordinate > coordinatesLimit.greaterLatitude){
    coordinatesLimit.greaterLatitude = coordinate;
  }
  else if(coordinate < coordinatesLimit.lowerLatitude){
    coordinatesLimit.lowerLatitude = coordinate;
  }

  return coordinatesLimit;

}

/*
  Get the coordinates in the route
  param highwaysInRoute   - Array with the route highway's number
  param coordinate - Variable with the route
*/
function getCoordinatesFromRoute(highwaysInRoute,myroute){

  var coordinates = [];
  var j = 0; // Count for highways in the route
  var latitudesLimit;
  var longitudesLimit;

  latitudesLimit = {
      greaterLatitude: 0,
      lowerLatitude: myroute.overview_path[0].lat()
  };
  longitudesLimit = {
      maiorLongitude: 0,
      menorLongitude: myroute.overview_path[0].lng()
  };

  for(j=0 ; j < myroute.overview_path.length; j++){
      coordinates[j] = myroute.overview_path[j];
      latitudesLimit = checkCoordinate(latitudesLimit,coordinates[j].lat());
      longitudesLimit = checkCoordinate(longitudesLimit,coordinates[j].lng());
  }

  getCoordinatesToMarkers(highwaysInRoute, latitudesLimit,longitudesLimit, coordinates);

}

/* 
  This function get the coordinates of the accidents in route 
  param highwaysInRoute - Array that contains the highways in route 
  param latitudesLimit - Object that contains the greater and the lower latitude in route 
  param longitudesLimit - Object that contains the greater and the lower longitude in route 
  param coordinates - Array that contains the coordinates from route 
 */ 
function getCoordinatesToMarkers(highwaysInRoute, latitudesLimit,longitudesLimit, coordinates){

  // Get the latitudes, longitudes and highways of accidents from database using the 'gon' gem
  var latitudeArray = gon.latitude;
  var longitudeArray = gon.longitude;
  var lat; // Latitude to marker
  var lng; // Longitude to marker
  var latitude = [];
  var longitude = [];
  var position = []; // Array with the positions of the higways in the route

  var i = 0; // Position in coordinates(latitude,longitude) Array
  var p = 0;

  position = getTheAccidentsInHighway(highwaysInRoute); 

  for(p = 0; p < position.length; p++){
    lat = parseFloat(latitudeArray[position[p]]);
    lng = parseFloat(longitudeArray[position[p]]);

    if(lat <= latitudesLimit.greaterLatitude && lat >= latitudesLimit.lowerLatitude){
      if(lng <= longitudesLimit.maiorLongitude && lng >= longitudesLimit.menorLongitude){
        latitude[i]  = lat;
        longitude[i] = lng;
        i++;
      }
    }
  }

   markAccidents(coordinates, latitude, longitude);
}

/* 
  This function get the highways of the accidents in route 
  param highwaysInRoute - Array that contains the highways in route 
  return - Array with the positions in latitudes e longitudes Array
 */ 
function getTheAccidentsInHighway(highwaysInRoute){ 

  var brArray = gon.br; 
  var position = []; 
  var x = 0; 
  var j = 0; // Count the positions 
  var i = 0; 

  for(x = 0; x < highwaysInRoute.length; x++){ 
    for(i = 0; i < brArray.length; i++){ 
      if (brArray[i] === highwaysInRoute[x]){ 
        position[j] = i; 
        j++; 
      } 
    } 
  } 

  return position;
}

/* 
  This function get the coordinates of the accidentes in routete 
  param latitude - Array that contains the latitudes of the accidents in route 
  param longitude - Array that contains the longitudes of the accidents in route 
  param coordinates - Array that contains the coordinates from route 
 */ 
function markAccidents(coordinates, latitude, longitude){

  var s = 0;
  var p = 0;
  var i = 0; // Used to swap the vectors latitudesToMark and longitudesToMark
  var latitudesToMark = [];
  var longitudesToMark = [];

  while(s < coordinates.length){

    for(p = 0; p < latitude.length; p++){

      var latitudeLimit = latitude[p] - coordinates[s].lat();
      var longitudeLimit = longitude[p] - coordinates[s].lng();

      if(latitudeLimit > -0.02 && latitudeLimit < 0.02){
        if(longitudeLimit > -0.02 && longitudeLimit < 0.02){
           latitudesToMark[i] = latitude[p];
           longitudesToMark[i] = longitude[p];
           i++;
        }
      }
    }

    s++;
  }

  countTheAccidentsByPatch(latitudesToMark, longitudesToMark);

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    removeAllMarkersFromMap();
    deleteMarkersOnMap();
    getHighwaysFromRoute();
  });

  $(document).ready(function(){
    $("#sinalizeAccidents").click(function(){
      // Sweeps the arrays marking on the map the accident given by it coordinates
      var quantityOfPointsToMark = latitudesToMark.length;
      while(quantityOfPointsToMark >= 0){

          markAccident(latitudesToMark[quantityOfPointsToMark],
                               longitudesToMark[quantityOfPointsToMark]);

          quantityOfPointsToMark = quantityOfPointsToMark - 1;
      }
    });

     $("#removeSinalizationAccidents").click(function(){
         removeAllMarkersFromMap();
         deleteMarkersOnMap();
      });
  });

}

// Array that contains all markers that is visible on map
var markersOnMap;

function setUpMarkersArray(){
  markersOnMap = [];
}

/*
    Save a marker on markersOnMap array
    param marker - Marker that will be saved on markersOnMap array
 */
function saveMarkerOnMap(markerToSave){
  markersOnMap.push(markerToSave);
}

// Delete all markers on markersOnMap array
function deleteMarkersOnMap(){

  var markersOnMapLength = markersOnMap.length;

  // If the array is not already empty, get it emp  ty.
  if(markersOnMapLength > 0){

    var i = 0;
    for(i = 0; i < markersOnMapLength; i++){
      markersOnMap.pop();
    }
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

  var markersOnMapLength = markersOnMap.length;

  if(markersOnMapLength > 0){

    var i = 0;
    for(i = 0; i < markersOnMapLength; i++){
      var markerToBeRemoved = markersOnMap[i];
      removeMarkerFromMap(markerToBeRemoved);
    }

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