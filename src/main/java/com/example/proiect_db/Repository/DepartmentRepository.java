package com.example.proiect_db.Repository;

import com.example.proiect_db.Model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
}
