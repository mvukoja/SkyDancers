package hr.fer.skydancers.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import jakarta.servlet.http.Cookie;

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
			authorize.requestMatchers("/h2-console/**").permitAll();
			authorize.anyRequest().authenticated();
		}).formLogin(form -> form.defaultSuccessUrl("/home", true).permitAll())
		
		.oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    OAuth2User customOAuth2User = (OAuth2User) authentication.getPrincipal();
                    String userId = customOAuth2User.getAttribute("id").toString() + "_" + customOAuth2User.getAttribute("login");
                    
                    Optional<MyUser> existingUser = userService.get(userId);
                    if (existingUser.isEmpty()) {
                        MyUser user = new MyUser();
                        user.setName(customOAuth2User.getAttribute("name"));
                        user.setUsername(userId);
                        user.setPassword(passwordEncoder().encode(customOAuth2User.getAttribute("id").toString()));
                        user.setOauth(true);
                        userService.put(user);
                    }

                    String token = jwtService.generateToken(userService.loadUserByUsername(userId));
                    Cookie jwtCookie = new Cookie("jwtToken", token);
                    jwtCookie.setPath("/");
                    response.addCookie(jwtCookie);
                    response.sendRedirect("http://localhost:3000");
                })
            )
				.logout(logout -> logout.logoutSuccessUrl("/").permitAll())
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