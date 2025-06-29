package com.cooking.repository;

import com.cooking.entity.Comment;
import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Recherche par recette
    List<Comment> findByRecipe(Recipe recipe);
    
    List<Comment> findByRecipeId(Long recipeId);
    
    List<Comment> findByRecipeOrderByCreatedAtDesc(Recipe recipe);
    
    // Recherche par utilisateur
    List<Comment> findByUser(User user);
    
    List<Comment> findByUserId(Long userId);
    
    // Compter les commentaires
    long countByRecipe(Recipe recipe);
    
    long countByRecipeId(Long recipeId);
    
    long countByUser(User user);
}