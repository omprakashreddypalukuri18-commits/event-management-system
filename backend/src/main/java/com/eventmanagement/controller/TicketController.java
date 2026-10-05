package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.TicketResponse;
import com.eventmanagement.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getTicketById(id)));
    }

    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketByRegistration(@PathVariable Long registrationId) {
        return ResponseEntity.ok(ApiResponse.ok(ticketService.getTicketByRegistrationId(registrationId)));
    }
}
