package com.example.finance.finance.dto;

import com.example.finance.finance.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record TransactionRequest(
        @NotBlank(message = "Transaction name is required") @Size(max = 120, message = "Transaction name must be at most 120 characters") String name,

        @NotNull(message = "Category is required") Long categoryId,

        @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", message = "Amount must be greater than 0") BigDecimal amount,

        @NotNull(message = "Type is required") TransactionType type) {
}
