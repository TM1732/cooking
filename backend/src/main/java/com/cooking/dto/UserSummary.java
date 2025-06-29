package com.cooking.dto;

import com.cooking.entity.User;
import java.time.LocalDateTime;

public class UserSummary {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status; // Nouveau champ
    private LocalDateTime createdAt;
    private int recipesCount;
    private int commentsCount;
    
    public UserSummary(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole().name().toLowerCase();
        this.status = user.isEnabled() ? "active" : "suspended"; // Nouveau
        this.createdAt = user.getCreatedAt();
        this.recipesCount = user.getRecipes() != null ? user.getRecipes().size() : 0;
        this.commentsCount = user.getComments() != null ? user.getComments().size() : 0;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public int getRecipesCount() { return recipesCount; }
    public void setRecipesCount(int recipesCount) { this.recipesCount = recipesCount; }
    
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
}