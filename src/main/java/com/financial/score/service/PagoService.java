package com.financial.score.service;

import com.financial.score.model.Pago;
import com.financial.score.model.Transaccion;
import com.financial.score.repository.AjusteTransaccionRepository;
import com.financial.score.repository.PagoRepository;
import com.financial.score.repository.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final TransaccionRepository transaccionRepository;
    private final AjusteTransaccionRepository ajusteRepository;
    private final AjusteService ajusteService;

    public PagoService(PagoRepository pagoRepository,
                       TransaccionRepository transaccionRepository,
                       AjusteTransaccionRepository ajusteRepository,
                       AjusteService ajusteService) {
        this.pagoRepository        = pagoRepository;
        this.transaccionRepository = transaccionRepository;
        this.ajusteRepository      = ajusteRepository;
        this.ajusteService         = ajusteService;
    }

    @Transactional
    public Pago registrar(Pago pago) {
        Transaccion trx = transaccionRepository.findById(pago.getTransaccion().getId())
                .orElseThrow(() -> new RuntimeException(
                        "Transacción no encontrada: ID " + pago.getTransaccion().getId()));

        pago.setFechaRegistro(LocalDateTime.now());
        Pago savedPago = pagoRepository.save(pago);

        // Calcular saldo real (pagos + ajustes aprobados)
        BigDecimal totalPagado  = pagoRepository.sumMontoByTransaccionId(trx.getId());
        BigDecimal totalAjustes = ajusteRepository.sumAjustesAprobadosByTransaccionId(trx.getId());
        BigDecimal saldo        = trx.getMontoTotal().subtract(totalPagado).subtract(totalAjustes);

        // Determinar estado y tipo de evento
        String nuevoEstado;
        String tipoEvento;
        String descripcion;

        if (saldo.compareTo(BigDecimal.ZERO) <= 0) {
            nuevoEstado = "pagado";
            tipoEvento  = "PAGO_TOTAL";
            descripcion = "Pago total registrado — S/ " + pago.getMonto() +
                    ". Transacción liquidada.";
        } else {
            nuevoEstado = "parcial";
            tipoEvento  = "PAGO_PARCIAL";
            descripcion = "Pago parcial registrado — S/ " + pago.getMonto() +
                    ". Saldo pendiente: S/ " + saldo;
        }

        trx.setEstadoPago(nuevoEstado);
        transaccionRepository.save(trx);

        // Registrar en timeline
        ajusteService.registrarEvento(trx, tipoEvento, descripcion, pago.getMonto());

        // Si se liquidó → registrar cierre
        if ("pagado".equals(nuevoEstado)) {
            ajusteService.registrarEvento(trx, "CIERRE",
                    "Transacción cerrada. Total pagado: S/ " + totalPagado +
                            " | Ajustes aplicados: S/ " + totalAjustes,
                    trx.getMontoTotal());
        }

        return savedPago;
    }
}