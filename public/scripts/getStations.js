/**
 * getStations.js is used to generate the up-to-date list of bus stations
 * to fetch delay data for and put in the database
 */

var API_KEY = "dcef1be43f25481d969b1821aac7f0c5";
var getStations = {};
var listOfStations = [];

function getData(callback) {
    callbackFunc = callback
    for (i = 0; i < stations.length; i++) {
        platsuppslag(stations[i]);
    }
}

getStations.generate = function() {
    $.ajax({
        url: "http://api.sl.se/api2/LineData.json?key=" + API_KEY + "&model=StopArea",
        type: "GET",
        dataType: "text",
        success: function(data) {

            var json_data = JSON.parse(data);
            console.log(json_data.ResponseData.Result.length);
            for (i = 0; i < json_data.ResponseData.Result.length; i++) {
                var obj = json_data.ResponseData.Result[i];
                if (obj.StopAreaTypeCode === "BUSTERM") {
                    listOfStations.push(obj.StopPointName);
                }
            }
            addToDatabase();
        }
    });
}

function addToDatabase() {
    for (i = 0; i < listOfStations.length; i++) {
        database.addToStationDatabase(listOfStations[i]);
    }
}