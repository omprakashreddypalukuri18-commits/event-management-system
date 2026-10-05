async function loadUserDashboard() {
    const user = requireRole("USER");
    if (!user) return;

    try {
        const data = await api.get(`/dashboard/user/${user.id}`);

        document.getElementById("tiles").innerHTML = `
            <div class="tile"><div class="tile-icon c1">✅</div><div class="value">${data.totalRegistrations}</div><div class="label">Active Registrations</div></div>
            <div class="tile"><div class="tile-icon c2">📅</div><div class="value">${data.upcomingEvents.length}</div><div class="label">Upcoming Events</div></div>
            <div class="tile"><div class="tile-icon c3">🎟️</div><div class="value">${data.myTickets.length}</div><div class="label">Tickets Issued</div></div>
        `;

        document.getElementById("upcomingList").innerHTML = data.upcomingEvents.length
            ? listAsCards(data.upcomingEvents)
            : `<p class="muted">No upcoming events. <a href="index.html">Browse events</a></p>`;

        document.getElementById("previousList").innerHTML = data.previousEvents.length
            ? listAsCards(data.previousEvents)
            : `<p class="muted">No past events yet.</p>`;

        document.getElementById("ticketsList").innerHTML = data.myTickets.length
            ? data.myTickets.map(t => `
                <div class="card" style="max-width:400px;">
                    <h3>${escapeHtml(t.eventName)}</h3>
                    <div class="ticket-number" style="font-size:16px;">${t.ticketNumber}</div>
                    <div class="meta">${formatDate(t.eventDate)} &middot; ${escapeHtml(t.venue)}</div>
                    <span class="${t.status === 'VALID' ? 'badge badge-valid' : 'badge badge-cancelled'}">${t.status}</span>
                    <a class="btn small" href="ticket.html?ticketId=${t.ticketId}">View Ticket</a>
                </div>
            `).join("")
            : `<p class="muted">No tickets yet.</p>`;
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

function listAsCards(registrations) {
    return `<div class="grid">${registrations.map(r => `
        <div class="card">
            <h3>${escapeHtml(r.eventName)}</h3>
            <div class="meta">📅 ${formatDate(r.eventDate)} &middot; 📍 ${escapeHtml(r.venue)}</div>
            <span class="${badgeClass(r.status)}">${r.status}</span>
        </div>
    `).join("")}</div>`;
}

document.addEventListener("DOMContentLoaded", loadUserDashboard);
