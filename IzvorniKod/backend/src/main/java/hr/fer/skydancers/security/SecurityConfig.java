package hr.fer.skydancers.security;

import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.model.UserType;
import hr.fer.skydancers.service.UserService;
import hr.fer.skydancers.webtoken.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;

//Ova klasa predstavlja konfiguraciju sigurnosnih postavki aplikacije
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Value("${frontend.url}")
	private String frontendUrl;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configure(http))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> {
					authorize
							.requestMatchers("/home", "/users/register/**", "/users/complete-oauth",
									"/users/authenticateoauth", "/users/registerdancer", "/users/registerdirector",
									"/users/authenticate", "/users/payment/**", "/forgotpassword/**", "/uploads/**")
							.permitAll();
					authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
					authorize.anyRequest().authenticated();
				}).exceptionHandling(exceptionHandling -> exceptionHandling
						.accessDeniedHandler((request, response, accessDeniedException) -> {
							response.setStatus(HttpServletResponse.SC_FORBIDDEN);
						}).authenticationEntryPoint((request, response, authException) -> {
							response.setStatus(HttpServletResponse.SC_FORBIDDEN);
						}))
				.formLogin(form -> form.defaultSuccessUrl("/home", true).permitAll())
				.oauth2Login(oauth2 -> oauth2.successHandler((request, response, authentication) -> {
					OAuth2User customOAuth2User = (OAuth2User) authentication.getPrincipal();
					String userId = customOAuth2User.getAttribute("id").toString()
							+ Base64.getEncoder()
									.encodeToString(customOAuth2User.getAttribute("id").toString().getBytes())
							+ "_" + customOAuth2User.getAttribute("login") + "_oauth";

					Optional<MyUser> existingUser = userService.getOauth(userId);
					if (existingUser.isEmpty()) {
						MyUser user = new MyUser();
						String name = customOAuth2User.getAttribute("name");
						try {
							user.setName(name.split(" ")[0]);
							user.setSurname(name.split(" ")[1]);
						} catch (Exception e) {
							user.setName(name);
						}
						user.setUsername(passwordEncoder().encode(UUID.randomUUID().toString()));
						user.setPassword(passwordEncoder().encode(UUID.randomUUID().toString()));
						user.setOauth(userId);
						user.setFinishedoauth(false);
						user.setType(new UserType());
						userService.put(user);
					}
					boolean finished = false;
					if (!existingUser.isEmpty() && existingUser.get().isFinishedoauth()) {
						finished = true;
					}
					response.sendRedirect(frontendUrl + "/oauth-completion?oauth=" + userId + "&finished=" + finished);
				})).logout(logout -> logout.logoutSuccessUrl("/").permitAll())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return userService;
	}

	@Bean
	public AuthenticationManager authenticationManager() {
		return new ProviderManager(authenticationProvider());
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(userService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

}