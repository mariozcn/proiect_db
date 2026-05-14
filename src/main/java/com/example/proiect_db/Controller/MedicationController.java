package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Medication;
import com.example.proiect_db.Service.MedicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/medications")
public class MedicationController {
    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    //GET
    @GetMapping()
    public List<Medication> getAllMedications() {
        return medicationService.getAllMedications();
    }

    @GetMapping("/{id}")
    public Medication getMedicationById(@PathVariable Long id) {
        return medicationService.getMedicationById(id);
    }

    //POST
    @PostMapping()
    public Medication createMedication(@RequestBody Medication medication) {
        return medicationService.createMedication(medication);
    }

    //PUT
    @PutMapping("/{id}")
    public Medication updateMedication(@PathVariable Long id, @RequestBody Medication medication) {
        return medicationService.updateMedication(id, medication);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
    }
}
