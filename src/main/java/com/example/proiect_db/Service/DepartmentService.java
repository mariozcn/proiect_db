package com.example.proiect_db.Service;


import com.example.proiect_db.Model.Department;
import com.example.proiect_db.Repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }


    //GET
    public List<Department> getAllDepartments(){
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id){
        return departmentRepository.findById(id).orElseThrow(()->new RuntimeException("Department with id not found: "+id));
    }


    //POST
    public Department createDepartment(Department department){
        return departmentRepository.save(department);
    }


    //PUT
    public Department updateDepartment(Long id,Department department){
        Department existent = departmentRepository.findById(id).orElseThrow(()->new RuntimeException("Department with id not found: "+id));
        existent.setName(department.getName());
        existent.setDescription(department.getDescription());
        existent.setLocation(department.getLocation());
        existent.setPhone(department.getPhone());
        existent.setCreatedAt(department.getCreatedAt());

        return departmentRepository.save(existent);
    }

    //DELETE
    public void deleteDepartment(Long id){
        Department department = departmentRepository.findById(id).orElseThrow(()->new RuntimeException("Department with id not found: "+id));
        departmentRepository.delete(department);
    }
}
