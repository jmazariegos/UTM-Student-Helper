package src;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

//this is literally it, doesnt even need the functions if you dont need them
public interface PersonRepository extends MongoRepository<Person, String> {

	//the function for finding stuff refer to person controller comments pwease
	//P.S. does not require anything more than this, believe in the function and it will believe in you
	List<Person> findByLastNameIgnoreCase(@Param("name") String name);

}