package src;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

//The thing that gets stored in the database
public class Person {

	@Id private ObjectId _id;

	//table columns
	private String firstName;
	private String lastName;
	
	//example had this so i copied it
	public Person() {}
	
	//constructor
	public Person(ObjectId _id, String firstName, String lastName) {
		this._id = _id;
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
	//past this is just getters and setters, uses this to know how to send back responses
	//so they must named the same as the attributes i think
	public String get_id() {
		return _id.toHexString();
	}
	
	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
}