package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "condiciones_credito", schema = "core")
public class CondicionCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(name = "empresa_id", insertable = false, updatable = false)
    private Long empresaId;

    @Column(nullable = false, length = 20)
    private String nivel = "estandar";
    // basico | estandar | premium

    @Column(name = "limite_credito", nullable = false, precision = 14, scale = 2)
    private BigDecimal limiteCredito = BigDecimal.ZERO;

    @Column(name = "dias_credito", nullable = false)
    private Integer diasCredito = 30;

    @Column(name = "score_minimo")
    private Integer scoreMinimo = 0;

    private Boolean activo = true;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    public CondicionCredito() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public Empresa getEmpresa()                      { return empresa; }
    public void setEmpresa(Empresa e)                { this.empresa = e; }

    public Long getEmpresaId()                       { return empresaId; }
    public void setEmpresaId(Long v)                 { this.empresaId = v; }

    public String getNivel()                         { return nivel; }
    public void setNivel(String nivel)               { this.nivel = nivel; }

    public BigDecimal getLimiteCredito()             { return limiteCredito; }
    public void setLimiteCredito(BigDecimal l)       { this.limiteCredito = l; }

    public Integer getDiasCredito()                  { return diasCredito; }
    public void setDiasCredito(Integer d)            { this.diasCredito = d; }

    public Integer getScoreMinimo()                  { return scoreMinimo; }
    public void setScoreMinimo(Integer s)            { this.scoreMinimo = s; }

    public Boolean getActivo()                       { return activo; }
    public void setActivo(Boolean a)                 { this.activo = a; }

    public LocalDateTime getFechaRegistro()          { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime f)    { this.fechaRegistro = f; }
}