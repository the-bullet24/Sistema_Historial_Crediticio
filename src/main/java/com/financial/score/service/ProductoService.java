package com.financial.score.service;

import com.financial.score.model.Producto;
import com.financial.score.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Listar productos activos de una empresa
    public List<Producto> listarPorEmpresa(Long empresaId) {
        return productoRepository.findByEmpresaIdAndEstado(empresaId, "activo");
    }

    // Listar todos los productos de una empresa (activos e inactivos)
    public List<Producto> listarTodosPorEmpresa(Long empresaId) {
        return productoRepository.findByEmpresaId(empresaId);
    }

    // Guardar producto nuevo
    public Producto guardar(Producto producto) {
        if (producto.getFechaRegistro() == null) {
            producto.setFechaRegistro(LocalDateTime.now());
        }
        if (producto.getEstado() == null || producto.getEstado().isBlank()) {
            producto.setEstado("activo");
        }
        if (producto.getStock() == null) {
            producto.setStock(0);
        }
        return productoRepository.save(producto);
    }

    // Buscar por id
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id).orElse(null);
    }
}