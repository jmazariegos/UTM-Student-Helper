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
@RequestMapping("/duedates")
public class DueDatesController {
	@Autowired
	private DueDatesRepository dueDatesRepository;
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.DELETE)
	public DueDates deleteDueDate(@RequestBody Map<String, String> body) {
		//String eventName, description, startDate, startTime, endDate, endTime;
		String assignmentName = body.get("assignementName");
		String courseCode = body.get("courseCode");
		String description = body.get("description");
		String dueDate = body.get("dueDate");
		String dueTime = body.get("dueTime");

		List<DueDates> dueDates = dueDatesRepository.findByAssignmentNameAndCourseCodeAndDescriptionAndDueDateAndDueTimeAllIgnoreCase(assignmentName, courseCode ,description, dueDate, dueTime);
		if(dueDates.size() > 0) {
			DueDates dueDateE = dueDates.get(0);
			dueDatesRepository.deleteById(dueDateE.get_id());
			return dueDateE;
		}
		return null;
	}
	//000
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public List<DueDates> getDueDates() {
		List<DueDates> dueDates = dueDatesRepository.findAll();
		return dueDates;
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/", method = RequestMethod.POST)
	public DueDates createDueDate(@Valid @RequestBody DueDates dueDateE) {
		List<DueDates> dueDates = dueDatesRepository.findByAssignmentNameAndCourseCodeAndDescriptionAndDueDateAndDueTimeAllIgnoreCase(dueDateE.getAssignmentName(), dueDateE.getCourseCode() , dueDateE.getDescription(), dueDateE.getDueDate(), dueDateE.getDueTime());

		if(dueDates.size() == 1) {
			DueDates updatedDueDates = dueDates.get(0);
			updatedDueDates.setAssignmentName(dueDateE.getAssignmentName());
			updatedDueDates.setCourseCode(dueDateE.getCourseCode());
			updatedDueDates.setDescription(dueDateE.getDescription());
			updatedDueDates.setDueDate(dueDateE.getDueDate());
			updatedDueDates.setDueTime(dueDateE.getDueTime());
			dueDatesRepository.save(updatedDueDates);
			return updatedDueDates;
		}
		dueDateE.set_id(ObjectId.get());
	    dueDatesRepository.save(dueDateE);
	    return dueDateE;
	}
	
}