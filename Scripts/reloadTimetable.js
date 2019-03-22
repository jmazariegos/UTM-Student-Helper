var timetable = document.getElementById("timetable");

function clean(){
	for(var row = 1; row < 6; row++){
		for(var col = 1; col < 16; col++){
			var timeslot = timetable.rows[row].cells[col];
			timeslot.innerHTML = "";
		}
	}
}

function reload(){
	var dtc = {"MO":1, "TU":2, "WE":3, "TH":4, "FR":5};
	var ttr = {"09:00":2, "10:00":3, "11:00":4, "12:00":5, "13:00":6, "14:00":7, "15:00":8, "16:00":9, "17:00":10, "18:00":11, "19:00":12, "20:00":13, "21:00":14, "22:00":15};
	data = {
		"session": document.querySelector('select[name=\'session\']').value,
		"semester": document.querySelector('select[name=\'semester\']').value
	}
	$.getJSON("http://localhost:8080/timetable/", data, function(courses){ //get request for enrolled courses
		console.log(courses);
		for(var c = 0; c < courses.length; c++){
			var course = courses[c];
			var lecture = course.lecture;
			var tutorial = course.tutorial;
			var practical = course.practical;
			
			var timings = lecture.timings;
			for(var i = 0; i < timings.length; i++){
				for(var j = ttr[timings[i][1]]; j < ttr[timings[i][2]]; j++){
					var timeslot = timetable.rows[j].cells[dtc[timings[i][0]]];
					var new_node = "<div class=\"class\">" + course.code + course.semester + "<br><br>LEC" + lecture.section + "</div>";
					timeslot.insertAdjacentHTML('beforeend', new_node);
				}
			}
			
			timings = tutorial.timings;
			if(timings){
				for(var i = 0; i < timings.length; i++){
					for(var j = ttr[timings[i][1]]; j < ttr[timings[i][2]]; j++){
						var timeslot = timetable.rows[j].cells[dtc[timings[i][0]]];
						var new_node = "<div class=\"class\">" + course.code + course.semester + "<br><br>TUT" + tutorial.section + "</div>";
						timeslot.insertAdjacentHTML('beforeend', new_node);
					}
				}
			}
			
			timings = practical.timings;
			if(timings){
				for(var i = 0; i < timings.length; i++){
					for(var j = ttr[timings[i][1]]; j < ttr[timings[i][2]]; j++){
						var timeslot = timetable.rows[j].cells[dtc[timings[i][0]]];
						var new_node = "<div class=\"class\">" + course.code + course.semester + "<br><br>PRA" + practical.section + "</div>";
						timeslot.insertAdjacentHTML('beforeend', new_node);
					}
				}
			}
		}
	});
}