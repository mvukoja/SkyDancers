package hr.fer.skydancers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.dto.OauthRegDto;
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

	@PostMapping("/authenticate")
	public String authenticateAndGetToken(@RequestBody LoginForm loginForm) {
		Authentication auth = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password()));
		if (auth.isAuthenticated()) {
			return jwtService.generateToken(userService.loadUserByUsername(loginForm.username()));
		} else {
			throw new UsernameNotFoundException("Invalid credentials");
		}
	}

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

	@GetMapping("/getall")
	public Iterable<MyUser> get() {
		return userService.get();
	}

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
	
	@GetMapping("/myprofile")
	public UserDto getMyProfile() {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id) {
		MyUser user = userService.get(id);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		userService.remove(id);
	}

}