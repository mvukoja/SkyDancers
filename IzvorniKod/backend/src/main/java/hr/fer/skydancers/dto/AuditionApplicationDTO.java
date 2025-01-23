package hr.fer.skydancers.dto;

import java.time.LocalDateTime;

//DTO za prijenos podataka o prijavama na audiciji
public class AuditionApplicationDTO {

	// ID prijave
	private Integer id;
	// ID audicije
	private Integer auditionId;
	// Status prijave
	private String status;
	// Vrijeme prijave
	private LocalDateTime datetime;

	private UserDto applicant;

	public AuditionApplicationDTO() {
		super();
	}

	public AuditionApplicationDTO(Integer id, Integer auditionId, String status, LocalDateTime datetime,
			UserDto applicant) {
		super();
		this.id = id;
		this.auditionId = auditionId;
		this.status = status;
		this.datetime = datetime;
		this.applicant = applicant;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getAuditionId() {
		return auditionId;
	}

	public void setAuditionId(Integer auditionId) {
		this.auditionId = auditionId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getDatetime() {
		return datetime;
	}

	public void setDatetime(LocalDateTime datetime) {
		this.datetime = datetime;
	}

	public UserDto getApplicant() {
		return applicant;
	}

	public void setApplicant(UserDto applicant) {
		this.applicant = applicant;
	}

}
