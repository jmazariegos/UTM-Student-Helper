package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface EventsRepository extends MongoRepository<Events, String> {
	List<Events> findByEventNameAndDescriptionAndStartDateAndStartTimeAndEndDateAndEndTimeAllIgnoreCase(@Param("eventName") String eventName, @Param("description") String description, @Param("startDate") String startDate, @Param("startTime") String startTime, @Param("endDate") String endDate, @Param("endTime") String endTime);
	List<Events> findAll();
	//eventName, description, startDate, startTime, endDate, endTime
} 
