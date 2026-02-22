package com.financial.score.repository;

import com.financial.score.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {}