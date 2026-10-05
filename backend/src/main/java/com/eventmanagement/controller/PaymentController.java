package com.eventmanagement.controller;

import com.eventmanagement.dto.ApiResponse;
import com.eventmanagement.dto.PaymentRequest;
import com.eventmanagement.dto.PaymentResponse;
import com.eventmanagement.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Mock payment: always succeeds and immediately issues the ticket. */
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> pay(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment successful", response));
    }

    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getByRegistration(@PathVariable Long registrationId) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.getPaymentByRegistrationId(registrationId)));
    }
}
