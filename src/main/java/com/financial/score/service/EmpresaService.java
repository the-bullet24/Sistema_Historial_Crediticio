package com.financial.score.service;

import com.financial.score.model.Empresa;
import com.financial.score.repository.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    // Constructor manual
    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    // ─── Listar todas ─────────────────────────────────────────────────────────
    public List<Empresa> listarEmpresas() {
        return empresaRepository.findAll();
    }

    // ─── Guardar nueva empresa ────────────────────────────────────────────────
    public Empresa guardarEmpresa(Empresa empresa) {
        // Si no tiene fecha de registro, se asigna la fecha actual
        if (empresa.getFechaRegistro() == null) {
            empresa.setFechaRegistro(LocalDateTime.now());
        }
        // Estado por defecto si viene vacío
        if (empresa.getEstado() == null || empresa.getEstado().isBlank()) {
            empresa.setEstado("activo");
        }
        return empresaRepository.save(empresa);
    }
}