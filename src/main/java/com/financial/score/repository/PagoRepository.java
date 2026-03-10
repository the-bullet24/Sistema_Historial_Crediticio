package com.financial.score.repository;

import com.financial.score.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    // ── Agrega estas dos líneas ──────────────────────────────────────────────
    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p WHERE p.transaccion.id = :transaccionId")
    BigDecimal sumMontoByTransaccionId(@Param("transaccionId") Long transaccionId);

    List<Pago> findByTransaccionId(Long transaccionId);
    // ─────────────────────────────────────────────────────────────────────────
}