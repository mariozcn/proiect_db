package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Admission;
import com.example.proiect_db.Repository.AdmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdmissionService {
    private final AdmissionRepository admissionRepository;

    public AdmissionService(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    //GET
    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public Admission getAdmissionById(Long id) {
        return admissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));
    }

    //POST
    public Admission createAdmission(Admission admission) {
        return admissionRepository.save(admission);
    }

    //PUT
    public Admission updateAdmission(Long id, Admission admission) {
        Admission existent = admissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));
        existent.setPatient(admission.getPatient());
        existent.setRoom(admission.getRoom());
        existent.setAdmissionDate(admission.getAdmissionDate());
        existent.setDischargeDate(admission.getDischargeDate());
        existent.setReason(admission.getReason());
        existent.setStatus(admission.getStatus());
        return admissionRepository.save(existent);
    }

    //DELETE
    public void deleteAdmission(Long id) {
        Admission admission = admissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));
        admissionRepository.delete(admission);
    }
}