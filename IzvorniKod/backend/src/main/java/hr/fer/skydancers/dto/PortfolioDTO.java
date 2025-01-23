package hr.fer.skydancers.dto;

import java.util.List;

//DTO za prijenos podataka o portfoliu
public class PortfolioDTO {

	// ID portfolia
	private Integer id;

	// Opis
	private String description;

	// URL-ovi slika
	private List<String> photos;

	// URL-ovi videa
	private List<String> videos;

	// Ime vlasnika
	private String username;

	public PortfolioDTO(Integer id, String description, List<String> photos, List<String> videos, String username) {
		super();
		this.id = id;
		this.description = description;
		this.photos = photos;
		this.videos = videos;
		this.username = username;
	}

	public PortfolioDTO() {
		super();
	}

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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

}
