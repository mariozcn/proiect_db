package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Prescription;
import com.example.proiect_db.Repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    //GET
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
    }

    //POST
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    //PUT
    public Prescription updatePrescription(Long id, Prescription prescription) {
        Prescription existent = prescriptionRepository.findById(id).orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        existent.setMedicalRecord(prescription.getMedicalRecord());
        existent.setMedication(prescription.getMedication());
        existent.setDosage(prescription.getDosage());
        existent.setFrequency(prescription.getFrequency());
        existent.setDurationDays(prescription.getDurationDays());
        existent.setInstructions(prescription.getInstructions());
        return prescriptionRepository.save(existent);
    }

    //DELETE
    public void deletePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id).orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        prescriptionRepository.delete(prescription);
    }
}