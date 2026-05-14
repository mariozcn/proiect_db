package com.example.proiect_db.Service;

import com.example.proiect_db.Model.MedicalRecord;
import com.example.proiect_db.Repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    //GET
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id).orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }

    //POST
    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    //PUT
    public MedicalRecord updateMedicalRecord(Long id, MedicalRecord medicalRecord) {
        MedicalRecord existent = medicalRecordRepository.findById(id).orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
        existent.setPatient(medicalRecord.getPatient());
        existent.setDoctor(medicalRecord.getDoctor());
        existent.setRecordDate(medicalRecord.getRecordDate());
        existent.setDiagnosis(medicalRecord.getDiagnosis());
        existent.setTreatment(medicalRecord.getTreatment());
        existent.setNotes(medicalRecord.getNotes());
        return medicalRecordRepository.save(existent);
    }

    //DELETE
    public void deleteMedicalRecord(Long id) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id).orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
        medicalRecordRepository.delete(medicalRecord);
    }
}