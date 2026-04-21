package com.example.finance.finance.controller;

import com.example.finance.finance.dto.TransactionRequest;
import com.example.finance.finance.dto.TransactionResponse;
import com.example.finance.finance.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(Authentication authentication) {
        return transactionService.getTransactionsForUser(authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(
            Authentication authentication,
            @Valid @RequestBody TransactionRequest request) {
        return transactionService.createTransaction(authentication.getName(), request);
    }

    @PutMapping("/{transactionId}")
    public TransactionResponse updateTransaction(
            Authentication authentication,
            @PathVariable Long transactionId,
            @Valid @RequestBody TransactionRequest request) {
        return transactionService.updateTransaction(authentication.getName(), transactionId, request);
    }

    @DeleteMapping("/{transactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(Authentication authentication, @PathVariable Long transactionId) {
        transactionService.deleteTransaction(authentication.getName(), transactionId);
    }
}
