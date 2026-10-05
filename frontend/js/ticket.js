async function loadTicket() {
    requireRole("USER");
    const registrationId = getQueryParam("registrationId");
    const ticketId = getQueryParam("ticketId");

    if (!registrationId && !ticketId) {
        showAlert("alertBox", "No ticket specified.");
        return;
    }

    try {
        const ticket = ticketId
            ? await api.get(`/tickets/${ticketId}`)
            : await api.get(`/tickets/registration/${registrationId}`);

        document.getElementById("ticketBox").innerHTML = `
            <div class="ticket">
                <div class="ticket-header flex-between">
                    <strong>${escapeHtml(ticket.eventName)}</strong>
                    <span class="badge ${ticket.status === 'VALID' ? 'badge-valid' : 'badge-cancelled'}" style="background:#fff;color:#2d5fda;">${ticket.status}</span>
                </div>
                <div class="ticket-body">
                    <div class="ticket-number">${ticket.ticketNumber}</div>
                    <div class="ticket-row"><span class="label">Attendee</span><span>${escapeHtml(ticket.userName)}</span></div>
                    <div class="ticket-row"><span class="label">Email</span><span>${escapeHtml(ticket.userEmail)}</span></div>
                    <div class="ticket-row"><span class="label">Date</span><span>${formatDate(ticket.eventDate)}</span></div>
                    <div class="ticket-row"><span class="label">Time</span><span>${formatTime(ticket.eventTime)}</span></div>
                    <div class="ticket-row"><span class="label">Venue</span><span>${escapeHtml(ticket.venue)}</span></div>
                    <div class="ticket-row"><span class="label">Issued On</span><span>${formatDateTime(ticket.issueDate)}</span></div>
                </div>
            </div>
        `;
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.addEventListener("DOMContentLoaded", loadTicket);
