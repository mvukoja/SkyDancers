package hr.fer.skydancers.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;

@Entity
public class Dancer extends MyUser{
	
	private boolean inactive;

	private LocalDate inactiveuntil;
	
	private List<String> dancestyles;
	
	public Dancer(boolean inactive, LocalDate inactiveuntil, List<String> dancestyles) {
		super();
		this.inactive = inactive;
		this.inactiveuntil = inactiveuntil;
		this.dancestyles = dancestyles;
	}

	public Dancer() {
	}

	public boolean isInactive() {
		return inactive;
	}

	public void setInactive(boolean inactive) {
		this.inactive = inactive;
	}

	public LocalDate getInactiveUntil() {
		return inactiveuntil;
	}

	public void setInactiveUntil(LocalDate inactiveuntil) {
		this.inactiveuntil = inactiveuntil;
	}

	public List<String> getDanceStyles() {
		return dancestyles;
	}

	public void setDanceStyles(List<String> dancestyles) {
		this.dancestyles = dancestyles;
	}
	
	
	
	

}
