package com.example.finance.finance.manager.repository;

import com.example.finance.finance.manager.entity.Transaction;
import com.example.finance.finance.manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    List<Transaction> findByUserAndCategory(User user, String category);
}
