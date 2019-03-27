package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface DueDatesRepository extends MongoRepository<DueDates, String> {
	List<DueDates> findByAssignmentNameAndCourseCodeAndDescriptionAndDueDateAndDueTimeAllIgnoreCase(@Param("assignmentName") String assignmentName, @Param("courseCode") String courseCode , @Param("description") String description, @Param("dueDate") String dueDate, @Param("dueTime") String dueTime);
	List<DueDates> findAll();
	//eventName, description, startDate, startTime, endDate, endTime
} 
