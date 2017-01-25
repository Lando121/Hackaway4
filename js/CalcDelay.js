function platsuppslagAPICall(station, lineNumber, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText, lineNumber, finalCalculation);

        callback(xmlHttp.responseText, lineNumber, finalCalculation);
    }
    var url = "http://api.sl.se/api2/typeahead.json?key=5ba1e38768d7438bb43f62a6ce073cba&searchstring=kungshamra&stationsonly=true";

    xmlHttp.open("GET", url, true); 
    xmlHttp.send(null);
                  
}

function realtidsinfoAPICall(fromPlatsuppslag, lineNumber, callback) {
    //GET THE SITEID!!!´(fulhax = 3433 för kungshamra)
    //console.log(fromPlatsuppslag.ResponseData[0]);
    var siteID = 3433;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText, lineNumber);

        callback(xmlHttp.responseText, lineNumber);
    }
    var url = "http://api.sl.se/api2/realtimedeparturesv4.json?key=9454dc2de4564ac6a8290d37b731cd21&siteid=" + siteID + "&timewindow=5";

    xmlHttp.open("GET", url, true); 
    xmlHttp.send(null);
    
}

function finalCalculation(fromRealtidsInfo, lineNumber){
    console.log(lineNumber);
    console.log(fromRealtidsInfo);
}

function calcDelay(station, lineNumber){
    platsuppslagAPICall(station, lineNumber, realtidsinfoAPICall);
}