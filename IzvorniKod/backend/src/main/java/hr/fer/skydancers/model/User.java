package hr.fer.skydancers.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import jakarta.validation.constraints.NotEmpty;

@Table("USERS")
public class User {

	@Id
	private Integer id;

	@NotEmpty
	private String name;

	@NotEmpty
	private String username;

	public User() {
	}

	public User(Integer id, String name, String username) {
		super();
		this.id = id;
		this.name = name;
		this.username = username;
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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
