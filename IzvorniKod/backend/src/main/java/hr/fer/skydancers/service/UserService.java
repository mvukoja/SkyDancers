package hr.fer.skydancers.service;

import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.UserRepository;

@Service
public class UserService implements UserDetailsService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Iterable<MyUser> get() {
		return userRepository.findAll();
	}

	public MyUser get(Integer id) {
		return userRepository.findById(id).orElse(null);
	}

	public Optional<MyUser> get(String email) {
		return userRepository.findByEmail(email);
	}
	
	public MyUser put(MyUser user) {
		return userRepository.save(user);
	}

	public void remove(Integer id) {
		userRepository.deleteById(id);
	}

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

}
