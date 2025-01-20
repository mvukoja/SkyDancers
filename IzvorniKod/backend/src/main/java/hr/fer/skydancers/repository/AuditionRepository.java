package hr.fer.skydancers.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.MyUser;

@Repository
public interface AuditionRepository extends JpaRepository<Audition, Integer> {

	@Query("select aud from Audition aud where aud.user = ?1")
	Optional<List<Audition>> findByDirector(MyUser user);

	@Query("SELECT a FROM Audition a " + "JOIN a.styles d " + "WHERE DATE(a.datetime) <= :datetime "
			+ "AND a.wage >= :wage " + "AND lower(trim(a.location)) = lower(trim(:location)) " + "AND NOT EXISTS ( "
			+ "    SELECT 1 FROM a.styles ds " + "    WHERE ds.name NOT IN :styles " + "    AND ds.name = d.name "
			+ ") " + "AND EXISTS ( " + "    SELECT 1 FROM a.styles ds " + "    WHERE ds.name IN :styles "
			+ "    AND ds.name = d.name " + ")")
	Optional<List<Audition>> findByFilter(@Param("datetime") LocalDate datetime, @Param("wage") Integer wage,
			@Param("location") String location, @Param("styles") List<String> styles);
	
	@Query("SELECT a FROM Audition a " + "JOIN a.styles d " + "WHERE lower(trim(a.location)) = lower(trim(:location)) " + "AND NOT EXISTS ( "
			+ "    SELECT 1 FROM a.styles ds " + "    WHERE ds.name NOT IN :styles " + "    AND ds.name = d.name "
			+ ") " + "AND EXISTS ( " + "    SELECT 1 FROM a.styles ds " + "    WHERE ds.name IN :styles "
			+ "    AND ds.name = d.name " + ")")
	Optional<List<Audition>> findByPreference(@Param("location") String location, @Param("styles") List<String> styles);
}
