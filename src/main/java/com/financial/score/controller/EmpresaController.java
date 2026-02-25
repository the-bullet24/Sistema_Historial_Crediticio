package com.financial.score.controller;

import com.financial.score.model.Empresa;
import com.financial.score.service.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    // ─── GET /api/empresas ────────────────────────────────────────────────────
    @GetMapping
    public List<Empresa> listar() {
        return empresaService.listarEmpresas()
                .stream()
                .map(e -> {
                    Empresa emp = new Empresa();
                    emp.setId(e.getId());
                    emp.setRuc(e.getRuc());
                    emp.setRazonSocial(e.getRazonSocial());
                    emp.setDireccion(e.getDireccion());
                    emp.setRubro(e.getRubro());
                    emp.setCorreoContacto(e.getCorreoContacto());
                    emp.setTelefono(e.getTelefono());
                    emp.setFechaRegistro(e.getFechaRegistro());
                    emp.setEstado(e.getEstado());
                    return emp;
                })
                .collect(Collectors.toList());
    }

    // ─── GET /api/empresas/buscar?ruc=20123456789 ─────────────────────────────
    // Retorna: { found: true, data: {...} }  ó  { found: false }
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorRuc(@RequestParam String ruc) {
        Optional<Empresa> resultado = empresaService.buscarPorRuc(ruc);
        if (resultado.isPresent()) {
            return ResponseEntity.ok(Map.of("found", true, "data", resultado.get()));
        } else {
            return ResponseEntity.ok(Map.of("found", false));
        }
    }

    // ─── POST /api/empresas ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Empresa empresa) {
        try {
            Empresa guardada = empresaService.guardarEmpresa(empresa);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (RuntimeException ex) {
            if ("RUC_DUPLICADO".equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "El RUC ya está registrado"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al registrar la empresa"));
        }
    }
}