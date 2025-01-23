package hr.fer.skydancers.webtoken;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

//Ova klasa predstavlja servis za JWT
@Service
public class JwtService {

	@Value("${secret.key}")
	private String SECRET;

	private static final long VALIDITY = TimeUnit.MINUTES.toMillis(60);

	public String generateToken(UserDetails userDetails) {
		return Jwts.builder().subject(userDetails.getUsername()).issuedAt(Date.from(Instant.now()))
				.expiration(Date.from(Instant.now().plusMillis(VALIDITY))).signWith(generateKey()).compact();
	}

	private SecretKey generateKey() {
		byte[] decodedKey = Base64.getDecoder().decode(SECRET);
		return Keys.hmacShaKeyFor(decodedKey);
	}

	public String extractUsername(String jwt) {
		Claims claims = Jwts.parser().verifyWith(generateKey()).build().parseSignedClaims(jwt).getPayload();
		return claims.getSubject();
	}

	public boolean isTokenValid(String jwt) {
		return Jwts.parser().verifyWith(generateKey()).build().parseSignedClaims(jwt).getPayload().getExpiration()
				.after(Date.from(Instant.now()));
	}
}
