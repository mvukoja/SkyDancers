package hr.fer.skydancers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hr.fer.skydancers.model.ForgotPassword;
import hr.fer.skydancers.model.MyUser;

//Ovaj interface predstavlja repozitorij za zaboravljene lozinke
public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {
	@Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
	Optional<ForgotPassword> findByOtpAndUser(Integer otp, MyUser user);

	@Query("select fp from ForgotPassword fp where fp.user = ?1")
	Optional<List<ForgotPassword>> findByUser(MyUser user);
}
