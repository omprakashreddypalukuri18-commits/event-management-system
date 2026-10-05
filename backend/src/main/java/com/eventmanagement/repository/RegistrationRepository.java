package com.eventmanagement.repository;

import com.eventmanagement.model.Registration;
import com.eventmanagement.model.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByUserIdOrderByRegistrationDateDesc(Long userId);

    List<Registration> findByEventIdOrderByRegistrationDateAsc(Long eventId);

    Optional<Registration> findByUserIdAndEventIdAndStatus(Long userId, Long eventId, RegistrationStatus status);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    List<Registration> findByEventIdAndStatus(Long eventId, RegistrationStatus status);
}
