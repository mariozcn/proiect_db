package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Patient;
import com.example.proiect_db.Repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    //GET
    public List<Patient> getAllPatients(){
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id){
        return patientRepository.findById(id).orElseThrow(()->new RuntimeException("Patient not found with id: "+ id));
    }

    //POST
    public Patient createPatient(Patient patient){
        return patientRepository.save(patient);
    }

    //PUT
    public Patient updatePatient(Long id,Patient patient){
        Patient existent = patientRepository.findById(id).orElseThrow(()->new RuntimeException("Patient not found with id: "+ id));

        existent.setFirstName(patient.getFirstName());
        existent.setLastName(patient.getLastName());
        existent.setDateOfBirth(patient.getDateOfBirth());
        existent.setPhone(patient.getPhone());
        existent.setEmail(patient.getEmail());
        existent.setAddress(patient.getAddress());
        existent.setBloodType(patient.getBloodType());
        existent.setRegistrationDate(patient.getRegistrationDate());
        existent.setGender(patient.getGender());
        return patientRepository.save(existent);
    }

    //DELETE
    public void deletePatient(Long id){
        Patient patient = patientRepository.findById(id).orElseThrow(()->new RuntimeException("Patient not found with id: "+ id));

        patientRepository.delete(patient);
    }

}
