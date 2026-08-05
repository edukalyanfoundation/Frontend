import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthGuard } from './guards/AuthGuard';
import { AdminGuard } from './guards/AdminGuard';
import { PublicGuard } from './guards/PublicGuard';

// Public NGO Pages
import { LandingPage } from '../public/LandingPage';
import { CoursesPage } from '../public/CoursesPage';
import { AboutPage } from '../public/AboutPage';
import { BlogPage } from '../public/BlogPage';
import { VerifyCertificatePage } from '../public/VerifyCertificatePage';

// Auth Pages
import { Login } from '../public/Login';
import { Register } from '../public/Register';
import { ForgotPassword } from '../public/ForgotPassword';
import { ResetPassword } from '../public/ResetPassword';
import { VerifyEmail } from '../public/VerifyEmail';

// User Portal Pages
import { UserDashboard } from '../user/UserDashboard';
import { ProfilePage } from '../user/ProfilePage';
import { SettingsPage } from '../user/SettingsPage';
import { NotificationsPage } from '../user/NotificationsPage';
import { ActivityPage } from '../user/ActivityPage';

// Admin Portal Pages
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminCoursesPage } from '../admin/AdminCoursesPage';
import { AdminLoginPage } from '../admin/AdminLoginPage';
import { AdminUsersPage } from '../admin/AdminUsersPage';
import { AdminRolesPage } from '../admin/AdminRolesPage';
import { AdminAuditPage } from '../admin/AdminAuditPage';
import { AdminAnalyticsPage } from '../admin/AdminAnalyticsPage';
import { AdminStoragePage } from '../admin/AdminStoragePage';
import { AdminSettingsPage } from '../admin/AdminSettingsPage';
import { AdminUgcRegistrationsPage } from '../admin/AdminUgcRegistrationsPage';
import { AdminInquiriesPage } from '../admin/AdminInquiriesPage';

// Error Pages
import { NotFoundPage } from '../error/NotFoundPage';
import { UnauthorizedPage } from '../error/UnauthorizedPage';
import { ForbiddenPage } from '../error/ForbiddenPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public NGO Website Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />

      {/* Main App Layout for Dashboard & Auth */}
      <Route element={<MainLayout />}>
        {/* Auth Public Routes */}
        <Route
          path="login"
          element={
            <PublicGuard>
              <Login />
            </PublicGuard>
          }
        />
        <Route
          path="register"
          element={
            <PublicGuard>
              <Register />
            </PublicGuard>
          }
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />

        {/* Authenticated User Portal Routes */}
        <Route
          path="dashboard"
          element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="dashboard/settings"
          element={
            <AuthGuard>
              <SettingsPage />
            </AuthGuard>
          }
        />
        <Route
          path="dashboard/notifications"
          element={
            <AuthGuard>
              <NotificationsPage />
            </AuthGuard>
          }
        />
        <Route
          path="dashboard/activity"
          element={
            <AuthGuard>
              <ActivityPage />
            </AuthGuard>
          }
        />

        {/* Admin Portal Routes */}
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="admin/courses"
          element={
            <AdminGuard>
              <AdminCoursesPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminGuard>
              <AdminUsersPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/roles"
          element={
            <AdminGuard>
              <AdminRolesPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/audit"
          element={
            <AdminGuard>
              <AdminAuditPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/analytics"
          element={
            <AdminGuard>
              <AdminAnalyticsPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/storage"
          element={
            <AdminGuard>
              <AdminStoragePage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/ugc-registrations"
          element={
            <AdminGuard>
              <AdminUgcRegistrationsPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/inquiries"
          element={
            <AdminGuard>
              <AdminInquiriesPage />
            </AdminGuard>
          }
        />
        <Route
          path="admin/settings"
          element={
            <AdminGuard>
              <AdminSettingsPage />
            </AdminGuard>
          }
        />

        {/* Error Routes */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
};
