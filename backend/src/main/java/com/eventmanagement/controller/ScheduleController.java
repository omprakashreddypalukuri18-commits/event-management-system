package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.ScheduleRequest;
import com.eventmanagement.dto.ScheduleResponse;
import com.eventmanagement.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedule(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.ok(scheduleService.getScheduleForEvent(eventId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> addSession(@Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse created = scheduleService.addSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Session added", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSession(@PathVariable Long id,
                                                                         @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Session updated", scheduleService.updateSession(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSession(@PathVariable Long id) {
        scheduleService.deleteSession(id);
        return ResponseEntity.ok(ApiResponse.<Void>ok("Session deleted", null));
    }
}
