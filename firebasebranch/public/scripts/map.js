/**
 * Created by Katja on 2017-01-28.
 */

var map = {};
var mapObject;

//Initialisation function run as callback in api call to googleapi in index.html
function initMap() {
    mapObject = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(59.38, 18.03),
        mapTypeId: 'roadmap'
    });
}

//Takes list of stations as input and draws points on map
map.drawCircles = function(listOfStations){
    for (var station in listOfStations) {
        // Add the circle for this station to the map.
        var stationCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpastation: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpastation: 0.35,
            map: mapObject,
            center: listOfStations[station].center,
            radius: Math.sqrt(listOfStations[station].population) * 100
        });
    }
}

//Takes a single station as input and draws point on map
map.drawCircle = function(station){
        // Add the circle for this station to the map.
        console.log(station);
        var stationCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpastation: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpastation: 0.35,
            map: mapObject,
            center: station.center,
            radius: 100 + station.avgDelay*10
        });
}