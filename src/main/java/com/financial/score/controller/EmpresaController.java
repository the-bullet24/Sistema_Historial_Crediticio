package com.financial.score.controller;

import com.financial.score.model.Empresa;
import com.financial.score.service.EmpresaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping
    public List<Empresa> listar() {
        return empresaService.listarEmpresas()
                .stream()
                .map(e -> {
                    Empresa empresa = new Empresa();
                    empresa.setId(e.getId());
                    empresa.setRuc(e.getRuc());
                    empresa.setRazonSocial(e.getRazonSocial());
                    empresa.setDireccion(e.getDireccion());
                    empresa.setRubro(e.getRubro());
                    empresa.setCorreoContacto(e.getCorreoContacto());
                    empresa.setTelefono(e.getTelefono());
                    empresa.setFechaRegistro(e.getFechaRegistro());
                    empresa.setEstado(e.getEstado());
                    return empresa;
                })
                .collect(Collectors.toList());
    }

    @PostMapping
    public Empresa registrar(@RequestBody Empresa empresa) {
        return empresaService.guardarEmpresa(empresa);
    }
}