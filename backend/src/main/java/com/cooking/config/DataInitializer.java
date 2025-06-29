package com.cooking.config;

import com.cooking.entity.User;
import com.cooking.entity.Recipe;
import com.cooking.repository.UserRepository;
import com.cooking.repository.RecipeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, RecipeRepository recipeRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        if (userRepository.count() == 0) {
            logger.info("🚀 Initialisation des données de test...");

            // Utilisateurs de test
            User admin = new User("admin", "admin@cooking.com", passwordEncoder.encode("admin"), User.Role.ADMIN);
            userRepository.save(admin);

            User chef = new User("chef", "chef@cooking.com", passwordEncoder.encode("chef"), User.Role.CHEF);
            userRepository.save(chef);

            User user = new User("user", "user@cooking.com", passwordEncoder.encode("user"), User.Role.USER);
            userRepository.save(user);

            logger.info("✅ Utilisateurs de test créés :");
            logger.info("   👑 Admin: admin/admin");
            logger.info("   👨‍🍳 Chef: chef/chef");
            logger.info("   👤 User: user/user");

            // Recettes de test
            Recipe recette1 = new Recipe("Tarte aux pommes", "Délicieuse tarte à base de pommes.", null, null, chef);
            recipeRepository.save(recette1);

            Recipe recette2 = new Recipe("Salade César", "Salade fraîche avec poulet et croûtons.", null, null, chef);
            recipeRepository.save(recette2);

            logger.info("✅ Recettes de test créées :");
            logger.info("   🥧 Tarte aux pommes par chef");
            logger.info("   🥗 Salade César par chef");
        } else {
            logger.info("ℹ️ Données déjà initialisées");
        }
    }
}
