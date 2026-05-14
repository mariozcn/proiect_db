package com.example.proiect_db.Controller;

import com.example.proiect_db.Model.MedicalRecord;
import com.example.proiect_db.Service.MedicalRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/medical-records")
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    //GET
    @GetMapping()
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordService.getAllMedicalRecords();
    }

    @GetMapping("/{id}")
    public MedicalRecord getMedicalRecordById(@PathVariable Long id) {
        return medicalRecordService.getMedicalRecordById(id);
    }

    //POST
    @PostMapping()
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.createMedicalRecord(medicalRecord);
    }

    //PUT
    @PutMapping("/{id}")
    public MedicalRecord updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.updateMedicalRecord(id, medicalRecord);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public void deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
    }
}
