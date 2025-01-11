package hr.fer.skydancers.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;

//Ova klasa predstavlja korisnički entitet

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class MyUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotEmpty
	private String username;

	@NotEmpty
	private String name;

	private String surname;

	private String email;

	private String password;

	private boolean confirmed;

	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "usertype_id")
	private UserType type;

	private boolean oauth;

	private boolean finishedoauth;

	private String gender;

	private int age;

	private String location;

	private String contact;

	@OneToOne(mappedBy = "user")
	private ForgotPassword forgotPassword;

	public MyUser() {
	}

	// Getteri i setteri za nove atribute
	public String getLocation() {
		return location;
	}

	public MyUser(Integer id, @NotEmpty String username, @NotEmpty String name, String surname, String email,
			String password, boolean confirmed, UserType type, boolean oauth, boolean finishedoauth, String gender,
			int age, String location, String contact, ForgotPassword forgotPassword) {
		super();
		this.id = id;
		this.username = username;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.confirmed = confirmed;
		this.type = type;
		this.oauth = oauth;
		this.finishedoauth = finishedoauth;
		this.gender = gender;
		this.age = age;
		this.location = location;
		this.contact = contact;
		this.forgotPassword = forgotPassword;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public boolean isConfirmed() {
		return confirmed;
	}

	public void setConfirmed(boolean confirmed) {
		this.confirmed = confirmed;
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

	public boolean isFinishedOauth() {
		return finishedoauth;
	}

	public void setFinishedOauth(boolean finishedoauth) {
		this.finishedoauth = finishedoauth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public ForgotPassword getForgotPassword() {
		return forgotPassword;
	}

	public void setForgotPassword(ForgotPassword forgotPassword) {
		this.forgotPassword = forgotPassword;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	
}
