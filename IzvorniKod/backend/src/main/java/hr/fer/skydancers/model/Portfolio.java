package hr.fer.skydancers.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.List;

//Ova klasa predstavlja portfolio korisnika
@Entity
public class Portfolio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(columnDefinition = "TEXT")
	private String description; // opis

	@ElementCollection
	private List<String> photos; // slike

	@ElementCollection
	private List<String> videos;// videi

	@OneToOne
	@JoinColumn(name = "user_id")
	private MyUser user; // vlasnik

	public Portfolio() {
		super();
	}

	public Portfolio(Integer id, String description, List<String> photos, List<String> videos, MyUser user) {
		super();
		this.id = id;
		this.description = description;
		this.photos = photos;
		this.videos = videos;
		this.user = user;
	}

	// Getters and Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getPhotos() {
		return photos;
	}

	public void setPhotos(List<String> photos) {
		this.photos = photos;
	}

	public List<String> getVideos() {
		return videos;
	}

	public void setVideos(List<String> videos) {
		this.videos = videos;
	}

	public MyUser getUser() {
		return user;
	}

	public void setUser(MyUser user) {
		this.user = user;
	}
}
