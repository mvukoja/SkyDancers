package hr.fer.skydancers.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hr.fer.skydancers.model.Audition;
import hr.fer.skydancers.model.MyUser;
import hr.fer.skydancers.repository.AuditionRepository;

@Service
public class AuditionService {
	
	@Autowired
	private AuditionRepository auditionRepository;
	
	public Iterable<Audition> get(){
		return auditionRepository.findAll();
	}
	
	public Audition get(Integer id) {
		return auditionRepository.findById(id).orElse(null);
	}
	
	public Audition put(Audition audition) {
		return auditionRepository.save(audition);
	}
	
	public List<Audition> getByDirector(MyUser user) {
		return auditionRepository.findByDirector(user).orElse(null);
	}
	
	public void remove(Audition audition) {
		auditionRepository.delete(audition);
	}
}
