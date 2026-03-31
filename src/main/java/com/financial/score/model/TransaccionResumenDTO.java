package com.financial.score.model;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO plano para la lista de transacciones del frontend.
 *
 * Evita el problema de relaciones LAZY (empresa, pagos)
 * al aplanar solo los campos que necesita la vista de lista:
 *   - Datos de la transacción
 *   - Nombre y RUC de la empresa (sin serializar toda la entidad)
 *   - Monto pagado calculado desde los pagos
 */
public class TransaccionResumenDTO {

    private Long      id;
    private String    codigoTransaccion;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;    // suma real de core.pagos
    private LocalDate fechaVenta;
    private LocalDate fechaVencimiento;
    private String    estadoPago;

    // Empresa aplanada — solo lo que necesita la lista
    private Long   empresaId;
    private String empresaRazonSocial;
    private String empresaRuc;

    // Constructor vacío
    public TransaccionResumenDTO() {}

    // Constructor completo — lo usa TransaccionService
    public TransaccionResumenDTO(Long id, String codigoTransaccion,
                                 BigDecimal montoTotal, BigDecimal montoPagado,
                                 LocalDate fechaVenta, LocalDate fechaVencimiento,
                                 String estadoPago,
                                 Long empresaId, String empresaRazonSocial, String empresaRuc) {
        this.id                  = id;
        this.codigoTransaccion   = codigoTransaccion;
        this.montoTotal          = montoTotal;
        this.montoPagado         = montoPagado != null ? montoPagado : BigDecimal.ZERO;
        this.fechaVenta          = fechaVenta;
        this.fechaVencimiento    = fechaVencimiento;
        this.estadoPago          = estadoPago;
        this.empresaId           = empresaId;
        this.empresaRazonSocial  = empresaRazonSocial;
        this.empresaRuc          = empresaRuc;
    }

    // ─── Getters ──────────────────────────────────────────────────────────────
    public Long       getId()                  { return id; }
    public String     getCodigoTransaccion()   { return codigoTransaccion; }
    public BigDecimal getMontoTotal()          { return montoTotal; }
    public BigDecimal getMontoPagado()         { return montoPagado; }
    public LocalDate  getFechaVenta()          { return fechaVenta; }
    public LocalDate  getFechaVencimiento()    { return fechaVencimiento; }
    public String     getEstadoPago()          { return estadoPago; }
    public Long       getEmpresaId()           { return empresaId; }
    public String     getEmpresaRazonSocial()  { return empresaRazonSocial; }
    public String     getEmpresaRuc()          { return empresaRuc; }

    // ─── Setters ──────────────────────────────────────────────────────────────
    public void setId(Long id)                                { this.id = id; }
    public void setCodigoTransaccion(String v)                { this.codigoTransaccion = v; }
    public void setMontoTotal(BigDecimal v)                   { this.montoTotal = v; }
    public void setMontoPagado(BigDecimal v)                  { this.montoPagado = v; }
    public void setFechaVenta(LocalDate v)                    { this.fechaVenta = v; }
    public void setFechaVencimiento(LocalDate v)              { this.fechaVencimiento = v; }
    public void setEstadoPago(String v)                       { this.estadoPago = v; }
    public void setEmpresaId(Long v)                          { this.empresaId = v; }
    public void setEmpresaRazonSocial(String v)               { this.empresaRazonSocial = v; }
    public void setEmpresaRuc(String v)                       { this.empresaRuc = v; }
}