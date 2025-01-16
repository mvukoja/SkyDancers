package hr.fer.skydancers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.skydancers.model.UserType;

public interface UserTypeRepository extends JpaRepository<UserType, Integer> {

}
