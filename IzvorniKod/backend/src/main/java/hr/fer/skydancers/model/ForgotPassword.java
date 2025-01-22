package hr.fer.skydancers.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

//Ova klasa predstavlja Zaboravljenu lozinku
@Entity
@Table(name = "forgotpassword")
public class ForgotPassword {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer fpid;

	@Column(nullable = false)
	private Integer otp; // OTP kod

	@Column(nullable = false)
	private LocalDate expirdate; // datum isteka

	@OneToOne
	private MyUser user; // korisnik

	private boolean otpverified; // je li potvrđen OTP

	public ForgotPassword() {
	}

	public ForgotPassword(Integer fpid, Integer otp, LocalDate expirdate, MyUser user, boolean otpverified) {
		super();
		this.fpid = fpid;
		this.otp = otp;
		this.expirdate = expirdate;
		this.user = user;
		this.otpverified = otpverified;
	}

	public Integer getFpid() {
		return fpid;
	}

	public void setFpid(Integer fpid) {
		this.fpid = fpid;
	}

	public Integer getOtp() {
		return otp;
	}

	public void setOtp(Integer otp) {
		this.otp = otp;
	}

	public LocalDate getExpirDate() {
		return expirdate;
	}

	public void setExpirDate(LocalDate expirdate) {
		this.expirdate = expirdate;
	}

	public MyUser getUser() {
		return user;
	}

	public void setUser(MyUser user) {
		this.user = user;
	}

	public boolean isOtpverified() {
		return otpverified;
	}

	public void setOtpverified(boolean otpverified) {
		this.otpverified = otpverified;
	}

}
