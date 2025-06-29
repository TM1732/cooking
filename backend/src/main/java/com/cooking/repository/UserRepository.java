package com.cooking.repository;

import com.cooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Méthodes de recherche principales
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByVerificationToken(String verificationToken);
    
    // Méthodes d'existence
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    // Recherche par username ou email
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    // Recherche par rôle
    List<User> findByRole(User.Role role);
    
    // Recherche par statut activé
    List<User> findByEnabled(boolean enabled);
    
    // Recherche par email vérifié
    List<User> findByEmailVerified(boolean emailVerified);
    
    // Recherche avancée
    @Query("SELECT u FROM User u WHERE " +
           "(:username IS NULL OR u.username LIKE %:username%) AND " +
           "(:email IS NULL OR u.email LIKE %:email%) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:enabled IS NULL OR u.enabled = :enabled)")
    List<User> findUsersWithFilters(
        @Param("username") String username,
        @Param("email") String email,
        @Param("role") User.Role role,
        @Param("enabled") Boolean enabled
    );
    
    // Compter les utilisateurs par rôle
    long countByRole(User.Role role);
    
    // Compter les utilisateurs actifs
    long countByEnabled(boolean enabled);
    
    // Compter les utilisateurs avec email vérifié
    long countByEmailVerified(boolean emailVerified);
    
    // Recherche par nom complet (prénom + nom)
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(CONCAT(COALESCE(u.firstName, ''), ' ', COALESCE(u.lastName, ''))) " +
           "LIKE LOWER(CONCAT('%', :fullName, '%'))")
    List<User> findByFullNameContaining(@Param("fullName") String fullName);
}