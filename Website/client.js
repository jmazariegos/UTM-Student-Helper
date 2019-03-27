//Connect to AWS
AWS.config.region = 'ca-central-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ca-central-1:fe5ab82b-d242-4947-b6e8-7dcc7090c45f',
});

//MAKES COOKIES! (YUM) --------------------------------------------------
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";

    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//---------------------------------------------------------------------

// Couple Constants:
let buildingsJSON = null;
let names = {
    1: "1st Floor",
    2: "2nd Floor",
    3: "3rd Floor",
    4: "4th Floor",
    5: "5th Floor",
    6: "6th Floor",
    7: "7th Floor",
    8: "8th Floor",
    9: "9th Floor",
}

var PATH = "./Website/assets";
var user = "";

// For  the user to login
function login() {
    hideall();
    $("sidebar").hide();
    var id = $("#lemail").val();
    var p1 = $("#lpass").val();
    // Login

    // Parse the input

    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "login",
            "parameters": {
                "email": id,
                "password": p1,
            }
        }),
    };

    var pullResults;
    let page = "#login";

    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error" + error);
        } else {
            pullResults = JSON.parse(data.Payload);
            if (pullResults['msg'] === "login: successful") {
                loadHome();
                setUser(id);
            } else {
                $("#lpass").val("")
                $(page).show();
            }
        }
    });
    $("#navbar").show();

}

function setUser(email) {
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });

    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "retrieveUsername",
            "parameters": {
                "email": email,
            }
        }),
    };

    var pullResults;
    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            pullResults = JSON.parse(data.Payload);
            setCookie('user', pullResults["msg"], 360);
        }
    });
}

//for user to  --------------------------------------------------
function Register() {
    var id = $("#ruserid").val();
    var p1 = $("#rpass1").val();
    var p2 = $("#rpass2").val();
    var email = $("#remail").val();

    if (p1.length < 8) { // Set to regex
        // Set error
        alert("Password to short");
        return;
    } else if (!(p1 === p2)) {
        alert("Password mismatch");
        return;
    }
    // Check if userid + email is valid


    //Parse Input
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "createUser",
            "parameters": {
                "username": id,
                "password": p1,
                "email": email,
            }
        }),
    };

    var pullResults;

    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            pullResults = JSON.parse(data.Payload);
        }
    });

    hideall();
    var page = "#login";
    $("#navbar").show();
    $(page).show();
}

function Reset() {
    //Reset Password
    var email = $("#resemail").val();

    //Parse Input
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "resetPassword",
            "parameters": {
                "email": email,
            }
        }),
    };

    var pullResults;

    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            $('#reset').modal('hide');
            pullResults = JSON.parse(data.Payload);
        }
    });

    hideall();

    $("#navbar").show();
    $('#login').show();

}

function hideall() {
    $("#login").hide();
    $("#cal").hide();
    $("#tt").hide();
    $("#friends").hide();
    $("#home").hide();
    $("#map").hide();
    $("#account").hide();
    $("#note").hide();
    $("#navbar").hide();
    $('#sidebar').hide();
}

function deactiveAll() {
    $("#side-home").removeClass("active");
    $("#side-calendar").removeClass("active");
    $("#side-notes").removeClass("active");
    $("#side-timetable").removeClass("active");
    $("#side-friends").removeClass("active");
    $("#side-map").removeClass("active");
    $("#side-settings").removeClass("active");
    $("#side-logout").removeClass("active");
}

// -----------------------------------------------------------------------------------------------------------------Side bar Loading

// Loads the Home screen
function loadHome() {
    hideall();
    $("#home").show();
    $("#sidebar").show();
    deactiveAll();
    $("#side-home").addClass("active");
    $("#navbar").show();

    // Additonal calls 
}

// Loads the Home screen
function loadCalendar() {
    hideall();
    $("#sidebar").show();
    $("#cal").show();
    deactiveAll();
    $("#side-calendar").addClass("active");
    $("#navbar").show();

    // Additonal calls  


}

// Loads the Home screen
function loadNotes() {
    hideall();
    $("#note").show();
    $("#sidebar").show();
    deactiveAll();
    $("#side-notes").addClass("active");
    $("#navbar").show();

    // Additonal calls 


}

// Loads the Home screen
function loadTimetable() {
    hideall();
    $("#sidebar").show();
    $("#tt").show();
    deactiveAll();
    $("#side-timetable").addClass("active");
    $("#navbar").show();

    // Additonal calls 


}

