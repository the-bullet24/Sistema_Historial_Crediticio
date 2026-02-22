package com.financial.score.repository;

import com.financial.score.model.HistorialScoreEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialScoreRepository
        extends JpaRepository<HistorialScoreEmpresa, Long> {}
