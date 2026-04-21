package com.example.finance.finance.service;

import com.example.finance.finance.dto.CategoryRequest;
import com.example.finance.finance.dto.CategoryResponse;
import com.example.finance.finance.entity.Category;
import com.example.finance.finance.entity.User;
import com.example.finance.finance.repository.CategoryRepository;
import com.example.finance.finance.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<CategoryResponse> getCategoriesForUser(String userEmail) {
        User user = getUserByEmail(userEmail);

        return categoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse createCategory(String userEmail, CategoryRequest request) {
        User user = getUserByEmail(userEmail);
        String normalizedTitle = request.title().trim();

        if (categoryRepository.existsByUserIdAndTitleIgnoreCase(user.getId(), normalizedTitle)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category with this title already exists");
        }

        Category category = new Category();
        category.setTitle(normalizedTitle);
        category.setUser(user);

        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(String userEmail, Long categoryId, CategoryRequest request) {
        User user = getUserByEmail(userEmail);
        String normalizedTitle = request.title().trim();

        Category category = categoryRepository.findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (categoryRepository.existsByUserIdAndTitleIgnoreCaseAndIdNot(user.getId(), normalizedTitle, categoryId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Category with this title already exists");
        }

        category.setTitle(normalizedTitle);
        return toResponse(categoryRepository.save(category));
    }

    public void deleteCategory(String userEmail, Long categoryId) {
        User user = getUserByEmail(userEmail);

        Category category = categoryRepository.findByIdAndUserId(categoryId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        categoryRepository.delete(category);
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getTitle(),
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}
