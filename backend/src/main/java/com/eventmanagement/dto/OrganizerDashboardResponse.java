package com.eventmanagement.dto;

import java.util.List;

/** Everything shown on the Organizer Dashboard screen. */
public class OrganizerDashboardResponse {

    private long totalEvents;
    private long totalRegistrations;
    private long upcomingEventsCount;
    private List<EventResponse> upcomingEvents;
    private List<EventStat> eventWiseStats;

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public long getUpcomingEventsCount() {
        return upcomingEventsCount;
    }

    public void setUpcomingEventsCount(long upcomingEventsCount) {
        this.upcomingEventsCount = upcomingEventsCount;
    }

    public List<EventResponse> getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(List<EventResponse> upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public List<EventStat> getEventWiseStats() {
        return eventWiseStats;
    }

    public void setEventWiseStats(List<EventStat> eventWiseStats) {
        this.eventWiseStats = eventWiseStats;
    }

    /** Per-event attendee count, nested as a small static class to avoid yet another file. */
    public static class EventStat {
        private Long eventId;
        private String eventName;
        private long registeredCount;
        private Integer maxParticipants;

        public EventStat() {
        }

        public EventStat(Long eventId, String eventName, long registeredCount, Integer maxParticipants) {
            this.eventId = eventId;
            this.eventName = eventName;
            this.registeredCount = registeredCount;
            this.maxParticipants = maxParticipants;
        }

        public Long getEventId() {
            return eventId;
        }

        public void setEventId(Long eventId) {
            this.eventId = eventId;
        }

        public String getEventName() {
            return eventName;
        }

        public void setEventName(String eventName) {
            this.eventName = eventName;
        }

        public long getRegisteredCount() {
            return registeredCount;
        }

        public void setRegisteredCount(long registeredCount) {
            this.registeredCount = registeredCount;
        }

        public Integer getMaxParticipants() {
            return maxParticipants;
        }

        public void setMaxParticipants(Integer maxParticipants) {
            this.maxParticipants = maxParticipants;
        }
    }
}
