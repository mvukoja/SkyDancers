package hr.fer.skydancers.dto;

import hr.fer.skydancers.enums.UserType;

import java.time.LocalDate;
import java.util.List;

//Ova klasa predstavlja DTO za korisnika, sadrži sve informacije o korisniku koje se prenose između servera i klijenta

public class UserDto {

    private String name;
    private String surname;
    private String email;
    private UserType type;
    private boolean oauth;

    // Novi atributi
    private String username;
    private String location;
    private int age;
    private String gender;
    private boolean paid;
    private LocalDate subscription;
    private List<String> danceStyles; // Lista plesnih stilova
    private boolean inactive;
    private LocalDate inactiveUntil; // Datum u string formatu
    

    public UserDto() {
    }

    
    public UserDto(String name, String surname, String email, UserType type, boolean oauth, String username,
			String location, int age, String gender, boolean paid, LocalDate subscription, List<String> danceStyles,
			boolean inactive, LocalDate inactiveUntil) {
		super();
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.type = type;
		this.oauth = oauth;
		this.username = username;
		this.location = location;
		this.age = age;
		this.gender = gender;
		this.setPaid(paid);
		this.setSubscription(subscription);
		this.danceStyles = danceStyles;
		this.inactive = inactive;
		this.inactiveUntil = inactiveUntil;
	}

	// Getteri i setteri za sve atribute
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public List<String> getDanceStyles() {
        return danceStyles;
    }

    public void setDanceStyles(List<String> danceStyles) {
        this.danceStyles = danceStyles;
    }

    public boolean isInactive() {
        return inactive;
    }

    public void setInactive(boolean inactive) {
        this.inactive = inactive;
    }

    public LocalDate getInactiveUntil() {
        return inactiveUntil;
    }

    public void setInactiveUntil(LocalDate inactiveUntil) {
        this.inactiveUntil = inactiveUntil;
    }

   

    // Postojeći getteri i setteri za ime, prezime, email, tip korisnika i oauth
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
