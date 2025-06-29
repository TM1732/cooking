package com.cooking.controller;

import com.cooking.entity.User;
import com.cooking.security.UserPrincipal;
import com.cooking.service.AuthService;
import com.cooking.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final EmailService emailService;
    
    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            User user = authService.findByUsername(loginRequest.getUsername());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString()
                ),
                "message", "Connexion réussie"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Nom d'utilisateur ou mot de passe incorrect",
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword()
            );
            
            // 🎉 ENVOI DE L'EMAIL DE BIENVENUE
            try {
                emailService.sendWelcomeEmail(user);
                System.out.println("📧 Email de bienvenue envoyé à: " + user.getEmail());
            } catch (Exception emailError) {
                // Log l'erreur mais ne pas faire échouer l'inscription
                System.err.println("⚠️ Erreur envoi email de bienvenue à " + user.getEmail() + ": " + emailError.getMessage());
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Inscription réussie",
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Erreur lors de l'inscription",
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
            "id", principal.getId(),
            "username", principal.getUsername(),
            "email", principal.getEmail(),
            "role", principal.getRole().toString()
        ));
    }

    // Classes internes pour les requêtes
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}