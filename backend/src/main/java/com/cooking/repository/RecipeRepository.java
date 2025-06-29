package com.cooking.repository;

import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

       // Recherche par auteur
       List<Recipe> findByAuthor(User author);

       Page<Recipe> findByAuthor(User author, Pageable pageable);

       List<Recipe> findByAuthorId(Long authorId);

       // Recherche par titre
       List<Recipe> findByTitleContainingIgnoreCase(String title);

       // Recherche par mots-clés
       List<Recipe> findByKeywordsContainingIgnoreCase(String keywords);

       // Recherche dans titre, ingrédients ou mots-clés
       @Query("SELECT r FROM Recipe r WHERE " +
                     "LOWER(r.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(r.ingredients) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(r.keywords) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
       List<Recipe> searchRecipes(@Param("searchTerm") String searchTerm);

       @Query("SELECT r FROM Recipe r WHERE " +
                     "LOWER(r.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(r.ingredients) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(r.keywords) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
       Page<Recipe> searchRecipes(@Param("searchTerm") String searchTerm, Pageable pageable);

       // Recherche avancée
       @Query("SELECT r FROM Recipe r WHERE " +
                     "(:title IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
                     "(:ingredients IS NULL OR LOWER(r.ingredients) LIKE LOWER(CONCAT('%', :ingredients, '%'))) AND " +
                     "(:keywords IS NULL OR LOWER(r.keywords) LIKE LOWER(CONCAT('%', :keywords, '%'))) AND " +
                     "(:authorId IS NULL OR r.author.id = :authorId)")
       Page<Recipe> findRecipesWithFilters(
                     @Param("title") String title,
                     @Param("ingredients") String ingredients,
                     @Param("keywords") String keywords,
                     @Param("authorId") Long authorId,
                     Pageable pageable);

       // Recettes récentes
       List<Recipe> findTop10ByOrderByCreatedAtDesc();

       Page<Recipe> findAllByOrderByCreatedAtDesc(Pageable pageable);

       // Recettes par période
       List<Recipe> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

       // Compter les recettes par auteur
       long countByAuthor(User author);

       long countByAuthorId(Long authorId);

       // Recettes avec commentaires
       @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.comments WHERE r.id = :recipeId")
       Recipe findByIdWithComments(@Param("recipeId") Long recipeId);

       // Recettes populaires (avec le plus de commentaires)
       @Query("SELECT r FROM Recipe r LEFT JOIN r.comments c " +
                     "GROUP BY r.id " +
                     "ORDER BY COUNT(c) DESC")
       List<Recipe> findMostCommentedRecipes(Pageable pageable);

       // Vérifier si l'utilisateur est propriétaire de la recette
       @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
                     "FROM Recipe r WHERE r.id = :recipeId AND r.author.id = :userId")
       boolean isRecipeOwnedByUser(@Param("recipeId") Long recipeId, @Param("userId") Long userId);
}