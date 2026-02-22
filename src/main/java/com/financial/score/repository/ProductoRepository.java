package com.financial.score.repository;

import com.financial.score.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEmpresaIdAndEstado(Long empresaId, String estado);
    List<Producto> findByEmpresaId(Long empresaId);
}