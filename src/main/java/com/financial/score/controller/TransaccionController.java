package com.financial.score.controller;

import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.service.TransaccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = "*")
public class TransaccionController {

    private final TransaccionService service;

    public TransaccionController(TransaccionService service) {
        this.service = service;
    }

    // ─── GET /api/transacciones ───────────────────────────────────────────────
    @GetMapping
    public List<Transaccion> listar() {
        return service.listar();
    }

    // ─── POST /api/transacciones/registrar ────────────────────────────────────
    // Body esperado:
    // {
    //   "transaccion": { "empresa": { "id": 1 }, "montoTotal": 680, "fechaVencimiento": "2026-03-27" },
    //   "detalles": [{ "producto": { "id": 2 }, "cantidad": 8, "precioUnitario": 85.00 }]
    // }
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest body) {
        try {
            Transaccion savedTrx = service.registrar(body.getTransaccion(), body.getDetalles());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTrx);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ─── DTO interno para recibir transaccion + detalles juntos ──────────────
    public static class RegistroRequest {
        private Transaccion transaccion;
        private List<TransaccionDetalle> detalles;

        public Transaccion getTransaccion()                  { return transaccion; }
        public void setTransaccion(Transaccion transaccion)  { this.transaccion = transaccion; }

        public List<TransaccionDetalle> getDetalles()        { return detalles; }
        public void setDetalles(List<TransaccionDetalle> d)  { this.detalles = d; }
    }
}