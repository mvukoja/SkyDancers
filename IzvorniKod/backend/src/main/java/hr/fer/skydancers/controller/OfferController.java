package hr.fer.skydancers.controller;

import java.time.LocalDateTime;
import java.util.List;

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

import hr.fer.skydancers.dto.OfferDTO;
import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.DirectOffer;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.DirectOfferRepository;
import hr.fer.skydancers.service.UserService;

@RestController
@RequestMapping("/offer")
@CrossOrigin
public class OfferController {

	@Autowired
	private DirectOfferRepository directOfferRepository;

	@Autowired
	private UserService userService;

	@PostMapping("/make")
	public ResponseEntity<DirectOffer> makeOffer(@RequestBody OfferDTO dto) {

		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		Dancer dancer;
		try {
			dancer = (Dancer) userService.get(dto.getDancerid());
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
		DirectOffer offer = new DirectOffer();
		offer.setDirector((Director) user);
		offer.setDancer(dancer);
		offer.setMessage(dto.getMessage());
		offer.setCreatedAt(LocalDateTime.now());
		offer.setState("PENDING");
		directOfferRepository.save(offer);
		return ResponseEntity.ok(offer);
	}

	@GetMapping("/director")
	public ResponseEntity<List<DirectOffer>> getOffersByDirector() {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		
		List<DirectOffer> offers = directOfferRepository.findAllByDirectorId(user.getId());
		return ResponseEntity.ok(offers);
	}

	@GetMapping("/dancer")
	public ResponseEntity<List<DirectOffer>> getOffersByDancer() {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		List<DirectOffer> offers = directOfferRepository.findAllByDancerId(user.getId());
		return ResponseEntity.ok(offers);
	}
	
	@GetMapping("/delete/{id}")
	public ResponseEntity<String> deleteOffer(@PathVariable Integer id){
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		
		DirectOffer off = directOfferRepository.findById(id).orElse(null);
		if(off == null)
			return ResponseEntity.badRequest().build();
		
		if(!off.getDirector().getUsername().equals(user.getUsername()))
			return ResponseEntity.badRequest().build();
		
		directOfferRepository.delete(off);
		return ResponseEntity.ok("Success");
	}
	
	@GetMapping("/accept/{id}")
	public ResponseEntity<String> acceptOffer(@PathVariable Integer id){
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Dancer)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		
		DirectOffer off = directOfferRepository.findById(id).orElse(null);
		if(off == null)
			return ResponseEntity.badRequest().build();
		
		if(!off.getDancer().getUsername().equals(user.getUsername()))
			return ResponseEntity.badRequest().build();
		
		off.setState("ACCEPTED");
		directOfferRepository.save(off);
		return ResponseEntity.ok("Success");
	}
	
	@GetMapping("/deny/{id}")
	public ResponseEntity<String> denyOffer(@PathVariable Integer id){
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Dancer)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		
		DirectOffer off = directOfferRepository.findById(id).orElse(null);
		if(off == null)
			return ResponseEntity.badRequest().build();
		
		if(!off.getDancer().getUsername().equals(user.getUsername()))
			return ResponseEntity.badRequest().build();
		
		off.setState("DENIED");
		directOfferRepository.save(off);
		return ResponseEntity.ok("Success");
	}

}
