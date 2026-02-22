package com.financial.score.controller;

import com.financial.score.model.Empresa;
import com.financial.score.model.Producto;
import com.financial.score.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // GET /api/productos/empresa/{empresaId}
    // Devuelve productos activos de una empresa (para el formulario de transacción)
    @GetMapping("/empresa/{empresaId}")
    public List<Producto> listarPorEmpresa(@PathVariable Long empresaId) {
        return productoService.listarPorEmpresa(empresaId);
    }

    // POST /api/productos
    // Registrar nuevo producto
    @PostMapping
    public ResponseEntity<Producto> registrar(@RequestBody Producto producto,
                                              @RequestParam Long empresaId) {
        Empresa empresa = new Empresa();
        empresa.setId(empresaId);
        producto.setEmpresa(empresa);
        return ResponseEntity.ok(productoService.guardar(producto));
    }
}