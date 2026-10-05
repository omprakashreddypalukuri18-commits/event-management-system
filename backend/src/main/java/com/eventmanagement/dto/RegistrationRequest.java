package com.eventmanagement.dto;

import jakarta.validation.constraints.NotNull;

/** Body for POST /api/registrations. */
public class RegistrationRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Event id is required")
    private Long eventId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
