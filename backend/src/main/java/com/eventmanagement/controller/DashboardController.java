package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.OrganizerDashboardResponse;
import com.eventmanagement.dto.UserDashboardResponse;
import com.eventmanagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getUserDashboard(userId)));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<OrganizerDashboardResponse>> getOrganizerDashboard(@PathVariable Long organizerId) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getOrganizerDashboard(organizerId)));
    }
}
