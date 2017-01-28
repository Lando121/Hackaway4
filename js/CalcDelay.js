var platsuppslagAPI_KEY = "5ba1e38768d7438bb43f62a6ce073cba";
var realtidsAPI_KEY = "9454dc2de4564ac6a8290d37b731cd21";
var typeOftransport = ["Buses", "Metros", "Ships", "Trains", "Trams"];
var stations = ["kungshamra", "bergshamra bro"];

function getData(){
    for (i = 0; i<stations.length; i++){
        platsuppslag(stations[i]);
    }

}

function platsuppslag(station){
    $.ajax({
        url: "http://api.sl.se/api2/typeahead.json?key=" + platsuppslagAPI_KEY + "&searchstring=" + station + "&stationsonly=true",
        type: "GET",
        dataType: "text",
        success: function(data){
            
            var json_data = JSON.parse(data);
            console.log(json_data);
         
            for (i = 0; i<json_data.ResponseData.length; i ++){
                //console.log(json_data.ResponseData[i].Name);
                var objStr = json_data.ResponseData[i].Name
                var stationName = objStr.substring(0, objStr.indexOf('(')).trim();
                
                if(stationName.toLowerCase().trim() === station.toLowerCase().trim()){
                    console.log(json_data.ResponseData[i].SiteId);
                    realTid(json_data.ResponseData[i].SiteId, json_data.ResponseData[i].X, json_data.ResponseData[i].Y);
                    
                }
                
            }  
        }
    });

}

function realTid(siteID, long, lat){
    var list = [];
    $.ajax({
        url: "http://api.sl.se/api2/realtimedeparturesv4.json?key=" + realtidsAPI_KEY + "&siteid=" + siteID + "&timewindow=30",
        type: "GET",
        dataType: "text",
        success: function(data){
            var json_data = JSON.parse(data);
            for(i = 0; i < typeOftransport.length; i++){
                for (j = 0; j<json_data.ResponseData[typeOftransport[i]].length; j++){
                    var obj = json_data.ResponseData[typeOftransport[i]][j];
                    list.push(obj);
                    
                }
             }
             parseData(list, long, lat, siteID);
        }
    });
}

function parseData(list, long, lat, siteID){
    var averageDelay = 0;
    for(i = 0; i<list.length; i++){
       
        var d1 = new Date(list[i].TimeTabledDateTime);
        var d2 = new Date(list[i].ExpectedDateTime);
        var delay = (d2 - d1)/1000;
        averageDelay += delay;
    }
    averageDelay = averageDelay/list.length;
    var longitud = [long.slice(0, 2), ".", long.slice(2)].join('');
    var latitud = [lat.slice(0, 2), ".", lat.slice(2)].join('');
    console.log("siteid is: " + siteID + " longitud: " + longitud + ", latitude: " + latitud + ". Average delay is: " + averageDelay);
}








