/** Small shared helpers used across pages. */

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(timeStr) {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = ((hour + 11) % 12) + 1;
    return `${displayHour}:${m} ${suffix}`;
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "-";
    const d = new Date(dateTimeStr);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatPrice(price) {
    const value = Number(price) || 0;
    return value === 0 ? "Free" : `₹${value.toFixed(2)}`;
}

function badgeClass(status) {
    return "badge badge-" + String(status).toLowerCase();
}

/** Shows a dismissible message box inside the given container element id. */
function showAlert(containerId, message, type = "error") {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

function clearAlert(containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = "";
}

/** Reads ?key=value query params from the current URL. */
function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Picks a representative photo for an event card/banner based on its category
 * text (keyword match, case-insensitive). Falls back to the cultural photo so
 * every card still looks good even for categories we didn't anticipate.
 */
const CATEGORY_IMAGE_MAP = [
    { keywords: ["sport", "football", "cricket", "athletic"], image: "../images/cat-sports.png" },
    { keywords: ["music", "concert", "band", "dj"], image: "../images/hero-concert.png" },
    { keywords: ["tech", "hackathon", "robot", "coding", "workshop"], image: "../images/cat-technical.png" },
    { keywords: ["conference", "seminar", "talk", "lecture", "summit"], image: "../images/cat-conference.png" },
    { keywords: ["art", "exhibition", "gallery", "painting"], image: "../images/cat-arts.png" },
    { keywords: ["food", "fest", "carnival", "fair"], image: "../images/cat-food.png" },
    { keywords: ["cultural", "dance", "drama", "fine arts"], image: "../images/cat-cultural.png" }
];

function getCategoryImage(category) {
    const lower = String(category || "").toLowerCase();
    const match = CATEGORY_IMAGE_MAP.find(entry => entry.keywords.some(k => lower.includes(k)));
    return match ? match.image : "../images/cat-cultural.png";
}
