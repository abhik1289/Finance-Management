package com.example.finance.finance.dto;

import com.example.finance.finance.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        String name,
        Long categoryId,
        String categoryTitle,
        BigDecimal amount,
        TransactionType type,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
