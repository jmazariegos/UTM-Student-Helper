package src;

import javax.validation.Valid;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/people")
public class PersonController {
  @Autowired
  private PersonRepository repository;

  
  @RequestMapping(value = "/", method = RequestMethod.GET)
  public List<Person> getAllPeople() {
    return repository.findAll();
  }
  
  @RequestMapping(value = "/", method = RequestMethod.POST)
  public Person createPerson(@Valid @RequestBody Person person) {
    person.set_id(ObjectId.get());
    repository.save(person);
    return person;
  }
}