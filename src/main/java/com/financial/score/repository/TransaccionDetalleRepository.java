package com.financial.score.repository;

import com.financial.score.model.TransaccionDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * FIX ERROR 1+6: Este repositorio es NUEVO.
 * Permite cargar los detalles de una transaccion por su ID,
 * con JOIN FETCH al producto para evitar LazyInitializationException.
 */

public interface TransaccionDetalleRepository extends JpaRepository<TransaccionDetalle, Long> {

    @Query("SELECT d FROM TransaccionDetalle d " +
            "JOIN FETCH d.producto " +
            "WHERE d.transaccionId = :transaccionId")
    List<TransaccionDetalle> findByTransaccionId(@Param("transaccionId") Long transaccionId);
}