package hr.fer.skydancers.dto;

import hr.fer.skydancers.model.UserType;

//DTO za prijenos podataka o OAuth registraciji
public class OauthRegDto {

	// Korisničko ime
	private String username;

	// Mail
	private String email;

	// Oauth id
	private String oauth;

	// Tip korisnika
	private UserType type;

	public OauthRegDto(String username, String email, String oauth, UserType type) {
		super();
		this.username = username;
		this.email = email;
		this.oauth = oauth;
		this.type = type;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOauth() {
		return oauth;
	}

	public void setOauth(String oauth) {
		this.oauth = oauth;
	}

	public UserType getType() {
		return type;
	}

	public void setType(UserType type) {
		this.type = type;
	}

}
