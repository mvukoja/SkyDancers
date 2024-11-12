package hr.fer.skydancers.model;

import hr.fer.skydancers.enums.UserType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

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

    private int age;

    private boolean inactive;

    private LocalDate inactiveUntil;

    @ElementCollection
    private List<String> danceStyles;

    public MyUser() {
    }

    public MyUser(Integer id, @NotEmpty String username, @NotEmpty String name, String surname, String email,
                  String password, UserType type, boolean oauth, boolean finishedOauth, String location, 
                  String gender, int age, boolean inactive, LocalDate inactiveUntil, List<String> danceStyles) {
        super();
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.type = type;
        this.oauth = oauth;
        this.finishedoauth = finishedOauth;
        this.location = location;
        this.gender = gender;
        this.age = age;
        this.inactive = inactive;
        this.inactiveUntil = inactiveUntil;
        this.danceStyles = danceStyles;
    }

    // Getteri i setteri za nove atribute

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
        return inactiveUntil;
    }

    public void setInactiveUntil(LocalDate inactiveUntil) {
        this.inactiveUntil = inactiveUntil;
    }

    public List<String> getDanceStyles() {
        return danceStyles;
    }

    public void setDanceStyles(List<String> danceStyles) {
        this.danceStyles = danceStyles;
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
}
