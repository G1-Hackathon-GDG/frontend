import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/common/Spinner"; //

export default function HomePage() {
  const [isTesting, setIsTesting] = useState(false);

  // Simulates Task 5: AI Allocation Engine delay (approx 3 seconds)
  const handleTestSpinner = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">FuelPass ⛽</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Smart fuel allocation and digital voucher system designed to ensure
          fair and transparent fuel distribution across Ethiopia[cite: 2].
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-green-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-600 transition"
          >
            Driver Portal 🚗
          </Link>
          <Link
            to="/login"
            className="bg-yellow-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-yellow-600 transition"
          >
            Station Portal ⛽
          </Link>
          <Link
            to="/login"
            className="bg-red-500 px-6 py-3 rounded-lg text-white font-semibold hover:bg-red-600 transition"
          >
            Admin Panel 👑
          </Link>
        </div>

        {/* --- SPINNER TEST SECTION ---- */}
        <div className="mt-12 p-4 border border-gray-700 rounded-lg max-w-xs mx-auto">
          <p className="text-sm text-gray-400 mb-4 font-mono">
            DEBUG: Task 3 Spinner Test
          </p>
          <button
            onClick={handleTestSpinner}
            disabled={isTesting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-3 w-full"
          >
            {isTesting ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Simulating AI...</span>
              </>
            ) : (
              "Test Loading State"
            )}
          </button>
        </div>
        {/* end of spinner test */}
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">📱 QR Vouchers</h2>
          <p className="text-gray-600">
            Receive digital fuel vouchers with QR codes for fast and secure
            station verification[cite: 37, 106].
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">🤖 AI Allocation</h2>
          <p className="text-gray-600">
            Smart AI predicts demand and allocates fuel fairly based on
            government priority tiers[cite: 49, 52].
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">⚡ Real-time Updates</h2>
          <p className="text-gray-600">
            Get instant updates on voucher status, fuel availability, and
            station activity via Socket.io[cite: 66, 93].
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>© 2026 FuelPass. All rights reserved.</p>
      </footer>
    </div>
  );
}
