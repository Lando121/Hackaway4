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
function updateDatabase(listOfStations){
  for (i = 0; i<listOfStations.length; i++){
    delaycalculator.platsuppslag(listOfStations[i], database.updateDelay);
  }
}

/***************************************
* Generate map circles
****************************************/



/***************************************
* Build rest of UI
****************************************/





