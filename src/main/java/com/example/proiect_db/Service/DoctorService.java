package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Doctor;
import com.example.proiect_db.Repository.DepartmentRepository;
import com.example.proiect_db.Repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors(){
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id){
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        return doctor;
    }

    public Doctor createDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id,Doctor doctor){
        Doctor existent = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found with id: "+id));
        existent.setFirstName(doctor.getFirstName());
        existent.setLastName(doctor.getLastName());
        existent.setSpecialization(doctor.getSpecialization());
        existent.setLicenseNumber(doctor.getLicenseNumber());
        existent.setEmail(doctor.getEmail());
        existent.setPhone(doctor.getPhone());
        existent.setHireDate(doctor.getHireDate());
        existent.setDepartment(doctor.getDepartment());

        return doctorRepository.save(existent);
    }

    public void deleteDoctor(Long id){
        Doctor doctor = doctorRepository.findById(id).orElseThrow(()->new RuntimeException("Doctor not found with id: "+id));

        doctorRepository.delete(doctor);
    }

}
