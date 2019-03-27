// connect to AWS
var AWS = require('aws-sdk');
AWS.config.region = 'ca-central-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ca-central-1:fe5ab82b-d242-4947-b6e8-7dcc7090c45f',
});

var user = 'anthony';

// def getUserId(username)
// def createUser(username, password, email)
// def resetPassword(email)
// def retrieveUsername(email)
// def login(email, password)
// def changePassword(email, old_password, new_password)

// def getFriends(username) * 
// def addFriend(usernameFrom, usernameTo)
// def removeFriend(usernameFrom, usernameTo)
// def acceptFriendRequest(usernameFrom, usernameTo)
// def declineFriendRequest(usernameFrom, usernameTo)
// def getFriendRequests(username) *
// def getBlockedUsers(username) () *
// def blockUser(usernameFrom, usernameTo) # note: FROM is always the account which is logged in 
// def unblockUser(usernameFrom, usernameTo)

function loadFriends() {
    // Gets user friends
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });

    //Clear old Table
    var table = document.getElementById("friend-list	");
    while (table.rows.length>0){
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
            for(var i =0; i<f.length; i++){
            	var row = table.insertRow(0);
            	var cell = row.insertCell(0);
            	cell.innerHTML = f[0];
            	cell.val = f[0];
            }
        }
    });
}


function loadBlocked(){
    // Gets user friends
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });

    //Clear old Table
    var table = document.getElementById("blocked-list	");
    while (table.rows.length>0){
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
            for(var i =0; i<f.length; i++){
            	var row = table.insertRow(0);
            	var cell = row.insertCell(0);
            	cell.innerHTML = f[0];
            	cell.val = f[0];
            }
        }
    });
}
function loadRequests(){
    // Gets user friends
    var lambda = new AWS.Lambda({
        region: 'ca-central-1',
        apiVersion: '2018-02-25'
    });

    //Clear old Table
    var table = document.getElementById("pending-list");
    while (table.rows.length>0){
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
            for(var i =0; i<f.length; i++){
            	var row = table.insertRow(0);
            	var cell = row.insertCell(0);
            	cell.innerHTML = f[0];
            	cell.val = f[0];
            }
        }
    });
}

