package com.example.finance.finance.controller;

import com.example.finance.finance.dto.CategoryRequest;
import com.example.finance.finance.dto.CategoryResponse;
import com.example.finance.finance.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getCategories(Authentication authentication) {
        return categoryService.getCategoriesForUser(authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(
            Authentication authentication,
            @Valid @RequestBody CategoryRequest request) {
        return categoryService.createCategory(authentication.getName(), request);
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(
            Authentication authentication,
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequest request) {
        return categoryService.updateCategory(authentication.getName(), categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(Authentication authentication, @PathVariable Long categoryId) {
        categoryService.deleteCategory(authentication.getName(), categoryId);
    }
}
