package hr.fer.skydancers.security;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
import hr.fer.skydancers.service.UserService;
import hr.fer.skydancers.webtoken.JwtAuthenticationFilter;
import hr.fer.skydancers.webtoken.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	private JwtService jwtService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> {
					authorize.requestMatchers("/home", "/users/register/**", "/users/authenticate/**").permitAll();
					authorize.requestMatchers("/admin/**").hasRole("ADMIN");
					authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
					authorize.requestMatchers("/h2-console/**").permitAll();
					authorize.anyRequest().authenticated();
				}).formLogin(form -> form.defaultSuccessUrl("/home", true).permitAll())

				.oauth2Login(oauth2 -> oauth2.successHandler((request, response, authentication) -> {
					OAuth2User customOAuth2User = (OAuth2User) authentication.getPrincipal();
					String userId = customOAuth2User.getAttribute("id").toString() + "_"
							+ customOAuth2User.getAttribute("login") + "_oauth";

					Optional<MyUser> existingUser = userService.get(userId);
					if (existingUser.isEmpty()) {
						MyUser user = new MyUser();
						String name = customOAuth2User.getAttribute("name");
						user.setName(name.split(" ")[0]);
						user.setSurname(name.split(" ")[1]);
						user.setUsername(userId);
						user.setPassword(passwordEncoder().encode(UUID.randomUUID().toString()));
						user.setOauth(true);
						user.setFinishedoauth(false);
						userService.put(user);
					}
					boolean finished = false;
					if (!existingUser.isEmpty() && existingUser.get().isFinishedOauth()) {
						finished = true;
					}
					String token = jwtService.generateToken(userService.loadUserByUsername(userId));
					response.sendRedirect("http://localhost:3000/oauth-completion?jwt=" + token + "&&finished=" + finished);
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