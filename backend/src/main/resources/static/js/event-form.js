let organizer = null;
const editingEventId = getQueryParam("id");

async function initEventForm() {
    organizer = requireRole("ORGANIZER");
    if (!organizer) return;

    if (editingEventId) {
        document.getElementById("formTitle").textContent = "Edit Event";
        document.getElementById("bannerTitle").textContent = "Edit Event";
        document.getElementById("submitBtn").textContent = "Update Event";
        document.getElementById("scheduleSection").style.display = "block";
        await loadEventIntoForm();
        await loadSchedule();
    }
}

async function loadEventIntoForm() {
    try {
        const event = await api.get(`/events/${editingEventId}`);
        if (String(event.organizerId) !== String(organizer.id)) {
            showAlert("alertBox", "You can only edit events you created.");
            document.getElementById("eventForm").style.display = "none";
            return;
        }
        document.getElementById("name").value = event.name;
        document.getElementById("description").value = event.description;
        document.getElementById("eventDate").value = event.eventDate;
        document.getElementById("eventTime").value = event.eventTime;
        document.getElementById("venue").value = event.venue;
        document.getElementById("category").value = event.category;
        document.getElementById("maxParticipants").value = event.maxParticipants;
        document.getElementById("ticketPrice").value = event.ticketPrice;
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert("alertBox");

    const payload = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        eventDate: document.getElementById("eventDate").value,
        eventTime: document.getElementById("eventTime").value,
        venue: document.getElementById("venue").value.trim(),
        category: document.getElementById("category").value.trim(),
        maxParticipants: Number(document.getElementById("maxParticipants").value),
        ticketPrice: Number(document.getElementById("ticketPrice").value),
        organizerId: organizer.id
    };

    try {
        if (editingEventId) {
            await api.put(`/events/${editingEventId}`, payload);
            showAlert("alertBox", "Event updated successfully.", "success");
        } else {
            const created = await api.post("/events", payload);
            // Move into edit mode on the new event so schedule sessions can be added.
            window.location.href = `event-form.html?id=${created.id}`;
        }
    } catch (err) {
        showAlert("alertBox", err.message);
    }
});

async function loadSchedule() {
    try {
        const sessions = await api.get(`/schedules/event/${editingEventId}`);
        const container = document.getElementById("scheduleTable");

        container.innerHTML = sessions.length ? `
            <div class="table-wrap">
                <table>
                    <tr><th>Session</th><th>Start</th><th>End</th><th>Description</th><th></th></tr>
                    ${sessions.map(s => `
                        <tr>
                            <td>${escapeHtml(s.sessionName)}</td>
                            <td>${formatTime(s.startTime)}</td>
                            <td>${formatTime(s.endTime)}</td>
                            <td>${escapeHtml(s.description || "-")}</td>
                            <td><button class="btn small danger" onclick="deleteSession(${s.id})">Remove</button></td>
                        </tr>
                    `).join("")}
                </table>
            </div>
        ` : `<p class="muted">No sessions added yet.</p>`;
    } catch (err) {
        showAlert("scheduleAlert", err.message);
    }
}

const scheduleForm = document.getElementById("scheduleForm");
if (scheduleForm) {
    scheduleForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearAlert("scheduleAlert");

        const payload = {
            eventId: Number(editingEventId),
            sessionName: document.getElementById("sessionName").value.trim(),
            startTime: document.getElementById("startTime").value,
            endTime: document.getElementById("endTime").value,
            description: document.getElementById("sessionDescription").value.trim()
        };

        try {
            await api.post("/schedules", payload);
            scheduleForm.reset();
            await loadSchedule();
        } catch (err) {
            showAlert("scheduleAlert", err.message);
        }
    });
}

async function deleteSession(id) {
    if (!confirm("Remove this session?")) return;
    try {
        await api.del(`/schedules/${id}`);
        await loadSchedule();
    } catch (err) {
        showAlert("scheduleAlert", err.message);
    }
}

document.addEventListener("DOMContentLoaded", initEventForm);
