import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './commonComponents/SideBar';
import ScheduleAppointmentPage from './pages/patient/ScheduleAppointmentPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import GenerateAppointmentPage from './pages/admin/GenerateAppointmentPage';
import AdminDoctorSchedulePage from './pages/admin/AdminDoctorSchedulePage';
import AdminScheduleAppointmentPage from './pages/admin/AdminScheduleAppointmentPage';
import LoginPage from './pages/loginPage';
import QueueManagementPage from './pages/admin/QueueManagementPage';
import QueuePage from './pages/patient/QueuePage';
import DoctorQueue from './pages/doctor/DoctorQueue';
import QueuePage2 from './pages/QueuePage2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/schedule-appointment" replace />} />
        <Route path="/schedule-appointment" element={<ScheduleAppointmentPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/doctor-schedule" element={<DoctorSchedulePage />} />
        <Route path="/admin-schedule-appointment" element={<AdminScheduleAppointmentPage />} />
        <Route path="/generate-appointment" element={<GenerateAppointmentPage />} />
        <Route path="/admin-doctor-schedule" element={<AdminDoctorSchedulePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/queue-management" element={<QueueManagementPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/queue2" element={<QueuePage2/>} />
        <Route path="/doctor-queue" element={<DoctorQueue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
