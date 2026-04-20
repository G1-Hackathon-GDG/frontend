import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          FuelPass ⛽
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Smart fuel allocation and digital voucher system designed to ensure
          fair and transparent fuel distribution across Ethiopia.
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
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">📱 QR Vouchers</h2>
          <p className="text-gray-600">
            Receive digital fuel vouchers with QR codes for fast and secure
            station verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">🤖 AI Allocation</h2>
          <p className="text-gray-600">
            Smart AI predicts demand and allocates fuel fairly based on
            government priority tiers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">⚡ Real-time Updates</h2>
          <p className="text-gray-600">
            Get instant updates on voucher status, fuel availability, and
            station activity.
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