package com.example.finance.finance.manager.controller;

import com.example.finance.finance.manager.dto.ApiResponse;
import com.example.finance.finance.manager.dto.UserResponse;
import com.example.finance.finance.manager.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Fetching profile for user: {}", email);
        UserResponse response = userService.getUserByEmail(email);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User profile retrieved successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        log.info("Fetching user with id: {}", id);
        UserResponse response = userService.getUserById(id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User retrieved successfully")
                        .data(response)
                        .build());
    }
}
