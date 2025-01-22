package hr.fer.skydancers.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

import com.stripe.param.checkout.SessionCreateParams;

import hr.fer.skydancers.dto.PaymentRequest;
import hr.fer.skydancers.dto.StripeResponse;
import hr.fer.skydancers.model.Director;
import hr.fer.skydancers.model.Admin;
import hr.fer.skydancers.model.Payment;
import hr.fer.skydancers.repository.PaymentRepository;

//Ova klasa predstavlja servis za plaćanja direktora
@Service
public class StripeService {

	@Autowired
	private UserService userService;

	@Autowired
	private PaymentRepository paymentRepository;

	@Value("${stripe.secretKey}")
	private String secretKey;

	public StripeResponse checkout(PaymentRequest req, String principal) {
		Stripe.apiKey = secretKey;

		SessionCreateParams.LineItem.PriceData.ProductData prod = SessionCreateParams.LineItem.PriceData.ProductData
				.builder().setName(req.getName()).build();

		SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
				.setCurrency("EUR")
				.setUnitAmount(((Admin) userService.get("admin").orElse(null)).getSubscriptionprice())
				.setProductData(prod).build();

		SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder().setQuantity(1L)
				.setPriceData(priceData).build();

		SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl("https://skydancers.onrender.com/users/payment/success/" + principal + "/{CHECKOUT_SESSION_ID}") // Custom
																														// success
																														// URL
				.setCancelUrl("https://skydancers.onrender.com/payment/cancel").addLineItem(lineItem).build();

		try {
			Session session = Session.create(params);
			StripeResponse response = new StripeResponse();
			response.setStatus("SUCCESS");
			response.setMessage("Payment session created");
			response.setSessionId(session.getId());
			response.setSessionUrl(session.getUrl());
			return response;
		} catch (StripeException e) {
			StripeResponse response = new StripeResponse();
			response.setStatus("FAILED");
			response.setMessage("Payment session failed");
			return response;
		}
	}

	public boolean processPaymentSuccess(String sessionId, String username) {
		try {
			Session session = Session.retrieve(sessionId);
			if ("paid".equals(session.getPaymentStatus())) {
				Director user = (Director) userService.get(username).orElse(null);
				Payment payment = new Payment();
				payment.setAmount(100);
				payment.setDate(LocalDate.now());
				payment.setUser(user);
				payment.setExpiration(LocalDate.now().plusYears(1));
				paymentRepository.save(payment);

				user.setSubscription(LocalDate.now().plusYears(1));
				user.setPaid(true);
				userService.save(user);
				return true;
			} else {
				System.out.println("Payment not complete for session: " + sessionId);
			}
		} catch (StripeException e) {
			System.out.println("Error processing payment success: " + e.getMessage());
		}
		return false;
	}
}
