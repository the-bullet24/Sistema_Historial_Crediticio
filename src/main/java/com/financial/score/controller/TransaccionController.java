package com.financial.score.controller;

import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.service.TransaccionService;
import com.financial.score.service.TransaccionPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = "*")
public class TransaccionController {

    private final TransaccionService    service;
    private final TransaccionPdfService pdfService;

    public TransaccionController(TransaccionService service,
                                 TransaccionPdfService pdfService) {
        this.service    = service;
        this.pdfService = pdfService;
    }

    // ─── GET /api/transacciones ───────────────────────────────────────────────
    @GetMapping
    public List<Transaccion> listar() {
        return service.listar();
    }

    // ─── POST /api/transacciones/registrar ────────────────────────────────────
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

    // ─── GET /api/transacciones/{id}/pdf ─────────────────────────────────────
    // Orden de pago — disponible siempre.
    // Si está pendiente muestra saldo; si está pagado muestra tabla de pagos.
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getOrdenPago(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generarOrdenPago(id);  // ← nombre correcto
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"orden-" + id + ".pdf\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(pdf);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ─── GET /api/transacciones/{id}/pdf/cierre ───────────────────────────────
    // Comprobante de cierre — solo cuando estadoPago = "pagado".
    @GetMapping(value = "/{id}/pdf/cierre", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getComprobanteCierre(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generarComprobanteCierre(id);  // ← nombre correcto
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"cierre-" + id + ".pdf\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(pdf);
        } catch (IllegalStateException ex) {
            // Transacción aún no pagada
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ─── DTO interno ──────────────────────────────────────────────────────────
    public static class RegistroRequest {
        private Transaccion transaccion;
        private List<TransaccionDetalle> detalles;

        public Transaccion getTransaccion()                  { return transaccion; }
        public void setTransaccion(Transaccion transaccion)  { this.transaccion = transaccion; }
        public List<TransaccionDetalle> getDetalles()        { return detalles; }
        public void setDetalles(List<TransaccionDetalle> d)  { this.detalles = d; }
    }
}