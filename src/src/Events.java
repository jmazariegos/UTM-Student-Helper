package src;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Events")
public class Events {
	@Id private ObjectId _id;
	
	private String eventName, description, startDate, startTime, endDate, endTime;
	
	public Events(){}
	
	public Events(ObjectId _id, String eventName, String description, String startDate, String startTime, String endDate, String endTime){
		this.set_id(_id);
		this.setEventName(eventName);
		this.setDescription(description);
		this.setStartDate(startDate);
		this.setStartTime(startTime);
		this.setEndDate(endDate);
		this.setEndTime(endTime);
	}
	
	public String get_id() {
		return _id.toHexString();
	}
	
	public void set_id(ObjectId _id) {
		this._id = _id;
	}
	
	public String getEventName() {
		return eventName;
	}
	public void setEventName(String eventName) {
		this.eventName = eventName;
	}
	
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	
	
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	
	
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	
	
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
}