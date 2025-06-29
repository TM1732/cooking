package com.cooking.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final int jwtExpirationInMs;

    public JwtTokenProvider(
            @Value("${app.jwtSecret}") String jwtSecret,
            @Value("${app.jwtExpirationInMs}") int jwtExpirationInMs) {
        // Le secret doit faire au moins 256 bits pour HS256/HS512 (ici 512 bits pour HS512)
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.jwtExpirationInMs = jwtExpirationInMs;
    }

    /**
     * Générer un token JWT
     */
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("userId", userPrincipal.getId())
                .claim("role", userPrincipal.getRole())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Récupérer le nom d'utilisateur du token
     */
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Récupérer l'ID utilisateur du token
     */
    public Long getUserIdFromToken(String token) {
        return Long.valueOf(parseClaims(token).get("userId").toString());
    }

    /**
     * Récupérer le rôle utilisateur du token
     */
    public String getRoleFromToken(String token) {
        return parseClaims(token).get("role").toString();
    }

    /**
     * Valider le token JWT
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException ex) { // Couvre SignatureException, MalformedJwtException, ExpiredJwtException, UnsupportedJwtException
            System.err.println("JWT invalid: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string est vide");
        }
        return false;
    }

    /**
     * Récupérer toutes les claims du token
     */
    public Claims getClaimsFromToken(String token) {
        return parseClaims(token);
    }

    /**
     * Vérifier si le token a expiré
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
