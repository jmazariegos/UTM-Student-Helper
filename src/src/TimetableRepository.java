package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

public interface TimetableRepository extends MongoRepository<Timetable, String> {
	List<Timetable> findBySessionAndSemesterAndUserAllIgnoreCase(@Param("session") String session, @Param("semester") String semester, @Param("user") String user);
	List<Timetable> findByCodeAndSessionAndSemesterAndUserAllIgnoreCase(@Param("code") String code, @Param("session") String session, @Param("semester") String semester, @Param("user") String user);
}
