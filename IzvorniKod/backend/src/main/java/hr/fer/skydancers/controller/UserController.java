package hr.fer.skydancers.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.model.User;
import hr.fer.skydancers.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/login")
	public String login() {
		return "login:";
	}
	
	@GetMapping("/register")
	public String signup() {
		return "signup";
	}
	
	@GetMapping("/dashboard")
	public String dashboard(Authentication auth, HttpServletRequest req, Model model) {
		if (auth.getPrincipal() instanceof UserDetails userDetails) {
            model.addAttribute("username", userDetails.getUsername());
            model.addAttribute("authorities", userDetails.getAuthorities());
        } else if (auth.getPrincipal() instanceof OAuth2User oauth2User) {
            model.addAttribute("username", oauth2User.getAttribute("name"));
            model.addAttribute("email", oauth2User.getAttribute("email"));
            model.addAttribute("authorities", oauth2User.getAuthorities());
        }

        CsrfToken csrf = (CsrfToken) req.getAttribute(CsrfToken.class.getName());
        if (csrf != null) {
            model.addAttribute("csrf", csrf);
        }
        StringBuilder sb = new StringBuilder();
        sb.append(model.getAttribute("username"));
        sb.append(model.getAttribute("authorities"));
        return sb.toString();
	}
		
	@GetMapping("")
	public Iterable<User> get(){
		return userService.get();
	}

	@GetMapping("/{id}")
	public User get(@PathVariable Integer id) {
		User user = userService.get(id);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		return user;
	}

	@PostMapping("")
	public User create(@Valid @RequestBody User user) {
		userService.put(user);
		return user;
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id) {
		User user = userService.get(id);
		if (user == null)
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		userService.remove(id);
	}

}