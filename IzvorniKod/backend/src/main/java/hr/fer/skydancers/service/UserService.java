package hr.fer.skydancers.service;

import org.springframework.stereotype.Service;

import hr.fer.skydancers.model.User;
import hr.fer.skydancers.repository.UserRepository;

@Service
public class UserService{

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Iterable<User> get() {
		return userRepository.findAll();
	}

	public User get(Integer id) {
		return userRepository.findById(id).orElse(null);
	}

	public void put(User user) {
		userRepository.save(user);

	}

	public void remove(Integer id) {
		userRepository.deleteById(id);
	}

}
