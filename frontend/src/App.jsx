import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import RoomsPage from './pages/RoomsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import MedicationsPage from './pages/MedicationsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import BillsPage from './pages/BillsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="departments"     element={<DepartmentsPage />} />
          <Route path="patients"        element={<PatientsPage />} />
          <Route path="doctors"         element={<DoctorsPage />} />
          <Route path="rooms"           element={<RoomsPage />} />
          <Route path="appointments"    element={<AppointmentsPage />} />
          <Route path="medical-records" element={<MedicalRecordsPage />} />
          <Route path="medications"     element={<MedicationsPage />} />
          <Route path="prescriptions"   element={<PrescriptionsPage />} />
          <Route path="admissions"      element={<AdmissionsPage />} />
          <Route path="bills"           element={<BillsPage />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
