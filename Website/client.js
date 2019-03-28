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
var cart = [];

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
            user = pullResults["msg"];
            loadFriends();
            loadBlocked();
            loadRequests();
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
	var searchbar = document.querySelector('#searchbar');
	searchbar.value = "";
	var table = document.querySelector('#courses');
	table.innerHTML = "";
	var courseInfo = document.querySelector('#course-container');
	courseInfo.innerHTML = "";
	var session = document.querySelector('select[name=\'session\']');
	session.value = "fall/winter";
	var semester = document.querySelector('select[name=\'semester\']');
	semester.value = "F"
	cart = [];
	var cartcourses = document.querySelector('#cart-courses');
	cartcourses.innerHTML = "0";
    var timetable = document.getElementById("timetable");
    reload();

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

function addFriend(){
    var friend = $("#SearchBar").val();
    if (friend === ""){
      return;
    }
  var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
  });

  var friend = $("#SearchBar").val();
  console.log("addfriend "+ friend);
  var params = {
        FunctionName: "OurUTMUserAccounts",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: JSON.stringify({
            "function": "addFriend",
            "parameters": {
                "usernameFrom": user,
                "usernameTo": friend,
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
            var retval = pullResults["msg"];
            console.log(retval);
            $("#SearchBar").val("");
            if (retval ==="Friend request sent."){
              $("#sucMesg").val(retval);
              $("#success-msg").alert("close");
            }else {
              $("#warnMesg").val(retval);
              $("#warn").alert("close");
            }
        }
    });
}

function loadFriends() {
    // Gets user friends
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
                "username": user
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
                

                // Remove User
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-remove" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Remove"></span>';
                cell.classList.add("icon");
                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "removeFriend",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
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
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadFriends();                                
                            }
                        });
                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                // Block user
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-tower" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Block"></span>';
                cell.classList.add("icon");
                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "blockUser",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
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
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadFriends(); 
                                loadBlocked();                               
                            }
                        });



                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                // Compare Timetable
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-duplicate" data-toggle="tooltip" data-placement="top" title="Compare Timetable" aria-hidden="true"></span>';
                cell.classList.add("icon");

                cell.val = f[i];

                // Add user name
                var cell = row.insertCell(0);
                cell.innerHTML = f[i];
                cell.val = f[i];


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
                "username": user
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

                // Unblock Timetable
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-minus" data-toggle="tooltip" data-placement="top" title="Unblock" aria-hidden="true"></span>';
                cell.classList.add("icon");
                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "unblockUser",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
                                }
                            }),
                        };
                        var pullResults;
                        lambda.invoke(params, function(error, data) {
                            if (error){
                                prompt("error: " + error);
                                return;
                            } else {
                                pullResults = JSON.parse(data.Payload);
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadBlocked();                                
                            }
                        });



                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                var cell = row.insertCell(0);
                cell.innerHTML = f[i];
                cell.val = f[i];
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
                "username": user
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

                // Block User
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-tower" data-toggle="tooltip" data-placement="top" title="Block" aria-hidden="true"></span>';
                cell.classList.add("icon");

                                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "blockUser",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
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
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadBlocked();   
                                loadRequests();                             
                            }
                        });



                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                // Remove user
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-remove-sign" data-toggle="tooltip" data-placement="top" title="Reject Request" aria-hidden="true"></span>';
                cell.classList.add("icon");

                                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "declineFriendRequest",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
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
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadRequests();                                
                            }
                        });



                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                // Add user Timetable
                var cell = row.insertCell(0);
                cell.innerHTML = '<span class="glyphicon glyphicon-ok-sign" data-toggle="tooltip" data-placement="top" title="Add request" aria-hidden="true"></span>';
                cell.classList.add("icon");

                var createClickHandler = function(cell) {
                    return function() {
                        var id = cell.val;
                        var params = {
                            FunctionName: "OurUTMUserAccounts",
                            InvocationType: "RequestResponse",
                            LogType: "None",
                            Payload: JSON.stringify({
                                "function": "acceptFriendRequest",
                                "parameters": {
                                    "usernameFrom": user,
                                    "usernameTo":id
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
                                var retval = pullResults["msg"];
                                console.log(retval);
                                loadRequests();                                
                                loadFriends();
                            }
                        });



                    };
                };
                cell.onclick = createClickHandler(cell);
                cell.val = f[i];

                var cell = row.insertCell(0);
                cell.innerHTML = f[i];
                cell.val = f[i];
            }
        }
    });
}

