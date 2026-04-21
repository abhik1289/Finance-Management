package com.example.finance.finance.service;

import com.example.finance.finance.dto.DashboardSummaryResponse;
import com.example.finance.finance.entity.TransactionType;
import com.example.finance.finance.entity.User;
import com.example.finance.finance.repository.CategoryRepository;
import com.example.finance.finance.repository.TransactionRepository;
import com.example.finance.finance.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    public DashboardSummaryResponse getSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        long totalCategories = categoryRepository.countByUserId(user.getId());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last24HoursFrom = now.minusHours(24);

        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime nextMonthStart = monthStart.plusMonths(1);

        BigDecimal monthlyDebit = sum(user.getId(), TransactionType.DEBIT, monthStart, nextMonthStart);
        BigDecimal monthlyCredit = sum(user.getId(), TransactionType.CREDIT, monthStart, nextMonthStart);
        BigDecimal last24HoursDebit = sum(user.getId(), TransactionType.DEBIT, last24HoursFrom, now);
        BigDecimal last24HoursCredit = sum(user.getId(), TransactionType.CREDIT, last24HoursFrom, now);

        return new DashboardSummaryResponse(
                totalCategories,
                monthlyDebit,
                monthlyCredit,
                last24HoursDebit,
                last24HoursCredit);
    }

    private BigDecimal sum(Long userId, TransactionType type, LocalDateTime from, LocalDateTime to) {
        BigDecimal amount = transactionRepository.sumAmountByUserIdAndTypeAndCreatedAtBetween(userId, type, from, to);
        return amount != null ? amount : BigDecimal.ZERO;
    }
}
