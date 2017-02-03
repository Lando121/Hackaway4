/**
 * main.js is in charge of all communication between the other scriptfiles and the html.
 * No crossover calls are necessary (and actively discouraged).
 * @author Emilio Lando
 * @author Denise Nordlöf
 * @author Katja Röös
 * @date 2017-02-03
 */


$(document).ready(function() {
    "use strict";
    var LIST_OF_STATIONS = [];

    /***************************************************************
     * Connection between database & interface.
     * The interface (list) updates when change in database detected.
     ***************************************************************/
    var listRef = document.getElementById("list");
    var dbRefList = firebase.database().ref().child('recent');
    dbRefList.on('child_added', snap => {
        const li = document.createElement('li');
        li.innerText = snap.val().word;
        listRef.appendChild(li);
    });


    /**
     * Updates the stored delay in the database using LIST_OF_STATIONS.
     */
    function updateDatabase() {
        for (i = 0; i < 100; i++) {
            delaycalculator.platsuppslag(LIST_OF_STATIONS[i], database.updateDelay);
        }
    }

    /**
     * Clears all currently visible markings  and reads current delays.
     * Catches the delays with extractionCallback(), which generates the actual point data.
     */
    function generateMapData() {
        map.clearMap();
        database.readCurrentDelays(extractionCallback);
    }


    /**
     * function necessary as callback in generateMapData() to catch data.
     * Generates the point data and forwards it to drawHeatMap.
     */
    function extractionCallback(data) {
        var heatmapData = [];
        for (var key in data) {
            if (data.hasOwnProperty(key) && data[key].avgDelay > 0) { // && (Date.now() - data[key].timestamp) < 900000 ){ //15min
                heatmapData.push({
                    location: new google.maps.LatLng(data[key].center.lat, data[key].center.lng),
                    weight: (data[key].avgDelay)
                });
            }
        }
        map.drawHeatmap(heatmapData);
    }


    /**
     * Generates LIST_OF_STATIONS with the help of callback function extractionCallbackStations.
     * Callback is necessary to catch data when extracted as a snapshot from the database.
     */
    function generateStationList() {
        database.readCurrentStations(extractionCallbackStations);
    }


    /**
     * function necessary as callback in generateStationList to catch data from database snapshot.
     */
    function extractionCallbackStations(data) {
        for (var key in data) {
            LIST_OF_STATIONS.push(data[key].station);
        }
    }


    //updateDatabase(getStations.listOfStations);
    generateMapData();
    setInterval(generateMapData, 60000);
    generateStationList(updateDatabase);
    setInterval(updateDatabase, 60000);

    console.log("main.js completely loaded");
});