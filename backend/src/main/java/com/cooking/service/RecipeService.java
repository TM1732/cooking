package com.cooking.service;

import com.cooking.dto.RecipeRequest;
import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import com.cooking.exception.ResourceNotFoundException;
import com.cooking.repository.RecipeRepository;
import com.cooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class RecipeService {
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Méthodes CRUD
    
    @Transactional(readOnly = true)
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> getAllRecipesSorted(int page, int size, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return recipeRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recipe", "id", id));
    }
    
    @Transactional(readOnly = true)
    public Recipe getRecipeByIdWithComments(Long id) {
        Recipe recipe = recipeRepository.findByIdWithComments(id);
        if (recipe == null) {
            throw new ResourceNotFoundException("Recipe", "id", id);
        }
        return recipe;
    }
    
    public Recipe createRecipe(RecipeRequest recipeRequest, Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        
        Recipe recipe = new Recipe(
            recipeRequest.getTitle(),
            recipeRequest.getIngredients(),
            recipeRequest.getInstructions(),
            recipeRequest.getKeywords(),
            author
        );
        
        return recipeRepository.save(recipe);
    }
    
    public Recipe createRecipe(RecipeRequest recipeRequest, User author) {
        Recipe recipe = new Recipe(
            recipeRequest.getTitle(),
            recipeRequest.getIngredients(),
            recipeRequest.getInstructions(),
            recipeRequest.getKeywords(),
            author
        );
        
        return recipeRepository.save(recipe);
    }
    
    public Recipe updateRecipe(Long recipeId, RecipeRequest recipeRequest, Long userId) {
        Recipe recipe = getRecipeById(recipeId);
        
        // Vérifier que l'utilisateur est le propriétaire de la recette
        if (!recipe.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own recipes");
        }
        
        recipe.setTitle(recipeRequest.getTitle());
        recipe.setIngredients(recipeRequest.getIngredients());
        recipe.setInstructions(recipeRequest.getInstructions());
        recipe.setKeywords(recipeRequest.getKeywords());
        
        return recipeRepository.save(recipe);
    }
    
    public boolean deleteRecipe(Long recipeId, Long userId) {
        try {
            Recipe recipe = getRecipeById(recipeId);
            
            // Vérifier que l'utilisateur est le propriétaire ou admin
            if (!recipe.getAuthor().getId().equals(userId)) {
                // On peut ajouter une vérification admin ici si nécessaire
                throw new IllegalArgumentException("You can only delete your own recipes");
            }
            
            recipeRepository.delete(recipe);
            return true;
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }
    
    public boolean deleteRecipeAsAdmin(Long recipeId) {
        try {
            Recipe recipe = getRecipeById(recipeId);
            recipeRepository.delete(recipe);
            return true;
        } catch (ResourceNotFoundException e) {
            return false;
        }
    }
    
    // Méthodes de recherche
    
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByAuthor(User author) {
        return recipeRepository.findByAuthor(author);
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> getRecipesByAuthor(User author, Pageable pageable) {
        return recipeRepository.findByAuthor(author, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByAuthorId(Long authorId) {
        return recipeRepository.findByAuthorId(authorId);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> searchRecipes(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllRecipes();
        }
        return recipeRepository.searchRecipes(searchTerm.trim());
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> searchRecipes(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllRecipes(pageable);
        }
        return recipeRepository.searchRecipes(searchTerm.trim(), pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> findRecipesByTitle(String title) {
        return recipeRepository.findByTitleContainingIgnoreCase(title);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> findRecipesByKeywords(String keywords) {
        return recipeRepository.findByKeywordsContainingIgnoreCase(keywords);
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> findRecipesWithFilters(String title, String ingredients, 
                                             String keywords, Long authorId, Pageable pageable) {
        return recipeRepository.findRecipesWithFilters(title, ingredients, keywords, authorId, pageable);
    }
    
    // Méthodes utilitaires
    
    @Transactional(readOnly = true)
    public List<Recipe> getRecentRecipes() {
        return recipeRepository.findTop10ByOrderByCreatedAtDesc();
    }
    
    @Transactional(readOnly = true)
    public Page<Recipe> getRecentRecipes(Pageable pageable) {
        return recipeRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> getMostCommentedRecipes(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return recipeRepository.findMostCommentedRecipes(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Recipe> getRecipesByPeriod(LocalDateTime startDate, LocalDateTime endDate) {
        return recipeRepository.findByCreatedAtBetween(startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public boolean isRecipeOwnedByUser(Long recipeId, Long userId) {
        return recipeRepository.isRecipeOwnedByUser(recipeId, userId);
    }
    
    @Transactional(readOnly = true)
    public long countRecipesByAuthor(Long authorId) {
        return recipeRepository.countByAuthorId(authorId);
    }
    
    // Statistiques
    
    @Transactional(readOnly = true)
    public Map<String, Object> getRecipeStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalRecipes = recipeRepository.count();
        stats.put("totalRecipes", totalRecipes);
        
        // Recettes récentes (7 derniers jours)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentRecipes = recipeRepository.findByCreatedAtBetween(weekAgo, LocalDateTime.now()).size();
        stats.put("recentRecipes", recentRecipes);
        
        // Recettes du mois
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        long monthlyRecipes = recipeRepository.findByCreatedAtBetween(monthAgo, LocalDateTime.now()).size();
        stats.put("monthlyRecipes", monthlyRecipes);
        
        return stats;
    }
}