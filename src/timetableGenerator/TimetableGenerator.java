package timetableGenerator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import src.Courses;

public class TimetableGenerator {

	private List<Map<String, Object>> lectures, tutorials, practicals;
	ArrayList<ArrayList<Map<String, Object>>> allLectures;
	ArrayList<ArrayList<Map<String, Object>>> allTutorials;
	ArrayList<ArrayList<Map<String, Object>>> allPracticals; // cross course
	private List<List<Map<String, Object>>> allTimes;
	private Courses [][] timetable;
	private int [][] timetableBool;
	private List<Courses [][]> workingTimetable;
	// fill entry with Map: course: type: code:?
	private List<String> courseCodeMappings;
	private Map<String, String> singleClass;
	private List <Map<String, Object>> finalList;
	
	public TimetableGenerator(List<Courses> courses) {
		// set the timings to the Map courses
		// start with lectures, then tutorials, then practicals
		
		this.allLectures = new ArrayList<>();
		this.allTutorials = new ArrayList<>();
		this.allPracticals = new ArrayList<>();
		
		for (Courses course: courses) {
			addToLists(course);
		}
		// add all to main list
		this.allTimes.addAll(this.allTutorials);
		this.allTimes.addAll(this.allPracticals);
		this.allTimes.addAll(this.allLectures);
		
	}
	
	private ArrayList<Object> extractTimings(Courses course){
		// add all lectures, then tutorial, then practicals
		return null;
	}
	
	private void addToLists(Courses course) {
		// get whether lecture, tutorial or practical
		this.allLectures.add(course.getLectures());
		this.allTutorials.add(course.getTutorials());
		this.allPracticals.add(course.getPracticals());
		// have parallel lists: index 0 is for this course, etc
		this.courseCodeMappings.add(course.getCode());
	}
	
	private boolean tryGenerateTimetable() {
		// use allTimes to fit things into timetable
		int numElements = this.courseCodeMappings.size();
		boolean[] fixed = new boolean [numElements];
		int [] indices = new int [numElements];
		int [] currentCombination = new int [numElements];
		int currentSet = numElements - 1;
		Courses [][] timetable = new Courses[14][5];
		List<List<Map<String, Object>>> currentSublist;
		Map<String, Object> currentElement;
		boolean allDone = false;
		Map<String, Object> result = null; 
		
		int last_unmatched = 0;
		// initialize all elements to false
		for (int i = 0; i < numElements; i ++) {
			fixed[i] = false;
			indices[i] = 0; // all start at index 1. 
		}
		while (allDone == false){
			// check combo, then increment. 
			if (checkCombo(currentCombination)) {
				// found a combination that works. generate timetable
				setOnly(currentCombination);
				return true;
			}
			// otherwise, increment
			currentCombination = increment(currentCombination);
			if (zeroSum(currentCombination)) {
				// no possible value, return false;
				return false;
			}
		}
		return false; // should never reach here
		
		
	}
	
	public boolean checkCombo(int [] cc) {
		// reset timetable
		this.timetableBool = new int [15][7];
		Map<String, Object> curElem;
		String [][] times;
		String day, start, end;
		for (int i = 0; i < 15; i ++) {
			for (int j = 0; j < 7; j ++) {
				this.timetableBool[i][j] = 0; 
			}
		}

		// need to check that the current combination fits into the timetable
		int ind = 0;
		for (int c : cc) {
			curElem = this.allTimes.get(ind).get(c);
			// try slot into timetable
			times = (String[][]) curElem.get("timings");
			for (String [] session : times) {
				// note: some have different formats
				day = session[0];
				start = session[1];
				end = session[2];

				if (insertIntoTable(day, start, end) == false) {
					return false;
				}
			}
		}
		return true;
	}
	
	public void setOnly(int [] cc) {
		// set lecs
		// set tuts
		// set practs
		String code; 
		Map <String, Object> chosen;
		this.finalList = new ArrayList <Map<String, Object>> ();
 		for (int i = 0; i < cc.length; i ++) {
			chosen = this.allTimes.get(i).get(cc[i]);
			chosen.put("code", this.courseCodeMappings.get(i));
			finalList.add(chosen);
		}	 
	}
	
	public List<Map<String, Object>> getTimetable(){
		return this.finalList;
	}
	
	public boolean insertIntoTable(String day, String start, String end) {
		if (day.isEmpty()) {
			return true;
		}
		int col, startRow, endRow;	
		String day2 = null, start2 = null, end2 = null;
		int loops = 1;
		if (day.contains("\n")) {
			loops = 2;
			// there will be two. Do twice
			day = day.split("\n")[0];
			start = start.split("\n")[0];
			end = end.split("\n")[0];
			day2 = day.split("\n")[1];
			start2 = start.split("\n")[1];
			end2 = end.split("\n")[1];
		}
		col = getTimetableColumn(day);
		startRow = getTimetableRow(start);
		endRow = getTimetableRow(end);
		while (loops > 0) {
			// now can try insert into table
			for (int row = startRow; row < endRow; row ++) {
				// check if free:
				if (this.timetableBool[row][col] == 1) {
					return false;
				}
				// otherwise set to 1
				this.timetableBool[row][col] = 1;
			}
			if (loops == 2) {
				// set col start and end again 
				col = getTimetableColumn(day2);
				startRow = getTimetableRow(start2);
				endRow = getTimetableRow(end2);
			}
			loops --;
			
		}
		return true;
	}
	
	public int getTimetableRow(String start) {
		List<String> list = new ArrayList<String> ();
		list.add("08:00");
		list.add("09:00");
		list.add("10:00");
		list.add("11:00");
		list.add("12:00");
		list.add("13:00");
		list.add("14:00");
		list.add("15:00");
		list.add("16:00");
		list.add("17:00");
		list.add("18:00");
		list.add("19:00");
		list.add("20:00");
		list.add("21:00");
		list.add("22:00");
		return list.indexOf(start);
	}
	
	public int getTimetableColumn(String day) {
		List<String> list = new ArrayList<String> ();
		list.add("MO");
		list.add("TU");
		list.add("WE");
		list.add("TH");
		list.add("FR");
		list.add("SA");
		list.add("SU");

		return list.indexOf(day);
	}
	public int [] increment(int [] cc) {
		int ind = cc.length - 1;
		while (ind >= 0){
			
			if (cc[ind] == this.allTimes.get(ind).size()) {
				cc[ind] = 0;
				ind --;
			}
			else {
				cc[ind] = cc[ind] + 1;
				return cc;
			}
		}
		return cc;
	}
	
	public boolean zeroSum(int [] cc) {
		for (int c : cc) {
			if (c != 0) {
				return false;
			}
		}
		return true;
	}
	// borrowed from https://stackoverflow.com/questions/8260881/what-is-the-most-elegant-way-to-check-if-all-values-in-a-boolean-array-are-true
	public static boolean areAllTrue(boolean[] array)
	{
	    for(boolean b : array) if(!b) return false;
	    return true;
	}
	
	public static void main(String[] args) {
		/* NOTE: getting only 1 semester's worth of courses (maybe manually check): getting at most 6 to 7 entries 
		 * EG. CSC309H5F, all codes should have H5F and /Y5X
		 * The times are type Object: but it will be under Map, try convert to ArrayList
		 */
		
	}
}
