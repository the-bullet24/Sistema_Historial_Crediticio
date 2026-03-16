package com.financial.score.service;

import com.financial.score.model.Pago;
import com.financial.score.model.Transaccion;
import com.financial.score.repository.AjusteTransaccionRepository;
import com.financial.score.repository.PagoRepository;
import com.financial.score.repository.TransaccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ← SPRING, no jakarta

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PagoService {

    private final PagoRepository              pagoRepository;
    private final TransaccionRepository       transaccionRepository;
    private final AjusteTransaccionRepository ajusteRepository;
    private final AjusteService               ajusteService;

    public PagoService(PagoRepository pagoRepository,
                       TransaccionRepository transaccionRepository,
                       AjusteTransaccionRepository ajusteRepository,
                       AjusteService ajusteService) {
        this.pagoRepository        = pagoRepository;
        this.transaccionRepository = transaccionRepository;
        this.ajusteRepository      = ajusteRepository;
        this.ajusteService         = ajusteService;
    }

    @Transactional // ← org.springframework.transaction.annotation.Transactional
    public Pago registrar(Pago pago) {

        // 1. Cargar la transacción
        Transaccion trx = transaccionRepository.findById(pago.getTransaccion().getId())
                .orElseThrow(() -> new RuntimeException(
                        "Transacción no encontrada: ID " + pago.getTransaccion().getId()));

        // 2. Guardar el pago
        pago.setFechaRegistro(LocalDateTime.now());
        Pago savedPago = pagoRepository.save(pago);

        // 3. Flush explícito para que el SUM vea el pago recién insertado
        //    Sin esto, la query JPQL puede devolver el valor anterior
        pagoRepository.flush();

        // 4. Recalcular saldo con null-safe
        BigDecimal totalPagado  = pagoRepository.sumMontoByTransaccionId(trx.getId());
        BigDecimal totalAjustes = ajusteRepository.sumAjustesAprobadosByTransaccionId(trx.getId());
        if (totalPagado  == null) totalPagado  = BigDecimal.ZERO;
        if (totalAjustes == null) totalAjustes = BigDecimal.ZERO;

        BigDecimal saldo = trx.getMontoTotal()
                .subtract(totalPagado)
                .subtract(totalAjustes);

        // 5. Determinar nuevo estado
        String nuevoEstado;
        String tipoEvento;
        String descripcion;

        if (saldo.compareTo(BigDecimal.ZERO) <= 0) {
            nuevoEstado = "pagado";
            tipoEvento  = "PAGO_TOTAL";
            descripcion = "Pago total registrado — S/ " + pago.getMonto()
                    + ". Transacción liquidada.";
        } else {
            nuevoEstado = "parcial";
            tipoEvento  = "PAGO_PARCIAL";
            descripcion = "Pago parcial registrado — S/ " + pago.getMonto()
                    + ". Saldo pendiente: S/ " + saldo;
        }

        // 6. Actualizar estado en transacción y guardar
        trx.setEstadoPago(nuevoEstado);
        transaccionRepository.save(trx);
        transaccionRepository.flush(); // ← asegura que el UPDATE se ejecuta

        // 7. Registrar en timeline
        ajusteService.registrarEvento(trx, tipoEvento, descripcion, pago.getMonto());

        // 8. Si se liquidó → registrar evento de cierre
        if ("pagado".equals(nuevoEstado)) {
            ajusteService.registrarEvento(
                    trx, "CIERRE",
                    "Transacción cerrada. Total pagado: S/ " + totalPagado
                            + " | Ajustes aplicados: S/ " + totalAjustes,
                    trx.getMontoTotal());
        }

        return savedPago;
    }
}