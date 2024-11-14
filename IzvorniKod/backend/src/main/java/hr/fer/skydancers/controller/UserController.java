package hr.fer.skydancers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.dto.DanceStylesRequest;
import hr.fer.skydancers.dto.InactiveStatusRequest;
import hr.fer.skydancers.dto.OauthRegDto;
import hr.fer.skydancers.dto.UpdateProfileRequest;
import hr.fer.skydancers.dto.UserDto;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.service.UserService;
import hr.fer.skydancers.webtoken.JwtService;
import hr.fer.skydancers.webtoken.LoginForm;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtService jwtService;


	// Završava OAuth registraciju korisnika
	@PostMapping("/complete-oauth")
	public MyUser completeOauth(@RequestBody OauthRegDto dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		user.setEmail(dto.getEmail());
		user.setType(dto.getType());
		user.setOauth(true);
		user.setFinishedoauth(true);
		userService.put(user);
		return user;
	}

	// Autentificira korisnika i generira JWT token
	@PostMapping("/authenticate")
	public ResponseEntity<String> authenticateAndGetToken(@RequestBody LoginForm loginForm) {
		Authentication auth;
		try {
			auth = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password()));
		} catch (AuthenticationException e) {
			return ResponseEntity.ok("Invalid credentials");
		}
		if (auth.isAuthenticated()) {
			return ResponseEntity.ok(jwtService.generateToken(userService.loadUserByUsername(loginForm.username())));
		}
		return ResponseEntity.ok("Invalid credentials");
	}

	// Registrira novog korisnika
	@PostMapping("/register")
	public ResponseEntity<String> createUser(@RequestBody MyUser user) {
		if (userService.get(user.getUsername()).isEmpty()) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			userService.put(user);
			return ResponseEntity.ok("Registration successful!");
		} else {
			return ResponseEntity.ok("Username already exists!");
		}
	}
	// Dohvaća sve korisnike
	@GetMapping("/getall")
	public Iterable<MyUser> get() {
		return userService.get();
	}

	// Dohvaća korisnika prema korisničkom imenu
	@GetMapping("/get/{username}")
	public UserDto get(@PathVariable String username) {
		MyUser user = userService.get(username).orElse(null);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		UserDto dto = new UserDto();
		dto.setEmail(user.getEmail());
		dto.setName(user.getName());
		dto.setSurname(user.getSurname());
		dto.setType(user.getType());
		dto.setOauth(user.isOauth());
		return dto;
	}

	// Dohvaća profil trenutnog prijavljenog korisnika
	@GetMapping("/myprofile")
	public UserDto getMyProfile() {

		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		MyUser user = userService.get(username).orElse(null);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}

		UserDto dto = new UserDto();

		dto.setEmail(user.getEmail());
		dto.setUsername(username);
		dto.setName(user.getName());
		dto.setSurname(user.getSurname());
		dto.setType(user.getType());
		dto.setOauth(user.isOauth());
		dto.setLocation(user.getLocation());
		dto.setGender(user.getGender());
		dto.setAge(user.getAge());
		dto.setDanceStyles(user.getDanceStyles());
		dto.setInactive(user.isInactive());
		dto.setInactiveUntil(user.getInactiveUntil());

		return dto;
	}

	// Briše korisnika prema ID-u
	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id) {
		MyUser user = userService.get(id);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		userService.remove(id);
	}

	// Ažurira profil trenutnog korisnika
	@PutMapping("/update-profile")
	public UserDto updateProfile(@RequestBody UpdateProfileRequest updateRequest) {

		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}

		user.setName(updateRequest.getName());
		user.setSurname(updateRequest.getSurname());
		user.setEmail(updateRequest.getEmail());
		user.setLocation(updateRequest.getLocation());
		user.setGender(updateRequest.getGender());
		user.setAge(updateRequest.getAge());

		userService.save(user);

		UserDto dto = new UserDto();
		dto.setEmail(user.getEmail());
		dto.setUsername(username);
		dto.setName(user.getName());
		dto.setSurname(user.getSurname());
		dto.setType(user.getType());
		dto.setOauth(user.isOauth());
		dto.setLocation(user.getLocation());
		dto.setGender(user.getGender());
		dto.setAge(user.getAge());
		dto.setDanceStyles(user.getDanceStyles());
		dto.setInactive(user.isInactive());
		dto.setInactiveUntil(user.getInactiveUntil());

		return dto;
	}

	// Ažurira plesne stilove korisnika
	@PutMapping("/update-dance-styles")
	public UserDto updateDanceStyles(@RequestBody DanceStylesRequest danceStylesRequest) {

		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		MyUser user = userService.get(username).orElse(null);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}

		user.setDanceStyles(danceStylesRequest.getDanceStyles());

		userService.save(user);

		UserDto dto = new UserDto();

		dto.setDanceStyles(user.getDanceStyles());

		return dto;
	}

	// Ažurira status neaktivnosti korisnika
	@PutMapping("/update-inactive-status")
	public UserDto updatInactiveStatus(@RequestBody InactiveStatusRequest inactiveStatusRequest) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}

		user.setInactive(inactiveStatusRequest.isInactive());
		user.setInactiveUntil(inactiveStatusRequest.getInactiveUntil());
		userService.save(user);

		UserDto dto = new UserDto();
		dto.setInactive(user.isInactive());
		dto.setInactiveUntil(user.getInactiveUntil());
		return dto;

	}

}