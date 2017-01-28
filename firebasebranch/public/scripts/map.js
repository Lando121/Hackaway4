/**
 * Created by Katja on 2017-01-28.
 */

var map;
var citymap = {
    1234: {
        center: {lat: 59.878, lng: 18.629},
        population: 2713
    }
};
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(59.38, 18.03),
        mapTypeId: 'roadmap'
    });
    for (var city in citymap) {
        // Add the circle for this city to the map.
        var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: Math.sqrt(citymap[city].population) * 100
        });

    }

}