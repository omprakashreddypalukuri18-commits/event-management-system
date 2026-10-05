function redirectToDashboard(role) {
    window.location.href = role === "ORGANIZER" ? "organizer-dashboard.html" : "index.html";
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearAlert("alertBox");

        const payload = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            password: document.getElementById("password").value,
            role: document.getElementById("role").value
        };

        try {
            const user = await api.post("/auth/register", payload);
            saveCurrentUser(user);
            redirectToDashboard(user.role);
        } catch (err) {
            showAlert("alertBox", err.message);
        }
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearAlert("alertBox");

        const payload = {
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value
        };

        try {
            const user = await api.post("/auth/login", payload);
            saveCurrentUser(user);
            redirectToDashboard(user.role);
        } catch (err) {
            showAlert("alertBox", err.message);
        }
    });
}
