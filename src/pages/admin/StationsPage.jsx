import { useState, useEffect } from "react";
import { stationApi } from "../../api/stationApi";
import FuelGauge from "../../components/station/FuelGauge";

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    city: "",
    location: "",
    currentFuelLiters: 0,
    dailyCapacity: 10000,
    slotsPerHour: 30,
  });
  const [fuelModal, setFuelModal] = useState(null);
  const [fuelInput, setFuelInput] = useState("");

  const load = async () => {
    try {
      const { data } = await stationApi.getAll();
      setStations(data.stations || []);
    } catch (err) {
      console.error("Failed to load stations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addStation = async (e) => {
    e.preventDefault();
    await stationApi.create({
      ...addForm,
      currentFuelLiters: Number(addForm.currentFuelLiters),
      dailyCapacity: Number(addForm.dailyCapacity),
      slotsPerHour: Number(addForm.slotsPerHour),
    });
    setShowAdd(false);
    load();
  };

  const updateFuel = async () => {
    if (!fuelModal) return;
    await stationApi.updateFuel(fuelModal._id, {
      operation: "increment",
      liters: Number(fuelInput),
    });
    setFuelModal(null);
    setFuelInput("");
    load();
  };

  const toggle = async (id) => {
    await stationApi.toggle(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stations</h1>
            <p className="text-gray-500 mt-1">{stations.length} total</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition text-sm"
          >
            + Add Station
          </button>
        </div>

        {showAdd && (
          <form
            onSubmit={addStation}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 grid grid-cols-2 gap-4"
          >
            <h3 className="col-span-2 font-bold text-gray-800">New Station</h3>
            {[
              ["name", "Station name"],
              ["city", "City"],
              ["location", "Location"],
              ["dailyCapacity", "Daily capacity (L)"],
              ["slotsPerHour", "Slots per hour"],
              ["currentFuelLiters", "Initial fuel (L)"],
            ].map(([field, ph]) => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1 capitalize">
                  {ph}
                </label>
                <input
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value={addForm[field]}
                  onChange={(e) =>
                    setAddForm({ ...addForm, [field]: e.target.value })
                  }
                  placeholder={ph}
                  required
                />
              </div>
            ))}
            <div className="col-span-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
              >
                Create Station
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {stations.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {s.city} {s.location && `· ${s.location}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFuelModal(s);
                        setFuelInput("");
                      }}
                      className="text-xs px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg font-semibold hover:bg-blue-200 transition"
                    >
                      Update Fuel
                    </button>
                    <button
                      onClick={() => toggle(s._id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${s.isActive ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      {s.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
                <FuelGauge
                  current={s.currentFuelLiters}
                  capacity={s.dailyCapacity}
                  label="Fuel Level"
                />
                <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-400">Slots/hr</p>
                    <p className="font-bold text-gray-800">{s.slotsPerHour}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-400">Hours</p>
                    <p className="font-bold text-gray-800">
                      {s.operatingHours?.open}–{s.operatingHours?.close}
                    </p>
                  </div>
                  <div
                    className={`rounded-xl p-2.5 ${s.isActive ? "bg-green-50" : "bg-red-50"}`}
                  >
                    <p className="text-xs text-gray-400">Status</p>
                    <p
                      className={`font-bold text-sm ${s.isActive ? "text-green-700" : "text-red-700"}`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {fuelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-1">Update Fuel</h3>
            <p className="text-gray-500 text-sm mb-4">{fuelModal.name}</p>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              type="number"
              placeholder="Liters to add"
              value={fuelInput}
              onChange={(e) => setFuelInput(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setFuelModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={updateFuel}
                className="flex-1 py-2.5 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
              >
                Add Fuel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
