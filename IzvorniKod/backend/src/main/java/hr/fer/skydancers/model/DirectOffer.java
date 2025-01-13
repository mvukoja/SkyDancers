package hr.fer.skydancers.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DirectOffer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "director_id", nullable = false)
	private Director director;

	@ManyToOne
	@JoinColumn(name = "dancer_id", nullable = false)
	private Dancer dancer;

	@Column(nullable = false)
	private String message;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Column
	private String state;

	public DirectOffer(Long id, Director director, Dancer dancer, String message, LocalDateTime createdAt,
			String state) {
		super();
		this.id = id;
		this.director = director;
		this.dancer = dancer;
		this.message = message;
		this.createdAt = createdAt;
		this.state = state;
	}

	public DirectOffer() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Director getDirector() {
		return director;
	}

	public void setDirector(Director director) {
		this.director = director;
	}

	public Dancer getDancer() {
		return dancer;
	}

	public void setDancer(Dancer dancer) {
		this.dancer = dancer;
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
