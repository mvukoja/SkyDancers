package hr.fer.skydancers.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//Ovaj interface predstavlja konfiguraciju pristupa serveru
@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("http://localhost:3000")
				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS").allowedHeaders("*")
				.exposedHeaders("Authorization").allowCredentials(true).maxAge(3600);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/uploads/**").addResourceLocations("file:uploads/");
	}
}
