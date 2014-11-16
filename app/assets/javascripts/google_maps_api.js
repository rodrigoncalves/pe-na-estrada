
// Loads the map on the screen
google.maps.event.addDomListener(window, 'load', function(){

    setUpMarkersArray();
    initialize();

});

// Load the sinalize_accidents.js and the sinalize_patch.js scripts
(function() {
  
  // Receives all functions from sinalize_accidents file
  var sinalizeAccidentScript = document.createElement('script');
  sinalizeAccidentScript.type = 'text/javascript';
  sinalizeAccidentScript.src = 'sinalize_accidents.js';
  
  // Receives all functions from sinalize_patch file
  var sinalizePatchScript = document.createElement('script');
  sinalizePatchScript.type = 'text/javascript';
  sinalizePatchScript.src = 'sinalize_patch.js';

  document.getElementsByTagName('head')[0].appendChild(sinalizeAccidentScript);
  document.getElementsByTagName('head')[0].appendChild(sinalizePatchScript);
})();

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
function computeTotalDistance(){

  $(document).ready(function(){
    $('#sinalizeAccidents').removeAttr('disabled');
    $('#removeSinalizationAccidents').removeAttr('disabled');
    $('#sinalizeAccidentsInPatch').removeAttr('disabled'); 

  });

  var total = 0;
  var myRoute = getCurrentRoute();

  total = calculateRouteTotalDistance(myRoute);


  total = total / 1000;
  $("#total").html(total + " km");
}

function calculateRouteTotalDistance(route){

  var totalDistance = 0;
  var i =0;
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

            // Setting map type
            mapTypeId: google.maps.MapTypeId.ROADMAP,

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

// Contains the heatmap layer
var heatmap;

// Contains the map
var map;

function initialize(){

      var mapOptions = setMapOptions();

      var directionsPanelDiv = document.getElementById("directionsPanel");
      var mapDiv = document.getElementById("directions");

      map = new google.maps.Map(mapDiv, mapOptions);


      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelDiv);

      // When the directions change, calculate the new distance
      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
            computeTotalDistance();
      });

      calculateRoute();
}

// Function used to calculate the route between the origin and destination using Google Maps services
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
                      getHighwaysFromRoute();
                      break;

                  case 'ZERO_RESULTS':
                  case 'INVALID_REQUEST':
                      window.alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '" +
                            destination + "'. \n Digite novamente.");
                      break;

                  case 'UNKNOWN_ERROR':
                  case 'REQUEST_DENIED':
                  case 'OVER_QUERY_LIMIT':
                      window.alert('Erro inesperado');
                      break;

                  case 'NOT_FOUND':
                      if(origin  !== ""){
                        window.alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '" +
                            destination  + "'. \n Digite novamente.");
                      }
                      else{
                        // Nothing to do
                      }
                      break;

                  default:
                      initialize();
                      // break;
            }

      });

}





