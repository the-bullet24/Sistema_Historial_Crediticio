package com.financial.score.repository;

import com.financial.score.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository
        extends JpaRepository<Pago, Long> {}
