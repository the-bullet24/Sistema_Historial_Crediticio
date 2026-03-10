package com.financial.score.controller;

import com.financial.score.model.Pago;
import com.financial.score.service.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    // ── POST /api/pagos
    // Body: { "transaccion": { "id": 1 }, "fechaPago": "2026-03-09",
    //         "monto": 1500.00, "metodoPago": "Transferencia", "banco": "BCP" }
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Pago pago) {
        try {
            Pago saved = service.registrar(pago);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}