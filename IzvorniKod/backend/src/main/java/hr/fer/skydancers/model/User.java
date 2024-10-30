package hr.fer.skydancers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import hr.fer.skydancers.enums.UserType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotEmpty;


@Table("USERS")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotEmpty
	private String name;

	@NotEmpty
	private String surname;
	
	@NotEmpty
	private String email;
	
	@NotEmpty
	private String password;

	private UserType type;

	public User() {
	}
	

	public User(Integer id, @NotEmpty String name, @NotEmpty String surname, @NotEmpty String email,
			@NotEmpty String password, UserType type) {
		super();
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.type = type;
	}


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public UserType getType() {
		return type;
	}

	public void setType(UserType type) {
		this.type = type;
	}

	
	
}