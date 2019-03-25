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
	//000
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<Events> getEvents() {
		List<Events> events = eventsRepository.findAll();
		return events;
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public Events createEvent(@Valid @RequestBody Events event) {
		List<Events> events = eventsRepository.findByEventNameAndDescriptionAndStartDateAndStartTimeAndEndDateAndEndTimeAllIgnoreCase(
				event.getEventName(), event.getDescription(), event.getStartDate(), event.getStartTime(), event.getEndDate(), event.getEndTime());
		if(events.size() == 1) {
			Events updatedEvents = events.get(0);
			updatedEvents.setEventName(event.getEventName());
			updatedEvents.setDescription(event.getDescription());
			updatedEvents.setStartDate(event.getStartDate());
			updatedEvents.setStartDate(event.getStartTime());
			updatedEvents.setStartDate(event.getEndDate());
			updatedEvents.setStartDate(event.getEndTime());
			eventsRepository.save(updatedEvents);
			return updatedEvents;
		}
		event.set_id(ObjectId.get());
	    eventsRepository.save(event);
	    return event;
	}
	
}