package com.financial.score.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "historial_score_empresa", schema = "core")
public class HistorialScoreEmpresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    private Integer anio;
    private Integer mes;
    private Integer totalTransacciones;
    private Integer transaccionesMorosas;
    private BigDecimal promedioDiasRetraso;
    private Integer score;
    private String clasificacion;
    private LocalDateTime fechaCalculo;

    public HistorialScoreEmpresa() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public Integer getTotalTransacciones() {
        return totalTransacciones;
    }

    public void setTotalTransacciones(Integer totalTransacciones) {
        this.totalTransacciones = totalTransacciones;
    }

    public Integer getTransaccionesMorosas() {
        return transaccionesMorosas;
    }

    public void setTransaccionesMorosas(Integer transaccionesMorosas) {
        this.transaccionesMorosas = transaccionesMorosas;
    }

    public BigDecimal getPromedioDiasRetraso() {
        return promedioDiasRetraso;
    }

    public void setPromedioDiasRetraso(BigDecimal promedioDiasRetraso) {
        this.promedioDiasRetraso = promedioDiasRetraso;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(String clasificacion) {
        this.clasificacion = clasificacion;
    }

    public LocalDateTime getFechaCalculo() {
        return fechaCalculo;
    }

    public void setFechaCalculo(LocalDateTime fechaCalculo) {
        this.fechaCalculo = fechaCalculo;
    }
}