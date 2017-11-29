var rendererOptions, directionsDisplay, directionsService, handler, map, heatmap;

$(document).ready(function(){
  google.maps.event.addDomListener(window, 'load', function(){
    setUpMarkersArray();
    initialize();
  });

  // Gives to the map the option to drag it and change the route
  rendererOptions = {
    // Draggable is turned on when the option below is set as 'true'
    draggable: false,
    hideRouteList: true
  };


  // Global variables
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  directionsService = new google.maps.DirectionsService();

  handler = Gmaps.build('Google');
  handler.buildMap({internal: {id: 'directions'}}, function(){
    directionsDisplay.setMap(handler.getMap());
    initialize();
  });
});


// Compute the total distance from the origin to the destination
function computeTotalDistance(){

  var total = 0;
  var route = getCurrentRoute();

  total = calculateRouteTotalDistance(route);

  total = total / 1000;
  $("#total").html(total + " km");
}

// Compute the total distance from the origin to the destination
function computeTotalDistanceToSafeRoute(route){

  var total = 0;

  total = calculateRouteTotalDistance(route);

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

// // Contains the heatmap layer
// var heatmap;

// // Contains the map
// var map;

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
          travelMode:  google.maps.TravelMode.DRIVING,

          // Set the option below as true to obtain alternative routes
          provideRouteAlternatives: true
      };

      directionsService.route(request, function(response, status){

            var statusOK = google.maps.DirectionsStatus.OK;
            switch(status){

                  case statusOK:
                    var text = "<span class='label label-success'> Distância total: <span id='total'></span></span>";
                    $("#distance").html(text);
                    directionsDisplay.setDirections(response);

                    $(document).ready(function(){

                      $("#chooseRoute").click(function(){
                        displayFoundRoutes(directionsDisplay.directions.routes.length);

                        $("#choosen_route").change(function(){
                          provideRouteAlternatives();
                        });

                      });

                      $("#safeRoute").click(function(){

                        // Clean the select options
                        var htmlToInsert = "";
                        $("#routes_list").html(htmlToInsert);

                        // Trace the route less dangerous
                        traceSafeRoute();
                      });

                    });

                    getHighwaysFromRoute(directionsDisplay.directions.routes[0]);
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

// Clean all staff from map
function cleanMap(){
  unsinalizeMostDangerousPatch();
  removeAllMarkersFromMap();
  deleteMarkersOnMap();
}


function provideRouteAlternatives () {
  var choosenIndex = getChoosenRoute();
  directionsDisplay.setRouteIndex(choosenIndex);
  var route = getCurrentRoute();
  computeTotalDistance();
  cleanMap();
  getHighwaysFromRoute(route);
}

function traceSafeRoute(){
  var maxNumberAccidents = gon.latitude.length;
  var indexSafeRoute = 0;
  var quantityOfAccidents = 0;
  var route = directionsDisplay.directions.routes;

  for(var x = 0; x < route.length;x++){

    quantityOfAccidents = getHighwaysFromRoute(route[x]);

    if(quantityOfAccidents < maxNumberAccidents){
      maxNumberAccidents = quantityOfAccidents;
      indexSafeRoute = x;
    }

  }
  directionsDisplay.setRouteIndex(indexSafeRoute);
  computeTotalDistanceToSafeRoute(route[indexSafeRoute]);
  cleanMap();
  getHighwaysFromRoute(route[indexSafeRoute]);
}