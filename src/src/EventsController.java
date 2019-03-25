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
@RequestMapping("/events")
public class EventsController {
	@Autowired
	private EventsRepository eventsRepository;
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.DELETE)
	public Events deleteEvent(@RequestBody Map<String, String> body) {
		//String eventName, description, startDate, startTime, endDate, endTime;
		String eventName = body.get("eventName");
		String description = body.get("description");
		String startDate = body.get("startDate");
		String startTime = body.get("startTime");
		String endDate = body.get("endDate");
		String endTime = body.get("endTime");

		List<Events> events = eventsRepository.findByEventNameAndDescriptionAndStartDateAndStartTimeAndEndDateAndEndTimeAllIgnoreCase(eventName, description, startDate, startTime, endDate, endTime);
		if(events.size() > 0) {
			Events event = events.get(0);
			eventsRepository.deleteById(event.get_id());
			return event;
		}
		return null;
	}
	/*
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Events> getEvents(@RequestParam("session") String session,
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
	*/
}