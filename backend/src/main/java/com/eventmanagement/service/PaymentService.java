package com.eventmanagement.service;

import com.eventmanagement.dto.PaymentRequest;
import com.eventmanagement.dto.PaymentResponse;
import com.eventmanagement.exception.BadRequestException;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Payment;
import com.eventmanagement.model.PaymentStatus;
import com.eventmanagement.model.Registration;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.repository.PaymentRepository;
import com.eventmanagement.util.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationService registrationService;
    private final TicketService ticketService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
                           RegistrationService registrationService,
                           TicketService ticketService) {
        this.paymentRepository = paymentRepository;
        this.registrationService = registrationService;
        this.ticketService = ticketService;
    }

    /**
     * Mock payment gateway: no external service is called. The payment always
     * "succeeds" so the flow (order summary -> pay -> ticket) can be demonstrated
     * end to end without needing real payment credentials.
     */
    public PaymentResponse processPayment(PaymentRequest request) {
        Registration registration = registrationService.getRegistrationEntity(request.getRegistrationId());

        if (paymentRepository.findByRegistrationId(registration.getId()).isPresent()) {
            throw new BadRequestException("This registration has already been paid for");
        }

        Double price = registration.getEvent().getTicketPrice();
        if (price == null || price <= 0) {
            throw new BadRequestException("This event is free; no payment is required");
        }

        Payment payment = new Payment();
        payment.setRegistration(registration);
        payment.setAmount(price);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId(generateUniqueTransactionId());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        Payment saved = paymentRepository.save(payment);

        Ticket ticket = ticketService.issueTicket(registration);

        return toResponse(saved, ticket.getTicketNumber());
    }

    public PaymentResponse getPaymentByRegistrationId(Long registrationId) {
        Payment payment = paymentRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for this registration"));
        String ticketNumber = null;
        try {
            ticketNumber = ticketService.getTicketByRegistrationId(registrationId).getTicketNumber();
        } catch (ResourceNotFoundException ignored) {
            // No ticket yet (shouldn't normally happen once payment is SUCCESS).
        }
        return toResponse(payment, ticketNumber);
    }

    private String generateUniqueTransactionId() {
        String code;
        do {
            code = CodeGenerator.generateTransactionId();
        } while (paymentRepository.existsByTransactionId(code));
        return code;
    }

    private PaymentResponse toResponse(Payment payment, String ticketNumber) {
        PaymentResponse dto = new PaymentResponse();
        dto.setPaymentId(payment.getId());
        dto.setRegistrationId(payment.getRegistration().getId());
        dto.setEventName(payment.getRegistration().getEvent().getName());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setTicketNumber(ticketNumber);
        return dto;
    }
}
