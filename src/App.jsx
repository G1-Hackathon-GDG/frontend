import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Login = () => <div>Login</div>;
const Driver = () => <div>Driver</div>;
const Admin = () => <div>Admin</div>;
const Station = () => <div>Station</div>;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute role="driver">
              <Driver />
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