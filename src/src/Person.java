package src;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Person {

	@Id private ObjectId _id;

	private String firstName;
	private String lastName;
	
	public Person() {}
	
	public Person(ObjectId _id, String firstName, String lastName) {
		this._id = _id;
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
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