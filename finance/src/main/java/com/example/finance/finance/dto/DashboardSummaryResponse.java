package com.example.finance.finance.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long totalCategories,
        BigDecimal monthlyDebit,
        BigDecimal monthlyCredit,
        BigDecimal last24HoursDebit,
        BigDecimal last24HoursCredit) {
}
