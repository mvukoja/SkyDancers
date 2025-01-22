package hr.fer.skydancers.controller;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.skydancers.dto.ChangePassword;
import hr.fer.skydancers.dto.DanceStylesRequest;
import hr.fer.skydancers.dto.DancerSearchDTO;
import hr.fer.skydancers.dto.InactiveStatusRequest;
import hr.fer.skydancers.dto.OauthRegDto;
import hr.fer.skydancers.dto.PaymentRequest;
import hr.fer.skydancers.dto.StripeResponse;
import hr.fer.skydancers.dto.UpdateProfileRequest;
import hr.fer.skydancers.dto.UserDto;
import hr.fer.skydancers.enums.UserTypeEnum;
import hr.fer.skydancers.model.Admin;
import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.ForgotPassword;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.model.Portfolio;
import hr.fer.skydancers.repository.DanceRepository;
import hr.fer.skydancers.repository.ForgotPasswordRepository;
import hr.fer.skydancers.repository.PortfolioRepository;
import hr.fer.skydancers.service.EmailService;
import hr.fer.skydancers.service.StripeService;
import hr.fer.skydancers.service.UserService;
import hr.fer.skydancers.webtoken.JwtService;
import hr.fer.skydancers.webtoken.LoginForm;

//Glavni kontroler svih ruta vezanih za korisnike
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
	private PortfolioRepository portfolioRepository;

	@Autowired
	private DanceRepository danceRepository;

	private ModelMapper modelMapper = new ModelMapper();
	
	@Value("${spring.mail.username}")
	private String mailSender;

	// Funkcija za izvršavanje plaćanja od strane direktora
	@PostMapping("/payment")
	public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody PaymentRequest productRequest) {
		StripeResponse stripeResponse = stripeService.checkout(productRequest,
				(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
		return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
	}

	// Funkcija za slučaj uspjeha plaćanja od strane direktora
	@GetMapping("/payment/success/{username}/{sessionId}")
	public ResponseEntity<String> handleSuccess(@PathVariable String sessionId, @PathVariable String username) {
		try {
			if (stripeService.processPaymentSuccess(sessionId, username))
				return ResponseEntity.status(302).header("Location", "https://skydancers.onrender.com/payment/success")
						.build();
			else
				return ResponseEntity.badRequest().body("Greška pri procesiranju plaćanja!");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Greška pri procesiranju plaćanja: " + e.getMessage());
		}
	}

	// Završava OAuth registraciju korisnika
	@PostMapping("/complete-oauth")
	public ResponseEntity<String> completeOauth(@RequestBody OauthRegDto dto) {
		if (userService.get(dto.getUsername()).orElse(null) != null) {
			return ResponseEntity.ok("Already taken");
		}

		if (userService.getOauth(dto.getOauth()).isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		MyUser user = userService.getOauth(dto.getOauth()).orElse(null);
		user.setUsername(dto.getUsername());
		user.setEmail(dto.getEmail());
		user.setFinishedoauth(true);
		user.setConfirmed(true);

		if (dto.getType().getType().equals(UserTypeEnum.DANCER)) {
			user.getType().setType(UserTypeEnum.DANCER);
			Dancer dancer = modelMapper.map(user, Dancer.class);
			userService.remove(user.getId());
			userService.save(dancer);
			dancer = (Dancer) userService.get(dto.getUsername()).orElse(null);
			Portfolio portfolio = new Portfolio();
			portfolio.setUser(dancer);
			portfolioRepository.save(portfolio);
		} else {
			user.getType().setType(UserTypeEnum.DIRECTOR);
			Director director = modelMapper.map(user, Director.class);
			userService.remove(user.getId());
			userService.save(director);
			director = (Director) userService.get(dto.getUsername()).orElse(null);
			Portfolio portfolio = new Portfolio();
			portfolio.setUser(director);
			portfolioRepository.save(portfolio);
		}
		String token = jwtService.generateToken(userService.loadUserByUsername(user.getUsername()));
		return ResponseEntity.ok(token);
	}

	// Autentificira korisnika i generira JWT token
	@PostMapping("/authenticate")
	public ResponseEntity<String> authenticateAndGetToken(@RequestBody LoginForm loginForm) {
		Authentication auth;
		if (userService.get(loginForm.username()).orElse(null) != null
				&& userService.get(loginForm.username()).orElse(null).isOauth() != null) {
			return ResponseEntity.ok("Github login");
		}
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
			MyUser user = userService.get(loginForm.username()).orElse(null);
			if (user instanceof Dancer && ((Dancer) user).getInactiveuntil() != null) {
				if (((Dancer) user).getInactiveuntil().isBefore(LocalDate.now())) {
					((Dancer) user).setInactive(false);
					((Dancer) user).setInactiveuntil(null);
				}
			} else if (user instanceof Director && ((Director) user).getSubscription() != null) {
				if (((Director) user).getSubscription().isBefore(LocalDate.now())) {
					((Director) user).setSubscription(null);
					((Director) user).setPaid(false);
				}
			}
			return ResponseEntity.ok(jwtService.generateToken(userService.loadUserByUsername(loginForm.username())));
		}
		return ResponseEntity.ok("Invalid credentials");
	}

	// Autentificira OAuth korisnika i generira JWT token
	@PostMapping("/authenticateoauth")
	public ResponseEntity<String> authenticateOauth(@RequestBody String oauth) {
		MyUser user = userService.getOauth(oauth).orElse(null);
		if (user == null) {
			return ResponseEntity.badRequest().build();
		}
		if (user instanceof Dancer && ((Dancer) user).getInactiveuntil() != null) {
			if (((Dancer) user).getInactiveuntil().isBefore(LocalDate.now())) {
				((Dancer) user).setInactive(false);
				((Dancer) user).setInactiveuntil(null);
			}
		} else if (user instanceof Director && ((Director) user).getSubscription() != null) {
			if (((Director) user).getSubscription().isBefore(LocalDate.now())) {
				((Director) user).setSubscription(null);
				((Director) user).setPaid(false);
			}
		}
		return ResponseEntity.ok(jwtService.generateToken(userService.loadUserByUsername(user.getUsername())));
	}

	// Registrira novog direktora
	@PostMapping("/registerdirector")
	public ResponseEntity<String> createDirector(@RequestBody Director user) {
		if (userService.get(user.getUsername()).isEmpty()) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setOauth(null);
			userService.put(user);

			Portfolio portfolio = new Portfolio();
			portfolio.setUser(user);
			portfolioRepository.save(portfolio);

			int otp = new Random().nextInt(100000, 999999);
			emailService.sendEmail(mailSender, user.getEmail(), "SkyDancers: Potvrda maila", "SkyDancers\n"
					+ "Dobrodošli!" + "\n"
					+ "Ovo je link za dovršetak vaše registracije: https://skydancers-back.onrender.com/users/register/"
					+ otp + "/" + user.getEmail());

			ForgotPassword fp = new ForgotPassword();
			fp.setOtp(otp);
			fp.setExpirDate(LocalDate.now().plusDays(365));
			fp.setUser(user);

			forgotPasswordRepository.save(fp);

			return ResponseEntity.ok("Registration successful!");
		} else {
			return ResponseEntity.ok("Korisničko ime već postoji!");
		}
	}

	// Registrira novog plesača
	@PostMapping("/registerdancer")
	public ResponseEntity<String> createDancer(@RequestBody Dancer user) {
		if (userService.get(user.getUsername()).isEmpty()) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			user.setOauth(null);
			userService.put(user);

			Portfolio portfolio = new Portfolio();
			portfolio.setUser(user);
			portfolioRepository.save(portfolio);

			int otp = new Random().nextInt(100000, 999999);
			emailService.sendEmail(mailSender, user.getEmail(), "SkyDancers: Potvrda maila", "SkyDancers\n"
					+ "Dobrodošli!" + "\n"
					+ "Ovo je link za dovršetak vaše registracije: https://skydancers-back.onrender.com/users/register/"
					+ otp + "/" + user.getEmail());

			ForgotPassword fp = new ForgotPassword();
			fp.setOtp(otp);
			fp.setExpirDate(LocalDate.now().plusDays(365));
			fp.setUser(user);
			forgotPasswordRepository.save(fp);

			return ResponseEntity.ok("Registration successful!");
		} else {
			return ResponseEntity.ok("Korisničko ime već postoji!");
		}
	}

	// Funkcija za potvrdu registracije mailom
	@GetMapping("/register/{otp}/{email}")
	public ResponseEntity<String> finishReg(@PathVariable Integer otp, @PathVariable String email) {
		MyUser user = userService.getByMail(email).orElse(null);
		ForgotPassword fp = forgotPasswordRepository.findByOtpAndUser(otp, user).orElse(null);

		if (fp != null) {
			forgotPasswordRepository.deleteById(fp.getFpid());
			user.setConfirmed(true);
			userService.save(user);
			return ResponseEntity.status(302).header("Location", "https://skydancers.onrender.com/login").build();
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
		dto.setId(user.getId());
		dto.setUsername(user.getUsername());
		dto.setEmail(user.getEmail());
		dto.setName(user.getName());
		dto.setSurname(user.getSurname());
		dto.setType(user.getType());
		dto.setOauth(user.isOauth());
		dto.setLocation(user.getLocation());
		dto.setAge(user.getAge());
		dto.setGender(user.getGender());
		if (user instanceof Dancer) {
			dto.setDanceStyles(((Dancer) user).getDancestyles());
			dto.setInactive(((Dancer) user).isInactive());
			dto.setInactiveUntil(((Dancer) user).getInactiveuntil());
		}
		if (user instanceof Director) {
			dto.setPaid(((Director) user).isPaid());
			dto.setSubscription(((Director) user).getSubscription());
		}
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
		dto.setId(user.getId());
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
			dto.setDanceStyles(((Dancer) user).getDancestyles());
			dto.setInactive(((Dancer) user).isInactive());
			dto.setInactiveUntil(((Dancer) user).getInactiveuntil());
		}
		if (user instanceof Director) {
			dto.setPaid(((Director) user).isPaid());
			dto.setSubscription(((Director) user).getSubscription());
		}
		return dto;
	}

	// Ažurira profil trenutnog korisnika
	@PutMapping("/update-profile/{username}")
	public UserDto updateProfile(@RequestBody UpdateProfileRequest updateRequest, @PathVariable String username) {
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
		dto.setId(user.getId());
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
			dto.setDanceStyles(((Dancer) user).getDancestyles());
			dto.setInactive(((Dancer) user).isInactive());
			dto.setInactiveUntil(((Dancer) user).getInactiveuntil());
		}
		return dto;
	}

	// Ažurira plesne stilove korisnika
	@PutMapping("/update-dance-styles/{username}")
	public UserDto updateDanceStyles(@RequestBody DanceStylesRequest danceStylesRequest,
			@PathVariable String username) {
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

		user.setDancestyles(dances);
		userService.save(user);
		UserDto dto = new UserDto();
		dto.setDanceStyles(user.getDancestyles());
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
		user.setInactiveuntil(inactiveStatusRequest.getInactiveUntil());
		userService.save(user);

		UserDto dto = new UserDto();
		dto.setInactive(user.isInactive());
		dto.setInactiveUntil(user.getInactiveuntil());
		return dto;
	}

	// Funkcija za pretragu plesača po filteru
	@PostMapping("/searchdancers")
	public ResponseEntity<List<UserDto>> searchDancers(@RequestBody DancerSearchDTO dto) {
		String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(username).orElse(null);

		if (!(user instanceof Director)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		if (!((Director) user).isPaid()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
		}
		List<Dancer> list = userService.getByAgeAndGenderAndDanceStyle(dto.getAgeup(), dto.getAgedown(),
				dto.getGender(), dto.getDancestyles());

		if (list == null)
			return ResponseEntity.ok(null);

		List<UserDto> dtoo = new LinkedList<>();
		list.forEach(el -> {
			UserDto d = modelMapper.map(el, UserDto.class);
			dtoo.add(d);
		});

		return ResponseEntity.ok(dtoo);
	}

	// Funkcija za pretragu korisnika po ukucanom inputu
	@GetMapping("/searchuser/{username}")
	public ResponseEntity<List<UserDto>> searchUser(@PathVariable String username) {
		if (username == null)
			return ResponseEntity.ok(null);

		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(usname).orElse(null);

		if (user instanceof Director) {
			if (!((Director) user).isPaid()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not allowed");
			}
		}

		List<MyUser> list = userService.getByNameLike(username);

		if (list == null)
			return ResponseEntity.ok(null);

		List<UserDto> dto = new LinkedList<>();
		list.forEach(el -> {
			UserDto d = modelMapper.map(el, UserDto.class);
			dto.add(d);
		});

		return ResponseEntity.ok(dto);
	}

	// Funkcija za promjenu lozinke
	@PostMapping("/changepassword")
	public ResponseEntity<String> changePassword(@RequestBody ChangePassword changePassword) {
		if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
			return ResponseEntity.ok("Lozinke nisu iste!");
		}
		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(usname).orElse(null);
		if (user.isOauth() != null) {
			return ResponseEntity.ok("Github login");
		}
		String encodedPassword = passwordEncoder.encode(changePassword.password());
		userService.updatePassword(user.getEmail(), encodedPassword);
		return ResponseEntity.ok("Lozinka je promijenjena!");
	}

	// Funkcija za dohvat tipa korisnika
	@GetMapping("/getmytype")
	public ResponseEntity<String> getMyType() {
		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(usname).orElse(null);
		if (user == null)
			return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(user.getType().getType().toString());
	}

	// Funkcija za promjenu cijene članarine (admin)
	@GetMapping("/changesubscriptionprice")
	public ResponseEntity<String> changePrice(@RequestParam Long price) {
		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(usname).orElse(null);

		if (!(user instanceof Admin))
			return ResponseEntity.badRequest().build();

		((Admin) user).setSubscriptionprice(price);
		userService.save(user);
		return ResponseEntity.ok("Success");
	}

	// Funkcija za brisanje korisnika (admin)
	@GetMapping("/delete/{username}")
	public ResponseEntity<String> deleteUser(@PathVariable String username) {
		String usname = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		MyUser user = userService.get(usname).orElse(null);

		if (!(user instanceof Admin))
			return ResponseEntity.badRequest().build();

		MyUser removal = userService.get(username).orElse(null);
		if (removal == null)
			return ResponseEntity.badRequest().build();

		userService.remove(removal.getId());
		return ResponseEntity.ok("Success");
	}
}