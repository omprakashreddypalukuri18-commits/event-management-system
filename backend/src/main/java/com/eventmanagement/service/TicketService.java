package com.eventmanagement.service;

import com.eventmanagement.dto.TicketResponse;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Registration;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.model.TicketStatus;
import com.eventmanagement.repository.TicketRepository;
import com.eventmanagement.util.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /** Creates and persists a brand-new ticket for a just-confirmed registration. */
    public Ticket issueTicket(Registration registration) {
        Ticket ticket = new Ticket();
        ticket.setRegistration(registration);
        ticket.setTicketNumber(generateUniqueTicketNumber());
        ticket.setStatus(TicketStatus.VALID);
        return ticketRepository.save(ticket);
    }

    public void cancelTicketForRegistration(Long registrationId) {
        ticketRepository.findByRegistrationId(registrationId).ifPresent(ticket -> {
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
        });
    }

    public Ticket getTicketEntityById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public TicketResponse getTicketById(Long id) {
        return toResponse(getTicketEntityById(id));
    }

    public TicketResponse getTicketByRegistrationId(Long registrationId) {
        Ticket ticket = ticketRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("No ticket has been issued for this registration yet"));
        return toResponse(ticket);
    }

    private String generateUniqueTicketNumber() {
        String code;
        do {
            code = CodeGenerator.generateTicketNumber();
        } while (ticketRepository.existsByTicketNumber(code));
        return code;
    }

    public TicketResponse toResponse(Ticket ticket) {
        Registration reg = ticket.getRegistration();

        TicketResponse dto = new TicketResponse();
        dto.setTicketId(ticket.getId());
        dto.setTicketNumber(ticket.getTicketNumber());
        dto.setStatus(ticket.getStatus());
        dto.setIssueDate(ticket.getIssueDate());

        dto.setRegistrationId(reg.getId());
        dto.setEventId(reg.getEvent().getId());
        dto.setEventName(reg.getEvent().getName());
        dto.setEventDate(reg.getEvent().getEventDate());
        dto.setEventTime(reg.getEvent().getEventTime());
        dto.setVenue(reg.getEvent().getVenue());

        dto.setUserId(reg.getUser().getId());
        dto.setUserName(reg.getUser().getName());
        dto.setUserEmail(reg.getUser().getEmail());
        return dto;
    }
}
