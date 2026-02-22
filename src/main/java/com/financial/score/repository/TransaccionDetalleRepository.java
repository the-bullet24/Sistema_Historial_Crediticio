package com.financial.score.repository;

import com.financial.score.model.TransaccionDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransaccionDetalleRepository extends JpaRepository<TransaccionDetalle, Long> {
    List<TransaccionDetalle> findByTransaccionId(Long transaccionId);
}