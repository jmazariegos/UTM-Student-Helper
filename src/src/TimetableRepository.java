package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface TimetableRepository extends MongoRepository<Timetable, String> {
	List<Timetable> findBySessionAndSemesterAllIgnoreCase(@Param("session") String session, @Param("semester") String semester);
	List<Timetable> findByCodeAndSessionAndSemesterAllIgnoreCase(@Param("code") String code, @Param("session") String session, @Param("semester") String semester);
}
