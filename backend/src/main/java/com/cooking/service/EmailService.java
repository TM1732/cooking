package com.cooking.service;

import com.cooking.entity.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Profile("!dev")  // Ne pas charger en mode dev
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.mail.from:noreply@cooking-app.com}")
    private String fromEmail;
    
    @Value("${app.mail.enabled:true}")
    private boolean emailEnabled;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    /**
     * Envoyer un email de bienvenue à un nouvel utilisateur
     */
    public void sendWelcomeEmail(User user) {
        if (!emailEnabled) {
            logger.info("📧 Email désactivé - Email de bienvenue non envoyé à: {}", user.getEmail());
            return;
        }
        
        try {
            logger.info("📧 Envoi de l'email de bienvenue à: {}", user.getEmail());
            
            // Créer l'email HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🍳 Bienvenue sur Cooking Website !");
            
            String htmlContent = buildWelcomeEmailHtml(user);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
            logger.info("✅ Email de bienvenue envoyé avec succès à: {}", user.getEmail());
            
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'envoi de l'email de bienvenue à {}: {}", 
                        user.getEmail(), e.getMessage(), e);
            // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
        }
    }
    
    /**
     * Envoyer un email de vérification d'adresse
     */
    public void sendVerificationEmail(User user, String verificationToken) {
        if (!emailEnabled) {
            logger.info("📧 Email désactivé - Email de vérification non envoyé à: {}", user.getEmail());
            return;
        }
        
        try {
            logger.info("📧 Envoi de l'email de vérification à: {}", user.getEmail());
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🔐 Vérifiez votre adresse email - Cooking Website");
            
            String htmlContent = buildVerificationEmailHtml(user, verificationToken);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
            logger.info("✅ Email de vérification envoyé avec succès à: {}", user.getEmail());
            
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'envoi de l'email de vérification à {}: {}", 
                        user.getEmail(), e.getMessage(), e);
        }
    }
    
    /**
     * Envoyer un email simple (texte brut)
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        if (!emailEnabled) {
            logger.info("📧 Email désactivé - Email simple non envoyé à: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            
            logger.info("✅ Email simple envoyé avec succès à: {}", to);
            
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'envoi de l'email simple à {}: {}", to, e.getMessage(), e);
        }
    }
    
    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    public void sendPasswordResetEmail(User user, String resetToken) {
        if (!emailEnabled) {
            logger.info("📧 Email désactivé - Email de reset non envoyé à: {}", user.getEmail());
            return;
        }
        
        try {
            logger.info("📧 Envoi de l'email de réinitialisation à: {}", user.getEmail());
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("🔑 Réinitialisation de votre mot de passe - Cooking Website");
            
            String htmlContent = buildPasswordResetEmailHtml(user, resetToken);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
            logger.info("✅ Email de réinitialisation envoyé avec succès à: {}", user.getEmail());
            
        } catch (Exception e) {
            logger.error("❌ Erreur lors de l'envoi de l'email de réinitialisation à {}: {}", 
                        user.getEmail(), e.getMessage(), e);
        }
    }
    
    /**
     * Construire le contenu HTML de l'email de bienvenue
     */
    private String buildWelcomeEmailHtml(User user) {
        String userName = user.getFirstName() != null ? user.getFirstName() : user.getUsername();
        String roleFriendlyName = getRoleFriendlyName(user.getRole());
        
        return String.format("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenue sur Cooking Website</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .content { padding: 30px; }
                    .content h2 { color: #667eea; margin-top: 0; }
                    .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .feature { margin: 15px 0; }
                    .feature-icon { display: inline-block; width: 25px; font-size: 20px; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; text-align: center; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
                    .role-badge { background: #e3f2fd; color: #1976d2; padding: 5px 15px; border-radius: 15px; font-size: 14px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍳 Bienvenue sur Cooking Website !</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Bonjour %s ! 👋</h2>
                        
                        <p>Félicitations ! Votre compte a été créé avec succès.</p>
                        
                        <p><strong>Informations de votre compte :</strong></p>
                        <ul>
                            <li><strong>Nom d'utilisateur :</strong> %s</li>
                            <li><strong>Email :</strong> %s</li>
                            <li><strong>Rôle :</strong> <span class="role-badge">%s</span></li>
                        </ul>
                        
                        <div class="features">
                            <h3>🎉 Que pouvez-vous faire maintenant ?</h3>
                            
                            <div class="feature">
                                <span class="feature-icon">📖</span>
                                <strong>Découvrir des recettes</strong> - Explorez notre collection de recettes savoureuses
                            </div>
                            
                            <div class="feature">
                                <span class="feature-icon">✍️</span>
                                <strong>Créer vos recettes</strong> - Partagez vos créations culinaires avec la communauté
                            </div>
                            
                            <div class="feature">
                                <span class="feature-icon">💬</span>
                                <strong>Commenter et interagissez avec les autres passionnés de cuisine
                            </div>
                            
                            <div class="feature">
                                <span class="feature-icon">⭐</span>
                                <strong>Sauvegarder vos favoris</strong> - Gardez vos recettes préférées à portée de main
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="%s" class="cta-button">🚀 Commencer à cuisiner</a>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 14px; color: #666;">
                            <strong>Conseil :</strong> N'hésitez pas à compléter votre profil et à ajouter une photo pour personnaliser votre expérience !
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>Merci de faire partie de notre communauté culinaire ! 👨‍🍳👩‍🍳</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            Si vous avez des questions, n'hésitez pas à nous contacter.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, userName, user.getUsername(), user.getEmail(), roleFriendlyName, frontendUrl);
    }
    
    /**
     * Construire le contenu HTML de l'email de vérification
     */
    private String buildVerificationEmailHtml(User user, String verificationToken) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        String userName = user.getFirstName() != null ? user.getFirstName() : user.getUsername();
        
        return String.format("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vérification Email</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ff6b6b 0%%, #ee5a24 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; text-align: center; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Vérifiez votre email</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Bonjour %s !</h2>
                        <p>Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                        
                        <a href="%s" class="cta-button">✅ Vérifier mon email</a>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Ce lien expire dans 24 heures.<br>
                            Si vous n'avez pas créé de compte, ignorez cet email.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>Cooking Website - Votre communauté culinaire</p>
                    </div>
                </div>
            </body>
            </html>
            """, userName, verificationUrl);
    }
    
    /**
     * Construire le contenu HTML de l'email de réinitialisation
     */
    private String buildPasswordResetEmailHtml(User user, String resetToken) {
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        String userName = user.getFirstName() != null ? user.getFirstName() : user.getUsername();
        
        return String.format("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Réinitialisation mot de passe</title>
                <style>
                    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 0; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ffa726 0%%, #ff7043 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; text-align: center; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #ffa726, #ff7043); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔑 Réinitialisation du mot de passe</h1>
                    </div>
                    
                    <div class="content">
                        <h2>Bonjour %s !</h2>
                        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
                        
                        <a href="%s" class="cta-button">🔄 Réinitialiser mon mot de passe</a>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Ce lien expire dans 1 heure pour des raisons de sécurité.<br>
                            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>Cooking Website - Votre communauté culinaire</p>
                    </div>
                </div>
            </body>
            </html>
            """, userName, resetUrl);
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
    
    /**
     * Vérifier si le service email est activé
     */
    public boolean isEmailEnabled() {
        return emailEnabled;
    }
}