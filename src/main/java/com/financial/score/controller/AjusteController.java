package com.financial.score.controller;

import com.financial.score.model.AjusteTransaccion;
import com.financial.score.model.EventoTransaccion;
import com.financial.score.service.AjusteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ajustes")
@CrossOrigin(origins = "*")
public class AjusteController {

    private final AjusteService service;

    public AjusteController(AjusteService service) {
        this.service = service;
    }

    // ── GET /api/ajustes/transaccion/{transaccionId}
    // Lista todos los ajustes de una transacción
    @GetMapping("/transaccion/{transaccionId}")
    public ResponseEntity<List<AjusteTransaccion>> listar(
            @PathVariable Long transaccionId) {
        return ResponseEntity.ok(service.getAjustes(transaccionId));
    }

    // ── GET /api/ajustes/timeline/{transaccionId}
    // Timeline completo de eventos de una transacción
    @GetMapping("/timeline/{transaccionId}")
    public ResponseEntity<List<EventoTransaccion>> timeline(
            @PathVariable Long transaccionId) {
        return ResponseEntity.ok(service.getTimeline(transaccionId));
    }

    // ── POST /api/ajustes/solicitar
    // Body: { "transaccionId": 1, "tipo": "descuento_porcentaje",
    //         "valor": 15.00, "motivo": "Negociación cliente" }
    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody SolicitudAjusteRequest req) {
        try {
            AjusteTransaccion saved = service.solicitarAjuste(
                    req.getTransaccionId(),
                    req.getTipo(),
                    req.getValor(),
                    req.getMotivo());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ── POST /api/ajustes/{id}/aprobar
    // Body: { "usuarioId": 1 }  (usuarioId es opcional)
    @PostMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(@PathVariable Long id,
                                     @RequestBody(required = false) Map<String, Long> body) {
        try {
            Long usuarioId = body != null ? body.get("usuarioId") : null;
            AjusteTransaccion saved = service.aprobarAjuste(id, usuarioId);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ── POST /api/ajustes/{id}/rechazar
    // Body: { "motivo": "No aplica" }
    @PostMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazar(@PathVariable Long id,
                                      @RequestBody Map<String, String> body) {
        try {
            AjusteTransaccion saved = service.rechazarAjuste(id, body.get("motivo"));
            return ResponseEntity.ok(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ─── DTO interno ─────────────────────────────────────────────────────────
    public static class SolicitudAjusteRequest {
        private Long transaccionId;
        private String tipo;
        private BigDecimal valor;
        private String motivo;

        public Long getTransaccionId()         { return transaccionId; }
        public void setTransaccionId(Long id)  { this.transaccionId = id; }
        public String getTipo()                { return tipo; }
        public void setTipo(String tipo)       { this.tipo = tipo; }
        public BigDecimal getValor()           { return valor; }
        public void setValor(BigDecimal v)     { this.valor = v; }
        public String getMotivo()              { return motivo; }
        public void setMotivo(String m)        { this.motivo = m; }
    }
}