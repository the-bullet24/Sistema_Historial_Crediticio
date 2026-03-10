package com.financial.score.service;

import com.financial.score.model.AjusteTransaccion;
import com.financial.score.model.EventoTransaccion;
import com.financial.score.model.Transaccion;
import com.financial.score.model.Usuario;
import com.financial.score.repository.AjusteTransaccionRepository;
import com.financial.score.repository.EventoTransaccionRepository;
import com.financial.score.repository.PagoRepository;
import com.financial.score.repository.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AjusteService {

    private final AjusteTransaccionRepository ajusteRepository;
    private final EventoTransaccionRepository eventoRepository;
    private final TransaccionRepository transaccionRepository;
    private final PagoRepository pagoRepository;

    public AjusteService(AjusteTransaccionRepository ajusteRepository,
                         EventoTransaccionRepository eventoRepository,
                         TransaccionRepository transaccionRepository,
                         PagoRepository pagoRepository) {
        this.ajusteRepository      = ajusteRepository;
        this.eventoRepository      = eventoRepository;
        this.transaccionRepository = transaccionRepository;
        this.pagoRepository        = pagoRepository;
    }

    // ─── Timeline completo de una transacción ────────────────────────────────
    public List<EventoTransaccion> getTimeline(Long transaccionId) {
        return eventoRepository.findByTransaccionIdOrderByFechaEventoAsc(transaccionId);
    }

    // ─── Ajustes de una transacción ──────────────────────────────────────────
    public List<AjusteTransaccion> getAjustes(Long transaccionId) {
        return ajusteRepository.findByTransaccionIdOrderByFechaAjusteDesc(transaccionId);
    }

    // ─── Solicitar ajuste (queda en "pendiente") ─────────────────────────────
    @Transactional
    public AjusteTransaccion solicitarAjuste(Long transaccionId, String tipo,
                                             BigDecimal valor, String motivo) {
        Transaccion trx = transaccionRepository.findById(transaccionId)
                .orElseThrow(() -> new RuntimeException(
                        "Transacción no encontrada: " + transaccionId));

        BigDecimal totalPagado    = pagoRepository.sumMontoByTransaccionId(transaccionId);
        BigDecimal totalAjustes   = ajusteRepository.sumAjustesAprobadosByTransaccionId(transaccionId);
        BigDecimal saldoPendiente = trx.getMontoTotal().subtract(totalPagado).subtract(totalAjustes);

        BigDecimal montoCalculado;
        if ("descuento_porcentaje".equals(tipo)) {
            montoCalculado = saldoPendiente
                    .multiply(valor)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            montoCalculado = valor.setScale(2, RoundingMode.HALF_UP);
        }

        if (montoCalculado.compareTo(saldoPendiente) > 0) {
            throw new RuntimeException(
                    "El ajuste (S/ " + montoCalculado +
                            ") supera el saldo pendiente (S/ " + saldoPendiente + ")");
        }

        AjusteTransaccion ajuste = new AjusteTransaccion();
        ajuste.setTransaccion(trx);
        ajuste.setTipo(tipo);
        ajuste.setValor(valor);
        ajuste.setMontoCalculado(montoCalculado);
        ajuste.setMotivo(motivo);
        ajuste.setEstado("pendiente");
        ajuste.setFechaAjuste(LocalDateTime.now());

        AjusteTransaccion saved = ajusteRepository.save(ajuste);

        registrarEvento(trx, "AJUSTE_APLICADO",
                "Ajuste solicitado: " + tipo + " — S/ " + montoCalculado + ". Motivo: " + motivo,
                montoCalculado);

        return saved;
    }

    // ─── Aprobar ajuste ───────────────────────────────────────────────────────
    @Transactional
    public AjusteTransaccion aprobarAjuste(Long ajusteId, Long usuarioId) {
        AjusteTransaccion ajuste = ajusteRepository.findById(ajusteId)
                .orElseThrow(() -> new RuntimeException("Ajuste no encontrado: " + ajusteId));

        if (!"pendiente".equals(ajuste.getEstado())) {
            throw new RuntimeException("El ajuste ya fue procesado: estado=" + ajuste.getEstado());
        }

        ajuste.setEstado("aprobado");
        ajuste.setFechaAprobacion(LocalDateTime.now());
        if (usuarioId != null) {
            Usuario u = new Usuario();
            u.setId(usuarioId);
            ajuste.setAprobadoPor(u);
        }

        AjusteTransaccion saved = ajusteRepository.save(ajuste);
        recalcularEstadoTransaccion(ajuste.getTransaccion().getId());
        registrarEvento(ajuste.getTransaccion(), "AJUSTE_APROBADO",
                "Ajuste aprobado — S/ " + ajuste.getMontoCalculado(),
                ajuste.getMontoCalculado());

        return saved;
    }

    // ─── Rechazar ajuste ──────────────────────────────────────────────────────
    @Transactional
    public AjusteTransaccion rechazarAjuste(Long ajusteId, String motivo) {
        AjusteTransaccion ajuste = ajusteRepository.findById(ajusteId)
                .orElseThrow(() -> new RuntimeException("Ajuste no encontrado: " + ajusteId));

        if (!"pendiente".equals(ajuste.getEstado())) {
            throw new RuntimeException("El ajuste ya fue procesado");
        }

        ajuste.setEstado("rechazado");
        ajuste.setMotivo((ajuste.getMotivo() != null ? ajuste.getMotivo() : "")
                + " [RECHAZADO: " + motivo + "]");

        AjusteTransaccion saved = ajusteRepository.save(ajuste);
        registrarEvento(ajuste.getTransaccion(), "AJUSTE_RECHAZADO",
                "Ajuste rechazado. Motivo: " + motivo,
                ajuste.getMontoCalculado());

        return saved;
    }

    // ─── Helper: recalcular estado transacción ───────────────────────────────
    private void recalcularEstadoTransaccion(Long transaccionId) {
        Transaccion trx = transaccionRepository.findById(transaccionId).orElseThrow();
        BigDecimal totalPagado  = pagoRepository.sumMontoByTransaccionId(transaccionId);
        BigDecimal totalAjustes = ajusteRepository.sumAjustesAprobadosByTransaccionId(transaccionId);
        BigDecimal saldo        = trx.getMontoTotal().subtract(totalPagado).subtract(totalAjustes);

        if (saldo.compareTo(BigDecimal.ZERO) <= 0) {
            trx.setEstadoPago("pagado");
            registrarEvento(trx, "CIERRE",
                    "Transacción liquidada. Pagado: S/ " + totalPagado +
                            " | Ajustes: S/ " + totalAjustes,
                    trx.getMontoTotal());
        } else if (totalPagado.compareTo(BigDecimal.ZERO) > 0) {
            trx.setEstadoPago("parcial");
        }
        transaccionRepository.save(trx);
    }

    // ─── Helper: registrar evento en timeline ────────────────────────────────
    public void registrarEvento(Transaccion trx, String tipo,
                                String descripcion, BigDecimal monto) {
        EventoTransaccion ev = new EventoTransaccion();
        ev.setTransaccion(trx);
        ev.setTipoEvento(tipo);
        ev.setDescripcion(descripcion);
        ev.setMontoReferencia(monto);
        ev.setFechaEvento(LocalDateTime.now());
        eventoRepository.save(ev);
    }
}