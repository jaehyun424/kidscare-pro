// ============================================
// KidsCare Pro - Main App Router
// ============================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { HotelLayout } from './components/layout/HotelLayout';
import { ParentLayout } from './components/layout/ParentLayout';
import { SitterLayout } from './components/layout/SitterLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import './index.css';

// ----------------------------------------
// Lazy-loaded Pages
// ----------------------------------------
// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Hotel Console
const HotelDashboard = lazy(() => import('./pages/hotel/Dashboard'));
const HotelBookings = lazy(() => import('./pages/hotel/Bookings'));
const HotelLiveMonitor = lazy(() => import('./pages/hotel/LiveMonitor'));
const HotelSitters = lazy(() => import('./pages/hotel/SitterManagement'));
const HotelReports = lazy(() => import('./pages/hotel/Reports'));
const HotelSafety = lazy(() => import('./pages/hotel/SafetyDashboard'));
const HotelSettings = lazy(() => import('./pages/hotel/Settings'));

// Parent App
const ParentHome = lazy(() => import('./pages/parent/Home'));
const ParentBooking = lazy(() => import('./pages/parent/Booking'));
const ParentTrustCheckIn = lazy(() => import('./pages/parent/TrustCheckIn'));
const ParentLiveStatus = lazy(() => import('./pages/parent/LiveStatus'));
const ParentHistory = lazy(() => import('./pages/parent/History'));
const ParentProfile = lazy(() => import('./pages/parent/Profile'));

// Sitter App
const SitterSchedule = lazy(() => import('./pages/sitter/Schedule'));
const SitterActiveSession = lazy(() => import('./pages/sitter/ActiveSession'));
const SitterEarnings = lazy(() => import('./pages/sitter/Earnings'));
const SitterProfile = lazy(() => import('./pages/sitter/Profile'));

// ----------------------------------------
// Loading Spinner
// ----------------------------------------
function PageLoader() {
  return (
    <div className="page-spinner">
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );
}

// ----------------------------------------
// Protected Route
// ----------------------------------------
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('parent' | 'sitter' | 'hotel_staff' | 'admin')[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects: Record<string, string> = {
      hotel_staff: '/hotel',
      admin: '/hotel',
      parent: '/parent',
      sitter: '/sitter',
    };
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  return <>{children}</>;
}

// ----------------------------------------
// App Routes
// ----------------------------------------
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Hotel Console Routes */}
        <Route
          path="/hotel"
          element={
            <ProtectedRoute allowedRoles={['hotel_staff', 'admin']}>
              <HotelLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HotelDashboard />} />
          <Route path="bookings" element={<HotelBookings />} />
          <Route path="live" element={<HotelLiveMonitor />} />
          <Route path="sitters" element={<HotelSitters />} />
          <Route path="reports" element={<HotelReports />} />
          <Route path="safety" element={<HotelSafety />} />
          <Route path="settings" element={<HotelSettings />} />
        </Route>

        {/* Parent App Routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParentHome />} />
          <Route path="book" element={<ParentBooking />} />
          <Route path="trust-checkin/:bookingId" element={<ParentTrustCheckIn />} />
          <Route path="live/:bookingId" element={<ParentLiveStatus />} />
          <Route path="history" element={<ParentHistory />} />
          <Route path="profile" element={<ParentProfile />} />
        </Route>

        {/* Sitter App Routes */}
        <Route
          path="/sitter"
          element={
            <ProtectedRoute allowedRoles={['sitter']}>
              <SitterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SitterSchedule />} />
          <Route path="active" element={<SitterActiveSession />} />
          <Route path="earnings" element={<SitterEarnings />} />
          <Route path="profile" element={<SitterProfile />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

// ----------------------------------------
// Main App Component
// ----------------------------------------
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
