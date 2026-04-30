import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

import LoginPage from "./pages/driver/LoginPage";
import RegisterPage from "./pages/driver/RegisterPage";
import DashboardPage from "./pages/driver/DashboardPage";
import HistoryPage from "./pages/driver/HistoryPage";
import HomePage from "./pages/HomePage";

// Lazy load all other pages
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage"));
const VehiclesPage = lazy(() => import("./pages/admin/VehiclesPage"));
const StationsPage = lazy(() => import("./pages/admin/StationsPage"));
const VouchersPage = lazy(() => import("./pages/admin/VouchersPage"));
const CyclePage = lazy(() => import("./pages/admin/CyclePage"));
const AIPage = lazy(() => import("./pages/admin/AIPage"));
const AILogsPage = lazy(() => import("./pages/admin/AILogsPage"));
const StationLoginPage = lazy(() => import("./pages/station/StationLoginPage"));
const ScannerPage = lazy(() => import("./pages/station/ScannerPage"));
const TodayLogPage = lazy(() => import("./pages/station/TodayLogPage"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
  </div>
);

function Guarded({ roles, children }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/station/login" element={<StationLoginPage />} />

          {/* Driver */}
          <Route
            path="/driver/dashboard"
            element={
              <Guarded roles={["driver"]}>
                <DashboardPage />
              </Guarded>
            }
          />
          <Route
            path="/driver/history"
            element={
              <Guarded roles={["driver"]}>
                <HistoryPage />
              </Guarded>
            }
          />

          {/* Station Staff */}
          <Route
            path="/station/scanner"
            element={
              <Guarded roles={["staff", "admin"]}>
                <ScannerPage />
              </Guarded>
            }
          />
          <Route
            path="/station/log"
            element={
              <Guarded roles={["staff", "admin"]}>
                <TodayLogPage />
              </Guarded>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <Guarded roles={["admin"]}>
                <AdminDashboard />
              </Guarded>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <Guarded roles={["admin"]}>
                <VehiclesPage />
              </Guarded>
            }
          />
          <Route
            path="/admin/stations"
            element={
              <Guarded roles={["admin"]}>
                <StationsPage />
              </Guarded>
            }
          />
          <Route
            path="/admin/vouchers"
            element={
              <Guarded roles={["admin"]}>
                <VouchersPage />
              </Guarded>
            }
          />
          <Route
            path="/admin/cycles"
            element={
              <Guarded roles={["admin"]}>
                <CyclePage />
              </Guarded>
            }
          />
          <Route
            path="/admin/ai"
            element={
              <Guarded roles={["admin"]}>
                <AIPage />
              </Guarded>
            }
          />
          <Route
            path="/admin/ai/logs"
            element={
              <Guarded roles={["admin"]}>
                <AILogsPage />
              </Guarded>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
