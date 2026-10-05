const registrationId = getQueryParam("registrationId");

async function loadOrderSummary() {
    requireRole("USER");
    if (!registrationId) {
        showAlert("alertBox", "No registration specified.");
        return;
    }

    try {
        const reg = await api.get(`/registrations/${registrationId}`);

        if (!reg.paymentRequired) {
            // Already paid (or free event) - nothing to pay for, go straight to the ticket.
            window.location.href = `ticket.html?registrationId=${registrationId}`;
            return;
        }

        document.getElementById("orderSummary").innerHTML = `
            <div class="card">
                <h3>Order Summary</h3>
                <div class="ticket-row"><span class="label">Event</span><span>${escapeHtml(reg.eventName)}</span></div>
                <div class="ticket-row"><span class="label">Date</span><span>${formatDate(reg.eventDate)}</span></div>
                <div class="ticket-row"><span class="label">Venue</span><span>${escapeHtml(reg.venue)}</span></div>
                <div class="ticket-row"><span class="label">Amount Payable</span><span><strong>${formatPrice(reg.ticketPrice)}</strong></span></div>
            </div>
        `;
    } catch (err) {
        showAlert("alertBox", err.message);
    }
}

document.getElementById("paymentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert("alertBox");

    const payBtn = document.getElementById("payBtn");
    payBtn.disabled = true;
    payBtn.textContent = "Processing payment...";

    try {
        const payment = await api.post("/payments", {
            registrationId: Number(registrationId),
            paymentMethod: document.getElementById("paymentMethod").value
        });
        renderPaymentSuccess(payment);
    } catch (err) {
        showAlert("alertBox", err.message);
        payBtn.disabled = false;
        payBtn.textContent = "Pay Now";
    }
});

function renderPaymentSuccess(payment) {
    document.getElementById("paymentForm").style.display = "none";
    document.getElementById("orderSummary").innerHTML = `
        <div class="card">
            <div class="flex-between">
                <h3>Payment Successful</h3>
                <span class="badge badge-success">${payment.paymentStatus}</span>
            </div>
            <div class="ticket-row"><span class="label">Event</span><span>${escapeHtml(payment.eventName)}</span></div>
            <div class="ticket-row"><span class="label">Amount Paid</span><span>${formatPrice(payment.amount)}</span></div>
            <div class="ticket-row"><span class="label">Payment Method</span><span>${escapeHtml(payment.paymentMethod)}</span></div>
            <div class="ticket-row"><span class="label">Transaction ID</span><span><strong>${payment.transactionId}</strong></span></div>
            <div class="ticket-row"><span class="label">Paid On</span><span>${formatDateTime(payment.paymentDate)}</span></div>
            <a class="btn" style="margin-top:14px;" href="ticket.html?registrationId=${registrationId}">View My Ticket</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", loadOrderSummary);
