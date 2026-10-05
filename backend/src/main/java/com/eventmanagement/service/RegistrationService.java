package com.eventmanagement.service;

import com.eventmanagement.dto.RegistrationRequest;
import com.eventmanagement.dto.RegistrationResponse;
import com.eventmanagement.exception.BadRequestException;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.*;
import com.eventmanagement.repository.RegistrationRepository;
import com.eventmanagement.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;
    private final EventService eventService;
    private final UserService userService;
    private final TicketService ticketService;

    @Autowired
    public RegistrationService(RegistrationRepository registrationRepository,
                                TicketRepository ticketRepository,
                                EventService eventService,
                                UserService userService,
                                TicketService ticketService) {
        this.registrationRepository = registrationRepository;
        this.ticketRepository = ticketRepository;
        this.eventService = eventService;
        this.userService = userService;
        this.ticketService = ticketService;
    }

    /**
     * Registers a user for an event.
     * - Free events: a ticket is generated immediately.
     * - Paid events: the seat is reserved (status CONFIRMED) but the ticket is only
     *   generated once PaymentService.processPayment() is called for this registration.
     */
    public RegistrationResponse registerForEvent(RegistrationRequest request) {
        User user = userService.getUserEntityById(request.getUserId());
        Event event = eventService.getEventEntity(request.getEventId());

        registrationRepository.findByUserIdAndEventIdAndStatus(user.getId(), event.getId(), RegistrationStatus.CONFIRMED)
                .ifPresent(r -> {
                    throw new BadRequestException("You are already registered for this event");
                });

        long confirmedCount = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CONFIRMED);
        if (confirmedCount >= event.getMaxParticipants()) {
            throw new BadRequestException("This event is already full");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(RegistrationStatus.CONFIRMED);
        Registration saved = registrationRepository.save(registration);

        eventService.refreshRegistrationStatus(event);

        boolean isPaid = event.getTicketPrice() != null && event.getTicketPrice() > 0;
        if (!isPaid) {
            ticketService.issueTicket(saved);
        }

        return toResponse(saved);
    }

    public List<RegistrationResponse> getRegistrationsByUser(Long userId) {
        return registrationRepository.findByUserIdOrderByRegistrationDateDesc(userId)
                .stream().map(this::toResponse).toList();
    }

    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventIdOrderByRegistrationDateAsc(eventId)
                .stream().map(this::toResponse).toList();
    }

    public Registration getRegistrationEntity(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + id));
    }

    public RegistrationResponse getRegistrationById(Long id) {
        return toResponse(getRegistrationEntity(id));
    }

    public void cancelRegistration(Long registrationId) {
        Registration registration = getRegistrationEntity(registrationId);
        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("This registration is already cancelled");
        }
        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);

        ticketService.cancelTicketForRegistration(registrationId);
        eventService.refreshRegistrationStatus(registration.getEvent());
    }

    public RegistrationResponse toResponse(Registration registration) {
        RegistrationResponse dto = new RegistrationResponse();
        dto.setRegistrationId(registration.getId());
        dto.setUserId(registration.getUser().getId());
        dto.setUserName(registration.getUser().getName());
        dto.setUserEmail(registration.getUser().getEmail());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventName(registration.getEvent().getName());
        dto.setEventDate(registration.getEvent().getEventDate());
        dto.setVenue(registration.getEvent().getVenue());
        dto.setTicketPrice(registration.getEvent().getTicketPrice());
        dto.setRegistrationDate(registration.getRegistrationDate());
        dto.setStatus(registration.getStatus());

        boolean isPaid = registration.getEvent().getTicketPrice() != null && registration.getEvent().getTicketPrice() > 0;
        var existingTicket = ticketRepository.findByRegistrationId(registration.getId());
        dto.setPaymentRequired(isPaid && existingTicket.isEmpty() && registration.getStatus() == RegistrationStatus.CONFIRMED);
        existingTicket.ifPresent(t -> dto.setTicketNumber(t.getTicketNumber()));

        return dto;
    }
}
