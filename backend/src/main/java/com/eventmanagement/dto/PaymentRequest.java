package com.eventmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Body for POST /api/payments. paymentMethod is a mock choice: CARD, UPI, or NETBANKING. */
public class PaymentRequest {

    @NotNull(message = "Registration id is required")
    private Long registrationId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    public Long getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(Long registrationId) {
        this.registrationId = registrationId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
