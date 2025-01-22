package hr.fer.skydancers.dto;

//DTO za prijenos podataka o plaćanju
public class StripeResponse {
	// Status plaćanja
	private String status;

	// Poruka
	private String message;

	// ID sjednice
	private String sessionId;

	// Link sjednice
	private String sessionUrl;

	public StripeResponse() {
	}

	public StripeResponse(String status, String message, String sessionId, String sessionUrl) {
		this.status = status;
		this.message = message;
		this.sessionId = sessionId;
		this.sessionUrl = sessionUrl;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getSessionUrl() {
		return sessionUrl;
	}

	public void setSessionUrl(String sessionUrl) {
		this.sessionUrl = sessionUrl;
	}
}
