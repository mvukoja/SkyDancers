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
import hr.fer.skydancers.model.MyUser;

@Service
public class StripeService {
	
	@Autowired
	private UserService userService;
	
	@Value("${stripe.secretKey}")
	private String secretKey;

	public StripeResponse checkout(PaymentRequest req, String principal) {
		Stripe.apiKey = secretKey;

		SessionCreateParams.LineItem.PriceData.ProductData prod = SessionCreateParams.LineItem.PriceData.ProductData
				.builder().setName(req.getName()).build();

		SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
				.setCurrency("EUR").setUnitAmount(req.getAmount()).setProductData(prod).build();

		SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder().setQuantity(1L)
				.setPriceData(priceData).build();

		SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl("http://localhost:8080/users/payment/success/" + principal + "/{CHECKOUT_SESSION_ID}") // Custom success URL
				.setCancelUrl("http://localhost:3000/payment/cancel").addLineItem(lineItem).build();

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
				MyUser user = userService.get(username).orElse(null);
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
