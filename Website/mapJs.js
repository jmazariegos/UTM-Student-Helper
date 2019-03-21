// This is the javascript for maps -> add food places afterwards
// Port to client js afterwards

function loadBuilding(building) {
    // Building is the building name
    $.getJSON(url, function(data) {
            console.log("In json request");
            console.log(data);
            var build = data["buildings"];
            for (var i=0; i < build.length; i++){
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                console.log(build[i].code);
                cell1.innerHTML = build[i].code;
            }
        }
    ).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
    });
    


    return;
}

function loadMain(){
    // Create the title
    var title = document.getElementById("mapTitle");
    title.innerHTML = "MAP OF UTM";
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
                        alert("id:" + id);
                    };
                  };
    row.onclick = createClickHandler(row);
                //cell.onclick = function() {console.log(cell.innerHTML +" was pressed") };
                cell.innerHTML = build[i].code;
            }
        }
    ).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});
}



