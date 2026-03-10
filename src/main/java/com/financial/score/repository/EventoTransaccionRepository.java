package com.financial.score.repository;

import com.financial.score.model.EventoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoTransaccionRepository extends JpaRepository<EventoTransaccion, Long> {

    List<EventoTransaccion> findByTransaccionIdOrderByFechaEventoAsc(Long transaccionId);
}