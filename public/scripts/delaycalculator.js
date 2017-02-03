/**
 * delaycalculator.js fetches stationID, fetches information about delays and calculates a station average
 * the callback in parseData() is used to store information in the database.
 */

var platsuppslagAPI_KEY = "c9c1a20b33e640769a2558405c591f6b";
var realtidsAPI_KEY = "9454dc2de4564ac6a8290d37b731cd21";
var typeOftransport = ["Buses", "Metros", "Ships", "Trains", "Trams"];
var delaycalculator = {};


/**
 * Takes a list of planned arrivals and currently expected arrivals and calculates an
 * average delay for the station. Sends this information into the callback function (database.updateDelay())
 */
function parseData(list, long, lat, siteID, callback) {
    var averageDelay = 0;
    for (i = 0; i < list.length; i++) {
        var d1 = new Date(list[i].TimeTabledDateTime);
        var d2 = new Date(list[i].ExpectedDateTime);
        var delay = (d2 - d1) / 1000;
        averageDelay += delay;
    }

    averageDelay = averageDelay / list.length;
    var longitud = [long.slice(0, 2), ".", long.slice(2)].join('');
    var latitud = [lat.slice(0, 2), ".", lat.slice(2)].join('');
    longitud = parseFloat(longitud);
    latitud = parseFloat(latitud);

    if (averageDelay < 0) {
        averageDelay = 0;
    }
    callback(siteID, latitud, longitud, averageDelay, Date.now());
}


/**
 * Takes the siteID and finds the realtime data for this particular site. Sends it further to parseData
 * to calculate an actual delay average.
 */
function realTid(siteID, long, lat, callback) {
    var list = [];
    $.ajax({
        url: "http://api.sl.se/api2/realtimedeparturesv4.json?key=" + realtidsAPI_KEY + "&siteid=" + siteID + "&timewindow=30",
        type: "GET",
        dataType: "text",
        success: function(data) {
            if (data === undefined) {
                return;
            }
            var json_data = JSON.parse(data);
            for (i = 0; i < typeOftransport.length; i++) {
                for (j = 0; j < json_data.ResponseData[typeOftransport[i]].length; j++) {
                    var obj = json_data.ResponseData[typeOftransport[i]][j];
                    list.push(obj);
                }
            }
            parseData(list, long, lat, siteID, callback);
        }
    });
}


/**
 * takes the name of a station (String) and finds its siteID, ultimately sending the current delay
 * into the callback function using realTid() and parseData() to fetch the data (site) and make the calculations.
 */
delaycalculator.platsuppslag = function(station, callback) {
    $.ajax({
        url: "http://api.sl.se/api2/typeahead.json?key=" + platsuppslagAPI_KEY + "&searchstring=" + station + "&stationsonly=true",
        type: "GET",
        dataType: "text",
        success: function(data) {
            var json_data = JSON.parse(data);

            for (i = 0; i < json_data.ResponseData.length; i++) {
                var objStr = json_data.ResponseData[i].Name
                var stationName = objStr.substring(0, objStr.indexOf('(')).trim();

                if (stationName.toLowerCase().trim() === station.toLowerCase().trim()) {
                    realTid(json_data.ResponseData[i].SiteId, json_data.ResponseData[i].X, json_data.ResponseData[i].Y, callback);
                }
            }
        }
    });
}