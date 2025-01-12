package hr.fer.skydancers.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.service.AuditionService;
import hr.fer.skydancers.service.UserService;

@RestController
@RequestMapping("/audition")
@CrossOrigin
public class AuditionController {

	@Autowired
	private AuditionService auditionService;

	@Autowired
	private UserService userService;

	@GetMapping("/getall")
	public Iterable<Audition> getAll() {
		return auditionService.get();
	}

	@GetMapping("/get/{username}")
	public ResponseEntity<List<Audition>> getAllDirectorsAuditions(@PathVariable String username) {
		MyUser user = userService.get(username).orElse(null);

		if (user == null)
			return ResponseEntity.badRequest().build();

		return ResponseEntity.ok(auditionService.getByDirector(user));
	}

	@PostMapping("/create")
	public ResponseEntity<Audition> createAudition(@RequestBody Audition audition) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}
		audition.setCreation(LocalDateTime.now());
		return ResponseEntity.ok(auditionService.put(audition));
	}

	@PostMapping("/update/{id}")
	public ResponseEntity<Audition> updateAudition(@RequestBody Audition audition, @PathVariable Integer id) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}
		audition.setCreation(auditionService.get(id).getCreation());
		return ResponseEntity.ok(auditionService.put(audition));// treba popravit ovo s DTO..
	}

	@GetMapping("/delete/{id}")
	public ResponseEntity<String> deleteAudition(@PathVariable Integer id) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}
		if (auditionService.get(id) != null) {
			auditionService.remove(auditionService.get(id));
			return ResponseEntity.ok("Removed successfully!");
		} else
			return ResponseEntity.ok("Doesn't exist!");
	}
}
