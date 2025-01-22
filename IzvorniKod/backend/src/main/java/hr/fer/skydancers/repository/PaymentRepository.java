package hr.fer.skydancers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.skydancers.model.Payment;

//Ovaj interface predstavlja repozitorij za plaćanja
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
