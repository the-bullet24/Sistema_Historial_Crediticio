package com.financial.score.service;

import com.financial.score.model.Producto;
import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.model.TransaccionResumenDTO;
import com.financial.score.repository.PagoRepository;
import com.financial.score.repository.ProductoRepository;
import com.financial.score.repository.TransaccionDetalleRepository;
import com.financial.score.repository.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransaccionService {

    private final TransaccionRepository        repository;
    private final ProductoRepository           productoRepository;
    private final TransaccionDetalleRepository detalleRepository;
    private final PagoRepository               pagoRepository;

    public TransaccionService(TransaccionRepository repository,
                              ProductoRepository productoRepository,
                              TransaccionDetalleRepository detalleRepository,
                              PagoRepository pagoRepository) {
        this.repository          = repository;
        this.productoRepository  = productoRepository;
        this.detalleRepository   = detalleRepository;
        this.pagoRepository      = pagoRepository;
    }

    public List<Transaccion> listar() {
        return repository.findAll();
    }

    /**
     * Lista todas las transacciones como DTO plano.
     * Resuelve el problema de relaciones LAZY al acceder dentro
     * de una sesión @Transactional y mapear manualmente a DTO.
     * El frontend recibe: id, codigo, empresa (nombre+ruc),
     * montoTotal, montoPagado (suma real de pagos), fechas, estadoPago.
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<TransaccionResumenDTO> listarResumen() {
        return repository.findAll().stream()
                .map(t -> new TransaccionResumenDTO(
                        t.getId(),
                        t.getCodigoTransaccion(),
                        t.getMontoTotal(),
                        // Suma real de pagos desde la tabla core.pagos
                        pagoRepository.sumMontoByTransaccionId(t.getId()),
                        t.getFechaVenta(),
                        t.getFechaVencimiento(),
                        t.getEstadoPago(),
                        t.getEmpresa() != null ? t.getEmpresa().getId()          : null,
                        t.getEmpresa() != null ? t.getEmpresa().getRazonSocial() : "—",
                        t.getEmpresa() != null ? t.getEmpresa().getRuc()         : "—"
                ))
                .toList();
    }

    // ─── Registrar transacción completa + descontar stock ────────────────────
    @Transactional
    public Transaccion registrar(Transaccion transaccion, List<TransaccionDetalle> detalles) {

        // 1. Validar stock antes de hacer cualquier cambio
        for (TransaccionDetalle detalle : detalles) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Producto no encontrado: ID " + detalle.getProducto().getId()));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new RuntimeException(
                        "Stock insuficiente para: " + producto.getNombre() +
                                ". Disponible: " + producto.getStock() +
                                ", solicitado: " + detalle.getCantidad());
            }
        }

        // 2. Setear campos automáticos de la transacción
        if (transaccion.getFechaVenta() == null) {
            transaccion.setFechaVenta(LocalDate.now());
        }
        if (transaccion.getFechaRegistro() == null) {
            transaccion.setFechaRegistro(LocalDateTime.now());
        }
        if (transaccion.getEstadoPago() == null || transaccion.getEstadoPago().isBlank()) {
            transaccion.setEstadoPago("pendiente");
        }

        // ── AGREGAR ESTO ──────────────────────────────────────────────────────
        if (transaccion.getCodigoTransaccion() == null || transaccion.getCodigoTransaccion().isBlank()) {
            String codigo = String.format("TRX-%s-%04d-%d",
                    LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd")),
                    transaccion.getEmpresa().getId(),
                    System.currentTimeMillis() % 10000);
            transaccion.setCodigoTransaccion(codigo);
        }
        // ─────────────────────────────────────────────────────────────────────

        // 3. Guardar la transacción primero (necesitamos el ID generado)
        Transaccion savedTransaccion = repository.save(transaccion);

        // 4. Guardar detalles y descontar stock
        for (TransaccionDetalle detalle : detalles) {
            Producto producto = productoRepository.findById(detalle.getProducto().getId()).get();

            // Asociar el detalle a la transacción guardada
            detalle.setTransaccion(savedTransaccion);
            // Precio unitario desde el producto (no confiar en lo que manda el frontend)
            detalle.setPrecioUnitario(producto.getPrecioUnitario());

            detalleRepository.save(detalle);

            // Descontar stock
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);
        }

        return savedTransaccion;
    }
}