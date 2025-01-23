package hr.fer.skydancers.dto;

//DTO za prijenos podataka o plaćanju
public class PaymentRequest {
	// Iznos
	private Long amount;

	// Količina
	private Long quantity;

	// Ime
	private String name;

	public PaymentRequest(Long amount, Long quantity, String name) {
		super();
		this.amount = amount;
		this.quantity = quantity;
		this.name = name;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
