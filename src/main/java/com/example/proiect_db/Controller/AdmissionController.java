package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Admission;
import com.example.proiect_db.Service.AdmissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/admissions")
public class AdmissionController {
    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    //GET
    @GetMapping()
    public List<Admission> getAllAdmissions() {
        return admissionService.getAllAdmissions();
    }

    @GetMapping("/{id}")
    public Admission getAdmissionById(@PathVariable Long id) {
        return admissionService.getAdmissionById(id);
    }

    //POST
    @PostMapping()
    public Admission createAdmission(@RequestBody Admission admission) {
        return admissionService.createAdmission(admission);
    }

    //PUT
    @PutMapping("/{id}")
    public Admission updateAdmission(@PathVariable Long id, @RequestBody Admission admission) {
        return admissionService.updateAdmission(id, admission);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteAdmission(@PathVariable Long id) {
        admissionService.deleteAdmission(id);
    }
}
