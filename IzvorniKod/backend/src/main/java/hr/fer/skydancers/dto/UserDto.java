package hr.fer.skydancers.dto;

import hr.fer.skydancers.enums.UserType;

public class UserDto {

	private String name;
	private String surname;
	private String email;
	private UserType type;
	private boolean oauth;
	
	public UserDto() {
	}
	
	public UserDto(String name, String surname, String email, UserType type, boolean oauth) {
		super();
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.type = type;
		this.oauth = oauth;
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
	public UserType getType() {
		return type;
	}
	public void setType(UserType type) {
		this.type = type;
	}
	public boolean isOauth() {
		return oauth;
	}
	public void setOauth(boolean oauth) {
		this.oauth = oauth;
	}
	
	
}
