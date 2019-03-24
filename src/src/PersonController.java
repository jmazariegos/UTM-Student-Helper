package src;

import javax.validation.Valid;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//all the endpoints
@RestController
@RequestMapping("/people") //the big endpoint, all endpoints will extend this
public class PersonController {
  @Autowired //this sets up the repository
  private PersonRepository repository;

  @CrossOrigin(origins = "*") //allows being able to use this endpoint by any site (dangerous, will
  // have to change it to our website if we can host it
  @RequestMapping(value = "/", method = RequestMethod.GET) //value = endpoint, method = method
  public List<Person> getAllPeople() { //this end point will do this function and return what it returns
    return repository.findAll();
  }
  
  //requestbody = body of the json, maps to a Map<String, Object> (object = any type after the key in a json)
  //requestparam = a parameter given by the json (used for anything that cant make a requestbody (get *cough*))
  //valid = no idea, example just pairs it with requestbody when you want a type so i say yes
  //findby<params> = refer to that thing i sent in chat, it does all the work for you
  //findByFirstNameAndLastName = find all people with FirstName And LastName
  
  @RequestMapping(value = "/", method = RequestMethod.POST)
  public Person createPerson(@Valid @RequestBody Person person) {
    person.set_id(ObjectId.get());
    repository.save(person);
    return person;
  }
}