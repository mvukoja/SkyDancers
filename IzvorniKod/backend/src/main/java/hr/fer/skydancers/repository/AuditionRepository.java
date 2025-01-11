package hr.fer.skydancers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.MyUser;

public interface AuditionRepository extends JpaRepository<Audition, Integer>{

	@Query("select aud from Audition aud where aud.user = ?1")
	Optional<List<Audition>> findByDirector(MyUser user);
}
