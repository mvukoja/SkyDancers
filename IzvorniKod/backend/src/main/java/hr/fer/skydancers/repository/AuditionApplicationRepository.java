package hr.fer.skydancers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.AuditionApplication;
import hr.fer.skydancers.model.Dancer;

@Repository
public interface AuditionApplicationRepository extends JpaRepository<AuditionApplication, Integer> {

	@Query("SELECT a FROM AuditionApplication aa JOIN aa.dancer a JOIN aa.audition au WHERE au.id = :auditionId")
	List<Dancer> findDancersByAuditionId(@Param("auditionId") Integer auditionId);

	@Query("SELECT DISTINCT a.audition FROM AuditionApplication a " + "WHERE a.dancer.id = :dancerId")
	List<Audition> findAuditionsByDancerId(@Param("dancerId") Integer dancerId);

	@Query("SELECT aa FROM AuditionApplication aa " + "JOIN aa.audition a " + "WHERE a.user.id = :userId")
	List<AuditionApplication> findAllByAuditionCreator(@Param("userId") Integer userId);

	@Query("SELECT aa FROM AuditionApplication aa " + "JOIN aa.audition a " + "WHERE a.id = :auditionId")
	List<AuditionApplication> findAllByAuditionId(@Param("auditionId") Integer auditionId);

}
