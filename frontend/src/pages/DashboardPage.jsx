import { useState, useEffect } from 'react';
import {
  getDepartments, getDoctors, getPatients, getRooms,
  getAppointments, getMedicalRecords, getMedications,
  getAdmissions, getBills,
} from '../services/api';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '20', fontSize: '22px' }}>
      {icon}
    </div>
    <div className="stat-info">
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getDepartments(), getDoctors(), getPatients(), getRooms(),
      getAppointments(), getMedicalRecords(), getMedications(),
      getAdmissions(), getBills(),
    ]).then(results => {
      const [depts, docs, pats, rooms, appts, records, meds, admins, bills] = results;
      setCounts({
        departments:    depts.value?.data?.length,
        doctors:        docs.value?.data?.length,
        patients:       pats.value?.data?.length,
        rooms:          rooms.value?.data?.length,
        appointments:   appts.value?.data?.length,
        medicalRecords: records.value?.data?.length,
        medications:    meds.value?.data?.length,
        admissions:     admins.value?.data?.length,
        bills:          bills.value?.data?.length,
      });
      setLoading(false);
    });
  }, []);

  const stats = [
    { icon: '🏢', label: 'Departments',     key: 'departments',    color: '#2563eb' },
    { icon: '🩺', label: 'Doctors',          key: 'doctors',        color: '#16a34a' },
    { icon: '👤', label: 'Patients',         key: 'patients',       color: '#d97706' },
    { icon: '🛏',  label: 'Rooms',            key: 'rooms',          color: '#7c3aed' },
    { icon: '📅', label: 'Appointments',     key: 'appointments',   color: '#0891b2' },
    { icon: '📋', label: 'Medical Records',  key: 'medicalRecords', color: '#dc2626' },
    { icon: '💊', label: 'Medications',      key: 'medications',    color: '#16a34a' },
    { icon: '🏨', label: 'Admissions',       key: 'admissions',     color: '#d97706' },
    { icon: '💳', label: 'Bills',            key: 'bills',          color: '#2563eb' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of all hospital resources</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : (
        <div className="stats-grid">
          {stats.map(s => (
            <StatCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={counts[s.key]}
              color={s.color}
            />
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '8px' }}>Welcome to HospitalMS</h2>
        <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          Use the sidebar to navigate between modules. Each section lets you view, create, edit,
          and delete records. All data is persisted to the MySQL database via the Spring Boot API.
        </p>
      </div>
    </div>
  );
}
