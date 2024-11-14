package hr.fer.skydancers;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.Test;

import io.jsonwebtoken.Jwts;
import jakarta.xml.bind.DatatypeConverter;

public class JwtSecretMakerTest {
	@Test
	public void generateSecretKey() {
		SecretKey key =	Jwts.SIG.HS256.key().build();
		String encodedKey = DatatypeConverter.printHexBinary(key.getEncoded());
		System.out.printf("key = [%s]", encodedKey);
	}
}
