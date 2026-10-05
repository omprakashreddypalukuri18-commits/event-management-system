package com.eventmanagement.util;

import java.util.UUID;

/** Generates short, unique, human-readable codes for tickets and transactions. */
public class CodeGenerator {

    private CodeGenerator() {
    }

    public static String generateTicketNumber() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public static String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
