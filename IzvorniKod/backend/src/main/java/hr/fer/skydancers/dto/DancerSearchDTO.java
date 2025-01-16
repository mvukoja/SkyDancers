package hr.fer.skydancers.dto;

import java.util.List;

public class DancerSearchDTO {

	private Integer ageup;

	private Integer agedown;

	private String gender;

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
