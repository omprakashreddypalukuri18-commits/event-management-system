package com.eventmanagement.dto;

import java.util.List;

/** Everything shown on the User Dashboard screen. */
public class UserDashboardResponse {

    private long totalRegistrations;
    private List<RegistrationResponse> upcomingEvents;
    private List<RegistrationResponse> previousEvents;
    private List<TicketResponse> myTickets;

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public void setTotalRegistrations(long totalRegistrations) {
        this.totalRegistrations = totalRegistrations;
    }

    public List<RegistrationResponse> getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(List<RegistrationResponse> upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public List<RegistrationResponse> getPreviousEvents() {
        return previousEvents;
    }

    public void setPreviousEvents(List<RegistrationResponse> previousEvents) {
        this.previousEvents = previousEvents;
    }

    public List<TicketResponse> getMyTickets() {
        return myTickets;
    }

    public void setMyTickets(List<TicketResponse> myTickets) {
        this.myTickets = myTickets;
    }
}
