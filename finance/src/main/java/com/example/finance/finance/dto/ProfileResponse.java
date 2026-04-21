package com.example.finance.finance.dto;

import java.time.LocalDateTime;

public record ProfileResponse(
        String fullName,
        String email,
        LocalDateTime joinedOn) {
}
