import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './commonComponents/SideBar';
import ScheduleAppointmentPage from './pages/ScheduleAppointmentPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import GenerateAppointmentPage from './pages/GenerateAppointmentPage';
import AdminDoctorSchedulePage from './pages/AdminDoctorSchedulePage';
import AdminScheduleAppointmentPage from './pages/AdminScheduleAppointmentPage';
import LoginPage from './pages/loginPage';
import QueueManagementPage from './pages/QueueManagementPage';
import QueuePage from './pages/QueuePage';
import DoctorQueue from './pages/DoctorQueue';

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
        <Route path="/DoctorQueue" element={<DoctorQueue />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
