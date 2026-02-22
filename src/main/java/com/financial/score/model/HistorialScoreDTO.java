package com.financial.score.model;

public class HistorialScoreDTO {

    private Long id;
    private Integer anio;
    private Integer mes;
    private Integer score;
    private String clasificacion;

    public HistorialScoreDTO(Long id, Integer anio, Integer mes,
                             Integer score, String clasificacion) {
        this.id = id;
        this.anio = anio;
        this.mes = mes;
        this.score = score;
        this.clasificacion = clasificacion;
    }

    public Long getId() { return id; }
    public Integer getAnio() { return anio; }
    public Integer getMes() { return mes; }
    public Integer getScore() { return score; }
    public String getClasificacion() { return clasificacion; }
}
