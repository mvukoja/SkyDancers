package hr.fer.skydancers.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	// Dohvaća sve korisnike iz baze podataka
	public Iterable<MyUser> get() {
		return userRepository.findAll();
	}

	// Dohvaća korisnika prema ID-u
	public MyUser get(Integer id) {
		return userRepository.findById(id).orElse(null);
	}

	// Dohvaća korisnika prema korisničkom imenu
	public Optional<MyUser> get(String username) {
		return userRepository.findByUsername(username);
	}

	// Dohvaća korisnika prema oauthu
	public Optional<MyUser> getOauth(String oauth) {
		return userRepository.findByOauth(oauth);
	}

	// Dohvaća korisnika prema emailu
	public Optional<MyUser> getByMail(String email) {
		return userRepository.findByEmail(email);
	}

	// Spremanje novog ili ažuriranje postojećeg korisnika
	public MyUser put(MyUser user) {
		return userRepository.save(user);
	}

	public MyUser save(MyUser user) {
		return userRepository.save(user);
	}

	// Brisanje korisnika prema ID-u
	public void remove(Integer id) {
		userRepository.deleteById(id);
	}

	// Mijenja lozinku korisnika prema mailu
	public void updatePassword(String email, String password) {
		userRepository.updatePassword(email, password);
	}

	// Učitavanje korisničkih podataka za autentifikaciju
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<MyUser> user = userRepository.findByUsername(username);
		if (user.isPresent()) {
			MyUser userObj = user.get();
			return User.builder().username(userObj.getUsername()).password(userObj.getPassword()).roles("USER").build();
		} else {
			throw new UsernameNotFoundException(username);
		}
	}

	// Učitavanje korisničkih podataka za autentifikaciju
	public UserDetails loadUserByOauth(String oauth) throws UsernameNotFoundException {
		Optional<MyUser> user = userRepository.findByOauth(oauth);
		if (user.isPresent()) {
			MyUser userObj = user.get();
			return User.builder().username(userObj.getUsername()).password(userObj.getPassword()).roles("USER").build();
		} else {
			throw new UsernameNotFoundException(oauth);
		}
	}

	// Dohvat plesača po godinama, spolu i stilu plesa
	public List<Dancer> getByAgeAndGenderAndDanceStyle(Integer ageup, Integer agedown, String gender,
			List<String> danceStyleName) {
		return userRepository.findByAgeAndGenderAndDanceStyles(ageup, agedown, gender, danceStyleName).orElse(null);
	}

	public List<MyUser> getByNameLike(String username) {
		return userRepository.findByNameLike(username).orElse(null);
	}
}
