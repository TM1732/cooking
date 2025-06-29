package com.cooking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    @Size(max = 50)
    private String username;
    
    @Email
    @Size(max = 100)
    private String email;
    
    // ⭐ SUPPRIMÉ la validation @Size pour permettre les chaînes vides
    private String password; // Optionnel pour modification
    
    private String role;
    
    // Constructeurs
    public UpdateUserRequest() {}
    
    // Getters et Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}