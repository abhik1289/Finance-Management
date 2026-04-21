package com.example.finance.finance.dto;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
