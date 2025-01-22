package hr.fer.skydancers.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

//Ova klasa predstavlja Ples
@Entity
public class Dance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// Ime plesa
	private String name;

	public Dance() {
	}

	public Dance(Integer id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public Dance(String name) {
		super();
		this.name = name;
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
}
