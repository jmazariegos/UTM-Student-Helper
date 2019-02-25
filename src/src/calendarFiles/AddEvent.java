package src.calendarFiles;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;

//import org.json.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.*;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;

public class AddEvent {
	
	public AddEvent(String eventName, String description, String startDate, String startTime, String endDate, String endTime) throws FileNotFoundException, IOException, ParseException{
		
		
		
		JSONObject event = new JSONObject(); 
	
		event.put("eventName", eventName);

		event.put("description", description);
		
		event.put("startDate", startDate);
		
		event.put("startTime", startTime);
		
		event.put("endDate", endDate);
		
		event.put("endTime", endTime);

		addToDatabase(event ,"data/eventsDB.json");	
		
		/*{
		    "eventName": "A1",
		    "description": "",
		    "startDate": "YYYYMMDD",
		    "startTime": "HHMM",
		    "endDate": "YYYYMMDD",
		    "endTime": "HHMM"
		}*/
		
		
	}
	
	public void addToDatabase(JSONObject jo, String fileName) throws FileNotFoundException, IOException, ParseException{
		JSONParser parser = new JSONParser();
		JSONObject db = (JSONObject) parser.parse(new FileReader(fileName));
		
		JSONArray events = (JSONArray) db.get("events");
		JSONArray dueDates = (JSONArray) db.get("dueDates");
		
		JSONObject db2 =  new JSONObject();
		
		events.add(jo);
		
		db2.put("events", events);
		db2.put("dueDates", dueDates);
		
		
		PrintWriter pw = new PrintWriter(fileName); 
        pw.write(db2.toJSONString()); 
          
        pw.flush(); 
        pw.close(); 
		
	}
	
	public static void main(String[] args) throws FileNotFoundException, IOException, ParseException
	{
		System.out.println("no");
		AddEvent ae = new AddEvent("Csc301 Meeting","Meeting about 301", "20190212", "1900","20190212", "2359");
	}
}