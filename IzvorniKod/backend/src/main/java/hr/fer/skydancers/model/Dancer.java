package hr.fer.skydancers.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;

@Entity
public class Dancer extends MyUser {

	private boolean inactive;

	private LocalDate inactiveuntil;

	@ManyToMany(cascade = CascadeType.PERSIST)
	@JoinTable(name = "dancer_dance", joinColumns = @JoinColumn(name = "dancer_id"), inverseJoinColumns = @JoinColumn(name = "dance_id"))
	private List<Dance> dancestyles;

	@OneToMany(mappedBy = "dancer")
    private List<AuditionApplication> applications;

	public Dancer() {
	}

	public Dancer(boolean inactive, LocalDate inactiveuntil, List<Dance> dancestyles,
			List<AuditionApplication> applications) {
		super();
		this.inactive = inactive;
		this.inactiveuntil = inactiveuntil;
		this.dancestyles = dancestyles;
		this.applications = applications;
	}

	public boolean isInactive() {
		return inactive;
	}

	public void setInactive(boolean inactive) {
		this.inactive = inactive;
	}

	public LocalDate getInactiveuntil() {
		return inactiveuntil;
	}

	public void setInactiveuntil(LocalDate inactiveuntil) {
		this.inactiveuntil = inactiveuntil;
	}

	public List<Dance> getDancestyles() {
		return dancestyles;
	}

	public void setDancestyles(List<Dance> dancestyles) {
		this.dancestyles = dancestyles;
	}

	public List<AuditionApplication> getApplications() {
		return applications;
	}

	public void setApplications(List<AuditionApplication> applications) {
		this.applications = applications;
	}

	

}
