package hr.fer.skydancers.dto;

import java.time.LocalDateTime;
import java.util.List;

//DTO za prijenos podataka o audiciji
public class AuditionDTO {

	// ID audicije
	private Integer id;

	// Vrijeme kreiranja
	private LocalDateTime creation;

	// Vrijeme audicije
	private LocalDateTime datetime;

	// Rok prijave
	private LocalDateTime deadline;

	// Lokacija
	private String location;

	// Opis
	private String description;

	// broj mjesta ukupno
	private Integer positions;

	// broj prijavljenih
	private Integer subscribed;

	// Plaća
	private Integer wage;

	// Stanje arhiviranosti
	private boolean archived;

	// Plesni stilovi
	private List<String> styles;

	// Ime autora (direktora)
	private String author;

	public AuditionDTO(Integer id, LocalDateTime creation, LocalDateTime datetime, LocalDateTime deadline,
			String location, String description, Integer positions, Integer subscribed, Integer wage, boolean archived,
			List<String> styles, String author) {
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
		this.archived = archived;
		this.styles = styles;
		this.author = author;
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

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}
}
