package hr.fer.skydancers.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
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
	private String name; // ime

	private String surname; // prezime

	private String email; // mail

	private String password; // lozinka

	private boolean confirmed; // stanje potvrde registracije

	@OneToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "usertype_id", referencedColumnName = "userid", nullable = false)
	private UserType type; // tip korisnika

	private String oauth; // oauth identifikator

	private boolean finishedoauth; // je li završena oauth registracija

	private String gender; // spol

	private Integer age; // dob

	private String location; // lokacija

	private String contact; // kontakt broj

	@OneToOne(mappedBy = "user")
	private ForgotPassword forgotPassword; // zaboravljena lozinka

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private Portfolio portfolio; // vlastiti portfolio

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Payment> payments = new ArrayList<>(); // plaćanja

	public MyUser() {
	}

	public MyUser(Integer id, @NotEmpty String username, @NotEmpty String name, String surname, String email,
			String password, boolean confirmed, UserType type, String oauth, boolean finishedoauth, String gender,
			Integer age, String location, String contact, ForgotPassword forgotPassword, Portfolio portfolio,
			List<Payment> payments) {
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
		this.portfolio = portfolio;
		this.payments = payments;
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

	public String isOauth() {
		return oauth;
	}

	public void setOauth(String oauth) {
		this.oauth = oauth;
	}

	public boolean isFinishedoauth() {
		return finishedoauth;
	}

	public void setFinishedoauth(boolean finishedoauth) {
		this.finishedoauth = finishedoauth;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
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

	public Portfolio getPortfolio() {
		return portfolio;
	}

	public void setPortfolio(Portfolio portfolio) {
		this.portfolio = portfolio;
	}

	public List<Payment> getPayments() {
		return payments;
	}

	public void setPayments(List<Payment> payments) {
		this.payments = payments;
	}
}
