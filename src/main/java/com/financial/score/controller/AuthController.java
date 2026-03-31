package com.financial.score.controller;

import com.financial.score.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Body:    { "email": "...", "password": "..." }
     * OK 200:  { "token": "eyJ...", "nombre": "...", "rol": "analista" }
     * Err 401: { "error": "Credenciales inválidas" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body) {
        try {
            return ResponseEntity.ok(
                    authService.login(body.getEmail(), body.getPassword())
            );
        } catch (RuntimeException ex) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail()             { return email; }
        public void   setEmail(String e)     { this.email = e; }
        public String getPassword()          { return password; }
        public void   setPassword(String p)  { this.password = p; }
    }
}