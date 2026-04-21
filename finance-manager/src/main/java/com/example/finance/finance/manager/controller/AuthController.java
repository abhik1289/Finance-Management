package com.example.finance.finance.manager.controller;

import com.example.finance.finance.manager.dto.ApiResponse;
import com.example.finance.finance.manager.dto.SignInRequest;
import com.example.finance.finance.manager.dto.SignUpRequest;
import com.example.finance.finance.manager.dto.AuthResponse;
import com.example.finance.finance.manager.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        log.info("Sign up request received for email: {}", signUpRequest.getEmail());
        AuthResponse response = authService.signUp(signUpRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("User registered successfully")
                        .data(response)
                        .build());
    }

    @PostMapping("/sign-in")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@Valid @RequestBody SignInRequest signInRequest) {
        log.info("Sign in request received for email: {}", signInRequest.getEmail());
        AuthResponse response = authService.signIn(signInRequest);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("User signed in successfully")
                        .data(response)
                        .build());
    }
}
