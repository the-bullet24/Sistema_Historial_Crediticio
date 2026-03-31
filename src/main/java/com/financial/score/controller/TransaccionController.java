package com.financial.score.controller;

import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.model.TransaccionResumenDTO;
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
public class TransaccionController {

    private final TransaccionService    service;
    private final TransaccionPdfService pdfService;

    public TransaccionController(TransaccionService service,
                                 TransaccionPdfService pdfService) {
        this.service    = service;
        this.pdfService = pdfService;
    }

    // ─── GET /api/transacciones ───────────────────────────────────────────────
    // Devuelve DTO plano: empresa aplanada + montoPagado calculado
    // El frontend (TransaccionesListPanel) consume exactamente estos campos
    @GetMapping
    public List<TransaccionResumenDTO> listar() {
        return service.listarResumen();   // ← método nuevo en el service
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
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getOrdenPago(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generarOrdenPago(id);
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
    @GetMapping(value = "/{id}/pdf/cierre", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getComprobanteCierre(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generarComprobanteCierre(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"cierre-" + id + ".pdf\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(pdf);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
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