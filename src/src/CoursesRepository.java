package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface CoursesRepository extends MongoRepository<Courses, String> {
	List<Courses> findByCodeStartingWithAndSessionAndSemesterAllIgnoreCase(@Param("code") String code, @Param("session") String session, @Param("semester") String semester);
}
