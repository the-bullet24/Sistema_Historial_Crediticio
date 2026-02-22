package com.financial.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "productos", schema = "core")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    // Para devolver el id sin serializar toda la empresa
    @Column(name = "empresa_id", insertable = false, updatable = false)
    private Long empresaId;

    @Column(length = 150, nullable = false)
    private String nombre;

    @Column(length = 300)
    private String descripcion;

    @Column(name = "precio_unitario", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "unidad_medida", length = 50)
    private String unidadMedida;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 20)
    private String estado;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @JsonIgnore
    @OneToMany(mappedBy = "producto", fetch = FetchType.LAZY)
    private List<TransaccionDetalle> detalles;

    public Producto() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────
    public Long getId()                              { return id; }
    public void setId(Long id)                       { this.id = id; }

    public Empresa getEmpresa()                      { return empresa; }
    public void setEmpresa(Empresa empresa)          { this.empresa = empresa; }

    public Long getEmpresaId()                       { return empresaId; }
    public void setEmpresaId(Long empresaId)         { this.empresaId = empresaId; }

    public String getNombre()                        { return nombre; }
    public void setNombre(String nombre)             { this.nombre = nombre; }

    public String getDescripcion()                   { return descripcion; }
    public void setDescripcion(String descripcion)   { this.descripcion = descripcion; }

    public BigDecimal getPrecioUnitario()            { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal v)      { this.precioUnitario = v; }

    public String getUnidadMedida()                  { return unidadMedida; }
    public void setUnidadMedida(String v)            { this.unidadMedida = v; }

    public Integer getStock()                        { return stock; }
    public void setStock(Integer stock)              { this.stock = stock; }

    public String getEstado()                        { return estado; }
    public void setEstado(String estado)             { this.estado = estado; }

    public LocalDateTime getFechaRegistro()          { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime v)    { this.fechaRegistro = v; }

    public List<TransaccionDetalle> getDetalles()            { return detalles; }
    public void setDetalles(List<TransaccionDetalle> d)      { this.detalles = d; }
}