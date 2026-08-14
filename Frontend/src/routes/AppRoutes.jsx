import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import UserLayout from '../layouts/UserLayout';
import HRLayout from '../layouts/HRLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth Pages
import UserLogin from '../pages/UserLogin/UserLogin';
import UserRegister from '../pages/UserRegister/UserRegister';
import HRLogin from '../pages/HRLogin/HRLogin';
import HRRegister from '../pages/HRRegister/HRRegister';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';

// User Pages
import UserDashboard from '../pages/UserDashboard/UserDashboard';
import JobList from '../pages/JobList/JobList';
import JobDetail from '../pages/JobDetail/JobDetail';
import ApplicationHistory from '../pages/ApplicationHistory/ApplicationHistory';
import SavedJobs from '../pages/SavedJobs/SavedJobs';
import UserProfile from '../pages/UserProfile/UserProfile';
import UserSettings from '../pages/UserSettings/UserSettings';
import UserNotifications from '../pages/UserNotifications/UserNotifications';

// HR Pages
import HRDashboard from '../pages/HRDashboard/HRDashboard';
import HRJobManagement from '../pages/HRJobManagement/HRJobManagement';
import CreateJob from '../pages/CreateJob/CreateJob';
import EditJob from '../pages/EditJob/EditJob';
import HRApplicants from '../pages/HRApplicants/HRApplicants';
import HRInterviews from '../pages/HRInterviews/HRInterviews';
import HREmployees from '../pages/HREmployees/HREmployees';
import HRProfile from '../pages/HRProfile/HRProfile';
import HRSettings from '../pages/HRSettings/HRSettings';
import HRNotifications from '../pages/HRNotifications/HRNotifications';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* Candidate Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />

        {/* HR & Admin Auth Routes */}
        <Route path="/hr/login" element={<HRLogin />} />
        <Route path="/hr/register" element={<HRRegister />} />
        <Route path="/hr/forgot-password" element={<ForgotPassword />} />
        <Route path="/hr/reset-password" element={<ResetPassword />} />

        {/* Admin Alias Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<HRLogin />} />
        <Route path="/admin/register" element={<HRRegister />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Legacy Alias Routes */}
        <Route path="/hrforgot" element={<Navigate to="/hr/forgot-password" replace />} />
        <Route path="/hrlogin" element={<Navigate to="/hr/login" replace />} />
        <Route path="/hrregister" element={<Navigate to="/hr/register" replace />} />
        <Route path="/userforgot" element={<Navigate to="/user/forgot-password" replace />} />
      </Route>

      {/* Protected Candidate Routes */}
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/jobs" element={<JobList />} />
          <Route path="/user/jobs/:id" element={<JobDetail />} />
          <Route path="/user/applications" element={<ApplicationHistory />} />
          <Route path="/user/saved-jobs" element={<SavedJobs />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
        </Route>
      </Route>

      {/* Protected HR Routes */}
      <Route element={<ProtectedRoute allowedRole="hr" />}>
        <Route element={<HRLayout />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/jobs" element={<HRJobManagement />} />
          <Route path="/hr/jobs/create" element={<CreateJob />} />
          <Route path="/hr/jobs/edit/:id" element={<EditJob />} />
          <Route path="/hr/candidates" element={<HRApplicants />} />
          <Route path="/hr/interviews" element={<HRInterviews />} />
          <Route path="/hr/employees" element={<HREmployees />} />
          <Route path="/hr/profile" element={<HRProfile />} />
          <Route path="/hr/settings" element={<HRSettings />} />
          <Route path="/hr/notifications" element={<HRNotifications />} />
        </Route>
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/user/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
