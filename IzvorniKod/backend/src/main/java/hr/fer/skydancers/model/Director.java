package hr.fer.skydancers.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Director extends MyUser{
	
	private boolean paid = false;

	private LocalDate subscription;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Audition> audition;

	public Director(boolean paid, LocalDate subscription, List<Audition> audition) {
		super();
		this.paid = paid;
		this.subscription = subscription;
		this.audition = audition;
	}
	
	public Director() {
	}

	public boolean isPaid() {
		return paid;
	}

	public void setPaid(boolean paid) {
		this.paid = paid;
	}

	public LocalDate getSubscription() {
		return subscription;
	}

	public void setSubscription(LocalDate subscription) {
		this.subscription = subscription;
	}

	public List<Audition> getAudition() {
		return audition;
	}

	public void setAudition(List<Audition> audition) {
		this.audition = audition;
	}
	
	

}
