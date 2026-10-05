async function loadOrganizerDashboard() {
    const user = requireRole("ORGANIZER");
    if (!user) return;

    try {
        const data = await api.get(`/dashboard/organizer/${user.id}`);

        document.getElementById("tiles").innerHTML = `
            <div class="tile"><div class="tile-icon c1">🎪</div><div class="value">${data.totalEvents}</div><div class="label">Total Events</div></div>
            <div class="tile"><div class="tile-icon c2">🧾</div><div class="value">${data.totalRegistrations}</div><div class="label">Total Registrations</div></div>
            <div class="tile"><div class="tile-icon c3">📅</div><div class="value">${data.upcomingEventsCount}</div><div class="label">Upcoming Events</div></div>
        `;

        document.getElementById("upcomingList").innerHTML = data.upcomingEvents.length
            ? `<div class="poster-grid">${data.upcomingEvents.map(e => `
                <a class="event-card" href="attendees.html?eventId=${e.id}">
                    <div class="event-card-img" style="background-image:url('${getCategoryImage(e.category)}')"></div>
                    <div class="event-card-scrim"></div>
                    <span class="event-card-status badge ${badgeClass(e.registrationStatus)}">${e.registrationStatus}</span>
                    <div class="event-card-body">
                        <span class="chip">${escapeHtml(e.category)}</span>
                        <h3>${escapeHtml(e.name)}</h3>
                        <div class="meta-row">📅 ${formatDate(e.eventDate)} &middot; 📍 ${escapeHtml(e.venue)}</div>
                        <div class="card-foot">
                            <span class="seats">${e.registeredCount}/${e.maxParticipants} registered</span>
                        </div>
                    </div>
                </a>
            `).join("")}</div>`
            : `<p class="muted">No upcoming events. <a href="event-form.html">Create one</a></p>`;

        document.getElementById("statsTable").innerHTML = data.eventWiseStats.length
            ? `<div class="table-wrap"><table>
                <tr><th>Event</th><th>Registered</th><th>Capacity</th><th>Attendees</th></tr>
                ${data.eventWiseStats.map(s => `
                    <tr>
                        <td>${escapeHtml(s.eventName)}</td>
                        <td>${s.registeredCount}</td>
                        <td>${s.maxParticipants}</td>
                        <td><a class="btn small secondary" href="attendees.html?eventId=${s.eventId}">View Attendees</a></td>
                    </tr>
                `).join("")}
            </table></div>`
            : `<p class="muted">No events created yet.</p>`;
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.addEventListener("DOMContentLoaded", loadOrganizerDashboard);
