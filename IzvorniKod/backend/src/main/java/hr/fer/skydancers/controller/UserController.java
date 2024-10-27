package hr.fer.skydancers.controller;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.model.User;
import hr.fer.skydancers.service.UserService;
import jakarta.validation.Valid;

@RestController
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/")
	public String hello() {
		return "Hello world";
	}
	
	@GetMapping("/users")
	public Iterable<User> get(){
		return userService.get();
	}

	@GetMapping("/users/{id}")
	public User get(@PathVariable Integer id) {
		User user = userService.get(id);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		return user;
	}

	@PostMapping("/users/{id}")
	public User create(@RequestBody @Valid User user) {
		userService.put(user);
		return user;
	}

	@DeleteMapping("/users/{id}")
	public void delete(@PathVariable Integer id) {
		userService.remove(id);
	}

}
