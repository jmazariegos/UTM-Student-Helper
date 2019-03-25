//Connect to AWS
AWS.config.region = 'ca-central-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ca-central-1:fe5ab82b-d242-4947-b6e8-7dcc7090c45f',
});

//MAKES COOKIES! (YUM) --------------------------------------------------
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";

  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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


// For  the user to login
function login(){
	hideall();
	var id = $("#lemail").val();
	var p1 = $("#lpass").val();
	console.log(id,p1);
	// Login

	// Parse the input

	var lambda = new AWS.Lambda({region: 'ca-central-1', apiVersion: '2018-02-25'});
	var params = {
    	FunctionName: "OurUTMUserAccounts", 
    	InvocationType: "RequestResponse", 
    	LogType: "None",
    	Payload: JSON.stringify({
    		"function": "login",
    		"parameters":{
    			"email":id,
    			"password":p1,
    		}
    	}), 
  	};

  	var pullResults;
  	let page="#login";
  	
  	lambda.invoke(params, function(error, data) {
  		if (error) {
    		prompt("error"+error);
  		} else {
    		pullResults = JSON.parse(data.Payload);
    		console.log(pullResults);
    		if(pullResults['msg']==="login: successful"){
    			hideall();
    			page="#home";
    			console.log("in if-> "+page);	
    			$(page).show();


    		}
  		}
  		setCookie('page', page, 360);
  		$(page).show();
		console.log("after if-> "+page);	
		$("#navbar").show();
  		
	});
	
	

}

//for user logout --------------------------------------------------
function logout(){
	hideall();
	$("#navbar").show();
	var page="#login";
	setCookie('page', page, 360);
	$(page).show();
	setCookie('user', "", 360);
}

//for user to  --------------------------------------------------
function Register(){
	var id = $("#ruserid").val();
	var p1 = $("#rpass1").val();
	var p2 = $("#rpass2").val();
	var email = $("#remail").val();
	console.log(id +"<- id "+p1);
	if (p1.length < 8){ // Set to regex
		// Set error
		return;
	}else if (!(p1 === p2)){
		// Set error
		return;
	}
	// Check if userid + email is valid


	//Parse Input
	var lambda = new AWS.Lambda({region: 'ca-central-1', apiVersion: '2018-02-25'});
	var params = {
    	FunctionName: "OurUTMUserAccounts", 
    	InvocationType: "RequestResponse", 
    	LogType: "None",
    	Payload: JSON.stringify({
    		"function": "createUser",
    		"parameters":{
    			"username":id,
    			"password":p1,
    			"email":email,
    		}
    	}), 
  	};

  	var pullResults;

  	lambda.invoke(params, function(error, data) {
  		if (error) {
    		prompt("error: "+error);
    		return;
  		} else {
    		pullResults = JSON.parse(data.Payload);
    		console.log("okay: "+pullResults);
  		}
	});

	hideall();
	var	page="#login";
	setCookie('page', page, 360);
	$("#navbar").show();
	$(page).show();
	console.log("Reg");

}

// for loading registration page--------------------------------------------------
function Registration(){
	hideall();
	var	page="#reg";
	setCookie('page', page, 360);
	$("#navbar").show();
	$(page).show();
}

// for loading Forgot password page --------------------------------------------------
function Forgotpass(){
	hideall();
	var	page="#reset";
	setCookie('page', page, 360);
	$("#navbar").show();
	$(page).show();
	console.log("Forgotten");
}
function Reset(){
	//Reset Password
	var email = $("#resemail").val();

	//Parse Input
	var lambda = new AWS.Lambda({region: 'ca-central-1', apiVersion: '2018-02-25'});
	var params = {
    	FunctionName: "OurUTMUserAccounts", 
    	InvocationType: "RequestResponse", 
    	LogType: "None",
    	Payload: JSON.stringify({
    		"function": "resetPassword",
    		"parameters":{
    			"email":email,
    		}
    	}), 
  	};

  	var pullResults;

  	lambda.invoke(params, function(error, data) {
  		if (error) {
    		prompt("error: "+error);
    		return;
  		} else {
    		pullResults = JSON.parse(data.Payload);
    		console.log("okay: "+pullResults);
  		}
	});

	hideall();
	var	page="#login";
	setCookie('page', page, 360);
	$("#navbar").show();
	$(page).show();

	console.log("Forgotten -> fixed");
}

function hideall(){
	$("#login").hide();
	$("#reg").hide();
	$("#reset").hide();
	$("#home").hide();
	$("#map").hide();
	$("#account").hide();
	$("#note").hide();
	$("#navbar").hide();

}


// --------------------------------------------------------------------Functions for map
// Loads a specific building
function loadBuilding(building) {
    // Building is the building name
    var url = "./Website/TempFolder/Buildings.json";
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
    pic.src =PATH+"/parking-map.PNG"; // This to be changed to proper image


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
                    pic.src =PATH+"/map_"+building+"_floor"+id+".PNG";
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
                var cell = row.getElementsByTagName("td")[0];
                var id = cell.val;
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
	$("#map").show();
	$("#navbar").show();
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



// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	hideall();
	$.getJSON(PATH + '/Buildings.json', function(data) {
        buildingsJSON = data;
        // loadMain();
    });
	var page = getCookie("page");
	console.log(page);
	if (page == ""){
		page = '#login';
		setCookie('page', page, 360);
		setCookie('user', "", 360);
	}
	$(page).show(); // Here should load the right page on refresh

	console.log("loaded");
	$("#logout").on('click',function(){
			logout();
	});
	$("#loginButton").on('click',function(){
			login();
	});

	$("#Reglink").on('click',function(){
			Registration();
	});

	$("#regButton").on('click',function(){
			Register();
	});

	$("#Forgot").on('click',function(){
			Forgotpass();
	});

	$("#resetButton").on('click',function(){				<div id='logout'  class="nav-link">Logout</div>

		Reset();	
	});
	$("#side-map").on('click',function(){
		hideall();
		loadMain();	
	});

	
});
