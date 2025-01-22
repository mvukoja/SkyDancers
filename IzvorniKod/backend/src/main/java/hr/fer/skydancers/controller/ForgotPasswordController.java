package hr.fer.skydancers.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.fer.skydancers.dto.ChangePassword;
import hr.fer.skydancers.dto.MailBody;
import hr.fer.skydancers.model.ForgotPassword;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.ForgotPasswordRepository;
import hr.fer.skydancers.service.EmailService;
import hr.fer.skydancers.service.UserService;

//Glavni kontroler vezan uz funkciju zaboravljena lozinka
@RestController
@RequestMapping("/forgotpassword")
public class ForgotPasswordController {

	@Autowired
	private UserService userService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private ForgotPasswordRepository forgotPasswordRepository;

	// Funkcija za potvrdu tj. pronalazak korisnika po mailu
	@PostMapping("/verifymail/{email}")
	public ResponseEntity<String> verifyEmail(@PathVariable String email) {
		MyUser user = userService.getByMail(email).orElse(null);
		if (user == null) {
			return ResponseEntity.ok("Korisnik ne postoji!");
		}
		if (user.isOauth() != null) {
			return ResponseEntity.ok("Github login");
		}

		List<ForgotPassword> prevfp = forgotPasswordRepository.findByUser(user).orElse(null);
		prevfp.forEach(el -> forgotPasswordRepository.delete(el));

		int otp = otpGenerator();
		MailBody mailBody = new MailBody(email, "SkyDancers: Zaboravljena lozinka",
				"Ovo je OTP za vašu zaboravljenu lozinku: " + otp);

		ForgotPassword fp = new ForgotPassword();
		fp.setOtp(otp);
		fp.setExpirDate(LocalDate.now().plusDays(1));
		fp.setUser(user);

		emailService.sendSimpleMessage(mailBody);
		forgotPasswordRepository.save(fp);

		return ResponseEntity.ok("Email poslan");
	}

	// Funkcija za potvrdu OTP koda dobivenog mailom
	@PostMapping("/verifyotp/{otp}/{email}")
	public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
		MyUser user = userService.getByMail(email).orElse(null);
		ForgotPassword fp = forgotPasswordRepository.findByOtpAndUser(otp, user).orElse(null);

		if (fp == null) {
			return ResponseEntity.ok("Neispravan kod!");
		}

		if (fp.getExpirDate().isBefore(LocalDate.now())) {
			forgotPasswordRepository.deleteById(fp.getFpid());
			return ResponseEntity.ok("OTP je istekao!");
		}
		fp.setOtpverified(true);
		forgotPasswordRepository.save(fp);

		return ResponseEntity.ok("Success!");
	}

	// Funkcija za promjenu lozinke nakon potvrde
	@PostMapping("/changepassword/{email}")
	public ResponseEntity<String> changePassword(@PathVariable String email,
			@RequestBody ChangePassword changePassword) {
		if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
			return ResponseEntity.ok("Lozinke nisu iste!");
		}
		MyUser user = userService.getByMail(email).orElse(null);
		ForgotPassword fp = forgotPasswordRepository.findByUser(user).orElse(null).get(0);
		if (fp == null)
			return ResponseEntity.badRequest().build();
		if (!fp.isOtpverified())
			return ResponseEntity.ok("Niste potvrdili OTP");
		String encodedPassword = passwordEncoder.encode(changePassword.password());
		userService.updatePassword(email, encodedPassword);
		forgotPasswordRepository.deleteById(fp.getFpid());
		return ResponseEntity.ok("Lozinka je promijenjena!");
	}

	// Funkcija za generiranje random koda
	private Integer otpGenerator() {
		Random random = new Random();
		return random.nextInt(100000, 999999);
	}
}
