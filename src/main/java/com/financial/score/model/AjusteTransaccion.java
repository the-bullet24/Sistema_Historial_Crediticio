package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ajustes_transaccion", schema = "core")
public class AjusteTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_id", nullable = false)
    private Transaccion transaccion;

    @Column(name = "transaccion_id", insertable = false, updatable = false)
    private Long transaccionId;

    @Column(nullable = false, length = 30)
    private String tipo;
    // descuento_porcentaje | descuento_monto | mora | ajuste_manual

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(name = "monto_calculado", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoCalculado;

    private String motivo;

    @Column(nullable = false, length = 20)
    private String estado = "pendiente";
    // pendiente | aprobado | rechazado

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobado_por")
    private Usuario aprobadoPor;

    @Column(name = "fecha_ajuste")
    private LocalDateTime fechaAjuste;

    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    public AjusteTransaccion() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public Transaccion getTransaccion()              { return transaccion; }
    public void setTransaccion(Transaccion t)        { this.transaccion = t; }

    public Long getTransaccionId()                   { return transaccionId; }
    public void setTransaccionId(Long v)             { this.transaccionId = v; }

    public String getTipo()                          { return tipo; }
    public void setTipo(String tipo)                 { this.tipo = tipo; }

    public BigDecimal getValor()                     { return valor; }
    public void setValor(BigDecimal valor)           { this.valor = valor; }

    public BigDecimal getMontoCalculado()            { return montoCalculado; }
    public void setMontoCalculado(BigDecimal m)      { this.montoCalculado = m; }

    public String getMotivo()                        { return motivo; }
    public void setMotivo(String motivo)             { this.motivo = motivo; }

    public String getEstado()                        { return estado; }
    public void setEstado(String estado)             { this.estado = estado; }

    public Usuario getAprobadoPor()                  { return aprobadoPor; }
    public void setAprobadoPor(Usuario u)            { this.aprobadoPor = u; }

    public LocalDateTime getFechaAjuste()            { return fechaAjuste; }
    public void setFechaAjuste(LocalDateTime f)      { this.fechaAjuste = f; }

    public LocalDateTime getFechaAprobacion()        { return fechaAprobacion; }
    public void setFechaAprobacion(LocalDateTime f)  { this.fechaAprobacion = f; }
}