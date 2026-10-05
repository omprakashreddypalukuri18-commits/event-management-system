async function loadEvents() {
    const keyword = document.getElementById("searchInput").value.trim();
    const grid = document.getElementById("eventsGrid");
    clearAlert("alertBox");
    grid.innerHTML = "<p class='muted'>Loading events...</p>";

    try {
        const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
        const events = await api.get(`/events${query}`);

        if (!events.length) {
            grid.innerHTML = `<div class="empty-state">No events found.</div>`;
            return;
        }

        grid.innerHTML = events.map(renderEventCard).join("");
    } catch (err) {
        grid.innerHTML = "";
        showAlert("alertBox", err.message);
    }
}

function renderEventCard(event) {
    return `
        <a class="event-card" href="event-details.html?id=${event.id}">
            <div class="event-card-img" style="background-image:url('${getCategoryImage(event.category)}')"></div>
            <div class="event-card-scrim"></div>
            <span class="event-card-status badge ${badgeClass(event.registrationStatus)}">${event.registrationStatus}</span>
            <div class="event-card-body">
                <span class="chip">${escapeHtml(event.category)}</span>
                <h3>${escapeHtml(event.name)}</h3>
                <div class="meta-row">📅 ${formatDate(event.eventDate)} &middot; 🕒 ${formatTime(event.eventTime)}</div>
                <div class="meta-row">📍 ${escapeHtml(event.venue)}</div>
                <div class="card-foot">
                    <span class="price">${formatPrice(event.ticketPrice)}</span>
                    <span class="seats">${event.registeredCount}/${event.maxParticipants} seats</span>
                </div>
            </div>
        </a>
    `;
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    loadEvents();
}

document.addEventListener("DOMContentLoaded", loadEvents);
