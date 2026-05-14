package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Medication;
import com.example.proiect_db.Repository.MedicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    //GET
    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public Medication getMedicationById(Long id) {
        return medicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Medication not found with id: " + id));
    }

    //POST
    public Medication createMedication(Medication medication) {
        return medicationRepository.save(medication);
    }

    //PUT
    public Medication updateMedication(Long id, Medication medication) {
        Medication existent = medicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Medication not found with id: " + id));
        existent.setName(medication.getName());
        existent.setManufacturer(medication.getManufacturer());
        existent.setDosageForm(medication.getDosageForm());
        existent.setUnitPrice(medication.getUnitPrice());
        existent.setStockQuantity(medication.getStockQuantity());
        existent.setExpiryDate(medication.getExpiryDate());
        return medicationRepository.save(existent);
    }

    //DELETE
    public void deleteMedication(Long id) {
        Medication medication = medicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Medication not found with id: " + id));
        medicationRepository.delete(medication);
    }
}