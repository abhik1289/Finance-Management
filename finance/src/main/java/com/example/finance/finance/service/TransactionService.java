package com.example.finance.finance.service;

import com.example.finance.finance.dto.TransactionRequest;
import com.example.finance.finance.dto.TransactionResponse;
import com.example.finance.finance.entity.Category;
import com.example.finance.finance.entity.Transaction;
import com.example.finance.finance.entity.User;
import com.example.finance.finance.repository.CategoryRepository;
import com.example.finance.finance.repository.TransactionRepository;
import com.example.finance.finance.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<TransactionResponse> getTransactionsForUser(String userEmail) {
        User user = getUserByEmail(userEmail);

        return transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse createTransaction(String userEmail, TransactionRequest request) {
        User user = getUserByEmail(userEmail);
        Category category = getCategoryForUser(user.getId(), request.categoryId());

        Transaction transaction = new Transaction();
        transaction.setName(request.name().trim());
        transaction.setCategory(category);
        transaction.setUser(user);
        transaction.setAmount(request.amount());
        transaction.setType(request.type());

        return toResponse(transactionRepository.save(transaction));
    }

    public TransactionResponse updateTransaction(String userEmail, Long transactionId, TransactionRequest request) {
        User user = getUserByEmail(userEmail);

        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        Category category = getCategoryForUser(user.getId(), request.categoryId());

        transaction.setName(request.name().trim());
        transaction.setCategory(category);
        transaction.setAmount(request.amount());
        transaction.setType(request.type());

        return toResponse(transactionRepository.save(transaction));
    }

    public void deleteTransaction(String userEmail, Long transactionId) {
        User user = getUserByEmail(userEmail);

        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        transactionRepository.delete(transaction);
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Category getCategoryForUser(Long userId, Long categoryId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category selected"));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getName(),
                transaction.getCategory().getId(),
                transaction.getCategory().getTitle(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt());
    }
}
