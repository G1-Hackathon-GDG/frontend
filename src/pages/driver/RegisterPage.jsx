import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    plate: "",
    vehicleType: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      setSuccess(res.data?.message || "Registered successfully!");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed"
      );
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border-t-4 border-blue-900">

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Driver Registration
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Create your FuelPass account
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <input
            name="plate"
            placeholder="Plate Number"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <select
            name="vehicleType"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Vehicle Type</option>
            <option>Private Car</option>
            <option>Taxi</option>
            <option>Bus</option>
            <option>Truck</option>
            <option>Motorcycle</option>
            <option>Government</option>
            <option>Emergency</option>
            <option>Other</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-blue-900 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}