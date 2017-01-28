/*
main.js handles all communication between index.html, api.js and database.js. 
And is responsibly for rendering the interface.
Like a spider.
JQuery fetches references to elements in the html to update data there.
When relevant a call is made to functions in api.js, database.js or both.
When sending a request to the api, remember to include a callback function.
*/

$( document ).ready(function() {


//Use as callback when you just want to see response frm api call in console
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
     * Show map
     ************************************************/
    $("#ShowMap").click(function () {
       initMap();
    });
    console.log( "main.js completely ready" );
});


