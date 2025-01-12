package hr.fer.skydancers.controller;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.modelmapper.ModelMapper;
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
import hr.fer.skydancers.dto.DancerSearchDTO;
import hr.fer.skydancers.dto.InactiveStatusRequest;
import hr.fer.skydancers.dto.MailBody;
import hr.fer.skydancers.dto.OauthRegDto;
import hr.fer.skydancers.dto.PaymentRequest;
import hr.fer.skydancers.dto.StripeResponse;
import hr.fer.skydancers.dto.UpdateProfileRequest;
import hr.fer.skydancers.dto.UserDto;
import hr.fer.skydancers.enums.UserTypeEnum;
import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.ForgotPassword;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.DanceRepository;
import hr.fer.skydancers.repository.ForgotPasswordRepository;
import hr.fer.skydancers.service.EmailService;
import hr.fer.skydancers.service.StripeService;
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

	@Autowired
	private StripeService stripeService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private ForgotPasswordRepository forgotPasswordRepository;

	@Autowired
	private DanceRepository danceRepository;

	private ModelMapper modelMapper = new ModelMapper();

	@PostMapping("/payment")
	public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody PaymentRequest productRequest) {
		StripeResponse stripeResponse = stripeService.checkout(productRequest,
				(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
	}

	@GetMapping("/payment/success/{username}/{sessionId}")
	public ResponseEntity<String> handleSuccess(@PathVariable String sessionId, @PathVariable String username) {
		try {
			if (stripeService.processPaymentSuccess(sessionId, username))
				return ResponseEntity.status(302).header("Location", "http://localhost:3000/payment/success").build();
			else
				return ResponseEntity.badRequest().body("Greška pri procesiranju plaćanja!");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Greška pri procesiranju plaćanja: " + e.getMessage());
		}
	}

	// Završava OAuth registraciju korisnika
	@PostMapping("/complete-oauth")
	public MyUser completeOauth(@RequestBody OauthRegDto dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);
		user.setEmail(dto.getEmail());
		user.setOauth(true);
		user.setFinishedOauth(true);

		if (dto.getType().equals(UserTypeEnum.DANCER)) {
			Dancer dancer = modelMapper.map(user, Dancer.class);
			dancer.getType().setType(dto.getType());
			userService.remove(user.getId());
			userService.put(dancer);
			return dancer;
		} else {
			Director director = modelMapper.map(user, Director.class);
			director.getType().setType(dto.getType());
			userService.remove(user.getId());
			userService.put(director);
			return director;
		}
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
			if (!userService.get(loginForm.username()).orElse(null).isConfirmed()) {
				return ResponseEntity.ok("Nedovršena registracija! Provjerite svoj mail!");
			}
			return ResponseEntity.ok(jwtService.generateToken(userService.loadUserByUsername(loginForm.username())));
		}
		return ResponseEntity.ok("Invalid credentials");
	}

	// Registrira novog korisnika
	@PostMapping("/registerdirector")
	public ResponseEntity<String> createDirector(@RequestBody Director user) {
		if (userService.get(user.getUsername()).isEmpty()) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setConfirmed(true);//temporary
			userService.put(user);

			/*int otp = new Random().nextInt(100000, 999999);
			MailBody mailBody = new MailBody(user.getEmail(), "SkyDancers: Potvrda maila",
					"SkyDancers\n" + "Dobrodošli!" + "\n"
							+ "Ovo je link za dovršetak vaše registracije: http://localhost:8080/users/register/" + otp
							+ "/" + user.getEmail());

			ForgotPassword fp = new ForgotPassword();
			fp.setOtp(otp);
			fp.setExpirDate(LocalDate.now().plusDays(365));
			fp.setUser(user);

			emailService.sendSimpleMessage(mailBody);
			forgotPasswordRepository.save(fp);*/

			return ResponseEntity.ok("Registration successful!");
		} else {
			return ResponseEntity.ok("Korisničko ime već postoji!");
		}
	}

	@PostMapping("/registerdancer")
	public ResponseEntity<String> createDancer(@RequestBody Dancer user) {
		if (userService.get(user.getUsername()).isEmpty()) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setConfirmed(true);//temporary
			userService.put(user);

			/*int otp = new Random().nextInt(100000, 999999);
			MailBody mailBody = new MailBody(user.getEmail(), "SkyDancers: Potvrda maila",
					"SkyDancers\n" + "Dobrodošli!" + "\n"
							+ "Ovo je link za dovršetak vaše registracije: http://localhost:8080/users/register/" + otp
							+ "/" + user.getEmail());

			ForgotPassword fp = new ForgotPassword();
			fp.setOtp(otp);
			fp.setExpirDate(LocalDate.now().plusDays(365));
			fp.setUser(user);

			emailService.sendSimpleMessage(mailBody);
			forgotPasswordRepository.save(fp);*/

			return ResponseEntity.ok("Registration successful!");
		} else {
			return ResponseEntity.ok("Korisničko ime već postoji!");
		}
	}

	@GetMapping("/register/{otp}/{email}")
	public ResponseEntity<String> finishReg(@PathVariable Integer otp, @PathVariable String email) {
		MyUser user = userService.getByMail(email).orElse(null);
		ForgotPassword fp = forgotPasswordRepository.findByOtpAndUser(otp, user).orElse(null);

		if (fp != null) {
			forgotPasswordRepository.deleteById(fp.getFpid());
			user.setConfirmed(true);
			userService.save(user);
			return ResponseEntity.status(302).header("Location", "http://localhost:3000/login").build();
		} else {
			return ResponseEntity.ok("Niste dovršili potvrdu registracije!");
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
		if (user instanceof Dancer) {
			dto.setDanceStyles(((Dancer) user).getDanceStyles());
			dto.setInactive(((Dancer) user).isInactive());
			dto.setInactiveUntil(((Dancer) user).getInactiveUntil());
		}
		if (user instanceof Director) {
			dto.setPaid(((Director) user).isPaid());
			dto.setSubscription(((Director) user).getSubscription());
		}
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

		if (user instanceof Dancer) {
			dto.setDanceStyles(((Dancer) user).getDanceStyles());
			dto.setInactive(((Dancer) user).isInactive());
			dto.setInactiveUntil(((Dancer) user).getInactiveUntil());
		}
		return dto;
	}

	// Ažurira plesne stilove korisnika
	@PutMapping("/update-dance-styles")
	public UserDto updateDanceStyles(@RequestBody DanceStylesRequest danceStylesRequest) {

		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Dancer user = (Dancer) userService.get(username).orElse(null);

		if (user == null) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
		}
		List<Dance> dances = new LinkedList<>();
		for (String name : danceStylesRequest.getDanceStyles()) {
			Optional<Dance> danceOpt = danceRepository.findByName(name);
			if (danceOpt.isPresent()) {
				dances.add(danceOpt.get());
			} else {
				throw new IllegalArgumentException("DanceStyle not found: " + name);
			}
		}

		user.setDanceStyles(dances);
		userService.save(user);
		UserDto dto = new UserDto();
		dto.setDanceStyles(user.getDanceStyles());
		return dto;
	}

	// Ažurira status neaktivnosti korisnika
	@PutMapping("/update-inactive-status")
	public UserDto updatInactiveStatus(@RequestBody InactiveStatusRequest inactiveStatusRequest) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Dancer user = (Dancer) userService.get(username).orElse(null);

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

	@PostMapping("/searchdancers")
	public ResponseEntity<Iterable<Dancer>> searchDancers(@RequestBody DancerSearchDTO dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		return ResponseEntity.ok(userService.getByAgeAndGenderAndDanceStyle(dto.getAgeup(), dto.getAgedown(),
				dto.getGender(), dto.getDancestyles()));// za sad samo search po godinama..
	}

}