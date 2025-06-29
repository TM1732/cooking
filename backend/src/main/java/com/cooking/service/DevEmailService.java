package com.cooking.service;

import com.cooking.entity.User;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service d'email pour le développement - Affiche les emails dans la console
 */
@Service
@Profile("dev")
public class DevEmailService extends EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(DevEmailService.class);
    
    @Override
    public void sendWelcomeEmail(User user) {
        logger.info("🎉 ========================================");
        logger.info("📧 EMAIL DE BIENVENUE (MODE DÉVELOPPEMENT)");
        logger.info("🎉 ========================================");
        logger.info("📤 DESTINATAIRE: {}", user.getEmail());
        logger.info("👤 UTILISATEUR: {}", user.getUsername());
        logger.info("🎭 RÔLE: {}", user.getRole());
        logger.info("📝 SUJET: 🍳 Bienvenue sur Cooking App !");
        logger.info("");
        logger.info("📄 CONTENU DE L'EMAIL:");
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        String userName = user.getFirstName() != null ? user.getFirstName() : user.getUsername();
        
        logger.info("🍳 Bienvenue sur Cooking App !");
        logger.info("");
        logger.info("Bonjour {} ! 👋", userName);
        logger.info("");
        logger.info("Félicitations ! Votre compte a été créé avec succès.");
        logger.info("");
        logger.info("Informations de votre compte :");
        logger.info("• Nom d'utilisateur : {}", user.getUsername());
        logger.info("• Email : {}", user.getEmail());
        logger.info("• Rôle : {}", getRoleFriendlyName(user.getRole()));
        logger.info("");
        logger.info("🎉 Que pouvez-vous faire maintenant ?");
        logger.info("");
        logger.info("📖 Découvrir des recettes - Explorez notre collection");
        logger.info("✍️ Créer vos recettes - Partagez vos créations culinaires");
        logger.info("💬 Commenter et noter - Interagissez avec la communauté");
        logger.info("⭐ Sauvegarder vos favoris - Gardez vos recettes préférées");
        logger.info("");
        logger.info("🚀 Commencer à cuisiner: http://localhost:3000");
        logger.info("");
        logger.info("Merci de faire partie de notre communauté culinaire ! 👨‍🍳👩‍🍳");
        
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logger.info("✅ Email de bienvenue 'envoyé' en mode développement");
        logger.info("🎉 ========================================");
    }
    
    @Override
    public void sendVerificationEmail(User user, String verificationToken) {
        logger.info("🔐 ========================================");
        logger.info("📧 EMAIL DE VÉRIFICATION (MODE DÉVELOPPEMENT)");
        logger.info("🔐 ========================================");
        logger.info("📤 DESTINATAIRE: {}", user.getEmail());
        logger.info("👤 UTILISATEUR: {}", user.getUsername());
        logger.info("🔑 TOKEN: {}", verificationToken);
        logger.info("📝 SUJET: 🔐 Vérifiez votre adresse email");
        logger.info("");
        logger.info("🔗 LIEN DE VÉRIFICATION:");
        logger.info("http://localhost:3000/verify-email?token={}", verificationToken);
        logger.info("");
        logger.info("✅ Email de vérification 'envoyé' en mode développement");
        logger.info("🔐 ========================================");
    }
    
    @Override
    public void sendPasswordResetEmail(User user, String resetToken) {
        logger.info("🔑 ========================================");
        logger.info("📧 EMAIL DE RESET (MODE DÉVELOPPEMENT)");
        logger.info("🔑 ========================================");
        logger.info("📤 DESTINATAIRE: {}", user.getEmail());
        logger.info("👤 UTILISATEUR: {}", user.getUsername());
        logger.info("🔑 TOKEN: {}", resetToken);
        logger.info("📝 SUJET: 🔑 Réinitialisation de votre mot de passe");
        logger.info("");
        logger.info("🔗 LIEN DE RESET:");
        logger.info("http://localhost:3000/reset-password?token={}", resetToken);
        logger.info("");
        logger.info("✅ Email de reset 'envoyé' en mode développement");
        logger.info("🔑 ========================================");
    }
    
    @Override
    public void sendSimpleEmail(String to, String subject, String text) {
        logger.info("📧 ========================================");
        logger.info("📧 EMAIL SIMPLE (MODE DÉVELOPPEMENT)");
        logger.info("📧 ========================================");
        logger.info("📤 DESTINATAIRE: {}", to);
        logger.info("📝 SUJET: {}", subject);
        logger.info("📄 CONTENU:");
        logger.info("{}", text);
        logger.info("✅ Email simple 'envoyé' en mode développement");
        logger.info("📧 ========================================");
    }
    
    /**
     * Obtenir le nom convivial du rôle
     */
    private String getRoleFriendlyName(User.Role role) {
        return switch (role) {
            case USER -> "Utilisateur";
            case CHEF -> "Chef";
            case ADMIN -> "Administrateur";
            case MODERATOR -> "Modérateur";
        };
    }
    
    @Override
    public boolean isEmailEnabled() {
        return true; // Toujours activé en mode dev (pour les logs)
    }
}