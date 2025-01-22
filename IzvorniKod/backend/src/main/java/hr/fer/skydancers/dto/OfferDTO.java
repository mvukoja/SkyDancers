package hr.fer.skydancers.dto;

//DTO za prijenos podataka o kreiranju direktne ponude
public class OfferDTO {

	// ID plesača
	private Integer dancerid;

	// Poruka
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
