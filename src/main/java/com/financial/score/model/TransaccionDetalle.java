package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transaccion_detalle", schema = "core")
public class TransaccionDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_id", nullable = false)
    private Transaccion transaccion;

    @Column(name = "transaccion_id", insertable = false, updatable = false)
    private Long transaccionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    // Columna calculada en BD: cantidad * precio_unitario
    @Column(insertable = false, updatable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    public TransaccionDetalle() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public Transaccion getTransaccion()              { return transaccion; }
    public void setTransaccion(Transaccion t)        { this.transaccion = t; }

    public Long getTransaccionId()                   { return transaccionId; }
    public void setTransaccionId(Long v)             { this.transaccionId = v; }

    public Producto getProducto()                    { return producto; }
    public void setProducto(Producto producto)       { this.producto = producto; }

    public Integer getCantidad()                     { return cantidad; }
    public void setCantidad(Integer cantidad)        { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario()            { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal v)      { this.precioUnitario = v; }

    public BigDecimal getSubtotal()                  { return subtotal; }
    public void setSubtotal(BigDecimal subtotal)     { this.subtotal = subtotal; }
}
