let organizerUser = null;

async function loadMyEvents() {
    organizerUser = requireRole("ORGANIZER");
    if (!organizerUser) return;

    try {
        const events = await api.get(`/events/organizer/${organizerUser.id}`);
        renderTable(events);
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

function renderTable(events) {
    const container = document.getElementById("eventsTable");

    if (!events.length) {
        container.innerHTML = `<div class="empty-state">You haven't created any events yet. <a href="event-form.html">Create your first event</a></div>`;
        return;
    }

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <tr>
                    <th>Name</th><th>Date</th><th>Category</th><th>Price</th>
                    <th>Registered</th><th>Status</th><th>Actions</th>
                </tr>
                ${events.map(e => `
                    <tr>
                        <td>${escapeHtml(e.name)}</td>
                        <td>${formatDate(e.eventDate)}</td>
                        <td>${escapeHtml(e.category)}</td>
                        <td>${formatPrice(e.ticketPrice)}</td>
                        <td>${e.registeredCount}/${e.maxParticipants}</td>
                        <td><span class="${badgeClass(e.registrationStatus)}">${e.registrationStatus}</span></td>
                        <td>
                            <a class="btn small secondary" href="attendees.html?eventId=${e.id}">Attendees</a>
                            <a class="btn small secondary" href="event-form.html?id=${e.id}">Edit</a>
                            <button class="btn small danger" onclick="deleteEvent(${e.id})">Delete</button>
                        </td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

async function deleteEvent(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    clearAlert("alertBox");
    try {
        await api.del(`/events/${id}?organizerId=${organizerUser.id}`);
        loadMyEvents();
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.addEventListener("DOMContentLoaded", loadMyEvents);
