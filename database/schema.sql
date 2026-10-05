-- ============================================================
-- Event Management System - Database Schema (MySQL)
-- ============================================================
-- This file is a REFERENCE copy of the schema that Spring Boot /
-- Hibernate will auto-create on first run (ddl-auto=update).
-- You do NOT need to run this manually unless you want to inspect
-- or set up the database by hand.
--
-- Usage (manual option):
--   1. CREATE DATABASE event_management_db;
--   2. USE event_management_db;
--   3. Run this script.
--   4. In application.properties set: spring.jpa.hibernate.ddl-auto=validate
-- ============================================================

CREATE DATABASE IF NOT EXISTS event_management_db;
USE event_management_db;

-- ---------------------------------------------------------
-- users: stores both USER and ORGANIZER accounts
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,       -- SHA-256 hash
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL,            -- USER | ORGANIZER
    created_at DATETIME NOT NULL
);

-- ---------------------------------------------------------
-- events
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    max_participants INT NOT NULL,
    ticket_price DOUBLE NOT NULL DEFAULT 0,
    registration_status VARCHAR(10) NOT NULL DEFAULT 'OPEN',  -- OPEN | CLOSED
    organizer_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- ---------------------------------------------------------
-- registrations
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_date DATETIME NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'CONFIRMED',  -- CONFIRMED | CANCELLED
    CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id)
);

-- ---------------------------------------------------------
-- tickets
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id BIGINT NOT NULL UNIQUE,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    issue_date DATETIME NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'VALID',  -- VALID | CANCELLED
    CONSTRAINT fk_ticket_registration FOREIGN KEY (registration_id) REFERENCES registrations(id)
);

-- ---------------------------------------------------------
-- payments
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id BIGINT NOT NULL UNIQUE,
    amount DOUBLE NOT NULL,
    payment_method VARCHAR(30) NOT NULL,   -- CARD | UPI | NETBANKING (mock)
    transaction_id VARCHAR(40) NOT NULL UNIQUE,
    payment_status VARCHAR(10) NOT NULL DEFAULT 'PENDING',  -- PENDING | SUCCESS | FAILED
    payment_date DATETIME NOT NULL,
    CONSTRAINT fk_payment_registration FOREIGN KEY (registration_id) REFERENCES registrations(id)
);

-- ---------------------------------------------------------
-- schedules
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    session_name VARCHAR(150) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description VARCHAR(1000),
    CONSTRAINT fk_schedule_event FOREIGN KEY (event_id) REFERENCES events(id)
);
