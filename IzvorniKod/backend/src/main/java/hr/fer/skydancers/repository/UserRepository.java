package hr.fer.skydancers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.Dancer;
import hr.fer.skydancers.model.MyUser;
import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<MyUser, Integer> {
	Optional<MyUser> findByEmail(String email);

	Optional<MyUser> findByUsername(String username);

	@Transactional
	@Modifying
	@Query("UPDATE MyUser u SET u.password = ?2 WHERE u.email = ?1")
	void updatePassword(String email, String password);

	@Query("select danc from Dancer danc " + "join danc.dancestyles dance " + "join MyUser us on us.id = danc.id "
			+ "where danc.age >= ?1 " + "and danc.age <= ?2 " + "and danc.gender = ?3 " + "and not exists ( "
			+ "    select ds from Dance ds " + "    where ds.name in ?4 "
			+ "    and ds not in (select ds2 from danc.dancestyles ds2) " + ") " + "and not exists ( "
			+ "    select ds3 from danc.dancestyles ds3 " + "    where ds3.name not in ?4 " + ")")
	Optional<Iterable<Dancer>> findByAgeAndGenderAndDanceStyles(Integer ageup, Integer agedown, String gender,
			List<String> danceStyles);

}
