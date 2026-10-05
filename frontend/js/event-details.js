const eventId = getQueryParam("id");
let currentEvent = null;

async function loadEventDetails() {
    if (!eventId) {
        showAlert("alertBox", "No event specified.");
        return;
    }

    try {
        currentEvent = await api.get(`/events/${eventId}`);
        await renderDetail();
        await loadSchedule();
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

async function renderDetail() {
    const event = currentEvent;
    const user = getCurrentUser();

    let actionHtml = `<a class="btn secondary" href="login.html">Login to Register</a>`;

    if (user && user.role === "USER") {
        const myRegistration = await findMyRegistration(user.id);

        if (myRegistration && myRegistration.status === "CONFIRMED") {
            if (myRegistration.paymentRequired) {
                actionHtml = `
                    <a class="btn" href="payment.html?registrationId=${myRegistration.registrationId}">Pay Now &amp; Get Ticket</a>
                    <button class="btn danger" onclick="cancelRegistration(${myRegistration.registrationId})">Cancel Registration</button>
                `;
            } else {
                actionHtml = `
                    <a class="btn" href="ticket.html?registrationId=${myRegistration.registrationId}">View Ticket</a>
                    <button class="btn danger" onclick="cancelRegistration(${myRegistration.registrationId})">Cancel Registration</button>
                `;
            }
        } else if (event.registrationStatus === "CLOSED") {
            actionHtml = `<button class="btn" disabled>Event Full</button>`;
        } else {
            actionHtml = `<button class="btn" onclick="register()">Register for this Event</button>`;
        }
    } else if (user && user.role === "ORGANIZER") {
        actionHtml = `<span class="muted">Organizers cannot register for events.</span>`;
    }

    document.getElementById("eventBanner").innerHTML = `
        <section class="hero hero-photo full-bleed" style="--hero-img:url('${getCategoryImage(event.category)}');padding:64px 20px 80px;">
            <div class="hero-inner">
                <a href="index.html" style="color:rgba(255,255,255,0.85);font-size:13px;">&larr; Back to events</a>
                <div class="flex-between" style="margin-top:14px;align-items:flex-start;">
                    <div>
                        <span class="eyebrow">${escapeHtml(event.category)}</span>
                        <h1 style="font-size:34px;">${escapeHtml(event.name)}</h1>
                        <p class="subtitle" style="margin-bottom:0;">📍 ${escapeHtml(event.venue)} &nbsp;·&nbsp; 📅 ${formatDate(event.eventDate)} &nbsp;·&nbsp; 🕒 ${formatTime(event.eventTime)}</p>
                    </div>
                    <span class="badge ${badgeClass(event.registrationStatus)}" style="font-size:12px;">${event.registrationStatus}</span>
                </div>
            </div>
        </section>
    `;

    document.getElementById("eventDetail").innerHTML = `
        <div class="card" style="max-width:760px;margin:-40px auto 0;position:relative;z-index:5;">
            <p>${escapeHtml(event.description)}</p>
            <div class="meta">Organized by: ${escapeHtml(event.organizerName)}</div>
            <div class="meta">${event.registeredCount}/${event.maxParticipants} seats filled (${event.availableSeats} left)</div>
            <div class="price">${formatPrice(event.ticketPrice)}</div>
            <div class="btn-row">${actionHtml}</div>
        </div>
    `;
}

async function findMyRegistration(userId) {
    const registrations = await api.get(`/registrations/user/${userId}`);
    return registrations.find(r => String(r.eventId) === String(eventId) && r.status === "CONFIRMED") || null;
}

async function register() {
    const user = getCurrentUser();
    clearAlert("alertBox");
    try {
        const registration = await api.post("/registrations", { userId: user.id, eventId: Number(eventId) });
        if (registration.paymentRequired) {
            window.location.href = `payment.html?registrationId=${registration.registrationId}`;
        } else {
            window.location.href = `ticket.html?registrationId=${registration.registrationId}`;
        }
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

async function cancelRegistration(registrationId) {
    if (!confirm("Cancel this registration?")) return;
    try {
        await api.del(`/registrations/${registrationId}`);
        await loadEventDetails();
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

async function loadSchedule() {
    const container = document.getElementById("scheduleList");
    try {
        const sessions = await api.get(`/schedules/event/${eventId}`);
        if (!sessions.length) {
            container.innerHTML = `<p class="muted">No schedule has been added for this event yet.</p>`;
            return;
        }
        container.innerHTML = `
            <div class="table-wrap">
                <table>
                    <tr><th>Session</th><th>Start</th><th>End</th><th>Description</th></tr>
                    ${sessions.map(s => `
                        <tr>
                            <td>${escapeHtml(s.sessionName)}</td>
                            <td>${formatTime(s.startTime)}</td>
                            <td>${formatTime(s.endTime)}</td>
                            <td>${escapeHtml(s.description || "-")}</td>
                        </tr>
                    `).join("")}
                </table>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<p class="muted">Could not load schedule.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
