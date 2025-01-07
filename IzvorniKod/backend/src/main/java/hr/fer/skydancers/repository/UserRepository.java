package hr.fer.skydancers.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

}
