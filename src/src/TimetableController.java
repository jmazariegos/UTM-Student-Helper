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
@RequestMapping("/timetable")
public class TimetableController {
	@Autowired
	private TimetableRepository timetableRepository;

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Timetable> getTimetable(@RequestParam("session") String session,
										@RequestParam("semester") String semester) {
		List<Timetable> timetable = timetableRepository.findBySessionAndSemesterAllIgnoreCase(session, semester);
		timetable.addAll(timetableRepository.findBySessionAndSemesterAllIgnoreCase(session, "Y"));
		return timetable;
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Timetable createCourse(@Valid @RequestBody Timetable timetableCourse) {
		List<Timetable> timetable = timetableRepository.findByCodeAndSessionAndSemesterAllIgnoreCase(
				timetableCourse.getCode(), 
				timetableCourse.getSession(), 
				timetableCourse.getSemester());
		if(timetable.size() == 1) {
			Timetable updatedTimetable = timetable.get(0);
			updatedTimetable.setCode(timetableCourse.getCode());
			updatedTimetable.setSession(timetableCourse.getSession());
			updatedTimetable.setSemester(timetableCourse.getSemester());
			updatedTimetable.setName(timetableCourse.getName());
			updatedTimetable.setDescription(timetableCourse.getDescription());
			updatedTimetable.setLecture(timetableCourse.getLecture());
			updatedTimetable.setTutorial(timetableCourse.getTutorial());
			updatedTimetable.setPractical(timetableCourse.getPractical());
			timetableRepository.save(updatedTimetable);
			return updatedTimetable;
		}
		timetableCourse.set_id(ObjectId.get());
	    timetableRepository.save(timetableCourse);
	    return timetableCourse;
	}
}