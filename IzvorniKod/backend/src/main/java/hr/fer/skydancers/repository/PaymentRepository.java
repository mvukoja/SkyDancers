package hr.fer.skydancers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.skydancers.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
