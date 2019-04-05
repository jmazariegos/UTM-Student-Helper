package src;

import java.util.ArrayList;
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

import timetableGenerator.TimetableGenerator;

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
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/generate", method = RequestMethod.POST)
	public /*List<Map<String, Object>>*/ Object generateTimetable(@RequestBody Map<String, Object> body) {
		@SuppressWarnings("unchecked")
		ArrayList<String> codes = (ArrayList<String>) body.get("codes");
		String session = (String) body.get("session");
		String semester = (String) body.get("semester");
		List<Courses> cart = null;
		for(String code: codes) {
			if(cart != null) {
				Courses course = coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, semester).get(0);
				if(course == null) {
					course = coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, "Y").get(0);
				}
				cart.add(course);
			}else {
				cart = coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, semester);
				if(cart.isEmpty()) {
					cart = coursesRepository.findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(code, session, "Y");
				}
			}
		}
		
		TimetableGenerator generator = new TimetableGenerator(cart);
		generator.tryGenerateTimetable();
		return generator.getTimetable();
	}
	
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Courses createCourse(@Valid @RequestBody Courses course) {
	    course.set_id(ObjectId.get());
	    coursesRepository.save(course);
	    return course;
	}
}