//-------------------------------------------------------------- Timetable Functions
function createHandlers(){
	//elements checked and editted
	const $searchbar = document.querySelector('#searchbar');
	const $table = document.querySelector('#courses');
	const $courseinfo = document.querySelector('#course-container');
	const $session = document.querySelector('select[name=\'session\']');
	const $semester = document.querySelector('select[name=\'semester\']');
	const $generate = document.querySelector('#generate');
	const $cartcourses = document.querySelector('#cart-courses');
	const $view = document.querySelector('#cart-view');
	
	const $upload = document.querySelector('#upload'); //upload stuff
	upload.onclick = function(event){
		var input = document.querySelector('#file');
		if (input.files && input.files[0] && input.files[0]) {
			if(!input.files[0].name.endsWith('.ics')){
				alert("I only accept ics files.");
				return;
			}
		    var reader = new FileReader();
		    reader.onload = function (e) {
		    	var lines = reader.result.split('\n');
		    	var courses = {};
		    	var read = false;
		      	for(var i = 0; i < lines.length; i++){
		      		if(lines[i].includes("END:VEVENT")){
		      			read = false;
		      		}
		      		if(read){
		      			if(lines[i].includes("SUMMARY:")){
		      				var summary = lines[i].substring(8);
		      				var list = summary.split(' ');
		      				if(!courses[list[0]]){
		      					courses[list[0]] = [];
		      				}
		      				courses[list[0]].push(list[1]);
		      			}
		      		}
		      		if(lines[i].includes("BEGIN:VEVENT")){
		      			read = true;
		      		}
		      	}
		      	console.log(courses);
		      	for(var course in courses){
		      		get = {
		      			"code": course.substring(0,6),
		      			"session": $session.value,
		      			"semester":	$semester.value      				
		      		};
		      		$.getJSON("http://localhost:8080/courses/", get, function(list){
		      			var data = list[0];
		      			if(!data){
		      				return;
		      			}
		      			console.log(data);
		      			var post = {
				            "code": data.code,
				            "session": data.session,
				            "semester": data.semester,
				            "name": data.name,
				            "description": data.description,
				            "user": user,
				            "lecture": {},
				            "tutorial": {},
				            "practical": {}
		      			}
			      		for(var i = 0; i < courses[course].length; i++){
			      			var section;
			      			if(courses[course][i].includes("LEC")){
			      				section = data.lectures;
				      			for(var j = 0; j < section.length; j++){
				      				if(courses[course][i].includes(section[j].section)){
				      					post.lecture = section[j];
				      				}
				      			}
			      			}else if(courses[course][i].includes("TUT")){
			      				section = data.tutorials;
				      			for(var j = 0; j < section.length; j++){
				      				if(courses[course][i].includes(section[j].section)){
				      					post.tutorial = section[j];
				      				}
				      			}
			      			}else if(courses[course][i].includes("PRA")){
			      				section = data.practicals;
				      			for(var j = 0; j < section.length; j++){
				      				if(courses[course][i].includes(section[j].section)){
				      					post.practical = section[j];
				      				}
				      			}
			      			}
			      		}
		      			if(post.lecture === {}){ //doesnt work?
		      				return;
		      			}
				        $.ajax({ //request to add course to timetable (refer to above ajax)
				        	url: "http://localhost:8080/timetable/",
				        	type: "POST",
				        	data: JSON.stringify(post),
				        	dataType: 'json',
				        	contentType: 'application/json',
				        	success: function(result){
				        		console.log(result);
				        	},
				        	error: function(err){
				        		console.log(err);
				        	}
				        });
		      		});
		      	}
        		var timetable = document.getElementById("timetable");
        		reload();
		    };
		    reader.readAsText(input.files[0]);
		}
	}
	
	$view.onclick = function(e){ //also to do
		
	}
	
	$generate.onclick = function(e){ //handler for the generate button
		var codes = [];
		var cc = document.getElementsByName('entry');
		for(var i = 0; i < cc.length; i++){
			codes.push(cc[i].innerHTML);
		}
		data = {
			codes: cart,
			session: $session.value,
			semester: $semester.value
		}
        $.ajax({ 
        	url: "http://localhost:8080/courses/generate", 
        	type: "POST", 
        	data: JSON.stringify(data), 
        	dataType: 'json', 
        	contentType: 'application/json', 
        	success: function(result){ //to do
        		console.log(result);
        		generated = {};
        		for(var i = 0; i < result.length; i++){
        			if(!generated[result[i].code]){
        				generated[result[i].code] = {};
        			}
        			generated[result[i].code][result[i].type] = {
        				section: result[i].section,
        				instructor: result[i].instructor,
        				timings: result[i].timings
        			}
        		}
        		for(var code in generated){
        			get = {
        				code: code,
        				session: $session.value,
        				semester: $semester.value
        			}
        			$.getJSON("http://localhost:8080/courses/", get, function(courses){
        				if(courses.length === 0){
        					return;
        				}
        				var course = courses[0];
		      			var post = {
					            "code": course.code,
					            "session": course.session,
					            "semester": course.semester,
					            "name": course.name,
					            "description": course.description,
					            "user": user,
					            "lecture": {},
					            "tutorial": {},
					            "practical": {}
			      		}
		      			for(var type in generated[course.code]){
		      				if(type === "LEC"){
		      					post.lecture = generated[course.code][type];
		      				}else if(type === "TUT"){
		      					post.tutorial = generated[course.code][type];
		      				}else if(type === "PRA"){
		      					post.practical = generated[course.code][type];
		      				}
		      			}
				        $.ajax({ //request to add course to timetable (refer to above ajax)
				        	url: "http://localhost:8080/timetable/",
				        	type: "POST",
				        	data: JSON.stringify(post),
				        	dataType: 'json',
				        	contentType: 'application/json',
				        	success: function(result){
				        		console.log(result);
				        	},
				        	error: function(err){
				        		console.log(err);
				        	}
				        });
        			});
        		}
		        var timetable = document.getElementById("timetable");
		        reload(); 
        	},
        	error: function(err){ //something went wrong
        		console.log(err);
        	}
        });
	}
	
	const courseHandler = function(e){ //handler for when a course is clicked from the table
		for(var i = 0, row; row = $table.rows[i]; i++) {
			for(var j = 0, col; col = row.cells[j]; j++) { //make all courses white
				col.style.backgroundColor = "white";
			}
		}
		e.target.style.backgroundColor = "grey"; //set the color for the chosen course
		var data = { //query data
				"code": e.target.innerHTML.substring(0, 8),
				"session": $session.value, //current session (value in the dropdown menu)
				"semester": $semester.value //current semester (same)
		}
		$.getJSON("http://localhost:8080/courses/", data, function(courses){ //get courses that match the data (but this is for a single course)
			console.log(courses); //uh
			var course = courses[0]; //only one course so courses only contains one course
			text = "<p>" + course.code + course.semester + "<br>"; //start building the course info to be displayed
			text += course.name + "<br><br></p>";
			text += course.description + "</div>";
			text += "<div><table name=\"lectures\">";
			for(var i = 0; i < course.lectures.length; i++){ //lecture radio buttons
				lecture = course.lectures[i];
				text += "<tr><td><input type=\"radio\" name=\"lecture\" value=\"" + i + "\"><label>LEC" + lecture.section + "</label></td><td><p>";
				for(var j = 0; j < lecture.timings.length; j++){
					timing = lecture.timings[j];
					text += timing[0] + " " + timing[1] + "-" + timing[2] + "<br>";
				}
				text += "</td></tr>";
			}
			for(var i = 0; i < course.tutorials.length; i++){ //tuts
				tutorial = course.tutorials[i];
				text += "<tr><td><input type=\"radio\" name=\"tutorial\" value=\"" + i + "\"><label>TUT" + tutorial.section + "</label></td><td><p>";
				for(var j = 0; j < tutorial.timings.length; j++){
					timing = tutorial.timings[j];
					text += timing[0] + " " + timing[1] + "-" + timing[2] + "<br>";
				}
				text += "</td></tr>";
			}
			for(var i = 0; i < course.practicals.length; i++){ //pras
				practical = course.practicals[i];
				text += "<tr><td><input type=\"radio\" name=\"practical\" value=\"" + i + "\"><label>PRA" + practical.section + "</label></td><td><p>";
				for(var j = 0; j < practical.timings.length; j++){
					timing = practical.timings[j];
					text += timing[0] + " " + timing[1] + "-" + timing[2] + "<br>";
				}
				text += "</td></tr>"; //end of course display
			}
			var exists = {
				"code": data.code,
				"session": data.session,
				"semester": data.semester,
				"user": user
			};
			$.getJSON("http://localhost:8080/timetable/exists", exists, function(result){ //returns if a course already exists in the timetable
				if(result){ //course exists in timetable
					text += "</table>";
					var found = false;
					for(var i = 0; i < cart.length; i++){
						if(cart[i] === course.code){
							text += "<input type=\"submit\" value=\"Remove from cart\" name=\"add-cart\">";
							found = true;
							break;
						}
					}
					if(!found){
						text += "<input type=\"submit\" value=\"Add to cart\" name=\"add-cart\">";
					}

					text += "<input type=\"submit\" value=\"Modify course\" name=\"enrol\">";
					text += "<input type=\"submit\" value=\"Unenrol in course\" name=\"unenrol\"></div>";
					$courseinfo.innerHTML = text;
					
					addCartBtn = document.querySelector('input[name=\'add-cart\']');
					if(addCartBtn){
						addCartBtn.onclick = function(){
							for(var i = 0; i < cart.length; i++){
								if(cart[i] === course.code){
									addCartBtn.value = "Add to cart";
									cart.splice(i, 1);
									var count = parseInt($cartcourses.innerHTML, 10) - 1
									$cartcourses.innerHTML = count;
									return;
								}
							}
							if(parseInt($cartcourses.innerHTML, 10) > 6){
								alert("Only 6 courses allowed in your cart.");
								return;
							}
							addCartBtn.value = "Remove from cart";
							cart.push(course.code);
							var count = parseInt($cartcourses.innerHTML, 10) + 1
							$cartcourses.innerHTML = count;
						};
					}
					
					unenrolBtn = document.querySelector('input[name=\'unenrol\']');
					if(unenrolBtn){ //button for unenrolling
						console.log(data);
						unenrolBtn.onclick = function(element){
					        $.ajax({ //request to delete the course from the timetable
					        	url: "http://localhost:8080/timetable/", //endpoint
					        	type: "DELETE", //method
					        	data: JSON.stringify(exists), //data (ajax = stringify else send just data)
					        	dataType: 'json', //type (you need this)
					        	contentType: 'application/json', //content type (also need this)
					        	success: function(result){ //when it works
					        		console.log(result);
					        		unenrolBtn.parentNode.removeChild(unenrolBtn); //remove unenrol button since you aren't enrolled anymore
					        		document.querySelector('input[name=\'enrol\']').value = "Enrol in course"; //make enrol button again
							        var timetable = document.getElementById("timetable");
							        reload(); //this just reloads the timetable (check reloadTimetable.js in scripts)
					        	},
					        	error: function(err){ //something went wrong
					        		console.log(err);
					        	}
					        });
						};
					}
				}else{ //course not in timetable
					text += "</table>";
					var found = false;
					for(var i = 0; i < cart.length; i++){
						if(cart[i] === course.code){
							text += "<input type=\"submit\" value=\"Remove from cart\" name=\"add-cart\">";
							found = true;
							break;
						}
					}
					if(!found){
						text += "<input type=\"submit\" value=\"Add to cart\" name=\"add-cart\">";
					}
					text += "<input type=\"submit\" value=\"Enrol in course\" name=\"enrol\"></div>"; //just enrol button
					$courseinfo.innerHTML = text; //places text into the html making the elements
					
					addCartBtn = document.querySelector('input[name=\'add-cart\']');
					if(addCartBtn){
						addCartBtn.onclick = function(){
							for(var i = 0; i < cart.length; i++){
								if(cart[i] === course.code){
									addCartBtn.value = "Add to cart";
									cart.splice(i, 1);
									var count = parseInt($cartcourses.innerHTML, 10) - 1
									$cartcourses.innerHTML = count;
									return;
								}
							}
							if(parseInt($cartcourses.innerHTML, 10) > 5){
								alert("Only 6 courses allowed in your cart.");
								return;
							}
							addCartBtn.value = "Remove from cart";
							cart.push(course.code);
							var count = parseInt($cartcourses.innerHTML, 10) + 1
							$cartcourses.innerHTML = count;
						};
					}
				}
				enrolBtn = document.querySelector('input[name=\'enrol\']');
				if(enrolBtn){ //adds script to enrol button
					enrolBtn.onclick = function(element){ //when i click this should happen
						var lecture = -1;
						document.querySelectorAll('input[name=\'lecture\']').forEach(function(radio){ //check which lecture was chosen
							if(radio.checked){
								lecture = radio.value;
								return;
							}
						});
						if(lecture === -1){ //no lecture chosen (mandatory)
							alert("Choose a lecture section.");
							return;
						}
						var tutorial = {}; //same but tutorial and not mandatory
						document.querySelectorAll('input[name=\'tutorial\']').forEach(function(radio){
							if(radio.checked){
								tutorial = course.tutorials[radio.value];
								return;
							}
						});
						var practical = {}; //pras
						document.querySelectorAll('input[name=\'practical\']').forEach(function(radio){
							if(radio.checked){
								practical = course.practicals[radio.value];
								return;
							}
						});
				        var newCourse = { //new course being enrolled in
				            "code": course.code,
				            "session": course.session,
				            "semester": course.semester,
				            "name": course.name,
				            "description": course.description,
				            "user": user,
				            "lecture": course.lectures[lecture],
				            "tutorial": tutorial,
				            "practical": practical
				        };
				        $.ajax({ //request to add course to timetable (refer to above ajax)
				        	url: "http://localhost:8080/timetable/",
				        	type: "POST",
				        	data: JSON.stringify(newCourse),
				        	dataType: 'json',
				        	contentType: 'application/json',
				        	success: function(result){
				        		if(enrolBtn.value === "Enrol in course"){
					        		enrolBtn.value = "Modify course";
					        		enrolBtn.insertAdjacentHTML("afterend", "<input type=\"submit\" value=\"Unenrol in course\" name=\"unenrol\">");
									unenrolBtn = document.querySelector('input[name=\'unenrol\']');
									if(unenrolBtn){ //literally the same as above (refer to above ajax)
										console.log(data);
										unenrolBtn.onclick = function(element){
									        $.ajax({
									        	url: "http://localhost:8080/timetable/",
									        	type: "DELETE",
									        	data: JSON.stringify(exists),
									        	dataType: 'json',
									        	contentType: 'application/json',
									        	success: function(result){
									        		console.log(result);
									        		unenrolBtn.parentNode.removeChild(unenrolBtn);
									        		enrolBtn.value = "Enrol in course";
											        var timetable = document.getElementById("timetable");
											        reload();
									        	},
									        	error: function(err){
									        		console.log(err);
									        	}
									        });
										};
									}
				        		}
				        		console.log(result);
						        var timetable = document.getElementById("timetable");
						        reload();
				        	},
				        	error: function(err){
				        		console.log(err);
				        	}
				        });
					}
				}
			});
		});
	}
	
	const typeHandler = function(e){ //handler for the searchbar
		if(e.target.value === ""){
			$table.innerHTML = "";
			return;
		}
		data = { //query from searchbar
				"code": e.target.value,
				"session": $session.value,
				"semester": $semester.value
		}
		$.getJSON("http://localhost:8080/courses/", data, function(courses){ //get request for all matching courses
			console.log(courses);
			text = "";
			for(var key in courses){ //make entries for all the matching courses
				course = courses[key];
				text += "<tr><td class=\"course\">" + course.code + course.semester + "</td></tr>";
			}
			$table.innerHTML = text;
			
			document.querySelectorAll('.course').forEach(function(element){
				element.addEventListener('click', courseHandler); //adding the handler for clicking a course to all the courses
			});
		});
	}
	
	$session.oninput = function(){ //i changed the session act like i changed the searchbar (makes results consistent)
		$searchbar.dispatchEvent(new Event('input'));
		$cartcourses.innerHTML = "0";
		$courseinfo.innerHTML = "";
		cart = [];
		addCartBtn = document.querySelector('input[name=\'add-cart\']');
		if(addCartBtn){
			addCartBtn.value = "Add to cart";
		}
		reload();
	}
	$semester.oninput = function(){ //same
		$searchbar.dispatchEvent(new Event('input'));
		$cartcourses.innerHTML = "0";
		$courseinfo.innerHTML = "";
		cart = [];
		addCartBtn = document.querySelector('input[name=\'add-cart\']');
		if(addCartBtn){
			addCartBtn.value = "Add to cart";
		}
		reload();
	}
	$searchbar.addEventListener('input', typeHandler); //searchbar getting its handler
	$searchbar.addEventListener('propertyChange', typeHandler); //same here
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
            loadFriends();
            loadBlocked();
            loadRequests();
    } else {
        $('#login').show(); // Here should load the right page on refresh
    }
    console.log("loaded");
    
    //logout button
    $("#side-logout").on('click', function() {
        logout();
    });

    // Submission Click button handlers
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
        console.log("Friend");
    });

    $("#side-map").on('click', function() {
        loadMap();
    });

    $("#side-settings").on('click', function() {
        loadAccount();
    });


    $('[data-toggle="tooltip"]').tooltip()

    
    // Search Button -> Friends
    $("#Search-button").on('click', function(){
        addFriend();
    });
});