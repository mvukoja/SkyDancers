package hr.fer.skydancers.dto;

import java.time.LocalDate;
import java.util.List;

//DTO za prijenos podataka za pretragu audicija
public class AuditionSearchDTO {

	// Vrijeme (najkasnije) audicije
	private LocalDate datetime;

	// Plaća
	private Integer wage;

	// Lokacija
	private String location;

	// Stilovi plesa
	private List<String> styles;

	public AuditionSearchDTO(LocalDate datetime, Integer wage, String location, List<String> styles) {
		super();
		this.datetime = datetime;
		this.wage = wage;
		this.location = location;
		this.styles = styles;
	}

	public AuditionSearchDTO() {
	}

	public LocalDate getDatetime() {
		return datetime;
	}

	public void setDatetime(LocalDate datetime) {
		this.datetime = datetime;
	}

	public Integer getWage() {
		return wage;
	}

	public void setWage(Integer wage) {
		this.wage = wage;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public List<String> getStyles() {
		return styles;
	}

	public void setStyles(List<String> styles) {
		this.styles = styles;
	}

}
