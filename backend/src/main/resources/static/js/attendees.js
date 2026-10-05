const attendeesEventId = getQueryParam("eventId");

async function loadAttendees() {
    const organizer = requireRole("ORGANIZER");
    if (!organizer) return;

    if (!attendeesEventId) {
        showAlert("alertBox", "No event specified.");
        return;
    }

    try {
        const event = await api.get(`/events/${attendeesEventId}`);
        document.getElementById("pageTitle").textContent = `Attendees - ${event.name}`;

        const registrations = await api.get(`/registrations/event/${attendeesEventId}`);
        const confirmed = registrations.filter(r => r.status === "CONFIRMED");

        document.getElementById("summary").innerHTML = `
            <div class="tile"><div class="value">${confirmed.length}</div><div class="label">Confirmed</div></div>
            <div class="tile"><div class="value">${event.maxParticipants}</div><div class="label">Capacity</div></div>
            <div class="tile"><div class="value">${event.availableSeats}</div><div class="label">Seats Left</div></div>
        `;

        renderTable(registrations);
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

function renderTable(registrations) {
    const container = document.getElementById("attendeesTable");

    if (!registrations.length) {
        container.innerHTML = `<div class="empty-state">No one has registered for this event yet.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <tr><th>Name</th><th>Email</th><th>Registered On</th><th>Status</th><th>Ticket</th></tr>
                ${registrations.map(r => `
                    <tr>
                        <td>${escapeHtml(r.userName)}</td>
                        <td>${escapeHtml(r.userEmail)}</td>
                        <td>${formatDateTime(r.registrationDate)}</td>
                        <td><span class="${badgeClass(r.status)}">${r.status}</span></td>
                        <td>${r.ticketNumber ? r.ticketNumber : (r.paymentRequired ? "Awaiting payment" : "-")}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", loadAttendees);
