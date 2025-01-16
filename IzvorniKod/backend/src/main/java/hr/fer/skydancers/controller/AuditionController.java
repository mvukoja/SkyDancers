package hr.fer.skydancers.controller;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.dto.AuditionApplicationDTO;
import hr.fer.skydancers.dto.AuditionDTO;
import hr.fer.skydancers.dto.AuditionSearchDTO;
import hr.fer.skydancers.dto.UserDto;
import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.AuditionApplication;
import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.AuditionApplicationRepository;
import hr.fer.skydancers.repository.DanceRepository;
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

	private ModelMapper modelMapper = new ModelMapper();

	@Autowired
	private DanceRepository danceRepository;

	@Autowired
	private AuditionApplicationRepository auditionApplicationRepository;

	@GetMapping("/getall")
	public ResponseEntity<List<AuditionDTO>> getAll() {
		Iterable<Audition> list = auditionService.get();
		List<AuditionDTO> dto = new LinkedList<>();
		list.forEach(el -> {
			if (!el.isArchived()) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dances = new LinkedList<>();
				el.getStyles().forEach(e -> dances.add(e.getName()));
				aud.setStyles(dances);
				aud.setAuthor(el.getUser().getUsername());
				dto.add(aud);
			}
		});
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/getdirectors/{username}")
	public ResponseEntity<List<AuditionDTO>> getAllDirectorsAuditions(@PathVariable String username) {
		MyUser user = userService.get(username).orElse(null);

		if (user == null)
			return ResponseEntity.badRequest().build();

		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser us = userService.get(usname).orElse(null);

		if (us instanceof Director) {
			if (!((Director) us).isPaid()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
			}
		}

		Iterable<Audition> list = auditionService.getByDirector(user);
		List<AuditionDTO> dto = new LinkedList<>();
		list.forEach(el -> {
			if (!el.isArchived()) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dances = new LinkedList<>();
				el.getStyles().forEach(e -> dances.add(e.getName()));
				aud.setStyles(dances);
				aud.setAuthor(el.getUser().getUsername());
				dto.add(aud);
			}
		});

		return ResponseEntity.ok(dto);
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<AuditionDTO> getAudition(@PathVariable Integer id) {
		Audition aud = auditionService.get(id);
		if(aud == null)
			return ResponseEntity.ok(null);
		AuditionDTO dto = modelMapper.map(aud, AuditionDTO.class);
		List<String> dances = new LinkedList<>();
		aud.getStyles().forEach(e -> dances.add(e.getName()));
		dto.setStyles(dances);
		dto.setAuthor(aud.getUser().getUsername());
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/archive/{id}")
	public ResponseEntity<String> archiveAudition(@PathVariable Integer id) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}

		Audition aud = auditionService.get(id);
		if (aud == null)
			return ResponseEntity.badRequest().build();

		aud.setArchived(true);
		auditionService.put(aud);
		return ResponseEntity.ok("Successful!");
	}

	@GetMapping("/archived/{username}")
	public ResponseEntity<List<AuditionDTO>> getArchived(@PathVariable String username) {
		MyUser user = userService.get(username).orElse(null);

		if (user == null)
			return ResponseEntity.badRequest().build();

		Iterable<Audition> list = auditionService.getByDirector(user);
		List<AuditionDTO> dto = new LinkedList<>();
		list.forEach(el -> {
			if (el.isArchived()) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dances = new LinkedList<>();
				el.getStyles().forEach(e -> dances.add(e.getName()));
				aud.setStyles(dances);
				aud.setAuthor(el.getUser().getUsername());
				dto.add(aud);
			}
		});
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/create")
	public ResponseEntity<AuditionDTO> createAudition(@RequestBody AuditionDTO audition) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}

		List<Dance> dances = new LinkedList<>();
		for (String name : audition.getStyles()) {
			Optional<Dance> danceOpt = danceRepository.findByName(name);
			if (danceOpt.isPresent()) {
				dances.add(danceOpt.get());
			} else {
				throw new IllegalArgumentException("DanceStyle not found: " + name);
			}
		}

		audition.setCreation(LocalDateTime.now());
		audition.setSubscribed(0);
		Audition aud = modelMapper.map(audition, Audition.class);
		aud.setArchived(false);
		aud.setUser(user);
		aud.setStyles(dances);
		auditionService.put(aud);
		audition.setId(aud.getId());
		return ResponseEntity.ok(audition);
	}

	@PostMapping("/update/{id}")
	public ResponseEntity<AuditionDTO> updateAudition(@RequestBody AuditionDTO dto, @PathVariable Integer id) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}

		Audition aud = auditionService.get(id);

		List<Dance> dances = new LinkedList<>();
		for (String name : dto.getStyles()) {
			Optional<Dance> danceOpt = danceRepository.findByName(name);
			if (danceOpt.isPresent()) {
				dances.add(danceOpt.get());
			} else {
				throw new IllegalArgumentException("DanceStyle not found: " + name);
			}
		}
		dto.setCreation(aud.getCreation());
		dto.setSubscribed(aud.getSubscribed());
		aud.setDatetime(dto.getDatetime());
		aud.setDeadline(dto.getDeadline());
		aud.setDescription(dto.getDescription());
		aud.setLocation(dto.getLocation());
		aud.setPositions(dto.getPositions());
		aud.setStyles(dances);
		aud.setArchived(false);
		aud.setWage(dto.getWage());
		auditionService.put(aud);

		return ResponseEntity.ok(dto);
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

	@PostMapping("/searchauditions")
	public ResponseEntity<List<AuditionDTO>> searchAuditions(@RequestBody AuditionSearchDTO dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Dancer)) {
			return ResponseEntity.badRequest().build();
		}
		List<Audition> list = auditionService.getByFilter(dto.getDatetime(), dto.getWage(), dto.getLocation(),
				dto.getStyles());
		List<AuditionDTO> dtoo = new LinkedList<>();
		list.forEach(el -> {
			if (!el.isArchived() && el.getDeadline().isAfter(LocalDateTime.now())) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dances = new LinkedList<>();
				el.getStyles().forEach(e -> dances.add(e.getName()));
				aud.setStyles(dances);
				aud.setAuthor(el.getUser().getUsername());
				dtoo.add(aud);
			}
		});
		return ResponseEntity.ok(dtoo);
	}

	// dva filtra su znaci vrsta plesa i lokacija...
	@GetMapping("/notifications")
	public ResponseEntity<List<AuditionDTO>> notificationAuditions() {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Dancer)) {
			return ResponseEntity.badRequest().build();
		}

		List<String> dances = new LinkedList<>();
		((Dancer) user).getDancestyles().forEach(el -> dances.add(el.getName()));

		List<Audition> list = auditionService.getByPreference(user.getLocation(), dances);

		List<AuditionDTO> dtoo = new LinkedList<>();
		list.forEach(el -> {
			if (!el.isArchived() && el.getDeadline().isAfter(LocalDateTime.now())) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dance = new LinkedList<>();
				el.getStyles().forEach(e -> dance.add(e.getName()));
				aud.setStyles(dance);
				aud.setAuthor(el.getUser().getUsername());
				dtoo.add(aud);
			}
		});
		return ResponseEntity.ok(dtoo);
	}

	@GetMapping("/getmyapplications")
	public ResponseEntity<List<AuditionDTO>> seeMyApplications() {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Dancer)) {
			return ResponseEntity.badRequest().build();
		}
		List<Audition> list = auditionApplicationRepository.findAuditionsByDancerId(user.getId());
		if (list == null)
			return ResponseEntity.badRequest().build();
		List<AuditionDTO> dtoo = new LinkedList<>();
		list.forEach(el -> {
			if (!el.isArchived()) {
				AuditionDTO aud = modelMapper.map(el, AuditionDTO.class);
				List<String> dance = new LinkedList<>();
				el.getStyles().forEach(e -> dance.add(e.getName()));
				aud.setStyles(dance);
				aud.setAuthor(el.getUser().getUsername());
				dtoo.add(aud);
			}
		});
		return ResponseEntity.ok(dtoo);
	}

	@PostMapping("/applytoaudition")
	public ResponseEntity<AuditionApplicationDTO> applyToAudition(@RequestBody AuditionApplicationDTO dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		if (!(user instanceof Dancer)) {
			return ResponseEntity.badRequest().build();
		}
		Audition aud = auditionService.get(dto.getAuditionId());

		if (aud.getSubscribed() == aud.getPositions())
			return ResponseEntity.badRequest().build();

		AuditionApplication auditionApplication = new AuditionApplication();
		auditionApplication.setAudition(aud);
		auditionApplication.setDancer((Dancer) user);
		auditionApplication.setDatetime(LocalDateTime.now());
		dto.setDatetime(LocalDateTime.now());
		dto.setStatus("U tijeku");
		auditionApplication.setStatus("U tijeku");
		auditionApplicationRepository.save(auditionApplication);
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/manage/applications/{id}")
	public ResponseEntity<List<AuditionApplicationDTO>> seeApplications(@PathVariable Integer id) {

		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser uss = userService.get(usname).orElse(null);

		if (uss instanceof Director) {
			if (!((Director) uss).isPaid()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
			}
		}

		List<AuditionApplication> auditionApplication = auditionApplicationRepository.findAllByAuditionId(id);
		if (auditionApplication == null)
			return ResponseEntity.badRequest().build();

		List<AuditionApplicationDTO> dto = new LinkedList<>();

		auditionApplication.forEach(el -> {
			AuditionApplicationDTO aud = modelMapper.map(el, AuditionApplicationDTO.class);
			UserDto us = modelMapper.map(el.getDancer(), UserDto.class);
			aud.setApplicant(us);
			dto.add(aud);
		});
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/manage/allow/{id}")
	public ResponseEntity<String> allowDancerAudition(@PathVariable Integer id) {
		String actor = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(actor).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}
		if (user instanceof Director) {
			if (!((Director) user).isPaid()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
			}
		}
		AuditionApplication auditionApplication = auditionApplicationRepository.findById(id).orElse(null);
		if (auditionApplication == null)
			return ResponseEntity.badRequest().build();
		if (!auditionApplication.getAudition().getUser().getUsername().equals(user.getUsername()))
			return ResponseEntity.badRequest().build();

		auditionApplication.setStatus("Prihvaćena");
		auditionApplicationRepository.save(auditionApplication);

		Audition aud = auditionService.get(auditionApplication.getAudition().getId());
		aud.setSubscribed(aud.getSubscribed() + 1);
		auditionService.put(aud);
		return ResponseEntity.ok("Succesful!");
	}

	@GetMapping("/manage/deny/{id}")
	public ResponseEntity<String> denyDancerAudition(@PathVariable Integer id) {
		String actor = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(actor).orElse(null);
		if (!(user instanceof Director)) {
			return ResponseEntity.badRequest().build();
		}
		if (user instanceof Director) {
			if (!((Director) user).isPaid()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
			}
		}
		AuditionApplication auditionApplication = auditionApplicationRepository.findById(id).orElse(null);
		if (auditionApplication == null)
			return ResponseEntity.badRequest().build();

		if (!auditionApplication.getAudition().getUser().getUsername().equals(user.getUsername()))
			return ResponseEntity.badRequest().build();
		auditionApplication.setStatus("Odbijena");
		auditionApplicationRepository.save(auditionApplication);
		return ResponseEntity.ok("Succesful!");
	}

}
