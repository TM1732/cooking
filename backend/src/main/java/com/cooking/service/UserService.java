package com.cooking.service;

import com.cooking.entity.User;
import com.cooking.exception.ResourceNotFoundException;
import com.cooking.repository.UserRepository;
import com.cooking.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Implémentation UserDetailsService pour Spring Security
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));
        
        return UserPrincipal.create(user);
    }
    
    // Charger par ID (pour JWT)
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        return UserPrincipal.create(user);
    }
    
    // Méthodes CRUD
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null); // Modifié pour retourner null au lieu d'exception
    }
    
    // Version qui lance exception (pour compatibilité)
    @Transactional(readOnly = true)
    public User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
    
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // ===== NOUVELLES MÉTHODES CRUD POUR L'ADMINISTRATION =====
    
    /**
     * Créer un utilisateur avec paramètres individuels (pour l'admin)
     */
    public User createUser(String username, String email, String password, User.Role role) {
        // Vérifier que l'username et l'email sont uniques
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Un utilisateur avec ce nom existe déjà");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role != null ? role : User.Role.USER);
        user.setEnabled(true); // Actif par défaut
        user.setEmailVerified(true); // Vérifié par défaut pour les comptes admin
        
        return userRepository.save(user);
    }
    
    /**
     * Mettre à jour un utilisateur avec paramètres individuels (pour l'admin)
     */
    public User updateUser(Long userId, String username, String email, String password, User.Role role) {
        User user = getUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("Utilisateur non trouvé");
        }
        
        // Vérifier l'unicité si changement
        if (username != null && !username.equals(user.getUsername())) {
            if (userRepository.existsByUsername(username)) {
                throw new IllegalArgumentException("Un utilisateur avec ce nom existe déjà");
            }
            user.setUsername(username);
        }
        
        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
            }
            user.setEmail(email);
        }
        
        if (password != null && !password.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        
        if (role != null) {
            user.setRole(role);
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Mettre à jour le statut d'un utilisateur (actif/suspendu)
     */
    public User updateUserStatus(Long userId, boolean isActive) {
        User user = getUserById(userId);
        if (user == null) {
            throw new IllegalArgumentException("Utilisateur non trouvé");
        }
        
        user.setEnabled(isActive);
        return userRepository.save(user);
    }
    
    // ===== MÉTHODES EXISTANTES (conservées pour compatibilité) =====
    
    public User createUser(User user) {
        // Vérifier que l'username et l'email sont uniques
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Définir les valeurs par défaut si nécessaires
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = getUserByIdOrThrow(id); // Utilise la version qui lance exception
        
        // Vérifier l'unicité du username si modifié
        if (!user.getUsername().equals(userDetails.getUsername()) &&
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + userDetails.getUsername());
        }
        
        // Vérifier l'unicité de l'email si modifié
        if (!user.getEmail().equals(userDetails.getEmail()) &&
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userDetails.getEmail());
        }
        
        // Mettre à jour les champs
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        
        // Ne pas modifier le mot de passe ici (méthode séparée)
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        
        return userRepository.save(user);
    }
    
    public boolean deleteUser(Long id) {
        try {
            User user = getUserById(id);
            if (user == null) {
                return false;
            }
            userRepository.delete(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public User changePassword(Long userId, String currentPassword, String newPassword) {
        User user = getUserByIdOrThrow(userId);
        
        // Vérifier le mot de passe actuel
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Encoder et sauvegarder le nouveau mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
    
    public User enableUser(Long userId) {
        User user = getUserByIdOrThrow(userId);
        user.setEnabled(true);
        return userRepository.save(user);
    }
    
    public User disableUser(Long userId) {
        User user = getUserByIdOrThrow(userId);
        user.setEnabled(false);
        return userRepository.save(user);
    }
    
    public User verifyEmail(String verificationToken) {
        User user = userRepository.findByVerificationToken(verificationToken)
            .orElseThrow(() -> new ResourceNotFoundException("User", "verificationToken", verificationToken));
        
        user.setEmailVerified(true);
        user.setVerificationToken(null); // Supprimer le token après vérification
        user.setEnabled(true);
        
        return userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Méthode pour mettre à jour le rôle d'un utilisateur
    public User updateUserRole(Long userId, User.Role newRole) {
        User user = getUserById(userId);
        if (user == null) {
            return null;
        }
        user.setRole(newRole);
        return userRepository.save(user);
    }
    
    // Méthodes supplémentaires qui pourraient être nécessaires pour le contrôleur
    public User updateUserProfile(Long userId, String firstName, String lastName, String email) {
        User user = getUserByIdOrThrow(userId);
        
        // Vérifier l'unicité de l'email si modifié
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        
        return userRepository.save(user);
    }
    
    public User lockUser(Long userId) {
        User user = getUserByIdOrThrow(userId);
        user.setAccountNonLocked(false);
        return userRepository.save(user);
    }
    
    public User unlockUser(Long userId) {
        User user = getUserByIdOrThrow(userId);
        user.setAccountNonLocked(true);
        return userRepository.save(user);
    }
    
    // Méthode pour obtenir les statistiques des utilisateurs
    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Nombre total d'utilisateurs
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        // Nombre par rôle
        Map<String, Long> usersByRole = new HashMap<>();
        for (User.Role role : User.Role.values()) {
            long count = userRepository.countByRole(role);
            usersByRole.put(role.name(), count);
        }
        stats.put("usersByRole", usersByRole);
        
        // Nombre d'utilisateurs actifs/inactifs
        long activeUsers = userRepository.countByEnabled(true);
        long inactiveUsers = userRepository.countByEnabled(false);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", inactiveUsers);
        
        // Nombre d'utilisateurs avec email vérifié
        long verifiedUsers = userRepository.countByEmailVerified(true);
        long unverifiedUsers = userRepository.countByEmailVerified(false);
        stats.put("verifiedUsers", verifiedUsers);
        stats.put("unverifiedUsers", unverifiedUsers);
        
        return stats;
    }
}