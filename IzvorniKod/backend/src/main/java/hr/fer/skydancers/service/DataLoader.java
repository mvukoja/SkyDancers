package hr.fer.skydancers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import hr.fer.skydancers.model.Dance;
import hr.fer.skydancers.repository.DanceRepository;

@Component
public class DataLoader implements CommandLineRunner {

	@Autowired
	private DanceRepository danceRepository;

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
	}
}
