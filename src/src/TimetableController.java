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
@RequestMapping("/timetable")
public class TimetableController {
	@Autowired
	private TimetableRepository timetableRepository;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Timetable> getTimetable(@RequestBody Map<String, String> body) {
		String session = body.get("session");
		String semester = body.get("semester");
		List<Timetable> timetable = timetableRepository.findBySessionAndSemesterAllIgnoreCase(session, semester);
		timetable.addAll(timetableRepository.findBySessionAndSemesterAllIgnoreCase(session, "Y"));
		return timetable;
	}
	
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Timetable createCourse(@Valid @RequestBody Timetable timetableCourse) {
	    timetableCourse.set_id(ObjectId.get());
	    timetableRepository.save(timetableCourse);
	    return timetableCourse;
	}
}