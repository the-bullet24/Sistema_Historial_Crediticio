package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos_transaccion", schema = "core")
public class EventoTransaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaccion_id", nullable = false)
    private Transaccion transaccion;

    @Column(name = "transaccion_id", insertable = false, updatable = false)
    private Long transaccionId;

    @Column(name = "tipo_evento", nullable = false, length = 50)
    private String tipoEvento;
    // CREACION | PAGO_PARCIAL | PAGO_TOTAL | AJUSTE_APLICADO
    // AJUSTE_APROBADO | AJUSTE_RECHAZADO | CIERRE | VENCIMIENTO

    private String descripcion;

    @Column(name = "monto_referencia", precision = 12, scale = 2)
    private BigDecimal montoReferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "fecha_evento")
    private LocalDateTime fechaEvento;

    public EventoTransaccion() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public Transaccion getTransaccion()              { return transaccion; }
    public void setTransaccion(Transaccion t)        { this.transaccion = t; }

    public Long getTransaccionId()                   { return transaccionId; }
    public void setTransaccionId(Long v)             { this.transaccionId = v; }

    public String getTipoEvento()                    { return tipoEvento; }
    public void setTipoEvento(String t)              { this.tipoEvento = t; }

    public String getDescripcion()                   { return descripcion; }
    public void setDescripcion(String d)             { this.descripcion = d; }

    public BigDecimal getMontoReferencia()           { return montoReferencia; }
    public void setMontoReferencia(BigDecimal m)     { this.montoReferencia = m; }

    public Usuario getUsuario()                      { return usuario; }
    public void setUsuario(Usuario u)                { this.usuario = u; }

    public LocalDateTime getFechaEvento()            { return fechaEvento; }
    public void setFechaEvento(LocalDateTime f)      { this.fechaEvento = f; }
}