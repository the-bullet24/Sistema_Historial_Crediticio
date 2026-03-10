package com.financial.score.repository;

import com.financial.score.model.AjusteTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface AjusteTransaccionRepository extends JpaRepository<AjusteTransaccion, Long> {

    List<AjusteTransaccion> findByTransaccionIdOrderByFechaAjusteDesc(Long transaccionId);

    List<AjusteTransaccion> findByEstado(String estado);

    @Query("SELECT COALESCE(SUM(a.montoCalculado), 0) FROM AjusteTransaccion a " +
            "WHERE a.transaccion.id = :transaccionId AND a.estado = 'aprobado'")
    BigDecimal sumAjustesAprobadosByTransaccionId(@Param("transaccionId") Long transaccionId);
}
