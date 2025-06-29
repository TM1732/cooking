package com.cooking.controller;

import com.cooking.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    private final UserRepository userRepository;

    public TestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Cooking Website Backend is running!");
        response.put("users_count", userRepository.count());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Object>> getUsersCount() {
        Map<String, Object> response = new HashMap<>();
        response.put("total_users", userRepository.count());
        response.put("message", "Users initialized successfully");
        return ResponseEntity.ok(response);
    }
}