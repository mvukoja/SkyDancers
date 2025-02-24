package hr.fer.skydancers.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.Dance;

//Ovaj interface predstavlja repozitorij za plesove
@Repository
public interface DanceRepository extends JpaRepository<Dance, Integer> {
	Optional<Dance> findByName(String name);
}
