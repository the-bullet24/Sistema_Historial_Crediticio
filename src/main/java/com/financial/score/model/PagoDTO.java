package com.financial.score.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PagoDTO {

    private Long id;
    private LocalDate fechaPago;
    private BigDecimal monto;
    private String metodoPago;

    public PagoDTO(Long id, LocalDate fechaPago,
                   BigDecimal monto, String metodoPago) {
        this.id = id;
        this.fechaPago = fechaPago;
        this.monto = monto;
        this.metodoPago = metodoPago;
    }

    public Long getId() { return id; }
    public LocalDate getFechaPago() { return fechaPago; }
    public BigDecimal getMonto() { return monto; }
    public String getMetodoPago() { return metodoPago; }
}