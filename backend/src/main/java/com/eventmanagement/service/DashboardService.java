package com.eventmanagement.service;

import com.eventmanagement.dto.*;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Registration;
import com.eventmanagement.model.RegistrationStatus;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.RegistrationRepository;
import com.eventmanagement.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class DashboardService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final TicketRepository ticketRepository;
    private final RegistrationService registrationService;
    private final TicketService ticketService;
    private final EventService eventService;

    @Autowired
    public DashboardService(EventRepository eventRepository,
                             RegistrationRepository registrationRepository,
                             TicketRepository ticketRepository,
                             RegistrationService registrationService,
                             TicketService ticketService,
                             EventService eventService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.ticketRepository = ticketRepository;
        this.registrationService = registrationService;
        this.ticketService = ticketService;
        this.eventService = eventService;
    }

    public UserDashboardResponse getUserDashboard(Long userId) {
        List<Registration> all = registrationRepository.findByUserIdOrderByRegistrationDateDesc(userId);
        LocalDate today = LocalDate.now();

        List<RegistrationResponse> upcoming = all.stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .filter(r -> !r.getEvent().getEventDate().isBefore(today))
                .map(registrationService::toResponse)
                .toList();

        List<RegistrationResponse> previous = all.stream()
                .filter(r -> r.getEvent().getEventDate().isBefore(today))
                .map(registrationService::toResponse)
                .toList();

        List<TicketResponse> myTickets = all.stream()
                .map(r -> ticketRepository.findByRegistrationId(r.getId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(ticketService::toResponse)
                .toList();

        long totalRegistrations = all.stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .count();

        UserDashboardResponse dto = new UserDashboardResponse();
        dto.setTotalRegistrations(totalRegistrations);
        dto.setUpcomingEvents(upcoming);
        dto.setPreviousEvents(previous);
        dto.setMyTickets(myTickets);
        return dto;
    }

    public OrganizerDashboardResponse getOrganizerDashboard(Long organizerId) {
        List<Event> events = eventRepository.findByOrganizerId(organizerId);
        LocalDate today = LocalDate.now();

        long totalRegistrations = events.stream()
                .mapToLong(e -> registrationRepository.countByEventIdAndStatus(e.getId(), RegistrationStatus.CONFIRMED))
                .sum();

        List<EventResponse> upcomingEvents = events.stream()
                .filter(e -> !e.getEventDate().isBefore(today))
                .map(eventService::toResponse)
                .toList();

        List<OrganizerDashboardResponse.EventStat> stats = events.stream()
                .map(e -> new OrganizerDashboardResponse.EventStat(
                        e.getId(),
                        e.getName(),
                        registrationRepository.countByEventIdAndStatus(e.getId(), RegistrationStatus.CONFIRMED),
                        e.getMaxParticipants()))
                .toList();

        OrganizerDashboardResponse dto = new OrganizerDashboardResponse();
        dto.setTotalEvents(events.size());
        dto.setTotalRegistrations(totalRegistrations);
        dto.setUpcomingEventsCount(upcomingEvents.size());
        dto.setUpcomingEvents(upcomingEvents);
        dto.setEventWiseStats(stats);
        return dto;
    }
}
