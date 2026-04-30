import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/driver/LoginPage";
import RegisterPage from "./pages/driver/RegisterPage";
import DashboardPage from "./pages/driver/DashboardPage";
import HistoryPage from "./pages/driver/HistoryPage";

import ScannerPage from "./pages/station/ScannerPage";
import TodayLogPage from "./pages/station/TodayLogPage";

const Admin = () => <div>Admin</div>;

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute role="driver">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver/history"
          element={
            <ProtectedRoute role="driver">
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Station Staff Routes */}
        <Route
          path="/station/scanner"
          element={
            <ProtectedRoute role="staff">
              <ScannerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/station/logs"
          element={
            <ProtectedRoute role="staff">
              <TodayLogPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;