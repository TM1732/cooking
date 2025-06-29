package com.cooking.dto;

import java.time.LocalDateTime;

import com.cooking.entity.Comment;

public class CommentResponse {
    private Long id;
    private String content;
    private String username;
    private Long userId;
    private LocalDateTime createdAt;

    public CommentResponse() {
    }

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        if (comment.getUser() != null) {
            this.username = comment.getUser().getUsername();
            this.userId = comment.getUser().getId();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
}
