package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.RegistrationRequest;
import com.eventmanagement.dto.RegistrationResponse;
import com.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(@Valid @RequestBody RegistrationRequest request) {
        RegistrationResponse response = registrationService.registerForEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Registration confirmed", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(registrationService.getRegistrationById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(registrationService.getRegistrationsByUser(userId)));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.ok(registrationService.getRegistrationsByEvent(eventId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.<Void>ok("Registration cancelled", null));
    }
}
