
// Loads the map on the screen
google.maps.event.addDomListener(window, 'load', function(){

    setUpMarkersArray();
    initialize();

});

var map;

// Gives to the map the option to drag it and change the route
var rendererOptions = {
  draggable: true
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

  for (i = 0; i < myRoute.legs.length; i++){
    total += myRoute.legs[i].distance.value;
  }

  total = total / 1000.
  $("#total").html(total + " km");
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