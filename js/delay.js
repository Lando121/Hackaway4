/**
 * Created by Katja on 2017-01-25.
 */
function updateTrafic(){
    $.ajax({
        url: "http://localhost:2000/api/v1/sl",
        type: "GET",
        dataType: "text",
        success: function(data){
            Console.log(data);
                /*if (aStr === bStr) {
                    return a['DisplayTime'].localeCompare(b['DisplayTime']);
                } else {
                    return aStr.localeCompare(bStr);
                }*/

        }
    });
}

updateTrafic();
