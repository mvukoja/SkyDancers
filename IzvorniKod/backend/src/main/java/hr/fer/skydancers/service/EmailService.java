package hr.fer.skydancers.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import hr.fer.skydancers.dto.MailBody;

@Service
public class EmailService {

	@Value("${spring.mail.username}")
	private String from;

	private final JavaMailSender javaMailSender;

	public EmailService(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	public void sendSimpleMessage(MailBody mailBody) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(mailBody.to());
		message.setFrom(from);
		message.setSubject(mailBody.subject());
		message.setText(mailBody.text());

		javaMailSender.send(message);
	}

}
