package com.financial.score.controller;

import com.financial.score.model.TransaccionDTO;
import com.financial.score.service.TransaccionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final TransaccionService service;

    public TransaccionController(TransaccionService service) {
        this.service = service;
    }

    @GetMapping
    public List<TransaccionDTO> listar() {

        return service.listar()
                .stream()
                .map(t -> new TransaccionDTO(
                        t.getId(),
                        t.getCodigoTransaccion(),
                        t.getMontoTotal(),
                        t.getEstadoPago()
                ))
                .toList();
    }
}
