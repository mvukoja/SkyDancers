package hr.fer.skydancers.dto;

import java.util.List;

//DTO za prijenos podataka o pretrazi plesača
public class DancerSearchDTO {

	// Gornja granica godina
	private Integer ageup;

	// Donja granica godina
	private Integer agedown;

	// Spol
	private String gender;

	// Plesni stilovi
	private List<String> dancestyles;

	public DancerSearchDTO(Integer ageup, Integer agedown, String gender, List<String> dancestyles) {
		super();
		this.ageup = ageup;
		this.agedown = agedown;
		this.gender = gender;
		this.dancestyles = dancestyles;
	}

	public DancerSearchDTO() {
	}

	public Integer getAgeup() {
		return ageup;
	}

	public void setAgeup(Integer ageup) {
		this.ageup = ageup;
	}

	public Integer getAgedown() {
		return agedown;
	}

	public void setAgedown(Integer agedown) {
		this.agedown = agedown;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public List<String> getDancestyles() {
		return dancestyles;
	}

	public void setDancestyles(List<String> dancestyles) {
		this.dancestyles = dancestyles;
	}

}
