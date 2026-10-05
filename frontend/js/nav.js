/** Renders the top navigation bar into <div id="navbar"></div>, based on who is logged in. */
function renderNavbar() {
    const el = document.getElementById("navbar");
    if (!el) return;

    const user = getCurrentUser();
    let links = "";
    let userChip = "";

    if (!user) {
        links = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    } else if (user.role === "ORGANIZER") {
        links = `
            <a href="organizer-dashboard.html">Dashboard</a>
            <a href="organizer-events.html">My Events</a>
            <a href="event-form.html">Create Event</a>
        `;
        userChip = renderUserChip(user, "Organizer");
    } else {
        links = `
            <a href="index.html">Browse Events</a>
            <a href="my-registrations.html">My Registrations</a>
            <a href="user-dashboard.html">Dashboard</a>
        `;
        userChip = renderUserChip(user, "User");
    }

    el.innerHTML = `
        <div class="navbar">
            <a class="brand" href="index.html"><span class="logo-badge">🎪</span>EventManager</a>
            <nav>
                ${links}
                ${userChip}
                ${user ? `<button onclick="logout()">Logout</button>` : ""}
            </nav>
        </div>
    `;
}

function renderUserChip(user, roleLabel) {
    return `
        <span class="user-chip">
            <span class="avatar-circle">${getInitials(user.name)}</span>
            <span>
                <span class="u-name" style="display:block;line-height:1.1;">${escapeHtml(user.name)}</span>
                <span class="u-role" style="display:block;line-height:1.1;">${roleLabel}</span>
            </span>
        </span>
    `;
}

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", renderNavbar);
