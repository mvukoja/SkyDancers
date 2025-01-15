package hr.fer.skydancers.dto;

import java.time.LocalDateTime;

public class AuditionApplicationDTO {
	
	
	private Integer id;
	private Integer auditionId;
	private String status;
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