// Loads the Friends screen screen
function loadFriendsPage() {
    hideall();
    $("#friends").show();
    $("#sidebar").show();
    deactiveAll();
    $("#side-friends").addClass("active");
    $("#navbar").show();
    // Additonal calls 
    loadFriends();
    loadBlocked();
    loadRequests();

}

// Loads the map screen
function loadMap() {
    hideall();
    $("#map").show();
    $("#sidebar").show();
    deactiveAll();
    $("#side-map").addClass("active");
    $("#navbar").show();

    // Additonal calls 
    loadMain();

}

// Loads the Settings screen
function loadAccount() {
    hideall();
    $("#account").show();
    $("#sidebar").show();
    deactiveAll();
    $("#side-settings").addClass("active");
    $("#navbar").show();
    // Additonal calls

}

//for user logout 
function logout() {
    hideall();
    $("#navbar").show();
    $("#sidebar").hide();
    $('#login').show();
    setCookie('user', "", 360);
}

// --------------------------------------------------------------------Functions for map
// Loads a specific building
function loadBuilding(building) {
    // Building is the building name
    var table = document.getElementById("mapButtons");
    let placeJSON = null;

    // Validate input
    var build = buildingsJSON["buildings"];
    for (var i = 0; i < build.length; i++) {
        if (build[i].code == building) {
            placeJSON = build[i]
            break;
        }
    }
    if (placeJSON === null) {
        return;
    }

    // Remove old tables
    var food = document.getElementById("foodTable");
    while (food.rows.length > 0) {
        food.deleteRow(0);
    }

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }


    // Load Current Object
    //Change Image + Titlie
    var title = document.getElementById("mapTitle");
    title.innerHTML = placeJSON.name;


    var pic = document.getElementById("mapImg");
    pic.src = PATH + "/" + building + "Front.jpg"; // This to be changed to proper image


    // Add New Buttons for each floor -> more than 1 floor
    var floor = placeJSON.floors
    if (floor > 0) {
        for (var i = floor; i > 0; i--) {
            var row = table.insertRow(0);
            var cell = row.insertCell(0);
            cell.classList.add("location");
            row.id = i;
            var createClickHandler = function(row) {
                return function() {
                    var cell = row.getElementsByTagName("td")[0];
                    var id = cell.val;
                    pic.src = PATH + "/map_" + building + "_floor" + id + ".png";
                };
            };
            row.onclick = createClickHandler(row);
            cell.val = i;
            cell.innerHTML = names[i];
            if (building == 'DH' && i == 1) {
                table.deleteRow(0);
            }
        }

        // show the front of building button
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.classList.add("location");
        cell.innerHTML = "Front";
        var createClickHandler = function(row) {
            return function() {
                pic.src = PATH + "/" + building + "Front.jpg";
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
    for (var i = foodJSON.length - 1; i >= 0; i--) {
        row = food.insertRow(0);
        cell = row.insertCell(0);
        cell.innerHTML = foodJSON[i].name;
        cell = row.insertCell(1);
        cell.innerHTML = "<ul>";
        cell.innerHTML += "<li class='mon-thurs'>Mon - Thurs: " + foodJSON[i]['mon-thurs'] + '</li>';
        cell.innerHTML += "<li class='fri'>Fri: " + foodJSON[i]['fri'] + '</li>';
        cell.innerHTML += "<li class='sat'>Sat: " + foodJSON[i]['Sat'] + '</li>';
        cell.innerHTML += "<li class='sun'>Sun: " + foodJSON[i]['Sun'] + '</li>';

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
function highlightday() {
    var day = new Date();
    var dayAsInt = day.getDay();
    var block1 = "";
    var block2 = "";
    var block3 = "";
    if (dayAsInt == 0) {
        block1 = document.getElementsByClassName("sun")
        block2 = document.getElementsByClassName("weekend");
    } else if (dayAsInt <= 3) {
        block1 = document.getElementsByClassName("mon-wed");
        block2 = document.getElementsByClassName("mon-thurs");
        block3 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt <= 4) {
        block1 = document.getElementsByClassName("thurs");
        block2 = document.getElementsByClassName("mon-thurs");
        block3 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt == 5) {
        block1 = document.getElementsByClassName("fri");
        block2 = document.getElementsByClassName("mon-fri");
    } else if (dayAsInt == 6) {
        block1 = document.getElementsByClassName("sat");
        block2 = document.getElementsByClassName("weekend");
    }

    for (var i = 0; i < block1.length; i++) {
        block1[i].style["color"] = "#2E8B57";
        block1[i].style["font-weight"] = "bold";
    }

    for (var i = 0; i < block2.length; i++) {
        block2[i].style["color"] = "#2E8B57";
        block2[i].style["font-weight"] = "bold";
    }

    for (var i = 0; i < block3.length; i++) {
        block3[i].style["color"] = "#2E8B57";
        block3[i].style["font-weight"] = "bold";
    }
}

// Loads the main Map menu
function loadMain() {
    // Create the title
    var title = document.getElementById("mapTitle");
    title.innerHTML = "MAP OF UTM";

    var pic = document.getElementById("mapImg");
    pic.src = PATH + "/campus-map.jpg";

    // Loads the main Map -> Special ids for button names
    var table = document.getElementById("mapButtons");

    // remove existing tables
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    var food = document.getElementById("foodTable");
    while (food.rows.length > 0) {
        food.deleteRow(0);
    }

    //update buttons
    var build = buildingsJSON["buildings"];
    for (var i = 0; i < build.length; i++) {
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

//-------------------------------------------------------------- Friend Functions
function loadFriends() {
    // Gets user friends
    let temp = 'anthony'
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });

    //Clear old Table
    var table = document.getElementById("friend-list");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    // AWS call
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "getFriends",
            "parameters": {
                "username": temp
            }
        }),
    };
    var pullResults;
    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            pullResults = JSON.parse(data.Payload);
            let f = pullResults["msg"];
            if (f === "Username not in database") {
                return;
            }
            for (var i = 0; i < f.length; i++) {
                var row = table.insertRow(0);
                var cell = row.insertCell(0);
                cell.innerHTML = f[0];
                cell.val = f[0];
            }
        }
    });
}


