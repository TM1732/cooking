package com.cooking.controller;

import com.cooking.dto.CreateUserRequest;
import com.cooking.dto.UpdateUserRequest;
import com.cooking.dto.UpdateRoleRequest;
import com.cooking.dto.UpdateStatusRequest;
import com.cooking.dto.UserSummary;
import com.cooking.entity.User;
import com.cooking.security.JwtTokenProvider;
import com.cooking.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "https://localhost:3000")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /** Récupérer tous les utilisateurs (admin seulement, DTO sécurisé) */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserSummary>> getAllUsers(HttpServletRequest request) {
        String admin = extractUsername(request);
        logger.info("📋 [ADMIN {}] Récupère la liste des utilisateurs", admin);

        List<UserSummary> users = userService.getAllUsers().stream()
                .map(UserSummary::new).toList();
        return ResponseEntity.ok(users);
    }

    /** Créer un nouvel utilisateur (admin seulement) */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(
            @Valid @RequestBody CreateUserRequest request,
            HttpServletRequest httpRequest) {
        String admin = extractUsername(httpRequest);
        logger.info("➕ [ADMIN {}] Crée un nouvel utilisateur: {}", admin, request.getUsername());

        try {
            User.Role role;
            try {
                role = User.Role.valueOf(request.getRole().trim().toUpperCase());
            } catch (Exception ex) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Rôle invalide: " + request.getRole()));
            }

            User newUser = userService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role);

            return ResponseEntity.ok(Map.of(
                    "message", "Utilisateur créé avec succès",
                    "user", new UserSummary(newUser)));
        } catch (Exception e) {
            logger.error("Erreur lors de la création de l'utilisateur", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /** Récupérer un utilisateur par ID (DTO sécurisé) */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
        }
        return ResponseEntity.ok(new UserSummary(user));
    }

    /** Mettre à jour un utilisateur (admin seulement) */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            HttpServletRequest httpRequest) {
        // ... code existant ...

        try {
            User.Role role = null;
            if (request.getRole() != null) {
                try {
                    role = User.Role.valueOf(request.getRole().trim().toUpperCase());
                } catch (Exception ex) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Rôle invalide: " + request.getRole()));
                }
            }

            // ⭐ MODIFIÉ : Validation du mot de passe côté contrôleur
            String passwordToUpdate = null;
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                if (request.getPassword().trim().length() < 3) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Le mot de passe doit contenir au moins 3 caractères"));
                }
                passwordToUpdate = request.getPassword();
            }

            User updated = userService.updateUser(id, request.getUsername(), request.getEmail(),
                    passwordToUpdate, role);

            return ResponseEntity.ok(Map.of(
                    "message", "Utilisateur modifié avec succès",
                    "user", new UserSummary(updated)));
        } catch (Exception e) {
            logger.error("Erreur lors de la modification de l'utilisateur", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /** Mettre à jour le rôle d'un utilisateur (admin seulement) */
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request,
            HttpServletRequest httpRequest) {
        String admin = extractUsername(httpRequest);
        Long adminId = extractUserId(httpRequest);

        if (id.equals(adminId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Vous ne pouvez pas modifier votre propre rôle administrateur"));
        }
        User.Role newRole;
        try {
            newRole = User.Role.valueOf(request.getRole().trim().toUpperCase());
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Rôle invalide: " + request.getRole()));
        }
        User updated = userService.updateUserRole(id, newRole);
        if (updated == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
        }
        logger.info("🔄 [ADMIN {}] Change rôle user {} vers {}", admin, id, newRole);
        return ResponseEntity.ok(Map.of(
                "message", "Rôle mis à jour avec succès",
                "user", new UserSummary(updated)));
    }

    /** Mettre à jour le statut d'un utilisateur (admin seulement) */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request,
            HttpServletRequest httpRequest) {
        String admin = extractUsername(httpRequest);
        Long adminId = extractUserId(httpRequest);

        if (id.equals(adminId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Vous ne pouvez pas modifier votre propre statut"));
        }

        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
        }

        // Empêcher de suspendre d'autres admins
        if (existingUser.getRole() == User.Role.ADMIN) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Vous ne pouvez pas modifier le statut d'un autre administrateur"));
        }

        try {
            boolean isActive = "active".equalsIgnoreCase(request.getStatus());
            User updated = userService.updateUserStatus(id, isActive);

            logger.info("🔄 [ADMIN {}] Change statut user {} vers {}", admin, id, request.getStatus());
            return ResponseEntity.ok(Map.of(
                    "message", "Statut mis à jour avec succès",
                    "user", new UserSummary(updated)));
        } catch (Exception e) {
            logger.error("Erreur lors de la modification du statut", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /** Supprimer un utilisateur (admin seulement) */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request) {
        String admin = extractUsername(request);
        Long adminId = extractUserId(request);

        if (id.equals(adminId)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Vous ne pouvez pas supprimer votre propre compte"));
        }

        // Vérifier que ce n'est pas un autre admin
        User existingUser = userService.getUserById(id);
        if (existingUser != null && existingUser.getRole() == User.Role.ADMIN) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Vous ne pouvez pas supprimer un autre administrateur"));
        }

        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.status(404).body(Map.of("message", "Utilisateur non trouvé"));
        }
        logger.info("🗑️ [ADMIN {}] Supprime user {}", admin, id);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé avec succès"));
    }

    /** Statistiques utilisateurs (admin seulement) */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }

    /** Utils */
    private String extractUsername(HttpServletRequest req) {
        String token = getTokenFromRequest(req);
        return token != null ? jwtTokenProvider.getUsernameFromToken(token) : "unknown";
    }

    private Long extractUserId(HttpServletRequest req) {
        String token = getTokenFromRequest(req);
        return token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        return (bearer != null && bearer.startsWith("Bearer ")) ? bearer.substring(7) : null;
    }
}