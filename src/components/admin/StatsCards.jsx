import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Card = ({ label, value, sub, color = "blue" }) => {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    red: "border-red-200 bg-red-50",
    yellow: "border-yellow-200 bg-yellow-50",
    gray: "border-gray-200 bg-gray-50",
  };
  const textColors = {
    blue: "text-blue-900",
    green: "text-green-800",
    red: "text-red-800",
    yellow: "text-yellow-800",
    gray: "text-gray-700",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
        {label}
      </p>
      <p className={`text-3xl font-black ${textColors[color]}`}>
        {value ?? "—"}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

export default function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-gray-100 p-5 h-24 animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Total Vehicles" value={stats.vehicles?.total} color="blue" />
      <Card
        label="Verified"
        value={stats.vehicles?.verified}
        color="green"
        sub={`${stats.vehicles?.unverified} pending`}
      />
      <Card label="Flagged" value={stats.vehicles?.flagged} color="red" />
      <Card
        label="Active Stations"
        value={stats.stations?.active}
        color="blue"
        sub={`of ${stats.stations?.total} total`}
      />
      <Card
        label="Vouchers Issued"
        value={stats.vouchers?.pending}
        color="yellow"
        sub="pending"
      />
      <Card label="Redeemed" value={stats.vouchers?.redeemed} color="green" />
      <Card
        label="Fuel Distributed"
        value={`${(stats.vouchers?.fuelDistributed || 0).toLocaleString()}L`}
        color="blue"
      />
      <Card
        label="Alert Level"
        value={stats.currentAlertLevel?.toUpperCase()}
        color={
          stats.currentAlertLevel === "critical"
            ? "red"
            : stats.currentAlertLevel === "warning"
              ? "yellow"
              : "green"
        }
      />
    </div>
  );
}
