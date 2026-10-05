/**
 * Small wrapper around fetch() for talking to the Spring Boot REST API.
 * Every backend response (success or error) is JSON, so we always try to
 * parse it and throw a plain Error with the backend's message on failure.
 */
const API_BASE_URL = "http://localhost:8081/api";

async function apiRequest(path, method = "GET", body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(API_BASE_URL + path, options);
    } catch (networkErr) {
        throw new Error("Could not reach the server. Is the backend running on port 8080?");
    }

    let json = null;
    try {
        json = await response.json();
    } catch (parseErr) {
        // No JSON body (e.g. 204) - ignore.
    }

    if (!response.ok) {
        const message = json && json.message ? json.message : `Request failed (${response.status})`;
        throw new Error(message);
    }

    return json ? json.data : null;
}

const api = {
    get: (path) => apiRequest(path, "GET"),
    post: (path, body) => apiRequest(path, "POST", body),
    put: (path, body) => apiRequest(path, "PUT", body),
    del: (path) => apiRequest(path, "DELETE")
};
