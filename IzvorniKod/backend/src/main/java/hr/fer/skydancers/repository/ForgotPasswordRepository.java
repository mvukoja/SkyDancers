package hr.fer.skydancers.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import hr.fer.skydancers.model.ForgotPassword;
import hr.fer.skydancers.model.MyUser;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {
	@Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
	Optional<ForgotPassword> findByOtpAndUser(Integer otp, MyUser user);
}
