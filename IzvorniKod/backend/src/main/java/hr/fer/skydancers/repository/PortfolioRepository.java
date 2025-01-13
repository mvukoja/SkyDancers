package hr.fer.skydancers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.skydancers.model.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Integer> {
}
