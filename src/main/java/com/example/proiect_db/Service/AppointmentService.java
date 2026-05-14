package com.example.proiect_db.Service;

import com.example.proiect_db.Model.Appointment;
import com.example.proiect_db.Repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    //GET
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    //POST
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    //PUT
    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existent = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        existent.setPatient(appointment.getPatient());
        existent.setDoctor(appointment.getDoctor());
        existent.setAppointmentDate(appointment.getAppointmentDate());
        existent.setStatus(appointment.getStatus());
        existent.setReason(appointment.getReason());
        existent.setNotes(appointment.getNotes());
        return appointmentRepository.save(existent);
    }

    //DELETE
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        appointmentRepository.delete(appointment);
    }
}