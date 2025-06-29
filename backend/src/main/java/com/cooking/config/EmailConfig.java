package com.cooking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {
    
    @Value("${spring.mail.host:localhost}")
    private String mailHost;
    
    @Value("${spring.mail.port:587}")
    private int mailPort;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    @Value("${spring.mail.password:}")
    private String mailPassword;
    
    @Value("${spring.mail.properties.mail.smtp.auth:false}")
    private boolean mailAuth;
    
    @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}")
    private boolean mailStartTls;
    
    /**
     * Configuration JavaMailSender pour la production
     */
    @Bean
    @Profile("!test")
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        
        if (!mailUsername.isEmpty()) {
            mailSender.setUsername(mailUsername);
        }
        
        if (!mailPassword.isEmpty()) {
            mailSender.setPassword(mailPassword);
        }
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", mailAuth);
        props.put("mail.smtp.starttls.enable", mailStartTls);
        props.put("mail.smtp.starttls.required", mailStartTls);
        props.put("mail.debug", "false"); // Mettre à true pour debugger
        
        // Configuration spécifique Gmail
        if (mailHost.contains("gmail")) {
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        }
        
        return mailSender;
    }
    
    /**
     * Configuration JavaMailSender pour les tests (mock)
     */
    @Bean
    @Profile("test")
    public JavaMailSender testJavaMailSender() {
        // Pour les tests, on peut retourner un mock ou une implémentation simple
        return new JavaMailSenderImpl();
    }
}