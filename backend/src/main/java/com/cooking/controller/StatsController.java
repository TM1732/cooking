package com.cooking.controller;

import com.cooking.repository.UserRepository;
import com.cooking.repository.CommentRepository;
import com.cooking.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:3000")
public class StatsController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public StatsController(UserRepository userRepository, RecipeRepository recipeRepository,
            CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("recipes", recipeRepository.count());
            stats.put("users", userRepository.count());
            stats.put("comments", commentRepository.count());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération des stats: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
