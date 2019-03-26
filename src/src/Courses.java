package src;

import java.util.ArrayList;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Courses")
public class Courses {

	@Id private ObjectId _id;

	private String code, session, semester, name, description;
	private ArrayList<Map<String, Object>> lectures, practicals, tutorials;
	
	public Courses() {}
	
	public Courses(ObjectId _id, String code, String session, String semester, String name, String description, 
			ArrayList<Map<String, Object>> lectures, ArrayList<Map<String, Object>> practicals, ArrayList<Map<String, Object>> tutorials) {
		this.set_id(_id);
		this.setCode(code);
		this.setSession(session);
		this.setSemester(semester);
		this.setName(name);
		this.setDescription(description);
		this.setLectures(lectures);
		this.setTutorials(tutorials);
		this.setPracticals(practicals);
	}
	
	public String get_id() {
		return _id.toHexString();
	}
	
	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getSession() {
		return session;
	}

	public void setSession(String session) {
		this.session = session;
	}

	public String getSemester() {
		return semester;
	}

	public void setSemester(String semester) {
		this.semester = semester;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ArrayList<Map<String, Object>> getLectures() {
		return lectures;
	}

	public void setLectures(ArrayList<Map<String, Object>> lectures) {
		this.lectures = lectures;
	}

	public ArrayList<Map<String, Object>> getPracticals() {
		return practicals;
	}

	public void setPracticals(ArrayList<Map<String, Object>> practicals) {
		this.practicals = practicals;
	}

	public ArrayList<Map<String, Object>> getTutorials() {
		return tutorials;
	}

	public void setTutorials(ArrayList<Map<String, Object>> tutorials) {
		this.tutorials = tutorials;
	}

}