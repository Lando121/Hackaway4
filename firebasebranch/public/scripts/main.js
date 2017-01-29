/*
main.js handles all communication between index.html, api.js and database.js. 
And is responsibly for rendering the interface.
Like a spider.
JQuery fetches references to elements in the html to update data there.
When relevant a call is made to functions in api.js, database.js or both.
When sending a request to the api, remember to include a callback function.
*/

$( document ).ready(function() {



//Use as callback when you just want to see response from api call in console
function printToConsole(response) {
  console.log(response);
}


//Update interface (list) when change in database detected
var listRef = document.getElementById("list");
var dbRefList = firebase.database().ref().child('recent');
dbRefList.on('child_added', snap => {
  const li = document.createElement('li');
  li.innerText = snap.val().word;
  listRef.appendChild(li);
});


/********************************************************
* Takes the input from searchfield and makes the API call
*********************************************************/
$( "#searchButton" ).click(function() {
  var searchInput = $( "#searchInput" ).val()
  database.writeWordToRecent(searchInput);
  api.getStation(searchInput, printToConsole);

});

//Handles "enter" press. Suppress standard form submit and instead make API call 
$('#custom-search-form').submit(function(e){
  e.preventDefault();
  var searchInput = $( "#searchInput" ).val()
  database.writeWordToRecent(searchInput);
  api.getStation(searchInput, printToConsole);
});



/***********************************************
* Gets the 10 closest stations to Mårdstigen 15
************************************************/
$( "#getNearbyStations" ).click(function() {
 api.getNearbyStations(printToConsole);

});

 /***********************************************
 * Get realtime data for kungshamra?
 ************************************************/
 $( "#getRealTest" ).click(function() {
  api.APIcall_realtid();
});

/***********************************************
* Draw circles on map
************************************************/
var listOfStations = {
  1234: {
    center: {lat: 59.878, lng: 18.629},
    population: 2713
  }
};

$("#ShowMap").click(function () {
 map.drawCircles(listOfStations);
});
console.log( "main.js completely ready" );
});

/***********************************************
* Gets the 10 closest stations to Mårdstigen 15
************************************************/
$( "#getCurrentStations" ).click(function() {
 database.getCurrentStations();

});

/***********************************************
* Generate fake map_data
************************************************/
$( "#fakeMapdata" ).click(function() {
  console.log('Generating fake mapdata...');
  database.updateDelay('siteID3','lat3','long3','avgdelay3','timestamp3');
});


function extractJSON(data){
  console.log('extractJSON');
  console.log(data);
}

$( "#readCurrent" ).click(function() {
  console.log('Reading current data...');
  database.readCurrentDelays(extractJSON);
});


/*********************
* ACTUAL START OF MAIN
**********************/
var LIST_OF_STATIONS = [];

/***************************************
* Generate mapdata and put into database
****************************************/
function updateDatabase(){
  //listOfStations = ["karolinska sjukhuset", "norrtull", "ruddammen", "östra station", "hjorthagen", "storängsbotten", "ropsten", "odenplan", "s:t eriksplan", "karlsbergs station", "karolinska institutet", "hornsberg", "fridhemsplan", "fredhäll", "stora essingen", "centralen", "kungsträdgården", "karlaplan", "radiohuset", "skansen", "skeppsholmen", "reimersholme", "långholmen", "hornstull", "södra station", "tanto", "liljeholmen", "södersjukhuset", "mariatorget", "slussen", "waldemarsudde", "sofia", "gullmarsplan", "norra hammarbyhamnen", "sickla udde", "henriksdalsberget", "sickla köpkvarter", "finnberget", "frihamnen", "kaknästornet"];
  for (i = 0; i<100; i++){
    delaycalculator.platsuppslag(LIST_OF_STATIONS[i], database.updateDelay);
  }
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
    console.log("asdf");
     end = new Date().getTime();
  }
}

/*********************
* Generate heat map
**********************/
//Get data from database

function extractionCallback(data){
  console.log('inside extractionCallback');
    var heatmapData = [];
  for(var key in data){
    if(data.hasOwnProperty(key) && data[key].avgDelay > 0){// && (Date.now() - data[key].timestamp) < 900000 ){ //15min
      //console.log(data[key]);
      //console.log(data[key].center.lat);
      //map.drawCircle(data[key]);
        //console.log("hej"+data[key].center.lat);
        heatmapData.push({location: new google.maps.LatLng(data[key].center.lat, data[key].center.lng), weight:data[key].avgDelay});
    }
  }
    map.drawHeatmap(heatmapData);
}

function extractionCallbackStations(data){
  for(var key in data){
      //console.log(data[key]);
      LIST_OF_STATIONS.push(data[key].station);
    
  }
  console.log(LIST_OF_STATIONS.length);
}

function generateMapCircles(){
  //console.log('inside generateMapCircles');
  map.clearMap();
  database.readCurrentDelays(extractionCallback); //extract from
}

function generateStationList(){

  database.readCurrentStations(extractionCallbackStations);
}

//updateDatabase(getStations.listOfStations);
setInterval(generateMapCircles, 10000);
//setInterval(updateDatabase, 5000);



/***************************************
* Build rest of UI
****************************************/





