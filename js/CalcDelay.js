var platsuppslagAPI_KEY = "5ba1e38768d7438bb43f62a6ce073cba";
var realtidsAPI_KEY = "9454dc2de4564ac6a8290d37b731cd21";
var typeOftransport = ["Buses", "Metros", "Ships", "Trains", "Trams"];
function platsuppslagAPICall(station, lineNumber) {


    $.ajax({
        url: "http://api.sl.se/api2/typeahead.json?key=" + platsuppslagAPI_KEY + "&searchstring=" + station + "&stationsonly=true",
        type: "GET",
        dataType: "text",
        success: function(data){
            var json_data = JSON.parse(data);
            for (i = 0; i<json_data.ResponseData.length; i ++){
                //console.log(json_data.ResponseData[i].Name);
                var objStr = json_data.ResponseData[i].Name
                var stationName = objStr.substring(0, objStr.indexOf('(')).trim();
                if(stationName.toLowerCase().trim() === station.toLowerCase().trim()){
                    console.log(json_data.ResponseData[i].SiteId);
                    realtidsinfoAPICall(json_data.ResponseData[i].SiteId, lineNumber);
                    //callback(json_data.ResponseData[i].SiteId, lineNumber, finalCalculation);
                }
                
            }  
        }
    });
                  
}

function realtidsinfoAPICall(siteID, lineNumber) {
    //GET THE SITEID!!!´(fulhax = 3433 för kungshamra)
    //console.log(fromPlatsuppslag.ResponseData[0]);
    var list = [];
    $.ajax({
        url: "http://api.sl.se/api2/realtimedeparturesv4.json?key=" + realtidsAPI_KEY + "&siteid=" + siteID + "&timewindow=30",
        type: "GET",
        dataType: "text",
        success: function(data){
            var json_data = JSON.parse(data);
            //console.log(json_data.ResponseData);
            for(i = 0; i < typeOftransport.length; i++){
                for (j = 0; j<json_data.ResponseData[typeOftransport[i]].length; j++){
                    var obj = json_data.ResponseData[typeOftransport[i]][j];
                    if(obj.LineNumber === lineNumber){
                        list.push(obj);
                    }
                    
                }
             }
             createHTML(list);
        }
    });
    
}

function createHTML(listOfDepartures){
    var elems = document.createElement('div');
    elems.className = "delayEntries";
    for (i = 0; i<listOfDepartures.length; i++){
        var row = document.createElement('div');
        row.className = "delayRow";
        var left = document.createElement('div');
        left.className = "delayEntryLeft";
        var right = document.createElement('div');
        right.className = "delayEntryRight";
        var left_text = document.createTextNode("Correct time of arrival: " + listOfDepartures[i].TimeTabledDateTime);
        var date1 = new Date(listOfDepartures[i].TimeTabledDateTime);
        var date2 = new Date(listOfDepartures[i].ExpectedDateTime); 
        var delay = date2 - date1;
        var right_text = document.createTextNode("Delay in seconds: " + delay/1000);
        left.appendChild(left_text);
        right.appendChild(right_text);
        row.appendChild(left);
        row.appendChild(right);
        elems.appendChild(row);
    }

    var elem = document.getElementById('trafic')
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
            }
    elem.appendChild(elems);



    
    //console.log(lineNumber);
    //console.log(fromRealtidsInfo);
}

function calcDelay(station, lineNumber){
    platsuppslagAPICall(station, lineNumber);
}