function loadBlocked() {
    // Gets user friends
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });
    let temp = 'anthony'
    //Clear old Table
    var table = document.getElementById("blocked-list");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    // AWS call
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "getBlockedUsers",
            "parameters": {
                "username": temp
            }
        }),
    };
    var pullResults;
    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            pullResults = JSON.parse(data.Payload);
            let f = pullResults["msg"];
            if (f === "Username not in database") {
                return;
            }
            for (var i = 0; i < f.length; i++) {
                var row = table.insertRow(0);
                var cell = row.insertCell(0);
                cell.innerHTML = f[0];
                cell.val = f[0];
            }
        }
    });
}

function loadRequests() {
    // Gets user friends
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });
    let temp = 'anthony'

    //Clear old Table
    var table = document.getElementById("pending-list");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    // AWS call
    var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "getFriendRequests",
            "parameters": {
                "username": temp
            }
        }),
    };
    var pullResults;
    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt("error: " + error);
            return;
        } else {
            pullResults = JSON.parse(data.Payload);
            let f = pullResults["msg"];
            if (f === "Username not in database") {
                return;
            }
            for (var i = 0; i < f.length; i++) {
                var row = table.insertRow(0);
                var cell = row.insertCell(0);
                cell.innerHTML = f[0];
                cell.val = f[0];
            }
        }
    });
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function() {
    // Setup all events here and display the appropriate UI
    hideall();
    deactiveAll();

    $.getJSON(PATH + '/Buildings.json', function(data) {
        buildingsJSON = data;
        // loadMain();
    });

    var page = getCookie("user");
    if (page != "") {
        user = page;
        $('#sidebar').show()
        $("#side-home").addClass("active");
        $('#home').show();
    } else {
        $('#login').show(); // Here should load the right page on refresh
    }
    console.log("loaded");

    $("#loginButton").on('click', function() {
        login();
    });

    $("#regButton").on('click', function() {
        Register();
    });

    $("#resetButton").on('click', function() {
        Reset();
    });


    // ------------------------------------------ Side bar click handlers
    $("#side-home").on('click', function() {
        loadHome();
    });

    $("#side-calendar").on('click', function() {
        loadCalendar();
    });

    $("#side-notes").on('click', function() {
        loadNotes();
    });

    $("#side-timetable").on('click', function() {
        loadTimetable();
    });

    $("#side-friends").on('click', function() {
        loadFriendsPage();
    });

    $("#side-map").on('click', function() {
        loadMap();
    });

    $("#side-settings").on('click', function() {
        loadAccount();
    });

    $("#side-logout").on('click', function() {
        logout();
    });
});