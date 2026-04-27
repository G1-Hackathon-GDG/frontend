import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/driver/LoginPage";
import RegisterPage from "./pages/driver/RegisterPage";
import DashboardPage from "./pages/driver/DashboardPage";
import HistoryPage from "./pages/driver/HistoryPage";

const Admin = () => <div>Admin</div>;
const Station = () => <div>Station</div>;

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

     
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

        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

      
        <Route
          path="/station/scanner"
          element={
            <ProtectedRoute role="staff">
              <Station />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;