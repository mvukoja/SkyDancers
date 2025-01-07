package hr.fer.skydancers.model;

import hr.fer.skydancers.enums.UserType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

//Ova klasa predstavlja korisnički entitet

@Entity
@Table(name = "users")
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

    private UserType type;

    private boolean oauth;

    private boolean finishedoauth;

    private String location;

    private String gender;
    
    private boolean paid;
    
    private LocalDate subscription;

    private int age;

    private boolean inactive;

    private LocalDate inactiveuntil;

    private List<String> dancestyles;

    public MyUser() {
    }


    // Getteri i setteri za nove atribute

    public MyUser(Integer id, @NotEmpty String username, @NotEmpty String name, String surname, String email,
			String password, UserType type, boolean oauth, boolean finishedoauth, String location, String gender,
			boolean paid, LocalDate subscription, int age, boolean inactive, LocalDate inactiveuntil,
			List<String> dancestyles) {
		super();
		this.id = id;
		this.username = username;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.password = password;
		this.type = type;
		this.oauth = oauth;
		this.finishedoauth = finishedoauth;
		this.location = location;
		this.gender = gender;
		this.paid = paid;
		this.setSubscription(subscription);
		this.age = age;
		this.inactive = inactive;
		this.inactiveuntil = inactiveuntil;
		this.dancestyles = dancestyles;
	}



	public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public boolean isInactive() {
        return inactive;
    }

    public void setInactive(boolean inactive) {
        this.inactive = inactive;
    }

    public LocalDate getInactiveUntil() {
        return inactiveuntil;
    }

    public void setInactiveUntil(LocalDate inactiveUntil) {
        this.inactiveuntil = inactiveUntil;
    }

    public List<String> getDanceStyles() {
        return dancestyles;
    }

    public void setDanceStyles(List<String> danceStyles) {
        this.dancestyles = danceStyles;
    }

    public boolean isFinishedOauth() {
        return finishedoauth;
    }

    public void setFinishedoauth(boolean finishedOauth) {
        this.finishedoauth = finishedOauth;
    }

    public boolean isOauth() {
        return oauth;
    }

    public void setOauth(boolean oauth) {
        this.oauth = oauth;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
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

	public boolean isPaid() {
		return paid;
	}

	public void setPaid(boolean paid) {
		this.paid = paid;
	}


	public LocalDate getSubscription() {
		return subscription;
	}

	public void setSubscription(LocalDate subscription) {
		this.subscription = subscription;
	}
}
