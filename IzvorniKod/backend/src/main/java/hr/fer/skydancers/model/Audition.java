package hr.fer.skydancers.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "audition")
public class Audition {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private LocalDateTime creation;

	private LocalDateTime datetime;

	private LocalDateTime deadline;

	private String location;

	private String description;

	// broj mjesta ukupno
	private Integer positions;

	// broj prijavljenih
	private Integer subscribed;

	private Integer wage;
	
	private boolean archived;

	@ManyToMany(cascade = CascadeType.PERSIST)
	@JoinTable(name = "audition_dance", joinColumns = @JoinColumn(name = "audition_id"), inverseJoinColumns = @JoinColumn(name = "dance_id"))
	private List<Dance> styles;

	@OneToMany(mappedBy = "audition")
	private List<AuditionApplication> applications;// prijave na ovu audiciju

	// autor
	@ManyToOne
	@JoinColumn(name = "user_id")
	private MyUser user;

	public Audition() {
	}

	public Audition(Integer id, LocalDateTime creation, LocalDateTime datetime, LocalDateTime deadline, String location,
			String description, Integer positions, Integer subscribed, Integer wage, boolean archived,
			List<Dance> styles, List<AuditionApplication> applications, MyUser user) {
		super();
		this.id = id;
		this.creation = creation;
		this.datetime = datetime;
		this.deadline = deadline;
		this.location = location;
		this.description = description;
		this.positions = positions;
		this.subscribed = subscribed;
		this.wage = wage;
		this.archived = archived;
		this.styles = styles;
		this.applications = applications;
		this.user = user;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public LocalDateTime getCreation() {
		return creation;
	}

	public void setCreation(LocalDateTime creation) {
		this.creation = creation;
	}

	public LocalDateTime getDatetime() {
		return datetime;
	}

	public void setDatetime(LocalDateTime datetime) {
		this.datetime = datetime;
	}

	public LocalDateTime getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDateTime deadline) {
		this.deadline = deadline;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getPositions() {
		return positions;
	}

	public void setPositions(Integer positions) {
		this.positions = positions;
	}

	public Integer getSubscribed() {
		return subscribed;
	}

	public void setSubscribed(Integer subscribed) {
		this.subscribed = subscribed;
	}

	public Integer getWage() {
		return wage;
	}

	public void setWage(Integer wage) {
		this.wage = wage;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public List<Dance> getStyles() {
		return styles;
	}

	public void setStyles(List<Dance> styles) {
		this.styles = styles;
	}

	public List<AuditionApplication> getApplications() {
		return applications;
	}

	public void setApplications(List<AuditionApplication> applications) {
		this.applications = applications;
	}

	public MyUser getUser() {
		return user;
	}

	public void setUser(MyUser user) {
		this.user = user;
	}

}