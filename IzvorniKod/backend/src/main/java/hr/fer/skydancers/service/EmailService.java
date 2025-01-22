package hr.fer.skydancers.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

//Ova klasa predstavlja servis za slanje mailova
@Service
public class EmailService {

	private static final String MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";
	
	@Value("${spring.mail.api}")
	private String MAILERSEND_API_TOKEN;

	private final RestTemplate restTemplate;

	public EmailService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	public void sendEmail(String fromEmail, String toEmail, String subject, String text) {

		Map<String, Object> payload = new HashMap<>();
		payload.put("from", Map.of("email", fromEmail));
		payload.put("to", new Object[] { Map.of("email", toEmail) });
		payload.put("subject", subject);
		payload.put("text", text);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setBearerAuth(MAILERSEND_API_TOKEN);

		HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

		ResponseEntity<String> response = restTemplate.postForEntity(MAILERSEND_API_URL, request, String.class);

		if (response.getStatusCode() == HttpStatus.OK) {
			System.out.println("Email sent successfully: " + response.getBody());
		} else {
			System.err.println("Failed to send email: " + response.getBody());
		}
	}

}
