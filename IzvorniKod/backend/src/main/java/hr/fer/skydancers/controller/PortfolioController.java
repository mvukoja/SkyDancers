package hr.fer.skydancers.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import hr.fer.skydancers.dto.PortfolioDTO;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.model.Portfolio;
import hr.fer.skydancers.repository.PortfolioRepository;
import hr.fer.skydancers.service.UserService;

@RestController
@RequestMapping("/portfolio")
@CrossOrigin
public class PortfolioController {

	@Autowired
	private UserService userService;

	@Autowired
	private PortfolioRepository portfolioRepository;

	private ModelMapper modelMapper = new ModelMapper();

	@PostMapping("/updatedescription")
	public ResponseEntity<PortfolioDTO> updatePortfolioDescription(@RequestBody(required = false) String description) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		Portfolio portfolio = portfolioRepository.findById(user.getPortfolio().getId()).orElse(null);
		if (portfolio == null)
			return ResponseEntity.badRequest().build();
		if(description == null)
			description = "";
		portfolio.setDescription(description);
		portfolioRepository.save(portfolio);
		PortfolioDTO dto = modelMapper.map(portfolio, PortfolioDTO.class);
		dto.setUsername(user.getUsername());
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/uploadfile")
	public ResponseEntity<PortfolioDTO> uploadFile(
			@RequestParam(value = "photos", required = false) List<MultipartFile> photos,
			@RequestParam(value = "videos", required = false) List<MultipartFile> videos) throws IOException {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		Portfolio portfolio = portfolioRepository.findById(user.getPortfolio().getId()).orElse(null);
		if (portfolio == null)
			return ResponseEntity.badRequest().build();

		List<String> uploadedPhotos = new ArrayList<>();
		List<String> uploadedVideos = new ArrayList<>();

		if (photos != null)
			for (MultipartFile photo : photos) {
				String photoUrl = saveFile(photo);
				uploadedPhotos.add(photoUrl);
			}
		if (videos != null)
			for (MultipartFile video : videos) {
				String videoUrl = saveFile(video);
				uploadedVideos.add(videoUrl);
			}
		portfolio.getPhotos().addAll(uploadedPhotos);
		portfolio.getVideos().addAll(uploadedVideos);
		portfolioRepository.save(portfolio);
		PortfolioDTO dto = modelMapper.map(portfolio, PortfolioDTO.class);
		dto.setUsername(user.getUsername());
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/get/{username}")
	public ResponseEntity<PortfolioDTO> getPortfolio(@PathVariable String username) {
		MyUser user = userService.get(username).orElse(null);

		Portfolio portfolio = portfolioRepository.findById(user.getPortfolio().getId()).orElse(null);
		if (portfolio == null)
			return ResponseEntity.badRequest().build();

		PortfolioDTO dto = modelMapper.map(portfolio, PortfolioDTO.class);
		dto.setUsername(user.getUsername());
		return ResponseEntity.ok(dto);
	}

	@DeleteMapping("/deletephoto")
	public ResponseEntity<PortfolioDTO> deletePhoto(@RequestParam String photoname) throws UnsupportedEncodingException {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		Portfolio portfolio = portfolioRepository.findById(user.getPortfolio().getId()).orElse(null);
		if (portfolio == null)
			return ResponseEntity.badRequest().build();
		String decodedPhotoName = URLDecoder.decode(photoname, "UTF-8");
		List<String> photos = portfolio.getPhotos();
		boolean isRemoved = photos.removeIf(photo -> photo.endsWith(decodedPhotoName));

		if (isRemoved) {
			portfolio.setPhotos(photos);
			portfolioRepository.save(portfolio);
			deleteFileFromSystem(decodedPhotoName);
		}
		PortfolioDTO dto = modelMapper.map(portfolio, PortfolioDTO.class);
		dto.setUsername(user.getUsername());
		return ResponseEntity.ok(dto);
	}
	
	@DeleteMapping("/deletevideo")
	public ResponseEntity<PortfolioDTO> deleteVideo(@RequestParam String videoname) throws UnsupportedEncodingException {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		Portfolio portfolio = portfolioRepository.findById(user.getPortfolio().getId()).orElse(null);
		if (portfolio == null)
			return ResponseEntity.badRequest().build();
		String decodedVideoName = URLDecoder.decode(videoname, "UTF-8");
		List<String> videos = portfolio.getVideos();
		boolean isRemoved = videos.removeIf(video -> video.endsWith(decodedVideoName));

		if (isRemoved) {
			portfolio.setVideos(videos);
			portfolioRepository.save(portfolio);
			deleteFileFromSystem(decodedVideoName);
		}
		PortfolioDTO dto = modelMapper.map(portfolio, PortfolioDTO.class);
		dto.setUsername(user.getUsername());
		return ResponseEntity.ok(dto);
	}

	private void deleteFileFromSystem(String photoName) {
		Path filePath = Paths.get("uploads/" + photoName);
		try {
			Files.deleteIfExists(filePath);
		} catch (IOException e) {
			throw new RuntimeException("Failed to delete file: " + photoName, e);
		}
	}

	private String saveFile(MultipartFile file) throws IOException {
		File uploadDir = new File("uploads");
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}
		String originalFilename = file.getOriginalFilename();
		String fileName = System.currentTimeMillis() + "-" + originalFilename;
		Path path = Paths.get(uploadDir.getPath(), fileName);
		Files.write(path, file.getBytes());
		return "/uploads/" + fileName;
	}

}
