package com.cooking.dto;

import jakarta.validation.constraints.NotBlank;

public class RecipeRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String ingredients;
    
    private String instructions;
    private String keywords;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
}
