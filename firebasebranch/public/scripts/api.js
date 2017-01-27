/*
api.js handles all communication with the api resrobot. 
Calls are made in the main function. 
An API call always returns a Javascript object.
*/

var APIKEY_resrobot = "604c4a18-fd31-421a-b37c-86a93bd95f15";
var APIKEY_realtid = "93b30606779049a59689424e0cf02c5d";

var api = {};

/*******
resrobot
********/
//Basic API call. The response is formatted as a Javascript object and processed by the provided callback.
api.APIcall_resrobot = function(method, parameters, callback){
    var originalAPIurl = "https://api.resrobot.se/v2/";
    var format = "&format=json";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    var url = originalAPIurl+method+"key="+APIKEY_resrobot+parameters+format;
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null); 
}

//Takes a string as input and returns matches based on the string.
api.getStation = function(station, callback) {
    //var url = "https://api.resrobot.se/v2/location.name?key=c894e228-9574-4474-b2dc-b09107b498e7&input=" + name;
    //var url2 = "https://api.resrobot.se/v2/location.name.json?key=<c894e228-9574-4474-b2dc-b09107b498e7>&input=centralen"
    var method = "location.name?"
    var parameters = "&input=" + station;
    api.APIcall_resrobot(method, parameters, callback);
}

//Returns the 10 closest stations to Mårdstigen 15.
api.getNearbyStations = function(callback){
    var method = "location.nearbystops?"
    var parameters = "&originCoordLat=59.381411199999995&originCoordLong=18.0276337&maxNo=10&r=10000"
    api.APIcall_resrobot(method, parameters, callback);
}

//"http://api.sl.se/api2/realtimedeparturesv4.json?key=" + realtidsAPI_KEY + "&siteid=" + siteID + "&timewindow=30"

/***********************
sl realtidsinformation 4
***********************/
//Basic API call. The response is formatted as a Javascript object and processed by the provided callback.
/*
api.APIcall_realtid = function(method, parameters, callback){
    var originalAPIurl = "https://api.resrobot.se/v2/";
    var siteID = "3433"
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    var url = "http://api.sl.se/api2/realtimedeparturesV4.json?key=9454dc2de4564ac6a8290d37b731cd21&siteid=3433&timewindow=30";
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null); 
}
*/


api.APIcall_realtid = function(station, lineNumber, callback) {
    $.ajax({
        url: "http://api.sl.se/api2/realtimedeparturesV4.json?key=9454dc2de4564ac6a8290d37b731cd21&siteid=3433&timewindow=30",
        type: "GET",
        dataType: "text",
        success: function(data){
            var json_data = JSON.parse(data);
            console.log('success')
            }  
        }
    });
                  
}


//http://api.sl.se/api2/realtimedeparturesV4.json?key=9454dc2de4564ac6a8290d37b731cd21&siteid=3433&timewindow=30


//Fetches realtime data for hardcoded kungshamra siteid=3433
api.getRealTest = function(callback){
    var method = "location.nearbystops?"
    var parameters = "&originCoordLat=59.381411199999995&originCoordLong=18.0276337&maxNo=10&r=10000"
    api.APIcall_realtid(method, parameters, callback);
}



