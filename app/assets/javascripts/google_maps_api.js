google.maps.event.addDomListener(window, 'load', initialize);
var map;
var stepDisplay;
// Gives to the map the option to drag it and change the route
var rendererOptions =
{
  draggable: true
};


var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();

function initialize()
{
  var mapOptions =
  {
    zoom: 5,
    center: new google.maps.LatLng(-15.453695287170715, -409.5702874999999),
    // Removes the default features of the map
    disableDefaultUI: true,

    // Chooses which elements are wanted in the map
    panControl: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: false,
    streetViewControl: true,
    overviewMapControl: false,

  mapTypeControlOptions:
  {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },

    zoomControlOptions:
    {
      style: google.maps.ZoomControlStyle.SMALL
    }

  };

  map = new google.maps.Map(document.getElementById('directions'), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directionsPanel"));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.directions);
  });

stepDisplay = new google.maps.InfoWindow();

  calcRoute();


}

function calcRoute() {

  var origin      = $("#origin").val();
  var destination = $("#destination").val();
  var request = {
      origin:      origin,
      destination: destination,
    travelMode:  google.maps.TravelMode.DRIVING
   };

    directionsService.route(request, function(response, status) {

    if (status === google.maps.DirectionsStatus.OK) {
      var text = "<span class='label label-success'> Distância total: <span id='total'></span></span>";
      document.getElementById("distance").innerHTML = text;
      directionsDisplay.setDirections(response);
      getInfoAboutRoute(directionsDisplay.directions);

   //   directionsDisplay.setPanel(origin);
      }
    else if (status === 'ZERO_RESULTS' || status === 'INVALID_REQUEST') {
      alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
            + destination + "'. \n Digite novamente.");
    }
    else if (status === 'UNKNOWN_ERROR' || status === 'REQUEST_DENIED') {
        alert('Erro inesperado');
    }
    else if(status === 'OVER_QUERY_LIMIT'){
        alert('Erro inesperado');
    }
    else if(status === 'NOT_FOUND'){
        if(origin  != ""){
          alert("Não foi possível encontrar uma rota entre \n '" + origin + "' e '"
                 + destination  + "'. \n Digite novamente.");
        }
        else{
          // Nothing to do
        }

    }
    else{
      directionsDisplay.setDirections(response);
      initialize();
    }
 });
}
function computeTotalDistance(result)
{
  var total = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++)
  {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.
  document.getElementById("total").innerHTML = total + " km";
}

var handler = Gmaps.build('Google');
handler.buildMap({ internal: {id: 'directions'}}, function()
{
  directionsDisplay.setMap(handler.getMap());
  initialize();
});

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

  for (i = 0; i < length; i++)
  {
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

  /* Get the latitudes, longitudes and highways of accidents from database */
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
      // while(s < latitudeCoordinate.length){
      //   for(p = 0; p < latitude.length; p++){

      //     latitudeLimit = latitude[p] - latitudeCoordinate[s];
      //     longitudeLimit = longitude[p] - longitudeCoordinate[s];
      //     if(latitudeLimit > -0.5 && latitudeLimit < 0.5 && longitudeLimit > -0.5 && longitudeLimit < 0.5){
      //           markerTheAccidents(latitude[p],longitude[p]);
      //     }
      //   }
      //    s++;
      // }

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
                       // markerTheAccidents(latitude[p],longitude[p]);
                       latitudesToMark[i] = latitude[p];
                       longitudesToMark[i] = longitude[p];
                       i++;
                  }
            }
            
            s++;
      }

      $(document).ready(function(){
          $("#sinalizeAccidents").click(function(){

                while(i >= 0){

                    markerTheAccidents(latitudesToMark[i], longitudesToMark[i]);

                    i = i - 1;
                }

          });
      });
}

function markerTheAccidents(lat,lng){

  var marker;

      marker = new google.maps.Marker({
      position:  new google.maps.LatLng(lat, lng),
      // Used to change marker layout
      // icon: {
      //   path: google.maps.SymbolPath.CIRCLE,
      //   scale: 5
      //   },
      map: map
      });

}