package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Department;
import com.example.proiect_db.Service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    //GET
    @GetMapping()
    public List<Department> getAllDepartments(){
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public Department getDepartmentById(@PathVariable Long id){
        return departmentService.getDepartmentById(id);
    }

    //POST
    @PostMapping
    public Department createDepartment(@RequestBody Department department){
        return departmentService.createDepartment(department);
    }

    //PUT
    @PutMapping("/{id}")
    public Department updateDepartment(@PathVariable Long id,@RequestBody Department department){
        return departmentService.updateDepartment(id,department);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Long id){
        departmentService.deleteDepartment(id);
    }
}
