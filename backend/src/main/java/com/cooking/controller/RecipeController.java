package com.cooking.controller;

import com.cooking.dto.RecipeRequest;
import com.cooking.dto.RecipeResponse;
import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import com.cooking.security.UserPrincipal;
import com.cooking.service.RecipeService;
import com.cooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:3300")
public class RecipeController {
    
    @Autowired
    private RecipeService recipeService;
    
    @Autowired
    private UserService userService;
    
    // @Autowired
    // private JwtTokenProvider jwtTokenProvider;
    
    /**
     * Récupérer toutes les recettes (public, avec pagination)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        try {
            Page<Recipe> recipePage = recipeService.getAllRecipesSorted(page, size, sortBy, sortDirection);
            
            List<RecipeResponse> recipes = recipePage.getContent().stream()
                .map(RecipeResponse::new)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("recipes", recipes);
            response.put("currentPage", recipePage.getNumber());
            response.put("totalPages", recipePage.getTotalPages());
            response.put("totalItems", recipePage.getTotalElements());
            response.put("hasNext", recipePage.hasNext());
            response.put("hasPrevious", recipePage.hasPrevious());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération des recettes: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Récupérer une recette par ID (public)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeByIdWithComments(id);
            RecipeResponse response = new RecipeResponse(recipe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération de la recette: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Recette non trouvée");
            return ResponseEntity.status(404).body(error);
        }
    }
    
    /**
     * Créer une nouvelle recette (utilisateurs authentifiés)
     */
    @PostMapping
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> createRecipe(@Valid @RequestBody RecipeRequest recipeRequest, 
                                        Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User author = userService.getUserById(userPrincipal.getId());
            
            System.out.println("🍳 Création d'une nouvelle recette par: " + userPrincipal.getUsername());
            System.out.println("   Titre: " + recipeRequest.getTitle());
            
            Recipe recipe = recipeService.createRecipe(recipeRequest, author);
            RecipeResponse response = new RecipeResponse(recipe);
            
            System.out.println("✅ Recette créée avec succès - ID: " + recipe.getId());
            
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Recette créée avec succès");
            result.put("recipe", response);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la création de la recette: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la création de la recette");
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Mettre à jour une recette (propriétaire seulement)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id,
                                        @Valid @RequestBody RecipeRequest recipeRequest,
                                        Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            System.out.println("🔄 Mise à jour de la recette " + id + " par: " + userPrincipal.getUsername());
            
            Recipe recipe = recipeService.updateRecipe(id, recipeRequest, userPrincipal.getId());
            RecipeResponse response = new RecipeResponse(recipe);
            
            System.out.println("✅ Recette mise à jour avec succès");
            
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Recette mise à jour avec succès");
            result.put("recipe", response);
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(403).body(error);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la mise à jour de la recette: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la mise à jour de la recette");
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Supprimer une recette (propriétaire ou admin)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id,
                                        Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            System.out.println("🗑️ Suppression de la recette " + id + " par: " + userPrincipal.getUsername());
            
            boolean deleted;
            if (userPrincipal.getRole() == User.Role.ADMIN) {
                deleted = recipeService.deleteRecipeAsAdmin(id);
            } else {
                deleted = recipeService.deleteRecipe(id, userPrincipal.getId());
            }
            
            if (!deleted) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Recette non trouvée");
                return ResponseEntity.status(404).body(error);
            }
            
            System.out.println("✅ Recette supprimée avec succès");
            
            Map<String, String> result = new HashMap<>();
            result.put("message", "Recette supprimée avec succès");
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(403).body(error);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la suppression de la recette: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la suppression de la recette");
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Rechercher des recettes
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRecipes(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Recipe> recipePage = recipeService.searchRecipes(q, pageable);
            
            List<RecipeResponse> recipes = recipePage.getContent().stream()
                .map(RecipeResponse::new)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("recipes", recipes);
            response.put("currentPage", recipePage.getNumber());
            response.put("totalPages", recipePage.getTotalPages());
            response.put("totalItems", recipePage.getTotalElements());
            response.put("searchTerm", q);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la recherche de recettes: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Récupérer les recettes d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getRecipesByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User author = userService.getUserById(userId);
            Pageable pageable = PageRequest.of(page, size);
            Page<Recipe> recipePage = recipeService.getRecipesByAuthor(author, pageable);
            
            List<RecipeResponse> recipes = recipePage.getContent().stream()
                .map(RecipeResponse::new)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("recipes", recipes);
            response.put("currentPage", recipePage.getNumber());
            response.put("totalPages", recipePage.getTotalPages());
            response.put("totalItems", recipePage.getTotalElements());
            response.put("author", Map.of(
                "id", author.getId(),
                "username", author.getUsername(),
                "fullName", author.getFullName()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération des recettes de l'utilisateur: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Récupérer les recettes récentes
     */
    @GetMapping("/recent")
    public ResponseEntity<List<RecipeResponse>> getRecentRecipes() {
        try {
            List<Recipe> recipes = recipeService.getRecentRecipes();
            List<RecipeResponse> response = recipes.stream()
                .map(RecipeResponse::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération des recettes récentes: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Mes recettes (utilisateur connecté)
     */
    @GetMapping("/my-recipes")
    @PreAuthorize("hasRole('USER') or hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyRecipes(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User author = userService.getUserById(userPrincipal.getId());
            
            Pageable pageable = PageRequest.of(page, size);
            Page<Recipe> recipePage = recipeService.getRecipesByAuthor(author, pageable);
            
            List<RecipeResponse> recipes = recipePage.getContent().stream()
                .map(RecipeResponse::new)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("recipes", recipes);
            response.put("currentPage", recipePage.getNumber());
            response.put("totalPages", recipePage.getTotalPages());
            response.put("totalItems", recipePage.getTotalElements());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération de mes recettes: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Statistiques des recettes (admin seulement)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRecipeStats() {
        try {
            Map<String, Object> stats = recipeService.getRecipeStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la récupération des statistiques: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erreur lors de la récupération des statistiques");
            return ResponseEntity.status(500).body(error);
        }
    }
}