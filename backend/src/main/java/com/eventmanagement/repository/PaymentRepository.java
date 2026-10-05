package com.eventmanagement.repository;

import com.eventmanagement.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRegistrationId(Long registrationId);

    boolean existsByTransactionId(String transactionId);
}
