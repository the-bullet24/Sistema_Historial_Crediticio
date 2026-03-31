package com.financial.score.repository;

import com.financial.score.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {
    // Usado por AuthService para buscar por credenciales
    Optional<Usuario> findByEmail(String email);

    // Usado por UsuarioService para validar duplicados
    boolean existsByEmail(String email);

    // Filtrar por estado (activo/inactivo)
    List<Usuario> findByEstado(String estado);

}