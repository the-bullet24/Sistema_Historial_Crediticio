package com.financial.score.service;

import com.financial.score.model.Empresa;
import com.financial.score.repository.EmpresaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    // ─── Listar todas ─────────────────────────────────────────────────────────
    public List<Empresa> listarEmpresas() {
        return empresaRepository.findAll();
    }

    // ─── Buscar por RUC ───────────────────────────────────────────────────────
    public Optional<Empresa> buscarPorRuc(String ruc) {
        return empresaRepository.findByRuc(ruc);
    }

    // ─── Guardar nueva empresa ────────────────────────────────────────────────
    public Empresa guardarEmpresa(Empresa empresa) {
        if (empresaRepository.existsByRuc(empresa.getRuc())) {
            throw new RuntimeException("RUC_DUPLICADO");
        }
        if (empresa.getFechaRegistro() == null) {
            empresa.setFechaRegistro(LocalDateTime.now());
        }
        if (empresa.getEstado() == null || empresa.getEstado().isBlank()) {
            empresa.setEstado("activo");
        }
        return empresaRepository.save(empresa);
    }
}