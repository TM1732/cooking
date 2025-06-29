package com.cooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateRoleRequest {
    
    @NotBlank(message = "Le rôle ne peut pas être vide")
    @Pattern(regexp = "^(user|chef|admin)$", message = "Le rôle doit être 'user', 'chef' ou 'admin'")
    private String role;

    // Constructeurs
    public UpdateRoleRequest() {}

    public UpdateRoleRequest(String role) {
        this.role = role;
    }

    // Getters et Setters
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "UpdateRoleRequest{" +
                "role='" + role + '\'' +
                '}';
    }
}