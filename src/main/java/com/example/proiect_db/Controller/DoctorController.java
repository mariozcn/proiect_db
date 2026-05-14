package com.example.proiect_db.Controller;


import com.example.proiect_db.Model.Doctor;
import com.example.proiect_db.Service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital/doctors")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping()
    public List<Doctor> getAllDoctors(){
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable Long id){
        return doctorService.getDoctorById(id);
    }

    @PostMapping()
    public Doctor createDoctor(@RequestBody Doctor doctor){
        return doctorService.createDoctor(doctor);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable Long id,@RequestBody Doctor doctor){
        return doctorService.updateDoctor(id,doctor);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id){
        doctorService.deleteDoctor(id);
    }



}
