package hr.fer.skydancers.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AuditionApplication {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private LocalDateTime datetime;

	private String status;

	@ManyToOne
	@JoinColumn(name = "audition_id")
	private Audition audition; // The audition this application belongs to

	@ManyToOne
	@JoinColumn(name = "dancer_id")
	private Dancer dancer; // The dancer who applied

	public AuditionApplication() {
		super();
	}

	public AuditionApplication(Integer id, LocalDateTime datetime, String status, Audition audition, Dancer dancer) {
		super();
		this.id = id;
		this.datetime = datetime;
		this.status = status;
		this.audition = audition;
		this.dancer = dancer;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getDatetime() {
		return datetime;
	}

	public void setDatetime(LocalDateTime datetime) {
		this.datetime = datetime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Audition getAudition() {
		return audition;
	}

	public void setAudition(Audition audition) {
		this.audition = audition;
	}

	public Dancer getDancer() {
		return dancer;
	}

	public void setDancer(Dancer dancer) {
		this.dancer = dancer;
	}

}
