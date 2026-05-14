package com.example.proiect_db.Repository;

import com.example.proiect_db.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Long> {
}
