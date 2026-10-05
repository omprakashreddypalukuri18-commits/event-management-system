async function loadMyRegistrations() {
    const user = requireRole("USER");
    if (!user) return;

    try {
        const registrations = await api.get(`/registrations/user/${user.id}`);
        renderTable(registrations);
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

function renderTable(registrations) {
    const container = document.getElementById("registrationsTable");

    if (!registrations.length) {
        container.innerHTML = `<div class="empty-state">You haven't registered for any events yet. <a href="index.html">Browse events</a></div>`;
        return;
    }

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <tr>
                    <th>Event</th><th>Date</th><th>Venue</th><th>Registered On</th><th>Status</th><th>Action</th>
                </tr>
                ${registrations.map(renderRow).join("")}
            </table>
        </div>
    `;
}

function renderRow(reg) {
    let action = "-";
    if (reg.status === "CONFIRMED") {
        if (reg.paymentRequired) {
            action = `<a class="btn small" href="payment.html?registrationId=${reg.registrationId}">Pay &amp; Get Ticket</a>`;
        } else {
            action = `<a class="btn small secondary" href="ticket.html?registrationId=${reg.registrationId}">View Ticket</a>`;
        }
        action += ` <button class="btn small danger" onclick="cancelRegistration(${reg.registrationId})">Cancel</button>`;
    }

    return `
        <tr>
            <td>${escapeHtml(reg.eventName)}</td>
            <td>${formatDate(reg.eventDate)}</td>
            <td>${escapeHtml(reg.venue)}</td>
            <td>${formatDateTime(reg.registrationDate)}</td>
            <td><span class="${badgeClass(reg.status)}">${reg.status}</span></td>
            <td>${action}</td>
        </tr>
    `;
}

async function cancelRegistration(id) {
    if (!confirm("Cancel this registration?")) return;
    clearAlert("alertBox");
    try {
        await api.del(`/registrations/${id}`);
        loadMyRegistrations();
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.addEventListener("DOMContentLoaded", loadMyRegistrations);
