package com.cooking.service;

import com.cooking.entity.User;
import com.cooking.repository.UserRepository;
import com.cooking.security.JwtTokenProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
        AuthenticationManager authenticationManager,
        JwtTokenProvider jwtTokenProvider,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Utilise Spring Security pour authentifier et générer le JWT
    public String authenticate(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        return jwtTokenProvider.generateToken(authentication);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public User register(String username, String email, String password) {
        if (userRepository.findByUsername(username).isPresent())
            throw new RuntimeException("Ce nom d'utilisateur existe déjà");

        if (userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Cet email existe déjà");

        User user = new User(username, email, passwordEncoder.encode(password), User.Role.USER);
        return userRepository.save(user);
    }
}
