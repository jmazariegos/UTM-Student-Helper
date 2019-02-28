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


// For  the user to login
function login(){
	hideall();
	var id = $("#luserid").val();
	var p1 = $("#lpass1").val();
	// Login

	//Parse Input

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

 //  	var pullResults = '';
 //  	lambda.invoke(params, function(error, data) {
 //  		if (error) {
 //    		prompt(error);
 //  		} else {
 //    		pullResults = JSON.parse(Data.Payload);
 //  		}
	// });
	// console.log(pullResults);

	var page="#home";
	setCookie('page', page, 360);
	$(page).show();
	$("#navbar").show();

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
	var email = $("#guessText").val();

	console.log(id +"<- id "+p1);


	//Create account





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

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	hideall();
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

	$("#resetButton").on('click',function(){
		Reset();	
	});
});
