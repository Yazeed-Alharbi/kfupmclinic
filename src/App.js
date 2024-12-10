import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import AdminQueuePage from './pages/admin/AllDoctorsQueue';
import KioskCheckIn from './pages/patient/KioskCheckIn'; // Import the new KioskCheckIn component
import DashboardPage from './pages/admin/DashboardPage';

// Wrapper for public routes
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Check if user exists in localStorage
  if (user) {
    // Redirect logged-in users to their specific dashboard
    if (user.type === 'Patient') return <Navigate to="/schedule-appointment" replace />;
    if (user.type === 'Doctor') return <Navigate to="/doctor-schedule" replace />;
    if (user.type === 'Receptionist') return <Navigate to="/admin-schedule-appointment" replace />;
  }
  return children; // Render the component if no user is logged in
};

// Wrapper for protected routes
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Check user in localStorage

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
    // If user role is not allowed, show an error or redirect
    return <Navigate to="/error" replace />;
  }

  return children; // Render the component if authenticated and role is allowed
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/queue2" element={<QueuePage2 />} />
        <Route path="/kioskcheckin" element={<KioskCheckIn />} /> {/* Public route accessible by everyone */}

        {/* Error page for unauthorized access */}
        <Route path="/error" element={<div>Unauthorized Access</div>} />

        {/* Protected routes with role-based access control */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/schedule-appointment" replace />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule-appointment"
          element={
            <PrivateRoute allowedRoles={['Patient']}>
              <ScheduleAppointmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute allowedRoles={['Patient']}>
              <AppointmentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-schedule"
          element={
            <PrivateRoute allowedRoles={['Doctor']}>
              <DoctorSchedulePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-schedule-appointment"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <AdminScheduleAppointmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <DashboardPage/>
            </PrivateRoute>
          }
        />
        <Route
          path="/generate-appointment"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <GenerateAppointmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-doctor-schedule"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <AdminDoctorSchedulePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/queue-management"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <QueueManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/queue"
          element={
            <PrivateRoute allowedRoles={['Patient']}>
              <QueuePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-queue"
          element={
            <PrivateRoute allowedRoles={['Doctor']}>
              <DoctorQueue />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-queue"
          element={
            <PrivateRoute allowedRoles={['Receptionist']}>
              <AdminQueuePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
