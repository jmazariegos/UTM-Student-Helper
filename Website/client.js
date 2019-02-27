
// For  the user to login
function login(){
	hideall();
	console.log("login");
	$("#navbar").show();
	$("#home").show();
	// $.ajax({ 
	// 	method: "GET", 
	// 	url: "/login/"
	// 	// data: { userid: $("#guessText").val(), userid: $("#guessText").val() }
	// }).done(function(data){
	// 	//alert(JSON.stringify(data))
	// 	//Check if login was success or failure
	// });
}

//for user logout
function logout(){
	hideall();
	$("#navbar").show();
	$("#login").show();
	console.log("logout");
}

//for user to register
function Register(){
	hideall();
	$("#navbar").show();
	$("#home").show();
	console.log("Reg");
}

// for loading registration page
function Registration(){
	hideall();
	$("#navbar").show();
	$("#reg").show();
	console.log("Reg page");
}

// for loading Forgot password page 
function Forgotpass(){
	hideall();
	$("#navbar").show();
	$("#login").show();
	console.log("Forgotten");
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
	console.log("hidden");
}

//MAKES A COOKIE! (YUM)
function setCookie(cvalue, cpage) {
  // var d = new Date();
  // d.setTime(d.getTime() + (exdays*24*60*60*1000));
  // var expires = "expires="+ d.toUTCString();
  document.cookie = "userid=" + cvalue + ";page=" + cpage + ";";
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

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	hideall();
	$("#login").show();
	// Here should load the right page on refresh


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



});
