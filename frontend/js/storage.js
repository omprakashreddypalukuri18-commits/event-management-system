/**
 * The backend has no session/JWT layer (kept simple for a college project).
 * After login/register, we just remember the logged-in user in localStorage
 * and send their id with each relevant API call.
 */
const STORAGE_KEY = "ems_current_user";

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEY);
}

function logout() {
    clearCurrentUser();
    window.location.href = "login.html";
}

/** Call at the top of a protected page. Redirects to login if not signed in,
 *  or to the right dashboard if signed in with the wrong role. */
function requireRole(role) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return null;
    }
    if (role && user.role !== role) {
        window.location.href = user.role === "ORGANIZER" ? "organizer-dashboard.html" : "user-dashboard.html";
        return null;
    }
    return user;
}
