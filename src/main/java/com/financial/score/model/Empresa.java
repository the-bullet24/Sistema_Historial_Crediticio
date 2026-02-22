package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "empresas", schema = "core")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 11, nullable = false)
    private String ruc;

    @Column(name = "razon_social", length = 150, nullable = false)
    private String razonSocial;

    @Column(length = 200)
    private String direccion;

    @Column(length = 100)
    private String rubro;

    @Column(name = "correo_contacto", length = 150)
    private String correoContacto;

    @Column(length = 15)
    private String telefono;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(length = 20)
    private String estado;

    // ─── @JsonIgnore evita que Jackson intente serializar las listas LAZY ─────
    @JsonIgnore
    @OneToMany(mappedBy = "empresa", fetch = FetchType.LAZY)
    private List<Transaccion> transacciones;

    @JsonIgnore
    @OneToMany(mappedBy = "empresa", fetch = FetchType.LAZY)
    private List<HistorialScoreEmpresa> historialScores;

    // ─── Constructor vacío obligatorio para JPA ───────────────────────────────
    public Empresa() {}

    // ─── Constructor completo ─────────────────────────────────────────────────
    public Empresa(Long id, String ruc, String razonSocial, String direccion,
                   String rubro, String correoContacto, String telefono,
                   LocalDateTime fechaRegistro, String estado,
                   List<Transaccion> transacciones,
                   List<HistorialScoreEmpresa> historialScores) {
        this.id              = id;
        this.ruc             = ruc;
        this.razonSocial     = razonSocial;
        this.direccion       = direccion;
        this.rubro           = rubro;
        this.correoContacto  = correoContacto;
        this.telefono        = telefono;
        this.fechaRegistro   = fechaRegistro;
        this.estado          = estado;
        this.transacciones   = transacciones;
        this.historialScores = historialScores;
    }

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public String getRuc()                           { return ruc; }
    public void setRuc(String ruc)                   { this.ruc = ruc; }

    public String getRazonSocial()                   { return razonSocial; }
    public void setRazonSocial(String razonSocial)   { this.razonSocial = razonSocial; }

    public String getDireccion()                     { return direccion; }
    public void setDireccion(String direccion)       { this.direccion = direccion; }

    public String getRubro()                         { return rubro; }
    public void setRubro(String rubro)               { this.rubro = rubro; }

    public String getCorreoContacto()                { return correoContacto; }
    public void setCorreoContacto(String v)          { this.correoContacto = v; }

    public String getTelefono()                      { return telefono; }
    public void setTelefono(String telefono)         { this.telefono = telefono; }

    public LocalDateTime getFechaRegistro()          { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime v)    { this.fechaRegistro = v; }

    public String getEstado()                        { return estado; }
    public void setEstado(String estado)             { this.estado = estado; }

    public List<Transaccion> getTransacciones()      { return transacciones; }
    public void setTransacciones(List<Transaccion> t){ this.transacciones = t; }

    public List<HistorialScoreEmpresa> getHistorialScores()          { return historialScores; }
    public void setHistorialScores(List<HistorialScoreEmpresa> h)    { this.historialScores = h; }
}