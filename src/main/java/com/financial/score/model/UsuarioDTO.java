package com.financial.score.model;

public class UsuarioDTO {

    private Long id;
    private String nombre;
    private String email;
    private String rol;

    public UsuarioDTO(Long id, String nombre,
                      String email, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }
}