import axiosClient from '../api/axiosClient';

// ── Departments ────────────────────────────────────────────────────
export const getDepartments    = ()        => axiosClient.get('/departments');
export const createDepartment  = (data)    => axiosClient.post('/departments', data);
export const updateDepartment  = (id, data)=> axiosClient.put(`/departments/${id}`, data);
export const deleteDepartment  = (id)      => axiosClient.delete(`/departments/${id}`);

// ── Patients ───────────────────────────────────────────────────────
export const getPatients    = ()        => axiosClient.get('/patients');
export const createPatient  = (data)    => axiosClient.post('/patients', data);
export const updatePatient  = (id, data)=> axiosClient.put(`/patients/${id}`, data);
export const deletePatient  = (id)      => axiosClient.delete(`/patients/${id}`);

// ── Doctors ────────────────────────────────────────────────────────
export const getDoctors    = ()        => axiosClient.get('/doctors');
export const createDoctor  = (data)    => axiosClient.post('/doctors', data);
export const updateDoctor  = (id, data)=> axiosClient.put(`/doctors/${id}`, data);
export const deleteDoctor  = (id)      => axiosClient.delete(`/doctors/${id}`);

// ── Rooms ──────────────────────────────────────────────────────────
export const getRooms    = ()        => axiosClient.get('/rooms');
export const createRoom  = (data)    => axiosClient.post('/rooms', data);
export const updateRoom  = (id, data)=> axiosClient.put(`/rooms/${id}`, data);
export const deleteRoom  = (id)      => axiosClient.delete(`/rooms/${id}`);

// ── Appointments ───────────────────────────────────────────────────
export const getAppointments    = ()        => axiosClient.get('/appointments');
export const createAppointment  = (data)    => axiosClient.post('/appointments', data);
export const updateAppointment  = (id, data)=> axiosClient.put(`/appointments/${id}`, data);
export const deleteAppointment  = (id)      => axiosClient.delete(`/appointments/${id}`);

// ── Medical Records ────────────────────────────────────────────────
export const getMedicalRecords    = ()        => axiosClient.get('/medical-records');
export const createMedicalRecord  = (data)    => axiosClient.post('/medical-records', data);
export const updateMedicalRecord  = (id, data)=> axiosClient.put(`/medical-records/${id}`, data);
export const deleteMedicalRecord  = (id)      => axiosClient.delete(`/medical-records/${id}`);

// ── Medications ────────────────────────────────────────────────────
export const getMedications    = ()        => axiosClient.get('/medications');
export const createMedication  = (data)    => axiosClient.post('/medications', data);
export const updateMedication  = (id, data)=> axiosClient.put(`/medications/${id}`, data);
export const deleteMedication  = (id)      => axiosClient.delete(`/medications/${id}`);

// ── Prescriptions ──────────────────────────────────────────────────
export const getPrescriptions    = ()        => axiosClient.get('/prescriptions');
export const createPrescription  = (data)    => axiosClient.post('/prescriptions', data);
export const updatePrescription  = (id, data)=> axiosClient.put(`/prescriptions/${id}`, data);
export const deletePrescription  = (id)      => axiosClient.delete(`/prescriptions/${id}`);

// ── Admissions ─────────────────────────────────────────────────────
export const getAdmissions    = ()        => axiosClient.get('/admissions');
export const createAdmission  = (data)    => axiosClient.post('/admissions', data);
export const updateAdmission  = (id, data)=> axiosClient.put(`/admissions/${id}`, data);
export const deleteAdmission  = (id)      => axiosClient.delete(`/admissions/${id}`);

// ── Bills ──────────────────────────────────────────────────────────
export const getBills    = ()        => axiosClient.get('/bills');
export const createBill  = (data)    => axiosClient.post('/bills', data);
export const updateBill  = (id, data)=> axiosClient.put(`/bills/${id}`, data);
export const deleteBill  = (id)      => axiosClient.delete(`/bills/${id}`);
