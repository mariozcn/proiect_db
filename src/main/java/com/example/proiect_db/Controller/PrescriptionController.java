package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.Prescription;
import com.example.proiect_db.Service.PrescriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/prescriptions")
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    //GET
    @GetMapping()
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }

    //POST
    @PostMapping()
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }

    //PUT
    @PutMapping("/{id}")
    public Prescription updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        return prescriptionService.updatePrescription(id, prescription);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
    }
}
