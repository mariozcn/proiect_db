package com.example.proiect_db.Repository;

import com.example.proiect_db.Model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription,Long> {
}
