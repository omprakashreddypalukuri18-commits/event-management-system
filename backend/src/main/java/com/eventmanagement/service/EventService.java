package com.eventmanagement.service;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.dto.EventResponse;
import com.eventmanagement.exception.BadRequestException;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.EventStatus;
import com.eventmanagement.model.RegistrationStatus;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Transactional at class level keeps the Hibernate session open for the whole
 * method call, so lazy associations (e.g. Event.organizer) can still be read
 * while mapping entities to response DTOs. Without this, reading a lazy field
 * after the repository call returns throws LazyInitializationException,
 * since spring.jpa.open-in-view is disabled.
 */
@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserService userService;

    @Autowired
    public EventService(EventRepository eventRepository,
                         RegistrationRepository registrationRepository,
                         UserService userService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userService = userService;
    }

    public EventResponse createEvent(EventRequest request) {
        if (request.getOrganizerId() == null) {
            throw new BadRequestException("organizerId is required to create an event");
        }
        User organizer = userService.getUserEntityById(request.getOrganizerId());

        Event event = new Event();
        applyRequest(event, request);
        event.setOrganizer(organizer);
        event.setRegistrationStatus(EventStatus.OPEN);

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    public EventResponse updateEvent(Long eventId, EventRequest request) {
        Event event = getEventEntity(eventId);

        if (request.getOrganizerId() != null && !event.getOrganizer().getId().equals(request.getOrganizerId())) {
            throw new BadRequestException("You are not authorized to update this event");
        }

        applyRequest(event, request);
        Event saved = eventRepository.save(event);
        refreshRegistrationStatus(saved);
        return toResponse(eventRepository.save(saved));
    }

    public void deleteEvent(Long eventId, Long organizerId) {
        Event event = getEventEntity(eventId);
        if (organizerId != null && !event.getOrganizer().getId().equals(organizerId)) {
            throw new BadRequestException("You are not authorized to delete this event");
        }
        eventRepository.delete(event);
    }

    public EventResponse getEventById(Long id) {
        return toResponse(getEventEntity(id));
    }

    public Event getEventEntity(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public List<EventResponse> getAllEvents(String keyword, String category) {
        List<Event> events;
        if (keyword != null && !keyword.isBlank()) {
            events = eventRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(keyword, keyword);
        } else if (category != null && !category.isBlank()) {
            events = eventRepository.findByCategoryIgnoreCase(category);
        } else {
            events = eventRepository.findAll();
        }
        return events.stream().map(this::toResponse).toList();
    }

    public List<EventResponse> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId).stream().map(this::toResponse).toList();
    }

    /** Recomputes OPEN/CLOSED based on current confirmed registration count. Called after register/cancel too. */
    public void refreshRegistrationStatus(Event event) {
        long confirmed = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CONFIRMED);
        event.setRegistrationStatus(confirmed >= event.getMaxParticipants() ? EventStatus.CLOSED : EventStatus.OPEN);
    }

    private void applyRequest(Event event, EventRequest request) {
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setVenue(request.getVenue());
        event.setCategory(request.getCategory());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setTicketPrice(request.getTicketPrice());
    }

    public EventResponse toResponse(Event event) {
        long registeredCount = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CONFIRMED);

        EventResponse dto = new EventResponse();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setEventTime(event.getEventTime());
        dto.setVenue(event.getVenue());
        dto.setCategory(event.getCategory());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setTicketPrice(event.getTicketPrice());
        dto.setRegistrationStatus(event.getRegistrationStatus());
        dto.setOrganizerId(event.getOrganizer().getId());
        dto.setOrganizerName(event.getOrganizer().getName());
        dto.setRegisteredCount(registeredCount);
        dto.setAvailableSeats(Math.max(0, event.getMaxParticipants() - registeredCount));
        return dto;
    }
}
