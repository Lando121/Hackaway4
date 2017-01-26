function APICall(name, callback) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    var url = "https://api.resrobot.se/v2/location.name?key=c894e228-9574-4474-b2dc-b09107b498e7&input=" + name;
    var url2 = "https://api.resrobot.se/v2/location.name.json?key=<c894e228-9574-4474-b2dc-b09107b498e7>&input=centralen"
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
                  
}

function printResponse(response) {
    console.log(response);
}

function getStation(name){
    APICall(name, printResponse);
}

