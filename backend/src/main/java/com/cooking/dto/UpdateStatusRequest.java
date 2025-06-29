package com.cooking.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusRequest {
    @NotBlank
    private String status; // "active" ou "suspended"
    
    public UpdateStatusRequest() {}
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}