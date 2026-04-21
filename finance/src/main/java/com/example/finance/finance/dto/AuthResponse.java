package com.example.finance.finance.dto;

public record AuthResponse(
                String token,
                String tokenType,
                String email,
                String fullName) {
}
