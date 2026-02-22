package com.financial.score.repository;

import com.financial.score.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransaccionRepository
        extends JpaRepository<Transaccion, Long> {}