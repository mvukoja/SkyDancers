package hr.fer.skydancers.model;

import jakarta.persistence.Entity;

@Entity
public class Admin extends MyUser {
	
	public Admin() {
		super();
	}

	private Long subscriptionprice;

	public Admin(Long subscriptionprice) {
		super();
		this.subscriptionprice = subscriptionprice;
	}

	public Long getSubscriptionprice() {
		return subscriptionprice;
	}

	public void setSubscriptionprice(Long subscriptionprice) {
		this.subscriptionprice = subscriptionprice;
	}
	
	
}
