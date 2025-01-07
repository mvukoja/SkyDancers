package hr.fer.skydancers.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "forgotpassword")
public class ForgotPassword {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer fpid;

	@Column(nullable = false)
	private Integer otp;

	@Column(nullable = false)
	private LocalDate expirdate;

	@OneToOne
	private MyUser user;

	public ForgotPassword() {
	}

	public ForgotPassword(Integer fpid, Integer otp, LocalDate expirDate, MyUser user) {
		super();
		this.fpid = fpid;
		this.otp = otp;
		this.expirdate = expirDate;
		this.user = user;
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

	public void setExpirDate(LocalDate localDate) {
		this.expirdate = localDate;
	}

	public MyUser getUser() {
		return user;
	}

	public void setUser(MyUser user) {
		this.user = user;
	}

}
