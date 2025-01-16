package hr.fer.skydancers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import hr.fer.skydancers.model.Admin;
import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.model.Portfolio;
import hr.fer.skydancers.model.UserType;
import hr.fer.skydancers.repository.DanceRepository;
import hr.fer.skydancers.repository.PortfolioRepository;

@Component
public class DataLoader implements CommandLineRunner {

	@Autowired
	private DanceRepository danceRepository;
	
	@Autowired
	private PortfolioRepository portfolioRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {

		if (danceRepository.count() == 0) {
			Dance balet = new Dance();
			balet.setName("Balet");
			danceRepository.save(balet);

			Dance jazz = new Dance();
			jazz.setName("Jazz");
			danceRepository.save(jazz);

			Dance hipHop = new Dance();
			hipHop.setName("Hip-Hop");
			danceRepository.save(hipHop);

			Dance salsa = new Dance();
			salsa.setName("Salsa");
			danceRepository.save(salsa);

			Dance tango = new Dance();
			tango.setName("Tango");
			danceRepository.save(tango);

			Dance valcer = new Dance();
			valcer.setName("Valcer");
			danceRepository.save(valcer);

			Dance breakdance = new Dance();
			breakdance.setName("Breakdance");
			danceRepository.save(breakdance);

			Dance suvremeni = new Dance();
			suvremeni.setName("Suvremeni");
			danceRepository.save(suvremeni);
		}
		if(!userService.get("admin").isPresent()) {
			Admin admin = new Admin();
			admin.setConfirmed(true);
			admin.setUsername("admin");
			admin.setName("Admin");
			admin.setPassword(passwordEncoder.encode("jedanjeadmin"));
			admin.setType( new UserType("ADMIN"));
			admin.setSubscriptionprice(100l);
			userService.save(admin);
			
			Portfolio portfolio = new Portfolio();
			portfolio.setUser(admin);
			portfolioRepository.save(portfolio);
		}
		
	}
}
