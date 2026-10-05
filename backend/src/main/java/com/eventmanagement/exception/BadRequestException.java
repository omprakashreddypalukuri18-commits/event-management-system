package com.eventmanagement.exception;

/** Thrown for business-rule violations: event full, duplicate registration, wrong password, etc. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
