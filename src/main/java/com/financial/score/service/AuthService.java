package com.financial.score.service;

import com.financial.score.model.Usuario;
import com.financial.score.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService        jwtService;
    private final PasswordEncoder   passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       JwtService        jwtService,
                       PasswordEncoder   passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService        = jwtService;
        this.passwordEncoder   = passwordEncoder;
    }

    public Map<String, String> login(String email, String password) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(password, usuario.getPasswordHash()))
            throw new RuntimeException("Credenciales inválidas");

        if (!"activo".equalsIgnoreCase(usuario.getEstado()))
            throw new RuntimeException("Cuenta inactiva. Contacta al administrador.");

        return Map.of(
                "token",  jwtService.generarToken(usuario),
                "nombre", usuario.getNombre(),
                "rol",    usuario.getRol()
        );
    }
}