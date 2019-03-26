package src;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/courses")
public class CoursesController {
	@Autowired
	private CoursesRepository coursesRepository;

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Courses> getCourses(@RequestParam("code") String code, 
									@RequestParam("session") String session,
									@RequestParam("semester") String semester) {
		List<Courses> courses = coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, semester);
		courses.addAll(coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, "Y"));
		return courses;
	}
	
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Courses createCourse(@Valid @RequestBody Courses course) {
	    course.set_id(ObjectId.get());
	    coursesRepository.save(course);
	    return course;
	}
}
