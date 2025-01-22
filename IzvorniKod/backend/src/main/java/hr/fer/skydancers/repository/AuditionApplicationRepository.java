package hr.fer.skydancers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.AuditionApplication;

//Ovaj interface predstavlja repozitorij za prijave na audicije
@Repository
public interface AuditionApplicationRepository extends JpaRepository<AuditionApplication, Integer> {
	@Query("SELECT DISTINCT a.audition FROM AuditionApplication a " + "WHERE a.dancer.id = :dancerId")
	List<Audition> findAuditionsByDancerId(@Param("dancerId") Integer dancerId);

	@Query("SELECT aa FROM AuditionApplication aa " + "JOIN aa.audition a " + "WHERE a.id = :auditionId")
	List<AuditionApplication> findAllByAuditionId(@Param("auditionId") Integer auditionId);
}
