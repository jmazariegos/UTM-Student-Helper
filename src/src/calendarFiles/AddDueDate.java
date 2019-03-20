package src.calendarFiles;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class AddDueDate {
	
	public AddDueDate(String assignmentName, String courseCode,String description, String dueDate, String dueTime) throws FileNotFoundException, IOException, ParseException{
			
			JSONObject event = new JSONObject(); 
		
			event.put("assignmentName", assignmentName);
			
			event.put("courseCode:", courseCode);
	
			event.put("description", description);
			
			event.put("dueDate",dueDate);
			
			event.put("dueTime", dueTime);
	
			addToDatabase(event ,"/data/eventsDB.json");	
			
			/*{
			    "code": "CSC301",
			    "assignmentName": "A1",
			    "description": "",
			    "dueDate": "YYYYMMDD",
			    "dueTime": "HHMM"
			}*/
						
			
		}
		
		public void addToDatabase(JSONObject jo, String fileName) throws FileNotFoundException, IOException, ParseException{
			String text = new File(System.getProperty("user.dir")).getParentFile().getParentFile().toString();
			String path = text + fileName;
			JSONParser parser = new JSONParser();
			JSONObject db = (JSONObject) parser.parse(new FileReader(path));
			
			JSONArray events = (JSONArray) db.get("events");
			JSONArray dueDates = (JSONArray) db.get("dueDates");
			
			JSONObject db2 =  new JSONObject();
			
			dueDates.add(jo);
			
			db2.put("events", events);
			db2.put("dueDates", dueDates);
			
			
			PrintWriter pw = new PrintWriter(path); 
	        pw.write(db2.toJSONString()); 
	          
	        pw.flush(); 
	        pw.close(); 
			
		}
		
		public static void main(String[] args) throws FileNotFoundException, IOException, ParseException
		{
			System.out.println("no");
			AddDueDate ae = new AddDueDate("Assignment2","CSC301","Meeting about 301", "20190308", "1900");
			//TODO this only runs once, make this a method and allow custom events to be made
		}
}
