package com.example.finance.finance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Category title is required")
        @Size(max = 80, message = "Category title must be at most 80 characters")
        String title) {
}
