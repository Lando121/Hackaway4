function updateTrafic() {
    $.ajax({
        url: "http://localhost:2000/api/v1/sl",
        type: "GET",
        dataType: "text",
        success: function(data){
            json_data = JSON.parse(data);
            console.log(data);
            var elems = document.createElement('div');
            elems.className = "traficEntries";
            json_data = json_data.sort(function(a,b){
                aStr = a['LineNumber'] + a['Destination'];
                bStr = b['LineNumber'] + b['Destination'];
                console.log(4);
                return aStr.localeCompare(bStr);
                /*if (aStr === bStr) {
                    return a['DisplayTime'].localeCompare(b['DisplayTime']);
                } else {
                    return aStr.localeCompare(bStr);
                }*/


            });
            json_data.forEach(function(entry){
                var row = document.createElement('div');
                row.className = "traficRow";
                var left = document.createElement('div');
                left.className = "traficEntryLeft";
                var right = document.createElement('div');
                right.className = "traficEntryRight";
                var left_text = document.createTextNode(entry['LineNumber'] + " " + entry['Destination']);
                var right_text = document.createTextNode(entry['DisplayTime']);
                left.appendChild(left_text);
                right.appendChild(right_text);
                row.appendChild(left);
                row.appendChild(right);

                elems.appendChild(row);
            });
            var elem = document.getElementById('trafic')
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }
            elem.appendChild(elems);
            setInterval(updateTrafic, 10000);
        }
    });
}

updateTrafic();
