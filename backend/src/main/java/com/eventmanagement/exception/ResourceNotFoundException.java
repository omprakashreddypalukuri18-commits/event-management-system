package com.eventmanagement.exception;

/** Thrown when a requested id (user, event, registration, ticket...) does not exist. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
