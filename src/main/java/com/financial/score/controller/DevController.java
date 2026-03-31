package com.financial.score.controller;

import com.financial.score.model.Usuario;
import com.financial.score.repository.UsuarioRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Endpoint temporal solo para desarrollo.
 * Permite crear usuarios y verificar hashes BCrypt sin necesidad
 * de herramientas externas.
 *
 * IMPORTANTE: Eliminar este archivo antes de ir a producción.
 * URL: GET http://localhost:8080/api/dev/crear-usuario
 */
@RestController
@RequestMapping("/api/dev")
public class DevController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    public DevController(UsuarioRepository usuarioRepository,
                         PasswordEncoder   passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    /**
     * Crea los usuarios de prueba con hash BCrypt correcto.
     * GET http://localhost:8080/api/dev/crear-usuarios
     */
    @GetMapping("/crear-usuarios")
    public Map<String, Object> crearUsuarios() {

        String hashAdmin123 = passwordEncoder.encode("admin123");

        // Usuario Admin
        if (!usuarioRepository.existsByEmail("admin@scorecredit.pe")) {
            Usuario admin = new Usuario();
            admin.setNombre("Percy Admin");
            admin.setEmail("admin@scorecredit.pe");
            admin.setPasswordHash(hashAdmin123);
            admin.setRol("admin");
            admin.setEstado("activo");
            admin.setFechaCreacion(LocalDateTime.now());
            usuarioRepository.save(admin);
        }

        // Usuario Operario (rol analista = operario en este sistema)
        if (!usuarioRepository.existsByEmail("operario@scorecredit.pe")) {
            Usuario operario = new Usuario();
            operario.setNombre("Percy Operario");
            operario.setEmail("operario@scorecredit.pe");
            operario.setPasswordHash(hashAdmin123);
            operario.setRol("operario");
            operario.setEstado("activo");
            operario.setFechaCreacion(LocalDateTime.now());
            usuarioRepository.save(operario);
        }

        // Mostrar el hash generado para referencia
        return Map.of(
                "mensaje",    "Usuarios creados correctamente",
                "hash",       hashAdmin123,
                "longitud",   hashAdmin123.length(),
                "contrasena", "admin123",
                "usuarios",   Map.of(
                        "admin",    "admin@scorecredit.pe",
                        "operario", "operario@scorecredit.pe"
                )
        );
    }

    /**
     * Verifica si una contraseña coincide con el hash en BD.
     * GET http://localhost:8080/api/dev/verificar?email=admin@scorecredit.pe&pass=admin123
     */
    @GetMapping("/verificar")
    public Map<String, Object> verificar(
            @RequestParam String email,
            @RequestParam String pass) {

        return usuarioRepository.findByEmail(email)
                .map(u -> {
                    boolean coincide = passwordEncoder.matches(pass, u.getPasswordHash());
                    return Map.<String, Object>of(
                            "email",      email,
                            "rol",        u.getRol(),
                            "estado",     u.getEstado(),
                            "hash_en_bd", u.getPasswordHash(),
                            "longitud",   u.getPasswordHash().length(),
                            "coincide",   coincide
                    );
                })
                .orElse(Map.of("error", "Usuario no encontrado: " + email));
    }
}