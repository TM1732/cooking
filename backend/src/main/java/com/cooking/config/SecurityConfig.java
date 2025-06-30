package com.cooking.config;

import com.cooking.security.JwtAuthenticationFilter;
import com.cooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages/security");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(3600);
        return messageSource;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder); 
        authProvider.setMessageSource(messageSource());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // Endpoints publics
                        .requestMatchers("/api/health", "/api/users/count").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // Endpoints API publics pour les recettes (lecture seule)
                        .requestMatchers(HttpMethod.GET, "/api/recipes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recipes/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recipes/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recipes/user/{userId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recipes/recent").permitAll()
                        .requestMatchers("/api/recipes/public/**").permitAll()

                        // Endpoints protégés - Utilisateurs authentifiés pour les recettes
                        .requestMatchers(HttpMethod.POST, "/api/recipes").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/recipes/**").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/recipes/**").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/recipes/my-recipes").hasAnyRole("USER", "CHEF", "ADMIN")

                        // Endpoints protégés - Commentaires
                        .requestMatchers(HttpMethod.POST, "/api/comments/**").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/comments/**").hasAnyRole("USER", "CHEF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()

                        // ===== ENDPOINTS USERS CRUD - ADMIN SEULEMENT =====
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN") // ⭐ NOUVEAU
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN") // ⭐ NOUVEAU
                        .requestMatchers(HttpMethod.PATCH, "/api/users/*/role").hasRole("ADMIN") // Existant
                        .requestMatchers(HttpMethod.PATCH, "/api/users/*/status").hasRole("ADMIN") // ⭐ NOUVEAU
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN") // Existant
                        .requestMatchers(HttpMethod.GET, "/api/users/stats").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/{id}").hasAnyRole("USER", "CHEF", "ADMIN")

                        // Endpoints Admin généraux
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/recipes/stats").hasRole("ADMIN")

                        // Endpoints Public
                        .requestMatchers(HttpMethod.GET, "/api/stats/public").permitAll()

                        // Tout le reste nécessite une authentification
                        .anyRequest().authenticated())
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // Pour H2 Console (dev uniquement) - Syntaxe moderne
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3300"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}