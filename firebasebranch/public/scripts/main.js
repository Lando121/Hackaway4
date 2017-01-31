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

  console.log( "main.js completely ready" );
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
        heatmapData.push({location: new google.maps.LatLng(data[key].center.lat, data[key].center.lng), weight:(data[key].avgDelay)});
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
generateMapCircles();
setInterval(generateMapCircles, 60000);
generateStationList(updateDatabase);
setInterval(updateDatabase, 60000);



/***************************************
* Build rest of UI
****************************************/





