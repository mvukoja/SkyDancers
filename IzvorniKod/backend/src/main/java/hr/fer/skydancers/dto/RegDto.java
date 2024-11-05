package hr.fer.skydancers.dto;

import hr.fer.skydancers.enums.UserType;

public class RegDto {

	private String name;
	private String surname;
	private String email;
	private String password;
	private UserType type;
	
	
	public RegDto(String name, String surname, String email, String password, UserType type) {
		super();
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.type = type;
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
