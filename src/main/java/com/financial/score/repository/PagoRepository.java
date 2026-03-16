package com.financial.score.repository;

import com.financial.score.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    /**
     * Usado por TransaccionPdfService para construir la tabla de pagos del PDF.
     * JOIN FETCH producto evita N+1 — carga todo en 1 query.
     */
    @Query("SELECT p FROM Pago p WHERE p.transaccion.id = :transaccionId ORDER BY p.fechaPago ASC")
    List<Pago> findByTransaccionId(@Param("transaccionId") Long transaccionId);

    /**
     * Ya existía en tu PagoService — suma montos para calcular saldo.
     * Si ya lo tienes declarado, no duplicar.
     */
    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p WHERE p.transaccion.id = :transaccionId")
    BigDecimal sumMontoByTransaccionId(@Param("transaccionId") Long transaccionId);
}