package hr.fer.skydancers.dto;

import hr.fer.skydancers.enums.UserType;

public class OauthRegDto {
	
	private String email;
	private Boolean oauth;
	private UserType type;
	public OauthRegDto(String email, Boolean oauth, UserType type) {
		super();
		this.email = email;
		this.type = type;
		this.oauth = oauth;
	}
	public Boolean getOauth() {
		return oauth;
	}
	public void setOauth(Boolean oauth) {
		this.oauth = oauth;
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
	
	

}
