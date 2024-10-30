package hr.fer.skydancers.repository;

import org.springframework.data.repository.CrudRepository;

import hr.fer.skydancers.model.User;

public interface UserRepository extends CrudRepository<User, Integer> {
}
