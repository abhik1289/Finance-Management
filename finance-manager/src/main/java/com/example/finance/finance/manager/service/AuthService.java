package com.example.finance.finance.manager.service;

import com.example.finance.finance.manager.dto.SignInRequest;
import com.example.finance.finance.manager.dto.SignUpRequest;
import com.example.finance.finance.manager.dto.AuthResponse;
import com.example.finance.finance.manager.entity.User;
import com.example.finance.finance.manager.exception.DuplicateResourceException;
import com.example.finance.finance.manager.exception.ResourceNotFoundException;
import com.example.finance.finance.manager.repository.UserRepository;
import com.example.finance.finance.manager.util.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse signUp(SignUpRequest signUpRequest) {
        log.info("Attempting to sign up user with email: {}", signUpRequest.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Email already exists: {}", signUpRequest.getEmail());
            throw new DuplicateResourceException("Email already in use");
        }

        // Create new user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        log.info("User successfully signed up: {}", savedUser.getEmail());

        // Generate JWT token
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .build();
    }

    public AuthResponse signIn(SignInRequest signInRequest) {
        log.info("Attempting to sign in user with email: {}", signInRequest.getEmail());

        // Check if user exists
        User user = userRepository.findByEmail(signInRequest.getEmail())
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found with email: " + signInRequest.getEmail()));

        // Authenticate
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            signInRequest.getEmail(),
                            signInRequest.getPassword()));

            log.info("User successfully signed in: {}", signInRequest.getEmail());

            // Generate JWT token
            String token = tokenProvider.generateToken(authentication);

            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .build();
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", signInRequest.getEmail());
            throw new ResourceNotFoundException("Invalid email or password");
        }
    }
}
