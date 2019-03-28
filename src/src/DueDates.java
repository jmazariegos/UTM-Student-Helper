package src;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "DueDates")
public class DueDates {
	@Id private ObjectId _id;
	
	private String assignmentName, courseCode, description, dueDate, dueTime;
	
	public DueDates(){}
	//String assignmentName, String courseCode,String description, String dueDate, String dueTime
	public DueDates(ObjectId _id, String assignmentName, String courseCode, String description, String dueDate, String dueTime){
		this.set_id(_id);
		this.setAssignmentName(assignmentName);
		this.setDescription(courseCode);
		this.setDescription(description);
		this.setDescription(dueDate);
		this.setDescription(dueTime);
	}
	
	public String get_id() {
		return _id.toHexString();
	}
	
	public void set_id(ObjectId _id) {
		this._id = _id;
	}
	
	public String getAssignmentName() {
		return assignmentName;
	}
	public void setAssignmentName(String assignmentName) {
		this.assignmentName = assignmentName;
	}
	
	public String getCourseCode() {
		return courseCode;
	}
	public void setCourseCode(String courseCode) {
		this.courseCode = courseCode;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public String getDueDate() {
		return dueDate;
	}
	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}
	
	
	public String getDueTime() {
		return dueTime;
	}
	public void setDueTime(String dueTime) {
		this.dueTime = dueTime;
	}

	
}