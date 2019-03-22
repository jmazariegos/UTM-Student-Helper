// This is the javascript for maps -> add food places afterwards
// Port to client js afterwards

function loadBuilding(building) {
    // Building is the building name
    var url = "./Website/TempFolder/Buildings.json";
    console.log("Loaded Building "+ building);
    $.getJSON(url, function(data) {
            console.log("In json request");
            console.log(data);
            var table = document.getElementById("mapButtons");
            let placeJSON = null;

            var build = data["buildings"];
            for (var i=0; i < build.length; i++){
                if (build[i].code == building){
                    placeJSON=build[i]
                    break;
                }
            }

            if(placeJSON == null){
                console.log("Shouldn't be here");
                return;
            }


            // Take apart button table
            while (table.rows.length>0){
                table.deleteRow(0);
            }
            // Load Current Object

            //Change Image + Titlie
            var title = document.getElementById("mapTitle");
            title.innerHTML = placeJSON.name;


            var pic = document.getElementById("mapImg");
            pic.src ="images/parking-map.PNG"; // This to be changed to proper image

            // Add New Buttons for each floor

            // Add Apropriate listeners
            
        }
    ).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
    });
    return;
}

function loadMain(){
    // Create the title
    var title = document.getElementById("mapTitle");
    title.innerHTML = "MAP OF UTM";

    var pic = document.getElementById("mapImg");
    pic.src ="images/campus-map.jpg";

    // Loads the main Map -> Special ids for button names
    var table = document.getElementById("mapButtons");

    // remove existing table
    while (table.rows.length>0){
        table.deleteRow(0);
    }

    console.log("in function");

    var url = "./Website/TempFolder/Buildings.json";
    //update buttons
    $.getJSON(url, function(data) {
            console.log("In json request");
            var build = data["buildings"];
            for (var i=0; i < build.length; i++){
                var row = table.insertRow(0);
                var cell = row.insertCell(0);
                row.id = build[i].code;
                var createClickHandler = function(row) {
                    return function() {
                        var cell = row.getElementsByTagName("td")[0];
                        var id = cell.innerHTML;
                        console.log("id:" + id);
                        loadBuilding(id);
                    };
                  };
                row.onclick = createClickHandler(row);
                cell.innerHTML = build[i].code;
            }
        }
    ).fail(function( jqxhr, textStatus, error){
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});
}



