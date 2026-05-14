package com.example.proiect_db.Repository;

import com.example.proiect_db.Model.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdmissionRepository extends JpaRepository<Admission,Long> {
}
