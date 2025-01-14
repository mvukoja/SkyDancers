package hr.fer.skydancers.dto;

import java.time.LocalDateTime;

public class DirectOfferDTO {

	private Long id;
	
	private String directorname;
	
	private String dancername;
	
	private String message;
	
	private LocalDateTime createdAt;
	
	private String state;

	public DirectOfferDTO() {
	}
	
	public DirectOfferDTO(Long id, String directorname, String dancername, String message, LocalDateTime createdAt,
			String state) {
		super();
		this.id = id;
		this.directorname = directorname;
		this.dancername = dancername;
		this.message = message;
		this.createdAt = createdAt;
		this.state = state;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDirectorname() {
		return directorname;
	}

	public void setDirectorname(String directorname) {
		this.directorname = directorname;
	}

	public String getDancername() {
		return dancername;
	}

	public void setDancername(String dancername) {
		this.dancername = dancername;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	
}
