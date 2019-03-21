package src;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
public class CoursesController {
	@Autowired
	private CoursesRepository coursesRepository;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Courses> getCourses(@RequestBody Map<String, String> body) {
		String code = body.get("code");
		String session = body.get("session");
		String semester = body.get("semester");
		return coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, semester);
	}
	
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Courses createCourse(@Valid @RequestBody Courses course) {
	    course.set_id(ObjectId.get());
	    coursesRepository.save(course);
	    return course;
	}
}
