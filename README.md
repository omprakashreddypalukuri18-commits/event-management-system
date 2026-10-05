# Event Management System

A simple full-stack Event Management System built as a 2nd-year college project.

- **Backend:** Java 17 + Spring Boot 3 (REST API)
- **Database:** MySQL
- **Frontend:** Plain HTML, CSS, JavaScript (no build tools / no npm needed)

## Folder Structure

```
event-management-system/
├── backend/                                   Spring Boot REST API (Maven project)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/eventmanagement/
│       │   ├── EventManagementApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── model/          User, Event, Registration, Ticket, Payment, Schedule + enums
│       │   ├── repository/     Spring Data JPA repositories (one per entity)
│       │   ├── service/        Business logic (capacity checks, ticketing, payments, dashboards)
│       │   ├── controller/     REST controllers (one per module)
│       │   ├── dto/            Request / response objects
│       │   ├── exception/      Custom exceptions + global @RestControllerAdvice handler
│       │   └── util/           PasswordUtil (SHA-256), CodeGenerator (ticket/txn ids)
│       └── resources/application.properties
├── frontend/                                   Static HTML/CSS/JS site
│   ├── index.html                 Browse & search events (home page)
│   ├── login.html / register.html Auth pages (role selector: USER / ORGANIZER)
│   ├── event-details.html         Event info, schedule, register/cancel
│   ├── payment.html               Mock payment (order summary -> pay)
│   ├── ticket.html                View / print ticket
│   ├── my-registrations.html      User's registration history
│   ├── user-dashboard.html        Upcoming / previous events, my tickets
│   ├── organizer-dashboard.html   Totals, upcoming events, per-event stats
│   ├── organizer-events.html      CRUD list of the organizer's events
│   ├── event-form.html            Create/update event + manage its schedule
│   ├── attendees.html             Organizer's attendee list for one event
│   ├── css/style.css
│   └── js/  api.js, storage.js, common.js, nav.js, auth.js, home.js,
│            event-details.js, payment.js, ticket.js, registration.js,
│            user-dashboard.js, organizer-dashboard.js, organizer-events.js,
│            event-form.js, attendees.js
└── database/
    └── schema.sql                 Reference DDL (users, events, registrations,
                                    tickets, payments, schedules) with PK/FK constraints
```

## How to Run

### 1. Database
```sql
CREATE DATABASE event_management_db;
```
That's it — on first run, Spring Boot/Hibernate auto-creates all tables from the
entity classes (`spring.jpa.hibernate.ddl-auto=update` in `application.properties`).
`database/schema.sql` is kept only as a reference if you'd rather create the
tables by hand (set `ddl-auto=validate` in that case).

Update the username/password in
`backend/src/main/resources/application.properties` to match your local MySQL.

### 2. Backend (also serves the frontend — one single URL)
```bash
cd backend
mvn spring-boot:run
```
(Or just run `EventManagementApplication.java` from your IDE.)

The frontend files are copied into `backend/src/main/resources/static/`, which
Spring Boot serves automatically at the same port as the API. So once the
backend is running, open **one single address** for the whole project:

```
http://localhost:8081/
```

That loads `index.html` (home/browse events); every other page (`login.html`,
`organizer-dashboard.html`, etc.) is reachable the same way, e.g.
`http://localhost:8081/login.html`. The REST API lives alongside it under
`http://localhost:8081/api/...`.

### 3. Frontend — standalone alternative (optional)
The original copy also still lives in `frontend/` at the project root, in case
you want to run it separately from the backend (e.g. editing with live-reload):
- Open `frontend/index.html` directly in a browser, **or**
- Right-click it in VS Code → "Open with Live Server".

Either copy calls the API at `http://localhost:8081/api` (see `js/api.js`), and
CORS is already open on the backend for this. If you edit the frontend, remember
to copy your changes into `backend/src/main/resources/static/` too if you want
them to show up at `http://localhost:8081/`.

## Demo Flow

1. Register an **Organizer** account → create an event (set a price > 0 for one
   event and 0 for another, to demo both flows) → add a couple of schedule sessions.
2. Register a **User** account (new browser/incognito tab, or logout first) →
   browse/search events → open one → Register.
   - Free event → ticket is generated immediately.
   - Paid event → redirected to the mock Payment page → "Pay Now" → ticket issued.
3. As the User: check **My Registrations** (cancel one to see it update) and the
   **User Dashboard** (upcoming/previous/tickets).
4. As the Organizer: check the **Organizer Dashboard** (totals, per-event stats)
   and **Attendees** page for an event.

## Notable Design Simplifications (intentional, for a college-level project)

- No JWT/session framework — after login the frontend just keeps `{id, name, role}`
  in `localStorage` and sends the user id with each request.
- Passwords are hashed with SHA-256 (not BCrypt+salt) to avoid pulling in
  Spring Security for one method.
- Payments are fully mocked (no gateway) and always succeed, so the flow can be
  demonstrated without real credentials.
