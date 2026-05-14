package com.example.proiect_db.Repository;

import com.example.proiect_db.Model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicationRepository extends JpaRepository<Medication,Long> {
}
