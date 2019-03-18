package src;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Person {

	@Id private ObjectId id;

	private String firstName;
	private String lastName;
	
	public ObjectId getID() {
		return id;
	}
	
	public void setID(ObjectId id) {
		this.id = id;
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