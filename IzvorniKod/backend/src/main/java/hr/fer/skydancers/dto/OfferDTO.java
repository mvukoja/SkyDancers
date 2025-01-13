package hr.fer.skydancers.dto;

public class OfferDTO {

	private Integer dancerid;
	
	private String message;

	public OfferDTO(Integer dancerid, String message) {
		super();
		this.dancerid = dancerid;
		this.message = message;
	}

	public Integer getDancerid() {
		return dancerid;
	}

	public void setDancerid(Integer dancerid) {
		this.dancerid = dancerid;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
