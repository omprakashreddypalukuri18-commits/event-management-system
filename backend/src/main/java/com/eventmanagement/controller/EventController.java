package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.dto.EventResponse;
import com.eventmanagement.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /** Browse / search events. Both params are optional; omit both to list everything. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAllEvents(keyword, category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEventById(id)));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByOrganizer(@PathVariable Long organizerId) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getEventsByOrganizer(organizerId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        EventResponse created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Event created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(@PathVariable Long id,
                                                                    @Valid @RequestBody EventRequest request) {
        EventResponse updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Event updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id,
                                                           @RequestParam(required = false) Long organizerId) {
        eventService.deleteEvent(id, organizerId);
        return ResponseEntity.ok(ApiResponse.<Void>ok("Event deleted successfully", null));
    }
}
