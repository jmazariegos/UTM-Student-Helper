// This is the javascript for maps -> add food places afterwards
// Port to client js afterwards

let buildingsJSON = null;
let names ={
    1:"1st Floor",
    2:"2nd Floor",
    3:"3rd Floor",
    4:"4th Floor",
    5:"5th Floor",
    6:"6th Floor",
    7:"7th Floor",
    8:"8th Floor",
    9:"9th Floor",
}
var PATH = "./Website/assets";


// Loads a specific building
function loadBuilding(building) {
    // Building is the building name
    var table = document.getElementById("mapButtons");
    let placeJSON = null;

    // Validate input
    var build = buildingsJSON["buildings"];
    for (var i=0; i < build.length; i++){
        if (build[i].code == building){
            placeJSON=build[i]
            break;
        }
    }
    if(placeJSON === null){
        console.log("Shouldn't be here");
        return;
    }

    // Remove old tables
    var food = document.getElementById("foodTable");
    while (food.rows.length>0){
        food.deleteRow(0);
    }

    while (table.rows.length>0){
        table.deleteRow(0);
    }


    // Load Current Object
    //Change Image + Titlie
    var title = document.getElementById("mapTitle");
    title.innerHTML = placeJSON.name;


    var pic = document.getElementById("mapImg");
    pic.src =PATH+"/"+building+"Front.jpg"; // This to be changed to proper image


    // Add New Buttons for each floor -> more than 1 floor
    var floor = placeJSON.floors
    if (floor>0){
        for (var i=floor; i > 0; i--){
            var row = table.insertRow(0);
            var cell = row.insertCell(0);
            cell.classList.add("location");
            row.id = i;
            var createClickHandler = function(row) {
                return function() {
                    var cell = row.getElementsByTagName("td")[0];
                    var id = cell.val;
                    pic.src =PATH+"/map_"+building+"_floor"+id+".png";
                };
            };
            row.onclick = createClickHandler(row);
            cell.val = i;
            cell.innerHTML = names[i];
        }

        // show the front of building button
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.classList.add("location");
        cell.innerHTML = "Front";
        var createClickHandler = function(row) {
            return function() {
                pic.src =PATH+"/"+building+"Front.jpg"; 
            };
        };
        cell.val = 0;
        row.onclick = createClickHandler(row);
    }

    // Return to compus map button
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.classList.add("location");
    cell.innerHTML = "Campus";
    var createClickHandler = function(row) {
        return function() {
            loadMain();   
        };
    };
    cell.val = 0;
    row.onclick = createClickHandler(row);


    // Add food table
    var foodJSON = placeJSON.Food;
    for (var i=foodJSON.length -1; i >= 0; i--){
        row = food.insertRow(0);
        cell = row.insertCell(0);
        cell.innerHTML = foodJSON[i].name;
        cell = row.insertCell(1);
        cell.innerHTML = "<ul>";
        cell.innerHTML += "<li class='mon-thurs'>Mon - Thurs: "+foodJSON[i]['mon-thurs']+'</li>';
        cell.innerHTML += "<li class='fri'>Fri: "+foodJSON[i]['fri']+'</li>';
        cell.innerHTML += "<li class='sat'>Sat: "+foodJSON[i]['Sat']+'</li>';
        cell.innerHTML += "<li class='sun'>Sun: "+foodJSON[i]['Sun']+'</li>';

        cell.innerHTML += '</ul>';
    }

    var header = food.createTHead();
    row = header.insertRow(0);
    cell = row.insertCell(0);
    cell.innerHTML = "Services";
    cell = row.insertCell(1);
    cell.innerHTML = "Time";
    highlightday();

    return;
}

// Quick function to highlight current date
function highlightday(){
    var day = new Date();
    var dayAsInt = day.getDay();
    var block1 = "";
    var block2 = "";
    var block3 = "";
    if (dayAsInt == 0){
        block1 = document.getElementsByClassName("sun")
        block2 = document.getElementsByClassName("weekend");
    } else if (dayAsInt <= 3){
        block1 = document.getElementsByClassName("mon-wed");
        block2 = document.getElementsByClassName("mon-thurs");
        block3 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt <= 4){
        block1 = document.getElementsByClassName("thurs");
        block2 = document.getElementsByClassName("mon-thurs");
        block3 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt == 5){
        block1 = document.getElementsByClassName("fri");
        block2 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt == 6){
        block1 = document.getElementsByClassName("sat");
        block2 = document.getElementsByClassName("weekend");
    }

    for(var i=0; i<block1.length; i++){
        block1[i].style["color"] = "#2E8B57";
        block1[i].style["font-weight"] = "bold";
    }

    for(var i=0; i<block2.length; i++){
        block2[i].style["color"] = "#2E8B57";
        block2[i].style["font-weight"] = "bold";
    }

    for(var i=0; i<block3.length; i++){
        block3[i].style["color"] = "#2E8B57";
        block3[i].style["font-weight"] = "bold";
    }
}



// Loads the main Map menu
function loadMain(){
    // Create the title
    var title = document.getElementById("mapTitle");
    title.innerHTML = "MAP OF UTM";

    var pic = document.getElementById("mapImg");
    pic.src =PATH + "/campus-map.jpg";

    // Loads the main Map -> Special ids for button names
    var table = document.getElementById("mapButtons");

    // remove existing tables
    while (table.rows.length>0){
        table.deleteRow(0);
    }
    var food = document.getElementById("foodTable");
    while (food.rows.length>0){
        food.deleteRow(0);
    }

    //update buttons
    var build = buildingsJSON["buildings"];
    for (var i=0; i < build.length; i++){
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        row.id = build[i].code;
        var createClickHandler = function(row) {
            return function() {
                var cell = row.getElementsByTagName("td")[0];
                var id = cell.innerHTML;
                loadBuilding(id);
            };
        };
        cell.classList.add("location");
        row.onclick = createClickHandler(row);
        cell.innerHTML = build[i].code;
    }
}

// Function call off the bat
$(function(){

    // Ignores over requesting
    $.getJSON(PATH + '/Buildings.json', function(data) {
        buildingsJSON = data;
        loadMain();
    });
});
