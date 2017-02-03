/**
 * database.js handles all communication between the application and the database.
 */


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBZZJiIb7vXGVtCKpUJcqiH9hMnJB-NVZc",
    authDomain: "hackaway4.firebaseapp.com",
    databaseURL: "https://hackaway4.firebaseio.com",
    storageBucket: "hackaway4.appspot.com",
    messagingSenderId: "114291424233"
};
firebase.initializeApp(config);
var database = firebase.database();


database.updateDelay = function(siteID, lat, long, avgDelay, timestamp) {
    firebase.database().ref('mapdata/' + siteID).set({
        center: {
            lat: lat,
            lng: long
        },
        avgDelay: avgDelay,
        timestamp: timestamp
    });
}


database.readCurrentDelays = function(callback) {
    return firebase.database().ref('/mapdata/').once('value').then(function(snapshot) {
        var data = snapshot.val();
        callback(data);
    });
}


database.readCurrentStations = function(callback) {
    return firebase.database().ref('/stations/').once('value').then(function(snapshot) {
        var data = snapshot.val();
        callback(data);
    });
}


database.addToStationDatabase = function(station) {
    firebase.database().ref('stations/' + station).set({
        station: station
    });
}