
// For  the user to login
function login(){
	$.ajax({ 
		method: "GET", 
		url: "/login/"
		data: { userid: $("#guessText").val(), userid: $("#guessText").val() }
	}).done(function(data){
		//alert(JSON.stringify(data))
		//Check if login was success or failure
	});
}

// This is executed when the document is ready (the DOM for this document is loaded)
$(function(){
	// Setup all events here and display the appropriate UI
	$("#loginButton").on('click',function(){
	});
});
