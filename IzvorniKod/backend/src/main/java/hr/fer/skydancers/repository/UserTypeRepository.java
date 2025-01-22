package hr.fer.skydancers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.skydancers.model.UserType;

//Ovaj interface predstavlja repozitorij za tip korisnika
public interface UserTypeRepository extends JpaRepository<UserType, Integer> {
}
