package com.financial.score.model;

import java.math.BigDecimal;

public class TransaccionDTO {

    private Long id;
    private String codigoTransaccion;
    private BigDecimal montoTotal;
    private String estadoPago;

    public TransaccionDTO(Long id, String codigoTransaccion,
                          BigDecimal montoTotal, String estadoPago) {
        this.id = id;
        this.codigoTransaccion = codigoTransaccion;
        this.montoTotal = montoTotal;
        this.estadoPago = estadoPago;
    }

    public Long getId() { return id; }
    public String getCodigoTransaccion() { return codigoTransaccion; }
    public BigDecimal getMontoTotal() { return montoTotal; }
    public String getEstadoPago() { return estadoPago; }
}