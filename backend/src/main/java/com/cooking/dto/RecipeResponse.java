package com.cooking.dto;

import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import java.time.LocalDateTime;

public class RecipeResponse {
    
    private Long id;
    private String title;
    private String ingredients;
    private String instructions;
    private String keywords;
    private LocalDateTime createdAt;
    private AuthorInfo author;
    private int commentsCount;
    
    // Constructeur par défaut
    public RecipeResponse() {}
    
    // Constructeur à partir d'une entité Recipe
    public RecipeResponse(Recipe recipe) {
        this.id = recipe.getId();
        this.title = recipe.getTitle();
        this.ingredients = recipe.getIngredients();
        this.instructions = recipe.getInstructions();
        this.keywords = recipe.getKeywords();
        this.createdAt = recipe.getCreatedAt();
        
        if (recipe.getAuthor() != null) {
            this.author = new AuthorInfo(recipe.getAuthor());
        }
        
        if (recipe.getComments() != null) {
            this.commentsCount = recipe.getComments().size();
        } else {
            this.commentsCount = 0;
        }
    }
    
    // Classe interne pour les informations de l'auteur
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;
        private String fullName;
        
        public AuthorInfo() {}
        
        public AuthorInfo(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.fullName = user.getFullName();
        }
        
        // Getters et Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public AuthorInfo getAuthor() { return author; }
    public void setAuthor(AuthorInfo author) { this.author = author; }
    
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
}