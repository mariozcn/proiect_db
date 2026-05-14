package com.example.proiect_db.Controller;


import com.example.proiect_db.Model.Patient;
import com.example.proiect_db.Service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    //GET
    @GetMapping()
    public List<Patient> getAllPatients(){
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id){
        return patientService.getPatientById(id);
    }

    //POST
    @PostMapping()
    public Patient createPatient(@RequestBody Patient patient){
        return patientService.createPatient(patient);
    }

    //UPDATE
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient){
        return patientService.updatePatient(id,patient);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id){
        patientService.deletePatient(id);
    }
}
