import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    plate: "",
    vehicleType: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);

      setSuccess("Registered successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Fraud or invalid data");
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

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              placeholder="Enter full name"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              name="phone"
              placeholder="Enter phone number"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">License Plate</label>
            <input
              name="plate"
              placeholder="Enter plate number"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Vehicle Type</label>
            <select
              name="vehicleType"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Select Vehicle Type</option>
              <option>Private Car</option>
              <option>Taxi</option>
              <option>Bus</option>
              <option>Truck</option>
              <option>Motorcycle</option>
              <option>Government</option>
              <option>Emergency</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-900 font-semibold hover:underline">
            Login
          </Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-6">
          Join FuelPass system for fair fuel distribution
        </p>

      </div>
    </div>
  );
}