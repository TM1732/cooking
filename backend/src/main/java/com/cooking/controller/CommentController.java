package com.cooking.controller;

import com.cooking.dto.CommentRequest;
import com.cooking.dto.CommentResponse;
import com.cooking.entity.Comment;
import com.cooking.entity.User;
import com.cooking.entity.Recipe;
import com.cooking.security.JwtTokenProvider;
import com.cooking.security.UserPrincipal;
import com.cooking.service.CommentService;
import com.cooking.service.RecipeService;
import com.cooking.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "https://localhost:3000")
public class CommentController {

    private final CommentService commentService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final RecipeService recipeService;

    public CommentController(CommentService commentService, JwtTokenProvider jwtTokenProvider, UserService userService,
            RecipeService recipeService) {
        this.commentService = commentService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.recipeService = recipeService;
    }

    // @GetMapping("/recipe/{recipeId}")
    // public ResponseEntity<List<Comment>> getCommentsByRecipe(@PathVariable Long
    // recipeId) {
    // List<Comment> comments = commentService.getCommentsByRecipe(recipeId);
    // return ResponseEntity.ok(comments);
    // }

    /** Récupérer tous les commentaires d'une recette (public) */
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByRecipe(@PathVariable Long recipeId) {
        List<Comment> comments = commentService.getCommentsByRecipe(recipeId);
        // Mapping vers DTO
        List<CommentResponse> responses = comments.stream()
                .map(CommentResponse::new)
                .toList();
        return ResponseEntity.ok(responses);
    }

    /** Ajouter un commentaire à une recette (authentifié) */
    @PostMapping("/recipe/{recipeId}")
    @PreAuthorize("hasRole('USER') or hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> addComment(
            @PathVariable Long recipeId,
            @RequestBody CommentRequest request,
            Authentication authentication) {

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.getUserById(principal.getId());
        Recipe recipe = recipeService.getRecipeById(recipeId);

        Comment created = commentService.addComment(request.getContent(), user, recipe);
        // return ResponseEntity.ok(created);

        Map<String, Object> response = Map.of(
                "id", created.getId(),
                "content", created.getContent(),
                "createdAt", created.getCreatedAt(),
                "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername()));
        return ResponseEntity.ok(response);
    }

    /**
     * Supprimer son commentaire (authentifié, mais uniquement si propriétaire ou
     * admin)
     */
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            HttpServletRequest httpRequest) {
        String token = getTokenFromRequest(httpRequest);
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        boolean isAdmin = jwtTokenProvider.getRoleFromToken(token).equalsIgnoreCase("ADMIN");

        boolean deleted = commentService.deleteComment(commentId, userId, isAdmin);
        if (!deleted)
            return ResponseEntity.status(403).body("Suppression non autorisée.");
        return ResponseEntity.ok("Commentaire supprimé");
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        return (bearer != null && bearer.startsWith("Bearer ")) ? bearer.substring(7) : null;
    }
}
