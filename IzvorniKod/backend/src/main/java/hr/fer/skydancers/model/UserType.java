package hr.fer.skydancers.model;

import hr.fer.skydancers.enums.UserTypeEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//Ova klasa predstavlja vrstu korisnika
@Entity
@Table(name = "usertype")
public class UserType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userid;

	@Enumerated(EnumType.STRING)
	private UserTypeEnum type; // Enumerirani tip korisnika

	public UserType() {
	}

	public UserType(String type) {
		super();
		this.type = UserTypeEnum.valueOf(type);
	}

	public UserType(Integer id, String type) {
		super();
		this.userid = id;
		this.type = UserTypeEnum.valueOf(type);
	}

	public Integer getUserid() {
		return userid;
	}

	public void setUserid(Integer userid) {
		this.userid = userid;
	}

	public UserTypeEnum getType() {
		return type;
	}

	public void setType(UserTypeEnum type) {
		this.type = type;
	}
}
