package hr.fer.skydancers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hr.fer.skydancers.model.DirectOffer;

//Ovaj interface predstavlja repozitorij za direktne ponude
@Repository
public interface DirectOfferRepository extends JpaRepository<DirectOffer, Integer> {

	@Query("SELECT o FROM DirectOffer o WHERE o.director.id = :directorId")
	List<DirectOffer> findAllByDirectorId(@Param("directorId") Integer directorId);

	@Query("SELECT o FROM DirectOffer o WHERE o.dancer.id = :dancerId")
	List<DirectOffer> findAllByDancerId(@Param("dancerId") Integer dancerId);
}
