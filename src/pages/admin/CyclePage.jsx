import { useState, useEffect } from "react";
import { cycleApi } from "../../api/cycleApi";

export default function CyclePage() {
  const [active, setActive] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    totalFuelAvailable: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [activeRes, allRes] = await Promise.allSettled([
        cycleApi.getActive(),
        cycleApi.getAll(),
      ]);
      if (activeRes.status === "fulfilled")
        setActive(activeRes.value.data.cycle || activeRes.value.data);
      if (allRes.status === "fulfilled") setAll(allRes.value.data.cycles || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cycleApi.create({
        ...form,
        totalFuelAvailable: Number(form.totalFuelAvailable),
      });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create cycle.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = async (id) => {
    await cycleApi.close(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Distribution Cycles
            </h1>
            <p className="text-gray-500 mt-1">Manage fuel allocation cycles</p>
          </div>
          {!active && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition text-sm"
            >
              + New Cycle
            </button>
          )}
        </div>

        {/* Active cycle card */}
        {active && (
          <div className="bg-blue-900 text-white rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">
                  Active Cycle
                </p>
                <h2 className="text-2xl font-bold">
                  Cycle #{active.cycleNumber}
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {new Date(active.startDate).toLocaleDateString()} →{" "}
                  {new Date(active.endDate).toLocaleDateString()}
                </p>
                <p className="text-blue-100 font-semibold mt-2">
                  {active.totalFuelAvailable?.toLocaleString()}L available
                </p>
              </div>
              <button
                onClick={() => close(active._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition text-sm"
              >
                Close Cycle
              </button>
            </div>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={create}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 space-y-4"
          >
            <h3 className="font-bold text-gray-800">New Cycle</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Total Fuel Available (Liters)
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  type="number"
                  placeholder="e.g. 90000"
                  value={form.totalFuelAvailable}
                  onChange={(e) =>
                    setForm({ ...form, totalFuelAvailable: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Cycle"}
              </button>
            </div>
          </form>
        )}

        {/* All cycles */}
        {!loading && all.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              All Cycles
            </h2>
            {all.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-900">
                  #{c.cycleNumber}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {new Date(c.startDate).toLocaleDateString()} →{" "}
                    {new Date(c.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {c.totalFuelAvailable?.toLocaleString()}L
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
