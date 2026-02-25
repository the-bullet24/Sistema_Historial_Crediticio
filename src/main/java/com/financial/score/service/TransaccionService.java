package com.financial.score.service;

import com.financial.score.model.Producto;
import com.financial.score.model.Transaccion;
import com.financial.score.model.TransaccionDetalle;
import com.financial.score.repository.ProductoRepository;
import com.financial.score.repository.TransaccionDetalleRepository;
import com.financial.score.repository.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransaccionService {

    private final TransaccionRepository repository;
    private final ProductoRepository productoRepository;
    private final TransaccionDetalleRepository detalleRepository;

    // Inyectamos los nuevos repositorios necesarios
    public TransaccionService(TransaccionRepository repository,
                              ProductoRepository productoRepository,
                              TransaccionDetalleRepository detalleRepository) {
        this.repository = repository;
        this.productoRepository = productoRepository;
        this.detalleRepository = detalleRepository;
    }

    public List<Transaccion> listar() {
        return repository.findAll();
    }


}