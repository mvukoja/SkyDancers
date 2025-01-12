package hr.fer.skydancers.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AuditionDTO {
	
	private Integer id;
	
	private LocalDateTime creation;
	
	private LocalDateTime datetime;
	
	private LocalDateTime deadline;

	private String location;

	private String description;

	// broj mjesta ukupno
	private Integer positions;

	// broj prijavljenih
	private Integer subscribed;

	private Integer wage;

	private List<String> styles;

	public AuditionDTO(Integer id, LocalDateTime creation, LocalDateTime datetime, LocalDateTime deadline,
			String location, String description, Integer positions, Integer subscribed, Integer wage,
			List<String> styles) {
		super();
		this.id = id;
		this.creation = creation;
		this.datetime = datetime;
		this.deadline = deadline;
		this.location = location;
		this.description = description;
		this.positions = positions;
		this.subscribed = subscribed;
		this.wage = wage;
		this.styles = styles;
	}
	
	public AuditionDTO() {
		
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getCreation() {
		return creation;
	}

	public void setCreation(LocalDateTime creation) {
		this.creation = creation;
	}

	public LocalDateTime getDatetime() {
		return datetime;
	}

	public void setDatetime(LocalDateTime datetime) {
		this.datetime = datetime;
	}

	public LocalDateTime getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getPositions() {
		return positions;
	}

	public void setPositions(Integer positions) {
		this.positions = positions;
	}

	public Integer getSubscribed() {
		return subscribed;
	}

	public void setSubscribed(Integer subscribed) {
		this.subscribed = subscribed;
	}

	public Integer getWage() {
		return wage;
	}

	public void setWage(Integer wage) {
		this.wage = wage;
	}

	public List<String> getStyles() {
		return styles;
	}

	public void setStyles(List<String> styles) {
		this.styles = styles;
	}

	
	
	
	

}
