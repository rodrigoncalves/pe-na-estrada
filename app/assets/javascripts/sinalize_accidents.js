
function getCurrentRoute(){
  // Get the first route created by Google maps
  var currentRoute = directionsDisplay.directions.routes[0];
  return currentRoute;
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

  var i = 0;
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

      // Check the latitude
      if(coordinate.lat() > coordinatesLimit.maiorLatitude){
        coordinatesLimit.maiorLatitude = coordinate.lat();
      }
      else if(coordinate.lat() < coordinatesLimit.menorLatitude){
        coordinatesLimit.menorLatitude = coordinate.lat();
      }

      // Check the longitude
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

   getCoordinatesToMarkers(brnumber, coordinatesLimit, coordinates);

}

function getCoordinatesToMarkers(brnumber, coordinatesLimit, coordinates){

  // Get the latitudes, longitudes and highways of accidents from database using the 'gon' gem
  var latitudeArray = gon.latitude;
  var longitudeArray = gon.longitude;
  var brArray = gon.br;

  var j = 0; // Position in brs Array
  var i = 0; // Position in coordinates(latitude,longitude) Array

  var position = [];
  var lat; // Latitude to marker
  var lng; // Longitude to marker
  var latitude = [];
  var longitude = [];

  var x = 0;
  for(x = 0; x < brnumber.length; x++){
    for(i = 0; i < brArray.length; i++){
      if (brArray[i] === brnumber[x]){
          position[j] = i;
          j++;
      }
    }
  }

  var p = 0;
  for(p = 0; p < position.length; p++){
    lat = parseFloat(latitudeArray[position[p]]);
    lng = parseFloat(longitudeArray[position[p]]);

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

      while(s < coordinates.length){

            for(p = 0; p < latitude.length; p++){

                  var latitudeLimit = latitude[p] - coordinates[s].lat();
                  var longitudeLimit = longitude[p] - coordinates[s].lng();

                  if(latitudeLimit > -0.02 && latitudeLimit < 0.02 && longitudeLimit > -0.02 && longitudeLimit < 0.02){
                       latitudesToMark[i] = latitude[p];
                       longitudesToMark[i] = longitude[p];
                       i++;
                  }
            }

            s++;
      }

      countTheAccidentsByPatch(latitudesToMark, longitudesToMark);

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
  else{
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

  var markersOnMapLength = markersOnMap.length;

  if(markersOnMapLength > 0){

    var i = 0;
    for(i = 0; i < markersOnMapLength; i++){
      var markerToBeRemoved = markersOnMap[i];
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