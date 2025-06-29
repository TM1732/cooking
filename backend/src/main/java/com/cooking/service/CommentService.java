package com.cooking.service;

import com.cooking.entity.Comment;
import com.cooking.entity.Recipe;
import com.cooking.entity.User;
import com.cooking.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // Ajouter un commentaire
    public Comment addComment(String content, User user, Recipe recipe) {
        Comment comment = new Comment(content, user, recipe);
        return commentRepository.save(comment);
    }

    // Lister les commentaires par recette
    public List<Comment> getCommentsByRecipe(Long recipeId) {
        return commentRepository.findByRecipeId(recipeId);
    }

    // Supprimer un commentaire si propriétaire OU admin
    public boolean deleteComment(Long commentId, Long userId, boolean isAdmin) {
        return commentRepository.findById(commentId).map(comment -> {
            if (isAdmin || comment.getUser().getId().equals(userId)) {
                commentRepository.delete(comment);
                return true;
            }
            return false;
        }).orElse(false);
    }
}
