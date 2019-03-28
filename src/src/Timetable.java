package src;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TimetableCourses")
public class Timetable {

	@Id private ObjectId _id;

	private String code, session, semester, name, description, user;
	private Map<String, Object> lecture, practical, tutorial;
	
	public Timetable() {}
	
	public Timetable(ObjectId _id, String code, String session, String semester, String name, String description, String user,
			Map<String, Object> lecture, Map<String, Object> practical, Map<String, Object> tutorial) {
		this.set_id(_id);
		this.setCode(code);
		this.setSession(session);
		this.setSemester(semester);
		this.setName(name);
		this.setDescription(description);
		this.setUser(user);
		this.setLecture(lecture);
		this.setTutorial(tutorial);
		this.setPractical(practical);
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

	public Map<String, Object> getLecture() {
		return lecture;
	}

	public void setLecture(Map<String, Object> lecture) {
		this.lecture = lecture;
	}

	public Map<String, Object> getPractical() {
		return practical;
	}

	public void setPractical(Map<String, Object> practical) {
		this.practical = practical;
	}

	public Map<String, Object> getTutorial() {
		return tutorial;
	}

	public void setTutorial(Map<String, Object> tutorial) {
		this.tutorial = tutorial;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

}