import { useVoucher } from "../../hooks/useVoucher";

export default function DashboardPage() {
  const { vouchers } = useVoucher();

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
        Driver Dashboard
      </h2>

      {vouchers.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No vouchers yet 🚫
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {vouchers.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-900 hover:shadow-lg transition"
            >
              <p className="font-semibold text-lg text-gray-800">
                Station: {v.station}
              </p>

              <p className="text-gray-600 mt-2">
                Fuel: <span className="font-medium">{v.liters} L</span>
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-medium ${
                  v.status === "issued"
                    ? "bg-green-100 text-green-700"
                    : v.status === "used"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {v.status}
              </span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}