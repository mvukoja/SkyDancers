package hr.fer.skydancers.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;

@Entity
public class Dancer extends MyUser {

	private boolean inactive;

	private LocalDate inactiveuntil;

	@ManyToMany(cascade = CascadeType.PERSIST)
	@JoinTable(name = "dancer_dance", joinColumns = @JoinColumn(name = "dancer_id"), inverseJoinColumns = @JoinColumn(name = "dance_id"))
	private List<Dance> dancestyles;

	public Dancer(boolean inactive, LocalDate inactiveuntil, List<Dance> dancestyles) {
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

	public List<Dance> getDanceStyles() {
		return dancestyles;
	}

	public void setDanceStyles(List<Dance> dancestyles) {
		this.dancestyles = dancestyles;
	}
}
