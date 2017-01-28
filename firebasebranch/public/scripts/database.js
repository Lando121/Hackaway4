// Initialize Firebase
    var config = {
      apiKey: "AIzaSyBZZJiIb7vXGVtCKpUJcqiH9hMnJB-NVZc",
      authDomain: "hackaway4.firebaseapp.com",
      databaseURL: "https://hackaway4.firebaseio.com",
      storageBucket: "hackaway4.appspot.com",
      messagingSenderId: "114291424233"
    };
    firebase.initializeApp(config);


// Get a reference to the database service
var database = firebase.database();

//Takes a word as input and adds it to the table "recent" in database
database.writeWordToRecent = function(word){
    // A word entry.
  var wordData = {
    word: word
  };

  // Get a key for a new word.
  var newWordKey = firebase.database().ref().child('recent').push().key;

  // Write the new words data to the recent list.
  var updates = {};
  updates['/recent/' + newWordKey] = wordData;

  return firebase.database().ref().update(updates);

}

database.updateDelay = function(siteID, lat, long, avgDelay,timestamp) {
  console.log('in update');
  firebase.database().ref('mapdata/' + siteID).set({
    center: {lat:lat,long:long},
    avgDelay: avgDelay,
    timestamp : timestamp
  });
}


database.readCurrentDelays = function(callback){
return firebase.database().ref('/mapdata/').once('value').then(function(snapshot) {
  var data = snapshot.val();
  callback(JSON.stringify(data));
});
}




