package com.financial.score.service;

import com.financial.score.model.Transaccion;
import com.financial.score.repository.TransaccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransaccionService {

    private final TransaccionRepository repository;

    public TransaccionService(TransaccionRepository repository) {
        this.repository = repository;
    }

    public List<Transaccion> listar() {
        return repository.findAll();
    }
}