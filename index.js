$(document).ready(function(){

  var config = {
    apiKey: "AIzaSyDUEOUoV-kbaF5NS_FnMo8ux8aA4FCHLqs",
    authDomain: "trainschedule-3c8a0.firebaseapp.com",
    databaseURL: "https://trainschedule-3c8a0.firebaseio.com",
    projectId: "trainschedule-3c8a0",
    storageBucket: "trainschedule-3c8a0.appspot.com",
    messagingSenderId: "1034202775971"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var currentTime = moment();
console.log("Current Time: " + currentTime);


$("#submit").on("click", function() {


	var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();


	database.ref().push({
		name: name,
		dest: dest,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	
	$("input").val('');
    return false;
});


database.ref().on("child_added", function(childSnapshot){
	 console.log(childSnapshot.val());
	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + dest);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);
	console.log(moment().format("HH:mm"));


	var freq = parseInt(freq);
	
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment().format('HH:mm'));
	
	var dConverted = moment(time,'hh:mm').subtract(1, 'years');
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	
	var tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
	


$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

 database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
      
     $("#nameDisplay").html(snapshot.val().name);
     $("#destDisplay").html(snapshot.val().dest);
     $("#timeDisplay").html(snapshot.val().time);
     $("#freqDisplay").html(snapshot.val().freq);
 })

});
